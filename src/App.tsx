import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ClientDrillsCarousel from "./pages/ClientDrillsCarousel";
import MentalMathDrill from "./pages/MentalMathDrill";
import CaseMathDrill from "./pages/CaseMathDrill";
import CreativityDrill from "./pages/CreativityDrill";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ClientDrillsCarousel />} />
          <Route path="/mental-math-drill" element={<MentalMathDrill />} />
          <Route path="/case-math-drill" element={<CaseMathDrill />} />
          <Route path="/creativity-drill" element={<CreativityDrill />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
