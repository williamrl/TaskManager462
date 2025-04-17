import React from "react";
import { Grid, Paper, Typography, Box, List, ListItem, ListItemText } from "@mui/material";

function Dashboard() {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Weekly Task Dashboard
      </Typography>

      <Grid container spacing={2}>
        {/* 7-Day Week View */}
        <Grid xs={11}>
          <Grid container spacing={2}>
            {daysOfWeek.map((day) => (
              <Grid item xs={12} sm={6} md={4} key={day}>
                <Paper elevation={3} sx={{ padding: 2, height: "90vh", width: "7vw", overflowY: "auto" }}>
                  <Typography variant="h6" gutterBottom>
                    {day}
                  </Typography>
                  {/* Placeholder for tasks */}
                  <ul>
                    <li>Task 1 for {day}</li>
                    <li>Task 2 for {day}</li>
                  </ul>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* To-Do List Section */}
        <Grid xs={1}>
          <Paper elevation={3} sx={{ padding: 2, height: "90vh", width: "10vw", overflowY: "auto" }}>
            <Typography variant="h6" gutterBottom>
              To-Do List
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Buy groceries" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Prepare presentation" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Call the client" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;