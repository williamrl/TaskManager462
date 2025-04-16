import React from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";

function Dashboard() {
  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Your Task Dashboard
      </Typography>

      <Grid container spacing={2}>
        {/* Task Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Total Tasks</Typography>
            <Typography>15</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Completed</Typography>
            <Typography>7</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">In Progress</Typography>
            <Typography>5</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Overdue</Typography>
            <Typography>3</Typography>
          </Paper>
        </Grid>

        {/* Recent Tasks Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Recent Tasks</Typography>
            {/* Placeholder content */}
            <ul>
              <li>Finish UI design</li>
              <li>Connect backend API</li>
              <li>Update task status feature</li>
            </ul>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;