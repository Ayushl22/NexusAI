# 🚀 NexusAI – AI-Powered Smart Learning Platform

> Transform PDFs into interactive learning experiences using AI-generated summaries, flashcards, quizzes, and an intelligent chat assistant.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![Vite](https://img.shields.io/badge/Vite-Frontend-purple?logo=vite)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📖 Overview

**NexusAI** is an AI-powered learning platform that enables students and professionals to convert PDF documents into interactive study materials.

Instead of reading lengthy documents manually, users can upload a PDF and instantly generate:

- 📝 AI-powered summaries
- 🧠 Smart flashcards
- ❓ Practice quizzes
- 💬 AI chat with the document
- 📊 Learning progress tracking

The platform uses Google's Gemini AI to understand uploaded documents and provide context-aware responses, making studying faster and more engaging.

---

# ✨ Features

### 📄 PDF Upload & Processing
- Upload PDF documents securely
- Automatic text extraction
- Intelligent document chunking
- Store uploaded documents

---

### 🤖 AI Summary Generator

Generate concise and meaningful summaries from lengthy PDFs.

- Key concepts extraction
- Easy-to-read summaries
- Context-aware AI generation

---

### 🧠 Flashcard Generator

Automatically convert document content into flashcards.

- Question & Answer format
- Interactive revision
- Faster memorization

---

### ❓ Quiz Generator

Create AI-generated quizzes instantly.

- Multiple-choice questions
- Instant scoring
- Learning assessment

---

### 💬 AI Document Chat

Ask questions directly about your uploaded document.

Examples:

> "Summarize Chapter 2"

> "Explain Neural Networks"

> "What are the key takeaways?"

The AI only answers based on the uploaded document, providing relevant and contextual responses.

---

### 👤 Authentication

- User Registration
- Secure Login
- JWT Authentication
- Protected Routes
- Cookie-based Sessions

---

### 📊 Progress Tracking

Track your learning journey.

- Saved documents
- Flashcards
- Quiz history
- Chat history

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- React Router
- Axios
- CSS

---

## Backend

- Node.js
- Express.js
- JWT Authentication
- Multer

---

## Database

- MongoDB Atlas
- Mongoose

---

## AI

- Google Gemini API

---

# 📂 Project Structure

```
NexusAI
│
├── backend
│   ├── config
│   ├── controller
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── services
│   │   └── utils
│   │
│   └── public
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/Ayushl22/NexusAI.git

cd NexusAI
```

---

## Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file inside `backend`.

```env
PORT=8000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key
```

Run backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on

```
http://localhost:5173
```

Backend runs on

```
http://localhost:8000
```

---

# 🔄 Workflow

```text
User Uploads PDF
        │
        ▼
Extract PDF Text
        │
        ▼
Chunk Document
        │
        ▼
Gemini AI Processing
        │
        ├────────► Summary
        │
        ├────────► Flashcards
        │
        ├────────► Quiz
        │
        └────────► AI Chat
```





# 🔒 Security

- JWT Authentication
- Protected Routes
- Secure Cookies
- Environment Variables
- MongoDB Atlas
- Server-side Validation

---

# 🚀 Future Enhancements

- Voice Chat with AI
- Dark Mode
- PDF Highlighting
- AI Notes
- OCR Support
- Multi-language Support
- Collaborative Study Rooms
- Export Flashcards
- Spaced Repetition System
- AI Study Planner

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create your feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit changes

```bash
git commit -m "Add new feature"
```

4. Push branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# ⭐ Show Your Support

If you found this project useful, consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates further development.

---

# 👨‍💻 Author

**Ayush Lambat**

- GitHub: https://github.com/Ayushl22

---

## 📜 License

This project is licensed under the MIT License.
