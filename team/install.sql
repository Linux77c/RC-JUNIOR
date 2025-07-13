-- Struttura della tabella `pilots`
CREATE TABLE `pilots` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `surname` varchar(50) NOT NULL,
  `category` enum('Junior','Senior') NOT NULL,
  `bio` text DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `social` text DEFAULT NULL COMMENT 'JSON con link social',
  `birth_date` date DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL COMMENT 'Password per accesso area piloti',
  `experience` varchar(50) DEFAULT NULL COMMENT 'Livello esperienza RC',
  `status` enum('active','inactive','deleted') NOT NULL DEFAULT 'active',
  `last_login` datetime DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL COMMENT 'Admin che ha approvato',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `-- RC Junior/Senior Team - Database Schema
-- Database: my_l3drc
-- Version: 1.0.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

-- Struttura della tabella `pilot_preferences`
CREATE TABLE `pilot_preferences` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pilot_id` int(11) NOT NULL,
  `notification_events` tinyint(1) NOT NULL DEFAULT 1,
  `notification_materials` tinyint(1) NOT NULL DEFAULT 1,
  `notification_results` tinyint(1) NOT NULL DEFAULT 1,
  `notification_news` tinyint(1) NOT NULL DEFAULT 1,
  `notification_reminders` tinyint(1) NOT NULL DEFAULT 0,
  `privacy_show_phone` tinyint(1) NOT NULL DEFAULT 0,
  `privacy_show_email` tinyint(1) NOT NULL DEFAULT 0,
  `theme_preference` enum('light','dark','auto') NOT NULL DEFAULT 'auto',
  `language` varchar(5) NOT NULL DEFAULT 'it',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pilot_id` (`pilot_id`),
  CONSTRAINT `fk_preferences_pilots` FOREIGN KEY (`pilot_id`) REFERENCES `pilots` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Preferenze di default per piloti esistenti
INSERT INTO `pilot_preferences` (`pilot_id`, `notification_events`, `notification_materials`, `notification_results`, `notification_news`) VALUES
(1, 1, 1, 1, 1),
(2, 1, 1, 1, 1),
(3, 1, 1, 1, 1),
(4, 1, 1, 1, 1),
(5, 1, 1, 1, 1);

-- --------------------------------------------------------

-- Struttura della tabella `pilot_sessions`
CREATE TABLE `pilot_sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pilot_id` int(11) NOT NULL,
  `session_token` varchar(255) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `login_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_activity` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` datetime NOT NULL,
  `status` enum('active','expired','revoked') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_token` (`session_token`),
  KEY `pilot_id` (`pilot_id`),
  KEY `expires_at` (`expires_at`),
  CONSTRAINT `fk_sessions_pilots` FOREIGN KEY (`pilot_id`) REFERENCES `pilots` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Struttura della tabella `admins`
CREATE TABLE `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `last_login` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `sponsorship_level` (`sponsorship_level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dati di esempio per sponsor
INSERT INTO `sponsors` (`name`, `description`, `website`, `email`, `sponsorship_level`, `status`) VALUES
('Evolution Modellismo', 'Partner principale del team. Fornisce materiali, supporto tecnico e visibilità nelle competizioni.', 'https://evolution-modellismo.com', 'info@evolution-modellismo.com', 'Platinum', 'active'),
('RC Parts Store', 'Fornitore di ricambi e accessori per RC Buggy 1/8', 'https://rcparts.it', 'vendite@rcparts.it', 'Gold', 'active');

-- --------------------------------------------------------

-- Struttura della tabella `tracks`
CREATE TABLE `tracks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(50) DEFAULT NULL,
  `province` varchar(2) DEFAULT NULL,
  `region` varchar(50) DEFAULT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `track_type` enum('sterrato','asfalto','misto') DEFAULT 'sterrato',
  `track_length` int(11) DEFAULT NULL COMMENT 'Lunghezza in metri',
  `surface_description` text DEFAULT NULL,
  `facilities` text DEFAULT NULL COMMENT 'Servizi disponibili',
  `opening_hours` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `visit_count` int(11) NOT NULL DEFAULT 0 COMMENT 'Numero visite del team',
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `city` (`city`),
  KEY `track_type` (`track_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dati di esempio per piste
INSERT INTO `tracks` (`name`, `address`, `city`, `province`, `track_type`, `track_length`, `surface_description`) VALUES
('Pista RC Milano', 'Via Roma 123, Milano', 'Milano', 'MI', 'sterrato', 800, 'Pista in terra battuta con salti e curve tecniche'),
('Autodromo RC Monza', 'Via delle Corse 45, Monza', 'Monza', 'MB', 'asfalto', 1200, 'Circuito asfaltato stile Formula 1 in scala'),
('RC Park Bergamo', 'Strada Provinciale 24, Bergamo', 'Bergamo', 'BG', 'misto', 1000, 'Percorso misto con sezioni sterrato e asfalto');

-- --------------------------------------------------------

-- Struttura della tabella `events`
CREATE TABLE `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `event_date` date NOT NULL,
  `event_time` time DEFAULT NULL,
  `track_id` int(11) NOT NULL,
  `event_type` enum('gara','allenamento','demo','meeting') NOT NULL DEFAULT 'gara',
  `category` enum('Junior','Senior','Entrambe') NOT NULL DEFAULT 'Entrambe',
  `registration_url` varchar(255) DEFAULT NULL,
  `results_url` varchar(255) DEFAULT NULL,
  `photo_gallery` text DEFAULT NULL COMMENT 'URLs delle foto',
  `team_participation` tinyint(1) NOT NULL DEFAULT 1,
  `notification_sent` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('active','cancelled','completed','deleted') NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `event_date` (`event_date`),
  KEY `track_id` (`track_id`),
  KEY `event_type` (`event_type`),
  CONSTRAINT `fk_events_tracks` FOREIGN KEY (`track_id`) REFERENCES `tracks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dati di esempio per eventi
INSERT INTO `events` (`name`, `description`, `event_date`, `event_time`, `track_id`, `event_type`, `category`) VALUES
('Gara Regionale Buggy 1/8', 'Prima partecipazione del team alla gara regionale lombarda', '2025-07-20', '09:00:00', 1, 'gara', 'Entrambe'),
('Allenamento Collettivo', 'Sessione di allenamento per preparare la gara di luglio', '2025-07-15', '14:00:00', 2, 'allenamento', 'Entrambe'),
('Demo Evolution Modellismo', 'Dimostrazione presso il negozio del nostro sponsor principale', '2025-08-05', '10:00:00', 3, 'demo', 'Senior');

-- --------------------------------------------------------

-- Struttura della tabella `materials`
CREATE TABLE `materials` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL COMMENT 'T-shirt, Cappellino, Gadget, etc.',
  `description` text DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `assigned_quantity` int(11) NOT NULL DEFAULT 0,
  `available_quantity` int(11) GENERATED ALWAYS AS (`quantity` - `assigned_quantity`) STORED,
  `sponsor_id` int(11) DEFAULT NULL,
  `supplier` varchar(100) DEFAULT NULL,
  `cost_per_unit` decimal(10,2) DEFAULT NULL,
  `total_cost` decimal(10,2) DEFAULT NULL,
  `received_date` date NOT NULL,
  `expiry_date` date DEFAULT NULL,
  `size_info` varchar(100) DEFAULT NULL COMMENT 'Taglie disponibili',
  `color` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('active','depleted','expired','deleted') NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `type` (`type`),
  KEY `sponsor_id` (`sponsor_id`),
  KEY `received_date` (`received_date`),
  CONSTRAINT `fk_materials_sponsors` FOREIGN KEY (`sponsor_id`) REFERENCES `sponsors` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dati di esempio per materiali
INSERT INTO `materials` (`type`, `description`, `quantity`, `sponsor_id`, `received_date`, `size_info`, `color`) VALUES
('T-Shirt', 'Magliette ufficiali del team con logo Evolution Modellismo', 20, 1, '2025-07-01', 'XS(2), S(4), M(6), L(5), XL(3)', 'Arancione/Nero'),
('Cappellino', 'Cappellini con logo team e sponsor', 15, 1, '2025-07-01', 'Taglia unica regolabile', 'Nero'),
('Adesivi', 'Set adesivi per carrozzerie con loghi sponsor', 50, 1, '2025-07-01', 'Set da 10 pezzi', 'Multicolore'),
('Portachiavi', 'Gadget promozionale a forma di buggy', 30, 1, '2025-07-01', NULL, 'Arancione'),
('Borraccia', 'Borracce termiche brandizzate team', 12, 1, '2025-07-05', '500ml', 'Nero/Arancione');

-- --------------------------------------------------------

-- Struttura della tabella `material_assignments`
CREATE TABLE `material_assignments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `material_id` int(11) NOT NULL,
  `pilot_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `size` varchar(20) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `assigned_date` date NOT NULL,
  `assigned_by` int(11) DEFAULT NULL COMMENT 'ID admin che ha fatto assegnazione',
  `returned_date` date DEFAULT NULL,
  `status` enum('assigned','returned','lost') NOT NULL DEFAULT 'assigned',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `material_id` (`material_id`),
  KEY `pilot_id` (`pilot_id`),
  KEY `assigned_date` (`assigned_date`),
  CONSTRAINT `fk_assignments_materials` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_assignments_pilots` FOREIGN KEY (`pilot_id`) REFERENCES `pilots` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_assignments_admins` FOREIGN KEY (`assigned_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dati di esempio per assegnazioni
INSERT INTO `material_assignments` (`material_id`, `pilot_id`, `quantity`, `size`, `assigned_date`, `notes`) VALUES
(1, 1, 1, 'L', '2025-07-02', 'T-shirt per gara regionale'),
(1, 2, 1, 'M', '2025-07-02', 'Prima maglietta ufficiale'),
(2, 1, 1, NULL, '2025-07-02', 'Cappellino da gara'),
(2, 2, 1, NULL, '2025-07-02', 'Cappellino da allenamento'),
(3, 1, 1, NULL, '2025-07-03', 'Set adesivi per carrozzeria principale'),
(4, 1, 1, NULL, '2025-07-03', 'Portachiavi promozionale'),
(5, 1, 1, NULL, '2025-07-06', 'Borraccia per idratazione gare');

-- --------------------------------------------------------

-- Struttura della tabella `notifications`
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` enum('event','news','material','general','admin') NOT NULL DEFAULT 'general',
  `title` varchar(150) NOT NULL,
  `message` text NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `pilot_id` int(11) DEFAULT NULL COMMENT 'Se NULL, notifica per tutti',
  `category_filter` enum('Junior','Senior','Entrambe') DEFAULT 'Entrambe',
  `priority` enum('low','normal','high','urgent') NOT NULL DEFAULT 'normal',
  `scheduled_send` datetime DEFAULT NULL,
  `sent_at` datetime DEFAULT NULL,
  `delivered_count` int(11) NOT NULL DEFAULT 0,
  `read_count` int(11) NOT NULL DEFAULT 0,
  `status` enum('draft','scheduled','sent','failed') NOT NULL DEFAULT 'draft',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `type` (`type`),
  KEY `sent_at` (`sent_at`),
  KEY `event_id` (`event_id`),
  KEY `pilot_id` (`pilot_id`),
  CONSTRAINT `fk_notifications_events` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_notifications_pilots` FOREIGN KEY (`pilot_id`) REFERENCES `pilots` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dati di esempio per notifiche
INSERT INTO `notifications` (`type`, `title`, `message`, `event_id`, `priority`, `status`, `sent_at`) VALUES
('event', 'Nuova Gara Team', '🏁 Il team RC Junior/Senior parteciperà alla gara del 20/07/2025 presso Pista RC Milano', 1, 'high', 'sent', '2025-07-10 10:00:00'),
('news', 'Benvenuto nel team', 'Benvenuto Luca Bianchi! Nuovo pilota Junior nel nostro team.', NULL, 'normal', 'sent', '2025-07-01 15:30:00'),
('material', 'Materiali Disponibili', 'Sono arrivati i nuovi materiali da Evolution Modellismo! Magliette e cappellini per tutti.', NULL, 'normal', 'sent', '2025-07-01 16:00:00');

-- --------------------------------------------------------

-- Struttura della tabella `sponsor_requests`
CREATE TABLE `sponsor_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_name` varchar(100) NOT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `business_type` varchar(100) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `proposed_sponsorship` enum('Bronze','Silver','Gold','Platinum','Custom') DEFAULT 'Bronze',
  `budget_range` varchar(50) DEFAULT NULL,
  `marketing_goals` text DEFAULT NULL,
  `status` enum('new','contacted','in_progress','accepted','rejected','expired') NOT NULL DEFAULT 'new',
  `admin_notes` text DEFAULT NULL,
  `response_date` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Struttura della tabella `event_results`
CREATE TABLE `event_results` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `pilot_id` int(11) NOT NULL,
  `position` int(11) DEFAULT NULL,
  `category` enum('Junior','Senior') NOT NULL,
  `qualifying_time` time DEFAULT NULL,
  `best_lap_time` time DEFAULT NULL,
  `total_race_time` time DEFAULT NULL,
  `points_earned` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `dnf_reason` varchar(100) DEFAULT NULL COMMENT 'Did Not Finish reason',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_pilot_event` (`event_id`, `pilot_id`),
  KEY `pilot_id` (`pilot_id`),
  KEY `position` (`position`),
  CONSTRAINT `fk_results_events` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_results_pilots` FOREIGN KEY (`pilot_id`) REFERENCES `pilots` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Struttura della tabella `app_settings`
CREATE TABLE `app_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(50) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `setting_type` enum('string','integer','boolean','json') NOT NULL DEFAULT 'string',
  `description` text DEFAULT NULL,
  `category` varchar(50) DEFAULT 'general',
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Impostazioni di default
INSERT INTO `app_settings` (`setting_key`, `setting_value`, `setting_type`, `description`, `category`) VALUES
('app_name', 'RC Junior/Senior', 'string', 'Nome dell\'applicazione', 'general'),
('app_version', '1.0.0', 'string', 'Versione dell\'applicazione', 'general'),
('team_email', 'l3drc@altervista.org', 'string', 'Email principale del team', 'contact'),
('team_phone', '', 'string', 'Telefono del team', 'contact'),
('team_address', '', 'string', 'Indirizzo sede team', 'contact'),
('notifications_enabled', 'true', 'boolean', 'Notifiche push abilitate', 'notifications'),
('max_pilots', '50', 'integer', 'Numero massimo piloti', 'limits'),
('auto_notification_events', 'true', 'boolean', 'Invio automatico notifiche eventi', 'notifications'),
('theme_color', '#FF6B35', 'string', 'Colore tema principale', 'appearance'),
('logo_url', '', 'string', 'URL logo del team', 'appearance');

-- --------------------------------------------------------

-- Indici aggiuntivi per performance
CREATE INDEX `idx_pilots_category_status` ON `pilots` (`category`, `status`);
CREATE INDEX `idx_events_date_type` ON `events` (`event_date`, `event_type`);
CREATE INDEX `idx_materials_type_status` ON `materials` (`type`, `status`);
CREATE INDEX `idx_assignments_pilot_date` ON `material_assignments` (`pilot_id`, `assigned_date`);
CREATE INDEX `idx_notifications_type_status` ON `notifications` (`type`, `status`);

-- --------------------------------------------------------

-- Trigger per aggiornare visit_count delle piste
DELIMITER $
CREATE TRIGGER `update_track_visit_count` 
AFTER INSERT ON `events` 
FOR EACH ROW 
BEGIN
    UPDATE `tracks` 
    SET `visit_count` = `visit_count` + 1 
    WHERE `id` = NEW.`track_id`;
END$
DELIMITER ;

-- --------------------------------------------------------

-- Vista per statistiche piloti
CREATE VIEW `pilot_stats` AS
SELECT 
    p.id,
    p.name,
    p.surname,
    p.category,
    COUNT(ma.id) as materials_received,
    COUNT(er.id) as events_participated,
    AVG(er.position) as avg_position,
    MIN(er.position) as best_position
FROM pilots p
LEFT JOIN material_assignments ma ON p.id = ma.pilot_id
LEFT JOIN event_results er ON p.id = er.pilot_id
WHERE p.status = 'active'
GROUP BY p.id;

-- --------------------------------------------------------

-- Vista per statistiche sponsor
CREATE VIEW `sponsor_stats` AS
SELECT 
    s.id,
    s.name,
    s.sponsorship_level,
    COUNT(m.id) as materials_provided,
    SUM(m.quantity) as total_items,
    SUM(m.total_cost) as total_investment
FROM sponsors s
LEFT JOIN materials m ON s.id = m.sponsor_id
WHERE s.status = 'active'
GROUP BY s.id;

-- --------------------------------------------------------

-- Procedura per backup dati
DELIMITER $
CREATE PROCEDURE `backup_team_data`()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE backup_date VARCHAR(20);
    
    SET backup_date = DATE_FORMAT(NOW(), '%Y%m%d_%H%i%s');
    
    -- Log dell'operazione
    INSERT INTO app_settings (setting_key, setting_value, setting_type, description) 
    VALUES (CONCAT('last_backup_', backup_date), NOW(), 'string', 'Ultimo backup dei dati');
    
END$
DELIMITER ;

-- --------------------------------------------------------

COMMIT;

-- Messaggio di completamento
SELECT 'Database RC Junior/Senior Team creato con successo!' as Message,
       '1.0.0' as Version,
       NOW() as Created_At;at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserimento admin di default
INSERT INTO `admins` (`username`, `password_hash`, `email`, `full_name`, `status`) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'l3drc@altervista.org', 'Amministratore RC Team', 'active');
-- Password di default: rcteam2025

-- --------------------------------------------------------

-- Struttura della tabella `pilots`
CREATE TABLE `pilots` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `surname` varchar(50) NOT NULL,
  `category` enum('Junior','Senior') NOT NULL,
  `bio` text DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `social` text DEFAULT NULL COMMENT 'JSON con link social',
  `birth_date` date DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL COMMENT 'Password per accesso area piloti',
  `experience` varchar(50) DEFAULT NULL COMMENT 'Livello esperienza RC',
  `status` enum('active','inactive','deleted') NOT NULL DEFAULT 'active',
  `last_login` datetime DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL COMMENT 'Admin che ha approvato',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `category` (`category`),
  KEY `status` (`status`),
  CONSTRAINT `fk_pilots_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dati di esempio per piloti (con password hash)
INSERT INTO `pilots` (`name`, `surname`, `category`, `bio`, `email`, `password_hash`, `experience`, `status`) VALUES
('Marco', 'Rossi', 'Senior', 'Pilota esperto con 10 anni di esperienza nel RC Buggy 1/8. Specializzato in gare su sterrato e asfalto.', 'marco.rossi@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'esperto', 'active'),
('Luca', 'Bianchi', 'Junior', 'Giovane promessa del team, molto determinato e in rapida crescita. Primo anno di competizioni.', 'luca.bianchi@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'principiante', 'active'),
('Andrea', 'Verdi', 'Senior', 'Specialista in setup e tuning, mentor dei piloti Junior. Meccanico di professione.', 'andrea.verdi@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'esperto', 'active'),
('Sofia', 'Neri', 'Junior', 'Unica ragazza del team, grande passione per la velocità e la precisione di guida.', 'sofia.neri@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'intermedio', 'active'),
('Giuseppe', 'Bruno', 'Senior', 'Veterano delle competizioni RC, fondatore del team. 15 anni di esperienza.', 'giuseppe.bruno@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'esperto', 'active');
-- Password di default per tutti i piloti: "pilot123"

-- --------------------------------------------------------

-- Struttura della tabella `pilot_registrations`
CREATE TABLE `pilot_registrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `surname` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `birth_date` date NOT NULL,
  `category` enum('Junior','Senior') NOT NULL,
  `experience` varchar(50) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `accept_notifications` tinyint(1) NOT NULL DEFAULT 1,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `approved_by` int(11) DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `rejected_by` int(11) DEFAULT NULL,
  `rejected_at` datetime DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `status` (`status`),
  KEY `created_at` (`created_at`),
  CONSTRAINT `fk_registrations_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_registrations_rejected_by` FOREIGN KEY (`rejected_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dati di esempio per registrazioni in attesa
INSERT INTO `pilot_registrations` (`name`, `surname`, `email`, `phone`, `birth_date`, `category`, `experience`, `password_hash`, `bio`, `accept_notifications`, `status`) VALUES
('Alessandro', 'Gialli', 'alessandro.gialli@email.com', '333-1234567', '2008-03-15', 'Junior', 'principiante', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sono appassionato di RC da poco e vorrei imparare dai migliori. Ho un Buggy 1/8 entry level e tanta voglia di migliorare!', 1, 'pending'),
('Roberto', 'Blu', 'roberto.blu@email.com', '349-9876543', '1985-11-22', 'Senior', 'intermedio', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ho 5 anni di esperienza nel RC touring, ma voglio passare ai Buggy 1/8. Cerco un team serio per crescere nelle competizioni.', 1, 'pending');

-- --------------------------------------------------------

-- Struttura della tabella `sponsors`
CREATE TABLE `sponsors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `sponsorship_level` enum('Bronze','Silver','Gold','Platinum') DEFAULT 'Bronze',
  `contract_start` date DEFAULT NULL,
  `contract_end` date DEFAULT NULL,
  `status` enum('active','inactive','expired','deleted') NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_