import React, { useState, useEffect } from "react";
import { format, startOfWeek, addWeeks, subWeeks, addDays, isSameDay } from "date-fns";
import { Grid, Card, CardContent, Typography, Button, Box } from "@mui/material";

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
        children: [
          {
            id: "2",
            task_name: "Independent Task B",
            date: "2025-05-02",
            parent: null,
            children: []
          }
        ]
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

const Task = ({ task, level = 0 }) => (
  <Box sx={{ marginLeft: `${level * 20}px`, marginBottom: "8px" }}>
    <Box
      sx={{
        borderLeft: "2px solid #1976d2",
        paddingLeft: "8px",
        backgroundColor: level === 0 ? "#e3f2fd" : "#f1f8e9",
        borderRadius: "4px",
        padding: "4px 8px",
        fontSize: "14px",
        fontWeight: level === 0 ? "bold" : "normal"
      }}
    >
      {task.task_name}
    </Box>
    {task.children &&
      task.children.map((child) => <Task key={child.id} task={child} level={level + 1} />)}
  </Box>
);

const TestDash = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setTasks(sampleTasks);
  }, [currentWeekStart]);

  const getTasksForDate = (date) => {
    return tasks.filter((task) => isSameDay(new Date(task.date), date));
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          padding: "10px 20px",
          backgroundColor: "#1976d2",
          color: "#fff",
          borderRadius: "8px",
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          {format(currentWeekStart, "MMMM")}
        </Typography>
        <Box sx={{ display: "flex", gap: "10px" }}>
          <Button
            onClick={() => setCurrentWeekStart(subWeeks(currentWeekStart, 1))}
            variant="contained"
            sx={{
              backgroundColor: "#1565c0",
              "&:hover": { backgroundColor: "#0d47a1" },
            }}
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}
            variant="contained"
            sx={{
              backgroundColor: "#1565c0",
              "&:hover": { backgroundColor: "#0d47a1" },
            }}
          >
            Today
          </Button>
          <Button
            onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}
            variant="contained"
            sx={{
              backgroundColor: "#1565c0",
              "&:hover": { backgroundColor: "#0d47a1" },
            }}
          >
            Next
          </Button>
        </Box>
      </Box>

      {/* Weekly Task Grid */}
      <Grid container spacing={3} sx={{ flexGrow: 1 }}>
        {[...Array(7)].map((_, i) => {
          const day = addDays(currentWeekStart, i);
          const dayTasks = getTasksForDate(day);
          const isToday = isSameDay(day, new Date()); // Check if the day is today

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i} sx={{ width: "10vw", height: "85vh" }}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: isToday ? 8 : 3, // Stronger shadow for today's card
                  borderRadius: "12px",
                  backgroundColor: "#fff", // Darker blue for today's card
                  "&:hover": { boxShadow: 6, transform: "scale(1.02)" },
                  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                }}
              >
                <CardContent sx={{ flex: 1 }}>
                  <Typography
                    variant="h7"
                    align="center"
                    sx={{
                      fontWeight: isToday ? "bold" : "normal", // Bold text for today's card
                      color: "#1976d2", // White text for today's card
                    }}
                  >
                    {format(day, "EEEE M/d")}
                  </Typography>
                  <Box sx={{ marginTop: "16px" }}> {/* Ensure spacing between Typography and tasks */}
    {dayTasks.map((task) => (
      <Task key={task.id} task={task} />
    ))}
  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default TestDash;