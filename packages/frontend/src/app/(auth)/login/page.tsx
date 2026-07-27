'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAppStore } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAppStore((s) => s.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post<{ access_token: string; user: any }>('/auth/login', {
        email,
        password,
      });
      api.setToken(res.access_token);
      setUser(res.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Minyflow</h1>
          <p className="text-dark-200 mt-2">Automação de mensagens inteligente</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-dark-700 rounded-xl p-8 shadow-2xl border border-dark-500">
          <h2 className="text-xl font-semibold text-white mb-6">Entrar na sua conta</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-100 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-600 border border-dark-400 rounded-lg px-4 py-3 text-white placeholder-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-100 mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-600 border border-dark-400 rounded-lg px-4 py-3 text-white placeholder-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Sua senha"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="text-center text-dark-200 text-sm mt-4">
            Não tem conta?{' '}
            <Link href="/register" className="text-primary-400 hover:text-primary-300">
              Criar conta
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
