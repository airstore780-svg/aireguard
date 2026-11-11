<?php

header("Content-Type: application/json");

$folder = "alerts";

if (!is_dir($folder)) {
    mkdir($folder, 0777, true);
}

$data = json_decode(file_get_contents("php://input"), true);

$room = preg_replace("/[^a-zA-Z0-9_-]/", "", $data["room"] ?? "");

if (!$room) {
    echo json_encode(["error" => "Missing room"]);
    exit;
}

$file = $folder . "/" . $room . ".json";

if (($data["action"] ?? "") === "send") {

    $data["time"] = time();

    file_put_contents($file, json_encode($data));

    echo json_encode(["success" => true]);

} elseif (($data["action"] ?? "") === "receive") {

    if (file_exists($file)) {

        $alert = json_decode(file_get_contents($file), true);

        unlink($file);

        echo json_encode(["alert" => $alert]);

    } else {

        echo json_encode(["alert" => null]);

    }

}
?>