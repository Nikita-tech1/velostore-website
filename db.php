<?php
// В Open Server Panel 6 хостом является имя активного модуля
$hosts = ['MySQL-8.0', '127.0.0.1', 'localhost'];
$db   = 'velostore_db';
$user = 'root';
$pass = ''; // В Open Server по умолчанию пароль root пустой
$charset = 'utf8mb4';

$pdo = null;
$connectedHost = '';

foreach ($hosts as $host) {
    try {
        $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        $pdo = new PDO($dsn, $user, $pass, $options);
        $connectedHost = $host;
        break; // Успешное подключение
    } catch (\PDOException $e) {
        $lastError = $e->getMessage();
    }
}

if ($pdo) {
   // echo "Подключение к базе данных velostore_db успешно установлено! (Хост: $connectedHost)";
} else {
    echo "Ошибка подключения к базе данных: " . $lastError;
}
?>