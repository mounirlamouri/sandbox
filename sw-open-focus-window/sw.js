
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
    e.waitUntil(
    clients.getAll().then(function(clients) {
      clients.forEach(function(c) {
        if (c.url.search('blank') == -1)
          c.focus();
      });
    }));
  });
}

function testOpenWindow() {
  getNotificationClickAndExecute(function() {
    clients.openWindow('/sandbox/sw-open-focus-window/blank.html').
      then(testFocusWindow);
  });
}

self.onmessage = function(e) {
  if (e.data == 'start') {
    testOpenWindow();
  }
}

