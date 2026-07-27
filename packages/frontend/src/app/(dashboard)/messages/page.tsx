'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  channel: string;
  status: string;
  sentAt: string;
  contact: { id: string; name: string; phone: string };
}

interface Contact {
  id: string;
  name: string;
  phone: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactId, setContactId] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get<{ data: Message[] }>('/messages'),
      api.get<{ data: Contact[] }>('/contacts?limit=100'),
    ]).then(([msgs, conts]) => {
      setMessages(msgs.data);
      setContacts(conts.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactId || !content.trim()) return;
    setSending(true);
    try {
      const msg = await api.post<Message>('/messages', { contactId, content });
      setMessages((prev) => [msg, ...prev]);
      setContent('');
    } catch {}
    setSending(false);
  };

  const statusColor: Record<string, string> = {
    SENT: 'text-green-400',
    PENDING: 'text-yellow-400',
    FAILED: 'text-red-400',
    DELIVERED: 'text-blue-400',
    READ: 'text-purple-400',
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <Header title="Mensagens" />
        <div className="p-6">
          <form onSubmit={handleSend} className="bg-dark-700 rounded-xl p-5 border border-dark-500 mb-6">
            <h3 className="text-white font-medium mb-3">Enviar Mensagem</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={contactId}
                onChange={(e) => setContactId(e.target.value)}
                className="bg-dark-600 border border-dark-400 rounded-lg px-4 py-2.5 text-white flex-1"
                required
              >
                <option value="">Selecionar contato</option>
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>{c.name || c.phone}</option>
                ))}
              </select>
              <input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="bg-dark-600 border border-dark-400 rounded-lg px-4 py-2.5 text-white placeholder-dark-300 flex-[2] focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <button
                type="submit"
                disabled={sending}
                className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                <Send size={16} />
                {sending ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </form>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-dark-200">Nenhuma mensagem enviada</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className="bg-dark-700 rounded-xl p-4 border border-dark-500">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-white text-sm font-medium">{msg.contact.name || msg.contact.phone}</span>
                      <span className="text-dark-300 text-xs ml-2">{msg.channel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${statusColor[msg.status]}`}>{msg.status}</span>
                      <span className="text-dark-300 text-xs">
                        {msg.sentAt ? new Date(msg.sentAt).toLocaleString('pt-BR') : '-'}
                      </span>
                    </div>
                  </div>
                  <p className="text-dark-100 text-sm">{msg.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
