
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
      if (clients.length > 0)
        clienst[0].focus();
    }));
  });
}

self.onmessage = function(e) {
  if (e.data == 'start') {
    testFocusWindow();
  }
}

