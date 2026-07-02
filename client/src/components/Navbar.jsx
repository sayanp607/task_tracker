import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChartPie, FaTasks } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar glass" style={{ marginBottom: '2rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, background: 'linear-gradient(to right, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          TaskTracker
        </h1>
      </Link>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/">
          <button className={`btn ${location.pathname === '/' ? 'btn-primary' : 'btn-icon'}`} title="Tasks">
            <FaTasks /> <span className="nav-text">Tasks</span>
          </button>
        </Link>
        <Link to="/dashboard">
          <button className={`btn ${location.pathname === '/dashboard' ? 'btn-primary' : 'btn-icon'}`} title="Analytics Dashboard">
            <FaChartPie /> <span className="nav-text">Dashboard</span>
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
