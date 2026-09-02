import React from 'react';
import { MonitorCheck, Plus, Sun, Moon, Bell, Database } from 'lucide-react';
import { useTickets } from '../context/TicketContext';

export default function Header() {
  const { theme, toggleTheme, setActiveTab, setIsNewTicketOpen, user, chamados, isOnlineDb } = useTickets();

  const hasSlaBreach = chamados.some(t => {
    if (!t.prazoSla || t.status === 'Concluído') return false;
    const parts = t.prazoSla.split(/[\/\s:]/);
    if (parts.length >= 5) {
      const deadline = new Date(parts[2], parts[1] - 1, parts[0], parts[3], parts[4]);
      return new Date() > deadline;
    }
    return false;
  });

  return (
    <header className="sticky top-0 z-50 w-full bg-[#102A40] border-b border-[#66C1BF]/45 shadow-[0_12px_30px_rgba(0,0,0,0.22)] px-4 sm:px-8 py-3.5 transition-colors">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-3.5 group text-left focus:outline-none"
        >
          <div className="bg-[#66C1BF] text-[#08252B] font-extrabold text-sm tracking-[0.06em] px-3 py-1.5 rounded-[6px] shadow-[0_2px_8px_rgba(102,193,191,0.25)] flex items-center gap-1.5 group-hover:bg-[#4FA9A7] transition-colors">
            <MonitorCheck className="w-4 h-4 text-[#08252B]" />
            <span>MAXIMO ALDANA TI</span>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <h1 className="text-[17px] font-extrabold text-[#F1F7F8] tracking-[0.04em] leading-tight">
                Gestão de Chamados de TI
              </h1>
              {isOnlineDb ? (
                <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#43C486]/15 text-[#43C486] border border-[#43C486]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#43C486]" /> Supabase Conectado
                </span>
              ) : (
                <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-[#7893A2]/15 text-[#9EB5C1] border border-[#234963]">
                  <Database className="w-2.5 h-2.5 text-[#E2B552]" /> Modo Local
                </span>
              )}
            </div>
            <p className="text-[11px] font-bold text-[#66C1BF] tracking-[0.02em] leading-none mt-0.5">
              Suporte Técnico & Infraestrutura de Obra
            </p>
          </div>
        </button>

        {/* Quick Actions Header Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Notification Bell */}
          <button
            type="button"
            onClick={() => setActiveTab('chamados')}
            className="relative p-2 rounded-[6px] bg-[#14334C] hover:bg-[#163A55] text-[#66C1BF] border border-[#234963] hover:border-[#66C1BF] transition-all flex items-center justify-center cursor-pointer"
            title={hasSlaBreach ? "Existem chamados com SLA vencido!" : "Nenhuma notificação crítica"}
          >
            <Bell className="w-4 h-4" />
            {hasSlaBreach && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E16666] border-2 border-[#14334C]" />
            )}
          </button>

          {/* Theme Switcher Button */}
          <button
            type="button"
            onClick={toggleTheme}
            title={theme === 'dark' ? "Alternar para Modo Claro" : "Alternar para Modo Escuro"}
            className="px-3 py-2 rounded-[6px] bg-[#14334C] hover:bg-[#163A55] text-[#66C1BF] border border-[#234963] hover:border-[#66C1BF] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-[#E2B552]" />
                <span className="text-xs font-bold text-[#F1F7F8] hidden xs:inline">Modo Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-[#00807D]" />
                <span className="text-xs font-bold text-[#0F172A] hidden xs:inline">Modo Escuro</span>
              </>
            )}
          </button>

          {/* New Ticket Action */}
          <button
            type="button"
            onClick={() => setIsNewTicketOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-[6px] bg-[#66C1BF] hover:bg-[#4FA9A7] text-[#08252B] font-bold text-[13px] tracking-[0.01em] shadow-[0_2px_8px_rgba(102,193,191,0.25)] transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Chamado TI</span>
          </button>

          {/* User Badge / Profile */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-[#234963]">
            <div className="w-8 h-8 rounded-full bg-[#14334C] border border-[#66C1BF] text-[#66C1BF] font-bold text-xs flex items-center justify-center">
              {user.avatar || 'PS'}
            </div>
            <div className="text-left leading-tight hidden lg:block">
              <p className="text-[12px] font-bold text-[#F1F7F8] truncate max-w-[120px]">{user.nome}</p>
              <p className="text-[10px] text-[#7893A2] truncate max-w-[120px]">{user.cargo}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
