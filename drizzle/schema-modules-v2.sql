-- ============================================
-- MÓDULOS V2: IMPUESTOS, CONTABILIDAD, FACTURACIÓN, CLIENTES
-- ============================================

-- TABLA: Clientes
CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  cuit VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(320),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- TABLA: Empleados
CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clientId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(320),
  phone VARCHAR(20),
  role VARCHAR(100),
  salary DECIMAL(15, 2),
  status ENUM('active', 'inactive', 'on_leave') DEFAULT 'active',
  hireDate DATE,
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE
);

-- TABLA: Impuestos
CREATE TABLE IF NOT EXISTS taxes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clientId INT NOT NULL,
  taxType ENUM('ganancias', 'iva', 'retenciones', 'aportes', 'otros') NOT NULL,
  period VARCHAR(20) NOT NULL, -- YYYY-MM
  amount DECIMAL(15, 2),
  rate DECIMAL(5, 2),
  status ENUM('pending', 'calculated', 'declared', 'paid') DEFAULT 'pending',
  dueDate DATE,
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE,
  UNIQUE KEY unique_tax_period (clientId, taxType, period)
);

-- TABLA: Asientos Contables
CREATE TABLE IF NOT EXISTS accounting_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clientId INT NOT NULL,
  description VARCHAR(255) NOT NULL,
  debit DECIMAL(15, 2),
  credit DECIMAL(15, 2),
  account VARCHAR(100),
  entryDate DATE,
  status ENUM('draft', 'posted', 'reversed') DEFAULT 'draft',
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE
);

-- TABLA: Balance General
CREATE TABLE IF NOT EXISTS balance_sheets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clientId INT NOT NULL,
  period VARCHAR(20) NOT NULL, -- YYYY-MM
  assets DECIMAL(15, 2),
  liabilities DECIMAL(15, 2),
  equity DECIMAL(15, 2),
  revenue DECIMAL(15, 2),
  expenses DECIMAL(15, 2),
  profit DECIMAL(15, 2),
  status ENUM('draft', 'approved', 'published') DEFAULT 'draft',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE,
  UNIQUE KEY unique_balance_period (clientId, period)
);

-- TABLA: Indicadores Económicos
CREATE TABLE IF NOT EXISTS economic_indicators (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clientId INT NOT NULL,
  period VARCHAR(20) NOT NULL, -- YYYY-MM
  grossMargin DECIMAL(5, 2),
  roi DECIMAL(5, 2),
  cashFlow DECIMAL(15, 2),
  projection DECIMAL(5, 2),
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE,
  UNIQUE KEY unique_indicator_period (clientId, period)
);

-- TABLA: Presupuestos
CREATE TABLE IF NOT EXISTS budgets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clientId INT NOT NULL,
  period VARCHAR(20) NOT NULL, -- YYYY-MM
  revenue DECIMAL(15, 2),
  expenses DECIMAL(15, 2),
  profit DECIMAL(15, 2),
  status ENUM('draft', 'approved', 'active', 'closed') DEFAULT 'draft',
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE,
  UNIQUE KEY unique_budget_period (clientId, period)
);

-- TABLA: Facturas
CREATE TABLE IF NOT EXISTS invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clientId INT NOT NULL,
  invoiceNumber VARCHAR(50) UNIQUE NOT NULL,
  invoiceDate DATE,
  dueDate DATE,
  amount DECIMAL(15, 2),
  description TEXT,
  status ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled') DEFAULT 'draft',
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE
);

-- TABLA: Recibos
CREATE TABLE IF NOT EXISTS receipts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clientId INT NOT NULL,
  receiptNumber VARCHAR(50) UNIQUE NOT NULL,
  receiptDate DATE,
  amount DECIMAL(15, 2),
  concept VARCHAR(255),
  status ENUM('draft', 'issued', 'cancelled') DEFAULT 'draft',
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE
);

-- TABLA: Notas de Crédito
CREATE TABLE IF NOT EXISTS credit_notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clientId INT NOT NULL,
  creditNoteNumber VARCHAR(50) UNIQUE NOT NULL,
  creditNoteDate DATE,
  amount DECIMAL(15, 2),
  reason VARCHAR(255),
  status ENUM('draft', 'issued', 'cancelled') DEFAULT 'draft',
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE
);

-- TABLA: Reportes
CREATE TABLE IF NOT EXISTS reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clientId INT NOT NULL,
  reportType ENUM('monthly', 'quarterly', 'annual', 'custom') NOT NULL,
  period VARCHAR(20),
  title VARCHAR(255),
  fileKey VARCHAR(500),
  url VARCHAR(500),
  status ENUM('draft', 'generated', 'sent') DEFAULT 'draft',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE
);

-- TABLA: Declaraciones de Impuestos
CREATE TABLE IF NOT EXISTS tax_declarations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clientId INT NOT NULL,
  declarationType ENUM('ganancias', 'iva', 'retenciones') NOT NULL,
  period VARCHAR(20) NOT NULL,
  fileKey VARCHAR(500),
  url VARCHAR(500),
  status ENUM('draft', 'generated', 'sent', 'accepted', 'rejected') DEFAULT 'draft',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE,
  UNIQUE KEY unique_declaration (clientId, declarationType, period)
);

-- TABLA: Tareas de Agentes (para módulos V2)
CREATE TABLE IF NOT EXISTS agent_tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clientId INT NOT NULL,
  taskType ENUM('calculate_taxes', 'generate_invoice', 'create_entry', 'generate_report', 'validate_data', 'send_notification') NOT NULL,
  module ENUM('taxes', 'accounting', 'billing', 'economy', 'clients') NOT NULL,
  status ENUM('pending', 'running', 'completed', 'failed') DEFAULT 'pending',
  input JSON,
  output JSON,
  errorMessage TEXT,
  executionTimeMs INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE
);

-- Índices para optimización
CREATE INDEX idx_clients_userId ON clients(userId);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_employees_clientId ON employees(clientId);
CREATE INDEX idx_taxes_clientId_period ON taxes(clientId, period);
CREATE INDEX idx_accounting_entries_clientId ON accounting_entries(clientId);
CREATE INDEX idx_balance_sheets_clientId_period ON balance_sheets(clientId, period);
CREATE INDEX idx_invoices_clientId_status ON invoices(clientId, status);
CREATE INDEX idx_receipts_clientId ON receipts(clientId);
CREATE INDEX idx_credit_notes_clientId ON credit_notes(clientId);
CREATE INDEX idx_agent_tasks_clientId_status ON agent_tasks(clientId, status);
