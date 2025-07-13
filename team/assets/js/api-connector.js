// ===== API-CONNECTOR.JS - Connessione al Backend =====

const API_URL = 'https://l3drc.altervista.org/team/api.php';

// Classe per gestire le chiamate API
class ApiConnector {
    constructor() {
        this.baseUrl = API_URL;
    }

    // Metodo generico per chiamate API
    async request(action, data = {}, method = 'POST') {
        try {
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            if (method === 'GET') {
                const params = new URLSearchParams({ action, ...data });
                const response = await fetch(`${this.baseUrl}?${params}`, options);
                return await response.json();
            } else {
                options.body = JSON.stringify({ action, ...data });
                const response = await fetch(this.baseUrl, options);
                return await response.json();
            }
        } catch (error) {
            console.error('API Error:', error);
            return { error: error.message };
        }
    }

    // Metodi per Piloti
    async getPilots() {
        return this.request('get_pilots', {}, 'GET');
    }

    async createPilot(pilotData) {
        return this.request('create_pilot', pilotData);
    }

    async updatePilot(id, pilotData) {
        return this.request('update_pilot', { id, ...pilotData });
    }

    async deletePilot(id) {
        return this.request('delete_pilot', { id });
    }

    // Metodi per Sponsor
    async getSponsors() {
        return this.request('get_sponsors', {}, 'GET');
    }

    async createSponsor(sponsorData) {
        return this.request('create_sponsor', sponsorData);
    }

    // Metodi per Eventi
    async getEvents() {
        return this.request('get_events', {}, 'GET');
    }

    async createEvent(eventData) {
        return this.request('create_event', eventData);
    }

    // Autenticazione Admin
    async adminLogin(username, password) {
        return this.request('login', { username, password });
    }

    async adminLogout() {
        return this.request('logout');
    }

    // Autenticazione Piloti
    async pilotLogin(email, password) {
        return this.request('pilot_login', { email, password });
    }

    async pilotLogout() {
        return this.request('pilot_logout');
    }

    async getPilotProfile() {
        return this.request('pilot_profile');
    }

    async updatePilotProfile(profileData) {
        return this.request('update_pilot_profile', profileData);
    }

    // Registrazioni
    async registerPilot(registrationData) {
        return this.request('pilot_register', registrationData);
    }

    async getPendingRegistrations() {
        return this.request('get_pending_registrations');
    }

    async approveRegistration(registrationId) {
        return this.request('approve_registration', { registration_id: registrationId });
    }

    async rejectRegistration(registrationId, reason = '') {
        return this.request('reject_registration', { registration_id: registrationId, reason });
    }

    // Materiali
    async getMaterials() {
        return this.request('get_materials');
    }

    async createMaterial(materialData) {
        return this.request('create_material', materialData);
    }

    async assignMaterial(materialId, pilotId, quantity, notes = '') {
        return this.request('assign_material', {
            material_id: materialId,
            pilot_id: pilotId,
            quantity,
            notes
        });
    }

    async getAssignments() {
        return this.request('get_assignments');
    }

    // Statistiche
    async getStats() {
        return this.request('get_stats');
    }

    // Richiesta Sponsor
    async sponsorRequest(requestData) {
        return this.request('sponsor_request', {
            company_name: requestData.company,
            email: requestData.email,
            phone: requestData.phone,
            message: requestData.message
        });
    }

    // Upload Immagine
    async uploadImage(file, folder) {
        const formData = new FormData();
        formData.append('action', 'upload_image');
        formData.append('image', file);
        formData.append('folder', folder);

        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                body: formData
            });
            return await response.json();
        } catch (error) {
            console.error('Upload Error:', error);
            return { error: error.message };
        }
    }
}

// Istanza globale dell'API connector
const api = new ApiConnector();

// Override delle funzioni esistenti per usare l'API reale
async function loadPilots() {
    const result = await api.getPilots();
    const grid = document.getElementById('pilotsGrid');
    
    if (!grid) return;
    
    if (result.error) {
        grid.innerHTML = '<div class="card"><p>Errore nel caricamento piloti.</p></div>';
        console.error('Errore:', result.error);
        return;
    }

    const pilots = result.data || [];
    
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

async function loadSponsors() {
    const result = await api.getSponsors();
    const grid = document.getElementById('sponsorsGrid');
    
    if (!grid) return;
    
    if (result.error) {
        grid.innerHTML = '<div class="card"><p>Errore nel caricamento sponsor.</p></div>';
        console.error('Errore:', result.error);
        return;
    }

    const sponsors = result.data || [];
    
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

async function loadEvents() {
    console.log('📅 Caricamento eventi da API...');
    
    const result = await api.getEvents();
    const grid = document.getElementById('eventsGrid');
    
    if (!grid) {
        console.error('❌ eventsGrid non trovato');
        return;
    }
    
    if (result.error) {
        grid.innerHTML = '<div class="card"><p>Errore nel caricamento eventi.</p></div>';
        console.error('Errore:', result.error);
        return;
    }

    const events = result.data || [];
    
    if (events.length === 0) {
        grid.innerHTML = '<div class="card"><p>Nessun evento trovato.</p></div>';
        return;
    }

    const eventsHTML = events.map(event => `
        <div class="card" style="display: block !important; visibility: visible !important; opacity: 1 !important;">
            <h3>🏁 ${event.name}</h3>
            <p><strong>📅 Data:</strong> ${formatDate(event.event_date)}</p>
            <p><strong>📍 Pista:</strong> ${event.track_name || 'Da definire'}</p>
            <p><strong>🗺️ Indirizzo:</strong> ${event.track_address || 'Da definire'}</p>
            ${event.track_city ? `<p><strong>🏙️ Città:</strong> ${event.track_city}</p>` : ''}
            <p>${event.description || 'Evento del team RC Junior/Senior'}</p>
            <button class="btn" onclick="openMap('${event.track_address || 'Milano'}')">📍 Visualizza Mappa</button>
        </div>
    `).join('');
    
    grid.innerHTML = eventsHTML;
    
    grid.style.display = 'grid';
    grid.style.visibility = 'visible';
    grid.style.opacity = '1';
    
    setTimeout(() => {
        grid.querySelectorAll('.card').forEach(card => {
            card.style.display = 'block';
            card.style.visibility = 'visible';
            card.style.opacity = '1';
        });
    }, 50);
    
    console.log(`✅ Caricati ${events.length} eventi da API`);
}

// Export per utilizzo globale
window.api = api;
window.loadPilots = loadPilots;
window.loadSponsors = loadSponsors;
window.loadEvents = loadEvents;