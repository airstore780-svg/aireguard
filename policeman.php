<?php

/* =========================
   CONFIG
   ========================= */

$uploadDir = __DIR__ . "/uploads/";

/* Ensure upload directory exists */
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

/* =========================
   VALIDATE REQUEST
   ========================= */

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo "Method not allowed";
    exit;
}

if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo "No file received";
    exit;
}

$file = $_FILES['file'];

/* =========================
   ERROR HANDLING
   ========================= */

if ($file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(500);
    echo "Upload error";
    exit;
}

/* =========================
   SECURITY CHECKS
   ========================= */

/* Limit file size (e.g. 10MB) */
$maxSize = 10 * 1024 * 1024;
if ($file['size'] > $maxSize) {
    http_response_code(413);
    echo "File too large";
    exit;
}

/* Validate MIME type */
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

/* Allow only audio */
$allowedTypes = [
    'audio/webm',
    'audio/ogg',
    'audio/wav',
    'audio/mpeg'
];

if (!in_array($mime, $allowedTypes)) {
    http_response_code(415);
    echo "Invalid file type";
    exit;
}

/* =========================
   SAFE FILE NAME
   ========================= */

/* Generate unique filename */
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$safeName = "recording_" . time() . "_" . bin2hex(random_bytes(5)) . "." . $extension;

$destination = $uploadDir . $safeName;

/* =========================
   SAVE FILE
   ========================= */

if (!move_uploaded_file($file['tmp_name'], $destination)) {
    http_response_code(500);
    echo "Failed to save file";
    exit;
}

/* =========================
   SUCCESS RESPONSE
   ========================= */

http_response_code(200);
echo "Upload successful: " . $safeName;

?>