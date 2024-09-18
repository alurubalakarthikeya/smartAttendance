const qrReader = new Html5Qrcode("qr-reader");

        // Start QR Reader with default back camera
        qrReader.start(
            { facingMode: "environment" }, 
            {
                fps: 10, 
                qrbox: { width: 250, height: 250 }
            },
            (decodedText) => {
                document.getElementById('result').innerText = `USN: ${decodedText}`;
                console.log("Scanned USN:", decodedText);
            },
            (errorMessage) => {
                console.log("QR Scan Error:", errorMessage);
            }
        ).catch((err) => {
            console.log("Error starting the QR scanner:", err);
        });

        // Camera switching logic
        document.getElementById('cameraSelection').addEventListener('change', (event) => {
            let facingMode = event.target.value;
            
            qrReader.stop().then(() => {
                qrReader.start(
                    { facingMode: facingMode }, 
                    {
                        fps: 10, 
                        qrbox: { width: 250, height: 250 }
                    },
                    (decodedText) => {
                        document.getElementById('result').innerText = `USN: ${decodedText}`;
                        console.log("Scanned USN:", decodedText);
                    },
                    (errorMessage) => {
                        console.log("QR Scan Error:", errorMessage);
                    }
                ).catch((err) => {
                    console.log("Error starting the QR scanner:", err);
                });
            }).catch((err) => {
                console.log("Error stopping the QR scanner:", err);
            });
        });

        // Stop QR scanning
        document.getElementById('stopScan').addEventListener('click', () => {
            qrReader.stop().then(() => {
                document.getElementById('result').innerText = 'Scan stopped.';
                console.log("QR scanning stopped.");
            }).catch((err) => {
                console.log("Error stopping the QR scanner:", err);
            });
        });