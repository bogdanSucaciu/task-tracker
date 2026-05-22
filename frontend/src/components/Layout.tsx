import { ClipboardList, LogOut, Plus } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Button } from './Button';

export function Layout() {
  const auth = useAuth();
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand">
          <ClipboardList size={22} />
          <span>Task Tracker</span>
        </NavLink>
        <nav>
          <NavLink to="/tasks">Tasks</NavLink>
          <NavLink to="/tasks/new">
            <Plus size={17} />
            New
          </NavLink>
        </nav>
        <div className="user-menu">
          <span>{auth.user?.displayName}</span>
          <Button variant="secondary" onClick={auth.logout} icon={<LogOut size={16} />}>Logout</Button>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
