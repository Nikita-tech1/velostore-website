<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db.php';

try {
    // Получаем список новостей, отсортированных от самых свежих к более старым
    $stmt = $pdo->query("SELECT * FROM news ORDER BY id DESC");
    $news = $stmt->fetchAll();
    
    echo json_encode($news, JSON_UNESCAPED_UNICODE);
} catch (\PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>