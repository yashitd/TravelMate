# Deploying TravelMate to Vercel

This repository is set up to deploy as **one Vercel project**: the Vite React
client is built to static files and the Express API runs as a serverless
function, both served from the same domain.

```
repo root
├─ api/index.js        ← serverless entry: wraps the Express app (server/app.js)
├─ vercel.json         ← build + routing config
├─ package.json        ← root deps for the serverless function (express, mongoose, ...)
├─ client/             ← Vite + React app (built to client/dist)
└─ server/             ← Express app (app.js exports the app, server.js just listens)
```

Requests to `/api/*` are routed to the `api/index.js` function; everything else
is served from `client/dist` with a SPA fallback to `index.html`.

## 1. Move the database to MongoDB Atlas

Serverless functions cannot reach `mongodb://127.0.0.1:27017`. Create a free
cluster at <https://www.mongodb.com/atlas>, then grab the connection string
(Network Access → allow `0.0.0.0/0` for a demo, Database Access → user/password).

## 2. Import the repo into Vercel

1. <https://vercel.com/new> → import the Git repository.
2. Leave **Root Directory** at the repository root (do **not** pick `client`).
3. Framework Preset: **Other** (the `vercel.json` build settings take over).
4. Add the environment variables below, then Deploy.

## 3. Environment variables (Project → Settings → Environment Variables)

| Name          | Value                                                        |
| ------------- | ------------------------------------------------------------ |
| `MONGO_URI`   | your Atlas connection string, e.g. `mongodb+srv://user:pass@cluster.xxxx.mongodb.net/travelmate` |
| `JWT_SECRET`  | any long random string                                       |
| `CLIENT_URL`  | your deployed site URL, e.g. `https://travelmate.vercel.app` |

`CLIENT_URL` is what the CORS check allows, so it must match the URL you open in
the browser (same-origin requests still send an `Origin` header for POST/PUT).

`VITE_API_URL` is **not** required: production builds call the same-origin
`/api` path by default.

## 4. Seed the Atlas database (one time, from your machine)

```bash
cd server
$env:MONGO_URI="<your Atlas connection string>"   # PowerShell
npm run seed
```

This loads the 9 demo users and 6 journeys. Demo login:
`demo@travelmate.com` / `Demo@123`.

## 5. Verify

- `https://<your-app>.vercel.app/api/health` → `{"status":"ok"}`
- `https://<your-app>.vercel.app/api/travels` → the 6 journeys
- Open the site and check the Book page lists the journeys.

## Local development is unchanged

```bash
cd server && npm install && npm run dev   # API on http://localhost:5000
cd client && npm install && npm run dev   # Vite on http://localhost:5173
```

## Optional: deploy the API separately

If you'd rather host the API on its own service, set the client's
`VITE_API_URL` to that service's URL (e.g. `https://api.example.com/api`) and
set its `CLIENT_URL` to your Vercel site. The `server/` folder still runs as a
normal Node app via `npm start`.
