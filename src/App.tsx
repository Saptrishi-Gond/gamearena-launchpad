import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index.tsx";
import Auth from "./pages/Auth.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Rewards from "./pages/Rewards.tsx";
import Support from "./pages/Support.tsx";
import GamePage from "./pages/GamePage.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminTournaments from "./pages/admin/AdminTournaments.tsx";
import AdminBookings from "./pages/admin/AdminBookings.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";
import AdminWallet from "./pages/admin/AdminWallet.tsx";
import AdminSupport from "./pages/admin/AdminSupport.tsx";
import AdminNotify from "./pages/admin/AdminNotify.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/support" element={<Support />} />
            <Route path="/games/:slug" element={<GamePage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/tournaments" element={<AdminTournaments />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/wallet" element={<AdminWallet />} />
            <Route path="/admin/support" element={<AdminSupport />} />
            <Route path="/admin/notify" element={<AdminNotify />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
