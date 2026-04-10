<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$host = 'https://chathunga2007.github.io/My-Official-Personal-Portfolio-Web/';      // ඔයාගේ host (phpMyAdmin එකේ තියෙනවා)
$db   = 'u123456789_portfolio';  // ඔයා හදපු database නම
$user = 'root';       // ඔයා හදපු username
$pass = '';       // ඔයාගේ password

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die(json_encode(['error' => 'Database connection failed']));
}

// GET - current counts ගන්න
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query("SELECT likes, dislikes FROM feedback WHERE id=1");
    $data = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($data ?: ['likes' => 0, 'dislikes' => 0]);
    exit;
}

// POST - like හෝ dislike කරන්න
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? ''; // "like" or "dislike"

    if ($action === 'like') {
        $pdo->exec("UPDATE feedback SET likes = likes + 1 WHERE id=1");
    } elseif ($action === 'dislike') {
        $pdo->exec("UPDATE feedback SET dislikes = dislikes + 1 WHERE id=1");
    }

    // නව counts return කරන්න
    $stmt = $pdo->query("SELECT likes, dislikes FROM feedback WHERE id=1");
    $data = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($data);
    exit;
}

echo json_encode(['error' => 'Invalid request']);
?>