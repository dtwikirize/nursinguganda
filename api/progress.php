<?php
require_once __DIR__ . '/db.php';

$uid = nu_require_user();
$b = nu_body();
$courseSlug = trim((string)($b['courseSlug'] ?? ''));
$lessonSlug = trim((string)($b['lessonSlug'] ?? ''));
$completed = !empty($b['completed']) ? 1 : 0;

if (!$courseSlug || !$lessonSlug) {
  nu_json(['error' => 'Missing courseSlug or lessonSlug.'], 400);
}

$pdo = nu_pdo();
$stmt = $pdo->prepare(
  'INSERT INTO course_progress (user_id, course_slug, lesson_slug, completed) VALUES (?, ?, ?, ?)
   ON DUPLICATE KEY UPDATE completed = VALUES(completed)'
);
$stmt->execute([$uid, $courseSlug, $lessonSlug, $completed]);

$prStmt = $pdo->prepare('SELECT course_slug, lesson_slug FROM course_progress WHERE user_id = ? AND completed = 1');
$prStmt->execute([$uid]);
$progress = [];
foreach ($prStmt->fetchAll() as $row) {
  $progress[$row['course_slug']][] = $row['lesson_slug'];
}

nu_json(['progress' => $progress]);
