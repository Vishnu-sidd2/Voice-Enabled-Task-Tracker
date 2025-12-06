import { useState } from "react"
import { DndContext, pointerWithin, MouseSensor, TouchSensor, useSensor, useSensors, DragOverlay, useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import TaskCard from "./TaskCard"
import TaskModal from "./TaskModal"
import "../styles/TaskBoard.css"

// Sortable Task Item Component
function SortableTaskItem({ task, onClick, onDelete, API_BASE_URL }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id, data: { task } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onClick={onClick} onDelete={onDelete} API_BASE_URL={API_BASE_URL} />
    </div>
  )
}

// Droppable Column Component
function DroppableColumn({ status, tasks, onOpenTask, onDelete, API_BASE_URL }) {
  const { setNodeRef } = useDroppable({ id: status, data: { type: 'column', status } })

  return (
    <div ref={setNodeRef} className="board-column">
      <h2 className="column-title">{status}</h2>
      <div className="column-content">
        <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTaskItem
              key={task._id}
              task={task}
              onClick={() => onOpenTask(task)}
              onDelete={onDelete}
              API_BASE_URL={API_BASE_URL}
            />
          ))}
        </SortableContext>
        {tasks.length === 0 && <div className="empty-column">No tasks</div>}
      </div>
    </div>
  )
}

function TaskBoard({ tasks, onTaskUpdate, API_BASE_URL }) {
  const [selectedTask, setSelectedTask] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeId, setActiveId] = useState(null)

  const statuses = ["To Do", "In Progress", "Done"]

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status.toLowerCase() === status.toLowerCase())
  }

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

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event

    if (!over) return

    const activeTask = active.data.current?.task
    // If dropped over a column (status)
    let newStatus = over.id

    // If dropped over another task, get that task's status
    if (!statuses.includes(newStatus)) {
      const overTask = tasks.find(t => t._id === over.id)
      if (overTask) {
        newStatus = overTask.status
      }
    }

    // Normalize status casing check
    const normalizedStatuses = statuses.map(s => s.toLowerCase())
    const targetStatusIndex = normalizedStatuses.indexOf(newStatus.toLowerCase())

    if (targetStatusIndex !== -1) {
      // Use the canonical status string from our array
      newStatus = statuses[targetStatusIndex]
    }

    if (activeTask && activeTask.status !== newStatus && statuses.includes(newStatus)) {
      // Optimistic update (optional, but good for UX)
      // For now, we'll just call the API
      try {
        await fetch(`${API_BASE_URL}/tasks/${activeTask._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...activeTask, status: newStatus }),
        })
        onTaskUpdate()
      } catch (error) {
        console.error("Failed to update task status:", error)
      }
    }

    setActiveId(null)
  }

  return (
    <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="task-board">
        {statuses.map((status) => (
          <DroppableColumn
            key={status}
            status={status}
            tasks={getTasksByStatus(status)}
            onOpenTask={handleOpenTask}
            onDelete={onTaskUpdate}
            API_BASE_URL={API_BASE_URL}
          />
        ))}
      </div>

      <DragOverlay>
        {activeId ? (
          <div style={{ opacity: 0.8 }}>
            <TaskCard
              task={tasks.find(t => t._id === activeId)}
              API_BASE_URL={API_BASE_URL}
            />
          </div>
        ) : null}
      </DragOverlay>

      {isModalOpen && selectedTask && (
        <TaskModal task={selectedTask} onClose={handleCloseModal} onSave={handleSaveTask} API_BASE_URL={API_BASE_URL} />
      )}
    </DndContext>
  )
}

export default TaskBoard
