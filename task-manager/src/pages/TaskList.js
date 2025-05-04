import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Modal, TextField } from "@mui/material";
import { fetchTasks, updateTask, deleteTask, addTask } from "../utils/taskAPI";
import { format } from "date-fns";

const Task = ({ task, level = 0, onTaskClick, onDelete, onAddSubTask }) => (
  <Box sx={{ marginLeft: `${level * 20}px`, marginBottom: "8px", padding: "2px" }}>
    <Box
      sx={{
        borderLeft: "2px solid #0d47a1", // Darker blue for the border
        paddingLeft: "8px",
        backgroundColor: level === 0 ? "#8dcfff" : level === 1 ? "#c1e5ff": "#e9f6ff",
        borderRadius: "4px",
        padding: "4px 8px",
        fontSize: "14px",
        fontWeight: level === 0 ? "bold" : "normal",
        cursor: "pointer",
        color: "black", // White text for better contrast
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid #0d47a1", 
      }}
    >
      <Box>
        <span onClick={() => onTaskClick(task)}>{task.task_name}</span>
        {level === 0 && (
          <Typography
            variant="caption"
            sx={{ display: "block", color: "black", marginTop: "4px" }}
          >
            {task.date}
          </Typography>
        )}
      </Box>
      <Box>
        <Button
          size="small"
          sx={{
            color: "#ffffff",
            backgroundColor: "#4caf50", // Green for add subtask button
            "&:hover": { backgroundColor: "#388e3c" },
            marginRight: "8px",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onAddSubTask(task);
          }}
        >
          Add Subtask
        </Button>
        <Button
          size="small"
          sx={{
            color: "#ffffff",
            backgroundColor: "#b71c1c", // Darker red for delete button
            "&:hover": { backgroundColor: "#7f0000" },
          }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
        >
          Delete
        </Button>
      </Box>
    </Box>

    {task.children &&
      task.children.map((child) => (
        <Task
          key={child.id}
          task={child}
          level={level + 1}
          onTaskClick={onTaskClick}
          onDelete={onDelete}
          onAddSubTask={onAddSubTask}
        />
      ))}
  </Box>
);

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updatedTaskName, setUpdatedTaskName] = useState("");
  const [updatedTaskDate, setUpdatedTaskDate] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDate, setNewTaskDate] = useState(format(new Date(), "yyyy-MM-dd")); // Initialize with current date
  const [isAddSubTaskModalOpen, setIsAddSubTaskModalOpen] = useState(false);
  const [newSubTaskName, setNewSubTaskName] = useState("");
  const [newSubTaskDate, setNewSubTaskDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const loadTasks = async () => {
    try {
      const fetchedTasks = await fetchTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setUpdatedTaskName(task.task_name);
    setUpdatedTaskDate(task.date);
    setIsEditModalOpen(true);
  };

  const handleAddSubTask = (task) => {
    setSelectedTask(task);
    setNewSubTaskName("");
    setNewSubTaskDate(format(new Date(), "yyyy-MM-dd"));
    setIsAddSubTaskModalOpen(true);
  };

  const handleAddSubTaskSubmit = async () => {
    if (!newSubTaskName || !newSubTaskDate || !selectedTask) {
      console.error("Subtask name, date, and parent task are required.");
      return;
    }

    const newSubTaskData = {
      task_name: newSubTaskName,
      date: newSubTaskDate, // Use the date directly from the input
      parent: selectedTask.id, // Set the parent task ID
    };

    try {
      await addTask(newSubTaskData);
      setIsAddSubTaskModalOpen(false);
      setSelectedTask(null);
      loadTasks();
    } catch (error) {
      console.error("Error adding subtask:", error);
    }
  };

  const handleUpdateTask = async () => {
    if (!selectedTask || !updatedTaskName || !updatedTaskDate) {
      console.error("Task name and date are required.");
      return;
    }

    const updatedTaskData = {
      task_name: updatedTaskName,
      date: updatedTaskDate,
    };

    try {
      await updateTask(selectedTask.id, updatedTaskData);
      setIsEditModalOpen(false);
      setSelectedTask(null);
      loadTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      loadTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleAddTask = async () => {
    if (!newTaskName || !newTaskDate) {
      console.error("Task name and date are required.");
      return;
    }

    const newTaskData = {
      task_name: newTaskName,
      date: newTaskDate, // Use the date directly from the input
      parent: null, // New tasks are parent tasks
    };

    try {
      await addTask(newTaskData);
      setIsAddModalOpen(false);
      setNewTaskName("");
      setNewTaskDate(format(new Date(), "yyyy-MM-dd")); // Reset to current date
      loadTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>
        Task List
      </Typography>
      <Button
        variant="contained"
        sx={{ marginBottom: "20px", backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#115293" } }}
        onClick={() => setIsAddModalOpen(true)}
      >
        Add New Task
      </Button>
      {tasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          onTaskClick={handleTaskClick}
          onDelete={handleDeleteTask}
          onAddSubTask={handleAddSubTask}
        />
      ))}

      {/* Edit Task Modal */}
      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            width: "400px",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "16px" }}>
            Edit Task
          </Typography>
          <TextField
            fullWidth
            label="Task Name"
            variant="outlined"
            value={updatedTaskName}
            onChange={(e) => setUpdatedTaskName(e.target.value)}
            sx={{ marginBottom: "16px" }}
          />
          <TextField
            fullWidth
            label="Task Date"
            type="date"
            variant="outlined"
            value={updatedTaskDate}
            onChange={(e) => setUpdatedTaskDate(e.target.value)}
            sx={{ marginBottom: "16px" }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "16px" }}>
            <Button
              variant="contained"
              onClick={handleUpdateTask}
              sx={{ backgroundColor: "#4caf50", "&:hover": { backgroundColor: "#388e3c" } }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              onClick={() => setIsEditModalOpen(false)}
              sx={{ backgroundColor: "#d32f2f", "&:hover": { backgroundColor: "#9a0007" } }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Add Task Modal */}
      <Modal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            width: "400px",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "16px", color: "black"}}>
            Add New Task
          </Typography>
          <TextField
            fullWidth
            label="Task Name"
            variant="outlined"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            sx={{ marginBottom: "16px" }}
          />
          <TextField
            fullWidth
            label="Task Date"
            type="date"
            variant="outlined"
            value={newTaskDate}
            onChange={(e) => setNewTaskDate(e.target.value)}
            sx={{ marginBottom: "16px" }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "16px" }}>
            <Button
              variant="contained"
              onClick={handleAddTask}
              sx={{ backgroundColor: "#4caf50", "&:hover": { backgroundColor: "#388e3c" } }}
            >
              Add
            </Button>
            <Button
              variant="contained"
              onClick={() => setIsAddModalOpen(false)}
              sx={{ backgroundColor: "#d32f2f", "&:hover": { backgroundColor: "#9a0007" } }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Add Subtask Modal */}
      <Modal
        open={isAddSubTaskModalOpen}
        onClose={() => setIsAddSubTaskModalOpen(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            width: "400px",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "16px", color: "black"}}>
            Add Subtask
          </Typography>
          <TextField
            fullWidth
            label="Subtask Name"
            variant="outlined"
            value={newSubTaskName}
            onChange={(e) => setNewSubTaskName(e.target.value)}
            sx={{ marginBottom: "16px" }}
          />
          <TextField
            fullWidth
            label="Subtask Date"
            type="date"
            variant="outlined"
            value={newSubTaskDate}
            onChange={(e) => setNewSubTaskDate(e.target.value)}
            sx={{ marginBottom: "16px" }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "16px" }}>
            <Button
              variant="contained"
              onClick={handleAddSubTaskSubmit}
              sx={{ backgroundColor: "#4caf50", "&:hover": { backgroundColor: "#388e3c" } }}
            >
              Add
            </Button>
            <Button
              variant="contained"
              onClick={() => setIsAddSubTaskModalOpen(false)}
              sx={{ backgroundColor: "#d32f2f", "&:hover": { backgroundColor: "#9a0007" } }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default TaskList;