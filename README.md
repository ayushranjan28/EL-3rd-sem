# CPCB Real-Time Industrial Monitoring Dashboard

## Overview
This is a Next.js 15 application designed for the Central Pollution Control Board (CPCB) to monitor industrial effluent data in real-time. It includes:
- **Live Dashboard**: Visualizing Turbidity, pH, and Connectivity from Factory A, B, and C.
- **AI Integration Logic**: Placeholder for custom ML model to detect violations beyond simple thresholds.
- **Auto-Assignment System**: Automatically assigns employees to detected violations.
- **Govt Styling**: CPCB official colors and layout.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup (Vercel Postgres)**
   - Create a Vercel Postgres database.
   - Run the SQL in `schema.sql`.
   - Pull environment variables: `vercel env pull .env.local`
   - *Note: If no DB is connected, the app falls back to an in-memory mock store automatically.*

3. **Run Locally**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

4. **AI Model Integration**
   - Edit `src/app/api/ai-check/route.ts` to connect your trained Python/ONNX model.

## Features
- **Real-time Data**: Simulates live sensor streams via Socket.io (polling fallback for serverless).
- **Employee Assignment**: Randomly assigns from pool of officers.
- **Alerts**: Tracks status (Active/Resolved).

## Deployment
Ready for Vercel.
```bash
vercel --prod
```
