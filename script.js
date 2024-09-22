'use strict';

let video = {};
let canvas = {};
let resultElement = {};

// Initialize elements
function initElement() {
    video = document.querySelector('#qr-reader video');
    canvas = document.getElementById('canvas');
    resultElement = document.getElementById('result');

    // Initialize media devices
    if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
    }
    if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
            const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

            if (!getUserMedia) {
                return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
            }

            return new Promise(function (resolve, reject) {
                getUserMedia.call(navigator, constraints, resolve, reject);
            });
        };
    }
}

// Start video stream
function onMediaStream(stream) {
    if ('srcObject' in video) {
        video.srcObject = stream;
    } else {
        video.src = window.URL.createObjectURL(stream);
    }
    video.play();
}

function onMediaError(err) {
    resultElement.innerHTML = 'Error: ' + err.name + ': ' + err.message;
}

// Capture the image and use OCR to extract text
/*function captureImage() {
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height); 

    const imgData = canvas.toDataURL('image/png'); 

    Tesseract.recognize(
        imgData,
        'eng',
        {
            logger: info => console.log(info) 
        }
    ).then(({ data: { text } }) => {
        resultElement.innerHTML = 'Scanned Text: ' + text; 
    }).catch(err => {
        resultElement.innerHTML = 'Error in OCR: ' + err;
    });
}
*/
// Initialize events
function initEvent() {
    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(onMediaStream)
        .catch(onMediaError);
    document.getElementById('capture-btn').addEventListener('click', captureImage);
}

function init() {
    initElement();
    initEvent();
}

if (window.location.protocol != 'https:' && window.location.protocol != 'file:') {
    window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}
window.addEventListener('DOMContentLoaded', init);


'use strict';

// Initialize the QR code scanner
function initializeQRScanner() {
    const resultElement = document.getElementById('result'); // Display result here

    // Success callback when a QR code is successfully scanned
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        console.log(`Decoded Text: ${decodedText}`);
        resultElement.innerHTML = `Scanned USN: ${decodedText}`; // Display the scanned USN
    };

    // Error callback if the QR code scan fails or no code is detected
    const qrCodeErrorCallback = (errorMessage) => {
        console.log(`QR Code scanning failed: ${errorMessage}`); // Log for debugging
    };

    // Create a new Html5QrcodeScanner instance
    const html5QrCodeScanner = new Html5QrcodeScanner(
        "qr-reader", // The element ID for the scanner
        {
            fps: 10,    // Scans per second
            qrbox: { width: 250, height: 250 } // Size of the scanning box
        }
    );

    // Start scanning for QR codes with success and error callbacks
    html5QrCodeScanner.render(qrCodeSuccessCallback, qrCodeErrorCallback);
}

// Initialize the scanner when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeQRScanner();
});
