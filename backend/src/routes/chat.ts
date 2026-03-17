import { Hono } from "hono";
import OpenAI from "openai";
import prisma from "../db";
import { ChatMessageSchema } from "../types";

const chatRouter = new Hono();

// Get conversation history
chatRouter.get("/history", async (c) => {
  try {
    const sessionId = c.req.query("sessionId") || "default";

    const conversations = await prisma.aiConversation.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
    });

    return c.json({ data: conversations });
  } catch (error) {
    console.error("Chat history error:", error);
    return c.json({ error: { message: "Failed to fetch chat history", code: "HISTORY_ERROR" } }, 500);
  }
});

// Send message to AI
chatRouter.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = ChatMessageSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: { message: "Invalid request body", code: "VALIDATION_ERROR" } }, 400);
    }

    const { message, problemId, sessionId = "default" } = parsed.data;

    // Save user message
    await prisma.aiConversation.create({
      data: {
        message,
        role: "user",
        problemId: problemId || null,
        sessionId,
      },
    });

    // Build context from user's DSA progress
    const solvedProblems = await prisma.dsaProblem.findMany({
      where: { status: "Solved" },
      orderBy: { dateSolved: "desc" },
    });

    const problemList = solvedProblems
      .map(
        (p) =>
          `- ${p.name} (${p.pattern}, ${p.difficulty}, Confidence: ${p.confidence}/5)${p.weakPoints ? ` | Weak points: ${p.weakPoints}` : ""}`
      )
      .join("\n");

    const systemPrompt = `You are an expert DSA coding mentor resuming a student's preparation journey. They have solved ${solvedProblems.length} problems so far.

SOLVED PROBLEMS AND WEAK POINTS:
${problemList}

TEACHING RULES:
1. NEVER give full solutions immediately
2. Ask "What pattern do you think fits?" first
3. Reference their specific weak points when relevant
4. Use the Socratic method - guide through questions
5. When they solve a problem, generate structured notes in this format:
   Problem Name | Pattern | Core Idea | Key Line | Edge Case | Time/Space | Weak Point
6. Suggest the next logical problem based on their progress
7. Be encouraging but honest about areas that need work`;

    // Get conversation history for context
    const history = await prisma.aiConversation.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
      take: 20, // Last 20 messages for context
    });

    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemPrompt },
      ...history.map((h) => ({
        role: h.role as "user" | "assistant",
        content: h.message,
      })),
    ];

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      // Save a fallback response
      const fallbackMessage =
        "AI mentoring is currently unavailable (OPENAI_API_KEY not configured). Please set the OPENAI_API_KEY environment variable to enable AI chat.";

      const assistantConvo = await prisma.aiConversation.create({
        data: {
          message: fallbackMessage,
          role: "assistant",
          problemId: problemId || null,
          sessionId,
        },
      });

      return c.json({ data: assistantConvo });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const assistantMessage = completion.choices[0]?.message?.content || "I apologize, I could not generate a response.";

    // Save assistant response
    const assistantConvo = await prisma.aiConversation.create({
      data: {
        message: assistantMessage,
        role: "assistant",
        problemId: problemId || null,
        sessionId,
      },
    });

    return c.json({ data: assistantConvo });
  } catch (error) {
    console.error("Chat error:", error);
    return c.json({ error: { message: "Failed to process chat message", code: "CHAT_ERROR" } }, 500);
  }
});

// Clear conversation history
chatRouter.delete("/history", async (c) => {
  try {
    const sessionId = c.req.query("sessionId") || "default";

    await prisma.aiConversation.deleteMany({
      where: { sessionId },
    });

    return c.json({ data: { success: true } });
  } catch (error) {
    console.error("Clear history error:", error);
    return c.json({ error: { message: "Failed to clear chat history", code: "CLEAR_ERROR" } }, 500);
  }
});

export { chatRouter };
