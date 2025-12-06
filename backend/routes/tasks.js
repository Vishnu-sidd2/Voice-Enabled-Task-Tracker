import express from "express"
import Task from "../models/Task.js"

const router = express.Router()

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const { status, priority, search } = req.query
    const filter = {}

    if (status) {
      filter.status = status
    }
    if (priority) {
      filter.priority = priority
    }
    if (search) {
      filter.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 })
    res.json({ success: true, data: tasks })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Get single task
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" })
    }
    res.json({ success: true, data: task })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Create task
router.post("/", async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, transcript } = req.body

    if (!title || title.trim() === "") {
      return res.status(400).json({ success: false, message: "Title is required" })
    }

    const task = new Task({
      title,
      description,
      status,
      priority,
      dueDate,
      transcript,
    })

    await task.save()
    res.status(201).json({ success: true, data: task })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// Update task
router.put("/:id", async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body

    if (title && title.trim() === "") {
      return res.status(400).json({ success: false, message: "Title cannot be empty" })
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, dueDate, updatedAt: new Date() },
      { new: true, runValidators: true },
    )

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" })
    }

    res.json({ success: true, data: task })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// Delete task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" })
    }
    res.json({ success: true, message: "Task deleted successfully" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
