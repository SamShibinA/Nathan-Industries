# NathanIndustries - Vercel Deployment Guide

This repository is optimized for **two separate deployments on Vercel** from a single GitHub repository:
1. **Backend Deployment**: Node.js / Express Serverless API (`server` folder)
2. **Frontend Deployment**: Vite + React Single Page Application (`client` folder)

---

## 🏗️ Architecture Overview

```
GitHub Repository: NathanIndustries/
│
├── server/                     --> Deployed as Vercel Project #1 (Backend API)
│   ├── api/index.js            --> Serverless Function Handler
│   ├── vercel.json             --> Serverless routing rewrites
│   └── src/                    --> Express Application & MongoDB Models
│
└── client/                     --> Deployed as Vercel Project #2 (Frontend Client)
    ├── vercel.json             --> SPA route rewrites to index.html
    └── dist/                   --> Production Vite bundle
```

---

## 🚀 Part 1: Deploying the Backend (`server`)

### Step 1.1: Import Project in Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** → **Project**.
3. Select and import your **NathanIndustries** GitHub repository.

### Step 1.2: Configure Project Settings
- **Project Name**: `nathan-industries-backend` (or your desired backend name)
- **Framework Preset**: Select **Other**
- **Root Directory**: Click **Edit** and choose **`server`**
- **Build and Output Settings**: Leave defaults (no build command needed for backend)

### Step 1.3: Add Environment Variables
In the **Environment Variables** section, add the following key-value pairs:

| Variable Name | Example Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Production mode |
| `MONGO_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/nathan_industries?retryWrites=true&w=majority` | Your MongoDB Atlas connection URI |
| `JWT_SECRET` | `your_64_char_secure_random_jwt_secret_key` | Secret key for JWT tokens |
| `CLOUDINARY_CLOUD_NAME` | `fpbcpccp` | Cloudinary Cloud Name for file uploads |
| `CLOUDINARY_API_KEY` | `555652249841283` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | `hQdIDneTDYfzFe15I70bqduwtR4` | Cloudinary API Secret |
| `CLIENT_URL` | `https://nathan-industries.vercel.app` *(or leave blank initially)* | Allowed frontend URL for CORS |

> [!NOTE]
> **MongoDB Atlas Network Access**: Ensure your MongoDB Atlas cluster has IP Whitelist enabled for **Anywhere (`0.0.0.0/0`)** because Vercel Serverless Functions use dynamic IP addresses.

### Step 1.4: Deploy Backend
1. Click **Deploy**.
2. Once deployed, note down your **Backend Deployment URL** (e.g. `https://nathan-industries-backend.vercel.app`).
3. Verify by visiting `https://nathan-industries-backend.vercel.app/api/health` in your browser. You should see `{ "status": "healthy", ... }`.

---

## 🌐 Part 2: Deploying the Frontend (`client`)

### Step 2.1: Import Project in Vercel
1. Go back to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** → **Project**.
3. Select and import the **same** GitHub repository.

### Step 2.2: Configure Project Settings
- **Project Name**: `nathan-industries` (or your desired frontend name)
- **Framework Preset**: **Vite** (Vercel will auto-detect Vite)
- **Root Directory**: Click **Edit** and choose **`client`**
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Step 2.3: Add Environment Variables
In the **Environment Variables** section, add:

| Variable Name | Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://nathan-industries-backend.vercel.app/api` | Point this to your Backend Vercel URL from Part 1 |

> [!TIP]
> The API client in this project automatically normalizes the URL, so whether you provide `https://backend.vercel.app` or `https://backend.vercel.app/api`, it resolves correctly.

### Step 2.4: Deploy Frontend
1. Click **Deploy**.
2. Once deployed, you will get your **Frontend URL** (e.g. `https://nathan-industries.vercel.app`).
3. Visit the URL to verify that pages, catalogs, and images load correctly.

---

## 🔄 Part 3: Final CORS Handshake

To ensure all browser requests from your frontend to your backend are permitted:
1. Open your **Backend Project** in Vercel (`nathan-industries-backend`).
2. Go to **Settings** → **Environment Variables**.
3. Update or add:
   ```
   CLIENT_URL = https://nathan-industries.vercel.app
   ```
   *(You can also add multiple URLs separated by commas, e.g. `https://nathan-industries.vercel.app,http://localhost:5173`)*
4. Go to **Deployments** tab and click **Redeploy** on the latest deployment so it picks up the updated variable.

> [!NOTE]
> The backend server configuration automatically allows all `*.vercel.app` domains, so even Vercel preview branch deployments will work out of the box!

---

## ✅ Part 4: Verification Checklist

- [ ] **Backend Health Check**: Open `https://<backend-url>/api/health` → returns status `healthy`.
- [ ] **Products API**: Open `https://<backend-url>/api/products` → returns product list.
- [ ] **Frontend SPA Routing**: Refresh any non-root page (e.g. `/products`, `/about`, `/gallery`) → loads smoothly without 404.
- [ ] **Quotation RFQ Flow**: Click "Get Quote" on a product card → prompts for sign-in or opens quotation modal.
- [ ] **Authentication**: Log in with administrator account or register a new customer account.
- [ ] **Media Uploads**: Add a new product or project image from the Admin Panel → uploads directly to Cloudinary.
