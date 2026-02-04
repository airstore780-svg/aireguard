/**
 * AireGuard | Autonomous Evidence Recorder
 * This script runs a continuous 60-second loop to capture 
 * background audio evidence as separate WAV files.
 */

let backgroundMediaRecorder;
let backgroundRecordInterval;

async function startContinuousRecording() {
    console.log("AireGuard: Initializing Background Evidence Capture...");
    
    try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const recordMinuteChunk = () => {
            backgroundMediaRecorder = new MediaRecorder(stream);
            const chunks = [];

            backgroundMediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    const blob = new Blob([event.data], { type: 'audio/wav' });
                    const url = URL.createObjectURL(blob);
                    
                    // Create hidden download link
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = `AireGuard_BlackBox_${new Date().toLocaleTimeString().replace(/:/g, '-')}.wav`;
                    document.body.appendChild(a);
                    
                    // Trigger download
                    a.click();
                    
                    // Cleanup
                    setTimeout(() => {
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                    }, 100);
                }
            };

            // Start recording
            backgroundMediaRecorder.start();
            console.log("AireGuard: Recording chunk started...");

            // Stop after 60 seconds
            setTimeout(() => {
                if (backgroundMediaRecorder.state !== "inactive") {
                    backgroundMediaRecorder.stop();
                }
            }, 60000);
        };

        // Fire first chunk immediately
        recordMinuteChunk();

        // Set interval to repeat every 60.5 seconds (prevents overlap/clashes)
        backgroundRecordInterval = setInterval(recordMinuteChunk, 60500);

    } catch (err) {
        console.error("AireGuard Recorder Error: ", err);
        alert("Microphone access is required for Evidence Capture.");
    }
}

// Automatically start if called, or wait for manual trigger
// startContinuousRecording();