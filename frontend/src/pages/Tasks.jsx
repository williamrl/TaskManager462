// src/pages/Tasks.jsx
import React from "react";
import CalendarView from '../component/CalendarView';

const dummyEvents = [
  {
    title: "UI Mockups",
    start: new Date(2025, 3, 20, 10, 0),
    end: new Date(2025, 3, 20, 12, 0),
  },
  {
    title: "Backend API",
    start: new Date(2025, 3, 21, 14, 0),
    end: new Date(2025, 3, 21, 16, 0),
  },
];

export default function Tasks() {
  return (
    <div>
      <h2>🗓️ Calendar Task View</h2>
      <CalendarView events={dummyEvents} />
    </div>
  );
}
