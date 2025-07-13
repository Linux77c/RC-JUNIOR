// ===== APP.JS - JavaScript Principale RC Team =====


// CORREZIONE NAVIGAZIONE - Mapping pagine
const PAGE_MAPPING = {
    'home': 'home',
    'piloti': 'pilots',
    'sponsor': 'sponsors', 
    'eventi': 'events',
    'unisciti': 'join',
    'area piloti': 'pilot-area',
    'contatti': 'contact',
    'admin': 'admin'
};

// CORREZIONE: Funzione showPage migliorata
function showPage(pageId) {
    console.log('🎯 Navigazione verso:', pageId);
    
    // Nascondi tutte le pagine
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });
    
    // Mostra la pagina selezionata
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        targetPage.style.display = 'block';
        
        // CORREZIONE: Forza visibilità per eventi
        if (pageId === 'events') {
            setTimeout(() => {
                const eventsGrid = document.getElementById('eventsGrid');
                if (eventsGrid) {
                    eventsGrid.style.display = 'grid';
                    eventsGrid.style.visibility = 'visible';
                    eventsGrid.style.opacity = '1';
                    
                    // Forza visibilità di ogni card evento
                    eventsGrid.querySelectorAll('.card').forEach(card => {
                        card.style.display = 'block';
                        card.style.visibility = 'visible';
                        card.style.opacity = '1';
                    });
                }
                
                // Ricarica eventi se necessario
                loadEvents();
            }, 100);
        }
    } else {
        console.error('❌ Pagina non trovata:', pageId);
        return;
    }
    
    // CORREZIONE: Aggiorna navigazione attiva
    updateActiveNavigation(pageId);
    
    // Carica dati della pagina
    loadPageData(pageId);
    
    // Scorri in alto
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// CORREZIONE: Funzione per aggiornare navigazione attiva
function updateActiveNavigation(pageId) {
    // Rimuovi classe active da tutti i pulsanti
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Trova il pulsante corrispondente
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        const btnText = btn.textContent.toLowerCase().trim();
        
        // Mapping più preciso
        const matches = {
            'home': btnText === 'home',
            'pilots': btnText === 'piloti',
            'sponsors': btnText === 'sponsor',
            'events': btnText === 'eventi',
            'join': btnText === 'unisciti',
            'pilot-area': btnText === 'area piloti',
            'contact': btnText === 'contatti',
            'admin': btnText === 'admin'
        };
        
        if (matches[pageId]) {
            btn.classList.add('active');
            console.log('✅ Pulsante attivato:', btnText);
        }
    });
}

// In app.js, trova la funzione loadPageData e sostituiscila con:

// Caricamento dati per pagina
function loadPageData(pageId) {
    // Aggiungi un flag per evitare chiamate duplicate
    if (window.loadingPage === pageId) return;
    window.loadingPage = pageId;
    
    switch(pageId) {
        case 'pilots':
            loadPilots();
            break;
        case 'sponsors':
            loadSponsors();
            break;
        case 'events':
            loadEvents();
            break;
        case 'admin':
            if (typeof updateAdminStats === 'function') {
                updateAdminStats();
            }
            break;
    }
    
    // Reset flag dopo un breve delay
    setTimeout(() => {
        window.loadingPage = null;
    }, 100);
}

// Data Management
function getStorageData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Error reading storage:', e);
        return [];
    }
}

function setStorageData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('Error saving storage:', e);
    }
}

// CORREZIONE: Load Events migliorata per responsive
function loadEvents() {
    console.log('📅 Caricamento eventi...');
    
    const events = getStorageData('events');
    const grid = document.getElementById('eventsGrid');
    
    if (!grid) {
        console.error('❌ eventsGrid non trovato');
        return;
    }
    
    if (events.length === 0) {
        grid.innerHTML = '<div class="card"><p>Nessun evento trovato.</p></div>';
        return;
    }

    // CORREZIONE: Eventi ora visibili anche in responsive
    const eventsHTML = events.map(event => `
        <div class="card" style="display: block !important; visibility: visible !important; opacity: 1 !important;">
            <h3>🏁 ${event.name}</h3>
            <p><strong>📅 Data:</strong> ${formatDate(event.date)}</p>
            <p><strong>📍 Pista:</strong> ${event.trackName || 'Da definire'}</p>
            <p><strong>🗺️ Indirizzo:</strong> ${event.trackAddress || 'Da definire'}</p>
            <p>${event.description || 'Evento del team RC Junior/Senior'}</p>
            <button class="btn" onclick="openMap('${event.trackAddress || 'Milano'}')">📍 Visualizza Mappa</button>
        </div>
    `).join('');
    
    grid.innerHTML = eventsHTML;
    
    // CORREZIONE: Forza CSS per responsive
    grid.style.display = 'grid';
    grid.style.visibility = 'visible';
    grid.style.opacity = '1';
    
    // Forza visibilità cards
    setTimeout(() => {
        grid.querySelectorAll('.card').forEach(card => {
            card.style.display = 'block';
            card.style.visibility = 'visible';
            card.style.opacity = '1';
        });
    }, 50);
    
    console.log(`✅ Caricati ${events.length} eventi`);
}

// Load Pilots
function loadPilots() {
    const pilots = getStorageData('pilots');
    const grid = document.getElementById('pilotsGrid');
    
    if (!grid) return;
    
    if (pilots.length === 0) {
        grid.innerHTML = '<div class="card"><p>Nessun pilota trovato.</p></div>';
        return;
    }

    grid.innerHTML = pilots.map(pilot => `
        <div class="card pilot-card">
            <div class="pilot-category">${pilot.category}</div>
            <div class="pilot-avatar" data-initials="${pilot.name.charAt(0)}${pilot.surname.charAt(0)}">
                ${pilot.photo ? `<img src="img/pilots/${pilot.photo}" alt="${pilot.name} ${pilot.surname}" onerror="this.style.display='none'">` : ''}
            </div>
            <h3>${pilot.name} ${pilot.surname}</h3>
            <p>${pilot.bio || 'Pilota del team RC Junior/Senior'}</p>
        </div>
    `).join('');
}

// Load Sponsors
function loadSponsors() {
    const sponsors = getStorageData('sponsors');
    const grid = document.getElementById('sponsorsGrid');
    
    if (!grid) return;
    
    if (sponsors.length === 0) {
        grid.innerHTML = '<div class="card"><p>Nessun sponsor trovato.</p></div>';
        return;
    }

    grid.innerHTML = sponsors.map(sponsor => `
        <div class="card sponsor-card">
            <div class="sponsor-logo">
                ${sponsor.logo ? `<img src="img/sponsors/${sponsor.logo}" alt="${sponsor.name}" onerror="this.style.display='none'">` : ''}
            </div>
            <h3>${sponsor.name}</h3>
            <p>${sponsor.description}</p>
            ${sponsor.website ? `<a href="${sponsor.website}" target="_blank" class="btn">Visita Sito</a>` : ''}
        </div>
    `).join('');
}

// Funzione helper per formattare date
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (e) {
        return dateString;
    }
}

function openMap(address) {
    const encodedAddress = encodeURIComponent(address || 'Milano');
    window.open(`https://maps.google.com/maps?q=${encodedAddress}`, '_blank');
}

// Initialize sample data
function initSampleData() {
    if (!localStorage.getItem('pilots')) {
        const samplePilots = [
            {
                id: 1,
                name: 'Marco',
                surname: 'Rossi',
                category: 'Senior',
                bio: 'Pilota esperto con 10 anni di esperienza nel RC Buggy 1/8',
                email: 'marco.rossi@email.com',
                password: 'pilot123'
            },
            {
                id: 2,
                name: 'Luca',
                surname: 'Bianchi',
                category: 'Junior',
                bio: 'Giovane promessa del team, molto determinato e in rapida crescita',
                email: 'luca.bianchi@email.com',
                password: 'pilot123'
            },
            {
                id: 3,
                name: 'Andrea',
                surname: 'Verdi',
                category: 'Senior',
                bio: 'Specialista in setup e tuning, mentor dei piloti Junior',
                email: 'andrea.verdi@email.com',
                password: 'pilot123'
            }
        ];
        setStorageData('pilots', samplePilots);
    }

    if (!localStorage.getItem('sponsors')) {
        const sampleSponsors = [
            {
                id: 1,
                name: 'Evolution Modellismo',
                description: 'Partner principale del team, fornisce materiali e supporto tecnico',
                website: 'https://evolution-modellismo.com',
                logo: ''
            },
            {
                id: 2,
                name: 'RC Parts Store',
                description: 'Fornitore di ricambi e accessori per RC Buggy 1/8',
                website: 'https://rcparts.it',
                logo: ''
            }
        ];
        setStorageData('sponsors', sampleSponsors);
    }

    if (!localStorage.getItem('events')) {
        const sampleEvents = [
            {
                id: 1,
                name: 'Gara Regionale Buggy 1/8',
                date: '2025-07-20',
                trackName: 'Pista RC Milano',
                trackAddress: 'Via Roma 123, Milano',
                description: 'Prima partecipazione del team alla gara regionale'
            },
            {
                id: 2,
                name: 'Allenamento Collettivo',
                date: '2025-07-25',
                trackName: 'Pista RC Monza',
                trackAddress: 'Via delle Corse 45, Monza',
                description: 'Sessione di allenamento per preparare la gara di agosto'
            },
            {
                id: 3,
                name: 'Campionato Regionale',
                date: '2025-08-15',
                trackName: 'RC Park Bergamo',
                trackAddress: 'Strada Provinciale 24, Bergamo',
                description: 'Partecipazione al campionato regionale lombardo'
            }
        ];
        setStorageData('events', sampleEvents);
    }

    // Materiali con dati completi
    if (!localStorage.getItem('materials')) {
        const sampleMaterials = [
            {
                id: 1,
                type: 'T-Shirt',
                description: 'Magliette ufficiali del team con logo Evolution Modellismo',
                quantity: 20,
                assigned: 5,
                sponsor: 'Evolution Modellismo',
                received: '2025-07-01',
                sizes: 'XS(2), S(4), M(6), L(5), XL(3)',
                color: 'Arancione/Nero'
            },
            {
                id: 2,
                type: 'Cappellini',
                description: 'Cappellini con logo team e sponsor',
                quantity: 15,
                assigned: 3,
                sponsor: 'Evolution Modellismo',
                received: '2025-07-01',
                sizes: 'Taglia unica regolabile',
                color: 'Nero'
            },
            {
                id: 3,
                type: 'Adesivi',
                description: 'Set adesivi per carrozzerie con loghi sponsor',
                quantity: 50,
                assigned: 8,
                sponsor: 'Evolution Modellismo',
                received: '2025-07-01',
                sizes: 'Set da 10 pezzi',
                color: 'Multicolore'
            },
            {
                id: 4,
                type: 'Portachiavi',
                description: 'Gadget promozionale a forma di buggy',
                quantity: 30,
                assigned: 4,
                sponsor: 'Evolution Modellismo',
                received: '2025-07-01',
                sizes: 'Taglia unica',
                color: 'Arancione'
            },
            {
                id: 5,
                type: 'Borracce',
                description: 'Borracce termiche brandizzate team',
                quantity: 12,
                assigned: 2,
                sponsor: 'Evolution Modellismo',
                received: '2025-07-05',
                sizes: '500ml',
                color: 'Nero/Arancione'
            }
        ];
        setStorageData('materials', sampleMaterials);
    }

    if (!localStorage.getItem('pilot_registrations')) {
        setStorageData('pilot_registrations', []);
    }

    if (!localStorage.getItem('material_assignments')) {
        setStorageData('material_assignments', []);
    }
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        
        // Carica contenuto specifico per ogni modal
        switch(modalId) {
            case 'materialModal':
                setTimeout(() => {
                    if (typeof loadMaterialList === 'function') {
                        loadMaterialList();
                    }
                }, 100);
                break;
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

// Notifications
function showNotification(message, type = 'info') {
    try {
        const notification = document.getElementById('notification');
        const text = document.getElementById('notificationText');
        
        if (notification && text) {
            text.textContent = message;
            notification.className = `notification ${type}`;
            notification.classList.add('show');
            
            setTimeout(() => {
                if (notification.classList) {
                    notification.classList.remove('show');
                }
            }, 4000);
        } else {
            console.log(`📢 ${type.toUpperCase()}: ${message}`);
        }
    } catch (error) {
        console.log(`Notifica: ${message}`);
    }
}

// CORREZIONE: Event listeners per navigazione
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('nav-btn')) {
        event.preventDefault();
        
        const buttonText = event.target.textContent.toLowerCase().trim();
        let pageId = 'home';
        
        // Mapping preciso
        if (buttonText === 'home') pageId = 'home';
        else if (buttonText === 'piloti') pageId = 'pilots';
        else if (buttonText === 'sponsor') pageId = 'sponsors';
        else if (buttonText === 'eventi') pageId = 'events';
        else if (buttonText === 'unisciti') pageId = 'join';
        else if (buttonText === 'area piloti') pageId = 'pilot-area';
        else if (buttonText === 'contatti') pageId = 'contact';
        else if (buttonText === 'admin') pageId = 'admin';
        
        showPage(pageId);
    }
});

// Close modals when clicking outside
window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
});

// Form Functions
function calculateCategory() {
    const birthDate = new Date(document.getElementById('regBirthDate').value);
    const today = new Date();
    const age = Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
    
    const categoryField = document.getElementById('regCategory');
    if (categoryField) {
        if (age < 18) {
            categoryField.value = 'Junior';
        } else {
            categoryField.value = 'Senior';
        }
    }
}

function submitRegistration(event) {
    event.preventDefault();
    
    const password = document.getElementById('regPassword').value;
    const passwordConfirm = document.getElementById('regPasswordConfirm').value;
    
    if (password !== passwordConfirm) {
        showNotification('Le password non corrispondono!', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('La password deve essere di almeno 6 caratteri!', 'error');
        return;
    }

    if (!document.getElementById('regAcceptTerms').checked) {
        showNotification('Devi accettare i termini e condizioni!', 'error');
        return;
    }

    const registration = {
        id: Date.now(),
        name: document.getElementById('regName').value,
        surname: document.getElementById('regSurname').value,
        email: document.getElementById('regEmail').value,
        phone: document.getElementById('regPhone').value,
        birth_date: document.getElementById('regBirthDate').value,
        category: document.getElementById('regCategory').value,
        experience: document.getElementById('regExperience').value,
        password: password,
        bio: document.getElementById('regBio').value,
        accept_notifications: document.getElementById('regAcceptNotifications').checked,
        status: 'pending',
        registered_at: new Date().toISOString()
    };

    const registrations = getStorageData('pilot_registrations');
    registrations.push(registration);
    setStorageData('pilot_registrations', registrations);

    showNotification('Registrazione inviata! Riceverai conferma entro 24-48 ore.', 'success');
    
    event.target.reset();
    const previewEl = document.getElementById('regPhotoPreview');
    if (previewEl) {
        previewEl.innerHTML = '';
    }
}

function submitSponsorRequest(event) {
    event.preventDefault();
    
    const request = {
        id: Date.now(),
        company: document.getElementById('sponsorCompany').value,
        email: document.getElementById('sponsorEmail').value,
        phone: document.getElementById('sponsorPhone').value,
        message: document.getElementById('sponsorMessage').value,
        submitted_at: new Date().toISOString()
    };
    
    const requests = getStorageData('sponsor_requests') || [];
    requests.push(request);
    setStorageData('sponsor_requests', requests);
    
    showNotification('Richiesta sponsor inviata! Ti contatteremo presto.', 'success');
    closeModal('sponsorModal');
    event.target.reset();
}

// Preview Image Function
function previewImage(input, previewId) {
    const preview = document.getElementById(previewId);
    if (!preview) return;
    
    preview.innerHTML = '';
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100px';
            img.style.maxHeight = '100px';
            img.style.borderRadius = '50%';
            img.style.objectFit = 'cover';
            preview.appendChild(img);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('🚀 Inizializzazione RC Team App...');
        
        initSampleData();
        
        // Carica pagina home di default
        showPage('home');
        
        // Precompila credenziali demo
        setTimeout(() => {
            try {
                const pilotEmail = document.getElementById('pilotEmail');
                const pilotPassword = document.getElementById('pilotPassword');
                if (pilotEmail) pilotEmail.value = 'marco.rossi@email.com';
                if (pilotPassword) pilotPassword.value = 'pilot123';
            } catch (error) {
                console.log('Credenziali demo non precompilate:', error.message);
            }
        }, 100);
        
        // Notifica sistema pronto
        setTimeout(() => {
            showNotification('🏁 Sistema RC Junior/Senior operativo e pronto!', 'success');
        }, 2000);
        
        console.log('✅ App inizializzata con successo');
        
    } catch (error) {
        console.error('Errore durante inizializzazione app:', error.message);
        setTimeout(() => {
            showNotification('Sistema RC Junior/Senior inizializzato', 'success');
        }, 1000);
    }
});

// Gestione errori globali
window.addEventListener('error', (event) => {
    console.error('Errore JavaScript intercettato:', event.error?.message || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rejection intercettata:', event.reason);
    event.preventDefault();
});

// Online/Offline Detection
window.addEventListener('online', () => {
    showNotification('Connessione ripristinata', 'success');
});

window.addEventListener('offline', () => {
    showNotification('Modalità offline attiva', 'warning');
});

// Export per debug
window.getStorageData = getStorageData;
window.setStorageData = setStorageData;
window.showPage = showPage;