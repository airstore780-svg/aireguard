<?php
set_time_limit(0);

header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");
header("Connection: keep-alive");

// Disable output buffering
ini_set('output_buffering', 'off');
ini_set('zlib.output_compression', false);

$signalFile = __DIR__ . "/signal.txt";
$lastSignal = "";

while (true) {
    if (file_exists($signalFile)) {
        $current = file_get_contents($signalFile);

        if ($current !== $lastSignal) {
            // Broadcast ping event to all connected clients
            echo "event: ping\n";
            echo "data: ping\n\n";

            ob_flush();
            flush();

            $lastSignal = $current;
        }
    }

    usleep(500000); // check twice per second
}
