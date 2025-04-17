// src/components/TaskEditorModal.jsx
import React, { useState } from "react";
import { Modal, Button, TextField, MenuItem, Box } from "@mui/material";

export default function TaskEditorModal({ open, onClose, onSave, task }) {
  const [title, setTitle] = useState(task?.title || "");
  const [priority, setPriority] = useState(task?.priority || 1);

  const handleSave = () => {
    onSave({ ...task, title, priority });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          backgroundColor: "white",
          borderRadius: "10px",
          maxWidth: 400,
          margin: "100px auto",
        }}
      >
        <h2>{task ? "Edit Task" : "New Task"}</h2>
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />
        <TextField
          select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(parseInt(e.target.value))}
          fullWidth
          margin="normal"
        >
          {[1, 2, 3, 4, 5].map((level) => (
            <MenuItem key={level} value={level}>
              Priority {level}
            </MenuItem>
          ))}
        </TextField>
        <Button onClick={handleSave} variant="contained" sx={{ mt: 2 }}>
          Save
        </Button>
      </Box>
    </Modal>
  );
}
