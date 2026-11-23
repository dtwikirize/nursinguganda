<?php
require_once __DIR__ . '/db.php';

$action = $_GET['action'] ?? '';
$pdo = nu_pdo();

if ($action === 'me') {
  $uid = $_SESSION['user_id'] ?? null;
  if (!$uid) {
    nu_json(['user' => null, 'enrollments' => [], 'progress' => []]);
  }
  $stmt = $pdo->prepare('SELECT id, name, email, programme FROM users WHERE id = ?');
  $stmt->execute([$uid]);
  $user = $stmt->fetch();
  if (!$user) {
    session_destroy();
    nu_json(['user' => null, 'enrollments' => [], 'progress' => []]);
  }
  $parts = preg_split('/\s+/', trim($user['name']));
  $user['initials'] = strtoupper(substr($parts[0] ?? 'N', 0, 1) . substr($parts[1] ?? '', 0, 1));

  $enStmt = $pdo->prepare('SELECT course_slug FROM enrollments WHERE user_id = ?');
  $enStmt->execute([$uid]);
  $enrollments = array_column($enStmt->fetchAll(), 'course_slug');

  $prStmt = $pdo->prepare('SELECT course_slug, lesson_slug FROM course_progress WHERE user_id = ? AND completed = 1');
  $prStmt->execute([$uid]);
  $progress = [];
  foreach ($prStmt->fetchAll() as $row) {
    $progress[$row['course_slug']][] = $row['lesson_slug'];
  }

  nu_json(['user' => $user, 'enrollments' => $enrollments, 'progress' => $progress]);
}

if ($action === 'register') {
  $b = nu_body();
  $name = trim((string)($b['name'] ?? ''));
  $email = strtolower(trim((string)($b['email'] ?? '')));
  $password = (string)($b['password'] ?? '');
  $programme = trim((string)($b['programme'] ?? 'certificate-in-nursing'));

  if (!$name || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 6) {
    nu_json(['error' => 'Enter a valid name, email, and password (6+ characters).'], 400);
  }

  $exists = $pdo->prepare('SELECT id FROM users WHERE email = ?');
  $exists->execute([$email]);
  if ($exists->fetch()) {
    nu_json(['error' => 'An account with this email already exists.'], 409);
  }

  $hash = password_hash($password, PASSWORD_DEFAULT);
  $ins = $pdo->prepare('INSERT INTO users (name, email, password_hash, programme) VALUES (?, ?, ?, ?)');
  $ins->execute([$name, $email, $hash, $programme]);
  $uid = (int)$pdo->lastInsertId();
  $_SESSION['user_id'] = $uid;

  $parts = preg_split('/\s+/', $name);
  nu_json([
    'user' => [
      'id' => $uid,
      'name' => $name,
      'email' => $email,
      'programme' => $programme,
      'initials' => strtoupper(substr($parts[0] ?? 'N', 0, 1) . substr($parts[1] ?? '', 0, 1)),
    ],
    'enrollments' => [],
    'progress' => [],
  ]);
}

if ($action === 'login') {
  $b = nu_body();
  $email = strtolower(trim((string)($b['email'] ?? '')));
  $password = (string)($b['password'] ?? '');

  $stmt = $pdo->prepare('SELECT id, name, email, password_hash, programme FROM users WHERE email = ?');
  $stmt->execute([$email]);
  $user = $stmt->fetch();
  if (!$user || !password_verify($password, $user['password_hash'])) {
    nu_json(['error' => 'Invalid email or password.'], 401);
  }

  $_SESSION['user_id'] = (int)$user['id'];
  unset($user['password_hash']);
  $parts = preg_split('/\s+/', trim($user['name']));
  $user['initials'] = strtoupper(substr($parts[0] ?? 'N', 0, 1) . substr($parts[1] ?? '', 0, 1));

  $enStmt = $pdo->prepare('SELECT course_slug FROM enrollments WHERE user_id = ?');
  $enStmt->execute([$user['id']]);
  $enrollments = array_column($enStmt->fetchAll(), 'course_slug');

  nu_json(['user' => $user, 'enrollments' => $enrollments, 'progress' => []]);
}

if ($action === 'logout') {
  session_destroy();
  nu_json(['ok' => true]);
}

nu_json(['error' => 'Unknown auth action.'], 400);
