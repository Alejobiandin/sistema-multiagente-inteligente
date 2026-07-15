import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface WorkspaceSettings {
  theme: "dark" | "light";
  density: "compact" | "normal" | "spacious";
  widgets: {
    agentsPanel: boolean;
    alertsPanel: boolean;
    tasksPanel: boolean;
    metricsPanel: boolean;
  };
  notifications: {
    anomalies: boolean;
    approvals: boolean;
    completed: boolean;
    errors: boolean;
  };
  autoRefresh: boolean;
  refreshInterval: number;
}

const defaultSettings: WorkspaceSettings = {
  theme: "dark",
  density: "normal",
  widgets: {
    agentsPanel: true,
    alertsPanel: true,
    tasksPanel: true,
    metricsPanel: true,
  },
  notifications: {
    anomalies: true,
    approvals: true,
    completed: true,
    errors: true,
  },
  autoRefresh: true,
  refreshInterval: 5,
};

interface WorkspaceContextType {
  settings: WorkspaceSettings;
  updateSettings: (newSettings: Partial<WorkspaceSettings>) => void;
  resetSettings: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<WorkspaceSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("workspaceSettings");
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading workspace settings:", e);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<WorkspaceSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem("workspaceSettings", JSON.stringify(updated));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem("workspaceSettings", JSON.stringify(defaultSettings));
  };

  return (
    <WorkspaceContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  }
  return context;
}
