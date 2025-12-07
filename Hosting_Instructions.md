# Hosting Instructions

## Prerequisites
- GitHub Account
- Accounts on Vercel (Frontend) and Render (Backend)
- MongoDB Atlas Account (Database)

## Step 1: Database (MongoDB Atlas)
1.  Create a cluster on MongoDB Atlas.
2.  Get the Connection String (URI).
3.  Whitelist `0.0.0.0/0` in Network Access.

## Step 2: Backend (Render)
1.  Push your code to GitHub.
2.  Login to Render and create a **New Web Service**.
3.  Connect your GitHub repo.
4.  Root Directory: `server`
5.  Build Command: `npm install`
6.  Start Command: `node server.js`
7.  **Environment Variables**: Add `MONGO_URI` with your connection string.
8.  Deploy. Copy the provided URL (e.g., `https://peersphere-api.onrender.com`).

## Step 3: Frontend (Vercel)
1.  Login to Vercel and create a **New Project**.
2.  Import your GitHub repo.
3.  Root Directory: `client`
4.  Build Command: `npm run build`
5.  Output Directory: `dist`
6.  **Important**: In your frontend code (`client/src`), replace `http://localhost:5001` with your deployed Backend URL.
    - *Tip*: Create a `.env` in client and use `VITE_API_URL`.
7.  Deploy.

## Done!
Share the Vercel URL with users.
