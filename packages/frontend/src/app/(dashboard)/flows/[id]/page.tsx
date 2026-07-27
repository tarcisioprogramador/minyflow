'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import ReactFlow, {
  addEdge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { api } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { MessageSquare, Clock, Zap, Flag, AlertCircle } from 'lucide-react';

function TriggerNode({ data }: any) {
  return (
    <div className="bg-green-600/20 border border-green-500/40 rounded-xl px-4 py-3 min-w-[180px]">
      <div className="flex items-center gap-2">
        <Zap size={16} className="text-green-400" />
        <span className="text-green-400 text-xs font-medium">GATILHO</span>
      </div>
      <p className="text-white text-sm mt-1">{data.label || 'Mensagem recebida'}</p>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-green-500" />
    </div>
  );
}

function MessageNode({ data }: any) {
  return (
    <div className="bg-blue-600/20 border border-blue-500/40 rounded-xl px-4 py-3 min-w-[180px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" />
      <div className="flex items-center gap-2">
        <MessageSquare size={16} className="text-blue-400" />
        <span className="text-blue-400 text-xs font-medium">MENSAGEM</span>
      </div>
      <p className="text-white text-sm mt-1">{data.label || 'Olá! Como posso ajudar?'}</p>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
    </div>
  );
}

function ConditionNode({ data }: any) {
  return (
    <div className="bg-yellow-600/20 border border-yellow-500/40 rounded-xl px-4 py-3 min-w-[180px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-yellow-500" />
      <div className="flex items-center gap-2">
        <AlertCircle size={16} className="text-yellow-400" />
        <span className="text-yellow-400 text-xs font-medium">CONDIÇÃO</span>
      </div>
      <p className="text-white text-sm mt-1">{data.label || 'Se contém "comprar"'}</p>
      <Handle type="source" position={Position.Bottom} id="yes" style={{ left: '30%' }} className="w-3 h-3 bg-green-500" />
      <Handle type="source" position={Position.Bottom} id="no" style={{ left: '70%' }} className="w-3 h-3 bg-red-500" />
    </div>
  );
}

function WaitNode({ data }: any) {
  return (
    <div className="bg-purple-600/20 border border-purple-500/40 rounded-xl px-4 py-3 min-w-[180px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-purple-500" />
      <div className="flex items-center gap-2">
        <Clock size={16} className="text-purple-400" />
        <span className="text-purple-400 text-xs font-medium">ESPERA</span>
      </div>
      <p className="text-white text-sm mt-1">{data.label || 'Aguardar 5 minutos'}</p>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-purple-500" />
    </div>
  );
}

function EndNode({ data }: any) {
  return (
    <div className="bg-red-600/20 border border-red-500/40 rounded-xl px-4 py-3 min-w-[180px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-red-500" />
      <div className="flex items-center gap-2">
        <Flag size={16} className="text-red-400" />
        <span className="text-red-400 text-xs font-medium">FIM</span>
      </div>
      <p className="text-white text-sm mt-1">{data.label || 'Fim do fluxo'}</p>
    </div>
  );
}

const nodeTypes = {
  trigger: TriggerNode,
  message: MessageNode,
  condition: ConditionNode,
  wait: WaitNode,
  end: EndNode,
};

function FlowEditor() {
  const params = useParams();
  const flowId = params.id as string;
  const [flowName, setFlowName] = useState('');
  const [saving, setSaving] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    api.get<any>(`/flows/${flowId}`).then((flow) => {
      setFlowName(flow.name);
      if (flow.nodes && Array.isArray(flow.nodes)) setNodes(flow.nodes);
      if (flow.edges && Array.isArray(flow.edges)) setEdges(flow.edges);
    });
  }, [flowId]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  );

  const addNode = (type: string) => {
    const id = `${type}-${Date.now()}`;
    const labels: Record<string, string> = {
      trigger: 'Nova mensagem',
      message: 'Nova mensagem',
      condition: 'Nova condição',
      wait: 'Esperar',
      end: 'Fim',
    };
    const newNode = {
      id,
      type,
      position: { x: 250, y: (nodes.length + 1) * 120 },
      data: { label: labels[type] },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const saveFlow = async () => {
    setSaving(true);
    try {
      await api.patch(`/flows/${flowId}`, {
        name: flowName,
        nodes: nodes.map((n) => ({ ...n })),
        edges: edges.map((e) => ({ ...e })),
      });
    } catch {}
    setSaving(false);
  };

  const nodeToolbar = [
    { type: 'trigger', label: 'Gatilho', icon: Zap, color: 'bg-green-600 hover:bg-green-700' },
    { type: 'message', label: 'Mensagem', icon: MessageSquare, color: 'bg-blue-600 hover:bg-blue-700' },
    { type: 'condition', label: 'Condição', icon: AlertCircle, color: 'bg-yellow-600 hover:bg-yellow-700' },
    { type: 'wait', label: 'Espera', icon: Clock, color: 'bg-purple-600 hover:bg-purple-700' },
    { type: 'end', label: 'Fim', icon: Flag, color: 'bg-red-600 hover:bg-red-700' },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64 flex flex-col">
        <Header title={`Fluxo: ${flowName}`} />
        <div className="flex items-center justify-between px-6 py-3 border-b border-dark-500 bg-dark-800/30">
          <div className="flex items-center gap-2 flex-wrap">
            {nodeToolbar.map((item) => (
              <button
                key={item.type}
                onClick={() => addNode(item.type)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-medium ${item.color} transition-colors`}
              >
                <item.icon size={14} />
                {item.label}
              </button>
            ))}
          </div>
          <button
            onClick={saveFlow}
            disabled={saving}
            className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <Background color="#373A40" gap={20} />
          </ReactFlow>
        </div>
      </main>
    </div>
  );
}

export default function FlowEditorPage() {
  return (
    <ReactFlowProvider>
      <FlowEditor />
    </ReactFlowProvider>
  );
}
