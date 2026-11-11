const SERVER = "https://YOUR-DOMAIN.com/relayapi.php";

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

            let message = data.message;

            if (data.location) {

                const lat = data.location.latitude;
                const lon = data.location.longitude;

                message +=
                    "\n\nEmergency location:" +
                    "\nLatitude: " + lat +
                    "\nLongitude: " + lon +
                    "\nAccuracy: " + data.location.accuracy + " metres" +
                    "\n\nGoogle Maps:" +
                    "\nhttps://www.google.com/maps?q=" + lat + "," + lon;

            } else {

                message += "\n\nLocation unavailable.";

            }

            alert(message);

        }

    } catch (error) {

        console.log("AireGuard connection error:", error);

    }

}

checkForSOS();

setInterval(checkForSOS, 2000);