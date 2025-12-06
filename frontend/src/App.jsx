"use client"

import { useState, useEffect } from "react"
import TaskBoard from "./components/TaskBoard"
import TaskList from "./components/TaskList"
import VoiceInput from "./components/VoiceInput"
import TaskModal from "./components/TaskModal" // Assuming TaskModal is a new component to be used
import "./App.css"

function App() {
  const [tasks, setTasks] = useState([])
  const [view, setView] = useState("board") // 'board' or 'list'
  const [filters, setFilters] = useState({ status: "", priority: "", search: "" })
  const [loading, setLoading] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)

  const API_BASE_URL = "http://localhost:5000/api"

  // Fetch all tasks
  const fetchTasks = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.status) params.append("status", filters.status)
      if (filters.priority) params.append("priority", filters.priority)
      if (filters.search) params.append("search", filters.search)

      const response = await fetch(`${API_BASE_URL}/tasks?${params}`)
      const result = await response.json()

      if (result.success) {
        setTasks(result.data)
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTaskFromVoice = async (parsedData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData),
      })

      const result = await response.json()

      if (result.success) {
        fetchTasks()
      }
    } catch (error) {
      console.error("Error creating task:", error)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [filters])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Voice Task Tracker</h1>
        <div className="header-actions">
          <button className="create-task-btn" onClick={() => setShowTaskForm(true)}>
            + New Task
          </button>
          <div className="view-toggle">
            <button className={`toggle-btn ${view === "board" ? "active" : ""}`} onClick={() => setView("board")}>
              Board
            </button>
            <button className={`toggle-btn ${view === "list" ? "active" : ""}`} onClick={() => setView("list")}>
              List
            </button>
          </div>
        </div>
      </header>

      <div className="app-controls">
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="search-input"
        />

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className="filter-select"
        >
          <option value="">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <main className="app-main">
        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : view === "board" ? (
          <TaskBoard tasks={tasks} onTaskUpdate={fetchTasks} API_BASE_URL={API_BASE_URL} />
        ) : (
          <TaskList tasks={tasks} onTaskUpdate={fetchTasks} API_BASE_URL={API_BASE_URL} />
        )}
      </main>

      {showTaskForm && (
        <TaskModal
          task={null}
          isNewTask={true}
          onClose={() => setShowTaskForm(false)}
          onSave={() => {
            fetchTasks()
            setShowTaskForm(false)
          }}
          API_BASE_URL={API_BASE_URL}
        />
      )}

      <VoiceInput onCreateTask={handleCreateTaskFromVoice} API_BASE_URL={API_BASE_URL} />
    </div>
  )
}

export default App
