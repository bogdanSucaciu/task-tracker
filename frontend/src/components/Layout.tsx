import { LayoutDashboard, ListChecks, LogOut, Plus, Sparkles } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Button } from './Button';

export function Layout() {
  const auth = useAuth();
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand" end>
          <Sparkles size={20} />
          <span>Task Tracker</span>
        </NavLink>
        <nav>
          <NavLink to="/" end>
            <LayoutDashboard size={15} />
            Dashboard
          </NavLink>
          <NavLink to="/tasks">
            <ListChecks size={15} />
            Tasks
          </NavLink>
          <NavLink to="/tasks/new">
            <Plus size={15} />
            New
          </NavLink>
        </nav>
        <div className="user-menu">
          <span>{auth.user?.displayName}</span>
          <Button variant="secondary" onClick={auth.logout} icon={<LogOut size={15} />}>
            Logout
          </Button>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
