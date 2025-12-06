"use client"
import "../styles/TaskCard.css"

function TaskCard({ task, onClick, onDelete, API_BASE_URL }) {
  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm("Are you sure you want to delete this task?")) {
      fetch(`${API_BASE_URL}/tasks/${task._id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
            onDelete()
          }
        })
        .catch((error) => console.error("Error:", error))
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

  const formatDate = (date) => {
    if (!date) return null
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  return (
    <div className="task-card" onClick={onClick}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <button
          className="delete-btn"
          onClick={handleDelete}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          title="Delete task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </button>
      </div>

      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-footer">
        <span className={`task-priority priority-${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
        {task.dueDate && (
          <span className="task-date">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  )
}

export default TaskCard
