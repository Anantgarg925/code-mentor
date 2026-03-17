import { Hono } from "hono";
import OpenAI from "openai";
import prisma from "../db";
import { ChatMessageSchema } from "../types";

const chatRouter = new Hono();

// ---------------------------------------------------------------------------
// OpenAI tool definitions – gives the AI read/write access to all user data
// ---------------------------------------------------------------------------

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "create_daily_task",
      description: "Create a new daily task for the user",
      parameters: {
        type: "object",
        properties: {
          date: { type: "string", description: "Date in YYYY-MM-DD format" },
          type: { type: "string", enum: ["dsa_new", "dsa_revision", "project", "core_subjects"], description: "Task type" },
          title: { type: "string", description: "Task title" },
          priority: { type: "number", description: "Priority (1=highest)" },
        },
        required: ["date", "type", "title"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "complete_daily_task",
      description: "Mark a daily task as completed",
      parameters: {
        type: "object",
        properties: {
          taskId: { type: "string", description: "The task ID to complete" },
        },
        required: ["taskId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_problem",
      description: "Update a DSA problem's status, confidence, notes, or weak points",
      parameters: {
        type: "object",
        properties: {
          problemId: { type: "string", description: "The problem ID" },
          status: { type: "string", enum: ["NotStarted", "Solving", "Solved", "Revision"] },
          confidence: { type: "number", description: "Confidence 1-5" },
          notes: { type: "string" },
          weakPoints: { type: "string" },
          coreIdea: { type: "string" },
          keyLine: { type: "string" },
          edgeCase: { type: "string" },
          timeSpace: { type: "string" },
        },
        required: ["problemId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_problem",
      description: "Add a new DSA problem to the tracker",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Problem name" },
          pattern: { type: "string", description: "Pattern category" },
          difficulty: { type: "string", enum: ["Easy", "Medium", "Hard"] },
          status: { type: "string", enum: ["NotStarted", "Solving", "Solved", "Revision"] },
          confidence: { type: "number" },
          weakPoints: { type: "string" },
          coreIdea: { type: "string" },
          keyLine: { type: "string" },
          edgeCase: { type: "string" },
          timeSpace: { type: "string" },
          leetcodeNum: { type: "number" },
        },
        required: ["name", "pattern", "difficulty"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_rakshak_task",
      description: "Add a new task to the Rakshak project board",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          category: { type: "string", enum: ["backend", "android", "architecture", "docs"] },
          status: { type: "string", enum: ["todo", "in_progress", "done"] },
          priority: { type: "number" },
          details: { type: "string" },
        },
        required: ["title", "category"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_rakshak_task",
      description: "Update a Rakshak project task's status or details",
      parameters: {
        type: "object",
        properties: {
          taskId: { type: "string", description: "The task ID" },
          status: { type: "string", enum: ["todo", "in_progress", "done"] },
          title: { type: "string" },
          priority: { type: "number" },
          details: { type: "string" },
        },
        required: ["taskId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_subject_topic",
      description: "Update a core subject topic's progress or completion",
      parameters: {
        type: "object",
        properties: {
          topicId: { type: "string", description: "The topic ID" },
          completed: { type: "boolean" },
          progress: { type: "number", description: "Progress 0-100" },
          notes: { type: "string" },
        },
        required: ["topicId"],
      },
    },
  },
];

// ---------------------------------------------------------------------------
// Tool execution – runs the Prisma mutation that corresponds to a tool call
// ---------------------------------------------------------------------------

async function executeTool(name: string, args: Record<string, unknown>): Promise<string> {
  console.log("[AI Action]", name, args);

  try {
    switch (name) {
      case "create_daily_task": {
        const task = await prisma.dailyTask.create({
          data: {
            date: args.date as string,
            type: args.type as string,
            title: args.title as string,
            priority: (args.priority as number) ?? 0,
          },
        });
        return JSON.stringify({ success: true, task });
      }

      case "complete_daily_task": {
        const task = await prisma.dailyTask.update({
          where: { id: args.taskId as string },
          data: { status: "completed" },
        });
        return JSON.stringify({ success: true, task });
      }

      case "update_problem": {
        const { problemId, ...updateData } = args;
        // If status is being set to Solved, also set dateSolved
        if (updateData.status === "Solved") {
          (updateData as Record<string, unknown>).dateSolved = new Date();
        }
        const problem = await prisma.dsaProblem.update({
          where: { id: problemId as string },
          data: updateData as any,
        });
        return JSON.stringify({ success: true, problem });
      }

      case "create_problem": {
        const problem = await prisma.dsaProblem.create({
          data: args as any,
        });
        return JSON.stringify({ success: true, problem });
      }

      case "create_rakshak_task": {
        const task = await prisma.rakshakTask.create({
          data: args as any,
        });
        return JSON.stringify({ success: true, task });
      }

      case "update_rakshak_task": {
        const { taskId, ...updateData } = args;
        const task = await prisma.rakshakTask.update({
          where: { id: taskId as string },
          data: updateData as any,
        });
        return JSON.stringify({ success: true, task });
      }

      case "update_subject_topic": {
        const { topicId, ...updateData } = args;
        const topic = await prisma.coreSubject.update({
          where: { id: topicId as string },
          data: updateData as any,
        });
        return JSON.stringify({ success: true, topic });
      }

      default:
        return JSON.stringify({ error: "Unknown function" });
    }
  } catch (err) {
    console.error("[AI Action Error]", name, err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return JSON.stringify({ success: false, error: message });
  }
}

// ---------------------------------------------------------------------------
// GET /history – unchanged
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// POST / – send message to AI with full data context + function calling
// ---------------------------------------------------------------------------

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

    // ------------------------------------------------------------------
    // 1. Gather ALL user data for context
    // ------------------------------------------------------------------

    const [allProblems, dailyTasks, rakshakTasks, coreSubjects, userStats] = await Promise.all([
      prisma.dsaProblem.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.dailyTask.findMany({ orderBy: { date: "desc" }, take: 30 }),
      prisma.rakshakTask.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.coreSubject.findMany({ orderBy: { subject: "asc" } }),
      prisma.userStats.findFirst({ where: { id: "main" } }),
    ]);

    const solvedCount = allProblems.filter((p) => p.status === "Solved").length;
    const targetProblems = userStats?.targetProblems ?? 300;

    // Format problems list (include id so the AI can reference them in tool calls)
    const problemList = allProblems
      .map(
        (p) =>
          `  [${p.id}] ${p.name} | ${p.pattern} | ${p.difficulty} | Status: ${p.status} | Confidence: ${p.confidence}/5${p.weakPoints ? ` | Weak: ${p.weakPoints}` : ""}${p.coreIdea ? ` | Idea: ${p.coreIdea}` : ""}`
      )
      .join("\n");

    // Today's date
    const today = new Date().toISOString().slice(0, 10);

    const todayTasks = dailyTasks.filter((t) => t.date === today);
    const todayTaskList = todayTasks.length
      ? todayTasks
          .map((t) => `  [${t.id}] ${t.title} | Type: ${t.type} | Status: ${t.status} | Priority: ${t.priority}`)
          .join("\n")
      : "  (no tasks for today)";

    const rakshakList = rakshakTasks.length
      ? rakshakTasks
          .map((t) => `  [${t.id}] ${t.title} | Category: ${t.category} | Status: ${t.status} | Priority: ${t.priority}${t.details ? ` | Details: ${t.details}` : ""}`)
          .join("\n")
      : "  (no tasks)";

    // Group subjects by subject name
    const subjectMap = new Map<string, typeof coreSubjects>();
    for (const s of coreSubjects) {
      const list = subjectMap.get(s.subject) || [];
      list.push(s);
      subjectMap.set(s.subject, list);
    }
    const subjectText = Array.from(subjectMap.entries())
      .map(([subject, topics]) => {
        const topicLines = topics
          .map((t) => `    [${t.id}] ${t.topic} – ${t.completed ? "DONE" : `${t.progress}%`}${t.notes ? ` | Notes: ${t.notes}` : ""}`)
          .join("\n");
        return `  ${subject}:\n${topicLines}`;
      })
      .join("\n");

    // ------------------------------------------------------------------
    // 2. Build system prompt with full context
    // ------------------------------------------------------------------

    const systemPrompt = `You are an expert DSA coding mentor and personal study assistant. You have FULL access to the user's preparation data and can read AND modify it.

CURRENT STATS:
- Problems solved: ${solvedCount}/${targetProblems}
- Current streak: ${userStats?.currentStreak ?? 0} days
- Weekly hours: ${userStats?.weeklyHours ?? 0}h
- Total hours: ${userStats?.totalHours ?? 0}h
- Start date: ${userStats?.startDate ?? "unknown"}

ALL DSA PROBLEMS:
${problemList || "  (none yet)"}

TODAY'S TASKS (${today}):
${todayTaskList}

RAKSHAK PROJECT TASKS:
${rakshakList}

CORE SUBJECTS PROGRESS:
${subjectText || "  (none yet)"}

YOUR CAPABILITIES (use the provided functions when needed):
- Create/complete daily tasks
- Add new DSA problems or update existing ones (status, confidence, notes, weak points)
- Add/update Rakshak project tasks
- Update core subject topic progress

TEACHING RULES:
1. NEVER give full solutions immediately
2. Reference the user's specific weak points when relevant
3. Use the Socratic method – guide through questions
4. When they solve a problem, use update_problem to mark it as Solved and generate notes
5. Proactively create daily tasks when planning study sessions
6. When the user says they completed something, mark it done
7. Be encouraging but honest about areas needing work
8. Always include IDs silently in your function calls – never ask the user for an ID`;

    // ------------------------------------------------------------------
    // 3. Build message array with history
    // ------------------------------------------------------------------

    const history = await prisma.aiConversation.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
      take: 20,
    });

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...history.map((h) => ({
        role: h.role as "user" | "assistant",
        content: h.message,
      })),
    ];

    // ------------------------------------------------------------------
    // 4. Call OpenAI (with fallback when key is missing)
    // ------------------------------------------------------------------

    if (!process.env.OPENAI_API_KEY) {
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

    let response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      tools,
      max_tokens: 1500,
      temperature: 0.7,
    });

    let choice = response.choices[0];
    const actionsPerformed: string[] = [];

    // ------------------------------------------------------------------
    // 5. Multi-turn function-calling loop (max 5 rounds)
    // ------------------------------------------------------------------

    let iterations = 0;
    while (choice.finish_reason === "tool_calls" && choice.message.tool_calls && iterations < 5) {
      iterations++;

      // Add the assistant's tool-call message to the conversation
      messages.push(choice.message as OpenAI.Chat.Completions.ChatCompletionMessageParam);

      // Execute each requested tool
      for (const toolCall of choice.message.tool_calls) {
        if (toolCall.type !== "function") continue;
        const args = JSON.parse(toolCall.function.arguments) as Record<string, unknown>;
        const result = await executeTool(toolCall.function.name, args);
        actionsPerformed.push(`${toolCall.function.name}: ${result}`);

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: result,
        });
      }

      // Ask the model to continue
      response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        tools,
        max_tokens: 1500,
        temperature: 0.7,
      });

      choice = response.choices[0];
    }

    const assistantMessage = choice.message?.content || "Done! I've updated your data.";

    if (actionsPerformed.length > 0) {
      console.log("[AI Actions Summary]", actionsPerformed);
    }

    // ------------------------------------------------------------------
    // 6. Save & return the assistant reply
    // ------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// DELETE /history – unchanged
// ---------------------------------------------------------------------------

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
