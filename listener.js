// Listen to SSE from events.php
const es = new EventSource("/events.php");

es.addEventListener("ping", () => {
  console.log("Ping received (SSE event)");

  // Text-to-speech
  const utterance = new SpeechSynthesisUtterance("security alert. Your loved one is in danger. Check the live location they sent you on whatsapp, and call them. Call the police if they don't answer.");
  speechSynthesis.speak(utterance);
});

