self.onmessage = function(event) {
//  event.waitUntil(
//  );
  console.log('message received ' + event);
  self.clients.getAll().then(function(c) {
    console.log(c);
  });
  
  event.waitUntil(
//    self.clients.getAll().then(function(c) {
//      console.log('trying to focus');
//      return c[0].focus();
//    });
  );
};

console.log('fooba');
