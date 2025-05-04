import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { FaCalendarMinus, FaTasks } from 'react-icons/fa'; // Import icons from react-icons
import './Sidenav.css'; // Add styles for the side nav

const Sidenav = () => {
  return (
    <div className="side-nav">
      <h2 style={{ margin: 'none', fontFamily: 'monospace', textWrap: 'nowrap' }}>Task Manager</h2>
      <ul>
        <li>
          <Link to="/">
            <FaCalendarMinus style={{ marginRight: '8px' }} /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/tasks">
            <FaTasks style={{ marginRight: '8px' }} /> Tasks
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidenav;