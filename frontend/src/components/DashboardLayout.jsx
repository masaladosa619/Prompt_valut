import Sidebar from './Sidebar.jsx';
import TopNavbar from './TopNavbar.jsx';
import './DashboardLayout.css';

export default function DashboardLayout({ children, user, setUser, hideTopbar }) {
  return (
    <div className="dashboard-shell">
      <Sidebar user={user} setUser={setUser} />
      <main className="dash-main">
        {!hideTopbar && <TopNavbar user={user} />}
        {children}
      </main>
    </div>
  );
}
