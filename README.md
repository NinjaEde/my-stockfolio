# StockfolioPro

StockfolioPro is a web application for managing your stock portfolio. It allows you to track stocks you're interested in, add detailed notes with Markdown support, and view TradingView charts all in one place.

![StockfolioPro Screenshot](screenshot.png)

## Features

- Add and manage stocks in your portfolio
- Edit stock details (ticker symbol and display name)
- Bookmark stocks with customizable colors
- View interactive TradingView charts for each stock
- Add detailed notes with full Markdown support
- Technical analysis checklist templates
- Responsive design that works on desktop and mobile devices
- Offline-first functionality with local storage
- **Dark mode support** with user preference persistence
- **Real-time updates** for stock and note management
- Built with modern React and TypeScript

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: React Hooks
- **UI Components**: Custom components with Tailwind CSS
- **Charting**: TradingView widget integration
- **Data Storage**: Local storage (development), Supabase (production)
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/stockfolio.git
   cd stockfolio
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the project root with your Supabase credentials:

   ```bash
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Frontend-Umgebungsvariablen

Lege eine Datei `.env` im Projekt-Root (nicht im server-Ordner!) mit folgendem Inhalt an:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_TRADINGVIEW_CHART_ID=Qkb0J0s0  # TradingView chart_id für alle Aktien (z.B. Qkb0J0s0)
```

Diese Variablen werden nur im Frontend verwendet und sind im Browser sichtbar. Alle Variablen für das Frontend müssen mit `VITE_` beginnen.

> **Hinweis:** Die Variable `VITE_TRADINGVIEW_CHART_ID` wird für alle TradingView-Chart-URLs verwendet. Wenn du einen anderen Chart-Container nutzen möchtest, passe den Wert entsprechend an.

---

## Backend-Umgebungsvariablen

Lege eine Datei `server/.env` mit folgendem Inhalt an:

```
PORT=4000
MONGO_URI=mongodb://mongo:27017/stockfolio
JWT_SECRET=dein_geheimes_token
```

In der `docker-compose.yaml` muss im `app`-Service folgendes stehen:

```yaml
  env_file:
    - .env
```

Und im `api`-Service:

```yaml
  env_file:
    - ./server/.env
```

Dadurch werden die Umgebungsvariablen beim Starten der Container automatisch gesetzt.

## Project Structure

```bash
stockfolio/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── ui/          # Reusable UI components (Button, Card, Input, etc.)
│   │   ├── AddStockForm.tsx
│   │   ├── Auth.tsx
│   │   ├── Header.tsx
│   │   ├── StockCard.tsx
│   │   ├── StockList.tsx
│   │   └── StockNotes.tsx
│   ├── services/        # API and data services
│   │   ├── authService.ts
│   │   ├── bookmarkService.ts
│   │   ├── mockDataService.ts
│   │   ├── noteService.ts
│   │   ├── stockService.ts
│   │   └── supabaseClient.ts
│   ├── types/           # TypeScript type definitions
│   │   ├── index.ts
│   │   └── tradingview.d.ts
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   ├── index.css        # Global styles (Tailwind)
│   └── types.ts         # (Legacy/compatibility types)
├── server/              # Backend (Node.js/Express API)
│   ├── Dockerfile
│   ├── index.js
│   ├── mongoDataService.ts
│   ├── package.json
│   └── .env             # Backend environment variables
├── Dockerfile           # Frontend Dockerfile
├── docker-compose.yaml  # Multi-service orchestration
├── README.md
├── package.json         # Frontend dependencies
├── tailwind.config.js   # Tailwind CSS config
├── tsconfig.json        # TypeScript config
├── vite.config.ts       # Vite config
├── .env                 # Frontend environment variables
└── ...                  # Other configuration files
```

## Using the Application

1. **Adding a Stock**
   - Enter the ticker symbol and display name in the form at the top of the page
   - Click "Add Stock" to add it to your portfolio

2. **Viewing Stock Details**
   - Click the expand button on any stock card to view its chart and notes
   - The chart is powered by TradingView and shows real-time data

3. **Adding Notes**
   - When a stock is expanded, you can add notes in the notes section
   - Notes support Markdown formatting including lists, headers, and code blocks
   - Click "Insert Checklist Template" to add a pre-formatted technical analysis template

4. **Dark Mode**
   - Toggle between light and dark mode using the button in the header
   - Your preference is saved and applied automatically on your next visit

5. **Deleting Items**
   - Click the "Delete" button on a stock card to remove it and all its associated notes
   - Click the trash icon on individual notes to delete just that note

## Deployment

To build the application for production:

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory, ready to be deployed to any static hosting service.

## Docker & Docker Compose

Das Projekt kann komplett mit Docker und Docker Compose gebaut und gestartet werden. Damit lassen sich Frontend, Backend und Datenbank einfach als Container betreiben.

### Build & Start

1. **Voraussetzungen:**
   - [Docker](https://www.docker.com/) und [Docker Compose](https://docs.docker.com/compose/) müssen installiert sein.
   - Lege die `.env` im Projekt-Root (Frontend) und `server/.env` (Backend) wie oben beschrieben an.

2. **Build & Start aller Services:**
   
   ```bash
   docker-compose up --build
   ```
   
   Das baut die Images und startet alle Services (Frontend, Backend, MongoDB) im Hintergrund.

3. **Nur Build (ohne Start):**
   
   ```bash
   docker-compose build
   ```

4. **Logs anzeigen:**
   
   ```bash
   docker-compose logs -f
   ```

5. **Services stoppen:**
   
   ```bash
   docker-compose down
   ```

6. **Frontend erreichbar unter:**
   
   [http://localhost:3033](http://localhost:3033)


> Die Umgebungsvariablen werden automatisch aus den jeweiligen `.env`-Dateien geladen (siehe oben). Änderungen an der `.env` erfordern ggf. einen Neustart des Containers.

## Future Enhancements

- User authentication
- Cloud synchronization across devices
- Performance metrics and portfolio analytics
- Stock price alerts and notifications
- Watchlist functionality

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [TradingView](https://www.tradingview.com/) for their excellent charting widgets
- [Tailwind CSS](https://tailwindcss.com/) for the styling utilities
- [Vite](https://vitejs.dev/) for the fast build tooling
- [React](https://reactjs.org/) for the UI library
- [Supabase](https://supabase.io/) for the backend infrastructure
