<?php
require_once __DIR__ . '/db.php';

$uid = nu_require_user();
$pdo = nu_pdo();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $b = nu_body();
  $courseSlug = trim((string)($b['courseSlug'] ?? ''));
  if (!$courseSlug) nu_json(['error' => 'Missing courseSlug.'], 400);

  $stmt = $pdo->prepare('INSERT IGNORE INTO enrollments (user_id, course_slug, access_type) VALUES (?, ?, ?)');
  $stmt->execute([$uid, $courseSlug, 'free']);
}

$all = $pdo->prepare('SELECT course_slug FROM enrollments WHERE user_id = ?');
$all->execute([$uid]);
nu_json(['enrollments' => array_column($all->fetchAll(), 'course_slug')]);
