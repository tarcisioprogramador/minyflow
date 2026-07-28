'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { showToast } from '@/components/Toast';
import { Plus, GitBranch, Play, Pause, Copy, Trash2 } from 'lucide-react';

interface Flow {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
  _count: { automations: number };
}

export default function FlowsPage() {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');

  const loadFlows = async () => {
    try {
      const data = await api.get<Flow[]>('/flows');
      setFlows(data);
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar fluxos');
    }
    setLoading(false);
  };

  useEffect(() => { loadFlows(); }, []);

  const createFlow = async () => {
    if (!newName.trim()) return;
    try {
      await api.post('/flows', { name: newName });
      showToast('Fluxo criado', 'success');
      setNewName('');
      setShowCreate(false);
      loadFlows();
    } catch (err: any) {
      showToast(err.message || 'Erro ao criar fluxo');
    }
  };

  const toggleFlow = async (id: string) => {
    try {
      await api.patch(`/flows/${id}/toggle`);
      loadFlows();
    } catch (err: any) {
      showToast(err.message || 'Erro ao alterar status');
    }
  };

  const duplicateFlow = async (id: string) => {
    try {
      await api.post(`/flows/${id}/duplicate`);
      showToast('Fluxo duplicado', 'success');
      loadFlows();
    } catch (err: any) {
      showToast(err.message || 'Erro ao duplicar fluxo');
    }
  };

  const deleteFlow = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este fluxo?')) return;
    try {
      await api.delete(`/flows/${id}`);
      showToast('Fluxo excluído', 'success');
      loadFlows();
    } catch (err: any) {
      showToast(err.message || 'Erro ao excluir fluxo');
    }
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ACTIVE: 'bg-green-500/20 text-green-400',
      PAUSED: 'bg-yellow-500/20 text-yellow-400',
      DRAFT: 'bg-dark-400 text-dark-200',
    };
    const labels: Record<string, string> = {
      ACTIVE: 'Ativo',
      PAUSED: 'Pausado',
      DRAFT: 'Rascunho',
    };
    return (
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <Header title="Fluxos" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-dark-200">{flows.length} fluxo(s) criado(s)</p>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={18} />
              Novo Fluxo
            </button>
          </div>

          {showCreate && (
            <div className="bg-dark-700 rounded-xl p-6 border border-dark-500 mb-6">
              <h3 className="text-white font-medium mb-3">Criar novo fluxo</h3>
              <div className="flex gap-3">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nome do fluxo"
                  className="flex-1 bg-dark-600 border border-dark-400 rounded-lg px-4 py-2.5 text-white placeholder-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
                <button onClick={createFlow} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm">
                  Criar
                </button>
                <button onClick={() => setShowCreate(false)} className="bg-dark-600 hover:bg-dark-500 text-white px-4 py-2.5 rounded-lg text-sm">
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
            </div>
          ) : flows.length === 0 ? (
            <div className="text-center py-16">
              <GitBranch size={48} className="mx-auto text-dark-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Nenhum fluxo criado</h3>
              <p className="text-dark-200 mb-4">Crie seu primeiro fluxo de automação</p>
              <button
                onClick={() => setShowCreate(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                Criar Primeiro Fluxo
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {flows.map((flow) => (
                <div key={flow.id} className="bg-dark-700 rounded-xl p-5 border border-dark-500 hover:border-dark-400 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <Link href={`/flows/${flow.id}`} className="text-white font-medium hover:text-primary-400 transition-colors">
                          {flow.name}
                        </Link>
                        {statusBadge(flow.status)}
                      </div>
                      {flow.description && (
                        <p className="text-sm text-dark-200">{flow.description}</p>
                      )}
                      <p className="text-xs text-dark-300 mt-1">
                        {flow._count.automations} automação(ões) | Criado em {new Date(flow.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/flows/${flow.id}`}
                        className="p-2 text-dark-200 hover:text-white hover:bg-dark-600 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <GitBranch size={16} />
                      </Link>
                      <button
                        onClick={() => toggleFlow(flow.id)}
                        className="p-2 text-dark-200 hover:text-white hover:bg-dark-600 rounded-lg transition-colors"
                        title={flow.status === 'ACTIVE' ? 'Pausar' : 'Ativar'}
                      >
                        {flow.status === 'ACTIVE' ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                      <button
                        onClick={() => duplicateFlow(flow.id)}
                        className="p-2 text-dark-200 hover:text-white hover:bg-dark-600 rounded-lg transition-colors"
                        title="Duplicar"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => deleteFlow(flow.id)}
                        className="p-2 text-dark-200 hover:text-red-400 hover:bg-dark-600 rounded-lg transition-colors"
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
