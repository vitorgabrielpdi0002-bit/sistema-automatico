import React, { useState } from 'react';
import { 
  Users, 
  CreditCard, 
  ScanFace, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Plus, 
  Sliders, 
  DollarSign, 
  ShieldAlert, 
  LogOut, 
  ChevronRight, 
  UserCheck, 
  Building2, 
  X,
  Phone,
  HeartPulse,
  Upload,
  Camera,
  Check,
  AlertTriangle
} from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  birthDate?: string;
  gender?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalNotes?: string;
  plan: string;
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELED';
  facialRegistered: boolean;
  avatarUrl: string;
  dueDate: string;
  dueDay: number;
}

interface CheckInLog {
  id: string;
  memberName: string;
  timestamp: string;
  status: 'ALLOWED' | 'DENIED';
  reason: string;
  device: string;
  avatarUrl: string;
}

const initialMembers: Member[] = [
  {
    id: '1',
    name: 'Carlos Henrique Silva',
    email: 'carlos.silva@email.com',
    cpf: '123.456.789-00',
    phone: '(11) 98765-4321',
    birthDate: '1992-05-14',
    gender: 'Masculino',
    emergencyContact: 'Ana Paula (Esposa)',
    emergencyPhone: '(11) 97654-3210',
    medicalNotes: 'Nenhuma restrição declarada.',
    plan: 'Plano Black Anual',
    status: 'ACTIVE',
    facialRegistered: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    dueDate: '2026-10-15',
    dueDay: 15
  },
  {
    id: '2',
    name: 'Mariana Duarte Souza',
    email: 'mariana.d@email.com',
    cpf: '987.654.321-11',
    phone: '(21) 99887-1122',
    birthDate: '1996-11-20',
    gender: 'Feminino',
    emergencyContact: 'Marcos Souza (Pai)',
    emergencyPhone: '(21) 98877-6655',
    medicalNotes: 'Sensibilidade no joelho direito (menisco).',
    plan: 'Plano Mensal Gold',
    status: 'PAST_DUE',
    facialRegistered: true,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    dueDate: '2026-09-25',
    dueDay: 25
  },
  {
    id: '3',
    name: 'Rodrigo Lima Santos',
    email: 'rodrigo.lima@email.com',
    cpf: '456.789.123-22',
    phone: '(31) 97123-4567',
    birthDate: '1988-08-30',
    gender: 'Masculino',
    emergencyContact: 'Juliana Lima (Irmã)',
    emergencyPhone: '(31) 98111-2233',
    medicalNotes: 'Hipertensão leve controlada com medicação.',
    plan: 'Plano Semestral',
    status: 'ACTIVE',
    facialRegistered: false,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    dueDate: '2026-11-01',
    dueDay: 10
  }
];

const initialLogs: CheckInLog[] = [
  {
    id: 'log-1',
    memberName: 'Carlos Henrique Silva',
    timestamp: '14:32:05',
    status: 'ALLOWED',
    reason: 'Acesso Liberado • Plano Black',
    device: 'Catraca Principal',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'log-2',
    memberName: 'Mariana Duarte Souza',
    timestamp: '14:28:40',
    status: 'DENIED',
    reason: 'Acesso Bloqueado • Mensalidade Pendente',
    device: 'Catraca Principal',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
  }
];

export default function App() {
  const [activeMenu, setActiveMenu] = useState<'turnstile' | 'members' | 'financial' | 'devices'>('turnstile');
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [logs, setLogs] = useState<CheckInLog[]>(initialLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStep, setFormStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    birthDate: '',
    gender: 'Masculino',
    emergencyContact: '',
    emergencyPhone: '',
    medicalNotes: '',
    plan: 'Plano Black Anual',
    dueDay: 10,
    paymentMethod: 'CREDIT_CARD',
    facialPhotoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    facialCaptured: true
  });

  const simulateTurnstile = (member: Member) => {
    const isAllowed = member.status === 'ACTIVE';
    const newLog: CheckInLog = {
      id: `log-${Date.now()}`,
      memberName: member.name,
      timestamp: new Date().toLocaleTimeString(),
      status: isAllowed ? 'ALLOWED' : 'DENIED',
      reason: isAllowed ? 'Acesso Liberado • Biometria Confirmada' : 'Acesso Bloqueado • Inadimplência',
      device: 'Catraca 01',
      avatarUrl: member.avatarUrl
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const newM: Member = {
      id: String(Date.now()),
      name: formData.name,
      email: formData.email,
      cpf: formData.cpf || '000.000.000-00',
      phone: formData.phone || '(00) 00000-0000',
      birthDate: formData.birthDate,
      gender: formData.gender,
      emergencyContact: formData.emergencyContact,
      emergencyPhone: formData.emergencyPhone,
      medicalNotes: formData.medicalNotes || 'Nenhuma restrição informada',
      plan: formData.plan,
      status: 'ACTIVE',
      facialRegistered: formData.facialCaptured,
      avatarUrl: formData.facialPhotoUrl,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueDay: formData.dueDay
    };

    setMembers(prev => [newM, ...prev]);
    setIsModalOpen(false);
    setFormStep(1);
    setFormData({
      name: '',
      email: '',
      cpf: '',
      phone: '',
      birthDate: '',
      gender: 'Masculino',
      emergencyContact: '',
      emergencyPhone: '',
      medicalNotes: '',
      plan: 'Plano Black Anual',
      dueDay: 10,
      paymentMethod: 'CREDIT_CARD',
      facialPhotoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      facialCaptured: true
    });
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.cpf.includes(searchTerm) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans antialiased overflow-hidden">
      {/* ── BARRA LATERAL (SIDEBAR) ─────────────────────────────────── */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo & Gym Name */}
          <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-sm">
              <ScanFace className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-white leading-none">FitPass Auto</h1>
              <span className="text-[11px] text-slate-400">Controle de Catraca & Gestão</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveMenu('turnstile')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeMenu === 'turnstile'
                  ? 'bg-slate-800 text-emerald-400 font-semibold shadow-inner'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Activity className="w-4 h-4 shrink-0" />
              <span>Monitor da Catraca</span>
            </button>

            <button
              onClick={() => setActiveMenu('members')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeMenu === 'members'
                  ? 'bg-slate-800 text-emerald-400 font-semibold shadow-inner'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Alunos & Fichas</span>
              <span className="ml-auto bg-slate-800 text-slate-400 text-[10px] px-1.5 py-0.5 rounded-full">
                {members.length}
              </span>
            </button>

            <button
              onClick={() => setActiveMenu('financial')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeMenu === 'financial'
                  ? 'bg-slate-800 text-emerald-400 font-semibold shadow-inner'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <CreditCard className="w-4 h-4 shrink-0" />
              <span>Planos & Pagamentos</span>
            </button>

            <button
              onClick={() => setActiveMenu('devices')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeMenu === 'devices'
                  ? 'bg-slate-800 text-emerald-400 font-semibold shadow-inner'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-4 h-4 shrink-0" />
              <span>Dispositivos / Catracas</span>
            </button>
          </nav>
        </div>

        {/* Hardware Status & User profile */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80 text-[11px]">
            <div className="flex items-center justify-between text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Catraca 01 (IP)
              </span>
              <span className="text-emerald-400 text-[10px]">ONLINE</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">192.168.1.120 • Relé Ativo</p>
          </div>

          <div className="flex items-center justify-between px-2 pt-1 text-xs text-slate-400">
            <span className="truncate">admin@academia.com</span>
            <button className="text-slate-500 hover:text-rose-400" title="Sair">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── CONTEÚDO PRINCIPAL (MAIN CONTENT) ─────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-14 border-b border-slate-800 bg-slate-950/70 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Building2 className="w-3.5 h-3.5" />
            <span>Unidade Central</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-200 font-medium capitalize">
              {activeMenu === 'turnstile' && 'Monitor da Catraca'}
              {activeMenu === 'members' && 'Gestão de Alunos & Inscrições'}
              {activeMenu === 'financial' && 'Planos & Webhooks'}
              {activeMenu === 'devices' && 'Dispositivos de Hardware'}
            </span>
          </div>

          {activeMenu === 'members' && (
            <button
              onClick={() => {
                setFormStep(1);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Nova Matrícula Completa
            </button>
          )}
        </header>

        {/* Content Body */}
        <main className="p-6 space-y-6">
          {/* TAB 1: MONITOR DA CATRACA */}
          {activeMenu === 'turnstile' && (
            <div className="space-y-6">
              {/* Top KPI counters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Liberados Hoje</span>
                    <p className="text-2xl font-bold text-white mt-1">128</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <UserCheck className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Bloqueios por Inadimplência</span>
                    <p className="text-2xl font-bold text-rose-400 mt-1">2</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Reconhecimento Facial</span>
                    <p className="text-sm font-semibold text-emerald-400 mt-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span> 99.2% de precisão
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center">
                    <ScanFace className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Action: Quick Test Simulator */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-xs font-semibold text-white uppercase tracking-wider">Simulador de Passagem na Catraca</h2>
                    <p className="text-[11px] text-slate-400">Clique em um aluno para simular a leitura do rosto e abertura do relé:</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {members.map(m => (
                    <button
                      key={m.id}
                      onClick={() => simulateTurnstile(m)}
                      className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-left transition-all text-xs"
                    >
                      <img src={m.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-200 truncate">{m.name}</p>
                        <p className={`text-[10px] ${m.status === 'ACTIVE' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {m.status === 'ACTIVE' ? 'Plano Ativo' : 'Inadimplente (Bloquear)'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Access Feed */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xs font-semibold text-white uppercase tracking-wider">Feed de Passagens (Histórico Recente)</h2>
                  <span className="text-[11px] text-slate-500 font-mono">{logs.length} passagens</span>
                </div>

                <div className="divide-y divide-slate-800/80">
                  {logs.map(log => (
                    <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img src={log.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-800 shrink-0" />
                        <div>
                          <p className="font-medium text-slate-200">{log.memberName}</p>
                          <span className="text-[11px] text-slate-400">{log.device} • {log.timestamp}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        {log.status === 'ALLOWED' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 text-[11px]">
                            <CheckCircle2 className="w-3 h-3" /> Liberado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-400 font-semibold bg-rose-500/10 px-2.5 py-0.5 rounded border border-rose-500/20 text-[11px]">
                            <XCircle className="w-3 h-3" /> Bloqueado
                          </span>
                        )}
                        <p className="text-[10px] text-slate-500 mt-0.5">{log.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ALUNOS & FICHAS */}
          {activeMenu === 'members' && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Pesquisar por nome, CPF ou email..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <span className="text-xs text-slate-400">{filteredMembers.length} aluno(s) listados</span>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                      <th className="pb-2 px-3">Aluno</th>
                      <th className="pb-2 px-3">Contato / WhatsApp</th>
                      <th className="pb-2 px-3">Plano & Vencimento</th>
                      <th className="pb-2 px-3">Emergência</th>
                      <th className="pb-2 px-3">Status</th>
                      <th className="pb-2 px-3">Biometria</th>
                      <th className="pb-2 px-3 text-right">Ficha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredMembers.map(member => (
                      <tr key={member.id} className="hover:bg-slate-900/40">
                        <td className="py-2.5 px-3 flex items-center gap-2.5">
                          <img src={member.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-slate-200 truncate">{member.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{member.cpf}</p>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <p className="text-slate-300">{member.phone}</p>
                          <p className="text-[10px] text-slate-400">{member.email}</p>
                        </td>
                        <td className="py-2.5 px-3">
                          <p className="text-slate-300 font-medium">{member.plan}</p>
                          <p className="text-[10px] text-slate-400">Dia {member.dueDay} (Vence {member.dueDate})</p>
                        </td>
                        <td className="py-2.5 px-3">
                          <p className="text-slate-300 text-[11px]">{member.emergencyContact || 'Não informado'}</p>
                          <p className="text-[10px] text-slate-500">{member.emergencyPhone}</p>
                        </td>
                        <td className="py-2.5 px-3">
                          {member.status === 'ACTIVE' ? (
                            <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                              Ativo
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-[10px] rounded bg-rose-500/10 text-rose-400 font-semibold border border-rose-500/20">
                              Atrasado
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          {member.facialRegistered ? (
                            <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
                              <ScanFace className="w-3.5 h-3.5" /> Cadastrado
                            </span>
                          ) : (
                            <span className="text-amber-400 text-[11px] font-medium">Pendente</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => setSelectedMember(member)}
                            className="text-[11px] text-slate-300 hover:text-emerald-400 px-2 py-1 bg-slate-900 border border-slate-800 rounded hover:border-slate-700"
                          >
                            Ver Detalhes
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PLANOS & PAGAMENTOS */}
          {activeMenu === 'financial' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <h2 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" /> Planos Cadastrados
                </h2>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-200">Plano Black Anual</p>
                      <span className="text-[11px] text-slate-400">Recorrência automática de 12 meses</span>
                    </div>
                    <span className="font-bold text-emerald-400">R$ 119,90/mês</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-200">Plano Mensal Gold</p>
                      <span className="text-[11px] text-slate-400">Sem fidelidade</span>
                    </div>
                    <span className="font-bold text-emerald-400">R$ 149,90/mês</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <h2 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" /> Webhooks de Pagamento
                </h2>
                <p className="text-[11px] text-slate-400">
                  O sistema recebe notificações automáticas do gateway (Asaas, Stripe ou Mercado Pago).
                </p>
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-slate-300 space-y-1">
                  <p className="text-emerald-400">✓ POST /api/payments/webhook</p>
                  <p className="text-slate-500">• PAYMENT_RECEIVED ➔ Libera catraca (+30 dias)</p>
                  <p className="text-slate-500">• PAYMENT_OVERDUE ➔ Bloqueia catraca instantaneamente</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DISPOSITIVOS */}
          {activeMenu === 'devices' && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <h2 className="text-xs font-semibold text-white uppercase tracking-wider">Catracas & Leitores Conectados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-200">Catraca 01 (Entrada Principal)</p>
                    <span className="text-[11px] text-slate-400">IP: 192.168.1.120 • Relé NA/NF</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                    Online
                  </span>
                </div>

                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-200">Leitor Facial Hikvision / Intelbras</p>
                    <span className="text-[11px] text-slate-400">IP: 192.168.1.121 • Wiegand / HTTP</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                    Online
                  </span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── MODAL: MATRÍCULA COMPLETA DO ALUNO (MULTI-ETAPAS) ─────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Nova Matrícula de Aluno</h3>
                <p className="text-[11px] text-slate-400">Preencha os dados cadastrais, saúde e biometria</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stepper Tabs */}
            <div className="flex border-b border-slate-800 text-[11px] bg-slate-900/50">
              <button
                type="button"
                onClick={() => setFormStep(1)}
                className={`flex-1 py-2.5 font-medium border-b-2 transition-colors ${
                  formStep === 1 ? 'border-emerald-500 text-emerald-400 bg-slate-900' : 'border-transparent text-slate-400'
                }`}
              >
                1. Pessoal
              </button>
              <button
                type="button"
                onClick={() => setFormStep(2)}
                className={`flex-1 py-2.5 font-medium border-b-2 transition-colors ${
                  formStep === 2 ? 'border-emerald-500 text-emerald-400 bg-slate-900' : 'border-transparent text-slate-400'
                }`}
              >
                2. Emergência
              </button>
              <button
                type="button"
                onClick={() => setFormStep(3)}
                className={`flex-1 py-2.5 font-medium border-b-2 transition-colors ${
                  formStep === 3 ? 'border-emerald-500 text-emerald-400 bg-slate-900' : 'border-transparent text-slate-400'
                }`}
              >
                3. Plano
              </button>
              <button
                type="button"
                onClick={() => setFormStep(4)}
                className={`flex-1 py-2.5 font-medium border-b-2 transition-colors ${
                  formStep === 4 ? 'border-emerald-500 text-emerald-400 bg-slate-900' : 'border-transparent text-slate-400'
                }`}
              >
                4. Biometria
              </button>
            </div>

            {/* Modal Body / Steps */}
            <form onSubmit={handleSaveMember} className="p-5 text-xs space-y-4 flex-1">
              {/* ETAPA 1: DADOS PESSOAIS */}
              {formStep === 1 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Nome Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Gabriel Alves Moreira"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">CPF *</label>
                      <input
                        type="text"
                        required
                        placeholder="000.000.000-00"
                        value={formData.cpf}
                        onChange={e => setFormData({ ...formData, cpf: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">WhatsApp / Celular *</label>
                      <input
                        type="text"
                        required
                        placeholder="(11) 99999-9999"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">E-mail *</label>
                      <input
                        type="email"
                        required
                        placeholder="aluno@email.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Data de Nascimento</label>
                      <input
                        type="date"
                        value={formData.birthDate}
                        onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Gênero</label>
                    <select
                      value={formData.gender}
                      onChange={e => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                      <option value="Outro">Outro / Prefiro não informar</option>
                    </select>
                  </div>
                </div>
              )}

              {/* ETAPA 2: EMERGÊNCIA & SAÚDE */}
              {formStep === 2 && (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2.5">
                    <HeartPulse className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-300/90 leading-relaxed">
                      Esses dados são essenciais para assistência imediata caso o aluno sofra algum mal-estar dentro da academia.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Contato de Emergência</label>
                      <input
                        type="text"
                        placeholder="Ex: Maria (Mãe)"
                        value={formData.emergencyContact}
                        onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Telefone de Emergência</label>
                      <input
                        type="text"
                        placeholder="(11) 98888-7777"
                        value={formData.emergencyPhone}
                        onChange={e => setFormData({ ...formData, emergencyPhone: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Ficha de Saúde / Restrições Médicas</label>
                    <textarea
                      rows={3}
                      placeholder="Ex: Histórico cardíaco, cirurgias recentes, dores na coluna, hérnia ou uso de remédio controlado..."
                      value={formData.medicalNotes}
                      onChange={e => setFormData({ ...formData, medicalNotes: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* ETAPA 3: PLANO & COBRANÇA */}
              {formStep === 3 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Plano Escolhido</label>
                    <select
                      value={formData.plan}
                      onChange={e => setFormData({ ...formData, plan: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Plano Black Anual">Plano Black Anual (R$ 119,90/mês)</option>
                      <option value="Plano Mensal Gold">Plano Mensal Gold (R$ 149,90/mês)</option>
                      <option value="Plano Semestral">Plano Semestral (R$ 129,90/mês)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Dia de Vencimento</label>
                      <select
                        value={formData.dueDay}
                        onChange={e => setFormData({ ...formData, dueDay: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                      >
                        <option value={5}>Todo dia 05</option>
                        <option value={10}>Todo dia 10</option>
                        <option value={15}>Todo dia 15</option>
                        <option value={20}>Todo dia 20</option>
                        <option value={25}>Todo dia 25</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Forma de Cobrança</label>
                      <select
                        value={formData.paymentMethod}
                        onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="CREDIT_CARD">Cartão Recorrente</option>
                        <option value="PIX">PIX Automático</option>
                        <option value="BOLETO">Boleto Bancário</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-200">Liberação Imediata da Catraca</p>
                      <p className="text-[10px] text-slate-400">Ativa o acesso pelos primeiros 30 dias após cadastro</p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  </div>
                </div>
              )}

              {/* ETAPA 4: BIOMETRIA FACIAL */}
              {formStep === 4 && (
                <div className="space-y-4 text-center">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Captura de Biometria Facial</label>
                    <p className="text-[11px] text-slate-400">
                      Cadastre a foto do aluno para reconhecimento automático nas câmeras da catraca
                    </p>
                  </div>

                  <div className="mx-auto w-32 h-32 rounded-full border-2 border-dashed border-emerald-500/50 p-1 flex items-center justify-center relative group">
                    <img
                      src={formData.facialPhotoUrl}
                      alt="Prévia"
                      className="w-full h-full rounded-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Camera className="w-6 h-6 text-emerald-400" />
                    </div>
                  </div>

                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          facialPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
                          facialCaptured: true
                        });
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg text-xs"
                    >
                      <Camera className="w-3.5 h-3.5 text-emerald-400" />
                      Capturar pela Webcam
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          facialPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
                          facialCaptured: true
                        });
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg text-xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-blue-400" />
                      Carregar Arquivo
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] flex items-center justify-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    Foto pronta para indexação no leitor facial
                  </div>
                </div>
              )}

              {/* Modal Navigation Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                {formStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setFormStep((prev) => (prev - 1) as any)}
                    className="px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-900 text-slate-400 font-medium"
                  >
                    Voltar
                  </button>
                ) : (
                  <div></div>
                )}

                {formStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => setFormStep((prev) => (prev + 1) as any)}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                  >
                    Próximo Passo
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Finalizar Matrícula
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: FICHA DETALHADA DO ALUNO ─────────────────────────── */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img src={selectedMember.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-800" />
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedMember.name}</h3>
                  <p className="text-[11px] text-slate-400">CPF: {selectedMember.cpf}</p>
                </div>
              </div>
              <button onClick={() => setSelectedMember(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-900 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Plano Atual:</span>
                  <span className="font-semibold text-emerald-400">{selectedMember.plan}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status de Pagamento:</span>
                  <span className={`font-semibold ${selectedMember.status === 'ACTIVE' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {selectedMember.status === 'ACTIVE' ? 'Em dia (Catraca Liberada)' : 'Atrasado (Catraca Bloqueada)'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Vencimento da Mensalidade:</span>
                  <span className="text-slate-200">Dia {selectedMember.dueDay} (Vence em {selectedMember.dueDate})</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg space-y-1.5">
                <p className="text-slate-400 font-medium">Contatos & Emergência:</p>
                <p className="text-slate-200 flex items-center gap-2">
                  <Phone className="w-3 h-3 text-slate-400" /> WhatsApp: {selectedMember.phone}
                </p>
                <p className="text-slate-200 flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-amber-400" /> Contato de Emergência: {selectedMember.emergencyContact || 'Não cadastrado'} ({selectedMember.emergencyPhone || 'Sem telefone'})
                </p>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg space-y-1">
                <p className="text-slate-400 font-medium">Ficha Médica / Observações:</p>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {selectedMember.medicalNotes || 'Nenhuma restrição informada.'}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedMember(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium"
              >
                Fechar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
