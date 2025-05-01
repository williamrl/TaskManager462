import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, List, ListItem, ListItemText, Button, Modal, TextField } from "@mui/material";
import { format, addDays, startOfWeek, subWeeks, addWeeks, parse } from 'date-fns';
import { getTaskTree, addTask } from '../utils/api';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import './Dashboard.css';

// Days of the week for rendering the calendar
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Modal component for adding a new task or subtask
const AddTaskModal = ({ open, onClose, taskName, setTaskName, taskDate, setTaskDate, onAddTask }) => (
  <Modal open={open} onClose={onClose}>
    <Box className="add-modal">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography sx={{ color: 'black' }} variant="h6" gutterBottom>Add New Task</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Task Date"
              value={taskDate}
              onChange={(newValue) => {
                setTaskDate(newValue);
              }}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" fullWidth onClick={onAddTask}>
            Add Task
          </Button>
        </Grid>
      </Grid>
    </Box>
  </Modal>
);

function Dashboard() {
  const [taskTree, setTaskTree] = useState([]); // Hierarchical task structure
  const [openAddTask, setOpenAddTask] = useState(false); // Show add task modal
  const [taskName, setTaskName] = useState(''); // Name of the task
  const [taskDate, setTaskDate] = useState(new Date()); // Date of the task
  const [selectedTask, setSelectedTask] = useState(null); // Selected task for adding subtasks
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date())); // Start of the week

  // Fetch the task tree from the backend
  const fetchTaskTree = async () => {
    try {
      const tree = await getTaskTree();
      setTaskTree(tree);
    } catch (error) {
      console.error('Failed to load task tree:', error);
    }
  };

  const handleAddTask = async () => {
    try {
      if (!taskName || !taskDate) {
        console.log("Task name and date are required!");
        return;
      }

      // Add task with optional parentTaskId
      await addTask(taskName, taskDate, selectedTask?.id || null);

      setTaskName(""); // Clear input fields
      setTaskDate(new Date());
      setOpenAddTask(false); // Close modal
      setSelectedTask(null); // Reset selected task
      fetchTaskTree(); // Refresh task tree
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Recursive rendering of the task tree
  const renderTaskTree = (tasks, level = 0) => (
    tasks.map(task => (
      <React.Fragment key={task.id}>
        <ListItem sx={{ pl: level * 4 }} button onClick={() => setSelectedTask(task)}>
          <ListItemText primary={task.task_name} />
        </ListItem>
        {task.children.length > 0 && renderTaskTree(task.children, level + 1)}
      </React.Fragment>
    ))
  );

  useEffect(() => {
    fetchTaskTree();
  }, []);

  const weekEnd = addDays(currentWeekStart, 6);
  const weekRange = `${format(currentWeekStart, 'MM/dd/yyyy')} - ${format(weekEnd, 'MM/dd/yyyy')}`;

  // Handle navigation buttons
  const handleNavigation = (direction) => {
    setCurrentWeekStart(prev => {
      if (direction === 'prev') return subWeeks(prev, 1);
      if (direction === 'next') return addWeeks(prev, 1);
      return startOfWeek(new Date());
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box className="header">
        <Typography variant="h4" textAlign="center" sx={{ flexGrow: 1 }}>
          Weekly Task Dashboard ({weekRange})
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setOpenAddTask(true)} sx={{ mb: 2 }}>
          Add Task
        </Button>
        <Button onClick={() => handleNavigation('prev')}>&larr;</Button>
        <Button onClick={() => handleNavigation('next')}>&rarr;</Button>
        <Button onClick={() => handleNavigation('today')}>This Week</Button>
      </Box>

      <AddTaskModal
        open={openAddTask}
        onClose={() => setOpenAddTask(false)}
        taskName={taskName}
        setTaskName={setTaskName}
        taskDate={taskDate}
        setTaskDate={setTaskDate}
        onAddTask={handleAddTask}
      />

      <Grid container spacing={2}>
        {daysOfWeek.map((day, index) => (
          <Grid item xs={12} sm={6} md={1} key={index}>
            <Paper sx={getPaperStyle(false)}>
              <Typography variant="subtitle2" gutterBottom>
                {day} {format(addDays(currentWeekStart, index), 'M/d')}
              </Typography>
              <List dense>
                {index === 0 && renderTaskTree(taskTree)} {/* Render task tree on the first day */}
              </List>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

// Paper styling
const getPaperStyle = (highlight) => ({
  padding: 2,
  height: '85vh',
  width: '9vw',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  border: highlight ? '2px solid #1976d2' : '1px solid #e0e0e0',
  backgroundColor: highlight ? '#e3f2fd' : 'white',
  elevation: highlight ? 10 : 3,
});

export default Dashboard;