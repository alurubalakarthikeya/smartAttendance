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

