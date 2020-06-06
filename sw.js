self.addEventListener("install", function (event) {
  console.log("[SW] Install");
  caches.delete('static');
  self.skipWaiting();
  event.waitUntil(
    caches.open("static").then(function (cache) {
      cache.addAll([
        "vendor/bootstrap/css/bootstrap.min.css",
        "https://fonts.googleapis.com/css?family=Saira+Extra+Condensed:500,700",
        "https://fonts.googleapis.com/css?family=Muli:400,400i,800,800i",
        "vendor/fontawesome-free/css/all.min.css",
        "css/resume.min.css",
        "/img/p1.jpg",
        "vendor/jquery/jquery.min.js",
        "vendor/bootstrap/js/bootstrap.bundle.min.js",
        "vendor/jquery-easing/jquery.easing.min.js",
        "js/resume.js",
        "vendor/fontawesome-free/webfonts/fa-brands-400.woff",
        "vendor/fontawesome-free/webfonts/fa-brands-400.ttf",
        "vendor/fontawesome-free/webfonts/fa-brands-400.woff2",
        "vendor/fontawesome-free/webfonts/fa-solid-900.woff",
        "vendor/fontawesome-free/webfonts/fa-solid-900.woff2",
      ]);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response;
      } else {
        return fetch(event.request);
      }
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  var notification = event.notification;
  var action = event.action;
  console.log(notification);
  clients.openWindow(notification.data.url);
  notification.close();
});

self.addEventListener("push", function (event) {
  var data = { title: "Something", content: "Some content", url:"https://avinshvidyarthi.github.io"};
  if (event.data) {
    data = JSON.parse(event.data.text());
  }
  var options = {
    body: data.content,
    icon: "../img/icons/icons-96x96.png",
    badge: "../img/icons/icons-96x96.png",
    vibrate: [100, 50, 200],
    data:{
        url:data.url
    }
  };
  if(data.image){
      options.image=data.image;
  }
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('activate', function(event){
  console.log("[SW] Activated");
});
