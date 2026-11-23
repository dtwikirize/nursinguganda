<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if (session_status() === PHP_SESSION_NONE) {
  session_set_cookie_params([
    'lifetime' => 60 * 60 * 24 * 14,
    'path' => '/',
    'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'httponly' => true,
    'samesite' => 'Lax',
  ]);
  session_start();
}

function nu_config(): array {
  $cfgPath = __DIR__ . '/config.php';
  if (!file_exists($cfgPath)) {
    return [];
  }
  return require $cfgPath;
}

function nu_pdo(): PDO {
  static $pdo = null;
  if ($pdo instanceof PDO) return $pdo;

  $cfg = nu_config();
  if (empty($cfg['db_name'])) {
    nu_json(['error' => 'Server database is not configured yet (missing api/config.php).'], 500);
  }
  $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $cfg['db_host'], $cfg['db_name']);
  $pdo = new PDO($dsn, $cfg['db_user'], $cfg['db_pass'], [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  ]);
  return $pdo;
}

function nu_json(array $data, int $status = 200): void {
  http_response_code($status);
  echo json_encode($data);
  exit;
}

function nu_body(): array {
  $raw = file_get_contents('php://input');
  if (!$raw) return [];
  $decoded = json_decode($raw, true);
  return is_array($decoded) ? $decoded : [];
}

function nu_require_user(): int {
  $uid = $_SESSION['user_id'] ?? null;
  if (!$uid) {
    nu_json(['error' => 'Please sign in first.'], 401);
  }
  return (int)$uid;
}
