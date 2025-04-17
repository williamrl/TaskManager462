// src/components/TaskList.jsx
import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";

export default function TaskList({ tasks, onClick }) {
  return (
    <List>
      {tasks.map((task) => (
        <ListItem button key={task.id} onClick={() => onClick(task)}>
          <ListItemText
            primary={`${task.title}`}
            secondary={`Priority: ${task.priority}`}
          />
        </ListItem>
      ))}
    </List>
  );
}
