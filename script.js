document.addEventListener('DOMContentLoaded', () => {
    const qrReader = new Html5Qrcode("qr-reader");
    const modal = document.getElementById('camera-access-modal');
    const closeModal = document.querySelector('.modal .close');
    const grantAccessBtn = document.getElementById('grant-access-btn');

    function startQrScanner(facingMode = "environment") {
        qrReader.start(
            { facingMode: facingMode },
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
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

    function showModal() {
        modal.style.display = "block";
    }

    function closeModalHandler() {
        modal.style.display = "none";
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(() => {
                startQrScanner(); // Start QR scanner once access is granted
            })
            .catch(err => {
                console.log("Camera access denied:", err);
            });
    }

    // Show the modal on page load
    showModal();

    // Close the modal when the user clicks the 'x'
    closeModal.addEventListener('click', closeModalHandler);

    // Close the modal when the user clicks 'Grant Access'
    grantAccessBtn.addEventListener('click', closeModalHandler);

    // Stop QR scanning
    document.getElementById('stopScan').addEventListener('click', () => {
        qrReader.stop().then(() => {
            document.getElementById('result').innerText = 'Scan stopped.';
        }).catch((err) => {
            console.log("Error stopping the QR scanner:", err);
        });
    });
});

'use strict';

var message = {},
  wrapper = {},
  buttonNewPhoto = {},
  buttonDownload = {},
  video = {},
  canvas = {};

function initElement() {
  message = document.getElementById('msg');
  wrapper = document.getElementById('wrapper');
  buttonNewPhoto = document.getElementById('newphoto');
  buttonDownload = document.getElementById('download');
  video = document.querySelector('video');
  canvas = document.querySelector('canvas');

  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }

  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints) {

      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

      if (!getUserMedia) {
        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
      }

      return new Promise(function (resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      })
    }
  }
}

function onTakeAPhoto() {
  canvas.getContext('2d').drawImage(video, 0, 0, video.width, video.height);
  buttonDownload.removeAttribute('disabled');
}

function onDownloadPhoto() {
  canvas.toBlob(function (blob) {
    var link = document.createElement('a');
    link.download = 'photo.jpg';
    link.setAttribute('href', URL.createObjectURL(blob));
    link.dispatchEvent(new MouseEvent('click'));

  }, 'image/jpeg', 1);
}

function onLoadVideo() {
  video.setAttribute('width', this.videoWidth);
  video.setAttribute('height', this.videoHeight);
  canvas.setAttribute('width', this.videoWidth);
  canvas.setAttribute('height', this.videoHeight);
  video.play();
}

function onMediaStream(stream) {
  if ('srcObject' in video) {
    video.srcObject = stream;
  } else {
    video.src = window.URL.createObjectURL(stream);
  }

  message.style.display = 'none';
  wrapper.style.display = 'block';
  buttonNewPhoto.addEventListener('click', onTakeAPhoto);
  buttonDownload.addEventListener('click', onDownloadPhoto);
  video.addEventListener('loadedmetadata', onLoadVideo);
}

function onMediaError(err) {
  message.innerHTML = err.name + ': ' + err.message;
}

function initEvent() {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(onMediaStream)
    .catch(onMediaError);
}

function init() {
  initElement();
  initEvent();
}

if (window.location.protocol != 'https:' && window.location.protocol != 'file:') {
  window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}

window.addEventListener('DOMContentLoaded', init);

