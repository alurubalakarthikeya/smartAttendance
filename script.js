document.addEventListener('DOMContentLoaded', () => {
    const qrReader = new Html5Qrcode("qr-reader"); // 'qr-reader' is the ID of the div
    function startQrScanner(facingMode = "environment") {
        qrReader.start(
            { facingMode: facingMode },
            {
                fps: 10, 
                qrbox: { width: 250, height: 250 }, // Match this size to the square
                aspectRatio: 1.0,
            },
            (decodedText) => {
                document.getElementById('result').innerText = `USN: ${decodedText}`;
            },
            (errorMessage) => {
                console.log("QR Scan Error:", errorMessage);
            }
        ).then(() => {
            console.log("QR Scanner started and camera feed is visible.");
        }).catch((err) => {
            console.log("Error starting the QR scanner:", err);
        });
    }

    startQrScanner();

    // Camera selection logic
    document.getElementById('cameraSelection').addEventListener('change', (event) => {
        let facingMode = event.target.value;

        qrReader.stop().then(() => {
            startQrScanner(facingMode);
        }).catch((err) => {
            console.log("Error stopping the QR scanner:", err);
        });
    });

    // Stop QR scanning
    document.getElementById('stopScan').addEventListener('click', () => {
        qrReader.stop().then(() => {
            document.getElementById('result').innerText = 'Scan stopped.';
        }).catch((err) => {
            console.log("Error stopping the QR scanner:", err);
        });
    });
});


