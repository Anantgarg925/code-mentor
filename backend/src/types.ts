import { z } from "zod";

// DSA Problem
export const DsaProblemSchema = z.object({
  id: z.string(),
  name: z.string(),
  pattern: z.string(),
  difficulty: z.string(),
  status: z.string(),
  notes: z.string(),
  dateSolved: z.string().nullable(),
  confidence: z.number(),
  weakPoints: z.string(),
  coreIdea: z.string(),
  keyLine: z.string(),
  edgeCase: z.string(),
  timeSpace: z.string(),
  leetcodeNum: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type DsaProblem = z.infer<typeof DsaProblemSchema>;

export const CreateDsaProblemSchema = z.object({
  name: z.string(),
  pattern: z.string(),
  difficulty: z.string(),
  status: z.string().optional(),
  notes: z.string().optional(),
  confidence: z.number().optional(),
  weakPoints: z.string().optional(),
  coreIdea: z.string().optional(),
  keyLine: z.string().optional(),
  edgeCase: z.string().optional(),
  timeSpace: z.string().optional(),
  leetcodeNum: z.number().optional(),
});

export const UpdateDsaProblemSchema = CreateDsaProblemSchema.partial();

// AI Chat
export const ChatMessageSchema = z.object({
  message: z.string(),
  problemId: z.string().optional(),
  sessionId: z.string().optional(),
});

export const AiConversationSchema = z.object({
  id: z.string(),
  problemId: z.string().nullable(),
  message: z.string(),
  role: z.string(),
  sessionId: z.string(),
  createdAt: z.string(),
});

export type AiConversation = z.infer<typeof AiConversationSchema>;

// Daily Tasks
export const DailyTaskSchema = z.object({
  id: z.string(),
  date: z.string(),
  type: z.string(),
  title: z.string(),
  details: z.string(),
  status: z.string(),
  priority: z.number(),
});

export type DailyTask = z.infer<typeof DailyTaskSchema>;

export const CreateDailyTaskSchema = z.object({
  date: z.string(),
  type: z.string(),
  title: z.string(),
  details: z.string().optional(),
  priority: z.number().optional(),
});

// Rakshak Tasks
export const RakshakTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  status: z.string(),
  priority: z.number(),
  details: z.string(),
});

export type RakshakTask = z.infer<typeof RakshakTaskSchema>;

export const CreateRakshakTaskSchema = z.object({
  title: z.string(),
  category: z.string(),
  status: z.string().optional(),
  priority: z.number().optional(),
  details: z.string().optional(),
});

export const UpdateRakshakTaskSchema = z.object({
  title: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  priority: z.number().optional(),
  details: z.string().optional(),
});

// Core Subjects
export const CoreSubjectSchema = z.object({
  id: z.string(),
  subject: z.string(),
  topic: z.string(),
  notes: z.string(),
  progress: z.number(),
  completed: z.boolean(),
});

export type CoreSubject = z.infer<typeof CoreSubjectSchema>;

// User Stats
export const UserStatsSchema = z.object({
  id: z.string(),
  currentStreak: z.number(),
  longestStreak: z.number(),
  totalHours: z.number(),
  weeklyHours: z.number(),
  lastActiveDate: z.string(),
  startDate: z.string(),
  targetProblems: z.number(),
});

export type UserStats = z.infer<typeof UserStatsSchema>;

// Dashboard aggregate
export const DashboardDataSchema = z.object({
  stats: UserStatsSchema,
  problemsSolved: z.number(),
  patternMastery: z.array(
    z.object({
      pattern: z.string(),
      count: z.number(),
      avgConfidence: z.number(),
    })
  ),
  revisionQueue: z.array(DsaProblemSchema),
  todayTasks: z.array(DailyTaskSchema),
  recentProblems: z.array(DsaProblemSchema),
});

export type DashboardData = z.infer<typeof DashboardDataSchema>;
