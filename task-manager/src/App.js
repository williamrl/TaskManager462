import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TestDash from './pages/TestDash';
import Dashboard from './pages/Dashboard';

import Sidenav from './component/Sidenav';
import TaskList from './pages/TaskList';

function App() {
  return (
    <Router>
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidenav />
      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="/" element={<TestDash />} />
          <Route path="/tasks" element={<TaskList />} />
        </Routes>
      </div>
    </div>
  </Router>
    
  );
}

export default App;
