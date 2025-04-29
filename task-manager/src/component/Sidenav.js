import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Sidenav.css'; // Add styles for the side nav

const Sidenav = () => {
  return (
    <div className="side-nav">
      <h2 style={{margin: 'none'}}>Task Manager</h2>
        <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/tasks">Tasks</Link></li>
        </ul>
    </div>
  );
};

export default Sidenav;