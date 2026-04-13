<script>
let micStream = null;
let audioContext, analyser, dataArray;

/* IDLE SYSTEM */
let idleTimeout;
const IDLE_TIME = 60000;
let ttsWarned = false;

function speakWarning(){
    if(!('speechSynthesis' in window)) return;

    const msg = new SpeechSynthesisUtterance(
        "hi there... this is AireGuard, just checking in. open app and tap anywhere on screen to let us know you're safe"
    );

    msg.rate = 1;
    msg.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
}

function resetIdle(){
    clearTimeout(idleTimeout);
    ttsWarned = false;

    idleTimeout = setTimeout(()=>{
        window.location.href = "https://www.google.com";
    }, IDLE_TIME);

    setTimeout(()=>{
        if(!ttsWarned){
            speakWarning();
            ttsWarned = true;
        }
    }, IDLE_TIME - 3000);
}

resetIdle();

["mousemove","keydown","click","scroll","touchstart"].forEach(evt=>{
    document.addEventListener(evt, resetIdle, {passive:true});
});

/* =========================
   AI-POWERED DETECTION
   ========================= */

let baseline = 0;
let shockScore = 0;
let sustainedCounter = 0;
let frameBuffer = [];

function startShockDetection(){

    navigator.mediaDevices.getUserMedia({audio:true})
    .then(stream=>{

        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);

        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;

        source.connect(analyser);

        dataArray = new Uint8Array(analyser.fftSize);

        monitor();
    })
    .catch(()=>{});
}

async function sendToAI(data){

    try{
        const res = await fetch("/analyze.php",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if(result.decision === "YES"){
            window.location.href = "https://www.google.com";
        }

    }catch(err){
        console.log("AI check failed");
    }
}

function monitor(){

    analyser.getByteTimeDomainData(dataArray);

    let sum = 0;

    for(let i=0;i<dataArray.length;i++){
        let val = (dataArray[i]-128)/128;
        sum += val*val;
    }

    let rms = Math.sqrt(sum/dataArray.length);
    let level = rms * 100;

    baseline = baseline ? (baseline*0.95 + level*0.05) : level;

    let deviation = level - baseline;
    let spike = Math.max(0, deviation);

    if(spike > 18){
        sustainedCounter++;
    } else {
        sustainedCounter = Math.max(0, sustainedCounter-1);
    }

    if(sustainedCounter > 15){
        shockScore++;
    } else {
        shockScore = Math.max(0, shockScore-0.5);
    }

    /* COLLECT DATA */
    frameBuffer.push({
        level,
        baseline,
        spike,
        shockScore
    });

    /* every ~2 seconds send snapshot */
    if(frameBuffer.length > 30){

        const payload = {
            frames: frameBuffer
        };

        frameBuffer = [];

        sendToAI(payload);
    }

    requestAnimationFrame(monitor);
}

/* ========================= */

window.onload=()=>{
    setTimeout(()=>modal.classList.add("show"),500);
}

function closeDisclaimer(){
    modal.classList.remove("show");
}

async function initializeAireGuard(){

    document.getElementById("btnText").innerText="ACTIVE";
    document.getElementById("mainBtn").classList.add("active","live");
    document.getElementById("statusText").innerText="Listening";

    startShockDetection();
    resetIdle();
}
</script>