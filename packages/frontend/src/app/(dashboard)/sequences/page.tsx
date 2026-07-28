'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { showToast } from '@/components/Toast';
import { Plus, Layers, Trash2, X, Play, Pause, Clock } from 'lucide-react';

interface DripStep {
  order: number;
  content: string;
  channel: string;
  delayMinutes: number;
}

interface DripSequence {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  steps: string;
  _count: { enrollments: number };
  createdAt: string;
}

export default function SequencesPage() {
  const [sequences, setSequences] = useState<DripSequence[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [steps, setSteps] = useState<DripStep[]>([
    { order: 1, content: '', channel: 'WHATSAPP', delayMinutes: 0 },
  ]);

  const load = async () => {
    try {
      const data = await api.get<DripSequence[]>('/drip-sequences');
      setSequences(data);
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar sequencias');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addStep = () => {
    setSteps([...steps, { order: steps.length + 1, content: '', channel: 'WHATSAPP', delayMinutes: 60 }]);
  };

  const removeStep = (index: number) => {
    if (steps.length <= 1) return;
    setSteps(steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i + 1 })));
  };

  const updateStep = (index: number, field: string, value: any) => {
    const updated = [...steps];
    (updated as any)[index][field] = value;
    setSteps(updated);
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/drip-sequences', {
        name: form.name,
        description: form.description || undefined,
        steps: steps.map((s, i) => ({ ...s, order: i + 1 })),
      });
      showToast('Sequencia criada', 'success');
      setShowForm(false);
      setForm({ name: '', description: '' });
      setSteps([{ order: 1, content: '', channel: 'WHATSAPP', delayMinutes: 0 }]);
      load();
    } catch (err: any) {
      showToast(err.message || 'Erro ao criar sequencia');
    }
  };

  const toggle = async (id: string, isActive: boolean) => {
    try {
      await api.patch(`/drip-sequences/${id}`, { isActive: !isActive });
      load();
    } catch (err: any) {
      showToast(err.message || 'Erro ao alterar status');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Excluir esta sequencia?')) return;
    try {
      await api.delete(`/drip-sequences/${id}`);
      showToast('Sequencia excluida', 'success');
      load();
    } catch (err: any) {
      showToast(err.message || 'Erro ao excluir sequencia');
    }
  };

  const formatDelay = (minutes: number) => {
    if (minutes === 0) return 'Imediato';
    if (minutes < 60) return `${minutes}min`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
    return `${Math.floor(minutes / 1440)}d`;
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <Header title="Sequencias" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-dark-200">{sequences.length} sequencia(s)</p>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium"
            >
              <Plus size={18} />
              Nova Sequencia
            </button>
          </div>

          {showForm && (
            <div className="bg-dark-700 rounded-xl p-6 border border-dark-500 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Nova Sequencia Drip</h3>
                <button onClick={() => setShowForm(false)} className="text-dark-200 hover:text-white"><X size={18} /></button>
              </div>
              <form onSubmit={create} className="space-y-4">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nome da sequencia"
                  className="w-full bg-dark-600 border border-dark-400 rounded-lg px-4 py-2.5 text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Descricao (opcional)"
                  className="w-full bg-dark-600 border border-dark-400 rounded-lg px-4 py-2.5 text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-dark-100">Passos da Sequencia</h4>
                    <button type="button" onClick={addStep} className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
                      <Plus size={14} /> Adicionar passo
                    </button>
                  </div>
                  {steps.map((step, i) => (
                    <div key={i} className="bg-dark-800 rounded-lg p-4 border border-dark-500 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-primary-400">Passo {i + 1}</span>
                        {steps.length > 1 && (
                          <button type="button" onClick={() => removeStep(i)} className="text-dark-300 hover:text-red-400">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      <textarea
                        value={step.content}
                        onChange={(e) => updateStep(i, 'content', e.target.value)}
                        placeholder="Mensagem deste passo..."
                        rows={2}
                        className="w-full bg-dark-600 border border-dark-400 rounded-lg px-3 py-2 text-sm text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                        required
                      />
                      <div className="flex gap-3">
                        <select
                          value={step.channel}
                          onChange={(e) => updateStep(i, 'channel', e.target.value)}
                          className="bg-dark-600 border border-dark-400 rounded-lg px-3 py-2 text-sm text-white"
                        >
                          <option value="WHATSAPP">WhatsApp</option>
                          <option value="SMS">SMS</option>
                          <option value="EMAIL">Email</option>
                        </select>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-dark-300" />
                          <input
                            type="number"
                            value={step.delayMinutes}
                            onChange={(e) => updateStep(i, 'delayMinutes', parseInt(e.target.value) || 0)}
                            className="w-20 bg-dark-600 border border-dark-400 rounded-lg px-3 py-2 text-sm text-white"
                            min={0}
                          />
                          <span className="text-xs text-dark-300">min</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm">
                  Criar Sequencia
                </button>
              </form>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
            </div>
          ) : sequences.length === 0 ? (
            <div className="text-center py-16">
              <Layers size={48} className="mx-auto text-dark-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Nenhuma sequencia</h3>
              <p className="text-dark-200">Crie sequencias drip para nutrir seus contatos</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sequences.map((seq) => {
                const stepsData: DripStep[] = JSON.parse(seq.steps || '[]');
                return (
                  <div key={seq.id} className="bg-dark-700 rounded-xl p-5 border border-dark-500">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-white font-medium">{seq.name}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${seq.isActive ? 'bg-green-500/20 text-green-400' : 'bg-dark-400 text-dark-200'}`}>
                            {seq.isActive ? 'Ativa' : 'Pausada'}
                          </span>
                        </div>
                        {seq.description && <p className="text-sm text-dark-200 mb-1">{seq.description}</p>}
                        <div className="flex items-center gap-2 text-xs text-dark-300 mt-2">
                          <span>{stepsData.length} passos</span>
                          <span>|</span>
                          <span>{seq._count.enrollments} inscrito(s)</span>
                          <span>|</span>
                          <span>{stepsData.map((s) => formatDelay(s.delayMinutes)).join(' → ')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        <button
                          onClick={() => toggle(seq.id, seq.isActive)}
                          className="p-2 text-dark-200 hover:text-white hover:bg-dark-600 rounded-lg"
                          title={seq.isActive ? 'Pausar' : 'Ativar'}
                        >
                          {seq.isActive ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                        <button
                          onClick={() => remove(seq.id)}
                          className="p-2 text-dark-200 hover:text-red-400 hover:bg-dark-600 rounded-lg"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
