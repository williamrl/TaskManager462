import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Sidenav from './component/Sidenav';

function App() {
  return (
    <Router>
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidenav />
      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  </Router>
    
  );
}

export default App;
