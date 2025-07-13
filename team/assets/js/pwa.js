// ===== PWA.JS - Progressive Web App Functions =====

// PWA Installation
let deferredPrompt;
let isInstalled = false;

// Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(registration => {
            console.log('✅ Service Worker registrato con successo');
            showNotification('PWA pronta per installazione!', 'success');
        })
        .catch(error => {
            console.log('ℹ️ Service Worker non disponibile (verificare file sw.js)');
        });
}

// PWA Install Prompt
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('installBtn').style.display = 'block';
    showNotification('App pronta per installazione!', 'success');
});

async function installApp() {
    if (deferredPrompt) {
        try {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                showNotification('App installata con successo!', 'success');
                document.getElementById('installBtn').style.display = 'none';
            }
            deferredPrompt = null;
        } catch (error) {
            showNotification('Errore durante l\'installazione', 'error');
        }
    } else {
        showNotification('Usa il menu del browser per installare l\'app', 'info');
    }
}

// PWA Install Detection
window.addEventListener('appinstalled', () => {
    const installBtn = document.getElementById('installBtn');
    if (installBtn) installBtn.style.display = 'none';
    showNotification('App installata con successo!', 'success');
});

// Handle PWA update
if ('serviceWorker' in navigator) {
    try {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            showNotification('App aggiornata! Ricarica per vedere le novità.', 'success');
        });
    } catch (error) {
        console.log('Service Worker events non disponibili in demo');
    }
}

// Notification Permission
function requestNotificationPermission() {
    try {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    showNotification('Notifiche attivate per il team!', 'success');
                } else {
                    showNotification('Notifiche disponibili nelle impostazioni browser', 'info');
                }
            }).catch(error => {
                console.log('Richiesta notifiche fallita:', error.message);
            });
        }
    } catch (error) {
        console.log('API notifiche non disponibile:', error.message);
    }
}

// PWA Auto-hide install button if already installed
try {
    if (window.matchMedia('(display-mode: standalone)').matches) {
        const installBtn = document.getElementById('installBtn');
        if (installBtn) installBtn.style.display = 'none';
    } else {
        setTimeout(() => {
            const installBtn = document.getElementById('installBtn');
            if (installBtn) installBtn.style.display = 'block';
        }, 3000);
    }
} catch (error) {
    console.log('Gestione pulsante install non disponibile:', error.message);
}

// PWA Theme Color Management
function updateThemeColor(color) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', color);
    }
}

// PWA Offline Detection
function handleOfflineStatus() {
    if (!navigator.onLine) {
        showNotification('Modalità offline - alcune funzioni potrebbero non essere disponibili', 'warning');
    }
}

// PWA Background Sync (if supported)
function registerBackgroundSync() {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then(registration => {
            return registration.sync.register('background-sync');
        }).catch(error => {
            console.log('Background sync non supportato:', error.message);
        });
    }
}

// PWA Push Notifications Setup
function setupPushNotifications() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        navigator.serviceWorker.ready.then(registration => {
            // Setup push notifications (requires server setup)
            console.log('Push notifications setup ready');
        }).catch(error => {
            console.log('Push notifications setup failed:', error.message);
        });
    }
}

// PWA Share API
function shareContent(title, text, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        }).then(() => {
            showNotification('Contenuto condiviso con successo!', 'success');
        }).catch(error => {
            console.log('Condivisione fallita:', error.message);
        });
    } else {
        // Fallback per browser che non supportano Web Share API
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                showNotification('Link copiato negli appunti!', 'success');
            });
        } else {
            showNotification('Condivisione non supportata su questo browser', 'info');
        }
    }
}

// PWA Add to Home Screen Banner
function showAddToHomeScreenBanner() {
    const banner = document.createElement('div');
    banner.className = 'add-to-home-banner';
    banner.innerHTML = `
        <div style="
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: var(--gradient-primary);
            color: white;
            padding: 1rem;
            text-align: center;
            z-index: 1001;
            box-shadow: var(--shadow-dark);
        ">
            <p>Installa RC Team per un accesso rapido!</p>
            <button onclick="installApp()" style="
                background: white;
                color: var(--primary);
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                margin: 0 0.5rem;
                cursor: pointer;
            ">Installa</button>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: transparent;
                color: white;
                border: 1px solid white;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                margin: 0 0.5rem;
                cursor: pointer;
            ">Chiudi</button>
        </div>
    `;
    
    document.body.appendChild(banner);
    
    // Auto remove after 10 seconds
    setTimeout(() => {
        if (banner.parentElement) {
            banner.remove();
        }
    }, 10000);
}

// PWA Cache Management
function clearAppCache() {
    if ('caches' in window) {
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    return caches.delete(cacheName);
                })
            );
        }).then(() => {
            showNotification('Cache dell\'app pulita!', 'success');
            window.location.reload();
        });
    }
}

// PWA Update Check
function checkForUpdates() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(registration => {
            if (registration) {
                registration.update().then(() => {
                    showNotification('Controllo aggiornamenti completato', 'info');
                });
            }
        });
    }
}

// PWA Viewport Meta Management
function updateViewportMeta() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        // Enhanced viewport for PWA
        viewport.setAttribute('content', 
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
        );
    }
}

// PWA Status Bar Management
function updateStatusBarStyle() {
    const statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (statusBarMeta) {
        statusBarMeta.setAttribute('content', 'black-translucent');
    }
}

// PWA Full Screen Request
function requestFullScreen() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
    }
}

// PWA Screen Wake Lock (prevent screen from sleeping during app use)
let wakeLock = null;

async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Wake lock attivato');
        }
    } catch (error) {
        console.log('Wake lock non supportato:', error.message);
    }
}

function releaseWakeLock() {
    if (wakeLock) {
        wakeLock.release();
        wakeLock = null;
        console.log('Wake lock rilasciato');
    }
}

// PWA Orientation Management
function lockOrientation(orientation = 'portrait') {
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock(orientation).catch(error => {
            console.log('Orientation lock non supportato:', error.message);
        });
    }
}

// PWA Connectivity Status
function updateConnectivityStatus() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
        const updateOnlineStatus = () => {
            const status = navigator.onLine ? 'online' : 'offline';
            const speed = connection.effectiveType || 'unknown';
            
            console.log(`Connessione: ${status}, Velocità: ${speed}`);
            
            if (!navigator.onLine) {
                showNotification('Connessione assente - modalità offline', 'warning');
            }
        };
        
        connection.addEventListener('change', updateOnlineStatus);
        updateOnlineStatus();
    }
}

// PWA Battery Status (if supported)
function monitorBatteryStatus() {
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            const updateBatteryInfo = () => {
                const level = Math.round(battery.level * 100);
                const charging = battery.charging;
                
                if (level < 20 && !charging) {
                    showNotification('Batteria scarica - considera il risparmio energetico', 'warning');
                }
            };
            
            battery.addEventListener('levelchange', updateBatteryInfo);
            battery.addEventListener('chargingchange', updateBatteryInfo);
            updateBatteryInfo();
        });
    }
}

// PWA App Shortcuts (handled in manifest.json)
function handleAppShortcuts() {
    // Check if app was launched from a shortcut
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    
    if (page) {
        setTimeout(() => {
            showPage(page);
        }, 500);
    }
}

// PWA Performance Monitoring
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            
            if (loadTime > 3000) {
                console.log('App caricamento lento:', loadTime + 'ms');
            } else {
                console.log('App caricamento veloce:', loadTime + 'ms');
            }
        });
    }
}

// PWA Error Tracking
function setupErrorTracking() {
    window.addEventListener('error', (event) => {
        console.error('PWA Error:', event.error);
        // In produzione, inviare errori a servizio di tracking
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        console.error('PWA Unhandled Promise:', event.reason);
        event.preventDefault();
    });
}

// PWA Initialization
function initializePWA() {
    console.log('🚀 Inizializzazione PWA...');
    
    updateViewportMeta();
    updateStatusBarStyle();
    updateConnectivityStatus();
    handleAppShortcuts();
    monitorPerformance();
    setupErrorTracking();
    
    // Request notifications permission after delay
    setTimeout(() => {
        requestNotificationPermission();
    }, 5000);
    
    // Monitor battery if supported
    setTimeout(() => {
        monitorBatteryStatus();
    }, 2000);
    
    console.log('✅ PWA inizializzata');
}

// Auto-initialize PWA features when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePWA);
} else {
    initializePWA();
}

// Export PWA functions
window.installApp = installApp;
window.clearAppCache = clearAppCache;
window.checkForUpdates = checkForUpdates;
window.shareContent = shareContent;
window.requestWakeLock = requestWakeLock;
window.releaseWakeLock = releaseWakeLock;