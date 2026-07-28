'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { showToast } from '@/components/Toast';
import { Plus, Puzzle, Trash2, X, MessageSquare } from 'lucide-react';

interface Integration {
  id: string;
  type: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'WHATSAPP', phoneNumberId: '', accessToken: '' });

  const load = async () => {
    try {
      const data = await api.get<Integration[]>('/integrations');
      setIntegrations(data);
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar integrações');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/integrations', {
        name: form.name,
        type: form.type,
        config: {
          phoneNumberId: form.phoneNumberId,
          accessToken: form.accessToken,
        },
      });
      showToast('Integração criada', 'success');
      setShowForm(false);
      setForm({ name: '', type: 'WHATSAPP', phoneNumberId: '', accessToken: '' });
      load();
    } catch (err: any) {
      showToast(err.message || 'Erro ao criar integração');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Excluir esta integração?')) return;
    try {
      await api.delete(`/integrations/${id}`);
      showToast('Integração excluída', 'success');
      load();
    } catch (err: any) {
      showToast(err.message || 'Erro ao excluir integração');
    }
  };

  const typeIcon: Record<string, string> = {
    WHATSAPP: 'bg-green-500/20 text-green-400',
    SMS: 'bg-blue-500/20 text-blue-400',
    EMAIL: 'bg-purple-500/20 text-purple-400',
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <Header title="Integrações" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-dark-200">{integrations.length} integração(ões)</p>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium"
            >
              <Plus size={18} />
              Nova Integração
            </button>
          </div>

          {showForm && (
            <div className="bg-dark-700 rounded-xl p-6 border border-dark-500 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Nova Integração</h3>
                <button onClick={() => setShowForm(false)} className="text-dark-200 hover:text-white"><X size={18} /></button>
              </div>
              <form onSubmit={create} className="space-y-4">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nome da integração"
                  className="w-full bg-dark-600 border border-dark-400 rounded-lg px-4 py-2.5 text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full bg-dark-600 border border-dark-400 rounded-lg px-4 py-2.5 text-white"
                >
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="SMS">SMS</option>
                  <option value="EMAIL">Email</option>
                </select>
                <input
                  value={form.phoneNumberId}
                  onChange={(e) => setForm({ ...form, phoneNumberId: e.target.value })}
                  placeholder="Phone Number ID"
                  className="w-full bg-dark-600 border border-dark-400 rounded-lg px-4 py-2.5 text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <input
                  value={form.accessToken}
                  onChange={(e) => setForm({ ...form, accessToken: e.target.value })}
                  placeholder="Access Token"
                  type="password"
                  className="w-full bg-dark-600 border border-dark-400 rounded-lg px-4 py-2.5 text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm">
                  Criar Integração
                </button>
              </form>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
            </div>
          ) : integrations.length === 0 ? (
            <div className="text-center py-16">
              <Puzzle size={48} className="mx-auto text-dark-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Nenhuma integração</h3>
              <p className="text-dark-200">Conecte WhatsApp, SMS ou Email para começar</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {integrations.map((int) => (
                <div key={int.id} className="bg-dark-700 rounded-xl p-5 border border-dark-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeIcon[int.type]}`}>
                        <MessageSquare size={20} />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{int.name}</h4>
                        <p className="text-xs text-dark-300">{int.type} | {int.isActive ? 'Ativa' : 'Inativa'}</p>
                      </div>
                    </div>
                    <button onClick={() => remove(int.id)} className="p-2 text-dark-200 hover:text-red-400 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
