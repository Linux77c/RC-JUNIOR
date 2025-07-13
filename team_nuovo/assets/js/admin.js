// ===== ADMIN.JS - Funzioni Amministrative =====

// Admin State
let isAdminLoggedIn = false;
let currentPilot = null;

// Admin Login
function adminLogin(event) {
    event.preventDefault();
    const username = document.getElementById('adminUser').value;
    const password = document.getElementById('adminPass').value;
    
    if (username === 'admin' && password === 'rcteam2025') {
        isAdminLoggedIn = true;
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        updateAdminStats();
        showNotification('Login admin effettuato con successo!', 'success');
    } else {
        showNotification('Credenziali admin non valide!', 'error');
    }
}

function adminLogout() {
    isAdminLoggedIn = false;
    document.getElementById('adminLogin').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('adminUser').value = '';
    document.getElementById('adminPass').value = '';
    showNotification('Logout admin effettuato', 'success');
}

function updateAdminStats() {
    if (!isAdminLoggedIn) return;
    
    const pilots = getStorageData('pilots');
    const sponsors = getStorageData('sponsors');
    const events = getStorageData('events');
    const materials = getStorageData('materials');
    const registrations = getStorageData('pilot_registrations');
    
    const totalMaterials = materials.reduce((sum, m) => sum + (parseInt(m.quantity) || 0), 0);
    
    const pilotsCountEl = document.getElementById('pilotsCount');
    const sponsorsCountEl = document.getElementById('sponsorsCount');
    const eventsCountEl = document.getElementById('eventsCount');
    const materialsCountEl = document.getElementById('materialsCount');
    
    if (pilotsCountEl) pilotsCountEl.textContent = pilots.length;
    if (sponsorsCountEl) sponsorsCountEl.textContent = sponsors.length;
    if (eventsCountEl) eventsCountEl.textContent = events.length;
    if (materialsCountEl) materialsCountEl.textContent = totalMaterials;
    
    const pendingRegistrations = registrations.filter(r => r.status === 'pending');
    const pendingCountEl = document.getElementById('pendingCount');
    if (pendingCountEl) {
        if (pendingRegistrations.length > 0) {
            pendingCountEl.textContent = `${pendingRegistrations.length} richieste in attesa`;
            pendingCountEl.style.color = 'var(--danger)';
        } else {
            pendingCountEl.textContent = 'Nessuna richiesta in attesa';
            pendingCountEl.style.color = 'var(--success)';
        }
    }
}

// CORREZIONE: Pilot Management
function showPilotForm() {
    const form = document.getElementById('pilotForm');
    if (form) form.style.display = 'block';
}

function hidePilotForm() {
    const form = document.getElementById('pilotForm');
    if (form) form.style.display = 'none';
    clearPilotForm();
}

function clearPilotForm() {
    const fields = ['pilotName', 'pilotSurname', 'pilotCategory', 'pilotBio', 'pilotPhoto'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    
    const preview = document.getElementById('pilotPreview');
    if (preview) preview.innerHTML = '';
}

function savePilot(event) {
    event.preventDefault();
    
    const pilot = {
        id: Date.now(),
        name: document.getElementById('pilotName').value,
        surname: document.getElementById('pilotSurname').value,
        category: document.getElementById('pilotCategory').value,
        bio: document.getElementById('pilotBio').value,
        email: '',
        password: 'temp123',
        created_at: new Date().toISOString()
    };
    
    const pilots = getStorageData('pilots');
    pilots.push(pilot);
    setStorageData('pilots', pilots);
    
    showNotification('Pilota aggiunto con successo!', 'success');
    clearPilotForm();
    hidePilotForm();
    loadPilotList();
    updateAdminStats();
}

function loadPilotList() {
    const pilots = getStorageData('pilots');
    const list = document.getElementById('pilotList');
    if (!list) return;
    
    list.innerHTML = pilots.map(pilot => `
        <div class="card" style="margin-bottom: 1rem;">
            <h4>${pilot.name} ${pilot.surname} <span style="color: var(--accent);">(${pilot.category})</span></h4>
            <p>${pilot.bio || 'Pilota del team RC Junior/Senior'}</p>
            <button class="btn danger" onclick="deletePilot(${pilot.id})">Elimina</button>
        </div>
    `).join('');
}

function deletePilot(id) {
    if (confirm('Sei sicuro di voler eliminare questo pilota?')) {
        const pilots = getStorageData('pilots').filter(p => p.id !== id);
        setStorageData('pilots', pilots);
        loadPilotList();
        updateAdminStats();
        showNotification('Pilota eliminato', 'success');
    }
}

// CORREZIONE: Sponsor Management - Fix completo
function loadSponsorManagement() {
    console.log('📊 Caricamento gestione sponsor...');
    
    const list = document.getElementById('sponsorManageList');
    if (!list) {
        console.error('❌ sponsorManageList non trovato');
        
        // Crea contenuto dinamico se non esiste
        const modalContent = document.querySelector('#sponsorManageModal .modal-content');
        if (modalContent && !document.getElementById('sponsorManageList')) {
            const listContainer = document.createElement('div');
            listContainer.id = 'sponsorManageList';
            modalContent.appendChild(listContainer);
        }
        
        setTimeout(() => loadSponsorManagement(), 100);
        return;
    }
    
    const sponsors = getStorageData('sponsors');
    console.log(`📦 Sponsor trovati: ${sponsors.length}`);
    
    if (sponsors.length === 0) {
        list.innerHTML = `
            <div class="card">
                <h4>📋 Nessun Sponsor</h4>
                <p>Non ci sono sponsor registrati nel sistema.</p>
                <button class="btn" onclick="showSponsorForm()">+ Aggiungi Primo Sponsor</button>
            </div>
        `;
        return;
    }
    
    let html = `
        <div style="margin-bottom: 1rem;">
            <button class="btn" onclick="showSponsorForm()">+ Aggiungi Sponsor</button>
        </div>
        
        <div class="card" style="background: var(--gradient-dark); margin-bottom: 1rem;">
            <h4 style="color: var(--accent);">🤝 Gestione Partner e Sponsor</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin: 1rem 0;">
                <div style="text-align: center;">
                    <div style="font-size: 2rem; color: var(--primary);">${sponsors.length}</div>
                    <div style="color: var(--text-light);">Partner Attivi</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 2rem; color: var(--accent);">${sponsors.filter(s => s.sponsorship_level === 'Platinum').length}</div>
                    <div style="color: var(--text-light);">Platinum</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 2rem; color: var(--warning);">${sponsors.filter(s => s.sponsorship_level === 'Gold').length}</div>
                    <div style="color: var(--text-light);">Gold</div>
                </div>
            </div>
        </div>
    `;
    
    sponsors.forEach(sponsor => {
        const levelColor = {
            'Platinum': 'var(--accent)',
            'Gold': 'var(--warning)', 
            'Silver': 'var(--text-light)',
            'Bronze': '#CD7F32'
        };
        
        html += `
            <div class="card" style="margin-bottom: 1rem; position: relative; overflow: hidden;">
                <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: ${levelColor[sponsor.sponsorship_level] || 'var(--primary)'};"></div>
                
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 250px;">
                        <h4 style="color: var(--accent); margin: 0 0 0.5rem 0; display: flex; align-items: center;">
                            <span style="margin-right: 0.5rem;">🏢</span>
                            ${sponsor.name}
                            <span style="margin-left: 1rem; padding: 0.2rem 0.8rem; background: ${levelColor[sponsor.sponsorship_level] || 'var(--primary)'}; color: white; border-radius: 15px; font-size: 0.7rem;">${sponsor.sponsorship_level || 'Bronze'}</span>
                        </h4>
                        
                        <div style="margin-bottom: 1rem;">
                            <strong>Descrizione:</strong> ${sponsor.description || 'Partner del team RC Junior/Senior'}<br>
                            ${sponsor.website ? `<strong>Website:</strong> <a href="${sponsor.website}" target="_blank" style="color: var(--primary);">${sponsor.website}</a><br>` : ''}
                            ${sponsor.email ? `<strong>Email:</strong> ${sponsor.email}<br>` : ''}
                            ${sponsor.phone ? `<strong>Telefono:</strong> ${sponsor.phone}<br>` : ''}
                        </div>
                        
                        <div style="font-size: 0.9rem; color: var(--text-light);">
                            <span>📅 Partner dal: ${formatDate(sponsor.contract_start || new Date())}</span>
                        </div>
                    </div>
                    
                    <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-left: 1rem; min-width: 140px;">
                        <button class="btn secondary" style="font-size: 0.8rem; padding: 0.5rem 1rem;" onclick="editSponsor(${sponsor.id})">
                            ✏️ Modifica
                        </button>
                        <button class="btn" style="font-size: 0.8rem; padding: 0.5rem 1rem;" onclick="viewSponsorMaterials(${sponsor.id})">
                            📦 Materiali
                        </button>
                        <button class="btn danger" style="font-size: 0.8rem; padding: 0.5rem 1rem;" onclick="deleteSponsor(${sponsor.id})">
                            🗑️ Elimina
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    list.innerHTML = html;
    console.log('✅ Gestione sponsor caricata con successo');
}

function showSponsorForm() {
    let form = document.getElementById('sponsorManageForm');
    
    if (!form) {
        // Crea form dinamicamente
        const container = document.getElementById('sponsorManageList').parentElement;
        form = document.createElement('div');
        form.id = 'sponsorManageForm';
        form.style.display = 'none';
        form.style.marginTop = '1rem';
        
        form.innerHTML = `
            <h4>Nuovo Sponsor</h4>
            <form onsubmit="saveSponsorFromForm(event)">
                <div class="form-group">
                    <label>Nome Azienda</label>
                    <input type="text" class="form-control" id="sponsorManageName" required>
                </div>
                <div class="form-group">
                    <label>Descrizione</label>
                    <textarea class="form-control" id="sponsorManageDescription" rows="2"></textarea>
                </div>
                <div class="form-group">
                    <label>Website</label>
                    <input type="url" class="form-control" id="sponsorManageWebsite" placeholder="https://...">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" class="form-control" id="sponsorManageEmail">
                </div>
                <div class="form-group">
                    <label>Telefono</label>
                    <input type="tel" class="form-control" id="sponsorManagePhone">
                </div>
                <div class="form-group">
                    <label>Livello Partnership</label>
                    <select class="form-control" id="sponsorManageLevel">
                        <option value="Bronze">Bronze</option>
                        <option value="Silver">Silver</option>
                        <option value="Gold">Gold</option>
                        <option value="Platinum">Platinum</option>
                    </select>
                </div>
                <button type="submit" class="btn">💾 Salva Sponsor</button>
                <button type="button" class="btn danger" onclick="hideSponsorForm()">❌ Annulla</button>
            </form>
        `;
        
        container.appendChild(form);
    }
    
    form.style.display = 'block';
}

function hideSponsorForm() {
    const form = document.getElementById('sponsorManageForm');
    if (form) {
        form.style.display = 'none';
        clearSponsorForm();
    }
}

function clearSponsorForm() {
    const fields = ['sponsorManageName', 'sponsorManageDescription', 'sponsorManageWebsite', 'sponsorManageEmail', 'sponsorManagePhone', 'sponsorManageLevel'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
}

function saveSponsorFromForm(event) {
    event.preventDefault();
    
    const sponsor = {
        id: Date.now(),
        name: document.getElementById('sponsorManageName').value,
        description: document.getElementById('sponsorManageDescription').value,
        website: document.getElementById('sponsorManageWebsite').value,
        email: document.getElementById('sponsorManageEmail').value,
        phone: document.getElementById('sponsorManagePhone').value,
        sponsorship_level: document.getElementById('sponsorManageLevel').value,
        contract_start: new Date().toISOString().split('T')[0],
        status: 'active',
        created_at: new Date().toISOString()
    };
    
    const sponsors = getStorageData('sponsors');
    sponsors.push(sponsor);
    setStorageData('sponsors', sponsors);
    
    showNotification('Sponsor aggiunto con successo!', 'success');
    hideSponsorForm();
    loadSponsorManagement();
    updateAdminStats();
    
    // Aggiorna anche la vista pubblica
    loadSponsors();
}

function editSponsor(id) {
    showNotification('Funzione modifica sponsor in sviluppo', 'info');
}

function viewSponsorMaterials(id) {
    const sponsor = getStorageData('sponsors').find(s => s.id === id);
    const materials = getStorageData('materials').filter(m => m.sponsor === sponsor.name);
    
    showNotification(`${sponsor.name} ha fornito ${materials.length} tipologie di materiali`, 'info');
}

function deleteSponsor(id) {
    if (confirm('Sei sicuro di voler eliminare questo sponsor?')) {
        const sponsors = getStorageData('sponsors').filter(s => s.id !== id);
        setStorageData('sponsors', sponsors);
        loadSponsorManagement();
        updateAdminStats();
        loadSponsors(); // Aggiorna vista pubblica
        showNotification('Sponsor eliminato', 'success');
    }
}

// Registration Management
function loadRegistrationsList() {
    const registrations = getStorageData('pilot_registrations');
    const list = document.getElementById('registrationsList');
    if (!list) return;
    
    const pendingRegistrations = registrations.filter(r => r.status === 'pending');
    
    if (pendingRegistrations.length === 0) {
        list.innerHTML = '<div class="card"><p>Nessuna registrazione in attesa di approvazione.</p></div>';
        return;
    }
    
    list.innerHTML = pendingRegistrations.map(reg => `
        <div class="card" style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 250px;">
                    <h4>${reg.name} ${reg.surname}</h4>
                    <p><strong>Email:</strong> ${reg.email}</p>
                    <p><strong>Categoria:</strong> ${reg.category}</p>
                    <p><strong>Esperienza:</strong> ${reg.experience || 'Non specificata'}</p>
                    <p><strong>Telefono:</strong> ${reg.phone || 'Non fornito'}</p>
                    <p><strong>Data nascita:</strong> ${formatDate(reg.birth_date)}</p>
                    <p><strong>Registrato il:</strong> ${formatDate(reg.registered_at)}</p>
                    ${reg.bio ? `<p><strong>Bio:</strong> ${reg.bio}</p>` : ''}
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-left: 1rem; min-width: 120px;">
                    <button class="btn success" onclick="approveRegistration(${reg.id})">✅ Approva</button>
                    <button class="btn danger" onclick="rejectRegistration(${reg.id})">❌ Rifiuta</button>
                </div>
            </div>
        </div>
    `).join('');
}

function approveRegistration(regId) {
    if (!confirm('Sei sicuro di voler approvare questa registrazione?')) return;
    
    const registrations = getStorageData('pilot_registrations');
    const registration = registrations.find(r => r.id === regId);
    
    if (!registration) return;
    
    const newPilot = {
        id: Date.now(),
        name: registration.name,
        surname: registration.surname,
        email: registration.email,
        phone: registration.phone,
        birth_date: registration.birth_date,
        category: registration.category,
        bio: registration.bio,
        password: registration.password,
        experience: registration.experience,
        status: 'active',
        created_at: new Date().toISOString(),
        approved_by: 'admin',
        approved_at: new Date().toISOString()
    };
    
    const pilots = getStorageData('pilots');
    pilots.push(newPilot);
    setStorageData('pilots', pilots);
    
    registration.status = 'approved';
    registration.approved_at = new Date().toISOString();
    setStorageData('pilot_registrations', registrations);
    
    showNotification(`Registrazione di ${registration.name} ${registration.surname} approvata!`, 'success');
    loadRegistrationsList();
    updateAdminStats();
    loadPilots(); // Aggiorna vista pubblica
}

function rejectRegistration(regId) {
    const reason = prompt('Motivo del rifiuto (opzionale):');
    if (reason === null) return;
    
    const registrations = getStorageData('pilot_registrations');
    const registration = registrations.find(r => r.id === regId);
    
    if (!registration) return;
    
    registration.status = 'rejected';
    registration.rejected_at = new Date().toISOString();
    registration.rejection_reason = reason;
    
    setStorageData('pilot_registrations', registrations);
    
    showNotification(`Registrazione di ${registration.name} ${registration.surname} rifiutata`, 'success');
    loadRegistrationsList();
    updateAdminStats();
}

// Event Management
function showEventForm() {
    const form = document.getElementById('eventForm');
    if (form) form.style.display = 'block';
}

function hideEventForm() {
    const form = document.getElementById('eventForm');
    if (form) form.style.display = 'none';
    clearEventForm();
}

function clearEventForm() {
    const fields = ['eventName', 'eventDate', 'trackName', 'trackAddress', 'eventDescription'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    
    const checkbox = document.getElementById('sendNotification');
    if (checkbox) checkbox.checked = false;
}

function saveEvent(event) {
    event.preventDefault();
    
    const newEvent = {
        id: Date.now(),
        name: document.getElementById('eventName').value,
        date: document.getElementById('eventDate').value,
        trackName: document.getElementById('trackName').value,
        trackAddress: document.getElementById('trackAddress').value,
        description: document.getElementById('eventDescription').value,
        created_at: new Date().toISOString()
    };
    
    const events = getStorageData('events');
    events.push(newEvent);
    setStorageData('events', events);
    
    showNotification('Evento creato con successo!', 'success');
    
    const sendNotif = document.getElementById('sendNotification');
    if (sendNotif && sendNotif.checked) {
        const message = `🏁 Nuovo evento: ${newEvent.name} il ${formatDate(newEvent.date)} presso ${newEvent.trackName}`;
        sendNotificationToPilots(message);
    }
    
    clearEventForm();
    hideEventForm();
    loadEventList();
    updateAdminStats();
    loadEvents(); // Aggiorna vista pubblica
}

function loadEventList() {
    const events = getStorageData('events');
    const list = document.getElementById('eventList');
    if (!list) return;
    
    list.innerHTML = events.map(event => `
        <div class="card" style="margin-bottom: 1rem;">
            <h4>${event.name}</h4>
            <p><strong>Data:</strong> ${formatDate(event.date)}</p>
            <p><strong>Pista:</strong> ${event.trackName}</p>
            <p><strong>Indirizzo:</strong> ${event.trackAddress}</p>
            <p>${event.description}</p>
            <button class="btn danger" onclick="deleteEvent(${event.id})">Elimina</button>
        </div>
    `).join('');
}

function deleteEvent(id) {
    if (confirm('Sei sicuro di voler eliminare questo evento?')) {
        const events = getStorageData('events').filter(e => e.id !== id);
        setStorageData('events', events);
        loadEventList();
        updateAdminStats();
        loadEvents(); // Aggiorna vista pubblica
        showNotification('Evento eliminato', 'success');
    }
}

// Notifications
function sendNotificationToPilots(message) {
    try {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('RC Junior/Senior', {
                body: message,
                icon: 'img/icons/icon-192.png',
                badge: 'img/icons/icon-192.png'
            });
        }
    } catch (error) {
        console.log('Notifiche push non disponibili:', error.message);
    }
    showNotification(`📢 Notifica inviata: ${message}`, 'success');
}

// CORREZIONE: Override dell'apertura modal per sponsor management
const originalOpenModal = window.openModal || openModal;
window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        
        // Carica contenuto specifico
        switch(modalId) {
            case 'pilotModal':
                loadPilotList();
                break;
            case 'eventModal':
                loadEventList();
                break;
            case 'registrationsModal':
                loadRegistrationsList();
                break;
            case 'sponsorManageModal':
                setTimeout(() => {
                    loadSponsorManagement();
                }, 100);
                break;
            case 'materialModal':
                setTimeout(() => {
                    if (typeof loadMaterialList === 'function') {
                        loadMaterialList();
                    }
                }, 100);
                break;
            case 'assignmentModal':
                if (typeof loadAssignmentList === 'function') {
                    loadAssignmentList();
                }
                break;
        }
    }
};