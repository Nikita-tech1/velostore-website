<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db.php';

// Разрешаем принимать данные как в формате JSON, так и через POST-форму
$inputData = json_decode(file_get_contents('php://input'), true);

$name = isset($inputData['name']) ? trim($inputData['name']) : (isset($_POST['name']) ? trim($_POST['name']) : '');
$phone = isset($inputData['phone']) ? trim($inputData['phone']) : (isset($_POST['phone']) ? trim($_POST['phone']) : '');
$message = isset($inputData['message']) ? trim($inputData['message']) : (isset($_POST['message']) ? trim($_POST['message']) : '');

if (empty($name)) {
    echo json_encode(['success' => false, 'message' => 'Пожалуйста, укажите имя.']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO requests (name, phone, message) VALUES (?, ?, ?)");
    $stmt->execute([$name, $phone, $message]);

    echo json_encode(['success' => true, 'message' => 'Заявка успешно сохранена в базе данных!']);
} catch (\PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Ошибка базы данных: ' . $e->getMessage()]);
}
?>