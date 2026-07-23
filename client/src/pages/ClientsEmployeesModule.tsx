/**
 * Módulo de Clientes y Empleados - Gestión de Contactos
 * Integrado con Agentes IA
 */

import { useState } from "react";
import { Users, Plus, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";

export default function ClientsEmployeesModule() {
  const [activeTab, setActiveTab] = useState("clients");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const clients = [
    { id: 1, name: "Empresa ABC", email: "contacto@abc.com", phone: "+54 11 1234-5678", status: "active" },
    { id: 2, name: "Negocio XYZ", email: "info@xyz.com", phone: "+54 11 8765-4321", status: "active" },
    { id: 3, name: "Corporación 123", email: "ventas@corp123.com", phone: "+54 11 5555-6666", status: "inactive" },
  ];

  const employees = [
    { id: 1, name: "Juan Pérez", role: "Contador", email: "juan@empresa.com", status: "active" },
    { id: 2, name: "María García", role: "Analista", email: "maria@empresa.com", status: "active" },
    { id: 3, name: "Carlos López", role: "Gerente", email: "carlos@empresa.com", status: "active" },
  ];

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400"
      : "bg-gray-500/10 border-gray-500/30 text-gray-700 dark:text-gray-400";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-secondary to-accent">
              <Users className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-secondary">Gestión de Contactos</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Clientes y Empleados</h1>
          <p className="text-lg text-muted-foreground">Gestiona clientes, empleados y contactos con IA</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="employees">Empleados</TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="space-y-6 animate-fade-in-up">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-card border-border"
                />
              </div>
              <Button className="bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 text-white h-10 font-semibold rounded-lg transition-all duration-300">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Cliente
              </Button>
            </div>

            <div className="space-y-3">
              {filteredClients.map((client) => (
                <div key={client.id} className="rounded-xl bg-card border border-border p-6 hover:border-secondary/50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <p className="font-bold text-foreground">{client.name}</p>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(client.status)}`}>
                          {client.status === "active" ? "Activo" : "Inactivo"}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{client.email} • {client.phone}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="employees" className="space-y-6 animate-fade-in-up">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar empleados..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-card border-border"
                />
              </div>
              <Button className="bg-gradient-to-r from-secondary to-primary hover:from-secondary/90 hover:to-primary/90 text-white h-10 font-semibold rounded-lg transition-all duration-300">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Empleado
              </Button>
            </div>

            <div className="space-y-3">
              {filteredEmployees.map((employee) => (
                <div key={employee.id} className="rounded-xl bg-card border border-border p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <p className="font-bold text-foreground">{employee.name}</p>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(employee.status)}`}>
                          {employee.status === "active" ? "Activo" : "Inactivo"}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{employee.role} • {employee.email}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Ver Perfil
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
