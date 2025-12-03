# Voice Task Tracker

A full-stack task management application with **intelligent voice input parsing** powered by **Groq AI (Llama 3)**. Built with React (frontend), Node.js/Express (backend), and MongoDB (database).

## ✨ Features

- **🎙️ Intelligent Voice Input**: Speak naturally to create tasks. The system uses **Groq AI** to extract:
    - **Title**: The main task action.
    - **Priority**: Detects keywords like "urgent", "ASAP" (sets to High).
    - **Due Date & Time**: Understands "tomorrow at 4 PM", "next Friday morning".
    - **Status**: Defaults to "To Do", or sets "In Progress" if specified.
- **🎨 Premium Dark UI**: A modern, glassmorphic design with smooth animations and gradients.
- **📋 Kanban Board**: Drag-and-drop tasks between "To Do", "In Progress", and "Done".
- **📝 List View**: A detailed list view for managing many tasks.
- **🔍 Smart Search & Filter**: Find tasks instantly by status, priority, or text.
- **⚡ Real-time Updates**: Optimistic UI updates for a snappy experience.

## 🚀 Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file in the `backend` folder:
   ```env
   MONGODB_URI=mongodb://localhost:27017/task-tracker
   PORT=5000
   GROQ_API_KEY=your_groq_api_key_here
   ```
   > **Note**: Get your free API key from [Groq Console](https://console.groq.com/).

3. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000` in your browser.

## 🏗️ Project Structure

### Backend
```
backend/
├── server.js              # Express server entry point
├── routes/
│   ├── tasks.js           # Task CRUD endpoints
│   └── voice.js           # Voice parsing endpoint
├── models/
│   └── Task.js            # Mongoose schema (Title, Priority, Date, etc.)
├── services/
│   └── voiceParser.js     # Groq AI integration logic
└── package.json
```

### Frontend
```
frontend/
├── src/
│   ├── components/
│   │   ├── TaskBoard.jsx      # Drag-and-drop Kanban board
│   │   ├── TaskList.jsx       # Card-based list view
│   │   ├── TaskCard.jsx       # Individual task component
│   │   ├── TaskModal.jsx      # Create/Edit form
│   │   ├── VoiceInput.jsx     # Web Speech API recorder
│   │   └── VoicePreview.jsx   # AI result preview modal
│   ├── styles/                # Premium dark mode CSS
│   ├── App.jsx                # Main layout
│   └── main.jsx               # Entry point
└── vite.config.js
```

## 🔌 API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Voice
- `POST /api/voice/parse` - Sends transcript to Groq AI for parsing

## 🛠️ Technologies Used

- **Frontend**: React 18, Vite, @dnd-kit (Drag & Drop)
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **AI / NLP**: Groq SDK (Llama 3 8b)
- **Voice**: Web Speech API (Native Browser Support)

## 📝 Notes

- **Time Extraction**: The system now supports full date-time extraction (e.g., "Dec 4, 4:00 PM").
- **Drag & Drop**: Uses `pointerWithin` detection for accurate column dropping.
