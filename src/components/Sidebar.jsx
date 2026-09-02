import React from 'react';
import { 
  LayoutDashboard, 
  Headphones, 
  Building, 
  Layers, 
  BarChart3, 
  FileText, 
  MonitorCheck,
  PlusCircle
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';

export default function Sidebar() {
  const { activeTab, setActiveTab, chamados, setIsNewTicketOpen } = useTickets();

  const openTicketsCount = chamados.filter(c => c.status === 'Aberto' || c.status === 'Em Atendimento').length;
  const criticalCount = chamados.filter(c => c.prioridade === 'Crítica' && c.status !== 'Concluído').length;

  const menuItems = [
    { id: 'dashboard', label: 'Visão Geral TI', icon: LayoutDashboard },
    { id: 'chamados', label: 'Chamados de TI', icon: Headphones, badge: openTicketsCount },
    { id: 'termos', label: 'Termos de Notebooks', icon: FileText },
    { id: 'obras', label: 'Locais & Obras', icon: Building },
    { id: 'categorias', label: 'Categorias & SLA', icon: Layers },
    { id: 'relatorios', label: 'Relatórios & SLA', icon: BarChart3 },
  ];

  return (
    <aside className="hidden md:flex flex-col w-60 border-r border-[#234963] bg-[#0B1D2D] p-3 py-3.5 shrink-0 sticky top-[61px] h-[calc(100vh-61px)] justify-between transition-colors z-40">
      <div className="space-y-1 overflow-y-auto">
        <p className="px-2.5 text-[10.5px] font-extrabold text-[#7893A2] uppercase tracking-[0.08em] mb-2">
          Menu TI Corporativo
        </p>

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
      </div>

      {/* Bottom Footer Section in Sidebar */}
      <div className="space-y-3 pt-3 border-t border-[#234963]">
        {criticalCount > 0 && (
          <div className="px-2.5 py-2 rounded-[6px] bg-[#E16666]/15 border border-[#E16666]/30 flex items-center justify-between text-xs text-[#E16666] font-bold">
            <span>Urgências de TI:</span>
            <span className="bg-[#E16666] text-[#0B1D2D] px-1.5 py-0.5 rounded text-[10px] font-extrabold animate-pulse">
              {criticalCount}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsNewTicketOpen(true)}
          className="w-full py-2 px-3 rounded-[6px] bg-[#14334C] hover:bg-[#66C1BF] text-[#66C1BF] hover:text-[#08252B] border border-[#234963] text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Novo Chamado TI</span>
        </button>

        <div className="flex items-center justify-between text-[11px] text-[#7893A2] px-1">
          <div className="flex items-center gap-1.5">
            <MonitorCheck className="w-3.5 h-3.5 text-[#66C1BF]" />
            <span className="font-extrabold text-[#66C1BF] tracking-wide">MAXIMO ALDANA TI</span>
          </div>
          <span className="font-mono text-[10px] text-[#7893A2] bg-[#14334C] px-1.5 py-0.5 rounded border border-[#234963]">
            v1.0
          </span>
        </div>
      </div>
    </aside>
  );
}
