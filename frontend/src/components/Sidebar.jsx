import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Library, Bot, Database, Settings, Menu, LogOut } from 'lucide-react';
import { clearAuth } from '../api/client.js';
import './Sidebar.css';

// Navigation items definition – easy to extend
const navItems = [
  // Keep only Library (the main prompt view) and AI Gateway
  { key: 'library', label: 'Library', icon: Library, path: '/' },
  { key: 'gateway', label: 'AI Gateway', icon: Bot, path: '/gateway' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => setIsOpen(!isOpen);

  const renderNavItem = ({ key, label, icon: Icon, path }) => (
    <Link
      key={key}
      to={path}
      className={`dash-nav-item ${location.pathname === path ? 'active' : ''}`}
    >
      <Icon size={17} /> {label}
    </Link>
  );

  return (
    <aside className={`dash-sidebar ${isOpen ? 'open' : ''}`}>
      {/* Mobile toggle button */}
      <button className="nav-toggle" onClick={toggleDrawer} aria-label="Toggle navigation menu">
        <Menu size={20} />
      </button>

      {/* Brand */}
      <Link to="/" className="dash-brand">
        <div className="dash-brand-icon"><ShieldCheck size={20} /></div>
        <div>
          <h1>Prompt Vault</h1>
          <p>Enterprise Gateway</p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="dash-nav" aria-label="Main navigation">
        {navItems.map(renderNavItem)}
      </nav>

      {/* User badge – placeholder, actual data comes from App state */}
      <div className="dash-user">
        <div className="dash-user-avatar">U</div>
        <div className="dash-user-info">
          <strong>Demo User</strong>
          <small>ROLE_DEVELOPER</small>
        </div>
        {/* Logout button – clears auth and redirects to login */}
        <button className="dash-logout" aria-label="Sign out" onClick={() => { clearAuth(); navigate('/login'); }}>
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
