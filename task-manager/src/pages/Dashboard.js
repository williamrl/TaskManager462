import React, { useState, useEffect } from "react";
import { format, startOfWeek, addWeeks, subWeeks, addDays, isSameDay } from "date-fns";
import { Grid, Card, CardContent, Typography, Button, Box, IconButton, Modal, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { fetchTasks, addTask, updateTask, deleteTask } from "../utils/taskAPI";
import Event from "@mui/icons-material/Event";

const sampleTasks = [
  {
    id: "1",
    task_name: "Parent Task A",
    date: "2025-04-30",
    parent: null,
    children: [
      {
        id: "1-1",
        task_name: "Child Task A1",
        date: "2025-04-30",
        parent: "1",
        children: []
      },
      {
        id: "1-2",
        task_name: "Child Task A2",
        date: "2025-04-30",
        parent: "1",
        children: []
      }
    ]
  },
  {
    id: "2",
    task_name: "Independent Task B",
    date: "2025-05-02",
    parent: null,
    children: []
  }
];

const Task = ({ task, level = 0, onTaskClick }) => (
  <Box sx={{ marginLeft: `${level * 20}px`, marginBottom: "8px" }}>
    <Box
      sx={{
        borderLeft: "2px solid #1976d2",
        paddingLeft: "8px",
        backgroundColor: level === 0 ? "#e3f2fd" : "#f1f8e9",
        borderRadius: "4px",
        padding: "4px 8px",
        fontSize: "14px",
        fontWeight: level === 0 ? "bold" : "normal",
        cursor: "pointer"
      }}
      onClick={(e) => {
        e.stopPropagation(); // prevent parent handlers
        onTaskClick(task);
      }}
    >
      {task.task_name}
    </Box>

    {task.children &&
      task.children.map((child) => (
        <Task key={child.id} task={child} level={level + 1} onTaskClick={onTaskClick} />
      ))}
  </Box>
);


const Dashboard = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );
  const [tasks, setTasks] = useState([]); // task list
  const [openDatePicker, setOpenDatePicker] = useState(false); // set week view date picker open state
  const [selectedDate, setSelectedDate] = useState(new Date()); // selected date for the week view
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isAddSubTaskModalOpen, setIsAddSubTaskModalOpen] = useState(false); // New state for sub-task modal
  const [selectedTask, setSelectedTask] = useState(null);

  // Add state for new task inputs
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDate, setNewTaskDate] = useState(new Date());

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
  }, [currentWeekStart]);

  const handleDateChange = (date) => {
    if (date) {
      const weekStart = startOfWeek(date, { weekStartsOn: 0 });
      setCurrentWeekStart(weekStart);
      setSelectedDate(date);
    }
  };

  const getTasksForDate = (date) => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.date + "T00:00:00");
      return isSameDay(taskDate, date);
    });
  };

  const handleAddTask = async () => {
    if (!newTaskName || !newTaskDate) {
      console.error("Task name and date are required.");
      return;
    }

    const taskData = {
      task_name: newTaskName,
      date: format(newTaskDate, "yyyy-MM-dd"), // Format date to match API requirements
      parent: null, // Assuming no parent task for now
    };

    try {
      await addTask(taskData); // Call the API to add the task
      setIsAddTaskModalOpen(false); // Close the modal
      setNewTaskName(""); // Reset the task name input
      setNewTaskDate(new Date()); // Reset the date picker
      loadTasks(); // Reload tasks to reflect the new task
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleUpdateTask = async () => {
    if (!selectedTask || !selectedTask.task_name || !selectedTask.date) {
      console.error("Task name and date are required.");
      return;
    }

    const updatedTaskData = {
      task_name: selectedTask.task_name,
      date: selectedTask.date, // Use the date directly without reformatting
    };

    try {
      await updateTask(selectedTask.id, updatedTaskData); // Call the API to update the task
      setIsEditTaskModalOpen(false); // Close the modal
      setSelectedTask(null); // Reset the selected task
      loadTasks(); // Reload tasks to reflect the updated task
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleAddSubTask = async () => {
    if (!selectedTask || !newTaskName || !newTaskDate) {
      console.error("Parent task, sub-task name, and date are required.");
      return;
    }

    const subTaskData = {
      task_name: newTaskName,
      date: format(newTaskDate, "yyyy-MM-dd"),
      parent: selectedTask.id, // Set the parent task ID
    };

    try {
      await addTask(subTaskData); // Call the API to add the sub-task
      setIsAddSubTaskModalOpen(false); // Close the sub-task modal
      setNewTaskName(""); // Reset the sub-task name input
      setNewTaskDate(new Date()); // Reset the date picker
      loadTasks(); // Reload tasks to reflect the new sub-task
    } catch (error) {
      console.error("Error adding sub-task:", error);
    }
  };

  // Function to handle deleting a task
  const handleDeleteTask = async () => {
    if (!selectedTask) {
      console.error("No task selected for deletion.");
      return;
    }

    try {
      await deleteTask(selectedTask.id); // Call the API to delete only the selected task
      setIsEditTaskModalOpen(false); // Close the modal
      setSelectedTask(null); // Reset the selected task
      loadTasks(); // Reload tasks to reflect the deletion
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask({ ...task }); // Set the clicked task as the selected task
    setIsEditTaskModalOpen(true); // Open the edit modal
  };

  return (
    <Box
      sx={{
        height: "90vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header Section */}
      <Grid
        container
        sx={{
          marginBottom: "20px",
          padding: "10px 20px",
          backgroundColor: "#211b5b",
          color: "#fff",
          borderRadius: "8px",
          boxShadow: 3,
          alignItems: "center",
          display: "flex",
          flexWrap: "nowrap",
          justifyContent: "space-between",
        }}
      >
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            overflow: "hidden",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              value={selectedDate}
              onChange={(newDate) => {
                handleDateChange(newDate);
                setOpenDatePicker(false);
              }}
              open={openDatePicker}
              onClose={() => setOpenDatePicker(false)}
              slotProps={{
                textField: { style: { display: "none" } },
              }}
            />
            <IconButton
              onClick={() => setOpenDatePicker(true)}
              sx={{
                color: "#fff",
                backgroundColor: "#4caf50",
                "&:hover": { backgroundColor: "#388e3c" },
              }}
            >
              <Event />
            </IconButton>
          </LocalizationProvider>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {format(currentWeekStart, "MMMM yyyy")}
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "5px",
            alignItems: "center",
            flexWrap: "nowrap",
          }}
        >
          <Button
            onClick={() => setIsAddTaskModalOpen(true)}
            variant="contained"
            sx={{
              backgroundColor: "#8078eb",
              "&:hover": { backgroundColor: "#343060" },
              whiteSpace: "nowrap",
            }}
          >
            Add Task
          </Button>
          <Button
            onClick={() =>
              setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }))
            }
            variant="contained"
            sx={{
              backgroundColor: "#1565c0",
              "&:hover": { backgroundColor: "#0d47a1" },
              whiteSpace: "nowrap",
            }}
          >
            Today
          </Button>
          <IconButton
            onClick={() => setCurrentWeekStart(subWeeks(currentWeekStart, 1))}
            sx={{
              color: "#fff",
              backgroundColor: "#1565c0",
              "&:hover": { backgroundColor: "#0d47a1" },
            }}
          >
            <ArrowBack />
          </IconButton>

          <IconButton
            onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}
            sx={{
              color: "#fff",
              backgroundColor: "#1565c0",
              "&:hover": { backgroundColor: "#0d47a1" },
            }}
          >
            <ArrowForward />
          </IconButton>
        </Grid>
      </Grid>

      {/* Weekly Task Grid */}
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        {[...Array(7)].map((_, i) => {
          const day = addDays(currentWeekStart, i);
          const dayTasks = getTasksForDate(day);
          const isToday = isSameDay(day, new Date());

          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={i}
              sx={{ width: "11.5vw", height: "85vh" }}
            >
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: isToday ? 8 : 3,
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.02)",
                  },
                  transition:
                    "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                }}
              >
                <CardContent sx={{ flex: 1 }}>
                  <Typography
                    variant="h7"
                    align="center"
                    sx={{
                      fontWeight: isToday ? "bold" : "normal",
                      color: isToday ? "darkblue" : "#000000",
                    }}
                  >
                    {format(day, "EEEE M/d")}
                  </Typography>
                  <Box sx={{ marginTop: "16px" }}>
                    {dayTasks.map((task) => (
                      <Task key={task.id} task={task} onTaskClick={handleTaskClick} />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Add Task Modal */}
      <Modal
        open={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
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
          <Typography variant="h6" sx={{ marginBottom: "16px", color: "black" }}>
            Add Task
          </Typography>
          <TextField
            fullWidth
            label="Task Name"
            variant="outlined"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            sx={{ marginBottom: "16px" }}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Task Date"
              value={newTaskDate}
              onChange={(newDate) => setNewTaskDate(newDate)}
              renderInput={(params) => (
                <TextField {...params} fullWidth sx={{ marginBottom: "16px" }} />
              )}
            />
          </LocalizationProvider>
          <Button
            variant="contained"
            onClick={handleAddTask}
            sx={{ backgroundColor: "#4caf50", "&:hover": { backgroundColor: "#388e3c" } }}
          >
            Save
          </Button>
        </Box>
      </Modal>

      {/* Add Sub-Task Modal */}
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
          <Typography variant="h6" sx={{ marginBottom: "16px", color: "black" }}>
            Add Sub-Task
          </Typography>
          <TextField
            fullWidth
            label="Sub-Task Name"
            variant="outlined"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            sx={{ marginBottom: "16px" }}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Sub-Task Date"
              value={newTaskDate}
              onChange={(newDate) => setNewTaskDate(newDate)}
              renderInput={(params) => (
                <TextField {...params} fullWidth sx={{ marginBottom: "16px" }} />
              )}
            />
          </LocalizationProvider>
          <Button
            variant="contained"
            onClick={handleAddSubTask}
            sx={{ backgroundColor: "#4caf50", "&:hover": { backgroundColor: "#388e3c" } }}
          >
            Save Sub-Task
          </Button>
        </Box>
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        open={isEditTaskModalOpen}
        onClose={() => setIsEditTaskModalOpen(false)}
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
            value={selectedTask?.task_name || ""}
            onChange={(e) =>
              setSelectedTask((prev) => ({ ...prev, task_name: e.target.value }))
            }
            sx={{ marginBottom: "16px" }}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Task Date"
              value={selectedTask ? new Date(selectedTask.date + "T00:00:00") : new Date()}
              onChange={(newDate) =>
                setSelectedTask((prev) => ({
                  ...prev,
                  date: format(newDate, "yyyy-MM-dd"),
                }))
              }
              renderInput={(params) => (
                <TextField {...params} fullWidth sx={{ marginBottom: "16px" }} />
              )}
            />
          </LocalizationProvider>
          <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "16px" }}>
            <Button
              variant="contained"
              onClick={() => setIsAddSubTaskModalOpen(true)} // Open the sub-task modal
              sx={{ backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#115293" } }}
            >
              Add Sub-Task
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdateTask}
              sx={{ backgroundColor: "#4caf50", "&:hover": { backgroundColor: "#388e3c" } }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              onClick={handleDeleteTask}
              sx={{ backgroundColor: "#d32f2f", "&:hover": { backgroundColor: "#9a0007" } }}
            >
              Delete Task
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Dashboard;
