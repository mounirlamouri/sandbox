self.addEventListener('activate', function(event) {
  event.waitUntil(
    clients.claim().then(() => {
      return self.clients.matchAll().then(function(clients) {
        return Promise.all(clients.map(function(client) {
          return client.postMessage(navigator.userAgent);
        }));
      });
    })
  );
});

self.addEventListener('message', function(event) {
  console.log('Message received');
  if (event.data.type === 'GET_USER_AGENT') {
    self.clients.matchAll().then(function(clients) {
      return Promise.all(clients.map(function(client) {
        return client.postMessage(navigator.userAgent);
      }));
    })
  };
});
