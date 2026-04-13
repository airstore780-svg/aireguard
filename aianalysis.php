<?php

$data = json_decode(file_get_contents("php://input"), true);

$frames = $data["frames"] ?? [];

$apiKey = "YOUR_OPENAI_API_KEY";

$payload = [
    "model" => "gpt-4o-mini",
    "messages" => [
        [
            "role" => "system",
            "content" => "You are a safety detection AI. Based on sound intensity patterns, determine if the situation indicates danger. Respond ONLY with YES or NO."
        ],
        [
            "role" => "user",
            "content" => json_encode($frames)
        ]
    ]
];

$ch = curl_init("https://api.openai.com/v1/chat/completions");

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer $apiKey"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);

$text = $result["choices"][0]["message"]["content"] ?? "NO";

$decision = (stripos($text, "YES") !== false) ? "YES" : "NO";

echo json_encode(["decision"=>$decision]);