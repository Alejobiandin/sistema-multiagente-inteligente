/**
 * Módulo de Gestión de Clientes y Empleados
 */

import { useState } from "react";
import { Users, Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ClientsEmployeesModule() {
  const [activeTab, setActiveTab] = useState("clientes");
  const [searchTerm, setSearchTerm] = useState("");

  const clients = [
    { id: 1, name: "Empresa A", cuit: "30-12345678-9", status: "active", contact: "Juan Pérez" },
    { id: 2, name: "Empresa B", cuit: "30-87654321-0", status: "active", contact: "María García" },
    { id: 3, name: "Empresa C", cuit: "30-11223344-5", status: "inactive", contact: "Carlos López" }
  ];

  const employees = [
    { id: 1, name: "Juan Rodríguez", role: "Contador", status: "active", email: "juan@empresa.com" },
    { id: 2, name: "María González", role: "Asesor", status: "active", email: "maria@empresa.com" },
    { id: 3, name: "Pedro Martínez", role: "Auditor", status: "inactive", email: "pedro@empresa.com" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Gestión de Clientes y Empleados</h1>
        <p className="text-slate-400">Administra clientes, empleados y datos de contacto</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="empleados">Empleados</TabsTrigger>
          <TabsTrigger value="contactos">Contactos</TabsTrigger>
        </TabsList>

        {/* Clientes Tab */}
        <TabsContent value="clientes" className="space-y-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Buscar cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Cliente
            </Button>
          </div>

          <div className="space-y-3">
            {clients.map((client) => (
              <Card key={client.id} className="border-slate-700 bg-slate-800/50 backdrop-blur p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-white">{client.name}</p>
                    <p className="text-sm text-slate-400">CUIT: {client.cuit}</p>
                    <p className="text-sm text-slate-400">Contacto: {client.contact}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      client.status === "active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {client.status === "active" ? "Activo" : "Inactivo"}
                    </span>
                    <Button size="sm" variant="outline" className="border-slate-600">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-600">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Empleados Tab */}
        <TabsContent value="empleados" className="space-y-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Buscar empleado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Empleado
            </Button>
          </div>

          <div className="space-y-3">
            {employees.map((employee) => (
              <Card key={employee.id} className="border-slate-700 bg-slate-800/50 backdrop-blur p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-white">{employee.name}</p>
                    <p className="text-sm text-slate-400">Rol: {employee.role}</p>
                    <p className="text-sm text-slate-400">Email: {employee.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      employee.status === "active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {employee.status === "active" ? "Activo" : "Inactivo"}
                    </span>
                    <Button size="sm" variant="outline" className="border-slate-600">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-600">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Contactos Tab */}
        <TabsContent value="contactos" className="space-y-6">
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
            <h3 className="text-lg font-bold text-white mb-4">Contactos Importantes</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-slate-700/30">
                <p className="font-semibold text-white">AFIP</p>
                <p className="text-sm text-slate-400">Tel: 0800-999-2347</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-700/30">
                <p className="font-semibold text-white">Superintendencia de Seguros</p>
                <p className="text-sm text-slate-400">Tel: 0800-666-8726</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-700/30">
                <p className="font-semibold text-white">ANSES</p>
                <p className="text-sm text-slate-400">Tel: 130 (desde teléfono fijo)</p>
              </div>
            </div>
            <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">
              Agregar Contacto
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
