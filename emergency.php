<?php

// Allow cross-origin requests (important for GitHub / browser apps)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// File that stores last ping
$pingFile = "last_ping.txt";

// ==============================
// HANDLE RECORDER (POST = SEND PING)
// ==============================
if($_SERVER["REQUEST_METHOD"] === "POST"){

    // Save current timestamp as latest alert
    $timestamp = time();
    file_put_contents($pingFile, $timestamp);

    echo json_encode([
        "status" => "ping_received",
        "time" => $timestamp
    ]);
    exit;
}

// ==============================
// HANDLE RECEIVER (GET = CHECK PING)
// ==============================

if(!file_exists($pingFile)){
    echo json_encode([
        "file" => null
    ]);
    exit;
}

$lastPing = file_get_contents($pingFile);

// Send back "new event"
echo json_encode([
    "file" => $lastPing
]);