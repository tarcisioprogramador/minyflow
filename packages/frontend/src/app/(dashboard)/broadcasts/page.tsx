'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { showToast } from '@/components/Toast';
import { Plus, Send, Trash2, X, Radio, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface Broadcast {
  id: string;
  name: string;
  content: string;
  channel: string;
  status: string;
  targetTags: string;
  sentCount: number;
  failCount: number;
  scheduledAt: string | null;
  sentAt: string | null;
  createdAt: string;
}

export default function BroadcastsPage() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', content: '', channel: 'WHATSAPP', targetTags: '' });

  const load = async () => {
    try {
      const data = await api.get<Broadcast[]>('/broadcasts');
      setBroadcasts(data);
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar broadcasts');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/broadcasts', {
        name: form.name,
        content: form.content,
        channel: form.channel,
        targetTags: form.targetTags ? form.targetTags.split(',').map((t) => t.trim()) : [],
      });
      showToast('Broadcast criado', 'success');
      setShowForm(false);
      setForm({ name: '', content: '', channel: 'WHATSAPP', targetTags: '' });
      load();
    } catch (err: any) {
      showToast(err.message || 'Erro ao criar broadcast');
    }
  };

  const sendBroadcast = async (id: string) => {
    if (!confirm('Enviar este broadcast para todos os contatos alvo?')) return;
    try {
      await api.post(`/broadcasts/${id}/send`);
      showToast('Broadcast enviado', 'success');
      load();
    } catch (err: any) {
      showToast(err.message || 'Erro ao enviar broadcast');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Excluir este broadcast?')) return;
    try {
      await api.delete(`/broadcasts/${id}`);
      showToast('Broadcast excluido', 'success');
      load();
    } catch (err: any) {
      showToast(err.message || 'Erro ao excluir broadcast');
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { style: string; label: string; icon: any }> = {
      DRAFT: { style: 'bg-dark-400 text-dark-200', label: 'Rascunho', icon: Radio },
      SENDING: { style: 'bg-yellow-500/20 text-yellow-400', label: 'Enviando', icon: Clock },
      SENT: { style: 'bg-green-500/20 text-green-400', label: 'Enviado', icon: CheckCircle2 },
      FAILED: { style: 'bg-red-500/20 text-red-400', label: 'Falhou', icon: AlertCircle },
    };
    const s = map[status] || map.DRAFT;
    return (
      <span className={`text-xs font-medium px-2 py-1 rounded-full inline-flex items-center gap-1 ${s.style}`}>
        <s.icon size={12} />
        {s.label}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <Header title="Broadcasts" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-dark-200">{broadcasts.length} broadcast(s)</p>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium"
            >
              <Plus size={18} />
              Novo Broadcast
            </button>
          </div>

          {showForm && (
            <div className="bg-dark-700 rounded-xl p-6 border border-dark-500 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Novo Broadcast</h3>
                <button onClick={() => setShowForm(false)} className="text-dark-200 hover:text-white"><X size={18} /></button>
              </div>
              <form onSubmit={create} className="space-y-4">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nome do broadcast"
                  className="w-full bg-dark-600 border border-dark-400 rounded-lg px-4 py-2.5 text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Mensagem a enviar..."
                  rows={4}
                  className="w-full bg-dark-600 border border-dark-400 rounded-lg px-4 py-2.5 text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select
                    value={form.channel}
                    onChange={(e) => setForm({ ...form, channel: e.target.value })}
                    className="bg-dark-600 border border-dark-400 rounded-lg px-4 py-2.5 text-white"
                  >
                    <option value="WHATSAPP">WhatsApp</option>
                    <option value="SMS">SMS</option>
                    <option value="EMAIL">Email</option>
                  </select>
                  <input
                    value={form.targetTags}
                    onChange={(e) => setForm({ ...form, targetTags: e.target.value })}
                    placeholder="Tags alvo (separadas por virgula, vazio = todos)"
                    className="bg-dark-600 border border-dark-400 rounded-lg px-4 py-2.5 text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm">
                  Criar Broadcast
                </button>
              </form>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
            </div>
          ) : broadcasts.length === 0 ? (
            <div className="text-center py-16">
              <Radio size={48} className="mx-auto text-dark-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Nenhum broadcast</h3>
              <p className="text-dark-200">Envie mensagens em massa para seus contatos</p>
            </div>
          ) : (
            <div className="space-y-3">
              {broadcasts.map((b) => {
                const tags: string[] = JSON.parse(b.targetTags || '[]');
                return (
                  <div key={b.id} className="bg-dark-700 rounded-xl p-5 border border-dark-500">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-white font-medium">{b.name}</h4>
                          {statusBadge(b.status)}
                        </div>
                        <p className="text-sm text-dark-200 line-clamp-2 mb-2">{b.content}</p>
                        <div className="flex flex-wrap gap-2 text-xs text-dark-300">
                          <span>{b.channel}</span>
                          {tags.length > 0 && (
                            <span>Alvo: {tags.join(', ')}</span>
                          )}
                          {b.status === 'SENT' && (
                            <span className="text-green-400">{b.sentCount} enviados, {b.failCount} falhas</span>
                          )}
                          <span>{new Date(b.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        {b.status === 'DRAFT' && (
                          <button
                            onClick={() => sendBroadcast(b.id)}
                            className="p-2 text-green-400 hover:text-green-300 hover:bg-dark-600 rounded-lg"
                            title="Enviar"
                          >
                            <Send size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => remove(b.id)}
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
