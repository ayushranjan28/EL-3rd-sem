# Auto-Open Source Identifier

## What This Does

When you run `npm run dev` in the cpcb-dashboard, it will automatically:
1. Start the Next.js development server (localhost:3000)
2. Open the **Source Identifier** page (localhost:5000) in a new browser tab after 2 seconds

## How It Works

- **Script**: `scripts/open-browser.js` - Opens localhost:5000 in your default browser
- **Modified**: `package.json` - The `dev` script now runs both the Next.js server and the browser script

## The Source Identifier Page

The Source Identifier is located at:
- **File**: `templates/index.html`
- **Server**: Flask API (`api_server.py`)
- **URL**: http://localhost:5000

This page allows you to:
- Enter water quality parameters (Turbidity, pH, Conductivity, etc.)
- Identify the likely industrial pollution source (Textile, Chemical, etc.)
- View analysis results with probability percentages

## Usage

Just run your normal dev command:
```bash
npm run dev
```

The Source Identifier will automatically open in a new tab!

## Note

Make sure your Flask server (`api_server.py`) is running on port 5000 for the Source Identifier to work properly.
