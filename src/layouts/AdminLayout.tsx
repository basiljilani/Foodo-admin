import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  HomeIcon,
  BuildingStorefrontIcon,
  DocumentTextIcon,
  TagIcon,
  Cog6ToothIcon,
  UserIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
  { name: 'Restaurants', path: '/restaurants', icon: BuildingStorefrontIcon },
  { name: 'Menus', path: '/menus', icon: DocumentTextIcon },
  { name: 'Offers', path: '/offers', icon: TagIcon },
  { name: 'Settings', path: '/settings', icon: Cog6ToothIcon },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-surface-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-4 border-b border-surface-200">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg" />
              <span className="text-xl font-semibold text-surface-900">Foodo</span>
              <span className="text-sm text-surface-500">Admin</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-surface-700 hover:bg-surface-50'
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 mr-3 ${
                      isActive ? 'text-primary-600' : 'text-surface-400'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-surface-200">
            <Link
              to="/profile"
              className="flex items-center space-x-3 hover:bg-surface-50 p-2 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-900 truncate">
                  John Doe
                </p>
                <p className="text-xs text-surface-500 truncate">
                  admin@foodo.com
                </p>
              </div>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="pl-64">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-surface-200">
          <div className="flex items-center justify-end h-full px-6">
            <button className="relative p-2 text-surface-400 hover:text-surface-500">
              <span className="sr-only">View notifications</span>
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              <BellIcon className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 w-full">
          <div className="max-w-7xl mx-auto p-6 w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
