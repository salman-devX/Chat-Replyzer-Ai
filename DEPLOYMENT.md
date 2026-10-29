# 🚀 Chat Replyzer AI — Production Deployment Guide

Yeh document aap ko step-by-step batata hai ke **Chat Replyzer AI** ko production me kahan aur kaise deploy karna hai taake:
1. Multiple users isy bina kisi rukawat ke use kar sakein.
2. WhatsApp QR code aur sessions server restart hone par delete na hon (Persistent Storage).
3. AI responses fast, reliable aur bilkul human-like rahain.

---

## 🌟 Quick Options Summary

| Platform | Best For | Persistent WhatsApp Session Support | Setup Time |
|---|---|---|---|
| **Railway.app** (Recommended) | Sub se asan aur fast cloud deploy | ✅ Haan (Persistent Volume add karein) | 5 minutes |
| **Render.com** | Blueprint automated deployment | ✅ Haan (Persistent Disk included in `render.yaml`) | 7 minutes |
| **Ubuntu VPS (DigitalOcean / Hetzner / AWS)** | Maximum control, highest speed, zero limits | ✅ Haan (Server local filesystem) | 15 minutes |
| **Docker Compose** | Apne kisi bhi server ya local machine par 1-command | ✅ Haan (`wa_auth_data` & `wa_sessions_data` volumes) | 2 minutes |

---

## Option 1: Railway Deployment (Sab Se Asaan)

1. [Railway.app](https://railway.app) par login karein.
2. **New Project** -> **Deploy from GitHub Repo** select karein aur apna repository choose karein.
3. Railway automatically `Dockerfile` ko detect kar lega.
4. **Variables (Environment Variables)** tab me ja kar yeh values paste karein:
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_random_string_32_characters
   ENCRYPTION_SECRET_KEY=chat_replyzer_32byte_secret_key_2026!
   GEMINI_API_KEY=your_gemini_api_key
   ```
5. **Persistent Volume Add Karein (Bohat Zaroori)**:
   - Service settings me ja kar **Add Volume** par click karein.
   - Mount path set karein: `/app/server/wa_sessions`
   - Is se agar server restart bhi ho to WhatsApp linked device disconnect nahi hogi!
6. **Generate Domain**:
   - Settings -> Networking -> **Generate Domain** par click karein (e.g. `chat-replyzer.up.railway.app`).
   - Ab aap ka app live hai!

---

## Option 2: Render.com Deployment

Project me pehle se `render.yaml` mojood hai:
1. [Render.com](https://render.com) par **New** -> **Blueprint** select karein.
2. Apni GitHub repository select karein.
3. Render `render.yaml` ko parh kar automatically Web Service aur Persistent Disk create kar dega.
4. Environment variables me apna `MONGODB_URI` aur `GEMINI_API_KEY` enter karein.
5. Deploy click karein.

---

## Option 3: VPS / Ubuntu Server Deployment (With PM2 + Nginx)

Agar aap ke paas Ubuntu 22.04/24.04 VPS hai (DigitalOcean Droplet, Hetzner, AWS EC2 ya Hostinger):

### Step 1: Node.js 20 & PM2 Install Karein
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git
sudo npm install -g pm2
```

### Step 2: Code Clone & Build Karein
```bash
git clone <your-repo-url> /var/www/chat-replyzer
cd /var/www/chat-replyzer

# Install frontend dependencies and build React UI
npm install
npm run build

# Install server dependencies
cd server
npm install --production
cd ..
```

### Step 3: Server Environment File (.env) Set Karein
```bash
nano server/.env
```
Is me production values daal kar save karein (`Ctrl+O`, `Enter`, `Ctrl+X`).

### Step 4: PM2 se Service Run Karein
```bash
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup
```

### Step 5: Nginx Reverse Proxy (Domain & Free SSL)
```nginx
server {
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Certbot se free SSL le lein:
```bash
sudo certbot --nginx -d yourdomain.com
```

---

## Option 4: 1-Command Docker Deployment

Agar aap Docker use karte hain, to project folder me bas yeh command chalayein:

```bash
docker compose up -d --build
```
Is se:
- React frontend build ho kar server ke sath bundle ho jaye ga.
- Port `5000` par poora system live ho jaye ga (`http://your-server-ip:5000`).
- WhatsApp credentials Docker volumes me mehfooz rahain ge.

---

## ✅ Deployment Ke Baad Check Karne Ki Cheezein

1. **Health Check URL**:
   Browser me `https://your-domain/api/health` open karein. Output aana chahiye:
   ```json
   { "success": true, "service": "TruckPilot API", "version": "2.4.0", "env": "production" }
   ```
2. **Dashboard & WebSockets**:
   Frontend open karein, Dashboard me WhatsApp Link QR code screen par foran nazar aana chahiye.
3. **Multi-User Test**:
   Do mukhtalif browsers ya devices me open kar ke test karein, har session independently work kare ga.
