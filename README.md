# StockfolioPro

StockfolioPro ist eine moderne Webanwendung zur Verwaltung deines Aktienportfolios. Du kannst Aktien hinzufügen, Notizen mit Markdown speichern und TradingView-Charts direkt einsehen.

![StockfolioPro Screenshot](screenshot.png)

## Features

- Aktien-Portfolio verwalten (Hinzufügen, Bearbeiten, Löschen)
- Notizen mit Markdown und Checklisten
- TradingView-Chart-Integration
- Farbige Bookmarks für Favoriten
- Responsive Design & Dark Mode
- Offline-First (lokale Speicherung)
- MongoDB-Integration (optional)
- Supabase-Integration (optional)

## Schnellstart

### Voraussetzungen
- Node.js (v16+)
- npm oder yarn
- Optional: Docker & Docker Compose

### Installation (ohne Docker)

1. Repository klonen:
   ```bash
   git clone https://github.com/yourusername/stockfolio.git
   cd stockfolio
   ```
2. Abhängigkeiten installieren:
   ```bash
   npm install
   # oder
   yarn
   ```
3. `.env` im Projekt-Root anlegen:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_TRADINGVIEW_CHART_ID=Qkb0J0s0  # Chart-ID für TradingView
   ```
4. Entwicklung starten:
   ```bash
   npm run dev
   # oder
   yarn dev
   ```
5. App öffnen: [http://localhost:5173](http://localhost:5173)

### Docker & Docker Compose

1. `.env` (Frontend) und `server/.env` (Backend) wie oben anlegen.
2. Alles bauen & starten:
   ```bash
   docker-compose up --build
   ```
3. App öffnen: [http://localhost:3033](http://localhost:3033)
4. Stoppen:
   ```bash
   docker-compose down
   ```

> Die Umgebungsvariablen werden automatisch geladen. Änderungen an `.env` erfordern ggf. einen Neustart der Container.

## Umgebungsvariablen

**Frontend (`.env` im Projekt-Root):**
```
VITE_SUPABASE_URL=...         # Optional, für Supabase
VITE_SUPABASE_ANON_KEY=...    # Optional, für Supabase
VITE_TRADINGVIEW_CHART_ID=... # TradingView chart_id für alle Aktien
```
**Backend (`server/.env`):**
```
PORT=4000
MONGO_URI=mongodb://mongo:27017/stockfolio
JWT_SECRET=dein_geheimes_token
```

## Projektstruktur

```bash
stockfolio/
├── src/
│   ├── components/      # React-Komponenten (inkl. ui/)
│   ├── services/        # API- und Datenservices
│   ├── types/           # TypeScript-Typen
│   ├── App.tsx, main.tsx, index.css
├── server/              # Backend (Node.js/Express)
├── .env                 # Frontend-Variablen
├── docker-compose.yaml  # Multi-Service Orchestrierung
└── ...                  # Weitere Konfigurationsdateien
```

## Deployment

Für Produktion:
```bash
npm run build
# oder
yarn build
```
Das gebaute Frontend liegt im `dist`-Ordner und kann auf jedem Webserver bereitgestellt werden.

## Lizenz
MIT License

---

**Tipp:** Für die TradingView-Integration reicht meist eine Chart-ID (z.B. `Qkb0J0s0`). Diese kann in der `.env` angepasst werden.
