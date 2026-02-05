function sendPing() {
  fetch("/ping.php")
    .then(response => response.text())
    .then(text => {
      console.log(text); // "Ping sent"

      // Speak "Ping received" via TTS
      const utterance = new SpeechSynthesisUtterance("Ping received");
      speechSynthesis.speak(utterance);
    })
    .catch(err => console.error("Ping error:", err));
}
