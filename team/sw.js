// Service Worker per RC Junior/Senior Team
const CACHE_NAME = 'rc-team-v1.0.1'; // VERSIONE AGGIORNATA
const urlsToCache = [
  '/team/',
  '/team/index.html',
  '/team/manifest.json',
  '/team/img/logo/logo-main.png',
  '/team/img/icons/icon-192.png',
  '/team/img/icons/icon-512.png',
  '/team/img/icons/favicon.ico',
  '/team/img/pilots/default-pilot.jpg',
  '/team/img/sponsors/default-sponsor.png',
  // Aggiungi qui altri file statici quando li creerai
];

// Installazione Service Worker
self.addEventListener('install', event => {
  console.log('SW: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('SW: Skip waiting');
        return self.skipWaiting();
      })
  );
});

// Attivazione Service Worker
self.addEventListener('activate', event => {
  console.log('SW: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('SW: Claiming clients');
      return self.clients.claim();
    })
  );
});

// Strategia di caching: Network First con fallback su cache
self.addEventListener('fetch', event => {
  // Solo per richieste GET
  if (event.request.method !== 'GET') return;
  
  // Escludi richieste API e admin
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('admin.php')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Se la richiesta va a buon fine, aggiorna la cache
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        // Se la rete non è disponibile, usa la cache
        return caches.match(event.request)
          .then(response => {
            if (response) {
              return response;
            }
            // Se non c'è cache, mostra pagina offline
            if (event.request.destination === 'document') {
              return caches.match('/team/offline.html');
            }
          });
      })
  );
});

// Gestione notifiche push
self.addEventListener('push', event => {
  console.log('SW: Push notification received');
  
  let notificationData = {};
  
  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      notificationData = {
        title: 'RC Junior/Senior',
        body: event.data.text() || 'Nuovo aggiornamento dal team!',
        icon: '/team/icon-192.png',
        badge: '/team/badge-72.png'
      };
    }
  } else {
    notificationData = {
      title: 'RC Junior/Senior',
      body: 'Nuovo aggiornamento dal team!',
      icon: '/team/icon-192.png',
      badge: '/team/badge-72.png'
    };
  }

  const notificationOptions = {
    body: notificationData.body,
    icon: notificationData.icon || '/team/img/icons/icon-192.png',
    badge: notificationData.badge || '/team/img/icons/badge-72.png',
    tag: notificationData.tag || 'rc-team-notification',
    data: {
      url: notificationData.url || '/team/',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'open',
        title: 'Apri App',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>'
      },
      {
        action: 'dismiss',
        title: 'Chiudi',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'
      }
    ],
    requireInteraction: false,
    silent: false,
    vibrate: [200, 100, 200],
    timestamp: Date.now()
  };

  event.waitUntil(
    self.registration.showNotification(
      notificationData.title || 'RC Junior/Senior',
      notificationOptions
    )
  );
});

// Gestione click sulle notifiche
self.addEventListener('notificationclick', event => {
  console.log('SW: Notification clicked');
  
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/team/';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(clientList => {
      // Controlla se c'è già una finestra aperta
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes('/team/') && 'focus' in client) {
          client.focus();
          return client.navigate(urlToOpen);
        }
      }
      // Se non c'è una finestra aperta, aprila
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Gestione chiusura notifiche
self.addEventListener('notificationclose', event => {
  console.log('SW: Notification closed');
  
  // Analytics o tracking se necessario
  const notificationData = event.notification.data || {};
  
  // Invia statistiche al server (opzionale)
  if (notificationData.trackClose) {
    fetch('/team/api.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'notification_closed',
        timestamp: Date.now(),
        tag: event.notification.tag
      })
    }).catch(err => console.log('SW: Failed to send close analytics', err));
  }
});

// Sincronizzazione in background
self.addEventListener('sync', event => {
  console.log('SW: Background sync triggered');
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      syncData()
    );
  }
});

// Funzione per sincronizzare dati offline
async function syncData() {
  try {
    // Recupera dati salvati offline da IndexedDB o localStorage
    const offlineData = await getOfflineData();
    
    if (offlineData.length > 0) {
      // Invia dati al server
      const response = await fetch('/team/api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'sync_offline_data',
          data: offlineData
        })
      });
      
      if (response.ok) {
        // Pulisci dati offline sincronizzati
        await clearOfflineData();
        console.log('SW: Offline data synced successfully');
      }
    }
  } catch (error) {
    console.log('SW: Sync failed', error);
  }
}

// Funzioni helper per gestione dati offline
async function getOfflineData() {
  // Implementa recupero dati da IndexedDB
  // Per ora restituisce array vuoto
  return [];
}

async function clearOfflineData() {
  // Implementa pulizia dati da IndexedDB
  console.log('SW: Offline data cleared');
}

// Gestione aggiornamenti app
self.addEventListener('message', event => {
  console.log('SW: Message received', event.data);
  
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
      case 'GET_VERSION':
        event.ports[0].postMessage({
          version: CACHE_NAME
        });
        break;
      case 'FORCE_UPDATE':
        // Forza aggiornamento cache
        caches.delete(CACHE_NAME).then(() => {
          self.skipWaiting();
        });
        break;
    }
  }
});

// Gestione installazione app
self.addEventListener('beforeinstallprompt', event => {
  console.log('SW: Before install prompt');
  // L'evento viene gestito dalla pagina principale
});

// Gestione errori
self.addEventListener('error', event => {
  console.error('SW: Error occurred', event.error);
});

// Gestione errori non gestiti
self.addEventListener('unhandledrejection', event => {
  console.error('SW: Unhandled rejection', event.reason);
});

// Utility: Cache delle immagini dinamicamente
async function cacheImages(imageUrls) {
  const cache = await caches.open(CACHE_NAME);
  
  const cachePromises = imageUrls.map(async (url) => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response);
      }
    } catch (error) {
      console.log('SW: Failed to cache image', url, error);
    }
  });
  
  return Promise.all(cachePromises);
}

// Utility: Pulizia cache vecchia
async function cleanOldCaches() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(name => 
    name.startsWith('rc-team-') && name !== CACHE_NAME
  );
  
  return Promise.all(
    oldCaches.map(name => caches.delete(name))
  );
}

// Utility: Preload delle risorse critiche
async function preloadCriticalResources() {
  const cache = await caches.open(CACHE_NAME);
  
  const criticalResources = [
    '/team/',
    '/team/index.html',
    '/team/manifest.json'
  ];
  
  return cache.addAll(criticalResources);
}

// Inizializzazione service worker
console.log('SW: Service Worker loaded for RC Junior/Senior Team');

// Versioning e debugging
self.version = '1.0.0';
self.debug = true;

if (self.debug) {
  console.log('SW: Debug mode enabled');
  console.log('SW: Cache name:', CACHE_NAME);
  console.log('SW: URLs to cache:', urlsToCache);
}