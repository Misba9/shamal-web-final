import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { BackendStatus } from '@/components/BackendStatus';
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Mail,
  Newspaper,
  Package,
  Settings,
  Briefcase,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/services', label: 'Services', icon: Settings },
  { to: '/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/applications', label: 'Applications', icon: FileText },
  { to: '/blogs', label: 'Blogs', icon: FileText },
  { to: '/contacts', label: 'Contacts', icon: Mail },
  { to: '/newsletter', label: 'Newsletter', icon: Newspaper },
];

export function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      <aside className="w-56 flex-shrink-0 border-r border-[#e5e5e5] bg-white">
        <div className="flex h-full flex-col">
          <div className="border-b border-[#e5e5e5] p-4">
            <h1 className="text-lg font-semibold text-[#111]">Shamal Ascent Admin</h1>
          </div>
          <nav className="flex-1 space-y-0.5 p-3">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[#e5e5e5] text-[#111]'
                      : 'text-[#666] hover:bg-[#f0f0f0] hover:text-[#111]'
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex-shrink-0 border-b border-[#e5e5e5] bg-white px-6 py-3">
          <div className="flex items-center justify-end gap-4">
            <BackendStatus compact />
            <span className="text-sm text-[#666]">{admin?.email}</span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-md border border-[#ccc] bg-white px-3 py-1.5 text-sm hover:bg-[#f5f5f5]"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
