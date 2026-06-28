import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, User, Plus } from 'lucide-react';
import './TopNavbar.css';

export default function TopNavbar({ title = 'Dashboard', user }) {
  const [search, setSearch] = useState('');

  return (
    <header className="dash-topbar">
      <div>
        <p className="eyebrow">Welcome{user?.username ? `, ${user.username}` : ''}!</p>
        <h2>{title}</h2>
      </div>
      <div className="topbar-actions">
        <div className="search-bar">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search prompts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="icon-btn" aria-label="Notifications"><Bell size={18} /></button>
        <button className="icon-btn" aria-label="Profile"><User size={18} /></button>
        <button className="btn btn-primary btn-sm">
          <Plus size={14} /> New Prompt
        </button>
      </div>
    </header>
  );
}
