'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { showToast } from '@/components/Toast';
import { Plus, Search, Trash2, Edit, X } from 'lucide-react';

interface Contact {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  tags: string[];
  createdAt: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [form, setForm] = useState({ phone: '', name: '', email: '', tags: '' });
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

  const loadContacts = async (page = 1) => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      const res = await api.get<{ data: Contact[]; pagination: any }>(`/contacts?${params}`);
      setContacts(res.data);
      setPagination(res.pagination);
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar contatos');
    }
    setLoading(false);
  };

  useEffect(() => { loadContacts(); }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      phone: form.phone,
      name: form.name || undefined,
      email: form.email || undefined,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
    };

    try {
      if (editingContact) {
        await api.patch(`/contacts/${editingContact.id}`, data);
        showToast('Contato atualizado', 'success');
      } else {
        await api.post('/contacts', data);
        showToast('Contato criado', 'success');
      }
      setShowForm(false);
      setEditingContact(null);
      setForm({ phone: '', name: '', email: '', tags: '' });
      loadContacts();
    } catch (err: any) {
      showToast(err.message || 'Erro ao salvar contato');
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setForm({
      phone: contact.phone,
      name: contact.name || '',
      email: contact.email || '',
      tags: contact.tags.join(', '),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este contato?')) return;
    try {
      await api.delete(`/contacts/${id}`);
      showToast('Contato excluído', 'success');
      loadContacts();
    } catch (err: any) {
      showToast(err.message || 'Erro ao excluir contato');
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <Header title="Contatos" />
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-300" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar contatos..."
                className="w-full bg-dark-600 border border-dark-400 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              onClick={() => { setEditingContact(null); setForm({ phone: '', name: '', email: '', tags: '' }); setShowForm(true); }}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium"
            >
              <Plus size={18} />
              Novo Contato
            </button>
          </div>

          {showForm && (
            <div className="bg-dark-700 rounded-xl p-6 border border-dark-500 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">
                  {editingContact ? 'Editar Contato' : 'Novo Contato'}
                </h3>
                <button onClick={() => { setShowForm(false); setEditingContact(null); }} className="text-dark-200 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Telefone (+5511999999999)"
                  className="bg-dark-600 border border-dark-400 rounded-lg px-4 py-2.5 text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nome"
                  className="bg-dark-600 border border-dark-400 rounded-lg px-4 py-2.5 text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email"
                  className="bg-dark-600 border border-dark-400 rounded-lg px-4 py-2.5 text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="Tags (separadas por vírgula)"
                  className="bg-dark-600 border border-dark-400 rounded-lg px-4 py-2.5 text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <div className="sm:col-span-2 flex gap-3">
                  <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm">
                    {editingContact ? 'Salvar' : 'Criar'}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setEditingContact(null); }} className="bg-dark-600 hover:bg-dark-500 text-white px-4 py-2.5 rounded-lg text-sm">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-dark-200">Nenhum contato encontrado</p>
            </div>
          ) : (
            <div className="bg-dark-700 rounded-xl border border-dark-500 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-500">
                    <th className="text-left px-5 py-3 text-xs font-medium text-dark-200 uppercase">Contato</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-dark-200 uppercase hidden sm:table-cell">Telefone</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-dark-200 uppercase hidden md:table-cell">Tags</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-dark-200 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="border-b border-dark-600 hover:bg-dark-600/50 transition-colors">
                      <td className="px-5 py-3">
                        <p className="text-white text-sm font-medium">{contact.name || 'Sem nome'}</p>
                        <p className="text-dark-300 text-xs">{contact.email || contact.phone}</p>
                      </td>
                      <td className="px-5 py-3 text-sm text-dark-200 hidden sm:table-cell">{contact.phone}</td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {contact.tags.map((tag) => (
                            <span key={tag} className="text-xs bg-primary-600/20 text-primary-400 px-2 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button onClick={() => handleEdit(contact)} className="p-1.5 text-dark-300 hover:text-white rounded-lg">
                          <Edit size={15} />
                        </button>
                        <button onClick={() => handleDelete(contact.id)} className="p-1.5 text-dark-300 hover:text-red-400 rounded-lg">
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => loadContacts(p)}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    p === pagination.page ? 'bg-primary-600 text-white' : 'bg-dark-600 text-dark-200 hover:bg-dark-500'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
