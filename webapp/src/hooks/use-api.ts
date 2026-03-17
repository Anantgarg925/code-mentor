import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// ---- Types (matching actual backend Prisma models) ----

export interface DsaProblem {
  id: string;
  name: string;
  pattern: string;
  difficulty: string;
  status: string;
  notes: string;
  dateSolved: string | null;
  confidence: number;
  weakPoints: string;
  coreIdea: string;
  keyLine: string;
  edgeCase: string;
  timeSpace: string;
  leetcodeNum: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PatternMastery {
  pattern: string;
  count: number;
  avgConfidence: number;
}

export interface UserStats {
  id: string;
  currentStreak: number;
  longestStreak: number;
  totalHours: number;
  weeklyHours: number;
  lastActiveDate: string;
  startDate: string;
  targetProblems: number;
  createdAt: string;
  updatedAt: string;
}

export interface DailyTask {
  id: string;
  date: string;
  type: string;
  title: string;
  details: string;
  status: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  stats: UserStats;
  problemsSolved: number;
  patternMastery: PatternMastery[];
  revisionQueue: DsaProblem[];
  todayTasks: DailyTask[];
  recentProblems: DsaProblem[];
}

export interface MentorMessage {
  id: string;
  problemId: string | null;
  message: string;
  role: "user" | "assistant";
  sessionId: string;
  createdAt: string;
}

export interface RakshakTask {
  id: string;
  title: string;
  category: string;
  status: string;
  priority: number;
  details: string;
  createdAt: string;
  updatedAt: string;
}

// Backend returns grouped: Record<string, CoreSubjectTopic[]>
export interface CoreSubjectTopic {
  id: string;
  subject: string;
  topic: string;
  notes: string;
  progress: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---- Hooks ----

// Dashboard
export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.get<DashboardData>("/api/dashboard"),
  });
}

// Problems
export function useProblems(filters?: { pattern?: string; status?: string }) {
  return useQuery({
    queryKey: ["problems", filters],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters?.pattern) params.set("pattern", filters.pattern);
      if (filters?.status) params.set("status", filters.status);
      const qs = params.toString();
      return api.get<DsaProblem[]>(`/api/problems${qs ? `?${qs}` : ""}`);
    },
  });
}

export function useProblem(id: string) {
  return useQuery({
    queryKey: ["problems", id],
    queryFn: () => api.get<DsaProblem>(`/api/problems/${id}`),
    enabled: !!id,
  });
}

export function useCreateProblem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<DsaProblem>) =>
      api.post<DsaProblem>("/api/problems", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateProblem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<DsaProblem> & { id: string }) =>
      api.put<DsaProblem>(`/api/problems/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteProblem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/problems/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

// Daily Tasks
export function useDailyTasks(date?: string) {
  return useQuery({
    queryKey: ["daily-tasks", date],
    queryFn: () => {
      const qs = date ? `?date=${date}` : "";
      return api.get<DailyTask[]>(`/api/tasks${qs}`);
    },
  });
}

export function useCreateDailyTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<DailyTask>) =>
      api.post<DailyTask>("/api/tasks", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateDailyTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<DailyTask> & { id: string }) =>
      api.put<DailyTask>(`/api/tasks/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useGenerateDailyTasks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data?: { date?: string }) =>
      api.post<DailyTask[]>("/api/tasks/generate", data ?? {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

// Mentor Chat - Backend routes: GET /api/chat/history, POST /api/chat, DELETE /api/chat/history
export function useMentorMessages(sessionId?: string) {
  return useQuery({
    queryKey: ["mentor", sessionId],
    queryFn: () => {
      const qs = sessionId ? `?sessionId=${sessionId}` : "";
      return api.get<MentorMessage[]>(`/api/chat/history${qs}`);
    },
  });
}

export function useSendMentorMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { message: string; sessionId?: string; problemId?: string }) =>
      api.post<MentorMessage>("/api/chat", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor"] });
    },
  });
}

export function useClearMentorHistory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId?: string) => {
      const qs = sessionId ? `?sessionId=${sessionId}` : "";
      return api.delete(`/api/chat/history${qs}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor"] });
    },
  });
}

// Rakshak Board
export function useRakshakTasks(filters?: { category?: string; status?: string }) {
  return useQuery({
    queryKey: ["rakshak", filters],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters?.category) params.set("category", filters.category);
      if (filters?.status) params.set("status", filters.status);
      const qs = params.toString();
      return api.get<RakshakTask[]>(`/api/rakshak${qs ? `?${qs}` : ""}`);
    },
  });
}

export function useCreateRakshakTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<RakshakTask>) =>
      api.post<RakshakTask>("/api/rakshak", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rakshak"] });
    },
  });
}

export function useUpdateRakshakTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<RakshakTask> & { id: string }) =>
      api.put<RakshakTask>(`/api/rakshak/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rakshak"] });
    },
  });
}

export function useDeleteRakshakTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/rakshak/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rakshak"] });
    },
  });
}

// Core Subjects - Backend returns Record<string, CoreSubjectTopic[]>
export function useSubjects() {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: () => api.get<Record<string, CoreSubjectTopic[]>>("/api/subjects"),
  });
}

export function useUpdateSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; progress?: number; notes?: string; completed?: boolean }) =>
      api.put<CoreSubjectTopic>(`/api/subjects/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
}

// Stats
export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: () => api.get<UserStats>("/api/stats"),
  });
}
