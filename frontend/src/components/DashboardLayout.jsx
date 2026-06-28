import Sidebar from './Sidebar.jsx';
import TopNavbar from './TopNavbar.jsx';
import './DashboardLayout.css';

export default function DashboardLayout({ children, user }) {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dash-main">
        <TopNavbar user={user} />
        {children}
      </main>
    </div>
  );
}
