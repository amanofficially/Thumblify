# Thumblify 🎨

AI-powered YouTube thumbnail generator built with React + Node.js/Express + MongoDB.

> **Free AI image generation** powered by [Pollinations.ai](https://pollinations.ai) — no API key required!

---

## 🗂 Project Structure

```
Thumblify/
├── client/          # React + Vite + TypeScript frontend
└── server/          # Node.js + Express + MongoDB backend
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas) — free tier)

---

### 1. Backend Setup

```bash
cd server
npm install

# Create your .env file
cp .env.example .env
# Edit .env and set your MONGODB_URI and JWT_SECRET
```

**Edit `server/.env`:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/thumblify
JWT_SECRET=your_super_secret_key_at_least_32_characters
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
POLLINATIONS_API_URL=https://image.pollinations.ai/prompt
```

```bash
# Start the backend
npm run dev
# Server runs on http://localhost:5000
```

---

### 2. Frontend Setup

```bash
cd client
npm install

# .env is already configured for local development
# Edit client/.env if your backend runs on a different port
```

```bash
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user (🔒) |

### Thumbnails (all protected 🔒)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/thumbnails/generate` | Generate thumbnail |
| GET | `/api/thumbnails` | List user thumbnails (paginated) |
| GET | `/api/thumbnails/:id` | Get single thumbnail |
| DELETE | `/api/thumbnails/:id` | Delete thumbnail |

**Generate payload:**
```json
{
  "title": "10 Tips for Better Sleep",
  "style": "Bold & Graphic",
  "aspect_ratio": "16:9",
  "color_scheme": "vibrant",
  "user_prompt": "person sleeping peacefully"
}
```

---

## 🎨 AI Image Generation — Pollinations.ai

Thumbnails are generated using **[Pollinations.ai](https://pollinations.ai)** — completely free, no API key needed!

- Model: `flux` (state-of-the-art)
- Resolutions: 1280×720 (16:9), 1080×1080 (1:1), 720×1280 (9:16)
- Each user prompt is enriched with style + color scheme descriptors

---

## 🔐 Security Features

- Passwords hashed with **bcrypt** (cost factor 12)
- **JWT** authentication (Bearer token)
- **Helmet.js** security headers
- **CORS** locked to frontend origin
- **Rate limiting**: 100 req/15min global, 10 auth/15min, 20 generations/15min
- Input validation & sanitization via **express-validator**
- Request body size limit (10KB)
- MongoDB ownership checks on all data operations

---

## 🚀 Production Deployment

1. Set `NODE_ENV=production` in server `.env`
2. Use MongoDB Atlas URI in `MONGODB_URI`
3. Set a strong random `JWT_SECRET` (32+ chars)
4. Set `CLIENT_URL` to your deployed frontend URL
5. Build the frontend: `cd client && npm run build`
6. Deploy server to Render, Railway, Fly.io, etc.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| AI | Pollinations.ai (free, no key) |
| Security | Helmet, CORS, express-rate-limit |
