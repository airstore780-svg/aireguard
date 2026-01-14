/**
 * AIRE-GUARD SYSTEM CORE v1.1 (Active Defense)
 * Developer: The Director
 * Logic: Biometric Audit + Android Intent + TTS Deterrent
 */

// 1. SYSTEM THRESHOLDS
const BPM_JUMP_LIMIT = 30;    
const TIME_WINDOW_MS = 5000;  

// 2. PERSISTENT STATE
let lastHeartRate = 0;
let lastTimestamp = 0;
let bluetoothDevice = null;

/**
 * STEP A: THE HANDSHAKE
 * Triggered by a "Sync" button gesture.
 */
async function initializeAireGuard() {
    try {
        console.log("Requesting Bluetooth Device...");
        
        bluetoothDevice = await navigator.bluetooth.requestDevice({
            filters: [{ services: ['heart_rate'] }]
        });

        const server = await bluetoothDevice.gatt.connect();
        const service = await server.getPrimaryService('heart_rate');
        const characteristic = await service.getCharacteristic('heart_rate_measurement');

        await characteristic.startNotifications();
        console.log("Aire-Guard Active: Biometric Shield Online.");

        characteristic.addEventListener('characteristicvaluechanged', handleHeartRateUpdate);
        bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);

    } catch (error) {
        console.error("System Error:", error);
        alert("Sync Failed: Check Bluetooth settings.");
    }
}

/**
 * STEP B: DATA CATCHING
 */
function handleHeartRateUpdate(event) {
    const value = event.target.value;
    const currentHR = value.getUint8(1); 
    performBiometricAudit(currentHR);
}

/**
 * STEP C: ANALYSIS LOGIC
 */
function performBiometricAudit(currentHR) {
    const currentTimestamp = Date.now();

    if (lastHeartRate > 0) {
        const hrDiff = currentHR - lastHeartRate;
        const timeDiff = currentTimestamp - lastTimestamp;

        if (hrDiff >= BPM_JUMP_LIMIT && timeDiff <= TIME_WINDOW_MS) {
            executeEmergencyProtocol(currentHR);
        }
    }

    lastHeartRate = currentHR;
    lastTimestamp = currentTimestamp;
}

/**
 * STEP D: THE DETERRENT (Speech Synthesis)
 * Uses the device's voice to scare off the offender.
 */
function speakWarning() {
    const message = new SpeechSynthesisUtterance("Assault detected. I am calling the police.");
    
    // Choosing a "Strict" voice profile
    message.rate = 0.9;  // Slightly slower for authoritative impact
    message.pitch = 1.0; 
    message.volume = 1.0; // Max volume
    
    window.speechSynthesis.speak(message);
}

/**
 * STEP E: THE KILL SHOT (Emergency Deployment)
 */
function executeEmergencyProtocol(hrValue) {
    console.warn("ALARM: Erratic Variability Detected!");

    // 1. Audible Deterrent (Scare the offender)
    speakWarning();

    // 2. Haptic Warning (Physical pulse on phone)
    if (navigator.vibrate) {
        navigator.vibrate([1000, 500, 1000]);
    }

    // 3. Trigger Dialer Intent
    // NOTE: We trigger this immediately after the speech starts.
    window.location.href = "tel:10111";
}

/**
 * RECOVERY: Handle Disconnection
 */
function onDisconnected(event) {
    console.log("Link Severed. Re-syncing required.");
}