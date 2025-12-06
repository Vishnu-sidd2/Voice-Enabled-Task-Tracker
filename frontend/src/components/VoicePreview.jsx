"use client"

import { useState } from "react"
import "../styles/VoicePreview.css"

function VoicePreview({ transcript, parsedData, onClose, onCreate, API_BASE_URL }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(parsedData)

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCreateTask = () => {
    onCreate(editData)
  }

  return (
    <div className="voice-preview-overlay" onClick={onClose}>
      <div className="voice-preview-content" onClick={(e) => e.stopPropagation()}>
        <div className="preview-header">
          <h2>Review Voice Input</h2>
          <button className="preview-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="preview-transcript">
          <h3>Your Voice Input</h3>
          <p className="transcript-text">"{transcript}"</p>
        </div>

        <div className="preview-body">
          <div className="preview-section">
            <h3>Extracted Details</h3>

            <div className="parsed-fields">
              <div className="field-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => handleEditChange("title", e.target.value)}
                  className="field-value"
                  style={{ width: "100%", background: "rgba(30, 41, 59, 0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
              </div>

              <div className="field-group">
                <label>Description</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => handleEditChange("description", e.target.value)}
                  className="field-value"
                  rows="4"
                  style={{ width: "100%", background: "rgba(30, 41, 59, 0.5)", border: "1px solid rgba(255,255,255,0.1)", resize: "vertical" }}
                />
              </div>

              <div className="field-row">
                <div className="field-group">
                  <label>Priority</label>
                  <select
                    value={editData.priority}
                    onChange={(e) => handleEditChange("priority", e.target.value)}
                    className="field-value"
                    style={{ width: "100%", background: "rgba(30, 41, 59, 0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="field-group">
                  <label>Status</label>
                  <select
                    value={editData.status}
                    onChange={(e) => handleEditChange("status", e.target.value)}
                    className="field-value"
                    style={{ width: "100%", background: "rgba(30, 41, 59, 0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>

              <div className="field-group">
                <label>Due Date</label>
                <input
                  type="datetime-local"
                  value={editData.dueDate ? (() => {
                    const date = new Date(editData.dueDate);
                    const offset = date.getTimezoneOffset() * 60000;
                    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
                  })() : ""}
                  onChange={(e) => handleEditChange("dueDate", e.target.value ? new Date(e.target.value) : null)}
                  className="field-value"
                  style={{ width: "100%", background: "rgba(30, 41, 59, 0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="preview-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleCreateTask}>
            Create Task
          </button>
        </div>
      </div>
    </div>
  )
}

export default VoicePreview
