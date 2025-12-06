import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import taskRoutes from "./routes/tasks.js"
import voiceRoutes from "./routes/voice.js"

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/task-tracker")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err))

// Routes
app.use("/api/tasks", taskRoutes)
app.use("/api/voice", voiceRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server running" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
