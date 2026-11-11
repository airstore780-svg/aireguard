
const SERVER = "https://airstore780-svg.github.io/aireguard/relayapi.php";
const ROOM = "alert";

async function checkForSOS() {
    try {
        const response = await fetch(SERVER, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "receive",
                room: ROOM
            })
        });

        const result = await response.json();

        if (result.alert) {
            const data = result.alert;

            navigator.vibrate?.([500, 200, 500, 200, 1000]);

            showEmergencyScreen(data);
        }

    } catch (error) {
        console.log("AireGuard connection error:", error);
    }
}

function showEmergencyScreen(data) {
    let locationHTML = `
        <p>LOCATION UNAVAILABLE</p>
    `;

    if (data.location) {
        const lat = data.location.latitude;
        const lon = data.location.longitude;

        const mapsLink =
            `https://www.google.com/maps?q=${lat},${lon}`;

        locationHTML = `
            <div class="coordinates">
                <p><strong>Latitude</strong><br>${lat}</p>
                <p><strong>Longitude</strong><br>${lon}</p>
                <p><strong>Accuracy</strong><br>${data.location.accuracy} metres</p>
            </div>

            <a class="maps-button"
               href="${mapsLink}"
               target="_blank"
               rel="noopener">
               OPEN LOCATION IN GOOGLE MAPS
            </a>
        `;
    }

    document.body.innerHTML = `
        <main class="emergency-screen">

            <div class="alert-label">AIREGUARD / EMERGENCY ALERT</div>

            <h1>SOS RECEIVED</h1>

            <section class="message-panel">
                <h2>EMERGENCY MESSAGE</h2>
                <p>${escapeHTML(data.message)}</p>
            </section>

            <section class="location-panel">
                <h2>RECORDER LOCATION</h2>
                ${locationHTML}
            </section>

            <p class="footer">AIREGUARD SAFETY SYSTEM</p>

        </main>
    `;

    document.body.style.cssText = `
        margin: 0;
        background: #f3f0e9;
        color: #25251f;
        font-family: Arial, sans-serif;
    `;

    const style = document.createElement("style");

    style.textContent = `
        .emergency-screen {
            max-width: 600px;
            margin: auto;
            padding: 35px 22px;
        }

        .alert-label {
            font-size: 11px;
            letter-spacing: 3px;
            color: #9b342d;
            font-weight: bold;
        }

        h1 {
            font-size: 38px;
            margin: 30px 0;
            letter-spacing: 2px;
        }

        h2 {
            font-size: 12px;
            letter-spacing: 2px;
            margin-bottom: 20px;
        }

        .message-panel,
        .location-panel {
            background: white;
            padding: 24px;
            margin-bottom: 18px;
            border: 1px solid #dedbd3;
        }

        .message-panel p {
            font-size: 18px;
            line-height: 1.6;
        }

        .coordinates p {
            font-size: 14px;
            line-height: 1.8;
            overflow-wrap: anywhere;
        }

        .maps-button {
            display: block;
            margin-top: 25px;
            padding: 19px 12px;
            background: #25251f;
            color: white;
            text-align: center;
            text-decoration: none;
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 1px;
        }

        .footer {
            margin-top: 45px;
            font-size: 10px;
            letter-spacing: 3px;
            color: #888;
            text-align: center;
        }
    `;

    document.head.appendChild(style);
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

checkForSOS();
setInterval(checkForSOS, 2000);
