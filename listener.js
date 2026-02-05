// Listen to SSE from events.php
const es = new EventSource("/events.php");

es.addEventListener("ping", () => {
  console.log("Ping received (SSE event)");

  // Text-to-speech
  const utterance = new SpeechSynthesisUtterance("Ping received");
  speechSynthesis.speak(utterance);
});
