# 🚀 NexusAI – AI-Powered Smart Learning Platform

> **Turn static PDF documents into interactive learning experiences with AI-powered summaries, flashcards, quizzes, and intelligent document chat.**

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-API-000000?logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini-AI-4285F4?logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Nginx-Frontend_Server-009639?logo=nginx&logoColor=white" />
</p>

---

## 📌 About NexusAI

**NexusAI** is a full-stack AI-powered learning platform designed to make studying from lengthy PDF documents faster, smarter, and more interactive.

Instead of manually reading an entire document, users can upload a PDF and use artificial intelligence to interact with its content.

NexusAI can automatically generate:

- 📝 Concise document summaries
- 🧠 AI-generated flashcards
- ❓ Interactive quizzes
- 💬 Context-aware document conversations
- 📚 Organized learning resources
- 📊 Learning-related data for registered users

The application integrates **Google Gemini AI** with a modern **MERN-based architecture** and is fully containerized using **Docker and Docker Compose**.

---

# ✨ Key Features

## 📄 PDF Upload & Processing

Upload PDF documents and transform them into structured learning content.

### Capabilities

- Secure PDF uploads
- Automatic text extraction
- Document content processing
- Intelligent text chunking
- Uploaded document management
- AI-ready document preparation

---

## 🤖 AI-Powered Summaries

NexusAI can analyze lengthy PDF documents and generate concise summaries.

### Benefits

- Quickly understand large documents
- Extract important concepts
- Reduce reading time
- Generate context-aware summaries
- Improve revision efficiency

---

## 🧠 Smart Flashcards

Automatically transform document content into question-and-answer flashcards.

Flashcards help users:

- Revise important concepts
- Improve memorization
- Recall information faster
- Prepare for examinations
- Perform quick revision sessions

---

## ❓ AI Quiz Generator

Generate quizzes directly from uploaded learning material.

### Quiz functionality includes

- AI-generated questions
- Multiple-choice questions
- Knowledge testing
- Instant evaluation
- Interactive learning

This allows users to assess how well they understand the uploaded document.

---

## 💬 AI Document Chat

NexusAI provides an intelligent conversational interface for interacting directly with uploaded documents.

Users can ask questions such as:

> **"Summarize this document."**

> **"Explain this concept in simple terms."**

> **"What are the important points from Chapter 3?"**

> **"Generate revision questions from this topic."**

> **"What are the main conclusions of this document?"**

The document content is provided as context to the AI, allowing NexusAI to generate relevant and contextual responses.

---

## 🔐 User Authentication

NexusAI includes a secure authentication system for managing users.

### Authentication features

- User registration
- User login
- JWT-based authentication
- Protected routes
- Authorization middleware
- Secure password handling
- Cookie/session support
- User-specific resources

---

## 📚 User Learning Workspace

Registered users can access and manage their learning resources from a personalized environment.

This allows the platform to associate documents and generated learning material with individual users.

---

# 🛠️ Technology Stack

## 🎨 Frontend

| Technology | Purpose |
|---|---|
| React.js | User interface development |
| Vite | Frontend development and build tool |
| React Router | Client-side navigation |
| Axios | Backend API communication |
| CSS | Styling and responsive UI |

---

## ⚙️ Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API and backend framework |
| Multer | PDF/file upload handling |
| JWT | Authentication |
| dotenv | Environment variable management |
| CORS | Cross-origin request handling |

---

## 🗄️ Database

| Technology | Purpose |
|---|---|
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB object modelling |

---

## 🧠 Artificial Intelligence

| Technology | Purpose |
|---|---|
| Google Gemini API | AI content generation and document interaction |

Gemini is used for tasks such as:

- Document understanding
- Summary generation
- Flashcard generation
- Quiz generation
- Context-aware AI responses

---

## 🐳 DevOps & Containerization

| Technology | Purpose |
|---|---|
| Docker | Application containerization |
| Docker Compose | Multi-container application management |
| Nginx | Serving the production React frontend |

---

# 🏗️ System Architecture

```text
                        ┌───────────────────────┐
                        │        USER           │
                        │      Web Browser      │
                        └───────────┬───────────┘
                                    │
                                    ▼
                         http://localhost:3000
                                    │
                                    ▼
                   ┌──────────────────────────────┐
                   │     FRONTEND CONTAINER       │
                   │                              │
                   │        React + Vite          │
                   │           Nginx              │
                   │                              │
                   │          Port 80             │
                   └──────────────┬───────────────┘
                                  │
                                  │ REST API
                                  ▼
                         http://localhost:8000
                                  │
                                  ▼
                   ┌──────────────────────────────┐
                   │      BACKEND CONTAINER       │
                   │                              │
                   │      Node.js + Express       │
                   │                              │
                   │         Port 8000            │
                   └──────────┬─────────┬─────────┘
                              │         │
                     ┌────────┘         └───────────┐
                     ▼                              ▼
           ┌──────────────────┐          ┌──────────────────┐
           │  MongoDB Atlas   │          │  Google Gemini   │
           │                  │          │       API        │
           │ Users/Documents  │          │                  │
           │ Application Data │          │ AI Processing    │
           └──────────────────┘          └──────────────────┘
```

---

# 🔄 Application Workflow

```text
                 User Registers / Logs In
                           │
                           ▼
                    Upload PDF File
                           │
                           ▼
                   Extract PDF Text
                           │
                           ▼
                    Process Content
                           │
                           ▼
                    Chunk Document
                           │
                           ▼
                 Google Gemini AI
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
         Summary       Flashcards       Quiz
             │             │             │
             └─────────────┼─────────────┘
                           │
                           ▼
                    Document Chat
                           │
                           ▼
                  Interactive Learning
```

---

# 📂 Project Structure

```text
NexusAI/
│
├── backend/
│   │
│   ├── config/
│   │   └── Database and application configuration
│   │
│   ├── controller/
│   │   └── Application business logic
│   │
│   ├── middleware/
│   │   └── Authentication and request middleware
│   │
│   ├── models/
│   │   └── Mongoose database models
│   │
│   ├── routes/
│   │   └── Express API routes
│   │
│   ├── uploads/
│   │   └── Uploaded PDF files
│   │
│   ├── utils/
│   │   └── Utility functions and AI helpers
│   │
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yaml
├── .gitignore
└── README.md
```

---

# ⚙️ Environment Variables

Environment variables are used to keep sensitive information outside the source code.

Create a `.env` file inside the `backend` directory.

```env
PORT=8000

MONGO_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_google_gemini_api_key
```

Your project may contain additional environment variables depending on configuration.

> ⚠️ **Never push your `.env` file, API keys, database credentials, or JWT secrets to GitHub.**

The `.env` file should remain inside `.gitignore`.

---

# 🚀 Running NexusAI

NexusAI can be started in two different ways:

1. Using Docker
2. Running the frontend and backend manually

---

# 🐳 Method 1 – Run Using Docker

Docker is the recommended way to run the complete application.

## Prerequisites

Install:

- Docker Desktop
- Git

You do **not** need to manually install Node.js dependencies when running through Docker.

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Ayushl22/NexusAI.git
```

Move into the project directory:

```bash
cd NexusAI
```

---

## 2️⃣ Configure Environment Variables

Create:

```text
backend/.env
```

Add the required environment variables:

```env
PORT=8000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

---

## 3️⃣ Build Docker Images

```bash
docker compose build
```

Docker creates two application images:

```text
nexusai-frontend
nexusai-backend
```

---

## 4️⃣ Start the Application

```bash
docker compose up
```

Or run it in the background:

```bash
docker compose up -d
```

---

## 5️⃣ Open NexusAI

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:8000
```

---

## 6️⃣ Verify Running Containers

```bash
docker ps
```

You should see:

```text
nexusai-frontend
nexusai-backend
```

---

## 7️⃣ Stop the Application

```bash
docker compose down
```

---

## 🔄 Rebuild After Code Changes

After modifying the frontend or backend source code:

```bash
docker compose up --build -d
```

This rebuilds the Docker images and starts the updated application.

---

## 📜 View Docker Logs

View all logs:

```bash
docker compose logs
```

Backend logs:

```bash
docker compose logs -f backend
```

Frontend logs:

```bash
docker compose logs -f frontend
```

---

# 💻 Method 2 – Run Without Docker

The application can also be run directly using Node.js.

## Prerequisites

Install:

- Node.js
- npm
- Git

---

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Ayushl22/NexusAI.git
```

```bash
cd NexusAI
```

---

## 2️⃣ Backend Setup

Open the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create:

```text
backend/.env
```

Configure:

```env
PORT=8000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Start the development server:

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:8000
```

---

## 3️⃣ Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start Vite:

```bash
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

---

# 🌐 API Communication

The frontend communicates with the backend through:

```text
http://localhost:8000
```

The frontend API configuration uses:

```javascript
export const BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000";
```

When Docker builds the frontend, the backend URL is supplied using the `VITE_API_URL` build argument.

---

# 🐳 Docker Architecture

The project contains two Docker containers.

## Frontend Container

```text
React
   │
   ▼
Vite Production Build
   │
   ▼
Nginx
   │
   ▼
Port 3000
```

The React application is compiled into a production build and served through **Nginx**.

---

## Backend Container

```text
Node.js
   │
   ▼
Express.js
   │
   ▼
REST APIs
   │
   ▼
Port 8000
```

The backend connects externally to:

```text
MongoDB Atlas
Google Gemini API
```

MongoDB is therefore **not required as a separate local Docker container**.

---

# 🔒 Security

NexusAI follows several practices for application security.

- JWT-based authentication
- Protected backend routes
- Authentication middleware
- Environment variables for secrets
- Server-side validation
- Controlled CORS configuration
- Secure database connection
- MongoDB Atlas authentication
- Sensitive credentials excluded from Git
- Docker environment configuration

---

# 🔑 API & Secret Management

The following information must never be committed to the repository:

```text
MongoDB passwords
MongoDB connection URI
Gemini API keys
JWT secrets
Authentication secrets
.env files
```

Example `.gitignore` configuration:

```gitignore
backend/.env
frontend/.env
frontend/.env.*
node_modules/
**/node_modules/
dist/
**/dist/
```

---

# 💡 Why NexusAI?

Traditional PDF learning often involves:

```text
Read PDF
   ↓
Manually identify important content
   ↓
Create notes
   ↓
Create questions
   ↓
Create flashcards
   ↓
Revise
```

NexusAI transforms this process into:

```text
Upload PDF
    ↓
AI understands content
    ↓
 ┌──┴────┬──────────┬──────────┐
 ▼       ▼          ▼          ▼
Summary Flashcards Quiz      AI Chat
 └───────┴──────────┴──────────┘
                ↓
       Faster Smart Learning
```

The goal is not simply to read documents using AI, but to turn documents into an **interactive study environment**.

---

# 🎯 Use Cases

NexusAI can be useful for:

### 🎓 Students

- Exam preparation
- Lecture notes revision
- Learning from textbooks
- Creating practice questions
- Understanding difficult concepts

### 👨‍💻 Professionals

- Reading technical reports
- Summarizing documentation
- Reviewing research papers
- Learning from training material

### 🔬 Researchers

- Understanding papers
- Extracting important information
- Quickly reviewing long documents

---

# 🚀 Future Enhancements

Future versions of NexusAI can include:

- 🎙️ Voice-based AI interaction
- 🌙 Dark mode
- 🖍️ PDF highlighting
- 📝 AI-generated notes
- 👁️ OCR for scanned PDFs
- 🌍 Multi-language document support
- 👥 Collaborative study rooms
- 📤 Exportable flashcards
- 🧠 Spaced repetition
- 📅 AI-powered study planner
- 📈 Advanced progress analytics
- 🔔 Smart revision reminders
- 📱 Mobile application support
- ☁️ Cloud deployment
- 🔎 Semantic document search
- 📚 Multiple-document AI chat

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

### 1. Fork the repository

### 2. Clone your fork

```bash
git clone https://github.com/YOUR_USERNAME/NexusAI.git
```

### 3. Create a new branch

```bash
git checkout -b feature/new-feature
```

### 4. Make your changes

### 5. Commit the changes

```bash
git add .
git commit -m "Add new feature"
```

### 6. Push the branch

```bash
git push origin feature/new-feature
```

### 7. Create a Pull Request

Open the repository on GitHub and create a pull request describing your changes.

---

# 🐛 Issues & Feedback

If you encounter a bug or have an idea for improving NexusAI, feel free to open an issue in the GitHub repository.

When reporting an issue, try to include:

- Description of the problem
- Steps to reproduce it
- Expected behavior
- Actual behavior
- Relevant screenshots or logs

---

# ⭐ Support the Project

If you find **NexusAI** useful or interesting, consider giving the repository a ⭐.

It helps others discover the project and supports further development.

---

# 👨‍💻 Author

### Ayush Lambat

GitHub:

https://github.com/Ayushl22

Project Repository:

https://github.com/Ayushl22/NexusAI

---

# 📜 License

This project is licensed under the **MIT License**.

You are free to use, modify, and distribute the project according to the terms of the license.

---

<p align="center">
  <b>Built with React, Node.js, MongoDB, Gemini AI and Docker 🐳</b>
</p>

<p align="center">
  <b>NexusAI — Turning Documents into Interactive Learning Experiences.</b>
</p>
