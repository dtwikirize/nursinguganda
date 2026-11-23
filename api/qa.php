<?php
require_once __DIR__ . '/db.php';

$pdo = nu_pdo();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $courseSlug = trim((string)($_GET['course'] ?? ''));
  if (!$courseSlug) nu_json(['questions' => []]);

  $stmt = $pdo->prepare('SELECT id, course_slug AS courseSlug, user_name AS userName, title, body, created_at AS createdAt FROM course_qa WHERE course_slug = ? ORDER BY created_at DESC LIMIT 50');
  $stmt->execute([$courseSlug]);
  nu_json(['questions' => $stmt->fetchAll()]);
}

$uid = nu_require_user();
$b = nu_body();
$courseSlug = trim((string)($b['courseSlug'] ?? ''));
$title = trim((string)($b['title'] ?? ''));
$body = trim((string)($b['body'] ?? ''));

if (!$courseSlug || !$title || !$body) {
  nu_json(['error' => 'Question title and details are required.'], 400);
}

$uStmt = $pdo->prepare('SELECT name FROM users WHERE id = ?');
$uStmt->execute([$uid]);
$userName = $uStmt->fetchColumn() ?: 'Nursing Student';

$ins = $pdo->prepare('INSERT INTO course_qa (course_slug, user_id, user_name, title, body) VALUES (?, ?, ?, ?, ?)');
$ins->execute([$courseSlug, $uid, $userName, $title, $body]);

$stmt = $pdo->prepare('SELECT id, course_slug AS courseSlug, user_name AS userName, title, body, created_at AS createdAt FROM course_qa WHERE course_slug = ? ORDER BY created_at DESC LIMIT 50');
$stmt->execute([$courseSlug]);
nu_json(['questions' => $stmt->fetchAll()]);
