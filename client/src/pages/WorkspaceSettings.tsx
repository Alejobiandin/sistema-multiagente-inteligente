import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Layout, Bell, Lock, Save, RotateCcw } from "lucide-react";

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

export default function WorkspaceSettings() {
  const [settings, setSettings] = useState<WorkspaceSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem("workspaceSettings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
  };

  const handleThemeChange = (theme: "dark" | "light") => {
    setSettings({ ...settings, theme });
  };

  const handleDensityChange = (density: "compact" | "normal" | "spacious") => {
    setSettings({ ...settings, density });
  };

  const handleWidgetToggle = (widget: keyof typeof settings.widgets) => {
    setSettings({
      ...settings,
      widgets: {
        ...settings.widgets,
        [widget]: !settings.widgets[widget],
      },
    });
  };

  const handleNotificationToggle = (notification: keyof typeof settings.notifications) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [notification]: !settings.notifications[notification],
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Personalización de Workspace</h1>
          <p className="text-slate-400">Adapta tu área de trabajo según tus preferencias</p>
        </div>

        {/* Saved Notification */}
        {saved && (
          <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded-lg flex items-center gap-2">
            <div className="h-2 w-2 bg-green-400 rounded-full"></div>
            Cambios guardados correctamente
          </div>
        )}

        {/* Settings Tabs */}
        <Tabs defaultValue="theme" className="space-y-4">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="theme" className="text-slate-300 data-[state=active]:text-white">
              <Palette className="h-4 w-4 mr-2" />
              Tema
            </TabsTrigger>
            <TabsTrigger value="layout" className="text-slate-300 data-[state=active]:text-white">
              <Layout className="h-4 w-4 mr-2" />
              Diseño
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-slate-300 data-[state=active]:text-white">
              <Bell className="h-4 w-4 mr-2" />
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="privacy" className="text-slate-300 data-[state=active]:text-white">
              <Lock className="h-4 w-4 mr-2" />
              Privacidad
            </TabsTrigger>
          </TabsList>

          {/* Theme Tab */}
          <TabsContent value="theme" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Tema Visual</CardTitle>
                <CardDescription className="text-slate-400">
                  Elige el tema que prefieras para tu interfaz
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => handleThemeChange("dark")}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      settings.theme === "dark"
                        ? "border-blue-500 bg-slate-700"
                        : "border-slate-600 bg-slate-700 hover:border-slate-500"
                    }`}
                  >
                    <div className="h-20 bg-slate-900 rounded mb-2"></div>
                    <p className="font-semibold text-white">Oscuro</p>
                    <p className="text-xs text-slate-400">Tema oscuro moderno</p>
                  </div>

                  <div
                    onClick={() => handleThemeChange("light")}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      settings.theme === "light"
                        ? "border-blue-500 bg-slate-700"
                        : "border-slate-600 bg-slate-700 hover:border-slate-500"
                    }`}
                  >
                    <div className="h-20 bg-white rounded mb-2"></div>
                    <p className="font-semibold text-white">Claro</p>
                    <p className="text-xs text-slate-400">Tema claro minimalista</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Layout Tab */}
          <TabsContent value="layout" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Densidad de Información</CardTitle>
                <CardDescription className="text-slate-400">
                  Ajusta cuánta información ves en pantalla
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {(["compact", "normal", "spacious"] as const).map((density) => (
                    <div
                      key={density}
                      onClick={() => handleDensityChange(density)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        settings.density === density
                          ? "border-blue-500 bg-slate-700"
                          : "border-slate-600 bg-slate-700 hover:border-slate-500"
                      }`}
                    >
                      <p className="font-semibold text-white capitalize">{density === "compact" ? "Compacto" : density === "normal" ? "Normal" : "Espacioso"}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {density === "compact"
                          ? "Máxima información en pantalla"
                          : density === "normal"
                            ? "Balance entre información y espacio"
                            : "Menos información, más espacio"}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Widgets Visibles</CardTitle>
                <CardDescription className="text-slate-400">
                  Elige qué paneles mostrar en tu dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {Object.entries(settings.widgets).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <Label className="text-white capitalize cursor-pointer">
                        {key === "agentsPanel"
                          ? "Panel de Agentes"
                          : key === "alertsPanel"
                            ? "Panel de Alertas"
                            : key === "tasksPanel"
                              ? "Panel de Tareas"
                              : "Panel de Métricas"}
                      </Label>
                      <Switch
                        checked={value}
                        onCheckedChange={() => handleWidgetToggle(key as keyof typeof settings.widgets)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Notificaciones</CardTitle>
                <CardDescription className="text-slate-400">
                  Configura qué notificaciones deseas recibir
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <Label className="text-white capitalize cursor-pointer">
                        {key === "anomalies"
                          ? "Anomalías detectadas"
                          : key === "approvals"
                            ? "Requiere aprobación"
                            : key === "completed"
                              ? "Tareas completadas"
                              : "Errores"}
                      </Label>
                      <Switch
                        checked={value}
                        onCheckedChange={() => handleNotificationToggle(key as keyof typeof settings.notifications)}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-slate-700 rounded-lg">
                  <Label className="text-white">Intervalo de Actualización (segundos)</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="range"
                      min="1"
                      max="60"
                      value={settings.refreshInterval}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          refreshInterval: parseInt(e.target.value),
                        })
                      }
                      className="flex-1"
                    />
                    <Badge className="bg-blue-600">{settings.refreshInterval}s</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Privacidad y Seguridad</CardTitle>
                <CardDescription className="text-slate-400">
                  Gestiona tu privacidad y seguridad
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-700 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Recordar sesión</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Autenticación de dos factores</Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Permitir análisis anónimo</Label>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
                  <p className="text-sm text-red-200 mb-3">Zona de Peligro</p>
                  <Button variant="destructive" className="w-full">
                    Cerrar sesión en todos los dispositivos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end sticky bottom-6">
          <Button
            variant="outline"
            onClick={handleReset}
            className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Restaurar Predeterminados
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  );
}
