'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAppStore } from '@/lib/store';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const setUser = useAppStore((s) => s.setUser);

  useEffect(() => {
    const token = api.getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    api.get<any>('/auth/profile').then((user) => {
      setUser(user);
    }).catch(() => {
      router.push('/login');
    });
  }, []);

  return <>{children}</>;
}
