const FALL_THRESHOLD = 25;
let fallDetected = false;

function startFallDetection() {
    window.addEventListener("devicemotion", function (event) {

        if (fallDetected) return;

        const acc = event.accelerationIncludingGravity;

        if (!acc) return;

        const x = acc.x || 0;
        const y = acc.y || 0;
        const z = acc.z || 0;

        const magnitude = Math.sqrt(
            x * x +
            y * y +
            z * z
        );

        if (magnitude >= FALL_THRESHOLD) {
            fallDetected = true;

            window.location.href = "alert.html";
        }
    });
}


// iPhone/iPad permission
if (
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function"
) {
    DeviceMotionEvent.requestPermission()
        .then(permission => {
            if (permission === "granted") {
                startFallDetection();
            }
        })
        .catch(error => {
            console.error("Motion permission error:", error);
        });

} else {
    // Android and browsers that don't require permission
    startFallDetection();
}