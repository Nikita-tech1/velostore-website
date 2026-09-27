<?php
// Подключаем наш общий файл подключения к базе данных
require_once 'db.php';

try {
    // Переменная $pdo уже создана внутри файла db.php!
    $stmt = $pdo->query("SELECT * FROM requests ORDER BY id DESC");
    $requests = $stmt->fetchAll();
} catch (PDOException $e) {
    $error = "Ошибка получения данных из БД: " . $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Панель администратора — ВелоСтрана</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        .admin-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: #fff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            border-radius: 8px;
            overflow: hidden;
        }
        .admin-table th, .admin-table td {
            padding: 14px 18px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        .admin-table th {
            background-color: #333;
            color: #fff;
            font-weight: 600;
        }
        .admin-table tr:hover {
            background-color: #f9f9f9;
        }
        .badge-type {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
        }
        .badge-order { background: #fff3e0; color: #e65100; }
        .badge-contact { background: #e8f5e9; color: #1b5e20; }
    </style>
</head>
<body>

    <header class="header">
        <div class="container header-container">
            <div class="logo">
                <a href="index.html">🚲 <span>ВелоСтрана (Админ-панель)</span></a>
            </div>
            <nav class="nav">
                <ul>
                    <li><a href="index.html">Перейти на сайт</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main class="main-content">
        <section class="page-header">
            <div class="container">
                <h1>Заявки и Заказы</h1>
                <p>Просмотр обращений из формы обратной связи и модального окна быстрых заказов</p>
            </div>
        </section>

        <section class="services-section">
            <div class="container">
                <?php if (isset($error)): ?>
                    <div style="color: red; padding: 15px; background: #ffebee; border-radius: 6px;"><?= $error ?></div>
                <?php elseif (empty($requests)): ?>
                    <p style="text-align: center; color: #666;">Заявок пока нет.</p>
                <?php else: ?>
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Имя</th>
                                <th>Телефон</th>
                                <th>Сообщение / Заказ</th>
                                <th>Дата</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($requests as $req): ?>
                                <?php 
                                    $isOrder = strpos($req['message'], 'Заказ товара:') !== false;
                                ?>
                                <tr>
                                    <td><strong>#<?= htmlspecialchars($req['id']) ?></strong></td>
                                    <td><?= htmlspecialchars($req['name']) ?></td>
                                    <td><a href="tel:<?= htmlspecialchars($req['phone']) ?>"><?= htmlspecialchars($req['phone']) ?></a></td>
                                    <td>
                                        <span class="badge-type <?= $isOrder ? 'badge-order' : 'badge-contact' ?>">
                                            <?= $isOrder ? 'Быстрый заказ' : 'Обратная связь' ?>
                                        </span>
                                        <div style="margin-top: 5px;"><?= htmlspecialchars($req['message']) ?></div>
                                    </td>
                                    <td><?= isset($req['created_at']) ? htmlspecialchars($req['created_at']) : '—' ?></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                <?php endif; ?>
            </div>
        </section>
    </main>

</body>
</html>