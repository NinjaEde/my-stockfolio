# StockfolioPro

StockfolioPro is a modern web application for managing your stock portfolio. You can add stocks, save notes with Markdown, and view TradingView charts directly.

![StockfolioPro Screenshot](screenshot.png)

## Features

- Manage stock portfolio (add, edit, delete)
- Notes with Markdown and checklists
- TradingView chart integration
- Colored bookmarks for favorites
- Responsive design & dark mode
- Offline-first (local storage)
- MongoDB integration (optional)
- Supabase integration (optional)

## Quick Start

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Optional: Docker & Docker Compose

### Installation (without Docker)

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
3. Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_TRADINGVIEW_CHART_ID=Qkb0J0s0  # Chart ID for TradingView
   ```
4. Start development:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
5. Open the app: [http://localhost:5173](http://localhost:5173)

### Docker & Docker Compose

1. Create `.env` (frontend) and `server/.env` (backend) as above.
2. Build & start everything:
   ```bash
   docker-compose up --build
   ```
3. Open the app: [http://localhost:3033](http://localhost:3033)
4. Stop:
   ```bash
   docker-compose down
   ```

> Environment variables are loaded automatically. Changes to `.env` may require a container restart.

## Environment Variables

**Frontend (`.env` in project root):**
```
VITE_SUPABASE_URL=...         # Optional, for Supabase
VITE_SUPABASE_ANON_KEY=...    # Optional, for Supabase
VITE_TRADINGVIEW_CHART_ID=... # TradingView chart_id for all stocks
```
**Backend (`server/.env`):**
```
PORT=4000
MONGO_URI=mongodb://mongo:27017/stockfolio
JWT_SECRET=your_secret_token
```

## Project Structure

```bash
stockfolio/
├── src/
│   ├── components/      # React components (incl. ui/)
│   ├── services/        # API and data services
│   ├── types/           # TypeScript types
│   ├── App.tsx, main.tsx, index.css
├── server/              # Backend (Node.js/Express)
├── .env                 # Frontend variables
├── docker-compose.yaml  # Multi-service orchestration
└── ...                  # Other configuration files
```

## Deployment

For production:
```bash
npm run build
# or
yarn build
```
The built frontend is located in the `dist` folder and can be served by any web server.

## License
MIT License

---

**Tip:** For TradingView integration, usually a single chart ID (e.g. `Qkb0J0s0`) is sufficient. You can adjust this in the `.env` file.
