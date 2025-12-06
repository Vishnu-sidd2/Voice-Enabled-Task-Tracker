"use client"

import { useState } from "react"
import TaskModal from "./TaskModal"
import "../styles/TaskList.css"

function TaskList({ tasks, onTaskUpdate, API_BASE_URL }) {
  const [selectedTask, setSelectedTask] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenTask = (task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTask(null)
  }

  const handleSaveTask = () => {
    onTaskUpdate()
    handleCloseModal()
  }

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
          method: "DELETE",
        })
        const result = await response.json()
        if (result.success) {
          onTaskUpdate()
        }
      } catch (error) {
        console.error("Error deleting task:", error)
      }
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#ef4444"
      case "Medium":
        return "#f59e0b"
      case "Low":
        return "#10b981"
      default:
        return "#6b7280"
    }
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div key={task._id} className="task-list-item" onClick={() => handleOpenTask(task)}>
          <div
            className={`task-status-indicator status-${task.status.toLowerCase().replace(" ", "")}`}
          />

          <div className="task-info">
            <div className="task-details">
              <h3>{task.title}</h3>
              <div className="task-meta">
                <span>{task.dueDate ? new Date(task.dueDate).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "No due date"}</span>
                <span>•</span>
                <span>{task.description ? (task.description.length > 50 ? task.description.substring(0, 50) + "..." : task.description) : "No description"}</span>
              </div>
            </div>
          </div>

          <div className="task-actions">
            <span className="task-priority-badge" style={{
              backgroundColor: getPriorityColor(task.priority),
              color: task.priority === "High" ? "#fee2e2" : task.priority === "Medium" ? "#fef3c7" : "#d1fae5",
              color: task.priority === "High" ? "#991b1b" : task.priority === "Medium" ? "#92400e" : "#065f46"
            }}>
              {task.priority}
            </span>

            <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(task._id); }}>
              Delete
            </button>
          </div>
        </div>
      ))}

      {tasks.length === 0 && <div className="empty-list">No tasks found</div>}

      {isModalOpen && selectedTask && (
        <TaskModal task={selectedTask} onClose={handleCloseModal} onSave={handleSaveTask} API_BASE_URL={API_BASE_URL} />
      )}
    </div>
  )
}

export default TaskList
