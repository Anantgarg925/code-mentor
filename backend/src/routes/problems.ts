import { Hono } from "hono";
import prisma from "../db";
import { CreateDsaProblemSchema, UpdateDsaProblemSchema } from "../types";

const problemsRouter = new Hono();

// List all problems with optional filters
problemsRouter.get("/", async (c) => {
  try {
    const pattern = c.req.query("pattern");
    const status = c.req.query("status");
    const difficulty = c.req.query("difficulty");

    const where: Record<string, string> = {};
    if (pattern) where.pattern = pattern;
    if (status) where.status = status;
    if (difficulty) where.difficulty = difficulty;

    const problems = await prisma.dsaProblem.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return c.json({ data: problems });
  } catch (error) {
    console.error("List problems error:", error);
    return c.json({ error: { message: "Failed to fetch problems", code: "LIST_ERROR" } }, 500);
  }
});

// Get single problem
problemsRouter.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const problem = await prisma.dsaProblem.findUnique({ where: { id } });

    if (!problem) {
      return c.json({ error: { message: "Problem not found", code: "NOT_FOUND" } }, 404);
    }

    return c.json({ data: problem });
  } catch (error) {
    console.error("Get problem error:", error);
    return c.json({ error: { message: "Failed to fetch problem", code: "GET_ERROR" } }, 500);
  }
});

// Create problem
problemsRouter.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = CreateDsaProblemSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: { message: "Invalid request body", code: "VALIDATION_ERROR" } }, 400);
    }

    const problem = await prisma.dsaProblem.create({
      data: parsed.data,
    });

    return c.json({ data: problem }, 201);
  } catch (error) {
    console.error("Create problem error:", error);
    return c.json({ error: { message: "Failed to create problem", code: "CREATE_ERROR" } }, 500);
  }
});

// Update problem
problemsRouter.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const parsed = UpdateDsaProblemSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: { message: "Invalid request body", code: "VALIDATION_ERROR" } }, 400);
    }

    const existing = await prisma.dsaProblem.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ error: { message: "Problem not found", code: "NOT_FOUND" } }, 404);
    }

    const problem = await prisma.dsaProblem.update({
      where: { id },
      data: parsed.data,
    });

    return c.json({ data: problem });
  } catch (error) {
    console.error("Update problem error:", error);
    return c.json({ error: { message: "Failed to update problem", code: "UPDATE_ERROR" } }, 500);
  }
});

// Delete problem
problemsRouter.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");

    const existing = await prisma.dsaProblem.findUnique({ where: { id } });
    if (!existing) {
      return c.json({ error: { message: "Problem not found", code: "NOT_FOUND" } }, 404);
    }

    // Delete related conversations first
    await prisma.aiConversation.deleteMany({ where: { problemId: id } });
    await prisma.dsaProblem.delete({ where: { id } });

    return c.json({ data: { success: true } });
  } catch (error) {
    console.error("Delete problem error:", error);
    return c.json({ error: { message: "Failed to delete problem", code: "DELETE_ERROR" } }, 500);
  }
});

export { problemsRouter };
