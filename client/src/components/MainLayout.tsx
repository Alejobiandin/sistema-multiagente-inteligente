import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  DollarSign,
  BookOpen,
  TrendingUp,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";


interface MainLayoutProps {
  children: ReactNode;
}

// Módulos organizados por categoría
const modules = [
  {
    category: "Gestión",
    icon: LayoutDashboard,
    color: "bg-blue-500",
    items: [
      { href: "/control-center-v2", label: "Centro de Control", icon: LayoutDashboard },
    ],
  },
  {
    category: "Contabilidad",
    icon: BookOpen,
    color: "bg-purple-500",
    items: [
      { href: "/taxes", label: "Impuestos", icon: DollarSign },
      { href: "/accounting", label: "Contabilidad", icon: BookOpen },
      { href: "/billing", label: "Facturación", icon: FileText },
    ],
  },
  {
    category: "Análisis",
    icon: TrendingUp,
    color: "bg-emerald-500",
    items: [
      { href: "/economy", label: "Economía", icon: TrendingUp },
    ],
  },
  {
    category: "Recursos",
    icon: Users,
    color: "bg-orange-500",
    items: [
      { href: "/clients-employees", label: "Clientes y Empleados", icon: Users },
    ],
  },
];

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, logout } = useAuth();
  const { settings } = useWorkspace();
  const { theme } = useTheme();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Gestión");

  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen flex ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } transition-all duration-300 ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        } border-r flex flex-col shadow-lg`}
      >
        {/* Header */}
        <div className={`p-6 flex items-center justify-between border-b ${isDark ? "border-slate-800" : "border-slate-200"}`}>
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SN</span>
              </div>
              <h1 className={`font-bold text-lg ${isDark ? "text-white" : "text-slate-900"}`}>SNISSI</h1>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"
            }`}
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {modules.map((module) => (
            <div key={module.category}>
              <button
                onClick={() =>
                  setExpandedCategory(
                    expandedCategory === module.category ? null : module.category
                  )
                }
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  expandedCategory === module.category
                    ? isDark
                      ? "bg-slate-800"
                      : "bg-slate-100"
                    : isDark
                      ? "hover:bg-slate-800"
                      : "hover:bg-slate-100"
                }`}
              >
                <div className={`${module.color} p-2 rounded-lg text-white`}>
                  <module.icon className="w-4 h-4" />
                </div>
                {sidebarOpen && (
                  <>
                    <span className={`flex-1 text-sm font-semibold text-left ${isDark ? "text-white" : "text-slate-900"}`}>
                      {module.category}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        expandedCategory === module.category ? "rotate-180" : ""
                      } ${isDark ? "text-slate-400" : "text-slate-600"}`}
                    />
                  </>
                )}
              </button>

              {/* Submenu */}
              {sidebarOpen && expandedCategory === module.category && (
                <div className="ml-4 mt-2 space-y-1 border-l-2 border-slate-700 pl-2">
                  {module.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location === item.href;
                    return (
                      <Link key={item.href} href={item.href}>
                        <a
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                            isActive
                              ? isDark
                                ? "bg-blue-600/20 text-blue-400"
                                : "bg-blue-100 text-blue-700"
                              : isDark
                                ? "text-slate-400 hover:text-slate-300 hover:bg-slate-800"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </a>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* User Section */}
        <div
          className={`border-t ${isDark ? "border-slate-800" : "border-slate-200"} p-4 space-y-3`}
        >
          {sidebarOpen && (
            <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              <p className={`font-semibold ${isDark ? "text-slate-300" : "text-slate-900"}`}>
                {user?.name || "Usuario"}
              </p>
              <p className="truncate">{user?.email || ""}</p>
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
            isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          } border-b px-8 py-4 flex items-center justify-between shadow-sm`}
        >
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              {modules
                .flatMap((m) => m.items)
                .find((item) => item.href === location)?.label || "SNISSI"}
            </h1>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Plataforma de Contabilidad Multiagente
            </p>
          </div>

          <div className={`px-4 py-2 rounded-lg ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
            <span className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              {settings.density === "compact"
                ? "Compacto"
                : settings.density === "spacious"
                  ? "Espacioso"
                  : "Normal"}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className={`flex-1 overflow-auto ${isDark ? "bg-slate-950" : "bg-slate-50"} p-8`}>
          {children}
        </main>
      </div>
    </div>
  );
}
