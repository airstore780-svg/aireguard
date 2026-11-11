const SERVER = "https://airstore780-svg.github.io/aireguard/relayapi.php";

const ROOM = "aireguard";

const MESSAGE =
    "I'm in a situation, call me! If I don't answer call the police!";

function sendSOS(location) {

    fetch(SERVER, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            action: "send",
            room: ROOM,
            message: MESSAGE,
            location: location
        })
    });

}

navigator.geolocation.getCurrentPosition(

    position => {

        sendSOS({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
        });

    },

    () => sendSOS(null),

    {
        enableHighAccuracy: true,
        timeout: 15000
    }

);
