import { Hono } from "hono";
import prisma from "../db";

const subjectsRouter = new Hono();

// List all subjects, grouped by subject
subjectsRouter.get("/", async (c) => {
  try {
    const subjects = await prisma.coreSubject.findMany({
      orderBy: [{ subject: "asc" }, { topic: "asc" }],
    });

    // Group by subject
    const grouped: Record<string, typeof subjects> = {};
    for (const s of subjects) {
      if (!grouped[s.subject]) {
        grouped[s.subject] = [];
      }
      grouped[s.subject]!.push(s);
    }

    return c.json({ data: grouped });
  } catch (error) {
    console.error("List subjects error:", error);
    return c.json({ error: { message: "Failed to fetch subjects", code: "LIST_ERROR" } }, 500);
  }
});

// Update subject progress
subjectsRouter.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();

    const existing = await prisma.coreSubject.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ error: { message: "Subject not found", code: "NOT_FOUND" } }, 404);
    }

    const { progress, notes, completed } = body;
    const updateData: Record<string, unknown> = {};
    if (progress !== undefined) updateData.progress = progress;
    if (notes !== undefined) updateData.notes = notes;
    if (completed !== undefined) updateData.completed = completed;

    const subject = await prisma.coreSubject.update({
      where: { id },
      data: updateData,
    });

    return c.json({ data: subject });
  } catch (error) {
    console.error("Update subject error:", error);
    return c.json({ error: { message: "Failed to update subject", code: "UPDATE_ERROR" } }, 500);
  }
});

export { subjectsRouter };
