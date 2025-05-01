// src/App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';         // ✅ Add your tasks page
import Completed from './pages/Completed'; // ✅ Optional stub page
import Settings from './pages/Settings';   // ✅ Optional stub page
import Sidenav from './component/Sidenav';
import TaskList from './pages/TaskList';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidenav />
        <div style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/completed" element={<Completed />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/tasks" element={<TaskList />} />
        </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
