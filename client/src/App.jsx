import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AllTasksPage from './pages/AllTasksPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Router>
      <div className="container">
        <ToastContainer theme="dark" position="bottom-right" />
        <Navbar />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tasks" element={<AllTasksPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
