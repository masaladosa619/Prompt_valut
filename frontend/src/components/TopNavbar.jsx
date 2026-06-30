import './TopNavbar.css';

export default function TopNavbar({ title = 'Dashboard', user }) {
  return (
    <header className="dash-topbar">
      <div>
        <p className="eyebrow">Welcome{user?.username ? `, ${user.username}` : ''}!</p>
        <h2>{title}</h2>
      </div>
    </header>
  );
}
