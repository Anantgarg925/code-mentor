import { Hono } from "hono";
import prisma from "../db";

const dashboardRouter = new Hono();

dashboardRouter.get("/", async (c) => {
  try {
    // Get user stats
    let stats = await prisma.userStats.findUnique({ where: { id: "main" } });
    if (!stats) {
      stats = await prisma.userStats.create({
        data: { id: "main" },
      });
    }

    // Count solved problems
    const problemsSolved = await prisma.dsaProblem.count({
      where: { status: "Solved" },
    });

    // Pattern mastery: group by pattern with avg confidence
    const allProblems = await prisma.dsaProblem.findMany({
      where: { status: "Solved" },
    });

    const patternMap = new Map<string, { count: number; totalConfidence: number }>();
    for (const p of allProblems) {
      const existing = patternMap.get(p.pattern) || { count: 0, totalConfidence: 0 };
      existing.count += 1;
      existing.totalConfidence += p.confidence;
      patternMap.set(p.pattern, existing);
    }

    const patternMastery = Array.from(patternMap.entries()).map(([pattern, data]) => ({
      pattern,
      count: data.count,
      avgConfidence: Math.round((data.totalConfidence / data.count) * 10) / 10,
    }));

    // Revision queue: low confidence problems (confidence <= 2)
    const revisionQueue = await prisma.dsaProblem.findMany({
      where: {
        status: "Solved",
        confidence: { lte: 2 },
      },
      orderBy: { confidence: "asc" },
    });

    // Today's tasks
    const today = new Date().toISOString().split("T")[0];
    const todayTasks = await prisma.dailyTask.findMany({
      where: { date: today },
      orderBy: { priority: "asc" },
    });

    // Recent problems (last 5)
    const recentProblems = await prisma.dsaProblem.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return c.json({
      data: {
        stats,
        problemsSolved,
        patternMastery,
        revisionQueue,
        todayTasks,
        recentProblems,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return c.json({ error: { message: "Failed to fetch dashboard data", code: "DASHBOARD_ERROR" } }, 500);
  }
});

export { dashboardRouter };
