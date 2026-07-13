CREATE TABLE `agent_executions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`case_id` int NOT NULL,
	`agent_type` enum('NORMATIVE_INTERPRETER','PRE_LIQUIDATOR','AUDITOR','COMMUNICATOR') NOT NULL,
	`stage` enum('COLLECTION','ANALYSIS','PRE_LIQUIDATION','AUDIT','APPROVAL','EMISSION','PRESENTATION','CLOSED'),
	`input` json,
	`output` json,
	`reasoning` text,
	`status` enum('PENDING','RUNNING','SUCCESS','FAILED','PARTIAL') DEFAULT 'PENDING',
	`error_message` text,
	`execution_time_ms` int,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `agent_executions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `audit_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`case_id` int,
	`user_id` int,
	`action` varchar(100) NOT NULL,
	`actor` varchar(100) NOT NULL,
	`details` json,
	`changes_before` json,
	`changes_after` json,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `case_stages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`case_id` int NOT NULL,
	`stage` enum('COLLECTION','ANALYSIS','PRE_LIQUIDATION','AUDIT','APPROVAL','EMISSION','PRESENTATION','CLOSED') NOT NULL,
	`started_at` timestamp NOT NULL DEFAULT (now()),
	`completed_at` timestamp,
	`notes` text,
	`duration_minutes` int,
	CONSTRAINT `case_stages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dna_organizational` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` enum('TECHNICAL_CRITERIA','INTERNAL_RULES','POLICIES','TEMPLATES','JURISPRUDENCE','WORKFLOWS','LEARNING') NOT NULL,
	`key` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`description` text,
	`version` int DEFAULT 1,
	`active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dna_organizational_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`case_id` int NOT NULL,
	`filename` varchar(255) NOT NULL,
	`file_key` varchar(500) NOT NULL,
	`url` varchar(500) NOT NULL,
	`document_type` enum('RECEIPT','DECLARATION','REGULATORY','PAYSLIP','PROOF','OTHER') NOT NULL,
	`mime_type` varchar(100),
	`file_size` int,
	`uploaded_by` int,
	`uploaded_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `human_approvals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`case_id` int NOT NULL,
	`stage` enum('COLLECTION','ANALYSIS','PRE_LIQUIDATION','AUDIT','APPROVAL','EMISSION','PRESENTATION','CLOSED') NOT NULL,
	`agent_execution_id` int,
	`supervisor_id` int NOT NULL,
	`decision` enum('APPROVED','REJECTED','MODIFIED','PENDING') DEFAULT 'PENDING',
	`reasoning` text,
	`modifications` json,
	`learned_rule` text,
	`learned_rule_category` enum('TECHNICAL_CRITERIA','INTERNAL_RULES','POLICIES','TEMPLATES','JURISPRUDENCE','WORKFLOWS','LEARNING'),
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `human_approvals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `news_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`case_id` int,
	`news_type` enum('SALARY_CHANGE','HIRING','TERMINATION','BENEFIT_CHANGE','TAX_UPDATE','REGULATORY_CHANGE','OTHER') NOT NULL,
	`content` text NOT NULL,
	`source` enum('MANUAL','EMAIL','CHAT','API','DOCUMENT','OFFICIAL_ORGANISM') NOT NULL,
	`classification` varchar(100),
	`priority` enum('LOW','MEDIUM','HIGH','CRITICAL') DEFAULT 'MEDIUM',
	`attachment_url` varchar(500),
	`processed` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `news_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`case_id` int,
	`notification_type` enum('ANOMALY_DETECTED','APPROVAL_REQUIRED','STAGE_COMPLETED','CASE_COMPLETED','ERROR_OCCURRED','INFO') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text,
	`read` boolean DEFAULT false,
	`action_url` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`read_at` timestamp,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payroll_cases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`client_id` int NOT NULL,
	`client_name` varchar(255) NOT NULL,
	`status` enum('DRAFT','ACTIVE','COMPLETED','PAUSED','ERROR') NOT NULL DEFAULT 'DRAFT',
	`current_stage` enum('COLLECTION','ANALYSIS','PRE_LIQUIDATION','AUDIT','APPROVAL','EMISSION','PRESENTATION','CLOSED') NOT NULL DEFAULT 'COLLECTION',
	`payroll_period` varchar(20) NOT NULL,
	`employee_count` int,
	`total_amount` decimal(15,2),
	`metadata` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payroll_cases_id` PRIMARY KEY(`id`)
);
