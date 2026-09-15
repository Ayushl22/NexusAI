<div align="center">

# 🚀 NexusAI

### AI-Powered Smart Learning Platform

*Turn static PDF documents into interactive learning experiences.*

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white&style=flat-square)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white&style=flat-square)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-API-000000?logo=express&logoColor=white&style=flat-square)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white&style=flat-square)](https://www.mongodb.com/atlas)
[![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google&logoColor=white&style=flat-square)](https://ai.google.dev/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&logoColor=white&style=flat-square)](https://www.docker.com/)
[![Nginx](https://img.shields.io/badge/Nginx-Frontend_Server-009639?logo=nginx&logoColor=white&style=flat-square)](https://nginx.org/)

</div>

---

## About NexusAI

**NexusAI** is a full-stack AI-powered learning platform that turns lengthy PDF documents into something you can actually study *with*, not just read.

Instead of scrolling through pages manually pulling out what matters, you upload a PDF and let AI do the first pass — summarizing it, generating flashcards and quizzes from it, and answering questions about it directly. It's built on a modern **MERN stack**, powered by **Google Gemini**, and ships fully containerized with **Docker Compose**.

| Traditional PDF studying | With NexusAI |
|---|---|
| Read the whole document start to finish | Get a concise AI-generated summary first |
| Manually write your own flashcards | Flashcards generated automatically from content |
| Guess what might be tested | AI-generated quizzes based on the actual material |
| Re-read sections to find an answer | Ask the document directly and get a contextual answer |
| Notes live in a separate app | Everything stays attached to the source document |

## Core Features

### 📄 PDF Upload & Processing
Secure PDF uploads with automatic text extraction, intelligent chunking, and document management — the AI-ready foundation everything else builds on.

### 🤖 AI-Powered Summaries
Condenses lengthy documents into their key concepts, cutting review time without losing the important substance.

### 🧠 Smart Flashcards
Converts document content into question-and-answer flashcards automatically, built for memorization and quick recall.

### ❓ AI Quiz Generator
Generates multiple-choice quizzes straight from the uploaded material with instant evaluation, so you can test understanding rather than assume it.

### 💬 AI Document Chat
A conversational interface scoped to the document itself — the content is passed to Gemini as context, so answers stay grounded in what was actually uploaded. Typical questions:

- *"Summarize this document."*
- *"Explain this concept in simple terms."*
- *"What are the important points from Chapter 3?"*
- *"Generate revision questions from this topic."*

### 🔐 Authentication & Workspace
JWT-based registration and login, protected routes, and a personal workspace that keeps every user's documents and generated material scoped to their own account.

## Architecture

```
                        ┌───────────────────────┐
                        │         USER           │
                        │      Web Browser        │
                        └───────────┬───────────┘
                                    │
                                    ▼
                         http://localhost:3000
                                    │
                                    ▼
                   ┌──────────────────────────────┐
                   │      FRONTEND CONTAINER       │
                   │        React + Vite           │
                   │            Nginx              │
                   │           Port 80             │
                   └──────────────┬───────────────┘
                                  │  REST API
                                  ▼
                         http://localhost:8000
                                  │
                   ┌──────────────────────────────┐
                   │      BACKEND CONTAINER        │
                   │      Node.js + Express        │
                   │           Port 8000           │
                   └──────────┬─────────┬─────────┘
                              │         │
                     ┌────────┘         └───────────┐
                     ▼                              ▼
           ┌──────────────────┐          ┌──────────────────┐
           │  MongoDB Atlas    │          │  Google Gemini   │
           │  Users / Documents │          │       API        │
           │  Application Data │          │  AI Processing   │
           └──────────────────┘          └──────────────────┘
```

The frontend never talks to MongoDB or Gemini directly — every request goes through the Express API, which keeps credentials server-side and gives the system one clear boundary for auth and validation.

## How It Works

```
User Registers / Logs In
          │
          ▼
    Upload PDF File
          │
          ▼
   Extract PDF Text
          │
          ▼
    Process & Chunk
          │
          ▼
   Google Gemini AI
          │
   ┌──────┼──────┬──────────┐
   ▼      ▼      ▼          ▼
Summary Flashcards Quiz   Document Chat
   └──────┴──────┴──────────┘
              │
              ▼
     Interactive Learning
```

1. A user uploads a PDF, which is stored and processed on the backend.
2. Text is extracted and split into chunks sized for reliable AI processing.
3. Those chunks are sent to Gemini to generate a summary, flashcards, and a quiz on request.
4. The same document context powers a chat interface, so follow-up questions stay grounded in the source material.
5. All generated content is tied back to the user's account and the originating document.

## Tech Stack

**Frontend**

| Technology | Purpose |
|---|---|
| React.js | User interface |
| Vite | Dev server & build tool |
| React Router | Client-side navigation |
| Axios | Backend API communication |
| CSS | Styling and responsive layout |

**Backend**

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| Multer | PDF/file upload handling |
| JWT | Authentication |
| dotenv | Environment configuration |
| CORS | Cross-origin request handling |

**Database**

| Technology | Purpose |
|---|---|
| MongoDB Atlas | Cloud-hosted database |
| Mongoose | Schema modelling for MongoDB |

**AI**

| Technology | Purpose |
|---|---|
| Google Gemini API | Summaries, flashcards, quizzes, document chat |

**Infrastructure**

| Technology | Purpose |
|---|---|
| Docker | Application containerization |
| Docker Compose | Multi-container orchestration |
| Nginx | Serves the production React build |

## Project Structure

```
NexusAI/
│
├── backend/
│   ├── config/          # Database and app configuration
│   ├── controller/      # Business logic
│   ├── middleware/      # Auth and request middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express route definitions
│   ├── uploads/         # Uploaded PDF files
│   ├── utils/           # Utility functions and AI helpers
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yaml
├── .gitignore
└── README.md
```

## Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=8000

MONGODB_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_google_gemini_api_key
```

> ⚠️ **Never commit your `.env` file, API keys, database credentials, or JWT secrets to GitHub.** Keep `.env` in `.gitignore`.

## Getting Started

NexusAI can run either through Docker (recommended) or manually with Node.js.

### Method 1 — Docker

**Prerequisites:** Docker Desktop, Git

```bash
# 1. Clone
git clone https://github.com/Ayushl22/NexusAI.git
cd NexusAI

# 2. Configure environment
#    create backend/.env with the variables listed above

<<<<<<< HEAD
## 2️⃣ Configure Environment Variables

Create:

```text
backend/.env
```

Add the required environment variables:

```env
PORT=8000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

---

## 3️⃣ Build Docker Images

```bash
=======
# 3. Build images
>>>>>>> 81e5160f1f447f1f4f5039937752132f682dba94
docker compose build

# 4. Start the application
docker compose up -d

# 5. Verify containers are running
docker ps
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:8000 |

Stop everything with:

```bash
docker compose down
```

Rebuild after code changes:

```bash
docker compose up --build -d
```

View logs:

```bash
docker compose logs -f backend
docker compose logs -f frontend
```

### Method 2 — Without Docker

**Prerequisites:** Node.js, npm, Git

```bash
git clone https://github.com/Ayushl22/NexusAI.git
cd NexusAI
```

**Backend**

```bash
cd backend
npm install
<<<<<<< HEAD
```

Create:

```text
backend/.env
```

Configure:

```env
PORT=8000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Start the development server:

```bash
=======
# create backend/.env with the variables listed above
>>>>>>> 81e5160f1f447f1f4f5039937752132f682dba94
npm run dev
```
Runs at `http://localhost:8000`.

**Frontend**

```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:5173`.

## API Communication

The frontend talks to the backend over a single configurable base URL:

```javascript
const configuredApiUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
export const BASE_URL = configuredApiUrl ||
    (import.meta.env.DEV ? "http://localhost:8000" : "");
```

When Docker builds the frontend image, `VITE_API_URL` is supplied as a build argument, so the production bundle points at the correct backend without code changes.

<<<<<<< HEAD
For a combined Vercel deployment, leave `VITE_API_URL` unset so the browser
uses same-origin `/api` requests. See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
for the complete deployment and environment setup.

---
=======
## Docker Architecture
>>>>>>> 81e5160f1f447f1f4f5039937752132f682dba94

**Frontend container:** React is compiled into a production build and served through Nginx on port 3000.

**Backend container:** Node.js + Express serves the REST API on port 8000, and connects externally to MongoDB Atlas and the Gemini API — no MongoDB container is required locally.

## Security

- JWT-based authentication with protected routes
- Authentication middleware on sensitive endpoints
- Secrets kept in environment variables, never in source
- Server-side request validation
- Controlled CORS configuration
- MongoDB Atlas authentication for database access
- Sensitive credentials excluded from Git via `.gitignore`

```gitignore
backend/.env
frontend/.env
frontend/.env.*
node_modules/
**/node_modules/
dist/
**/dist/
```

## Use Cases

**Students** — exam prep, lecture notes revision, practice questions, breaking down difficult concepts.

**Professionals** — summarizing technical reports and documentation, reviewing training material.

**Researchers** — digesting papers quickly and extracting the information that matters.


## Contributing

Contributions, suggestions, and improvements are welcome.

```bash
# 1. Fork the repository, then clone your fork
git clone https://github.com/YOUR_USERNAME/NexusAI.git

# 2. Create a branch
git checkout -b feature/new-feature

# 3. Make your changes, then commit
git add .
git commit -m "Add new feature"

# 4. Push and open a pull request
git push origin feature/new-feature
```

## Issues & Feedback

Found a bug or have an idea? Open an issue and include a description of the problem, steps to reproduce it, expected vs. actual behavior, and any relevant logs or screenshots.

## Author

**Ayush Lambat**

[GitHub](https://github.com/Ayushl22) · [Project Repository](https://github.com/Ayushl22/NexusAI)

## License

Licensed under the **MIT License** — free to use, modify, and distribute per the license terms.

---

<div align="center">

*NexusAI — turning documents into interactive learning experiences.*

</div>
