<?php
require_once __DIR__ . '/db.php';

$uid = nu_require_user();
$b = nu_body();
$orderId = trim((string)($b['orderId'] ?? ''));
$items = is_array($b['items'] ?? null) ? $b['items'] : [];
$payerEmail = trim((string)($b['payerEmail'] ?? ''));

if (!$orderId || empty($items)) {
  nu_json(['error' => 'Missing PayPal orderId or items.'], 400);
}

$cfg = nu_config();
$clientId = $cfg['paypal_client_id'] ?? '';
$secret = $cfg['paypal_secret'] ?? '';
$isLive = ($cfg['paypal_mode'] ?? 'sandbox') === 'live';
$baseUrl = $isLive ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

if (!$clientId || !$secret || $clientId === 'YOUR_PAYPAL_CLIENT_ID') {
  nu_json(['error' => 'PayPal API credentials are not configured in api/config.php.'], 500);
}

// 1. Fetch PayPal OAuth access token
$ch = curl_init("$baseUrl/v1/oauth2/token");
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_USERPWD => "$clientId:$secret",
  CURLOPT_POSTFIELDS => 'grant_type=client_credentials',
  CURLOPT_HTTPHEADER => ['Accept: application/json'],
]);
$tokenResp = json_decode((string)curl_exec($ch), true);
curl_close($ch);
$accessToken = $tokenResp['access_token'] ?? '';
if (!$accessToken) {
  nu_json(['error' => 'Could not authenticate with PayPal API.'], 502);
}

// 2. Verify order status directly with PayPal Orders v2
$ch2 = curl_init("$baseUrl/v2/checkout/orders/" . urlencode($orderId));
curl_setopt_array($ch2, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer $accessToken",
    'Content-Type: application/json',
  ],
]);
$orderData = json_decode((string)curl_exec($ch2), true);
curl_close($ch2);

if (($orderData['status'] ?? '') !== 'COMPLETED') {
  nu_json(['error' => 'PayPal order is not completed yet.'], 402);
}

$paidAmount = (float)($orderData['purchase_units'][0]['amount']['value'] ?? 0);
$pdo = nu_pdo();
$pdo->beginTransaction();

try {
  $ordStmt = $pdo->prepare('INSERT IGNORE INTO orders (user_id, paypal_order_id, payer_email, amount_usd, status, items_json) VALUES (?, ?, ?, ?, ?, ?)');
  $ordStmt->execute([$uid, $orderId, $payerEmail, $paidAmount, 'COMPLETED', json_encode($items)]);
  $dbOrderId = (int)$pdo->lastInsertId();

  $enStmt = $pdo->prepare('INSERT IGNORE INTO enrollments (user_id, course_slug, order_id, access_type) VALUES (?, ?, ?, ?)');
  foreach ($items as $item) {
    $slugs = $item['courseSlugs'] ?? [$item['slug'] ?? ''];
    foreach ($slugs as $slug) {
      if ($slug) {
        $enStmt->execute([$uid, $slug, $dbOrderId ?: null, 'purchased']);
      }
    }
  }
  $pdo->commit();
} catch (Throwable $e) {
  $pdo->rollBack();
  nu_json(['error' => 'Failed to save enrollment.'], 500);
}

$allEn = $pdo->prepare('SELECT course_slug FROM enrollments WHERE user_id = ?');
$allEn->execute([$uid]);
nu_json([
  'orderId' => $orderId,
  'enrollments' => array_column($allEn->fetchAll(), 'course_slug'),
]);
