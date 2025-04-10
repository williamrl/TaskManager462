import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Navbar from './component/Navbar';

function App() {
  return (
    <div>
     <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
