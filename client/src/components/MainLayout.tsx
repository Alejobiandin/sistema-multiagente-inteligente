import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Zap,
  MessageSquare,
  CheckCircle2,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  DollarSign,
  BookOpen,
  TrendingUp,
  FileText,
  Users,
} from "lucide-react";
import { useState } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/control-center-v2", label: "Centro de Control V2", icon: LayoutDashboard },
  { href: "/control-center", label: "Centro de Control", icon: LayoutDashboard },
  { href: "/agents", label: "Agentes", icon: Zap },
  { href: "/chat", label: "Diálogo", icon: MessageSquare },
  { href: "/tasks", label: "Tareas", icon: CheckCircle2 },
  { href: "/taxes", label: "Impuestos", icon: DollarSign },
  { href: "/accounting", label: "Contabilidad", icon: BookOpen },
  { href: "/economy", label: "Economía", icon: TrendingUp },
  { href: "/billing", label: "Facturación", icon: FileText },
  { href: "/clients-employees", label: "Clientes y Empleados", icon: Users },
  { href: "/settings", label: "Configuración", icon: Settings },
];

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, logout } = useAuth();
  const { settings } = useWorkspace();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const getDensityClass = () => {
    switch (settings.density) {
      case "compact":
        return "gap-1 p-2";
      case "spacious":
        return "gap-4 p-6";
      default:
        return "gap-3 p-4";
    }
  };

  const getThemeClass = () => {
    return settings.theme === "dark"
      ? "bg-slate-900 text-white"
      : "bg-white text-slate-900";
  };

  return (
    <div className={`min-h-screen flex ${getThemeClass()}`}>
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 ${
          settings.theme === "dark"
            ? "bg-slate-800 border-slate-700"
            : "bg-slate-100 border-slate-200"
        } border-r flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h2 className="font-bold text-lg">SNISSI</h2>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-slate-700 rounded"
          >
            {sidebarOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 space-y-2 ${getDensityClass()}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <a
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? settings.theme === "dark"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-900"
                      : settings.theme === "dark"
                        ? "hover:bg-slate-700"
                        : "hover:bg-slate-200"
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm">{item.label}</span>}
                </a>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className={`border-t ${settings.theme === "dark" ? "border-slate-700" : "border-slate-200"} p-4 space-y-2`}>
          {sidebarOpen && (
            <div className="text-xs truncate">
              <p className="font-semibold">{user?.name || "Usuario"}</p>
              <p className={settings.theme === "dark" ? "text-slate-400" : "text-slate-600"}>
                {user?.email || ""}
              </p>
            </div>
          )}
          <Button
            onClick={() => logout()}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {sidebarOpen && "Salir"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header
          className={`${
            settings.theme === "dark"
              ? "bg-slate-800 border-slate-700"
              : "bg-slate-100 border-slate-200"
          } border-b px-6 py-4 flex items-center justify-between`}
        >
          <div className="flex-1">
            <h1 className="text-xl font-semibold">
              {navItems.find((item) => item.href === location)?.label || "SNISSI"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button
              className={`p-2 rounded-lg ${
                settings.theme === "dark"
                  ? "hover:bg-slate-700"
                  : "hover:bg-slate-200"
              }`}
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 bg-red-500 h-5 w-5 flex items-center justify-center text-xs">
                3
              </Badge>
            </button>

            {/* Theme Indicator */}
            <Badge
              variant="outline"
              className={
                settings.theme === "dark"
                  ? "bg-slate-700 border-slate-600"
                  : "bg-slate-200 border-slate-300"
              }
            >
              {settings.density === "compact"
                ? "Compacto"
                : settings.density === "spacious"
                  ? "Espacioso"
                  : "Normal"}
            </Badge>
          </div>
        </header>

        {/* Page Content */}
        <main className={`flex-1 overflow-auto ${getDensityClass()}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
