'use strict';

let message = {};
let video = {};

function initElement() {
  message = document.getElementById('msg');
  video = document.querySelector('#qr-reader video');

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

function onMediaStream(stream) {
  if ('srcObject' in video) {
    video.srcObject = stream;
  } else {
    video.src = window.URL.createObjectURL(stream);
  }

  message.style.display = 'none';  // Hide the message asking for camera access
  video.play();  // Start playing the video
}

function onMediaError(err) {
  message.innerHTML = err.name + ': ' + err.message;  // Show the error message if camera access fails
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

// Force the site to use HTTPS if not using file protocol
if (window.location.protocol != 'https:' && window.location.protocol != 'file:') {
  window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}

window.addEventListener('DOMContentLoaded', init);
