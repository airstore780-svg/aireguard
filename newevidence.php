<?php

$dir = __DIR__ . "/uploads/";
$files = scandir($dir);

$latestAudio = null;
$latestTxt = null;
$latestTime = 0;

foreach ($files as $file) {

    if ($file === "." || $file === "..") continue;

    $path = $dir . $file;
    $time = filemtime($path);

    if (preg_match('/\.webm$/', $file) && $time > $latestTime) {
        $latestAudio = $file;
        $latestTime = $time;
    }

    if (preg_match('/\.txt$/', $file)) {
        $latestTxt = $file;
    }
}

echo json_encode([
    "file" => $latestAudio,
    "txt" => $latestTxt
]);