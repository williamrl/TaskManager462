import React from 'react';
import './Sidenav.css'; // Add styles for the side nav

const Sidenav = () => {
  return (
    <div className="side-nav">
      <h2 style={{margin: 'none'}}>Task Manager</h2>
      <ul>
        <li><a href="#dashboard">Dashboard</a></li>
        <li><a href="#tasks">Tasks</a></li>
        <li><a href="#completed">Completed</a></li>
        <li><a href="#settings">Settings</a></li>
      </ul>
    </div>
  );
};

export default Sidenav;