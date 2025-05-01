// src/pages/TaskBoard.jsx
import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import TaskEditorModal from "../components/TaskEditorModal";
import TaskList from "../components/TaskList";
import TaskTree from "../components/TaskTree";
import { flattenTree, sampleTaskTree } from "../utils/taskUtils";

export default function TaskBoard() {
  const [tasks, setTasks] = useState(sampleTaskTree);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSave = (updatedTask) => {
    // Replace or add task (you can replace with ID-matching logic later)
    setTasks((prev) => [...prev, { ...updatedTask, id: Date.now(), children: [] }]);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Task Board
      </Typography>

      <Button variant="contained" onClick={() => setModalOpen(true)}>
        Add Task
      </Button>

      <Box sx={{ display: "flex", mt: 2, gap: 4 }}>
        <Box sx={{ width: "50%" }}>
          <Typography variant="h6">Task List</Typography>
          <TaskList tasks={flattenTree(tasks)} onClick={setSelectedTask} />
        </Box>

        <Box sx={{ width: "50%" }}>
          <Typography variant="h6">Task Tree</Typography>
          <TaskTree tasks={tasks} />
        </Box>
      </Box>

      <TaskEditorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        task={selectedTask}
      />
    </Box>
  );
}
