<?php
/* https://api.telegram.org/botXXXXXXXXXXXXXXXXXXXXXXX/getUpdates,
где, XXXXXXXXXXXXXXXXXXXXXXX - токен вашего бота, полученный ранее */

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Безпечне очищення даних
function sanitize($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

// Отримання даних
$name = sanitize($_POST['user_name'] ?? '');
$age = sanitize($_POST['user_age'] ?? '');
$phone = sanitize($_POST['user_phone'] ?? '');
$message = sanitize($_POST['user_message'] ?? '');

// Перевірка заповнення
if ($name || $age || $phone || $message) {

    $token = "8328352877:AAGGDQx9GUeSeGQDt7ply6swkNCRc0TS7Gc";
    $chat_id = "-1003789979524";

    // Формування повідомлення
    $txt  = "<b>👤 Ім'я:</b> $name\n";
    $txt .= "<b>⏳ Вік:</b> $age\n";
    $txt .= "<b>☎️ Телефон:</b> $phone\n";
    $txt .= "<b>💌 Питання:</b> $message";

    // Telegram API URL
    $url = "https://api.telegram.org/bot$token/sendMessage";

    // Дані для POST
    $post_fields = [
        'chat_id' => $chat_id,
        'parse_mode' => 'HTML',
        'text' => $txt
    ];

    // CURL запит
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_fields);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);

    // Результат
    if ($response) {
        header('Location: thank-you.html');
        exit;
    } else {
        echo "Помилка відправки: " . $error;
    }

} else {
    echo "Форма не заповнена.";
}
?>