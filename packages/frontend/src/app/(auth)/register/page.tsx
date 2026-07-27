'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAppStore } from '@/lib/store';

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAppStore((s) => s.setUser);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post<{ access_token: string; user: any }>('/auth/register', {
        name,
        email,
        password,
      });
      api.setToken(res.access_token);
      setUser(res.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Minyflow</h1>
          <p className="text-dark-200 mt-2">Comece a automatizar suas mensagens</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-dark-700 rounded-xl p-8 shadow-2xl border border-dark-500">
          <h2 className="text-xl font-semibold text-white mb-6">Criar nova conta</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-100 mb-1">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-dark-600 border border-dark-400 rounded-lg px-4 py-3 text-white placeholder-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Seu nome"
                required
              />
            </div>

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
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-100 mb-1">Confirmar Senha</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-dark-600 border border-dark-400 rounded-lg px-4 py-3 text-white placeholder-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Confirme sua senha"
                minLength={6}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors"
          >
            {loading ? 'Criando...' : 'Criar conta'}
          </button>

          <p className="text-center text-dark-200 text-sm mt-4">
            Já tem conta?{' '}
            <Link href="/login" className="text-primary-400 hover:text-primary-300">
              Fazer login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
