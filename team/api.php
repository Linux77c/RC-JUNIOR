<?php
/**
 * RC Junior/Senior Team - Backend API
 * Gestisce le chiamate AJAX e le funzionalità backend
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Gestione richieste OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configurazione database
$config = [
    'host' => 'localhost',
    'dbname' => 'my_l3drc',
    'username' => 'l3drc',
    'password' => 'qnTs5XKFnwCY',
    'charset' => 'utf8mb4'
];

// Classe per gestione database
class Database {
    private $pdo;
    
    public function __construct($config) {
        try {
            $dsn = "mysql:host={$config['host']};dbname={$config['dbname']};charset={$config['charset']}";
            $this->pdo = new PDO($dsn, $config['username'], $config['password'], [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]);
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            throw new Exception("Errore di connessione al database");
        }
    }
    
    public function getPDO() {
        return $this->pdo;
    }
    
    public function query($sql, $params = []) {
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            error_log("Query failed: " . $e->getMessage() . " SQL: " . $sql);
            throw new Exception("Errore nella query");
        }
    }
    
    public function fetchAll($sql, $params = []) {
        return $this->query($sql, $params)->fetchAll();
    }
    
    public function fetchOne($sql, $params = []) {
        return $this->query($sql, $params)->fetch();
    }
    
    public function lastInsertId() {
        return $this->pdo->lastInsertId();
    }
}

// Classe per gestione piloti
class PilotsManager {
    private $db;
    
    public function __construct($database) {
        $this->db = $database;
    }
    
    public function getAll() {
        return $this->db->fetchAll("
            SELECT id, name, surname, category, bio, photo, social, status, created_at 
            FROM pilots 
            WHERE status = 'active' 
            ORDER BY category DESC, surname ASC
        ");
    }
    
    public function getById($id) {
        return $this->db->fetchOne("
            SELECT * FROM pilots WHERE id = ?
        ", [$id]);
    }
    
    public function create($data) {
        $sql = "
            INSERT INTO pilots (name, surname, category, bio, photo, social, status, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, 'active', NOW())
        ";
        $this->db->query($sql, [
            $data['name'],
            $data['surname'],
            $data['category'],
            $data['bio'] ?? '',
            $data['photo'] ?? '',
            $data['social'] ?? ''
        ]);
        return $this->db->lastInsertId();
    }
    
    public function update($id, $data) {
        $sql = "
            UPDATE pilots 
            SET name = ?, surname = ?, category = ?, bio = ?, photo = ?, social = ?, updated_at = NOW()
            WHERE id = ?
        ";
        return $this->db->query($sql, [
            $data['name'],
            $data['surname'],
            $data['category'],
            $data['bio'] ?? '',
            $data['photo'] ?? '',
            $data['social'] ?? '',
            $id
        ]);
    }
    
    public function delete($id) {
        // Soft delete
        return $this->db->query("
            UPDATE pilots SET status = 'deleted', updated_at = NOW() WHERE id = ?
        ", [$id]);
    }
    
    public function getStats() {
        $stats = $this->db->fetchOne("
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN category = 'Junior' THEN 1 END) as junior,
                COUNT(CASE WHEN category = 'Senior' THEN 1 END) as senior
            FROM pilots 
            WHERE status = 'active'
        ");
        return $stats;
    }
}

// Classe per gestione sponsor
class SponsorsManager {
    private $db;
    
    public function __construct($database) {
        $this->db = $database;
    }
    
    public function getAll() {
        return $this->db->fetchAll("
            SELECT id, name, description, website, logo, email, phone, status, created_at 
            FROM sponsors 
            WHERE status = 'active' 
            ORDER BY name ASC
        ");
    }
    
    public function create($data) {
        $sql = "
            INSERT INTO sponsors (name, description, website, logo, email, phone, status, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, 'active', NOW())
        ";
        $this->db->query($sql, [
            $data['name'],
            $data['description'] ?? '',
            $data['website'] ?? '',
            $data['logo'] ?? '',
            $data['email'] ?? '',
            $data['phone'] ?? ''
        ]);
        return $this->db->lastInsertId();
    }
    
    public function delete($id) {
        return $this->db->query("
            UPDATE sponsors SET status = 'deleted', updated_at = NOW() WHERE id = ?
        ", [$id]);
    }
}

// Classe per gestione eventi
class EventsManager {
    private $db;
    
    public function __construct($database) {
        $this->db = $database;
    }
    
    public function getAll() {
        return $this->db->fetchAll("
            SELECT e.*, t.name as track_name, t.address as track_address, t.city as track_city
            FROM events e
            LEFT JOIN tracks t ON e.track_id = t.id
            WHERE e.status = 'active'
            ORDER BY e.event_date DESC
        ");
    }
    
    public function create($data) {
        // Prima crea/trova la pista
        $track_id = $this->findOrCreateTrack($data['track']);
        
        $sql = "
            INSERT INTO events (name, event_date, track_id, description, status, created_at) 
            VALUES (?, ?, ?, ?, 'active', NOW())
        ";
        $this->db->query($sql, [
            $data['name'],
            $data['date'],
            $track_id,
            $data['description'] ?? ''
        ]);
        
        $event_id = $this->db->lastInsertId();
        
        // Invia notifica se richiesta
        if ($data['send_notification'] ?? false) {
            $this->sendEventNotification($event_id, $data);
        }
        
        return $event_id;
    }
    
    private function findOrCreateTrack($trackData) {
        // Cerca pista esistente
        $existing = $this->db->fetchOne("
            SELECT id FROM tracks WHERE name = ? AND address = ?
        ", [$trackData['name'], $trackData['address']]);
        
        if ($existing) {
            return $existing['id'];
        }
        
        // Crea nuova pista
        $this->db->query("
            INSERT INTO tracks (name, address, city, created_at) 
            VALUES (?, ?, ?, NOW())
        ", [
            $trackData['name'],
            $trackData['address'],
            $trackData['city'] ?? ''
        ]);
        
        return $this->db->lastInsertId();
    }
    
    private function sendEventNotification($event_id, $eventData) {
        // Registra notifica nel database
        $this->db->query("
            INSERT INTO notifications (type, title, message, event_id, created_at) 
            VALUES ('event', ?, ?, ?, NOW())
        ", [
            'Nuovo Evento Team',
            "🏁 {$eventData['name']} il " . date('d/m/Y', strtotime($eventData['date'])) . " presso {$eventData['track']['name']}",
            $event_id
        ]);
        
        // In un'implementazione reale, qui invieresti le notifiche push
        // usando un servizio come Firebase Cloud Messaging o similar
    }
}

// Classe per gestione upload immagini
class ImageManager {
    private $uploadPath = 'img/';
    private $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
    private $maxSize = 5 * 1024 * 1024; // 5MB
    
    public function uploadImage($file, $folder) {
        if (!isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
            throw new Exception('Nessun file caricato');
        }
        
        // Verifica dimensione
        if ($file['size'] > $this->maxSize) {
            throw new Exception('File troppo grande (max 5MB)');
        }
        
        // Verifica tipo
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($extension, $this->allowedTypes)) {
            throw new Exception('Tipo file non supportato');
        }
        
        // Crea nome file unico
        $filename = uniqid() . '_' . time() . '.' . $extension;
        $uploadDir = $this->uploadPath . $folder . '/';
        
        // Crea cartella se non esistet
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        $uploadFile = $uploadDir . $filename;
        
        // Sposta file
        if (move_uploaded_file($file['tmp_name'], $uploadFile)) {
            // Ottimizza immagine
            $this->optimizeImage($uploadFile, $folder);
            return $filename;
        } else {
            throw new Exception('Errore durante il caricamento');
        }
    }
    
    private function optimizeImage($filePath, $folder) {
        $imageInfo = getimagesize($filePath);
        if (!$imageInfo) return;
        
        $mime = $imageInfo['mime'];
        
        // Carica immagine in base al tipo
        switch ($mime) {
            case 'image/jpeg':
                $image = imagecreatefromjpeg($filePath);
                break;
            case 'image/png':
                $image = imagecreatefrompng($filePath);
                break;
            case 'image/gif':
                $image = imagecreatefromgif($filePath);
                break;
            default:
                return;
        }
        
        if (!$image) return;
        
        // Ridimensiona in base al tipo
        $maxWidth = $this->getMaxWidth($folder);
        $maxHeight = $this->getMaxHeight($folder);
        
        $width = imagesx($image);
        $height = imagesy($image);
        
        if ($width > $maxWidth || $height > $maxHeight) {
            $ratio = min($maxWidth / $width, $maxHeight / $height);
            $newWidth = intval($width * $ratio);
            $newHeight = intval($height * $ratio);
            
            $resized = imagecreatetruecolor($newWidth, $newHeight);
            
            // Mantieni trasparenza per PNG
            if ($mime === 'image/png') {
                imagealphablending($resized, false);
                imagesavealpha($resized, true);
            }
            
            imagecopyresampled($resized, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
            
            // Salva immagine ottimizzata
            switch ($mime) {
                case 'image/jpeg':
                    imagejpeg($resized, $filePath, 85);
                    break;
                case 'image/png':
                    imagepng($resized, $filePath, 6);
                    break;
                case 'image/gif':
                    imagegif($resized, $filePath);
                    break;
            }
            
            imagedestroy($resized);
        }
        
        imagedestroy($image);
    }
    
    private function getMaxWidth($folder) {
        switch ($folder) {
            case 'pilots': return 300;
            case 'sponsors': return 400;
            case 'events': return 800;
            case 'materials': return 600;
            case 'logo': return 500;
            case 'icons': return 512;
            default: return 800;
        }
    }
    
    private function getMaxHeight($folder) {
        switch ($folder) {
            case 'pilots': return 300;
            case 'sponsors': return 300;
            case 'events': return 600;
            case 'materials': return 600;
            case 'logo': return 500;
            case 'icons': return 512;
            default: return 600;
        }
    }
    
    public function deleteImage($filename, $folder) {
        $filePath = $this->uploadPath . $folder . '/' . $filename;
        if (file_exists($filePath)) {
            return unlink($filePath);
        }
        return false;
    }
}
    private $db;
    
    public function __construct($database) {
        $this->db = $database;
    }
    
    public function getAll() {
        return $this->db->fetchAll("
            SELECT m.*, s.name as sponsor_name 
            FROM materials m
            LEFT JOIN sponsors s ON m.sponsor_id = s.id
            WHERE m.status = 'active'
            ORDER BY m.received_date DESC
        ");
    }
    
    public function create($data) {
        $sql = "
            INSERT INTO materials (type, description, quantity, sponsor_id, received_date, status, created_at) 
            VALUES (?, ?, ?, ?, ?, 'active', NOW())
        ";
        $this->db->query($sql, [
            $data['type'],
            $data['description'] ?? '',
            $data['quantity'],
            $data['sponsor_id'] ?? null,
            $data['received_date'] ?? date('Y-m-d')
        ]);
        return $this->db->lastInsertId();
    }
    
    public function assignToPilot($material_id, $pilot_id, $quantity, $notes = '') {
        $sql = "
            INSERT INTO material_assignments (material_id, pilot_id, quantity, notes, assigned_date, created_at) 
            VALUES (?, ?, ?, ?, NOW(), NOW())
        ";
        $this->db->query($sql, [$material_id, $pilot_id, $quantity, $notes]);
        
        // Aggiorna quantità disponibile
        $this->db->query("
            UPDATE materials 
            SET assigned_quantity = COALESCE(assigned_quantity, 0) + ? 
            WHERE id = ?
        ", [$quantity, $material_id]);
        
        return $this->db->lastInsertId();
    }
    
    public function getAssignments() {
        return $this->db->fetchAll("
            SELECT ma.*, m.type as material_type, m.description as material_description,
                   p.name as pilot_name, p.surname as pilot_surname, p.category as pilot_category
            FROM material_assignments ma
            JOIN materials m ON ma.material_id = m.id
            JOIN pilots p ON ma.pilot_id = p.id
            ORDER BY ma.assigned_date DESC
        ");
    }
    
    public function getPilotAssignments($pilotId) {
        return $this->db->fetchAll("
            SELECT ma.*, m.type as material_type, m.description as material_description
            FROM material_assignments ma
            JOIN materials m ON ma.material_id = m.id
            WHERE ma.pilot_id = ?
            ORDER BY ma.assigned_date DESC
        ", [$pilotId]);
    }
}

// Classe per autenticazione admin
class AuthManager {
    private $db;
    
    public function __construct($database) {
        $this->db = $database;
    }
    
    public function login($username, $password) {
        $admin = $this->db->fetchOne("
            SELECT id, username, password_hash, email, last_login 
            FROM admins 
            WHERE username = ? AND status = 'active'
        ", [$username]);
        
        if ($admin && password_verify($password, $admin['password_hash'])) {
            // Aggiorna ultimo accesso
            $this->db->query("
                UPDATE admins SET last_login = NOW() WHERE id = ?
            ", [$admin['id']]);
            
            session_start();
            $_SESSION['admin_id'] = $admin['id'];
            $_SESSION['admin_username'] = $admin['username'];
            
            return [
                'success' => true,
                'admin' => [
                    'id' => $admin['id'],
                    'username' => $admin['username'],
                    'email' => $admin['email']
                ]
            ];
        }
        
        return ['success' => false, 'message' => 'Credenziali non valide'];
    }
    
    public function logout() {
        session_start();
        session_destroy();
        return ['success' => true];
    }
    
    public function isLoggedIn() {
        session_start();
        return isset($_SESSION['admin_id']);
    }
}

// Inizializzazione
try {
    $database = new Database($config);
    $pilotsManager = new PilotsManager($database);
    $sponsorsManager = new SponsorsManager($database);
    $eventsManager = new EventsManager($database);
    $materialsManager = new MaterialsManager($database);
    $authManager = new AuthManager($database);
    $imageManager = new ImageManager();
    $registrationManager = new RegistrationManager($database);
    $pilotAuthManager = new PilotAuthManager($database);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Errore di inizializzazione: ' . $e->getMessage()]);
    exit();
}

// Routing delle richieste
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? $_GET['action'] ?? '';

try {
    switch ($action) {
        // Upload immagini
        case 'upload_image':
            if ($method !== 'POST') throw new Exception('Metodo non consentito');
            if (!$authManager->isLoggedIn()) throw new Exception('Non autorizzato');
            
            if (!isset($_FILES['image'])) {
                throw new Exception('Nessun file selezionato');
            }
            
            $folder = $_POST['folder'] ?? 'general';
            $filename = $imageManager->uploadImage($_FILES['image'], $folder);
            echo json_encode(['success' => true, 'filename' => $filename]);
            break;
            
        // Registrazione piloti
        case 'pilot_register':
            if ($method !== 'POST') throw new Exception('Metodo non consentito');
            
            // Validazione email univoca
            $existingPilot = $database->fetchOne("
                SELECT id FROM pilots WHERE email = ? 
                UNION 
                SELECT id FROM pilot_registrations WHERE email = ? AND status = 'pending'
            ", [$input['email'], $input['email']]);
            
            if ($existingPilot) {
                throw new Exception('Email già registrata');
            }
            
            $regId = $registrationManager->createRegistration($input);
            echo json_encode(['success' => true, 'registration_id' => $regId]);
            break;
            
        // Autenticazione piloti
        case 'pilot_login':
            if ($method !== 'POST') throw new Exception('Metodo non consentito');
            $result = $pilotAuthManager->login($input['email'], $input['password']);
            echo json_encode($result);
            break;
            
        case 'pilot_logout':
            $result = $pilotAuthManager->logout();
            echo json_encode($result);
            break;
            
        case 'pilot_profile':
            if (!$pilotAuthManager->isLoggedIn()) throw new Exception('Non autorizzato');
            $pilot = $pilotAuthManager->getCurrentPilot();
            echo json_encode(['success' => true, 'pilot' => $pilot]);
            break;
            
        case 'update_pilot_profile':
            if ($method !== 'POST') throw new Exception('Metodo non consentito');
            if (!$pilotAuthManager->isLoggedIn()) throw new Exception('Non autorizzato');
            
            $pilot = $pilotAuthManager->getCurrentPilot();
            $pilotsManager->update($pilot['id'], $input);
            echo json_encode(['success' => true]);
            break;
            
        // Gestione registrazioni (solo admin)
        case 'get_pending_registrations':
            if (!$authManager->isLoggedIn()) throw new Exception('Non autorizzato');
            $registrations = $registrationManager->getPendingRegistrations();
            echo json_encode(['success' => true, 'data' => $registrations]);
            break;
            
        case 'approve_registration':
            if ($method !== 'POST') throw new Exception('Metodo non consentito');
            if (!$authManager->isLoggedIn()) throw new Exception('Non autorizzato');
            
            session_start();
            $adminId = $_SESSION['admin_id'];
            $pilotId = $registrationManager->approveRegistration($input['registration_id'], $adminId);
            echo json_encode(['success' => true, 'pilot_id' => $pilotId]);
            break;
            
        case 'reject_registration':
            if ($method !== 'POST') throw new Exception('Metodo non consentito');
            if (!$authManager->isLoggedIn()) throw new Exception('Non autorizzato');
            
            session_start();
            $adminId = $_SESSION['admin_id'];
            $registrationManager->rejectRegistration(
                $input['registration_id'], 
                $input['reason'] ?? '', 
                $adminId
            );
            echo json_encode(['success' => true]);
            break;
            
        // Autenticazione admin
        case 'login':
            if ($method !== 'POST') throw new Exception('Metodo non consentito');
            $result = $authManager->login($input['username'], $input['password']);
            echo json_encode($result);
            break;
            
        case 'logout':
            $result = $authManager->logout();
            echo json_encode($result);
            break;
            
        // Piloti
        case 'get_pilots':
            $pilots = $pilotsManager->getAll();
            echo json_encode(['success' => true, 'data' => $pilots]);
            break;
            
        case 'create_pilot':
            if ($method !== 'POST') throw new Exception('Metodo non consentito');
            if (!$authManager->isLoggedIn()) throw new Exception('Non autorizzato');
            $id = $pilotsManager->create($input);
            echo json_encode(['success' => true, 'id' => $id]);
            break;
            
        case 'update_pilot':
            if ($method !== 'POST') throw new Exception('Metodo non consentito');
            if (!$authManager->isLoggedIn()) throw new Exception('Non autorizzato');
            $pilotsManager->update($input['id'], $input);
            echo json_encode(['success' => true]);
            break;
            
        case 'delete_pilot':
            if ($method !== 'POST') throw new Exception('Metodo non consentito');
            if (!$authManager->isLoggedIn()) throw new Exception('Non autorizzato');
            $pilotsManager->delete($input['id']);
            echo json_encode(['success' => true]);
            break;
            
        // Sponsor
        case 'get_sponsors':
            $sponsors = $sponsorsManager->getAll();
            echo json_encode(['success' => true, 'data' => $sponsors]);
            break;
            
        case 'create_sponsor':
            if ($method !== 'POST') throw new Exception('Metodo non consentito');
            if (!$authManager->isLoggedIn()) throw new Exception('Non autorizzato');
            $id = $sponsorsManager->create($input);
            echo json_encode(['success' => true, 'id' => $id]);
            break;
            
        // Eventi
        case 'get_events':
            $events = $eventsManager->getAll();
            echo json_encode(['success' => true, 'data' => $events]);
            break;
            
        case 'create_event':
            if ($method !== 'POST') throw new Exception('Metodo non consentito');
            if (!$authManager->isLoggedIn()) throw new Exception('Non autorizzato');
            $id = $eventsManager->create($input);
            echo json_encode(['success' => true, 'id' => $id]);
            break;
            
        // Materiali (solo admin - informazioni sensibili)
        case 'get_materials':
            if (!$authManager->isLoggedIn()) throw new Exception('Non autorizzato - solo amministratori');
            $materials = $materialsManager->getAll();
            echo json_encode(['success' => true, 'data' => $materials]);
            break;
            
        case 'create_material':
            if ($method !== 'POST') throw new Exception('Metodo non consentito');
            if (!$authManager->isLoggedIn()) throw new Exception('Non autorizzato - solo amministratori');
            $id = $materialsManager->create($input);
            echo json_encode(['success' => true, 'id' => $id]);
            break;
            
        case 'assign_material':
            if ($method !== 'POST') throw new Exception('Metodo non consentito');
            if (!$authManager->isLoggedIn()) throw new Exception('Non autorizzato - solo amministratori');
            $id = $materialsManager->assignToPilot(
                $input['material_id'], 
                $input['pilot_id'], 
                $input['quantity'], 
                $input['notes'] ?? ''
            );
            echo json_encode(['success' => true, 'id' => $id]);
            break;
            
        case 'get_assignments':
            // Assegnazioni visibili anche ai piloti (solo le proprie)
            if ($pilotAuthManager->isLoggedIn()) {
                // Pilota: solo le proprie assegnazioni (senza costi)
                $pilot = $pilotAuthManager->getCurrentPilot();
                $assignments = $materialsManager->getPilotAssignments($pilot['id']);
            } elseif ($authManager->isLoggedIn()) {
                // Admin: tutte le assegnazioni
                $assignments = $materialsManager->getAssignments();
            } else {
                throw new Exception('Non autorizzato');
            }
            echo json_encode(['success' => true, 'data' => $assignments]);
            break;
            
        // Statistiche dashboard
        case 'get_stats':
            if (!$authManager->isLoggedIn()) throw new Exception('Non autorizzato');
            $stats = [
                'pilots' => $pilotsManager->getStats(),
                'sponsors' => count($sponsorsManager->getAll()),
                'events' => count($eventsManager->getAll()),
                'materials' => count($materialsManager->getAll())
            ];
            echo json_encode(['success' => true, 'data' => $stats]);
            break;
            
        // Richiesta sponsor
        case 'sponsor_request':
            if ($method !== 'POST') throw new Exception('Metodo non consentito');
            
            // Salva richiesta nel database
            $database->query("
                INSERT INTO sponsor_requests (company_name, email, phone, message, created_at) 
                VALUES (?, ?, ?, ?, NOW())
            ", [
                $input['company_name'],
                $input['email'],
                $input['phone'] ?? '',
                $input['message'] ?? ''
            ]);
            
            // Invia email di notifica (opzionale)
            $to = 'l3drc@altervista.org';
            $subject = 'Nuova richiesta sponsor - RC Junior/Senior';
            $message = "Nuova richiesta sponsor ricevuta:\n\n";
            $message .= "Azienda: {$input['company_name']}\n";
            $message .= "Email: {$input['email']}\n";
            $message .= "Telefono: {$input['phone']}\n";
            $message .= "Messaggio: {$input['message']}\n";
            
            @mail($to, $subject, $message);
            
            echo json_encode(['success' => true, 'message' => 'Richiesta inviata con successo']);
            break;
            
        default:
            throw new Exception('Azione non valida');
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}
?>