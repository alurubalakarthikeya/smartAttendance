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

// Handle camera access errors
function onMediaError(err) {
    resultElement.innerHTML = 'Error: ' + err.name + ': ' + err.message;
}

// Capture the image and use OCR to extract text
function captureImage() {
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);  // Capture frame from video feed

    const imgData = canvas.toDataURL('image/png');  // Convert canvas image to data URL

    // Use Tesseract.js to perform OCR
    Tesseract.recognize(
        imgData,
        'eng',
        {
            logger: info => console.log(info)  // Logging the OCR process
        }
    ).then(({ data: { text } }) => {
        resultElement.innerHTML = 'Scanned Text: ' + text;  // Display extracted text
    }).catch(err => {
        resultElement.innerHTML = 'Error in OCR: ' + err;
    });
}

// Initialize events
function initEvent() {
    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(onMediaStream)
        .catch(onMediaError);

    // Set up button click listener for capturing the image
    document.getElementById('capture-btn').addEventListener('click', captureImage);
}

// Initialize the page
function init() {
    initElement();
    initEvent();
}

// Force HTTPS
if (window.location.protocol != 'https:' && window.location.protocol != 'file:') {
    window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}

// Wait for DOM content to load before running
window.addEventListener('DOMContentLoaded', init);
