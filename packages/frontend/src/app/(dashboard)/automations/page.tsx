'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Plus, Zap, Power, Trash2, X } from 'lucide-react';

interface Automation {
  id: string;
  name: string;
  trigger: any;
  isActive: boolean;
  flow: { id: string; name: string; status: string };
  createdAt: string;
}

interface Flow {
  id: string;
  name: string;
}

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', flowId: '', keyword: '' });

  const load = async () => {
    try {
      const [autos, fls] = await Promise.all([
        api.get<Automation[]>('/automations'),
        api.get<Flow[]>('/flows'),
      ]);
      setAutomations(autos);
      setFlows(fls);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/automations', {
        name: form.name,
        flowId: form.flowId,
        trigger: { type: 'KEYWORD', keyword: form.keyword, matchType: 'contains' },
      });
      setShowForm(false);
      setForm({ name: '', flowId: '', keyword: '' });
      load();
    } catch {}
  };

  const toggle = async (id: string) => {
    await api.patch(`/automations/${id}/toggle`);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Excluir esta automação?')) return;
    await api.delete(`/automations/${id}`);
    load();
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <Header title="Automações" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-dark-200">{automations.length} automação(ões)</p>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium"
            >
              <Plus size={18} />
              Nova Automação
            </button>
          </div>

          {showForm && (
            <div className="bg-dark-700 rounded-xl p-6 border border-dark-500 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Nova Automação</h3>
                <button onClick={() => setShowForm(false)} className="text-dark-200 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={create} className="space-y-4">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nome da automação"
                  className="w-full bg-dark-600 border border-dark-400 rounded-lg px-4 py-2.5 text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <select
                  value={form.flowId}
                  onChange={(e) => setForm({ ...form, flowId: e.target.value })}
                  className="w-full bg-dark-600 border border-dark-400 rounded-lg px-4 py-2.5 text-white"
                  required
                >
                  <option value="">Selecionar fluxo</option>
                  {flows.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
                <input
                  value={form.keyword}
                  onChange={(e) => setForm({ ...form, keyword: e.target.value })}
                  placeholder="Palavra-chave (ex: oi, comprar, preco)"
                  className="w-full bg-dark-600 border border-dark-400 rounded-lg px-4 py-2.5 text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm">
                  Criar Automação
                </button>
              </form>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
            </div>
          ) : automations.length === 0 ? (
            <div className="text-center py-16">
              <Zap size={48} className="mx-auto text-dark-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Nenhuma automação criada</h3>
              <p className="text-dark-200">Crie automações para responder mensagens automaticamente</p>
            </div>
          ) : (
            <div className="space-y-3">
              {automations.map((auto) => (
                <div key={auto.id} className="bg-dark-700 rounded-xl p-5 border border-dark-500">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="text-white font-medium">{auto.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${auto.isActive ? 'bg-green-500/20 text-green-400' : 'bg-dark-400 text-dark-200'}`}>
                          {auto.isActive ? 'Ativa' : 'Inativa'}
                        </span>
                      </div>
                      <p className="text-sm text-dark-200 mt-1">
                        Gatilho: &quot;{auto.trigger.keyword}&quot; &rarr; Fluxo: {auto.flow.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggle(auto.id)}
                        className="p-2 text-dark-200 hover:text-white hover:bg-dark-600 rounded-lg"
                        title={auto.isActive ? 'Desativar' : 'Ativar'}
                      >
                        <Power size={16} />
                      </button>
                      <button
                        onClick={() => remove(auto.id)}
                        className="p-2 text-dark-200 hover:text-red-400 hover:bg-dark-600 rounded-lg"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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
