'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { showToast } from '@/components/Toast';
import { Plus, Filter, Trash2, X, Users, RefreshCw } from 'lucide-react';

interface SegmentRule {
  field: string;
  operator: string;
  value: string;
}

interface Segment {
  id: string;
  name: string;
  rules: string;
  contactCount: number;
  createdAt: string;
}

export default function SegmentsPage() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '' });
  const [rules, setRules] = useState<SegmentRule[]>([
    { field: 'tag', operator: 'equals', value: '' },
  ]);

  const load = async () => {
    try {
      const data = await api.get<Segment[]>('/segments');
      setSegments(data);
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar segmentos');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addRule = () => {
    setRules([...rules, { field: 'tag', operator: 'equals', value: '' }]);
  };

  const removeRule = (index: number) => {
    if (rules.length <= 1) return;
    setRules(rules.filter((_, i) => i !== index));
  };

  const updateRule = (index: number, field: string, value: string) => {
    const updated = [...rules];
    (updated as any)[index][field] = value;
    setRules(updated);
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/segments', { name: form.name, rules });
      showToast('Segmento criado', 'success');
      setShowForm(false);
      setForm({ name: '' });
      setRules([{ field: 'tag', operator: 'equals', value: '' }]);
      load();
    } catch (err: any) {
      showToast(err.message || 'Erro ao criar segmento');
    }
  };

  const refresh = async (id: string) => {
    try {
      await api.post(`/segments/${id}/refresh`);
      showToast('Segmento recalculado', 'success');
      load();
    } catch (err: any) {
      showToast(err.message || 'Erro ao recalcular');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Excluir este segmento?')) return;
    try {
      await api.delete(`/segments/${id}`);
      showToast('Segmento excluido', 'success');
      load();
    } catch (err: any) {
      showToast(err.message || 'Erro ao excluir segmento');
    }
  };

  const formatRule = (rule: SegmentRule) => {
    const fieldMap: Record<string, string> = { tag: 'Tag', name: 'Nome', email: 'Email' };
    const opMap: Record<string, string> = { equals: '=', contains: 'contem', not_equals: '!=' };
    return `${fieldMap[rule.field] || rule.field} ${opMap[rule.operator] || rule.operator} "${rule.value}"`;
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <Header title="Segmentos" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-dark-200">{segments.length} segmento(s)</p>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium"
            >
              <Plus size={18} />
              Novo Segmento
            </button>
          </div>

          {showForm && (
            <div className="bg-dark-700 rounded-xl p-6 border border-dark-500 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Novo Segmento</h3>
                <button onClick={() => setShowForm(false)} className="text-dark-200 hover:text-white"><X size={18} /></button>
              </div>
              <form onSubmit={create} className="space-y-4">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nome do segmento (ex: VIP Clients)"
                  className="w-full bg-dark-600 border border-dark-400 rounded-lg px-4 py-2.5 text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-dark-100">Regras</h4>
                    <button type="button" onClick={addRule} className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
                      <Plus size={14} /> Adicionar regra
                    </button>
                  </div>
                  {rules.map((rule, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <select
                        value={rule.field}
                        onChange={(e) => updateRule(i, 'field', e.target.value)}
                        className="bg-dark-600 border border-dark-400 rounded-lg px-3 py-2 text-sm text-white"
                      >
                        <option value="tag">Tag</option>
                        <option value="name">Nome</option>
                        <option value="email">Email</option>
                      </select>
                      <select
                        value={rule.operator}
                        onChange={(e) => updateRule(i, 'operator', e.target.value)}
                        className="bg-dark-600 border border-dark-400 rounded-lg px-3 py-2 text-sm text-white"
                      >
                        <option value="equals">Igual a</option>
                        <option value="contains">Contem</option>
                        <option value="not_equals">Diferente de</option>
                      </select>
                      <input
                        value={rule.value}
                        onChange={(e) => updateRule(i, 'value', e.target.value)}
                        placeholder="Valor"
                        className="flex-1 bg-dark-600 border border-dark-400 rounded-lg px-3 py-2 text-sm text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                      {rules.length > 1 && (
                        <button type="button" onClick={() => removeRule(i)} className="text-dark-300 hover:text-red-400">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm">
                  Criar Segmento
                </button>
              </form>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
            </div>
          ) : segments.length === 0 ? (
            <div className="text-center py-16">
              <Filter size={48} className="mx-auto text-dark-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Nenhum segmento</h3>
              <p className="text-dark-200">Crie segmentos para filtrar contatos por regras</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {segments.map((seg) => {
                const rulesData: SegmentRule[] = JSON.parse(seg.rules || '[]');
                return (
                  <div key={seg.id} className="bg-dark-700 rounded-xl p-5 border border-dark-500">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-white font-medium">{seg.name}</h4>
                          <div className="flex items-center gap-1 text-xs text-primary-400">
                            <Users size={12} />
                            <span>{seg.contactCount}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {rulesData.map((rule, i) => (
                            <p key={i} className="text-xs text-dark-300 flex items-center gap-1">
                              {i > 0 && <span className="text-dark-400">E</span>}
                              {formatRule(rule)}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        <button
                          onClick={() => refresh(seg.id)}
                          className="p-2 text-dark-200 hover:text-white hover:bg-dark-600 rounded-lg"
                          title="Recalcular"
                        >
                          <RefreshCw size={14} />
                        </button>
                        <button
                          onClick={() => remove(seg.id)}
                          className="p-2 text-dark-200 hover:text-red-400 hover:bg-dark-600 rounded-lg"
                          title="Excluir"
                        >
                          <Trash2 size={14} />
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
