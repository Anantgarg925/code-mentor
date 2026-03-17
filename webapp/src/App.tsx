import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import NotFound from "./pages/NotFound";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const DsaTracker = lazy(() => import("./pages/DsaTracker"));
const AiMentor = lazy(() => import("./pages/AiMentor"));
const DailyPlanner = lazy(() => import("./pages/DailyPlanner"));
const Roadmap = lazy(() => import("./pages/Roadmap"));
const RakshakBoard = lazy(() => import("./pages/RakshakBoard"));
const CoreSubjects = lazy(() => import("./pages/CoreSubjects"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="flex h-full items-center justify-center p-12">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dsa" element={<DsaTracker />} />
              <Route path="/mentor" element={<AiMentor />} />
              <Route path="/planner" element={<DailyPlanner />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/rakshak" element={<RakshakBoard />} />
              <Route path="/subjects" element={<CoreSubjects />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
