'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  GitBranch,
  Users,
  Zap,
  Settings,
  LogOut,
  X,
  Puzzle,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/flows', label: 'Fluxos', icon: GitBranch },
  { href: '/contacts', label: 'Contatos', icon: Users },
  { href: '/messages', label: 'Mensagens', icon: MessageSquare },
  { href: '/automations', label: 'Automações', icon: Zap },
  { href: '/integrations', label: 'Integrações', icon: Puzzle },
  { href: '/settings', label: 'Configurações', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, sidebarOpen, toggleSidebar } = useAppStore();

  const handleLogout = () => {
    api.setToken(null);
    useAppStore.getState().setUser(null);
    router.push('/login');
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-dark-700 border-r border-dark-500 z-50 transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-dark-500">
          <h1 className="text-xl font-bold text-white">Minyflow</h1>
          <button onClick={toggleSidebar} className="lg:hidden text-dark-200 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-600/20 text-primary-400'
                    : 'text-dark-200 hover:bg-dark-600 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-dark-500">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-medium">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-dark-200 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-dark-200 hover:bg-dark-600 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
