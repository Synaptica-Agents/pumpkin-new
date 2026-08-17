import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ClientDrillsCarousel from "./pages/ClientDrillsCarousel";
import MentalMathDrill from "./pages/MentalMathDrill";
import CaseMathDrill from "./pages/CaseMathDrill";
import CreativityDrill from "./pages/CreativityDrill";
import MarketSizingDrill from "./pages/MarketSizingDrill";
import FrameworksDrill from "./pages/FrameworksDrill";
import DiagrammeDrill from "./pages/DiagrammeDrill";
import FortschrittPage from "./pages/FortschrittPage";

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
          <Route path="/market-sizing-drill" element={<MarketSizingDrill />} />
          <Route path="/frameworks-drill" element={<FrameworksDrill />} />
          <Route path="/diagramme-drill" element={<DiagrammeDrill />} />
          <Route path="/fortschritt" element={<FortschrittPage />} />
          {/* /test: identisches UI, aber fixe Demo-Cases in Frameworks/Market Sizing/Creativity (src/lib/testMode.ts) */}
          <Route path="/test" element={<ClientDrillsCarousel key="test" />} />
          <Route path="/test/mental-math-drill" element={<MentalMathDrill key="test" />} />
          <Route path="/test/case-math-drill" element={<CaseMathDrill key="test" />} />
          <Route path="/test/creativity-drill" element={<CreativityDrill key="test" />} />
          <Route path="/test/market-sizing-drill" element={<MarketSizingDrill key="test" />} />
          <Route path="/test/frameworks-drill" element={<FrameworksDrill key="test" />} />
          <Route path="/test/diagramme-drill" element={<DiagrammeDrill key="test" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
