/*
 *  Copyright (c) 2018 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
'use strict';

const preferredDisplaySurface = document.getElementById('displaySurface');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const replayButton = document.getElementById('replayButton');
const applyConstraints = document.getElementById('applyConstraints');

let recorder = null;
let recordChunks =[];

if (adapter.browserDetails.browser === 'chrome' &&
    adapter.browserDetails.version >= 107) {
  // See https://developer.chrome.com/docs/web-platform/screen-sharing-controls/
  document.getElementById('options').style.display = 'block';
} else if (adapter.browserDetails.browser === 'firefox') {
  // Polyfill in Firefox.
  // See https://blog.mozilla.org/webrtc/getdisplaymedia-now-available-in-adapter-js/
  adapter.browserShim.shimGetDisplayMedia(window, 'screen');
}

function handleSuccess(stream) {
  startButton.disabled = true;
  preferredDisplaySurface.disabled = true;
  const video = document.querySelector('video');
  video.srcObject = stream;

  // demonstrates how to detect that the user has stopped
  // sharing the screen via the browser UI.
  stream.getVideoTracks()[0].addEventListener('ended', () => {
    errorMsg('The user has ended sharing the screen');
    startButton.disabled = false;
    preferredDisplaySurface.disabled = false;
  });

  recorder = new MediaRecorder(stream, { mimeType: "video/webm; codecs=vp9" });
  recorder.start(1000);
  recorder.addEventListener('dataavailable', e => {
    console.log('dataavailable');
    recordChunks.push(e.data);
    console.log(e.data);
  });
}

function handleError(error) {
  errorMsg(`getDisplayMedia error: ${error.name}`, error);
}

function errorMsg(msg, error) {
  const errorElement = document.querySelector('#errorMsg');
  errorElement.innerHTML += `<p>${msg}</p>`;
  if (typeof error !== 'undefined') {
    console.error(error);
  }
}

startButton.addEventListener('click', () => {
  const options = {audio: true, video: true};
  const displaySurface = preferredDisplaySurface.options[preferredDisplaySurface.selectedIndex].value;
  if (displaySurface !== 'default') {
    options.video = {displaySurface};
  }
  navigator.mediaDevices.getDisplayMedia(options)
      .then(handleSuccess, handleError).then(() => {
        stopButton.disabled = false;
        replayButton.disabled = true;
        applyConstraints.disabled = false;
      })
});

stopButton.addEventListener('click', () => {
  startButton.disabled = false;
  stopButton.disabled = true;
  applyConstraints.disable = true;

  video.srcObject.getTracks().forEach(track => track.stop());

  recorder.addEventListener('stop', e => {
    replayButton.disabled = false;
  });
  recorder.stop();
});

replayButton.addEventListener('click', () => {
  const d = new Date();
  const blob = new Blob(recordChunks, { type: recorder.mimeType });
  const url =  URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.style = 'display: none';
  a.download = 'recording ' + d.getFullYear() + '-' + d.getMonth() + '-' + d.getDay() + '_' + d.getHours() + ':' + d.getMinutes() + '.webm';
  a.click();

  // Cleaning up.
  URL.revokeObjectURL(url);
  recordChunks = [];
});

applyConstraints.addEventListener('click', () => {
  console.log('apply constraints');
  const stream = video.srcObject;

  // Apply a random constraint on the stream, just for applying one.
  stream.getVideoTracks()[0].applyConstraints({
    width: { min: 640, ideal: 1280 },
    height: { min: 480, ideal: 720 },
    advanced: [{ width: 1920, height: 1280 }, { aspectRatio: 1.333 }],
  }).then(() => {
    console.log('constraints applied');
  });
});

if ((navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices)) {
  startButton.disabled = false;
} else {
  errorMsg('getDisplayMedia is not supported');
}
