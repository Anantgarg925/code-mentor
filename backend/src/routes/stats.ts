import { Hono } from "hono";
import prisma from "../db";

const statsRouter = new Hono();

// Get user stats
statsRouter.get("/", async (c) => {
  try {
    let stats = await prisma.userStats.findUnique({ where: { id: "main" } });

    if (!stats) {
      stats = await prisma.userStats.create({
        data: { id: "main" },
      });
    }

    return c.json({ data: stats });
  } catch (error) {
    console.error("Get stats error:", error);
    return c.json({ error: { message: "Failed to fetch stats", code: "GET_ERROR" } }, 500);
  }
});

// Update stats
statsRouter.put("/", async (c) => {
  try {
    const body = await c.req.json();

    const stats = await prisma.userStats.upsert({
      where: { id: "main" },
      update: body,
      create: { id: "main", ...body },
    });

    return c.json({ data: stats });
  } catch (error) {
    console.error("Update stats error:", error);
    return c.json({ error: { message: "Failed to update stats", code: "UPDATE_ERROR" } }, 500);
  }
});

export { statsRouter };
