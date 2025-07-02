-- Myzuwa AI Agent System Instructions & History
-- Import this file into phpMyAdmin

CREATE TABLE IF NOT EXISTS `system_instructions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `system_instruction_history` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `instruction_id` INT UNSIGNED NOT NULL,
  `used_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`instruction_id`) REFERENCES `system_instructions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample instructions
INSERT INTO `system_instructions` (`title`, `content`) VALUES
('Default Security', 'You are a security AI agent. Answer questions about hacking, security, and system analysis.'),
('Strict Compliance', 'You are a security AI agent. Only answer questions that comply with strict security and legal guidelines.'),
('Friendly Helper', 'You are a helpful AI assistant for security topics. Be friendly and concise.');
