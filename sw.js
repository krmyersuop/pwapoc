let cacheName = 'v1';
let dataCacheName = 'data-v1';
let cacheFiles = [
				'./',
				'./index.html',
				'./app.js',
				'./styles.css',
				// './favicon-32x32.png',
				// './favicon.ico'
			]

self.addEventListener('install', event => {
	console.log('SW installed')
	event.waitUntil(
		caches.open(cacheName).then(cache => {
			console.log('[Service Worker] caching cacheFiles');
			return cache.addAll(cacheFiles);
		})
	)
})

self.addEventListener('activate', event => {
	console.log('SW activated')
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(cacheNames.map(thisCacheName => {
				if(thisCacheName !== cacheName && thisCacheName !== dataCacheName){
					console.log('SW Removing cached files from: ' + thisCacheName);
					return caches.delete(thisCacheName);
				}
			}))
		})
	)
})

self.addEventListener('fetch', event => {
	console.log('SW fetching', event.request.url)

	if (event.request.url.includes('/apis/')) {
		event.respondWith(
			caches.open(dataCacheName).then((cache) => {
			  return fetch(event.request)
				  .then((response) => {
					if (response.status === 200) {
					  cache.put(event.request.url, response.clone());
					}
					return response;
				  }).catch((err) => {
					return cache.match('notfound');//cache.match(event.request);
				  });
		}));
		return;
	}

	event.respondWith(
		caches.match(event.request)
		.then(response => {
			if(response){
				console.log('SW found in cache', event.request.url, response);
				return response;
			}

			let requestClone = event.request.clone();
			return fetch(requestClone)
			.then(response => {
				if(!response){
					console.log('SW no response from fetch');
					return response;
				}
					let responseClone = response.clone();
					caches.open(cacheName).then(cache => {
						cache.put(event.request, responseClone);
						console.log('SW New Data Cached', event.request.url);
						return response;
					});
				})
			.catch(error => {
				console.log('SW Error fetching and caching new data', error)
			})
		})
	);
});

self.addEventListener('notificationclose', event=>{
	let notification = event.notification;
	let primaryKey = notification.data.primaryKey;
	console.log('Closed notification: ' + primaryKey);
})

self.addEventListener('notificationclick', event=>{
	let notification = event.notification;
	let action = event.action;
	if(event.action === 'close'){
		notification.close();
	} else {
		clients.openWindow('https://lshah.github.io/pwademo/another-blog.html');
		notification.close();
	}
})
