
console.log('started');

function getNotificationClickAndExecute(callback) {
  var callback_wrapper = function(e) {
    self.removeEventListener('notificationclick', callback_wrapper);
    callback(e);
  }
  self.addEventListener('notificationclick', callback_wrapper);

  self.registration.showNotification('test');
}

function testFocusWindow() {
  getNotificationClickAndExecute(function(e) {
    e.waitUntil(clients.getAll().then(function(clients) {
      clients.forEach(function(c) {
        if (c.url.search('blank') == -1)
          c.focus().then(function(result) {
            console.log(result);
          });
      });
    }));
  });
}

function testOpenWindow() {
  getNotificationClickAndExecute(function(e) {
    // This is using waitUntil() to work around a bug that has a fix
    // waiting for review in https://codereview.chromium.org/896043004
    e.waitUntil(clients.getAll().then(function() {
      clients.openWindow('/sandbox/sw-open-focus-window/blank.html')
      .then(function(result) {
        console.log(result);
      }).then(testFocusWindow);
    }));
  });
}

self.onmessage = function(e) {
  if (e.data == 'start') {
    testOpenWindow();
  }
}

