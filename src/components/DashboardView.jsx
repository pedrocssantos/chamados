import React from 'react';
import { 
  Headphones, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Building, 
  Plus, 
  ChevronRight,
  TrendingUp,
  Layers,
  FileText,
  MonitorCheck,
  ArrowRight
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie 
} from 'recharts';

export default function DashboardView() {
  const { chamados, obras, categorias, setActiveTab, setSelectedTicket, setIsNewTicketOpen, setTicketFilters } = useTickets();

  const total = chamados.length;
  const abertos = chamados.filter(c => c.status === 'Aberto').length;
  const emAtendimento = chamados.filter(c => c.status === 'Em Atendimento').length;
  const concluidos = chamados.filter(c => c.status === 'Concluído').length;
  const criticos = chamados.filter(c => c.prioridade === 'Crítica' && c.status !== 'Concluído').length;

  // Chart data: chamados por obra
  const chamadosPorObraData = obras.map(o => {
    const count = chamados.filter(c => c.obraId === o.id).length;
    return {
      name: o.nome.replace('Obra Residencial ', '').replace('Obra Edifício ', '').replace('Sede Corporativa ', 'Sede '),
      count
    };
  });

  // Chart data: chamados por categoria
  const COLORS = ['#66C1BF', '#E16666', '#8E7CF8', '#E2B552', '#43C486'];
  const chamadosPorCategoriaData = categorias.map((cat, i) => {
    const count = chamados.filter(c => c.categoriaId === cat.id).length;
    return {
      name: cat.nome,
      value: count,
      color: cat.cor || COLORS[i % COLORS.length]
    };
  }).filter(c => c.value > 0);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Aberto':
        return <span className="px-2 py-0.5 rounded-[4px] text-[11px] font-extrabold bg-[#8E7CF8]/15 text-[#8E7CF8] border border-[#8E7CF8]/30">Aberto</span>;
      case 'Em Atendimento':
        return <span className="px-2 py-0.5 rounded-[4px] text-[11px] font-extrabold bg-[#E2B552]/15 text-[#E2B552] border border-[#E2B552]/30">Em Atendimento</span>;
      case 'Aguardando Peça':
        return <span className="px-2 py-0.5 rounded-[4px] text-[11px] font-extrabold bg-[#E16666]/15 text-[#E16666] border border-[#E16666]/30">Aguardando Peça</span>;
      case 'Concluído':
        return <span className="px-2 py-0.5 rounded-[4px] text-[11px] font-extrabold bg-[#43C486]/15 text-[#43C486] border border-[#43C486]/30">Concluído</span>;
      default:
        return <span className="px-2 py-0.5 rounded-[4px] text-[11px] font-extrabold bg-[#7893A2]/15 text-[#7893A2]">{status}</span>;
    }
  };

  const getPriorityBadge = (prioridade) => {
    if (prioridade === 'Crítica') {
      return <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-extrabold bg-[#E16666] text-[#0B1D2D] animate-pulse">CRÍTICA</span>;
    }
    if (prioridade === 'Alta') {
      return <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#E16666]/20 text-[#E16666]">ALTA</span>;
    }
    if (prioridade === 'Média') {
      return <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#E2B552]/20 text-[#E2B552]">MÉDIA</span>;
    }
    return <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-semibold bg-[#7893A2]/20 text-[#9EB5C1]">BAIXA</span>;
  };

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Hero Banner */}
      <div className="bg-[#102A40] border border-[#234963] rounded-[16px] p-6 shadow-[0_12px_30px_rgba(0,0,0,0.22)] space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#66C1BF]/15 border border-[#66C1BF]/30 text-[#66C1BF] text-[11px] font-extrabold uppercase tracking-wider">
          <MonitorCheck className="w-3.5 h-3.5" />
          <span>MAXIMO ALDANA • SISTEMA DE TI</span>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F1F7F8] tracking-tight">
            Gestão Integrada de Suporte de TI & Infraestrutura
          </h2>
          <p className="text-xs sm:text-sm text-[#9EB5C1] max-w-2xl leading-relaxed">
            Rastreabilidade completa de computadores de engenharia, roteadores Starlink de canteiro, impressoras e chamados de suporte técnico.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => setIsNewTicketOpen(true)}
            className="px-5 py-2.5 rounded-[8px] bg-[#66C1BF] hover:bg-[#4FA9A7] text-[#08252B] font-extrabold text-xs shadow-[0_2px_8px_rgba(102,193,191,0.25)] transition-all hover:-translate-y-0.5 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Abrir Novo Chamado de TI</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Chamados */}
        <div 
          onClick={() => {
            setTicketFilters(prev => ({ ...prev, status: 'TODOS', prioridade: 'TODAS' }));
            setActiveTab('chamados');
          }}
          className="cursor-pointer bg-[#102A40] border border-[#234963] hover:border-[#66C1BF]/50 rounded-[14px] p-5 shadow-sm transition-all hover:-translate-y-0.5 flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase text-[#7893A2] tracking-wider block">
              TOTAL DE CHAMADOS
            </span>
            <p className="text-3xl font-black text-[#F1F7F8]">{total}</p>
            <p className="text-xs font-bold text-[#66C1BF]">100% rastreados</p>
          </div>
          <div className="w-12 h-12 rounded-[10px] bg-[#66C1BF]/15 border border-[#66C1BF]/30 text-[#66C1BF] flex items-center justify-center shrink-0">
            <Headphones className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Em Atendimento */}
        <div 
          onClick={() => {
            setTicketFilters(prev => ({ ...prev, status: 'Em Atendimento' }));
            setActiveTab('chamados');
          }}
          className="cursor-pointer bg-[#102A40] border border-[#234963] hover:border-[#E2B552]/50 rounded-[14px] p-5 shadow-sm transition-all hover:-translate-y-0.5 flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase text-[#E2B552] tracking-wider block">
              EM ATENDIMENTO
            </span>
            <p className="text-3xl font-black text-[#F1F7F8]">{emAtendimento}</p>
            <p className="text-xs text-[#9EB5C1]">Técnicos em execução</p>
          </div>
          <div className="w-12 h-12 rounded-[10px] bg-[#E2B552]/15 border border-[#E2B552]/30 text-[#E2B552] flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Concluídos */}
        <div 
          onClick={() => {
            setTicketFilters(prev => ({ ...prev, status: 'Concluído' }));
            setActiveTab('chamados');
          }}
          className="cursor-pointer bg-[#102A40] border border-[#234963] hover:border-[#43C486]/50 rounded-[14px] p-5 shadow-sm transition-all hover:-translate-y-0.5 flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase text-[#43C486] tracking-wider block">
              CONCLUÍDOS
            </span>
            <p className="text-3xl font-black text-[#F1F7F8]">{concluidos}</p>
            <p className="text-xs text-[#9EB5C1]">Concluídos com sucesso</p>
          </div>
          <div className="w-12 h-12 rounded-[10px] bg-[#43C486]/15 border border-[#43C486]/30 text-[#43C486] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Urgências de Rede */}
        <div 
          onClick={() => {
            setTicketFilters(prev => ({ ...prev, prioridade: 'Crítica' }));
            setActiveTab('chamados');
          }}
          className="cursor-pointer bg-[#102A40] border border-[#E16666]/40 rounded-[14px] p-5 shadow-sm transition-all hover:-translate-y-0.5 flex items-center justify-between bg-[#E16666]/5"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase text-[#E16666] tracking-wider block">
              REDE / LINK OFFLINE
            </span>
            <p className="text-3xl font-black text-[#E16666]">{criticos}</p>
            <p className="text-xs text-[#E16666]/80 font-bold">Urgência crítica</p>
          </div>
          <div className="w-12 h-12 rounded-[10px] bg-[#E16666]/15 border border-[#E16666]/30 text-[#E16666] flex items-center justify-center shrink-0 animate-pulse">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Secondary Feature Shortcuts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          onClick={() => setActiveTab('termos')}
          className="bg-[#102A40] border border-[#234963] hover:border-[#66C1BF]/60 rounded-[14px] p-4 shadow-sm cursor-pointer transition-all hover:-translate-y-0.5 flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[8px] bg-[#66C1BF]/15 border border-[#66C1BF]/30 text-[#66C1BF] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-[#F1F7F8] group-hover:text-[#66C1BF] transition-colors">
                Termos de Notebooks
              </h4>
              <p className="text-[11px] text-[#9EB5C1]">Controle de entrega e devolução de laptops.</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#7893A2] group-hover:text-[#66C1BF] transition-colors" />
        </div>

        <div 
          onClick={() => setActiveTab('categorias')}
          className="bg-[#102A40] border border-[#234963] hover:border-[#66C1BF]/60 rounded-[14px] p-4 shadow-sm cursor-pointer transition-all hover:-translate-y-0.5 flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[8px] bg-[#66C1BF]/15 border border-[#66C1BF]/30 text-[#66C1BF] flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-[#F1F7F8] group-hover:text-[#66C1BF] transition-colors">
                Categorias & SLA
              </h4>
              <p className="text-[11px] text-[#9EB5C1]">Regras de prazos por severidade.</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#7893A2] group-hover:text-[#66C1BF] transition-colors" />
        </div>

        <div 
          onClick={() => setActiveTab('obras')}
          className="bg-[#102A40] border border-[#234963] hover:border-[#66C1BF]/60 rounded-[14px] p-4 shadow-sm cursor-pointer transition-all hover:-translate-y-0.5 flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[8px] bg-[#66C1BF]/15 border border-[#66C1BF]/30 text-[#66C1BF] flex items-center justify-center shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-[#F1F7F8] group-hover:text-[#66C1BF] transition-colors">
                Locais & Obras
              </h4>
              <p className="text-[11px] text-[#9EB5C1]">Status de infraestrutura nos canteiros.</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#7893A2] group-hover:text-[#66C1BF] transition-colors" />
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart: Chamados por Obra */}
        <div className="bg-[#102A40] border border-[#234963] rounded-[14px] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-[#66C1BF]" />
              <h3 className="text-sm font-bold text-[#F1F7F8]">Demanda de TI por Ponto / Obra</h3>
            </div>
            <button 
              onClick={() => setActiveTab('obras')} 
              className="text-xs text-[#66C1BF] hover:underline flex items-center gap-0.5"
            >
              <span>Ver Locais</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chamadosPorObraData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#7893A2" fontSize={11} tickLine={false} />
                <YAxis stroke="#7893A2" fontSize={11} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1D2D', borderColor: '#234963', borderRadius: '8px', color: '#F1F7F8' }}
                  itemStyle={{ color: '#66C1BF' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#66C1BF" barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart: Chamados por Categoria */}
        <div className="bg-[#102A40] border border-[#234963] rounded-[14px] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#66C1BF]" />
              <h3 className="text-sm font-bold text-[#F1F7F8]">Categorias de TI Solicitadas</h3>
            </div>
            <button 
              onClick={() => setActiveTab('categorias')} 
              className="text-xs text-[#66C1BF] hover:underline flex items-center gap-0.5"
            >
              <span>Ver SLAs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chamadosPorCategoriaData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chamadosPorCategoriaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1D2D', borderColor: '#234963', borderRadius: '8px', color: '#F1F7F8' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px] border-t border-[#234963]/50">
            {chamadosPorCategoriaData.map((c, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }}></span>
                <span className="text-[#9EB5C1] truncate max-w-[150px]">{c.name} ({c.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Chamados Feed */}
      <div className="bg-[#102A40] border border-[#234963] rounded-[14px] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-[#F1F7F8]">Últimos Chamados de TI Registrados</h3>
            <p className="text-xs text-[#9EB5C1]">Acompanhe as solicitações de suporte dos engenheiros e colaboradores.</p>
          </div>
          <button
            onClick={() => setActiveTab('chamados')}
            className="text-xs font-bold text-[#66C1BF] hover:text-[#4FA9A7] flex items-center gap-1"
          >
            <span>Ver Todos ({total})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          {chamados.slice(0, 4).map(ticket => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className="group p-3.5 rounded-[8px] bg-[#14334C]/60 hover:bg-[#14334C] border border-[#234963] hover:border-[#66C1BF]/50 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-[#66C1BF] bg-[#0B1D2D] px-2 py-0.5 rounded border border-[#234963]">
                    {ticket.id}
                  </span>
                  {getPriorityBadge(ticket.prioridade)}
                  {getStatusBadge(ticket.status)}
                  {ticket.prazoSla && new Date() > new Date(ticket.prazoSla.replace(' ', 'T')) && ticket.status !== 'Concluído' && (
                    <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-extrabold bg-[#E16666] text-[#0B1D2D] animate-pulse">VENCIDO</span>
                  )}
                  <span className="text-[11px] text-[#7893A2]">{ticket.categoriaNome}</span>
                </div>
                <h4 className="text-sm font-extrabold text-[#F1F7F8] group-hover:text-[#66C1BF] transition-colors truncate">
                  {ticket.titulo}
                </h4>
                <p className="text-xs text-[#9EB5C1] truncate">
                  📍 <strong className="text-[#F1F7F8]">{ticket.obraNome}</strong> — {ticket.localizacao}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#234963]/40 text-right">
                <div className="text-left sm:text-right">
                  <p className="text-[11px] font-semibold text-[#F1F7F8]">Solicitante: {ticket.solicitante}</p>
                  <p className="text-[10px] text-[#7893A2]">{ticket.dataCriacao}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#7893A2] group-hover:text-[#66C1BF] transition-colors shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
