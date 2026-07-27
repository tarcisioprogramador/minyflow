'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Users, GitBranch, MessageSquare, Zap, TrendingUp } from 'lucide-react';

interface Stats {
  totalContacts: number;
  totalFlows: number;
  activeFlows: number;
  totalMessages: number;
  activeAutomations: number;
  messageUsage: { used: number; limit: number; percentage: number };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ stats: Stats }>('/dashboard/stats').then((res) => {
      setStats(res.stats);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: 'Contatos', value: stats.totalContacts, icon: Users, color: 'bg-blue-500/20 text-blue-400' },
    { label: 'Fluxos Ativos', value: stats.activeFlows, icon: GitBranch, color: 'bg-green-500/20 text-green-400' },
    { label: 'Mensagens', value: stats.totalMessages, icon: MessageSquare, color: 'bg-purple-500/20 text-purple-400' },
    { label: 'Automações', value: stats.activeAutomations, icon: Zap, color: 'bg-yellow-500/20 text-yellow-400' },
  ] : [];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <Header title="Dashboard" />
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {cards.map((card) => (
                  <div
                    key={card.label}
                    className="bg-dark-700 rounded-xl p-5 border border-dark-500 hover:border-dark-400 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                        <card.icon size={20} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-white">{card.value}</p>
                    <p className="text-sm text-dark-200 mt-1">{card.label}</p>
                  </div>
                ))}
              </div>

              {stats && (
                <div className="bg-dark-700 rounded-xl p-6 border border-dark-500">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={20} className="text-primary-400" />
                    <h2 className="text-lg font-semibold text-white">Uso de Mensagens</h2>
                  </div>
                  <div className="w-full bg-dark-600 rounded-full h-3 mb-2">
                    <div
                      className="bg-primary-500 h-3 rounded-full transition-all"
                      style={{ width: `${Math.min(stats.messageUsage.percentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-dark-200">
                    {stats.messageUsage.used.toLocaleString()} / {stats.messageUsage.limit.toLocaleString()} mensagens
                    ({stats.messageUsage.percentage}%)
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
