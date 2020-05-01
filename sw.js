self.addEventListener('install',function(event){
    console.log("[SW] Install");
    event.waitUntil(
        caches.open('static').then(function(cache){
            cache.addAll([
                'index.html',
                'avinash_resume.pdf',
                'vendor/bootstrap/css/bootstrap.min.css',
                'https://fonts.googleapis.com/css?family=Saira+Extra+Condensed:500,700',
                'https://fonts.googleapis.com/css?family=Muli:400,400i,800,800i',
                'vendor/fontawesome-free/css/all.min.css',
                'css/resume.min.css',
                '/img/p1.jpg',
                'vendor/jquery/jquery.min.js',
                'vendor/bootstrap/js/bootstrap.bundle.min.js',
                'vendor/jquery-easing/jquery.easing.min.js',
                'js/resume.js',
                'vendor/fontawesome-free/webfonts/fa-brands-400.woff',
                'vendor/fontawesome-free/webfonts/fa-brands-400.ttf',
                'vendor/fontawesome-free/webfonts/fa-brands-400.woff2',
                'vendor/fontawesome-free/webfonts/fa-solid-900.woff',
                'vendor/fontawesome-free/webfonts/fa-solid-900.woff2'
            ]);
            cache.add('/');
        })
    );
});

self.addEventListener('fetch',function(event){
    event.respondWith(
        caches.match(event.request).then(function(response){
            if(response){
                return response;
            }
            else{
                return fetch(event.request);
            }
        })
    )
});