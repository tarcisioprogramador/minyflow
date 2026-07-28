'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  MessageSquare, GitBranch, BarChart3, Zap, ArrowRight, Check, Menu, X, Sparkles,
  Bot, MessagesSquare, Users, Repeat, Settings, Filter, Radio, Puzzle, Brain, TrendingUp,
} from 'lucide-react';

const WA_NUMBER = '5521996363397';
const WA_MSG = encodeURIComponent('Ola, tenho interesse nesse servico e gostaria de mais informacoes.');
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

function waService(serviceName: string) {
  const msg = encodeURIComponent(`Ola, tenho interesse no servico de ${serviceName} e gostaria de mais informacoes.`);
  return `https://wa.me/${WA_NUMBER}?text=${msg}`;
}

function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 w-full z-50 bg-dark-900/80 backdrop-blur-xl border-b border-dark-500/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <MessageSquare size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Minyflow</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#servicos" className="text-sm text-dark-100 hover:text-white transition-colors">Servicos</a>
          <a href="#como-funciona" className="text-sm text-dark-100 hover:text-white transition-colors">Como Funciona</a>
          <a href="#planos" className="text-sm text-dark-100 hover:text-white transition-colors">Planos</a>
          <Link href="/login" className="text-sm text-dark-100 hover:text-white transition-colors">Entrar</Link>
          <Link href="/register" className="text-sm bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Criar Conta Gratis
          </Link>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden text-white">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-dark-800 border-t border-dark-500 px-4 py-4 space-y-3">
          <a href="#servicos" onClick={() => setOpen(false)} className="block text-dark-100 hover:text-white">Servicos</a>
          <a href="#como-funciona" onClick={() => setOpen(false)} className="block text-dark-100 hover:text-white">Como Funciona</a>
          <a href="#planos" onClick={() => setOpen(false)} className="block text-dark-100 hover:text-white">Planos</a>
          <Link href="/login" onClick={() => setOpen(false)} className="block text-dark-100 hover:text-white">Entrar</Link>
          <Link href="/register" onClick={() => setOpen(false)} className="block bg-primary-600 text-white text-center px-4 py-2.5 rounded-lg font-medium">
            Criar Conta Gratis
          </Link>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-600/5 via-transparent to-transparent" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-600/8 rounded-full blur-3xl" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-primary-600/10 border border-primary-500/20 rounded-full px-4 py-1.5 mb-6">
          <Sparkles size={14} className="text-primary-400" />
          <span className="text-xs font-medium text-primary-400">Automacao e marketing digital para o Brasil</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
          Transforme mensagens em
          <br />
          <span className="text-primary-400">clientes pagantes</span>
        </h1>
        <p className="text-lg sm:text-xl text-dark-100 max-w-2xl mx-auto mb-10 leading-relaxed">
          Chatbots, automacao de conversas, funis de vendas e gestao completa de leads. Tudo em uma so plataforma.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-xl text-base font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            Comecar Gratis
            <ArrowRight size={18} />
          </Link>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 rounded-xl text-base font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <MessageSquare size={18} />
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

const services = [
  {
    icon: Bot,
    title: 'Automacao de Mensagens',
    subtitle: 'Chatbot',
    description: 'Chatbots automaticos para Instagram DM, WhatsApp, Facebook e TikTok. Respostas instantaneas baseadas em acoes do usuario.',
    color: 'bg-blue-500/15 text-blue-400',
    borderColor: 'hover:border-blue-500/30',
    service: 'Automacao de Mensagens (Chatbot)',
  },
  {
    icon: MessagesSquare,
    title: 'Gestao de Conversas',
    subtitle: 'Chat Multicanal',
    description: 'Centralize todas as mensagens em um unico painel. Chat ao vivo, respostas rapidas, nenhum lead perdido.',
    color: 'bg-emerald-500/15 text-emerald-400',
    borderColor: 'hover:border-emerald-500/30',
    service: 'Gestao de Conversas (Chat Multicanal)',
  },
  {
    icon: Users,
    title: 'Geracao de Leads',
    subtitle: 'Captura Inteligente',
    description: 'Capture nome, email e telefone automaticamente. Origem: comentarios, stories, DMs. Transforme seguidores em clientes.',
    color: 'bg-violet-500/15 text-violet-400',
    borderColor: 'hover:border-violet-500/30',
    service: 'Geracao e Captura de Leads',
  },
  {
    icon: Repeat,
    title: 'Funis de Vendas',
    subtitle: 'Automatizados',
    description: 'Jornada automatica: Interesse, Conversa, Qualificacao, Venda. Envio de ofertas, links e cupons direto no chat.',
    color: 'bg-orange-500/15 text-orange-400',
    borderColor: 'hover:border-orange-500/30',
    service: 'Funis de Vendas Automatizados',
  },
  {
    icon: Zap,
    title: 'Automacoes Inteligentes',
    subtitle: 'Gatilhos e Condicoes',
    description: 'Gatilhos por palavra-chave, condicoes, sequencias automaticas, delay inteligente. Tudo configuravel sem codigo.',
    color: 'bg-yellow-500/15 text-yellow-400',
    borderColor: 'hover:border-yellow-500/30',
    service: 'Automacoes Inteligentes',
  },
  {
    icon: Filter,
    title: 'Segmentacao e CRM',
    subtitle: 'Organizacao Total',
    description: 'Organize contatos com tags e segmentos. Personalize mensagens e gestao completa da sua base de clientes.',
    color: 'bg-pink-500/15 text-pink-400',
    borderColor: 'hover:border-pink-500/30',
    service: 'Segmentacao e CRM',
  },
  {
    icon: Radio,
    title: 'Disparo de Mensagens',
    subtitle: 'Broadcast',
    description: 'Envio em massa, campanhas automaticas, agendamento e nutricao de leads. alcance milhares em segundos.',
    color: 'bg-red-500/15 text-red-400',
    borderColor: 'hover:border-red-500/30',
    service: 'Disparo de Mensagens (Broadcast)',
  },
  {
    icon: Puzzle,
    title: 'Integracoes',
    subtitle: 'Multi-plataforma',
    description: 'WhatsApp API, Instagram, Facebook, Email, SMS e Webhooks. Conecte todas as suas ferramentas em um so lugar.',
    color: 'bg-cyan-500/15 text-cyan-400',
    borderColor: 'hover:border-cyan-500/30',
    service: 'Integracoes',
  },
  {
    icon: Brain,
    title: 'IA para Atendimento',
    subtitle: 'Inteligencia Artificial',
    description: 'Respostas automaticas inteligentes, atendimento com IA e assistente de automacao. Atendimento 24h sem equipe.',
    color: 'bg-indigo-500/15 text-indigo-400',
    borderColor: 'hover:border-indigo-500/30',
    service: 'IA para Atendimento',
  },
  {
    icon: BarChart3,
    title: 'Analises e Metricas',
    subtitle: 'Dashboard Completo',
    description: 'Cliques, conversoes, engajamento e otimizacao de campanhas. Dados em tempo real para tomar decisoes rapidas.',
    color: 'bg-teal-500/15 text-teal-400',
    borderColor: 'hover:border-teal-500/30',
    service: 'Analises e Metricas',
  },
];

function Services() {
  return (
    <section id="servicos" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-primary-400 text-sm font-medium mb-3">Nossos Servicos</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Tudo que voce precisa para vender mais</h2>
          <p className="text-dark-100 max-w-2xl mx-auto">
            Da automacao de mensagens a analytics avancado. Uma plataforma completa para transformar seu atendimento em receita.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <div
              key={s.title}
              className={`bg-dark-700 rounded-xl p-6 border border-dark-500 ${s.borderColor} transition-all group hover:shadow-lg hover:shadow-primary-600/5`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${s.color} group-hover:scale-110 transition-transform`}>
                <s.icon size={24} />
              </div>
              <p className="text-xs font-medium text-primary-400 mb-1">{s.subtitle}</p>
              <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
              <p className="text-dark-100 text-sm leading-relaxed mb-5">{s.description}</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href={waService(s.service)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Contratar Agora
                </a>
                <Link
                  href="/register"
                  className="flex-1 text-center bg-dark-600 hover:bg-dark-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Testar Gratis
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { num: '01', title: 'Crie sua conta', desc: 'Cadastre-se gratis em segundos. Sem cartao de credito.' },
  { num: '02', title: 'Monte seu fluxo', desc: 'Use o flow builder visual para criar suas automacoes.' },
  { num: '03', title: 'Conecte o WhatsApp', desc: 'Adicione sua API do WhatsApp Business e comece a automatizar.' },
];

function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 sm:py-28 bg-dark-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-primary-400 text-sm font-medium mb-3">Como Funciona</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Simples de comecar</h2>
          <p className="text-dark-100 max-w-xl mx-auto">
            Em 3 passos simples, voce esta pronto para automatizar seu atendimento.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.num} className="text-center">
              <div className="text-4xl font-bold text-primary-600/30 mb-4">{s.num}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
              <p className="text-dark-100 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const plans = [
  {
    name: 'Basico',
    price: 'Gratis',
    period: '',
    description: 'Para quem esta comecando',
    features: ['100 contatos', '1.000 mensagens/mes', '1 fluxo ativo', '1 automacao', 'Suporte por email'],
    cta: 'Comecar Gratis',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: 'R$ 97',
    period: '/mes',
    description: 'Para negocios em crescimento',
    features: ['5.000 contatos', '10.000 mensagens/mes', 'Fluxos ilimitados', 'Automacoes ilimitadas', 'Integracao WhatsApp', 'Analytics avancado', 'Suporte prioritario'],
    cta: 'Assinar Pro',
    highlighted: true,
  },
  {
    name: 'Premium',
    price: 'R$ 197',
    period: '/mes',
    description: 'Para agencias e empresas',
    features: ['Contatos ilimitados', 'Mensagens ilimitadas', 'Tudo do Pro', 'Multi-usuarios', 'API propria', 'Webhooks', 'Suporte dedicado', 'SLA garantido'],
    cta: 'Falar com Vendas',
    highlighted: false,
  },
];

function Pricing() {
  return (
    <section id="planos" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-primary-400 text-sm font-medium mb-3">Planos</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Preco justo, resultado real</h2>
          <p className="text-dark-100 max-w-xl mx-auto">
            Comece gratis e escale conforme seu negocio cresce.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-xl p-6 border transition-colors ${
                p.highlighted
                  ? 'bg-dark-700 border-primary-500/50 shadow-lg shadow-primary-600/10'
                  : 'bg-dark-700 border-dark-500 hover:border-dark-400'
              }`}
            >
              {p.highlighted && (
                <div className="text-xs font-medium text-primary-400 mb-3">Mais Popular</div>
              )}
              <h3 className="text-lg font-semibold text-white">{p.name}</h3>
              <div className="mt-3 mb-4">
                <span className="text-3xl font-bold text-white">{p.price}</span>
                {p.period && <span className="text-dark-200 text-sm">{p.period}</span>}
              </div>
              <p className="text-dark-200 text-sm mb-5">{p.description}</p>
              <ul className="space-y-2.5 mb-6">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-dark-100">
                    <Check size={16} className="text-primary-400 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-2">
                <Link
                  href="/register"
                  className={`block text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    p.highlighted
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-dark-600 hover:bg-dark-500 text-white'
                  }`}
                >
                  {p.cta}
                </Link>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center py-2.5 rounded-lg text-sm font-medium bg-dark-600 hover:bg-green-700 text-dark-200 hover:text-white transition-colors"
                >
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-dark-500 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
              <MessageSquare size={14} className="text-white" />
            </div>
            <span className="font-bold text-white">Minyflow</span>
          </div>
          <p className="text-dark-300 text-sm">
            2026 Minyflow. Automatize. Conecte. Venda.
          </p>
          <div className="flex items-center gap-6">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="text-dark-200 hover:text-green-400 text-sm transition-colors">WhatsApp</a>
            <Link href="/login" className="text-dark-200 hover:text-white text-sm transition-colors">Entrar</Link>
            <Link href="/register" className="text-dark-200 hover:text-white text-sm transition-colors">Criar Conta</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <Hero />
      <Services />
      <HowItWorks />
      <Pricing />
      <Footer />
    </div>
  );
}
