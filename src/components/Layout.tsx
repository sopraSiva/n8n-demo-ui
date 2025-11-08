import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Store,
  Package,
  Users,
  CreditCard,
  RotateCcw,
  FileText,
  Activity,
  Settings,
  LogOut,
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const menuItems = [
  { name: 'Stores', path: '/stores', icon: Store },
  { name: 'Products', path: '/products', icon: Package },
  { name: 'Suppliers', path: '/suppliers', icon: Users },
  { name: 'Credits', path: '/credits', icon: CreditCard },
  { name: 'Returns', path: '/returns', icon: RotateCcw },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'Service Status', path: '/service-status', icon: Activity },
  { name: 'Admin', path: '/admin', icon: Settings },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { userProfile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-red-700 flex">
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Demo Message</h1>
        </div>

        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-800 text-white'
                        : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4 flex justify-end items-center space-x-4">
            <span className="text-gray-700 font-medium">
              {userProfile?.full_name || 'User'}
            </span>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Log Out</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 bg-white m-4 rounded-lg shadow-sm overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
