import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MissionControl from "./pages/MissionControl";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MissionControl />} />
          <Route path="/login" element={<Login />} />
          <Route path="/kanban" element={<MissionControl />} />
          <Route path="/kpi" element={<MissionControl />} />
          <Route path="/notificaties" element={<MissionControl />} />
          <Route path="/weekplanner" element={<MissionControl />} />
          <Route path="/system-status" element={<MissionControl />} />
          <Route path="/cron-jobs" element={<MissionControl />} />
          <Route path="/methodiek" element={<MissionControl />} />
          <Route path="/agents" element={<MissionControl />} />
          <Route path="/history" element={<MissionControl />} />
           <Route path="/settings" element={<MissionControl />} />
           <Route path="/intelligence" element={<MissionControl />} />
           <Route path="/risk-radar" element={<MissionControl />} />
           <Route path="/chance-radar" element={<MissionControl />} />
           <Route path="/profit-engine" element={<MissionControl />} />
           <Route path="/command-radar" element={<MissionControl />} />
           <Route path="/action-engine" element={<MissionControl />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
