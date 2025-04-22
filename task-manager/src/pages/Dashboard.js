import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, List, ListItem, ListItemText, Button, Modal, TextField } from "@mui/material";
import { format, addDays, startOfWeek, subWeeks, addWeeks } from 'date-fns';
import { getTasks } from '../utils/api';

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));

  const handlePreviousWeek = () => setCurrentWeekStart(prev => subWeeks(prev, 1));
  const handleNextWeek = () => setCurrentWeekStart(prev => addWeeks(prev, 1));
  const handleToday = () => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }));

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const weekEnd = addDays(currentWeekStart, 6);
  const weekRange = `${format(currentWeekStart, 'MM/dd/yyyy')} - ${format(weekEnd, 'MM/dd/yyyy')}`;

  const daysWithDates = daysOfWeek.map((day, index) => ({
    label: `${day} ${format(addDays(currentWeekStart, index), 'M/d')}`,
    date: addDays(currentWeekStart, index),
  }));

  const isToday = (someDate) => {
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
           someDate.getMonth() === today.getMonth() &&
           someDate.getFullYear() === today.getFullYear();
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await getTasks();
        const formattedEvents = Object.keys(tasks).map(date => ({
          title: tasks[date].join(', '),
          start: new Date(date),
          end: new Date(date),
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" textAlign="center" sx={{ flexGrow: 1 }}>
          Weekly Task Dashboard ({weekRange})
        </Typography>
        <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2 }}>
          Add Task
        </Button>
        <Button onClick={handlePreviousWeek}>&larr;</Button>
        <Button onClick={handleNextWeek}>&rarr;</Button>
        <Button onClick={handleToday}>This Week</Button>
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          width: 300
        }}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: 'black' }}>
                Add New Task
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleClose}>Add</Button>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Task Name" sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Date (YYYY-MM-DD)" />
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <Grid container spacing={2}>
        {daysWithDates.map((dayInfo, index) => (
          <Grid item xs={12} sm={6} md={1} key={index}>
            <Paper
              elevation={isToday(dayInfo.date) ? 10 : 3}
              sx={{
                padding: 2,
                height: '85vh',
                width: '9vw',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                border: isToday(dayInfo.date) ? '2px solid #1976d2' : '1px solid #e0e0e0',
                backgroundColor: isToday(dayInfo.date) ? '#e3f2fd' : 'white',
              }}
            >
              <Typography
                variant="h7"
                gutterBottom
                sx={{
                  fontWeight: isToday(dayInfo.date) ? 'bold' : 'normal',
                  color: isToday(dayInfo.date) ? '#1976d2' : 'inherit',
                }}
              >
                {dayInfo.label}
              </Typography>
              <List dense>
                {events.filter(event => format(event.start, 'M/d') === format(dayInfo.date, 'M/d')).map((event, eventIndex) => (
                  <ListItem key={eventIndex}>
                    <ListItemText primary={event.title} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Dashboard;
