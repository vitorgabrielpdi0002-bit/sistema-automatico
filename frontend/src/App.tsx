import { useState } from 'react';
import { 
  Users, 
  CreditCard, 
  ShieldCheck, 
  ScanFace, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Plus, 
  Bell, 
  DollarSign, 
  TrendingUp, 
  UserCheck 
} from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  cpf: string;
  plan: string;
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELED';
  facialRegistered: boolean;
  avatarUrl: string;
  lastAccess?: string;
}

interface CheckInLog {
  id: string;
  memberName: string;
  timestamp: string;
  status: 'ALLOWED' | 'DENIED';
  reason: string;
  device: string;
  photoUrl: string;
}

const initialMembers: Member[] = [
  {
    id: '1',
    name: 'Carlos Henrique Silva',
    email: 'carlos.silva@email.com',
    cpf: '123.456.789-00',
    plan: 'Plano Black Anual',
    status: 'ACTIVE',
    facialRegistered: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    lastAccess: 'Hoje às 14:15'
  },
  {
    id: '2',
    name: 'Mariana Duarte Souza',
    email: 'mariana.d@email.com',
    cpf: '987.654.321-11',
    plan: 'Plano Mensal Gold',
    status: 'PAST_DUE',
    facialRegistered: true,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    lastAccess: 'Ontem às 18:30'
  },
  {
    id: '3',
    name: 'Rodrigo Lima Santos',
    email: 'rodrigo.lima@email.com',
    cpf: '456.789.123-22',
    plan: 'Plano Semestral',
    status: 'ACTIVE',
    facialRegistered: false,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    lastAccess: 'Hoje às 08:45'
  },
  {
    id: '4',
    name: 'Beatriz Almeida',
    email: 'beatriz.a@email.com',
    cpf: '789.123.456-33',
    plan: 'Plano Black Anual',
    status: 'ACTIVE',
    facialRegistered: true,
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    lastAccess: 'Hoje às 13:50'
  }
];

const initialLogs: CheckInLog[] = [
  {
    id: 'log-1',
    memberName: 'Carlos Henrique Silva',
    timestamp: '14:15:32',
    status: 'ALLOWED',
    reason: 'Acesso Liberado • Plano Ativo',
    device: 'Catraca 01 (Entrada Principal)',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'log-2',
    memberName: 'Mariana Duarte Souza',
    timestamp: '14:02:11',
    status: 'DENIED',
    reason: 'Acesso Bloqueado • Assinatura Atrasada',
    device: 'Catraca 01 (Entrada Principal)',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'log-3',
    memberName: 'Beatriz Almeida',
    timestamp: '13:50:04',
    status: 'ALLOWED',
    reason: 'Acesso Liberado • Biometria Confirmada',
    device: 'Catraca 02 (Entrada VIP)',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'monitoring' | 'members' | 'financial'>('monitoring');
  const [members] = useState<Member[]>(initialMembers);
  const [logs, setLogs] = useState<CheckInLog[]>(initialLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSimulatingAccess, setIsSimulatingAccess] = useState(false);

  const simulateTurnstileScan = (member: Member) => {
    setIsSimulatingAccess(true);
    setTimeout(() => {
      const isAllowed = member.status === 'ACTIVE';
      const newLog: CheckInLog = {
        id: `log-${Date.now()}`,
        memberName: member.name,
        timestamp: new Date().toLocaleTimeString(),
        status: isAllowed ? 'ALLOWED' : 'DENIED',
        reason: isAllowed ? 'Acesso Liberado • Biometria Confirmada' : 'Acesso Bloqueado • Mensalidade Pendente',
        device: 'Catraca 01 (Entrada)',
        photoUrl: member.avatarUrl
      };
      setLogs(prev => [newLog, ...prev]);
      setIsSimulatingAccess(false);
    }, 600);
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.cpf.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <ScanFace className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-400 to-amber-300 bg-clip-text text-transparent">
              FITPASS AUTOMATION
            </span>
            <p className="text-xs text-slate-400">Controle de Acesso Biométrico & Assinaturas</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'monitoring'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            Catraca em Tempo Real
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'members'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Alunos & Biometria
          </button>
          <button
            onClick={() => setActiveTab('financial')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'financial'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Financeiro & Planos
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Catraca 01 Conectada
          </div>
          <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200">
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Acessos Hoje</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">142</h3>
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> +18% vs ontem
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Bloqueios Inadimplência</p>
              <h3 className="text-2xl font-bold text-rose-400 mt-1">3</h3>
              <span className="text-xs text-slate-400 font-medium mt-1">Prevenção automática</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Alunos Ativos</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">428</h3>
              <span className="text-xs text-slate-400 font-medium mt-1">89% com biometria</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Receita Mensal (Recorrente)</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">R$ 48.900</h3>
              <span className="text-xs text-emerald-400 font-medium mt-1">Cobrança via Webhook</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab 1: Real-time Access Monitoring */}
        {activeTab === 'monitoring' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Camera/Scanner Simulation */}
            <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ScanFace className="w-5 h-5 text-emerald-400" />
                    <h2 className="font-semibold text-slate-100">Leitor Facial Ativo</h2>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Live Stream
                  </span>
                </div>

                <div className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center group">
                  {/* Face targeting HUD overlay */}
                  <div className="absolute inset-8 border-2 border-dashed border-emerald-500/40 rounded-2xl flex items-center justify-center">
                    <span className="text-xs font-mono text-emerald-500/70 uppercase">Posicione o rosto</span>
                  </div>
                  <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded">
                    FPS: 30 • Res: 1080p
                  </div>
                  {isSimulatingAccess && (
                    <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[2px] flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-xs font-medium text-emerald-400">Processando biometria...</p>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-slate-500">Câmera Intelbras Facial IP (Simulada)</p>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-slate-400 mb-2 font-medium">Testar leitura rápida de aluno:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {members.slice(0, 2).map(m => (
                      <button
                        key={m.id}
                        disabled={isSimulatingAccess}
                        onClick={() => simulateTurnstileScan(m)}
                        className="text-left p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs transition-colors flex items-center gap-2"
                      >
                        <img src={m.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                        <span className="truncate">{m.name.split(' ')[0]} ({m.status})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Catraca 01: Relé Liberado</span>
                <span className="text-emerald-400 font-semibold">12V DC OK</span>
              </div>
            </div>

            {/* Check-in Activity Feed */}
            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-slate-100 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    Feed de Acessos em Tempo Real
                  </h2>
                  <p className="text-xs text-slate-400">Registro instantâneo de cada passagem pela catraca</p>
                </div>
                <span className="text-xs text-slate-400 font-mono">Total logs: {logs.length}</span>
              </div>

              <div className="space-y-3">
                {logs.map(log => (
                  <div 
                    key={log.id} 
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={log.photoUrl} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-800" />
                      <div>
                        <h4 className="text-sm font-semibold text-slate-200">{log.memberName}</h4>
                        <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{log.device}</span>
                          <span>•</span>
                          <span className="font-mono">{log.timestamp}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      {log.status === 'ALLOWED' ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Liberado
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                          <XCircle className="w-3.5 h-3.5" />
                          Bloqueado
                        </div>
                      )}
                      <p className="text-[11px] text-slate-500 mt-1">{log.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Members & Biometry */}
        {activeTab === 'members' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-semibold text-slate-100">Cadastro de Alunos & Biometrias</h2>
                <p className="text-xs text-slate-400">Gerencie fotos de reconhecimento facial e status de assinaturas</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou CPF..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500 w-64"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all">
                  <Plus className="w-4 h-4" />
                  Novo Aluno
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="pb-3 px-4">Aluno</th>
                    <th className="pb-3 px-4">CPF / Contato</th>
                    <th className="pb-3 px-4">Plano Atual</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 px-4">Biometria Facial</th>
                    <th className="pb-3 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredMembers.map(member => (
                    <tr key={member.id} className="hover:bg-slate-950/40 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img src={member.avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-800" />
                        <div>
                          <p className="font-semibold text-slate-200">{member.name}</p>
                          <p className="text-[11px] text-slate-400">{member.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-mono">{member.cpf}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 font-medium">
                          {member.plan}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {member.status === 'ACTIVE' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            Ativo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-400 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                            Atrasado
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {member.facialRegistered ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium">
                            <ScanFace className="w-3.5 h-3.5" />
                            Cadastrada
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-medium">
                            Pendente
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button 
                          onClick={() => simulateTurnstileScan(member)}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 transition-colors font-medium"
                        >
                          Simular Acesso
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Financial & Subscriptions */}
        {activeTab === 'financial' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:col-span-2">
              <h2 className="font-semibold text-slate-100 mb-1">Webhooks de Pagamento Recorrente</h2>
              <p className="text-xs text-slate-400 mb-6">Integração direta com Gateways (Asaas, Stripe, Mercado Pago)</p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-emerald-400">POST /api/webhooks/payments</span>
                  <span className="text-slate-500">200 OK</span>
                </div>
                <p className="text-slate-400">// Exemplo de evento processado automaticamente:</p>
                <pre className="text-slate-300 text-[11px] overflow-x-auto">
{`{
  "event": "PAYMENT_RECEIVED",
  "subscriptionId": "sub_92817263",
  "customerId": "cus_882910",
  "amount": 149.90,
  "nextDueDate": "2026-10-29T00:00:00Z"
}`}
                </pre>
                <div className="pt-2 text-[11px] text-emerald-400/90">
                  ✓ Regra executada: Acesso liberado no leitor facial por mais 30 dias.
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h2 className="font-semibold text-slate-100 mb-1">Configuração de Cobrança</h2>
              <p className="text-xs text-slate-400 mb-4">Parâmetros de corte automático</p>

              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="font-medium text-slate-200">Tolerância de atraso:</p>
                  <p className="text-slate-400 mt-1">0 dias (Bloqueio no 1º dia após vencimento)</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="font-medium text-slate-200">Retentativa de cobrança:</p>
                  <p className="text-slate-400 mt-1">3x a cada 48h antes do cancelamento</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="font-medium text-slate-200">Disparo WhatsApp:</p>
                  <p className="text-slate-400 mt-1">Aviso automático com link PIX para regularização</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
