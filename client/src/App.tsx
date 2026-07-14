import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CasesManagement from "./pages/CasesManagement";
import CaseDetail from "./pages/CaseDetail";
import NewsInbox from "./pages/NewsInbox";
import HumanApprovals from "./pages/HumanApprovals";
import OrganizationalDNA from "./pages/OrganizationalDNA";
import PayrollUpload from "./pages/PayrollUpload";
import PayrollMonitoring from "./pages/PayrollMonitoring";
import PayrollHistory from "./pages/PayrollHistory";
import PayrollAudit from "./pages/PayrollAudit";
import ControlCenter from "./pages/ControlCenter";
import AgentsPanel from "./pages/AgentsPanel";
import AgentChat from "./pages/AgentChat";
import TaskAssignment from "./pages/TaskAssignment";
import WorkspaceSettings from "./pages/WorkspaceSettings";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"\\"} component={Home} />
      <Route path={"/control-center"} component={ControlCenter} />
      <Route path={"/agents"} component={AgentsPanel} />
      <Route path={"/chat"} component={AgentChat} />
      <Route path={"/tasks"} component={TaskAssignment} />
      <Route path={"/settings"} component={WorkspaceSettings} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/cases"} component={CasesManagement} />
      <Route path="/cases/:id" component={CaseDetail} />
      <Route path={"/news"} component={NewsInbox} />
      <Route path={"/approvals"} component={HumanApprovals} />
      <Route path={"/dna"} component={OrganizationalDNA} />
      <Route path={"/payroll/upload"} component={PayrollUpload} />
      <Route path={"/payroll/monitoring"} component={PayrollMonitoring} />
      <Route path={"/payroll/history"} component={PayrollHistory} />
      <Route path={"/payroll/audit"} component={PayrollAudit} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
