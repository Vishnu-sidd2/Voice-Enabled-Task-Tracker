# 🎙️ Voice Task Tracker

A full-stack task management application with **intelligent voice input parsing** powered by **Groq AI (Llama 3.3 70B)**. Built with React (frontend), Node.js/Express (backend), and MongoDB (database).

---

## ✨ Features

### 🎤 Intelligent Voice Input
Speak naturally to create tasks. The system uses **Groq AI** with advanced prompt engineering to extract:
- **Title**: Automatically extracts the core action, removing filler words like "remind me to", "please", etc.
- **Priority**: Detects keywords like "urgent", "ASAP", "important" (sets to High), or "low priority", "whenever" (sets to Low)
- **Due Date & Time**: Understands relative dates like:
  - "tomorrow at 4 PM"
  - "next Friday morning"
  - "next Thursday" (correctly calculates from current day)
  - Absolute dates like "December 15" or "Jan 20th"
- **Status**: Defaults to "To Do", or detects "in progress", "mark as done", etc.

### 🎨 Premium UI/UX
- **Dark Mode Design**: Modern glassmorphic cards with smooth gradients
- **Drag & Drop Kanban**: Visual board with "To Do", "In Progress", and "Done" columns
- **List View**: Detailed card-based list for managing many tasks
- **Smart Filters**: Filter by status, priority, or search text
- **Responsive Design**: Works on desktop, tablet, and mobile

### ⚡ Performance
- **Optimistic UI Updates**: Instant feedback on all actions
- **Real-time Validation**: Voice input preview before creating tasks
- **Comprehensive Debugging**: Full logging system for troubleshooting

---

## 🚀 Project Setup

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **MongoDB**: v6.0 or higher (running locally or cloud instance)
- **Groq API Key**: Get free key from [Groq Console](https://console.groq.com/)
- **Modern Browser**: Chrome, Firefox, or Edge (for Web Speech API support)

### Installation Steps

#### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd voice-task-tracker
```

#### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/task-tracker
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-tracker

# Server Configuration
PORT=5000
NODE_ENV=development

# Groq AI Configuration
GROQ_API_KEY=your_groq_api_key_here
```

> **Getting Your Groq API Key:**
> 1. Visit [console.groq.com](https://console.groq.com/)
> 2. Sign up for a free account
> 3. Navigate to API Keys section
> 4. Create a new API key
> 5. Copy and paste into `.env` file

Start the backend server:

```bash
npm run dev
```

The server will start on `http://localhost:5000`

#### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder (optional):

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

#### 4. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Or run manually
mongod --dbpath /path/to/data/directory
```

**Option B: MongoDB Atlas (Cloud)**
1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in backend `.env`

#### 5. Seed Data (Optional)

To populate with sample tasks:

```bash
cd backend
node scripts/seedTasks.js
```

---

## 🏗️ Project Structure

```
voice-task-tracker/
├── backend/
│   ├── server.js                 # Express server entry point
│   ├── routes/
│   │   ├── tasks.js              # Task CRUD endpoints
│   │   └── voice.js              # Voice parsing endpoint
│   ├── models/
│   │   └── Task.js               # Mongoose schema
│   ├── services/
│   │   └── voiceParser.js        # Groq AI integration with debugging
│   ├── debug.log                 # Auto-generated debug logs
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskBoard.jsx     # Drag-and-drop Kanban board
│   │   │   ├── TaskList.jsx      # Card-based list view
│   │   │   ├── TaskCard.jsx      # Individual task component
│   │   │   ├── TaskModal.jsx     # Create/Edit task form
│   │   │   ├── VoiceInput.jsx    # Web Speech API recorder
│   │   │   ├── VoicePreview.jsx  # AI parsing result preview
│   │   │   ├── Filters.jsx       # Search and filter controls
│   │   │   └── Header.jsx        # App header with actions
│   │   ├── styles/
│   │   │   ├── global.css        # Global styles and variables
│   │   │   ├── TaskBoard.css     # Board-specific styles
│   │   │   └── TaskCard.css      # Card animations
│   │   ├── api/
│   │   │   └── taskApi.js        # API client functions
│   │   ├── hooks/
│   │   │   └── useTasks.js       # Task management hook
│   │   ├── App.jsx               # Main application component
│   │   └── main.jsx              # React entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2**: UI framework with hooks
- **Vite 5**: Fast build tool and dev server
- **@dnd-kit**: Modern drag-and-drop library
- **Lucide React**: Icon library
- **Web Speech API**: Native browser voice recognition

### Backend
- **Node.js 18+**: Runtime environment
- **Express 4.18**: Web framework
- **Mongoose 8.0**: MongoDB ODM
- **Groq SDK 0.3**: AI model integration
- **dotenv**: Environment configuration
- **CORS**: Cross-origin resource sharing

### Database
- **MongoDB 6.0**: NoSQL document database

### AI & NLP
- **Groq Cloud**: Ultra-fast AI inference
- **Llama 3.3 70B Versatile**: Language model for parsing
- **Custom Prompt Engineering**: Date calculation and entity extraction

### Development Tools
- **Nodemon**: Auto-reload for backend
- **ESLint**: Code linting
- **Prettier**: Code formatting

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Get All Tasks

**Request:**
```http
GET /api/tasks
```

**Query Parameters:**
- `status` (optional): Filter by status ("To Do", "In Progress", "Done")
- `priority` (optional): Filter by priority ("Low", "Medium", "High")

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Call client about project",
      "description": "Remind me to call client next Thursday at 2pm",
      "priority": "High",
      "status": "To Do",
      "dueDate": "2025-12-11T14:00:00.000Z",
      "transcript": "Remind me to call client next Thursday at 2pm",
      "createdAt": "2025-12-06T10:30:00.000Z",
      "updatedAt": "2025-12-06T10:30:00.000Z"
    }
  ]
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Database connection error"
}
```

---

#### 2. Create Task

**Request:**
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Get milk, eggs, and bread",
  "priority": "Medium",
  "status": "To Do",
  "dueDate": "2025-12-07T18:00:00.000Z"
}
```

**Required Fields:**
- `title` (string, min 1 char)

**Optional Fields:**
- `description` (string)
- `priority` (enum: "Low", "Medium", "High", default: "Medium")
- `status` (enum: "To Do", "In Progress", "Done", default: "To Do")
- `dueDate` (ISO 8601 date string)
- `transcript` (string, original voice input)

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Buy groceries",
    "description": "Get milk, eggs, and bread",
    "priority": "Medium",
    "status": "To Do",
    "dueDate": "2025-12-07T18:00:00.000Z",
    "createdAt": "2025-12-06T10:35:00.000Z",
    "updatedAt": "2025-12-06T10:35:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Title is required"
}
```

---

#### 3. Update Task

**Request:**
```http
PUT /api/tasks/:id
Content-Type: application/json

{
  "status": "In Progress",
  "priority": "High"
}
```

**URL Parameters:**
- `id` (string, required): MongoDB ObjectId

**Body:** Any task fields to update

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Buy groceries",
    "status": "In Progress",
    "priority": "High",
    "updatedAt": "2025-12-06T11:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

---

#### 4. Delete Task

**Request:**
```http
DELETE /api/tasks/:id
```

**URL Parameters:**
- `id` (string, required): MongoDB ObjectId

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

---

#### 5. Parse Voice Input

**Request:**
```http
POST /api/voice/parse
Content-Type: application/json

{
  "transcript": "Remind me to call the client next Thursday at 2pm, it's urgent"
}
```

**Required Fields:**
- `transcript` (string): Voice-to-text transcription

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "title": "Call the client",
    "description": "Remind me to call the client next Thursday at 2pm, it's urgent",
    "priority": "High",
    "status": "To Do",
    "dueDate": "2025-12-11T14:00:00.000Z",
    "transcript": "Remind me to call the client next Thursday at 2pm, it's urgent"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Transcript is required"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Groq API error: Rate limit exceeded"
}
```

---

## 🧠 Key Design Decisions & Assumptions

### Architecture Decisions

1. **Separation of Concerns**
   - Backend handles all AI/parsing logic
   - Frontend focuses on UI/UX
   - MongoDB for flexible schema evolution

2. **AI Model Choice: Llama 3.3 70B via Groq**
   - **Why Groq?** Ultra-fast inference (10x faster than traditional APIs)
   - **Why Llama 3.3 70B?** Best balance of accuracy and speed for NLP tasks
   - **Alternative Considered:** OpenAI GPT-4 (rejected due to cost and latency)

3. **Voice Input Architecture**
   - Web Speech API for transcription (free, native browser support)
   - Groq AI for intelligent parsing (context understanding)
   - Fallback parser for offline/API failures

4. **Date Calculation Strategy**
   - Pre-calculate all "next [day]" dates before sending to AI
   - Provide explicit examples in prompt to eliminate ambiguity
   - Use clear if/else logic instead of complex modulo formulas

### Data Model Decisions

**Task Schema:**
```javascript
{
  title: String (required),
  description: String,
  priority: Enum ["Low", "Medium", "High"],
  status: Enum ["To Do", "In Progress", "Done"],
  dueDate: Date (ISO 8601),
  transcript: String (original voice input),
  timestamps: true
}
```

**Why These Fields?**
- `transcript`: Preserve original input for debugging/auditing
- `dueDate`: Single field for both date and time (simplifies queries)
- `priority`: Three levels cover 90% of use cases
- `status`: Maps to Kanban columns for visual workflow

### Assumptions Made

1. **Language:** English only (can be extended with multi-language support)

2. **Time Zones:** All dates stored in UTC, displayed in user's local time

3. **Date Interpretation:**
   - "next [day]" always means the upcoming occurrence (not same-day)
   - If no time specified, defaults to 23:59:59 (end of day)
   - "tomorrow" always means the next calendar day

4. **Voice Input:**
   - Users have microphone access
   - Browser supports Web Speech API
   - Reasonable accuracy from speech recognition

5. **Priority Detection:**
   - Keywords: "urgent", "ASAP", "important" → High
   - Keywords: "low", "optional", "whenever" → Low
   - Default: Medium

6. **Status Detection:**
   - Explicitly mentioned keywords only change status
   - Default: "To Do" for all new tasks

7. **Groq API:**
   - Free tier sufficient for MVP (100 req/min)
   - Assumed stable API availability
   - Fallback parser handles API failures

8. **Browser Compatibility:**
   - Modern browsers (Chrome 33+, Firefox 49+, Edge 79+)
   - Mobile browsers with Web Speech API support

---

## 🤖 AI Tools Usage

### Tools Used During Development

I used **Claude (Anthropic)** in this project, particularly for:

#### 1. Voice Parsing Architecture & Logic

**What Claude Helped With:**
- **Date Calculation Algorithm:** Claude helped debug the original buggy formula `(4 - now.getDay() + 7) % 7 || 7` and suggested the cleaner if/else approach
- **Prompt Engineering:** Crafted the comprehensive Groq prompt with explicit examples to eliminate date ambiguity
- **Edge Case Identification:** Discovered issues like "What if today is Thursday and user says 'next Thursday'?"

**Notable Prompt Example:**
```
"My date calculation for 'next Thursday' from Saturday is giving December 12 
instead of December 11. Here's my code... why is it wrong?"
```

**Claude's Response:**
- Identified the modulo formula issue
- Suggested pre-calculating all "next [day]" dates
- Recommended adding explicit examples in the AI prompt
- Proposed the comprehensive debugging system

#### 2. Debugging System Design

**What Claude Helped With:**
- Structured logging approach with clear sections
- Error handling strategy (try/catch with graceful fallbacks)
- Debug log format with timestamps and separators

**Learning:** The importance of logging EVERY step in AI pipelines - without it, debugging "why did the AI return wrong date?" is nearly impossible.


#### 3. Frontend Component Architecture

**What Claude Helped With:**
- Drag-and-drop implementation with @dnd-kit
- State management strategies

**Key Learning:** Optimistic updates + rollback on error = better UX than loading spinners

#### 4. Prompt Engineering Iterations

Claude helped refine the Groq prompt through multiple iterations:

**Version 1 (Initial):**
```
Current Date: 2025-12-06
Parse this: "Call client next Thursday"
```
❌ Result: Inconsistent date extraction

**Version 2 (Claude's Suggestion):**
```
Today is Saturday, 2025-12-06
Examples:
- "next Thursday" means 2025-12-11
Parse this: "Call client next Thursday"
```
✅ date extraction

### What Changed Because of AI Tools

1. **Code Quality:**
   - Started with complex modulo formula → Ended with readable if/else
   - Better error messages and fallback handling

2. **Architecture:**
   - Added fallback parser (Claude suggested "what if Groq API is down?")
   - Implemented optimistic UI updates for better UX

3. **Development Speed:**
   - 3-4 hours saved on debugging date calculation logic
   - 2-3 hours saved on prompt engineering iterations

4. **Best Practices Learned:**
   - Always pre-calculate ambiguous values before sending to AI
   - Provide explicit examples in prompts (don't make AI guess)
   - Log everything in AI pipelines
   - Test edge cases thoroughly (Thursday → "next Thursday" case)

### Specific Claude Contributions

| Feature | Claude's Role | Impact |
|---------|---------------|--------|
| Date Calculation Fix | Identified bug, suggested algorithm | Critical - Core feature |
| Debugging System | Designed logging structure | High - Saved hours debugging |
| Prompt Engineering | Refined through 3 iterations | High - Improved accuracy |
| Component Structure | Reviewed and suggested improvements | Medium - Cleaner code |


**Most Valuable AI Interaction:**
The debugging session where Claude walked me through why `(4 - now.getDay() + 7) % 7` was producing unexpected results and suggested the clearer if/else approach. This single conversation saved at least 2-3 hours of trial-and-error debugging.

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Voice input recognizes speech correctly
- [ ] Date parsing handles all weekdays
- [ ] Priority keywords detected correctly
- [ ] Time extraction works (AM/PM, 24-hour)
- [ ] Drag and drop between columns
- [ ] Search filters tasks correctly
- [ ] Task CRUD operations work
- [ ] Error states display properly
- [ ] Responsive design on mobile
- [ ] Fallback parser works without Groq API

### Test Cases for Voice Input

```javascript
// Test Case 1: Basic task with date
Input: "Remind me to call John tomorrow at 3pm"
Expected: {
  title: "Call John",
  dueDate: "[tomorrow's date]T15:00:00",
  priority: "Medium"
}

// Test Case 2: Urgent task
Input: "Buy milk ASAP"
Expected: {
  title: "Buy milk",
  priority: "High",
  dueDate: null
}

// Test Case 3: Next weekday
Input: "Meeting with team next Thursday at 10am"
Expected: {
  title: "Meeting with team",
  dueDate: "2025-12-11T10:00:00",
  priority: "Medium"
}

// Test Case 4: In progress task
Input: "Start working on presentation"
Expected: {
  title: "Working on presentation",
  status: "In Progress"
}
```

---

## 🐛 Debugging

### View Debug Logs

All voice parsing operations are logged to `backend/debug.log`:

```bash
cd backend
tail -f debug.log
```

### Common Issues

**Issue:** Voice input not working
- **Fix:** Check microphone permissions in browser
- **Fix:** Ensure HTTPS or localhost (Web Speech API requirement)

**Issue:** Wrong dates being extracted
- **Fix:** Check `debug.log` for date calculations
- **Fix:** Verify system date/time is correct

**Issue:** Groq API errors
- **Fix:** Check API key in `.env`
- **Fix:** Verify API quota (free tier: 100 req/min)
- **Fix:** System will fallback to basic parser automatically

---

## 📝 License

MIT License - Feel free to use this project for learning or commercial purposes.

---

## 🙏 Acknowledgments

- **Groq** for ultra-fast AI inference
- **MongoDB** for flexible data storage
- **Anthropic Claude** for development assistance and debugging
- **React & Vite** communities for excellent documentation

---

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---
