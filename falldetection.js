const FALL_THRESHOLD = 25;
let fallDetected = false;

function startFallDetection() {

    window.addEventListener("devicemotion", function (event) {

        // Prevent multiple detections
        if (fallDetected) return;

        // Get device acceleration including gravity
        const acc = event.accelerationIncludingGravity;

        if (!acc) return;

        // Get the three acceleration axes
        const x = acc.x || 0;
        const y = acc.y || 0;
        const z = acc.z || 0;

        // Calculate total acceleration
        const magnitude = Math.sqrt(
            x * x +
            y * y +
            z * z
        );

        // Fall detected
        if (magnitude >= FALL_THRESHOLD) {

            fallDetected = true;

            // Redirect to the AireGuard alert page
            window.location.href = "https://airstore780-svg.github.io/aireguard/aireguardrecorder.html";
        }
    });
}


// Handle iPhone/iPad motion permission
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


// Handle Android and other browsers
} else {

    startFallDetection();
}
