'use strict';

let videoElement;
let resultElement;
let html5QrCode; // Declare the Html5Qrcode instance

// Initialize elements
function initElement() {
    videoElement = document.getElementById('videoElement'); // Access the video tag
    resultElement = document.getElementById('result');      // The element where the scanned QR code text will be displayed
}

// Start the camera feed inside the video element
function startCameraFeed() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                videoElement.srcObject = stream;
                videoElement.play(); // Play the camera feed
                startQRScanner(); // Start scanning after the camera is ready
            })
            .catch(function (err) {
                console.error("Error accessing camera: " + err);
                resultElement.innerHTML = "Error accessing camera.";
            });
    } else {
        resultElement.innerHTML = "Camera not supported in this browser.";
    }
}

// Start the QR code scanner
function startQRScanner() {
    // Create a new Html5Qrcode instance
    html5QrCode = new Html5Qrcode("qr-reader");

    // Success callback when a QR code is successfully scanned
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        console.log(`Decoded Text: ${decodedText}`);
        resultElement.innerHTML = `Scanned USN: ${decodedText}`; // Display the scanned text (QR code content)
    };

    // Error callback if the QR code scan fails or no code is detected
    const qrCodeErrorCallback = (errorMessage) => {
        console.log(`QR Code scanning failed: ${errorMessage}`); // Log for debugging
    };

    // Start scanning for QR codes
    html5QrCode.start(
        { facingMode: "environment" }, // Use the back camera
        {
            fps: 10,    // Frames per second to scan
            qrbox: { width: 250, height: 250 } // Size of the QR scan area
        },
        qrCodeSuccessCallback,
        qrCodeErrorCallback
    ).catch(err => {
        console.error("Unable to start scanning: ", err);
        resultElement.innerHTML = "Unable to start scanning.";
    });
}

// Initialize everything when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initElement();
    startCameraFeed(); // Start the camera feed when the page loads
});

