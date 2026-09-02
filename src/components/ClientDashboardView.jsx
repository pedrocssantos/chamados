import React from 'react';
import { 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Building, 
  Headphones, 
  ChevronRight, 
  Mail, 
  Phone,
  HardHat,
  Eye
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';

export default function ClientDashboardView() {
  const { chamados, user, obras, setIsNewTicketOpen, setSelectedTicket } = useTickets();

  // Filter tickets that belong to this client's obra or were requested by him
  const userObra = obras.find(o => o.id === user?.obraId) || obras[0] || { nome: 'Minha Obra', cidade: 'São Paulo - SP', progresso: 50 };
  const myTickets = (chamados || []).filter(t => {
    if (!t) return false;
    if (user?.obraId && t.obraId === user.obraId) return true;
    if (user?.nome && t.solicitante && t.solicitante.toLowerCase().includes(user.nome.toLowerCase())) return true;
    return false;
  });

  const abertos = myTickets.filter(t => t.status === 'Aberto').length;
  const emAtendimento = myTickets.filter(t => t.status === 'Em Atendimento' || t.status === 'Aguardando Peça').length;
  const concluidos = myTickets.filter(t => t.status === 'Concluído').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Aberto':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#66C1BF]/15 text-[#66C1BF] border border-[#66C1BF]/30">Aberto</span>;
      case 'Em Atendimento':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#E2B552]/15 text-[#E2B552] border border-[#E2B552]/30">Em Atendimento</span>;
      case 'Aguardando Peça':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#8E7CF8]/15 text-[#8E7CF8] border border-[#8E7CF8]/30">Aguardando Peça</span>;
      case 'Concluído':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#43C486]/15 text-[#43C486] border border-[#43C486]/30">Concluído</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#7893A2]/20 text-[#9EB5C1]">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-page-enter">
      
      {/* Hero Welcome Banner for Client / Worksite */}
      <div className="bg-[#102A40] border border-[#234963] rounded-[14px] p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-[#66C1BF]/15 text-[#66C1BF] border border-[#66C1BF]/30 flex items-center gap-1">
              <HardHat className="w-3 h-3" /> Solicitante de Obra
            </span>
            <span className="text-xs font-semibold text-[#9EB5C1]">
              {userObra?.nome || 'Canteiro de Obras'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#F1F7F8]">
            Olá, {user.nome}!
          </h2>
          <p className="text-xs sm:text-sm text-[#9EB5C1]">
            Acompanhe o atendimento dos seus chamados de TI, redes e computadores da sua obra.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewTicketOpen(true)}
          className="px-5 py-3 rounded-[8px] bg-[#66C1BF] hover:bg-[#4FA9A7] text-[#08252B] font-extrabold text-xs sm:text-sm shadow-[0_4px_14px_rgba(102,193,191,0.25)] transition-all flex items-center gap-2 shrink-0 cursor-pointer hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Abrir Chamado de TI</span>
        </button>
      </div>

      {/* KPI Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#102A40] border border-[#234963] rounded-[12px] p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#9EB5C1]">Aguardando Atendimento</p>
            <p className="text-2xl font-black text-[#66C1BF] mt-1">{abertos}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#66C1BF]/15 border border-[#66C1BF]/30 text-[#66C1BF] flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#102A40] border border-[#234963] rounded-[12px] p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#9EB5C1]">Em Execução pela TI</p>
            <p className="text-2xl font-black text-[#E2B552] mt-1">{emAtendimento}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#E2B552]/15 border border-[#E2B552]/30 text-[#E2B552] flex items-center justify-center">
            <Headphones className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#102A40] border border-[#234963] rounded-[12px] p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#9EB5C1]">Resolvidos / Concluídos</p>
            <p className="text-2xl font-black text-[#43C486] mt-1">{concluidos}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#43C486]/15 border border-[#43C486]/30 text-[#43C486] flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Content: Tickets List for this Worksite */}
      <div className="bg-[#102A40] border border-[#234963] rounded-[14px] p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#234963]">
          <div>
            <h3 className="text-base font-extrabold text-[#F1F7F8]">
              Meus Chamados da Obra ({myTickets.length})
            </h3>
            <p className="text-xs text-[#9EB5C1]">
              Histórico de solicitações registradas para {userObra?.nome}.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsNewTicketOpen(true)}
            className="text-xs font-bold text-[#66C1BF] hover:text-[#4FA9A7] flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Solicitação</span>
          </button>
        </div>

        {myTickets.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#43C486] mx-auto opacity-70" />
            <h4 className="text-sm font-extrabold text-[#F1F7F8]">Tudo em ordem na sua obra!</h4>
            <p className="text-xs text-[#9EB5C1] max-w-sm mx-auto">
              Nenhum chamado pendente registrado no momento. Se precisar de suporte, clique no botão abaixo.
            </p>
            <button
              onClick={() => setIsNewTicketOpen(true)}
              className="px-4 py-2 bg-[#66C1BF] text-[#08252B] font-bold text-xs rounded-[6px]"
            >
              Abrir Primeiro Chamado
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {myTickets.map(t => (
              <div 
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className="bg-[#081724] border border-[#234963] hover:border-[#66C1BF]/60 rounded-[10px] p-4 transition-all hover:bg-[#14334C]/60 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-[#66C1BF]">{t.id}</span>
                    {getStatusBadge(t.status)}
                    <span className="text-[11px] text-[#7893A2]">· {t.categoriaNome}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#F1F7F8] group-hover:text-[#66C1BF] transition-colors">
                    {t.titulo}
                  </h4>
                  <p className="text-xs text-[#9EB5C1] flex items-center gap-2">
                    <span>Local: <strong>{t.localizacao}</strong></span>
                    <span>·</span>
                    <span>Técnico: <strong>{t.tecnicoAtribuido}</strong></span>
                  </p>
                </div>

                <div className="flex items-center gap-3 sm:border-l sm:border-[#234963] sm:pl-4 shrink-0">
                  <div className="text-left sm:text-right text-xs">
                    <span className="text-[#7893A2] block text-[10px]">Aberto em:</span>
                    <span className="font-semibold text-[#F1F7F8]">{t.dataCriacao}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#7893A2] group-hover:text-[#66C1BF] group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Support Contact Box */}
      <div className="bg-[#14334C]/40 border border-[#234963] rounded-[12px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#66C1BF]/15 border border-[#66C1BF]/30 text-[#66C1BF] flex items-center justify-center shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-[#F1F7F8]">Equipe de Suporte e TI Maximo Aldana</p>
            <p className="text-[#9EB5C1]">Horário de atendimento: Segunda a Sexta das 07:00 às 17:00</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="mailto:ti@maximoaldana.com.br"
            className="px-3 py-1.5 rounded-[6px] bg-[#102A40] hover:bg-[#163A55] text-[#66C1BF] border border-[#234963] flex items-center gap-1.5 font-semibold transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>ti@maximoaldana.com.br</span>
          </a>
        </div>
      </div>

    </div>
  );
}
