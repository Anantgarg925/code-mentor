import { Hono } from "hono";
import prisma from "../db";
import { CreateDailyTaskSchema } from "../types";

const tasksRouter = new Hono();

// Get tasks for a date
tasksRouter.get("/", async (c) => {
  try {
    const date = c.req.query("date") || new Date().toISOString().split("T")[0]!;

    const tasks = await prisma.dailyTask.findMany({
      where: { date },
      orderBy: { priority: "asc" },
    });

    return c.json({ data: tasks });
  } catch (error) {
    console.error("List tasks error:", error);
    return c.json({ error: { message: "Failed to fetch tasks", code: "LIST_ERROR" } }, 500);
  }
});

// Create task
tasksRouter.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = CreateDailyTaskSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: { message: "Invalid request body", code: "VALIDATION_ERROR" } }, 400);
    }

    const task = await prisma.dailyTask.create({
      data: parsed.data,
    });

    return c.json({ data: task }, 201);
  } catch (error) {
    console.error("Create task error:", error);
    return c.json({ error: { message: "Failed to create task", code: "CREATE_ERROR" } }, 500);
  }
});

// Update task
tasksRouter.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();

    const existing = await prisma.dailyTask.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ error: { message: "Task not found", code: "NOT_FOUND" } }, 404);
    }

    const task = await prisma.dailyTask.update({
      where: { id },
      data: body,
    });

    return c.json({ data: task });
  } catch (error) {
    console.error("Update task error:", error);
    return c.json({ error: { message: "Failed to update task", code: "UPDATE_ERROR" } }, 500);
  }
});

// Delete task
tasksRouter.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");

    const existing = await prisma.dailyTask.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ error: { message: "Task not found", code: "NOT_FOUND" } }, 404);
    }

    await prisma.dailyTask.delete({ where: { id } });

    return c.json({ data: { success: true } });
  } catch (error) {
    console.error("Delete task error:", error);
    return c.json({ error: { message: "Failed to delete task", code: "DELETE_ERROR" } }, 500);
  }
});

// Auto-generate today's tasks based on progress
tasksRouter.post("/generate", async (c) => {
  try {
    const today = new Date().toISOString().split("T")[0]!;

    // Clear existing tasks for today
    await prisma.dailyTask.deleteMany({ where: { date: today } });

    // Get weak problems for revision
    const weakProblems = await prisma.dsaProblem.findMany({
      where: { confidence: { lte: 2 }, status: "Solved" },
      orderBy: { confidence: "asc" },
      take: 2,
    });

    // Get pattern stats to suggest new problems
    const allProblems = await prisma.dsaProblem.findMany({ where: { status: "Solved" } });
    const patternCounts = new Map<string, number>();
    for (const p of allProblems) {
      patternCounts.set(p.pattern, (patternCounts.get(p.pattern) || 0) + 1);
    }

    // Find least practiced patterns
    const allPatterns = ["HashMap", "SlidingWindow", "Stack", "Heap", "PrefixSum", "Greedy", "TwoPointers", "BinarySearch"];
    const leastPracticed = allPatterns
      .map((p) => ({ pattern: p, count: patternCounts.get(p) || 0 }))
      .sort((a, b) => a.count - b.count);

    const tasks: Array<{ date: string; type: string; title: string; priority: number; details: string }> = [];

    // Task 1: New DSA problems
    const suggestedPattern = leastPracticed[0]?.pattern || "TwoPointers";
    tasks.push({
      date: today,
      type: "dsa_new",
      title: `Solve 2 new ${suggestedPattern} problems`,
      priority: 1,
      details: JSON.stringify({ pattern: suggestedPattern }),
    });

    // Task 2: Revision tasks
    for (const wp of weakProblems) {
      tasks.push({
        date: today,
        type: "dsa_revision",
        title: `Review ${wp.name}${wp.weakPoints ? ` (weak: ${wp.weakPoints.split(",")[0]})` : ""}`,
        priority: 2,
        details: JSON.stringify({ problemId: wp.id }),
      });
    }

    // Task 3: Rakshak project work
    const inProgressRakshak = await prisma.rakshakTask.findFirst({
      where: { status: "in_progress" },
      orderBy: { priority: "asc" },
    });
    if (inProgressRakshak) {
      tasks.push({
        date: today,
        type: "project",
        title: `Continue: ${inProgressRakshak.title}`,
        priority: 3,
        details: JSON.stringify({ taskId: inProgressRakshak.id }),
      });
    }

    // Task 4: Core subjects
    const incompleteTopic = await prisma.coreSubject.findFirst({
      where: { completed: false },
      orderBy: { progress: "asc" },
    });
    if (incompleteTopic) {
      tasks.push({
        date: today,
        type: "core_subjects",
        title: `Study ${incompleteTopic.subject}: ${incompleteTopic.topic} (30 min)`,
        priority: 4,
        details: JSON.stringify({ subjectId: incompleteTopic.id }),
      });
    }

    // Create all tasks
    for (const t of tasks) {
      await prisma.dailyTask.create({ data: t });
    }

    const createdTasks = await prisma.dailyTask.findMany({
      where: { date: today },
      orderBy: { priority: "asc" },
    });

    return c.json({ data: createdTasks });
  } catch (error) {
    console.error("Generate tasks error:", error);
    return c.json({ error: { message: "Failed to generate tasks", code: "GENERATE_ERROR" } }, 500);
  }
});

export { tasksRouter };
