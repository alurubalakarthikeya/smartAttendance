'use strict';

let videoElement;
let resultElement;

// Initialize elements
function initElement() {
    videoElement = document.getElementById('videoElement'); // Access the video tag
    resultElement = document.getElementById('result');      // The element where the scanned QR code text will be displayed
}

// Start the camera feed inside the video element
function startCameraFeed() {
    // Check if the browser supports `getUserMedia`
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                videoElement.srcObject = stream;
                videoElement.play(); // Play the camera feed
            })
            .catch(function (err) {
                console.error("Error accessing camera: " + err);
            });
    } else {
        resultElement.innerHTML = "Camera not supported in this browser.";
    }
}

// Start the QR code scanner
function startQRScanner() {
    // Success callback when a QR code is successfully scanned
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        console.log(`Decoded Text: ${decodedText}`);
        resultElement.innerHTML = `Scanned USN: ${decodedText}`; // Display the scanned text (QR code content)
    };

    // Error callback if the QR code scan fails or no code is detected
    const qrCodeErrorCallback = (errorMessage) => {
        console.log(`QR Code scanning failed: ${errorMessage}`); // Log for debugging
    };

    // Create a new Html5QrcodeScanner instance
    const html5QrCodeScanner = new Html5QrcodeScanner(
        "qr-reader", // The element ID for the scanner
        {
            fps: 10,    // Frames per second to scan
            qrbox: { width: 250, height: 250 } // Size of the QR scan area
        }
    );

    // Start scanning for QR codes
    html5QrCodeScanner.render(qrCodeSuccessCallback, qrCodeErrorCallback);
}

// Initialize everything when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initElement();
    startCameraFeed(); // Start the camera feed when the page loads
    startQRScanner();  // Start the QR code scanner
});

