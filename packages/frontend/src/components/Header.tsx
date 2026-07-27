'use client';

import { useAppStore } from '@/lib/store';
import { Menu } from 'lucide-react';

export default function Header({ title }: { title: string }) {
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const user = useAppStore((s) => s.user);

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-dark-500 bg-dark-800/50 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="lg:hidden text-dark-200 hover:text-white">
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-xs text-dark-200">Plano</p>
          <p className="text-sm font-medium text-primary-400 capitalize">{user?.plan || 'Básico'}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
}
