<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db.php';

// Получаем категорию из параметров запроса (bikes или services)
$category = isset($_GET['category']) ? $_GET['category'] : '';

try {
    if ($category !== '') {
        $stmt = $pdo->prepare("SELECT * FROM products WHERE category = ?");
        $stmt->execute([$category]);
    } else {
        $stmt = $pdo->query("SELECT * FROM products");
    }
    
    $products = $stmt->fetchAll();
    echo json_encode($products, JSON_UNESCAPED_UNICODE);
} catch (\PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>