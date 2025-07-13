# 🏁 RC JUNIOR/SENIOR - WebApp PWA

## 📋 Panoramica
WebApp Progressive (PWA) completa per la gestione del team RC Buggy 1/8 Junior/Senior, con:
- ✅ **Area pubblica**: Presentazione team, piloti, sponsor, eventi
- ✅ **Registrazione autonoma**: I piloti possono registrarsi da soli
- ✅ **Area piloti personale**: Dashboard e profilo individuale
- ✅ **Area admin avanzata**: Gestione completa con approvazioni
- ✅ **PWA installabile**: Notifiche push native
- ✅ **Sistema completo**: Dalla registrazione alla gestione professionale

---

## 📸 Gestione Immagini

### **📁 Struttura Cartelle Obbligatorie**
Prima del primo avvio, crea questa struttura nella cartella `/team/`:

```
/team/img/
├── logo/          (Loghi del team)
├── icons/         (Icone PWA e favicon)
├── pilots/        (Foto profilo piloti)
├── sponsors/      (Loghi sponsor)
├── events/        (Foto eventi e gare)
└── materials/     (Foto materiali promozionali)
```

### **🎯 Specifiche per Categoria**

#### **📂 `/img/logo/` - Loghi Team**
**File richiesti:**
- `logo-main.png` - Logo principale (**500x500px**, PNG trasparente)
- `logo-white.png` - Logo su sfondo scuro (**500x500px**, PNG trasparente)
- `logo-sponsors.png` - Logo per materiali sponsor (**300x300px**, PNG)

**Formato:** PNG con trasparenza  
**Colori:** Rosso Racing (#FF2E00) e Oro (#FFD700)

#### **📂 `/img/icons/` - Icone PWA**
**File richiesti:**
- `favicon.ico` - Favicon browser (**32x32px**, ICO)
- `icon-192.png` - Icona PWA standard (**192x192px**, PNG)
- `icon-512.png` - Icona PWA grande (**512x512px**, PNG)
- `apple-touch-icon.png` - Icona iOS (**180x180px**, PNG)
- `badge-72.png` - Badge notifiche (**72x72px**, PNG)

**Shortcuts (opzionali):**
- `shortcut-pilots.png` - Scorciatoia piloti (**96x96px**, PNG)
- `shortcut-events.png` - Scorciatoia eventi (**96x96px**, PNG)
- `shortcut-admin.png` - Scorciatoia admin (**96x96px**, PNG)

#### **📂 `/img/pilots/` - Foto Piloti**
**File richiesti:**
- `default-pilot.jpg` - Avatar default (**300x300px**, JPG)

**File individuali (esempi):**
- `marco-rossi.jpg` - Foto Marco Rossi
- `luca-bianchi.jpg` - Foto Luca Bianchi
- `andrea-verdi.jpg` - Foto Andrea Verdi

**Specifiche:**
- **Formato:** JPG (per dimensioni minori)
- **Dimensioni:** 300x300px (quadrate)
- **Qualità:** 85% JPEG
- **Peso max:** 200KB per foto

#### **📂 `/img/sponsors/` - Loghi Sponsor**
**File richiesti:**
- `default-sponsor.png` - Logo placeholder (**400x300px**, PNG)
- `evolution-logo.png` - Logo Evolution Modellismo

**Specifiche:**
- **Formato:** PNG con trasparenza
- **Dimensioni:** 400x300px (rettangolari)
- **Sfondo:** Trasparente
- **Peso max:** 150KB per logo

#### **📂 `/img/events/` - Foto Eventi**
**File suggeriti:**
- `event-placeholder.jpg` - Placeholder eventi (**800x600px**, JPG)
- `gara-milano-2025.jpg` - Foto gara Milano
- `allenamento-monza.jpg` - Foto allenamento

**Sottocartella `/gallery/`:**
- Foto multiple per ogni evento
- Formato: `evento-YYYY-MM-DD-001.jpg`

**Specifiche:**
- **Formato:** JPG
- **Dimensioni:** 800x600px (4:3)
- **Qualità:** 80% JPEG
- **Peso max:** 500KB per foto

#### **📂 `/img/materials/` - Foto Materiali**
**File suggeriti:**
- `tshirt-sample.jpg` - Esempio maglietta team (**600x600px**, JPG)
- `cap-sample.jpg` - Esempio cappellino (**600x600px**, JPG)
- `stickers-sample.jpg` - Esempio adesivi (**600x600px**, JPG)
- `keychain-sample.jpg` - Esempio portachiavi (**600x600px**, JPG)
- `bottle-sample.jpg` - Esempio borraccia (**600x600px**, JPG)

**Specifiche:**
- **Formato:** JPG
- **Dimensioni:** 600x600px (quadrate)
- **Qualità:** 85% JPEG
- **Peso max:** 300KB per foto

### **🎨 Linee Guida Design Racing**

#### **Colori Brand Motorsport:**
- **Primary:** #FF2E00 (Rosso Racing)
- **Secondary:** #1B1F23 (Nero Carbonio)
- **Accent:** #FFD700 (Oro Campione)
- **Success:** #00D4AA (Verde Vittoria)

#### **Stile Fotografico:**
- **Illuminazione:** Naturale o studio, evitare flash diretto
- **Sfondo:** Neutro o ambiente pista racing
- **Composizione:** Centrata, inquadratura professionale
- **Colori:** Vivaci ma naturali, coerenti con brand

#### **Logo Guidelines:**
- Mantenere proporzioni originali
- Non deformare, ruotare o modificare
- Spazio bianco attorno (padding minimo 10%)
- Su sfondo scuro usare versione white

### **🛠️ Strumenti Consigliati**

#### **Editing Foto:**
- **Gratuiti:** GIMP, Paint.NET, Canva
- **Professionali:** Photoshop, Lightroom
- **Online:** Photopea, Pixlr, Remove.bg

#### **Ottimizzazione:**
- **TinyPNG** - Compressione PNG/JPG
- **Squoosh** - Tool Google per ottimizzazione
- **ImageOptim** - Tool per Mac

#### **Creazione Icone:**
- **Favicon.io** - Generatore favicon
- **RealFaviconGenerator** - PWA icons completi
- **IconKitchen** - Android adaptive icons

### **📱 Checklist PWA Icons**
- [ ] `favicon.ico` (32x32) funziona nel browser
- [ ] `icon-192.png` appare nel menu installazione
- [ ] `icon-512.png` usata per splash screen
- [ ] `apple-touch-icon.png` funziona su iOS
- [ ] Tutti i file sono ottimizzati < 100KB

### **🔄 Upload e Manutenzione**

#### **Via FTP/File Manager:**
1. Connetti al server Altervista
2. Naviga in `/team/img/[cartella]/`
3. Upload file rispettando nomi e dimensioni
4. Verifica permessi file (644)

#### **Via Admin Panel:**
1. Login area admin
2. Gestione piloti → Aggiungi foto
3. Upload automatico e ridimensionamento
4. Anteprima immediata

#### **Backup e Sicurezza:**
- Mantieni sempre backup locale delle immagini
- Usa nomi file descrittivi senza spazi
- Versioning per aggiornamenti logo (`logo-v2.png`)
- Controlla regolarmente integrità file

---

## 🚀 Installazione Rapida

### 1. **Upload File**
Carica tutti i file nella cartella `/team/` del tuo hosting:
```
https://l3drc.altervista.org/team/
├── index.html          (WebApp principale)
├── manifest.json       (Configurazione PWA)
├── sw.js              (Service Worker)
├── api.php            (Backend API)
├── install.sql        (Schema database)
└── img/               (Cartella immagini)
    ├── logo/          (Loghi team)
    ├── icons/         (Icone PWA)
    ├── pilots/        (Foto piloti)
    ├── sponsors/      (Loghi sponsor)
    ├── events/        (Foto eventi)
    └── materials/     (Foto materiali)
```

### 2. **Configurazione Database**
- Accedi al **pannello MySQL** di Altervista
- Seleziona il database `my_l3drc`
- Importa il file `install.sql`
- Verifica che tutte le tabelle siano state create

### 3. **Test Installazione**
- Vai su `https://l3drc.altervista.org/team/`
- Verifica che la webapp si carichi correttamente
- Testa l'installazione PWA (pulsante 📱 in basso a destra)

---

## 🔐 Sistema di Accesso

### **👑 ADMIN**
- **Username**: `admin`
- **Password**: `rcteam2025`
- **Funzioni**: Gestione completa, approvazione registrazioni

### **👤 PILOTI DEMO**
- **Email**: `marco.rossi@email.com`
- **Password**: `pilot123`
- **Funzioni**: Dashboard personale, profilo, statistiche

> ⚠️ **IMPORTANTE**: Cambia tutte le password dopo il primo accesso!

---

## 🌟 Nuove Funzionalità

### **📝 REGISTRAZIONE AUTONOMA**
- **Modulo completo**: Nome, email, categoria, esperienza
- **Upload foto**: Durante la registrazione
- **Calcolo automatico**: Categoria Junior/Senior in base all'età
- **Validazioni**: Email univoca, password sicura
- **Stato pending**: In attesa di approvazione admin

### **🔐 AREA PILOTI PERSONALE**
- **Login individuale**: Email e password personali
- **Dashboard personalizzata**: Statistiche individuali
- **Profilo modificabile**: Dati, foto, bio, password
- **Storia eventi**: Partecipazioni e risultati
- **Materiali ricevuti**: Inventario personale
- **Impostazioni notifiche**: Preferenze personalizzabili

### **⚙️ AREA ADMIN AVANZATA**
- **Gestione registrazioni**: Approva/rifiuta nuovi piloti
- **Notifiche in tempo reale**: Richieste in attesa
- **Report avanzati**: Statistiche complete e export
- **Sistema completo**: Dalla registrazione alla gestione

---

## 📱 Caratteristiche PWA

### **Installazione Mobile**
1. Apri la webapp su smartphone
2. Clicca il pulsante **📱 Installa** (in basso a destra)
3. Conferma l'installazione
4. L'app apparirà nella home screen

### **Notifiche Push**
- **Automatiche**: Per nuovi eventi del team
- **Personalizzate**: In base alle preferenze pilota
- **Admin**: Per nuove registrazioni
- **Manuali**: Inviate dall'admin quando necessario

---

## 📊 Flusso Operativo Completo

### **🆕 NUOVO PILOTA**
1. **Registrazione**: Compila modulo pubblico
2. **Attesa**: Status "pending" in dashboard admin
3. **Approvazione**: Admin approva/rifiuta
4. **Attivazione**: Account pilota creato automaticamente
5. **Login**: Accesso area personale

### **👤 PILOTA ATTIVO**
1. **Login**: Area piloti con email/password
2. **Dashboard**: Statistiche personali
3. **Profilo**: Modifica dati e foto
4. **Eventi**: Storia partecipazioni
5. **Materiali**: Inventario ricevuto

### **👑 AMMINISTRAZIONE**
1. **Monitoraggio**: Registrazioni in attesa
2. **Valutazione**: Dati e motivazioni
3. **Decisione**: Approva/rifiuta con motivo
4. **Gestione**: Piloti attivi completa
5. **Report**: Statistiche e analytics

---

## 🗄️ Struttura Database Estesa

### **Tabelle Principali**
- `pilots` - Piloti attivi (con login)
- `pilot_registrations` - Registrazioni in attesa
- `pilot_preferences` - Impostazioni personali
- `pilot_sessions` - Sessioni di login
- `sponsors` - Gestione sponsor e partnership  
- `events` - Eventi e gare del team
- `tracks` - Database piste (auto-popolato)
- `materials` - Inventario materiali ricevuti
- `material_assignments` - Assegnazioni ai piloti
- `notifications` - Sistema notifiche push
- `admins` - Utenti amministratori

### **Dati Precaricati**
- **5 piloti attivi** con login funzionante
- **2 registrazioni** in attesa di approvazione
- **2 sponsor** (Evolution Modellismo + RC Parts Store)
- **3 eventi** (gare e allenamenti)
- **5 tipologie materiali** con assegnazioni

---

## ⚙️ Configurazione Avanzata

### **Personalizzazione Email**
Nel file `api.php` modifica:
```php
// Email per notifiche admin
$adminEmail = 'tuaemail@dominio.com';

// Template email approvazione
$approvalEmailTemplate = 'Il tuo account è stato approvato!';
```

### **Impostazioni Registrazione**
Personalizza validazioni in `index.html`:
```javascript
// Età minima/massima
const MIN_AGE = 8;
const MAX_AGE = 80;

// Campi obbligatori
const REQUIRED_FIELDS = ['name', 'surname', 'email', 'birth_date'];
```

### **Notifiche Push Avanzate**
Per notifiche push reali:
1. Registra il sito su **Firebase Cloud Messaging**
2. Configura le chiavi **VAPID**
3. Aggiorna Service Worker con credenziali

---

## 🔧 Gestione Piloti

### **Approvazione Registrazioni**
1. **Admin Dashboard** → Gestisci Registrazioni
2. **Visualizza dati** completi del richiedente
3. **Approva**: Crea automaticamente account pilota
4. **Rifiuta**: Specifica motivo (opzionale)
5. **Notifica**: Email automatica al richiedente

### **Gestione Account Piloti**
- **Reset Password**: Funzione admin per emergenze
- **Disattivazione**: Soft delete mantenendo storico
- **Modifica Dati**: Admin può modificare profili
- **Export Dati**: GDPR compliance

---

## 📊 Analytics e Report

### **Statistiche Disponibili**
- **Registrazioni**: Trend mensili e tasso approvazione
- **Engagement Piloti**: Login frequency e attività
- **Eventi**: Partecipazione per categoria
- **Materiali**: Distribuzione e costi
- **Notifiche**: Delivery rate e open rate

### **Report Automatici**
- **Dashboard Real-time**: Overview generale
- **Report Mensili**: Andamento team
- **Export CSV**: Dati per analisi esterne
- **Backup Automatico**: Sicurezza dati

---

## 🛡️ Sicurezza e Privacy

### **Autenticazione**
- **Password Hash**: Bcrypt sicuro
- **Session Management**: Token con scadenza
- **Validazione Input**: Protezione SQL injection
- **Rate Limiting**: Protezione brute force

### **Privacy Piloti**
- **Dati Personali**: Visibilità controllata
- **Foto**: Upload sicuro con validazione
- **Email**: Non visibile pubblicamente
- **Telefono**: Solo admin autorizzati

---

## 🆘 Troubleshooting Avanzato

### **Problemi Registrazione**

**❌ "Email già registrata"**
- Verifica in tabella `pilots` e `pilot_registrations`
- Controlla registrazioni rifiutate precedenti
- Admin può liberare email se necessario

**❌ "Upload foto fallisce"**
- Verifica permessi cartella `img/pilots/` (755)
- Controlla dimensioni file < 5MB
- Formato supportato: JPG, PNG, GIF

### **Problemi Area Piloti**

**❌ "Login pilota fallisce"**
- Verifica status pilota = 'active'
- Controlla password con hash corretto
- Verifica email esatta (case sensitive)

**❌ "Dashboard non carica statistiche"**
- Controlla tabelle `event_results` e `material_assignments`
- Verifica relazioni foreign key
- Popola dati di esempio se vuote

---

## 🔮 Roadmap Futura

### **Versione 1.1** (Prevista)
- 📸 **Gallery eventi** con upload multiplo
- 🏆 **Sistema classifiche** e punteggi
- 📧 **Newsletter automatica** per sponsor
- 🔗 **Integrazione social** (Facebook, Instagram)

### **Versione 1.2** (In valutazione)
- 📱 **App mobile nativa** (React Native)
- 🎮 **Gamification** con badge e achievement
- 📊 **Analytics avanzate** con grafici
- 🌍 **Multilingua** (EN, FR, DE)

---

## 📞 Supporto Tecnico

### **Contatti**
- **Email**: l3drc@altervista.org
- **Website**: https://l3drc.altervista.org/

### **Documentazione**
- **PWA**: [Google PWA Guide](https://web.dev/progressive-web-apps/)
- **Database**: [MySQL Documentation](https://dev.mysql.com/doc/)
- **PHP**: [PHP Manual](https://www.php.net/manual/)

---

## 📄 Changelog

### **Versione 1.0.0** - Sistema Completo
- ✅ **Registrazione autonoma piloti**
- ✅ **Area piloti personale con login**
- ✅ **Gestione approvazioni admin**
- ✅ **Upload immagini ottimizzato**
- ✅ **PWA con notifiche push**
- ✅ **Database completo e relazionale**
- ✅ **Sistema sicurezza avanzato**

---

> 🏁 **Il sistema più completo per gestire il tuo team RC Buggy 1/8!**  
> Dalla registrazione autonoma alla gestione professionale, tutto in un'unica webapp PWA.

---

## 🚀 Installazione Rapida

### 1. **Upload File**
Carica tutti i file nella cartella `/team/` del tuo hosting:
```
https://l3drc.altervista.org/team/
├── index.html          (WebApp principale)
├── manifest.json       (Configurazione PWA)
├── sw.js              (Service Worker)
├── api.php            (Backend API)
└── install.sql        (Schema database)
```

### 2. **Configurazione Database**
- Accedi al **pannello MySQL** di Altervista
- Seleziona il database `my_l3drc`
- Importa il file `install.sql`
- Verifica che tutte le tabelle siano state create

### 3. **Test Installazione**
- Vai su `https://l3drc.altervista.org/team/`
- Verifica che la webapp si carichi correttamente
- Testa l'installazione PWA (pulsante 📱 in basso a destra)

---

## 🔐 Accesso Admin

### **Credenziali Default**
- **Username**: `admin`
- **Password**: `rcteam2025`

> ⚠️ **IMPORTANTE**: Cambia la password dopo il primo accesso!

### **Funzionalità Admin**
- 👥 **Gestione Piloti**: Aggiungi, modifica, elimina piloti
- 🤝 **Gestione Sponsor**: Amministra sponsor e contratti
- 🏁 **Gestione Eventi**: Crea eventi e invia notifiche push
- 📦 **Inventario Materiali**: Traccia materiali e assegnazioni
- 📊 **Dashboard**: Statistiche e overview generale

---

## 📱 Caratteristiche PWA

### **Installazione Mobile**
1. Apri la webapp su smartphone
2. Clicca il pulsante **📱 Installa** (in basso a destra)
3. Conferma l'installazione
4. L'app apparirà nella home screen

### **Notifiche Push**
- **Automatiche**: Per nuovi eventi del team
- **Manuali**: Inviate dall'admin quando necessario
- **Permessi**: Richiesti automaticamente al primo accesso
- **Gestione**: Configurabili dalle impostazioni del browser/dispositivo

---

## 🗄️ Struttura Database

### **Tabelle Principali**
- `pilots` - Anagrafica piloti del team
- `sponsors` - Gestione sponsor e partnership  
- `events` - Eventi e gare del team
- `tracks` - Database piste (auto-popolato)
- `materials` - Inventario materiali ricevuti
- `material_assignments` - Assegnazioni materiali ai piloti
- `notifications` - Sistema notifiche push
- `admins` - Utenti amministratori

### **Dati di Esempio**
Il database viene popolato con dati di esempio:
- **5 piloti** (3 Senior, 2 Junior)
- **2 sponsor** (Evolution Modellismo + RC Parts Store)
- **3 eventi** (gare e allenamenti)
- **3 piste** (Milano, Monza, Bergamo)
- **5 tipologie materiali** (t-shirt, cappellini, gadget)

---

## ⚙️ Configurazione Avanzata

### **Personalizzazione Branding**
Modifica nel file `index.html`:
```html
<!-- Logo e Nome Team -->
<div class="logo-text">
    <h1>IL TUO TEAM</h1>
    <p>La tua descrizione</p>
</div>

<!-- Colori -->
:root {
    --primary: #FF6B35;    <!-- Colore principale -->
    --secondary: #2C3E50;  <!-- Colore secondario -->
    --accent: #F39C12;     <!-- Colore accento -->
}
```

### **Configurazione Email**
Nel file `api.php` modifica:
```php
// Email per richieste sponsor
$to = 'tuaemail@dominio.com';
```

### **Notifiche Push Avanzate**
Per notifiche push reali (non simulate):
1. Registra il sito su **Firebase Cloud Messaging**
2. Ottieni le chiavi **VAPID**
3. Modifica il Service Worker con le tue credenziali

---

## 🔧 Manutenzione

### **Backup Database**
```sql
-- Esegui questo comando nel pannello MySQL
CALL backup_team_data();
```

### **Aggiornamento Password Admin**
```sql
-- Genera nuova password hash
UPDATE admins 
SET password_hash = PASSWORD('nuova_password') 
WHERE username = 'admin';
```

### **Pulizia Cache PWA**
In caso di problemi con la cache:
1. Vai su `Impostazioni > Sicurezza > Cancella dati sito`
2. Oppure usa il **DevTools** (F12) > Application > Storage > Clear Storage

---

## 📊 Analytics e Monitoraggio

### **Statistiche Disponibili**
- Numero piloti per categoria
- Materiali distribuiti per sponsor  
- Eventi per mese
- Notifiche inviate/lette
- Visite per pista

### **Report Automatici**
La webapp genera automaticamente:
- **Dashboard Admin**: Overview in tempo reale
- **Statistiche Sponsor**: ROI e visibilità
- **Report Piloti**: Partecipazioni e materiali

---

## 🆘 Troubleshooting

### **Problemi Comuni**

**❌ "Errore di connessione al database"**
- Verifica le credenziali in `api.php`
- Controlla che il database `my_l3drc` esista
- Verifica che le tabelle siano state importate

**❌ "PWA non si installa"**
- Verifica che il sito sia in **HTTPS**
- Controlla che `manifest.json` sia accessibile
- Prova a cancellare la cache del browser

**❌ "Notifiche non funzionano"**
- Verifica i permessi notifiche nel browser
- Controlla che il Service Worker sia registrato
- Le notifiche funzionano solo in HTTPS

**❌ "Area admin non accessibile"**
- Usa le credenziali default: `admin` / `rcteam2025`
- Verifica che la tabella `admins` esista nel database
- Controlla i log PHP per errori

### **Log e Debug**
Per problemi tecnici:
1. Apri **DevTools** (F12) 
2. Vai su **Console** per vedere errori JavaScript
3. Vai su **Network** per verificare chiamate API
4. Controlla i **log PHP** nel pannello Altervista

---

## 🌟 Funzionalità Aggiuntive

### **Prossimi Sviluppi**
- 📸 **Gallery foto eventi**
- 🏆 **Sistema classifiche piloti**  
- 📧 **Newsletter automatica sponsor**
- 📱 **App mobile nativa**
- 🔗 **Integrazione social media**

### **Richieste Personalizzazioni**
Per modifiche specifiche al tuo team:
- Contatta il supporto tecnico
- Fornisci dettagli specifici delle tue esigenze
- Valuteremo l'implementazione

---

## 📞 Supporto

### **Contatti**
- **Email**: l3drc@altervista.org
- **Website**: https://l3drc.altervista.org/

### **Documentazione Tecnica**
- **PWA**: [Google PWA Guide](https://web.dev/progressive-web-apps/)
- **Altervista**: [Documentazione hosting](https://it.altervista.org/supporto/)
- **MySQL**: [Pannello database](https://it.altervista.org/pannello-controllo/)

---

## 📄 Licenza e Credits

### **Versione**: 1.0.0
### **Creato per**: RC Junior/Senior Team
### **Tecnologie**: HTML5, CSS3, JavaScript, PHP, MySQL, PWA
### **Compatibilità**: Chrome, Firefox, Safari, Edge (versioni recenti)

---

> 🏁 **Buona gestione del tuo team RC Buggy 1/8!**  
> La webapp è pronta per accompagnare il team verso nuovi successi!