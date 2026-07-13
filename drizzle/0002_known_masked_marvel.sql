CREATE TABLE `dismissals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`client_id` int NOT NULL,
	`employee_id` varchar(100) NOT NULL,
	`employee_name` varchar(255) NOT NULL,
	`dismissal_date` varchar(10) NOT NULL,
	`dismissal_reason` enum('WITHOUT_CAUSE','WITH_CAUSE','RESIGNATION','RETIREMENT','DEATH','FORCE_MAJEURE','OTHER') NOT NULL,
	`notice_given` boolean DEFAULT true,
	`notice_start_date` varchar(10),
	`notice_end_date` varchar(10),
	`last_salary` decimal(15,2),
	`working_days_in_month` int,
	`status` enum('DRAFT','PROCESSING','COMPLETED','ERROR') DEFAULT 'DRAFT',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dismissals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `indemnifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dismissal_id` int NOT NULL,
	`client_id` int NOT NULL,
	`employee_id` varchar(100) NOT NULL,
	`years_of_service` decimal(5,2),
	`best_month_salary` decimal(15,2),
	`indemnity_amount` decimal(15,2),
	`vacation_days` int,
	`vacation_amount` decimal(15,2),
	`sac_amount` decimal(15,2),
	`integration_month` decimal(15,2),
	`total_amount` decimal(15,2),
	`status` enum('DRAFT','CALCULATED','APPROVED','PAID','ERROR') DEFAULT 'DRAFT',
	`calculated_at` timestamp,
	`approved_at` timestamp,
	`paid_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `indemnifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payroll_uploads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`client_id` int NOT NULL,
	`client_name` varchar(255) NOT NULL,
	`filename` varchar(255) NOT NULL,
	`file_key` varchar(500) NOT NULL,
	`file_type` enum('CSV','EXCEL','JSON') NOT NULL,
	`payroll_period` varchar(20) NOT NULL,
	`employee_count` int,
	`status` enum('UPLOADED','VALIDATING','PROCESSING','COMPLETED','FAILED') DEFAULT 'UPLOADED',
	`total_records` int,
	`successful_records` int DEFAULT 0,
	`failed_records` int DEFAULT 0,
	`error_details` json,
	`uploaded_by` int,
	`uploaded_at` timestamp NOT NULL DEFAULT (now()),
	`completed_at` timestamp,
	CONSTRAINT `payroll_uploads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `processing_queue` (
	`id` int AUTO_INCREMENT NOT NULL,
	`payroll_upload_id` int,
	`task_type` enum('VALIDATE','LIQUIDATE','CALCULATE_CHARGES','GENERATE_REPORT','EXPORT') NOT NULL,
	`priority` enum('LOW','MEDIUM','HIGH','CRITICAL') DEFAULT 'MEDIUM',
	`status` enum('PENDING','PROCESSING','COMPLETED','FAILED','RETRY') DEFAULT 'PENDING',
	`retry_count` int DEFAULT 0,
	`max_retries` int DEFAULT 3,
	`payload` json,
	`result` json,
	`error_message` text,
	`started_at` timestamp,
	`completed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `processing_queue_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `processing_status` (
	`id` int AUTO_INCREMENT NOT NULL,
	`payroll_upload_id` int NOT NULL,
	`total_tasks` int,
	`completed_tasks` int DEFAULT 0,
	`failed_tasks` int DEFAULT 0,
	`progress_percentage` decimal(5,2) DEFAULT '0',
	`current_stage` varchar(100),
	`estimated_time_remaining` int,
	`tasks_per_second` decimal(10,2),
	`last_update` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `processing_status_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `social_charges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`payroll_upload_id` int,
	`client_id` int NOT NULL,
	`payroll_period` varchar(20) NOT NULL,
	`charge_type` enum('EMPLOYER_CONTRIBUTION','WITHHOLDING','INSURANCE','FUND','OTHER') NOT NULL,
	`charge_description` varchar(255) NOT NULL,
	`charge_code` varchar(50),
	`percentage` decimal(5,2),
	`base_amount` decimal(15,2),
	`charge_amount` decimal(15,2),
	`status` enum('PENDING','CALCULATED','DECLARED','PAID') DEFAULT 'PENDING',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `social_charges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `agent_executions` MODIFY COLUMN `agent_type` enum('NORMATIVE_INTERPRETER','PRE_LIQUIDATOR','AUDITOR','COMMUNICATOR','DISMISSAL','INDEMNIFICATION','SOCIAL_CHARGES','VALIDATOR','MONITOR') NOT NULL;