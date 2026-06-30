import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Library, Bot, Settings, Menu, LogOut, GitBranch, Users, Globe } from 'lucide-react';
import { clearAuth } from '../api/client.js';
import './Sidebar.css';

// Navigation items definition – easy to extend
const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: Library, path: '/dashboard' },
  { key: 'community', label: 'Community', icon: Globe, path: '/community' },
  { key: 'gateway', label: 'AI Gateway', icon: Bot, path: '/gateway', comingSoon: true },
  { key: 'workflows', label: 'Workflows', icon: GitBranch, path: '/workflows', comingSoon: true },
];

export default function Sidebar({ user, setUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => setIsOpen(!isOpen);

  const renderNavItem = ({ key, label, icon: Icon, path, comingSoon }) => (
    <Link
      key={key}
      to={path}
      className={`dash-nav-item ${location.pathname === path ? 'active' : ''}`}
    >
      <Icon size={17} /> {label}
      {comingSoon && <span className="coming-soon-badge">Coming Soon</span>}
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
        <div>
          <h1>Prompt Vault</h1>
          <p>Enterprise Gateway</p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="dash-nav" aria-label="Main navigation">
        {navItems.map(renderNavItem)}
      </nav>

      {/* User badge – from actual user data */}
      <div className="dash-user">
        <div className="dash-user-avatar">
          {user?.username?.[0]?.toUpperCase() || "U"}
        </div>
        <div className="dash-user-info">
          <strong>{user?.username || "User"}</strong>
          <small>{user?.roles?.includes("ROLE_ADMIN") ? "Admin" : "Developer"}</small>
        </div>
        {/* Logout button – clears auth and redirects to login */}
        <button className="dash-logout" aria-label="Sign out" onClick={() => {
          clearAuth();
          if (setUser) setUser(null);
          navigate('/login');
        }}>
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
