'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAppStore } from '@/lib/store';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { User, Shield } from 'lucide-react';

export default function SettingsPage() {
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const updateProfile = async () => {
    try {
      const updated = await api.patch<any>('/users/profile', { name, email });
      setUser({ ...user!, ...updated });
      setMessage('Perfil atualizado com sucesso');
      setTimeout(() => setMessage(''), 3000);
    } catch {}
  };

  const updatePassword = async () => {
    if (!currentPassword || !newPassword) return;
    try {
      await api.patch('/users/password', { currentPassword, newPassword });
      setMessage('Senha atualizada com sucesso');
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setMessage(''), 3000);
    } catch {}
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <Header title="Configuracoes" />
        <div className="p-6 max-w-2xl">
          {message && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-lg p-3 mb-6">
              {message}
            </div>
          )}

          <div className="bg-dark-700 rounded-xl p-6 border border-dark-500 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <User size={20} className="text-primary-400" />
              <h2 className="text-lg font-semibold text-white">Perfil</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-dark-200 mb-1">Nome</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-dark-600 border border-dark-400 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm text-dark-200 mb-1">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-600 border border-dark-400 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button onClick={updateProfile} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm">
                Salvar Perfil
              </button>
            </div>
          </div>

          <div className="bg-dark-700 rounded-xl p-6 border border-dark-500 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={20} className="text-primary-400" />
              <h2 className="text-lg font-semibold text-white">Alterar Senha</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-dark-200 mb-1">Senha Atual</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-dark-600 border border-dark-400 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm text-dark-200 mb-1">Nova Senha</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-dark-600 border border-dark-400 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button onClick={updatePassword} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm">
                Alterar Senha
              </button>
            </div>
          </div>

          <div className="bg-dark-700 rounded-xl p-6 border border-dark-500">
            <h2 className="text-lg font-semibold text-white mb-4">Plano Atual</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-200">Plano: <span className="text-primary-400 font-medium capitalize">{user?.plan || 'Basico'}</span></p>
                <p className="text-dark-300 text-sm mt-1">
                  {user?.messagesUsed || 0} / {user?.messageLimit || 1000} mensagens usadas
                </p>
              </div>
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm">
                Upgrade
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
