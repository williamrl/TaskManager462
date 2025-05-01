import React from 'react';
import { Link } from 'react-router-dom'; // Keep only one import
import './Sidenav.css';

const Sidenav = () => {
  return (
    <div className="side-nav">
      <h2 style={{ margin: 'none' }}>Task Manager</h2>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/tasks">Tasks</Link></li>
        <li><Link to="/completed">Completed</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
    </div>
  );
};

export default Sidenav;