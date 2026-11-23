<?php
require_once __DIR__ . '/db.php';

$b = nu_body();
$slug = trim((string)($b['ebookSlug'] ?? ''));
$email = trim((string)($b['email'] ?? 'guest'));

if (!$slug) {
  nu_json(['error' => 'Missing ebookSlug.'], 400);
}

$pdo = nu_pdo();
$stmt = $pdo->prepare('INSERT INTO ebook_downloads (ebook_slug, email) VALUES (?, ?)');
$stmt->execute([$slug, $email ?: 'guest']);

nu_json(['ok' => true]);
