self.onmessage = function(event) {
//  event.waitUntil(
//  );
  console.log('message received ' + event);
  
  event.waitUntil(
    return self.clients.getAll().then(function(c) {
      return c[0].focus();
    });
  );
};

console.log('fooba');
