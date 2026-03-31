# Career AI — Frontend

A premium, minimal Next.js frontend for the Career AI FastAPI backend.

## Tech Stack
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (custom design system)
- **Lucide React** icons
- **Vercel** deployment ready

---

## Pages

| Page | Route | Backend Endpoint |
|---|---|---|
| Home | `/` | — |
| Resume Match | `/resume-match` | `POST /get-relevence-score` |
| Career Roadmap | `/career-roadmap` | `POST /Career-roadmap` |
| DSA Roadmap | `/dsa-roadmap` | `POST /DSA-roadmap` |

---

## Local Development

### 1. Clone and install

```bash
npm install
```

### 2. Set environment variable

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

### Option A — Vercel CLI

```bash
npm i -g vercel
vercel
```

When prompted, add your environment variable:
```
NEXT_PUBLIC_API_URL = https://your-space.hf.space
```

### Option B — Vercel Dashboard

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. In **Environment Variables**, add:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: your Hugging Face Spaces URL (e.g. `https://username-career-ai.hf.space`)
4. Click **Deploy**

---

## Hugging Face Spaces (Backend)

Make sure your FastAPI backend on HF Spaces has CORS configured for your Vercel domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-app.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Project Structure

```
career-ai-frontend/
├── app/
│   ├── layout.tsx           # Root layout + Navbar
│   ├── globals.css          # Design system, fonts, animations
│   ├── page.tsx             # Landing page
│   ├── resume-match/
│   │   └── page.tsx         # Resume vs JD scoring
│   ├── career-roadmap/
│   │   └── page.tsx         # Career roadmap generator
│   └── dsa-roadmap/
│       └── page.tsx         # DSA prep roadmap
├── components/
│   ├── Navbar.tsx           # Sticky nav with mobile menu
│   └── ui/
│       ├── FileDropzone.tsx # Drag-and-drop file upload
│       ├── ScoreRing.tsx    # Animated SVG score ring
│       ├── LoadingState.tsx # Shimmer loading UI
│       └── PageHero.tsx     # Page hero section
├── lib/
│   └── api.ts               # All backend API calls
├── tailwind.config.ts       # Custom color/font/animation tokens
├── vercel.json              # Vercel deployment config
└── .env.local.example       # Environment variable template
```

---

## Color Palette

| Token | Value | Usage |
|---|---|---|
| `bg` | `#07070E` | Page background |
| `surface` | `#0D0D1A` | Cards |
| `elevated` | `#12121F` | Inner cards |
| `accent` | `#6C5CE7` | Primary brand purple |
| `accent-light` | `#A29BFE` | Highlights, links |
| `success` | `#00CEC9` | Good scores, success state |
| `warning` | `#FDCB6E` | Medium scores |
| `danger` | `#E17055` | Errors, low scores |
