import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ColdStorage from "./pages/ColdStorage";
import Auth from "./pages/Auth";
import Lijnbezetting from "./pages/Lijnbezetting";
import MissionControl from "./pages/MissionControl";
import HBMasterWidgetDemo from "./pages/HBMasterWidgetDemo";
import RealEstate from "./pages/RealEstate";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cold-storage" element={<ColdStorage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/lijnbezetting" element={<Lijnbezetting />} />
          <Route path="/hbmaster" element={<MissionControl />} />
          <Route path="/hbmaster-widget" element={<HBMasterWidgetDemo />} />
          <Route path="/realestate" element={<RealEstate />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
