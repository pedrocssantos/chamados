import React, { useState } from 'react';
import { MonitorCheck, Plus, Sun, Moon, Bell, Database, LogOut, User, HardHat, Headphones } from 'lucide-react';
import { useTickets } from '../context/TicketContext';

export default function Header() {
  const { theme, toggleTheme, setActiveTab, setIsNewTicketOpen, user, chamados, isOnlineDb, logout } = useTickets();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const hasSlaBreach = (chamados || []).some(t => {
    if (!t || !t.prazoSla || t.status === 'Concluído') return false;
    try {
      const parts = t.prazoSla.split(/[\/\s:]/);
      if (parts && parts.length >= 5) {
        let yyyy = parseInt(parts[2], 10);
        let mm = parseInt(parts[1], 10) - 1;
        let dd = parseInt(parts[0], 10);
        let hh = parseInt(parts[3], 10);
        let min = parseInt(parts[4], 10);

        if (parts[0].length === 4) {
          yyyy = parseInt(parts[0], 10);
          mm = parseInt(parts[1], 10) - 1;
          dd = parseInt(parts[2], 10);
        }

        const deadline = new Date(yyyy, mm, dd, hh, min);
        return !isNaN(deadline.getTime()) && new Date() > deadline;
      }
    } catch (e) {
      return false;
    }
    return false;
  });

  return (
    <header className="sticky top-0 z-50 w-full bg-[#102A40] border-b border-[#66C1BF]/45 shadow-[0_12px_30px_rgba(0,0,0,0.22)] px-4 sm:px-8 py-3 transition-colors">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo & Title */}
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <div className="bg-[#66C1BF] text-[#08252B] font-extrabold text-sm tracking-[0.06em] px-3 py-1.5 rounded-[6px] shadow-[0_2px_8px_rgba(102,193,191,0.25)] flex items-center gap-1.5 group-hover:bg-[#4FA9A7] transition-colors">
            <MonitorCheck className="w-4 h-4 text-[#08252B]" />
            <span>MAXIMO ALDANA TI</span>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <h1 className="text-[16px] font-extrabold text-[#F1F7F8] tracking-[0.03em] leading-tight">
                Gestão de Chamados de TI
              </h1>
              {isOnlineDb ? (
                <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#43C486]/15 text-[#43C486] border border-[#43C486]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#43C486]" /> Supabase Online
                </span>
              ) : (
                <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-[#7893A2]/15 text-[#9EB5C1] border border-[#234963]">
                  <Database className="w-2.5 h-2.5 text-[#E2B552]" /> Modo Local
                </span>
              )}
            </div>
            <p className="text-[11px] font-bold text-[#66C1BF] tracking-[0.02em] leading-none mt-0.5">
              {user?.role === 'cliente' ? `Portal do Canteiro: ${user?.obraNome}` : 'Suporte Técnico e Infraestrutura'}
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
            className="px-2.5 sm:px-3 py-2 rounded-[6px] bg-[#14334C] hover:bg-[#163A55] text-[#66C1BF] border border-[#234963] hover:border-[#66C1BF] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-[#E2B552]" />
                <span className="text-xs font-bold text-[#F1F7F8] hidden md:inline">Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-[#00807D]" />
                <span className="text-xs font-bold text-[#0F172A] hidden md:inline">Escuro</span>
              </>
            )}
          </button>

          {/* New Ticket Action */}
          <button
            type="button"
            onClick={() => setIsNewTicketOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-[6px] bg-[#66C1BF] hover:bg-[#4FA9A7] text-[#08252B] font-bold text-[12.5px] sm:text-[13px] tracking-[0.01em] shadow-[0_2px_8px_rgba(102,193,191,0.25)] transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Chamado</span>
          </button>

          {/* User Profile Badge & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 pl-2 border-l border-[#234963] hover:opacity-90 transition-opacity cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-full bg-[#14334C] border border-[#66C1BF] text-[#66C1BF] font-bold text-xs flex items-center justify-center shrink-0">
                {user?.avatar || 'MA'}
              </div>
              <div className="hidden lg:block leading-tight max-w-[130px]">
                <p className="text-[12px] font-bold text-[#F1F7F8] truncate">{user?.nome || 'Usuário'}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {user?.role === 'suporte' ? (
                    <span className="text-[9.5px] font-extrabold text-[#66C1BF] bg-[#66C1BF]/15 px-1 py-0.2 rounded">TI / ADMIN</span>
                  ) : (
                    <span className="text-[9.5px] font-bold text-[#E2B552] bg-[#E2B552]/15 px-1 py-0.2 rounded truncate">OBRA</span>
                  )}
                </div>
              </div>
            </button>

            {/* Profile Menu Dropdown */}
            {showProfileMenu && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-[#102A40] border border-[#66C1BF]/40 rounded-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-2 space-y-1 z-50 animate-page-enter"
                onMouseLeave={() => setShowProfileMenu(false)}
              >
                <div className="p-2.5 border-b border-[#234963] bg-[#081724] rounded-[6px]">
                  <p className="text-xs font-extrabold text-[#F1F7F8] truncate">{user?.nome}</p>
                  <p className="text-[10px] text-[#66C1BF] font-semibold truncate">{user?.cargo}</p>
                  <p className="text-[10px] text-[#7893A2] truncate">{user?.email}</p>
                  {user?.obraNome && (
                    <p className="text-[10px] text-[#9EB5C1] mt-1 pt-1 border-t border-[#234963] flex items-center gap-1">
                      <HardHat className="w-3 h-3 text-[#E2B552]" /> {user.obraNome}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => { setActiveTab('perfil'); setShowProfileMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-[6px] text-xs font-bold text-[#F1F7F8] hover:bg-[#14334C] hover:text-[#66C1BF] transition-colors text-left cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#66C1BF]" />
                  <span>Meu Perfil</span>
                </button>

                <button
                  type="button"
                  onClick={() => { logout(); setShowProfileMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-[6px] text-xs font-bold text-[#E16666] hover:bg-[#E16666]/15 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair do Sistema</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
