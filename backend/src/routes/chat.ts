import { Hono } from "hono";
import Anthropic from "@anthropic-ai/sdk";
import prisma from "../db";
import { ChatMessageSchema } from "../types";

const chatRouter = new Hono();

// ---------------------------------------------------------------------------
// Anthropic tool definitions – gives the AI read/write access to all user data
// ---------------------------------------------------------------------------

const tools: Anthropic.Tool[] = [
  {
    name: "create_daily_task",
    description: "Create a new daily task for the user",
    input_schema: {
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
  {
    name: "complete_daily_task",
    description: "Mark a daily task as completed",
    input_schema: {
      type: "object",
      properties: {
        taskId: { type: "string", description: "The task ID to complete" },
      },
      required: ["taskId"],
    },
  },
  {
    name: "update_problem",
    description: "Update a DSA problem's status, confidence, notes, or weak points",
    input_schema: {
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
  {
    name: "create_problem",
    description: "Add a new DSA problem to the tracker",
    input_schema: {
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
  {
    name: "create_rakshak_task",
    description: "Add a new task to the Rakshak project board",
    input_schema: {
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
  {
    name: "update_rakshak_task",
    description: "Update a Rakshak project task's status or details",
    input_schema: {
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
  {
    name: "update_subject_topic",
    description: "Update a core subject topic's progress or completion",
    input_schema: {
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

RAKSHAK PROJECT KNOWLEDGE:
Rakshak ("Protector" in Hindi) is a smart personal safety and emergency response system for road accidents. It auto-detects vehicle accidents using on-device ML (accelerometer + gyroscope data) and dispatches ambulances without manual intervention — the victim may be unconscious.

Tech Stack:
- Android App: Native Android, Java, MVVM, Material Design 3, Retrofit/OkHttp, Google Maps SDK, Firebase Auth (Google Sign-In + Phone OTP), TensorFlow Lite, OkHttp3 WebSocket
- Backend: Spring Boot, Java 17, PostgreSQL (rakshak_db), Spring WebSocket, JPA/Hibernate, Maven, port 8081
- Web Dashboard: Angular 20, TypeScript, Bootstrap 5.3.7, standalone components, RxJS
- ML Pipeline: Python 3.9, TensorFlow/Keras, trained on Simulated Falls + UCI HAR + HAPT + WISDM datasets, outputs model.tflite

Core Features:
1. ML Accident Detection — TFLite model, 6 features (accel xyz + gyro xyz), 128-reading sliding window, 0.95 confidence threshold
2. Manual SOS — 3-second long-press
3. 15-second Safety Countdown — cancel false alarms before alert sends
4. Automatic Ambulance Dispatch from pre-configured pool
5. Live Ambulance Tracking — Google Maps via WebSocket (5-sec updates)
6. Hospital Notification with ETA
7. Medical Profile — blood type, conditions, allergies for first responders
8. Emergency Contacts Management
9. Accident History Log with time filters and statistics
10. Foreground Monitoring Service — survives app backgrounding

Admin/Hospital Web Dashboard Modules:
- Ambulance Control Panel: view and acknowledge accident alerts
- Traffic Signal Control: toggle signals at intersections
- Hospital Bed Status: ICU, General, Emergency availability
- Patient Tracker: real-time patient info with vitals
- Hospital Readiness: incoming patient list with injury type and ETA

Android App Screens (25 layouts):
- SplashActivity: 4-sec animated boot (Security, Sensors, GPS, Monitoring init)
- LoginActivity: Google Sign-In or Phone OTP
- MainActivity: Bottom nav (Home, History, Settings, Profile) + floating SOS button
- HomeFragment: detection status, sensor data, toggle controls
- HistoryFragment: accident history with time filters and statistics
- SettingsFragment: auto-start, haptic, voice commands, notifications, location sharing, test mode
- ProfileFragment: user info, medical info, emergency contacts CRUD
- EmergencyAlertActivity: 15-sec countdown with cancel/send
- EmergencyTrackingActivity: live Google Maps ambulance tracking

Backend API Endpoints:
- POST /api/accident/report — validates user, dispatches ambulance, broadcasts WebSocket, persists history
- POST /api/hospital/notify — sends ambulance ID, device ID, ETA to hospital
- WebSocket /tracking — real-time ambulance location updates

ML Model Details:
- SensorManager registers accelerometer (x/y/z) + gyroscope (x/y/z) at SENSOR_DELAY_GAME rate
- Sliding window deque of 128 readings, each with 6 features
- model.tflite loaded via memory-mapped I/O
- Confidence > 0.95 triggers onAccidentDetected() callback

User Flow: App Launch (4-sec splash) -> Firebase Auth -> Backend Registration -> Home (sensor monitoring) -> Foreground service continuous monitoring -> Accident detected (confidence > 0.95) -> EmergencyAlertActivity (15-sec countdown, user can cancel) -> Alert sent with GPS -> Ambulance dispatched via WebSocket -> Live tracking on Google Maps

Current Status: Prototype with hardcoded ambulance data (3 units in Delhi), simulated ambulance movement, static hospital data. Demonstrates complete end-to-end flow.
GitHub: https://github.com/Anantgarg925/Rakshak

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
8. Always include IDs silently in your function calls – never ask the user for an ID
9. For Rakshak project questions: suggest next features, architecture improvements, help debug issues, and break down complex features into actionable tasks using your deep knowledge of the project's tech stack, architecture, and current status

CORE SUBJECTS AUTO-NOTES RULE (CRITICAL):
When you explain, teach, or discuss ANY Core Subjects topic (OOP, OS, DB/Databases, Networks, System Design), you MUST:
- Call update_subject_topic to save your explanation as structured notes for that topic
- The notes should be concise bullet points capturing the KEY concepts you just taught (max 5-7 points)
- Format notes as: "• Key point 1\n• Key point 2\n• Example: ...\n• Common interview Q: ..."
- Also update progress (e.g., if you taught a topic partially set progress=50, fully set progress=100)
- Do this AUTOMATICALLY without asking the user — they should see notes appear in Core Subjects after every explanation
- If the user asks about a concept that maps to a core subject topic, find the closest matching topicId from the CORE SUBJECTS PROGRESS list above and save to it
- ALWAYS tell the user at the end: "Notes saved to Core Subjects ✓" so they know it happened`;

    // ------------------------------------------------------------------
    // 3. Build message array with history (no system message in array)
    // ------------------------------------------------------------------

    const history = await prisma.aiConversation.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
      take: 20,
    });

    const messages: Anthropic.MessageParam[] = history.map((h) => ({
      role: h.role as "user" | "assistant",
      content: h.message,
    }));

    // ------------------------------------------------------------------
    // 4. Call Anthropic (with fallback when key is missing)
    // ------------------------------------------------------------------

    if (!process.env.ANTHROPIC_API_KEY) {
      const fallbackMessage =
        "AI mentoring is currently unavailable (ANTHROPIC_API_KEY not configured). Please set the ANTHROPIC_API_KEY environment variable to enable AI chat.";

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

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    let response = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 4096,
      system: systemPrompt,
      tools,
      messages,
    });

    const actionsPerformed: string[] = [];

    // ------------------------------------------------------------------
    // 5. Multi-turn function-calling loop (max 5 rounds)
    // ------------------------------------------------------------------

    let iterations = 0;
    while (response.stop_reason === "tool_use" && iterations < 5) {
      iterations++;

      // Add the assistant's response to the conversation
      messages.push({ role: "assistant", content: response.content });

      // Execute each tool_use block and collect results
      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const block of response.content) {
        if (block.type !== "tool_use") continue;
        const args = block.input as Record<string, unknown>;
        const result = await executeTool(block.name, args);
        actionsPerformed.push(`${block.name}: ${result}`);

        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: result,
        });
      }

      // Add tool results as a user message
      messages.push({ role: "user", content: toolResults });

      // Ask the model to continue
      response = await anthropic.messages.create({
        model: "claude-opus-4-5",
        max_tokens: 4096,
        system: systemPrompt,
        tools,
        messages,
      });
    }

    // Extract text from the final response content blocks
    const textBlocks = response.content.filter(
      (block): block is Anthropic.TextBlock => block.type === "text"
    );
    const assistantMessage = textBlocks.map((b) => b.text).join("\n") || "Done! I've updated your data.";

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
