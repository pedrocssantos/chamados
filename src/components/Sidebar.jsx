import React from 'react';
import { 
  LayoutDashboard, 
  Headphones, 
  Building, 
  Layers, 
  BarChart3, 
  PlusCircle,
  HardHat,
  ShieldCheck
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';

export default function Sidebar() {
  const { activeTab, setActiveTab, chamados, setIsNewTicketOpen, user } = useTickets();

  const isClient = user?.role === 'cliente';

  const relevantChamados = isClient 
    ? chamados.filter(c => c.obraId === user?.obraId)
    : chamados;

  const openTicketsCount = relevantChamados.filter(c => c.status === 'Aberto' || c.status === 'Em Atendimento').length;
  const criticalCount = relevantChamados.filter(c => c.prioridade === 'Crítica' && c.status !== 'Concluído').length;

  const menuItems = isClient ? [
    { id: 'dashboard', label: 'Painel da Minha Obra', icon: LayoutDashboard },
    { id: 'chamados', label: 'Histórico da Obra', icon: Headphones, badge: openTicketsCount },
    { id: 'obras', label: 'Informações da Obra', icon: Building },
  ] : [
    { id: 'dashboard', label: 'Visão Geral TI', icon: LayoutDashboard },
    { id: 'chamados', label: 'Chamados de TI', icon: Headphones, badge: openTicketsCount },
    { id: 'obras', label: 'Locais & Obras', icon: Building },
    { id: 'categorias', label: 'Categorias & SLA', icon: Layers },
    { id: 'relatorios', label: 'Relatórios & SLA', icon: BarChart3 },
  ];

  return (
    <aside className="hidden md:flex flex-col w-60 border-r border-[#234963] bg-[#0B1D2D] p-3 py-3.5 shrink-0 sticky top-[61px] h-[calc(100vh-61px)] justify-between transition-colors z-40">
      <div className="space-y-1 overflow-y-auto">
        <div className="px-2.5 mb-2 flex items-center justify-between">
          <p className="text-[10.5px] font-extrabold text-[#7893A2] uppercase tracking-[0.08em]">
            {isClient ? 'Menu do Solicitante' : 'Menu TI Corporativo'}
          </p>
          {isClient ? (
            <span className="text-[9.5px] font-bold text-[#E2B552] flex items-center gap-1">
              <HardHat className="w-3 h-3" /> Obra
            </span>
          ) : (
            <span className="text-[9.5px] font-bold text-[#66C1BF] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Admin
            </span>
          )}
        </div>

        <div className="space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] font-semibold text-[12.5px] transition-all text-left ${
                  isActive
                    ? 'bg-[#66C1BF] text-[#08252B] font-extrabold shadow-[0_2px_8px_rgba(102,193,191,0.3)]'
                    : 'text-[#9EB5C1] hover:text-[#66C1BF] hover:bg-[#163A55] border border-transparent hover:border-[#66C1BF]/25'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#08252B]' : 'text-[#9EB5C1]'}`} />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-[#08252B] text-[#66C1BF]' : 'bg-[#14334C] text-[#66C1BF] border border-[#234963]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Critical Alerts Banner */}
        {criticalCount > 0 && (
          <div className="mt-4 p-3 rounded-[6px] bg-[#E16666]/10 border border-[#E16666]/30">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E16666] animate-ping" />
              <p className="text-xs font-bold text-[#E16666]">
                {isClient ? `Urgências na sua Obra: ${criticalCount}` : `Urgências de TI: ${criticalCount}`}
              </p>
            </div>
            <p className="text-[10.5px] text-[#9EB5C1] mt-1">
              Chamados com link ou servidores fora do ar que exigem suporte imediato.
            </p>
          </div>
        )}
      </div>

      {/* Quick Action Bottom & Info */}
      <div className="pt-3 border-t border-[#234963] space-y-2">
        <button
          onClick={() => setIsNewTicketOpen(true)}
          className="w-full py-2 px-3 rounded-[6px] bg-[#14334C] hover:bg-[#163A55] text-[#66C1BF] border border-[#234963] hover:border-[#66C1BF] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Novo Chamado TI</span>
        </button>

        <div className="px-1 text-center">
          <p className="text-[10px] text-[#7893A2]">Maximo Aldana TI v1.0</p>
          <p className="text-[9px] text-[#5E7A8A]">
            {isClient ? user?.obraNome : 'Construtora e Incorporadora'}
          </p>
        </div>
      </div>
    </aside>
  );
}
