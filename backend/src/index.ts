import "@vibecodeapp/proxy"; // DO NOT REMOVE OTHERWISE VIBECODE PROXY WILL NOT WORK
import { Hono } from "hono";
import { cors } from "hono/cors";
import "./env";
import { sampleRouter } from "./routes/sample";
import { dashboardRouter } from "./routes/dashboard";
import { problemsRouter } from "./routes/problems";
import { chatRouter } from "./routes/chat";
import { tasksRouter } from "./routes/tasks";
import { rakshakRouter } from "./routes/rakshak";
import { subjectsRouter } from "./routes/subjects";
import { statsRouter } from "./routes/stats";
import { logger } from "hono/logger";

const app = new Hono();

// CORS middleware - validates origin against allowlist
const allowed = [
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https:\/\/[a-z0-9-]+\.dev\.vibecode\.run$/,
  /^https:\/\/[a-z0-9-]+\.vibecode\.run$/,
  /^https:\/\/[a-z0-9-]+\.vibecodeapp\.com$/,
  /^https:\/\/[a-z0-9-]+\.vibecode\.dev$/,
  /^https:\/\/vibecode\.dev$/,
];

app.use(
  "*",
  cors({
    origin: (origin) => (origin && allowed.some((re) => re.test(origin)) ? origin : null),
    credentials: true,
  })
);

// Logging
app.use("*", logger());

// Health check endpoint
app.get("/health", (c) => c.json({ status: "ok" }));

// Routes
app.route("/api/sample", sampleRouter);
app.route("/api/dashboard", dashboardRouter);
app.route("/api/problems", problemsRouter);
app.route("/api/chat", chatRouter);
app.route("/api/tasks", tasksRouter);
app.route("/api/rakshak", rakshakRouter);
app.route("/api/subjects", subjectsRouter);
app.route("/api/stats", statsRouter);

const port = Number(process.env.PORT) || 3000;

export default {
  port,
  fetch: app.fetch,
};
