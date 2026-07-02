import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "@/lib/store";
import Navbar from "@/components/Navbar";
import AppToaster from "@/components/Toaster";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import LandlordSignupPage from "@/pages/LandlordSignupPage";
import VerificationPendingPage from "@/pages/VerificationPendingPage";
import ListingsPage from "@/pages/ListingsPage";
import ListingDetailPage from "@/pages/ListingDetailPage";
import LandlordDashboard from "@/pages/LandlordDashboard";
import MyApplicationsPage from "@/pages/MyApplicationsPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function ProtectedLandlord({ children }: { children: React.ReactNode }) {
  const { user } = useApp();
  if (!user || user.role !== "landlord") return <Redirect to="/login" />;
  return <>{children}</>;
}

function ProtectedStudent({ children }: { children: React.ReactNode }) {
  const { user } = useApp();
  if (!user || user.role !== "student") return <Redirect to="/login" />;
  return <>{children}</>;
}

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={LandingPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={LandlordSignupPage} />
          <Route path="/landlord-signup" component={LandlordSignupPage} />
          <Route path="/verification-pending" component={VerificationPendingPage} />
          <Route path="/listings" component={ListingsPage} />
          <Route path="/listings/:id" component={ListingDetailPage} />
          <Route path="/my-applications">
            <ProtectedStudent>
              <MyApplicationsPage />
            </ProtectedStudent>
          </Route>
          <Route path="/dashboard">
            <ProtectedLandlord>
              <LandlordDashboard />
            </ProtectedLandlord>
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <AppToaster />
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
