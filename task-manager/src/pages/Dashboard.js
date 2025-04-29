import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, List, ListItem, ListItemText, Button, Modal, TextField } from "@mui/material";
import { format, addDays, startOfWeek, subWeeks, addWeeks, parse } from 'date-fns';
import { getTasks, addTask } from '../utils/api';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import './Dashboard.css';

// Days of the week for rendering the calendar
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Modal component for adding a new task
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
  const [events, setEvents] = useState([]); // lists of tasks
  const [openAddTask, setOpenAddTask] = useState(false); // if true show add task modal pop up
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date())); // start of the week
  const [taskName, setTaskName] = useState(''); // name of the task
  const [taskDate, setTaskDate] = useState(new Date()); // date of the task

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const tasks = await getTasks();

      const formattedTasks = Object.entries(tasks).map(([date, tasksForDate]) => ({
        date: parse(date, 'yyyy-MM-dd', new Date()), // Fix: parse date in local time instead of UTC
        tasks: tasksForDate
      }));

      setEvents(formattedTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const handleAddTask = async () => {
    try {
      if (!taskName || !taskDate) {
        console.log("Task name and date are required!");
        return;
      }

      // const result = await addTask(taskName, taskDate, parentTaskId);
      const result = await addTask(taskName, taskDate, null);

      setTaskName(""); // Clear input fields
      setTaskDate(new Date());
      setOpenAddTask(false); // Close modal
      fetchTasks(); // Refresh tasks
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
  
  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const weekEnd = addDays(currentWeekStart, 6);
  const weekRange = `${format(currentWeekStart, 'MM/dd/yyyy')} - ${format(weekEnd, 'MM/dd/yyyy')}`;

  // Build day labels with matching Date objects
  const daysWithDates = daysOfWeek.map((day, index) => ({
    label: `${day} ${format(addDays(currentWeekStart, index), 'M/d')}`,
    date: addDays(currentWeekStart, index),
  }));

  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Handle navigation buttons
  const handleNavigation = (direction) => {
    setCurrentWeekStart(prev => {
      if (direction === 'prev') return subWeeks(prev, 1);
      if (direction === 'next') return addWeeks(prev, 1);
      return startOfWeek(new Date());
    });
  };

  // Build nested task structure based on parent_task_id
  const buildTaskHierarchy = (tasks) => {
    const map = {};
    const roots = [];

    tasks.forEach(task => map[task.id] = { ...task, subtasks: [] });

    tasks.forEach(task => {
      if (task.parent_task_id) {
        map[task.parent_task_id]?.subtasks.push(map[task.id]);
      } else {
        roots.push(map[task.id]);
      }
    });

    return roots;
  };

  // Recursive rendering of nested tasks
  const renderNestedTasks = (taskList, level = 0) => (
    taskList?.map(task => (
      <React.Fragment key={task.id}>
        <ListItem sx={{ pl: level * 4 }}>
          <ListItemText primary={task.task_name} />
        </ListItem>
        {renderNestedTasks(task.subtasks, level + 1)}
      </React.Fragment>
    ))
  );

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
        {daysWithDates.map((dayInfo, index) => {
          // Use yyyy-MM-dd format for consistent comparison
          const dayKey = format(dayInfo.date, 'yyyy-MM-dd');
          const dayEvents = events.find(event => format(event.date, 'yyyy-MM-dd') === dayKey);

          return (
            <Grid item xs={12} sm={6} md={1} key={index}>
              <Paper sx={getPaperStyle(isToday(dayInfo.date))}>
                <Typography variant="subtitle2" gutterBottom sx={getTypographyStyle(isToday(dayInfo.date))}>
                  {dayInfo.label}
                </Typography>
                <List dense>
                  {dayEvents?.tasks && renderNestedTasks(buildTaskHierarchy(dayEvents.tasks))}
                </List>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

// Paper styling with highlighting for today
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

// Typography styling for today
const getTypographyStyle = (highlight) => ({
  fontWeight: highlight ? 'bold' : 'normal',
  color: highlight ? '#1976d2' : 'inherit',
});

export default Dashboard;
