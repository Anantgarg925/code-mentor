import { Hono } from "hono";
import prisma from "../db";
import { CreateRakshakTaskSchema, UpdateRakshakTaskSchema } from "../types";

const rakshakRouter = new Hono();

// List all tasks with optional filters
rakshakRouter.get("/", async (c) => {
  try {
    const category = c.req.query("category");
    const status = c.req.query("status");

    const where: Record<string, string> = {};
    if (category) where.category = category;
    if (status) where.status = status;

    const tasks = await prisma.rakshakTask.findMany({
      where,
      orderBy: [{ status: "asc" }, { priority: "asc" }],
    });

    return c.json({ data: tasks });
  } catch (error) {
    console.error("List rakshak tasks error:", error);
    return c.json({ error: { message: "Failed to fetch tasks", code: "LIST_ERROR" } }, 500);
  }
});

// Create task
rakshakRouter.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = CreateRakshakTaskSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: { message: "Invalid request body", code: "VALIDATION_ERROR" } }, 400);
    }

    const task = await prisma.rakshakTask.create({
      data: parsed.data,
    });

    return c.json({ data: task }, 201);
  } catch (error) {
    console.error("Create rakshak task error:", error);
    return c.json({ error: { message: "Failed to create task", code: "CREATE_ERROR" } }, 500);
  }
});

// Update task
rakshakRouter.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const parsed = UpdateRakshakTaskSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: { message: "Invalid request body", code: "VALIDATION_ERROR" } }, 400);
    }

    const existing = await prisma.rakshakTask.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ error: { message: "Task not found", code: "NOT_FOUND" } }, 404);
    }

    const task = await prisma.rakshakTask.update({
      where: { id },
      data: parsed.data,
    });

    return c.json({ data: task });
  } catch (error) {
    console.error("Update rakshak task error:", error);
    return c.json({ error: { message: "Failed to update task", code: "UPDATE_ERROR" } }, 500);
  }
});

// Delete task
rakshakRouter.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");

    const existing = await prisma.rakshakTask.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ error: { message: "Task not found", code: "NOT_FOUND" } }, 404);
    }

    await prisma.rakshakTask.delete({ where: { id } });

    return c.json({ data: { success: true } });
  } catch (error) {
    console.error("Delete rakshak task error:", error);
    return c.json({ error: { message: "Failed to delete task", code: "DELETE_ERROR" } }, 500);
  }
});

export { rakshakRouter };
