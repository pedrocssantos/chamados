import React, { useState } from 'react';
import { LayoutDashboard, Headphones, Building, Menu, Layers, BarChart3, Plus, X } from 'lucide-react';
import { useTickets } from '../context/TicketContext';

export default function MobileNav() {
  const { activeTab, setActiveTab, setIsNewTicketOpen } = useTickets();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Drawer Overlay if "Mais" is tapped */}
      {isMenuOpen && (
        <div 
          onClick={() => setIsMenuOpen(false)}
          className="md:hidden fixed inset-0 z-50 bg-[#0B1D2D]/90 backdrop-blur-sm flex flex-col justify-end"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#102A40] border-t border-[#234963] p-4 rounded-t-[20px] space-y-3 animate-page-enter"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#234963]">
              <h3 className="text-sm font-bold text-[#F1F7F8]">Menu de Navegação TI</h3>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-1 text-[#7893A2] hover:text-[#66C1BF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => { setActiveTab('categorias'); setIsMenuOpen(false); }}
                className="flex items-center gap-2.5 p-3 rounded-[8px] bg-[#14334C] border border-[#234963] text-left text-xs font-semibold text-[#F1F7F8]"
              >
                <Layers className="w-4 h-4 text-[#66C1BF]" />
                <span>Categorias & SLA</span>
              </button>
              <button
                onClick={() => { setActiveTab('relatorios'); setIsMenuOpen(false); }}
                className="flex items-center gap-2.5 p-3 rounded-[8px] bg-[#14334C] border border-[#234963] text-left text-xs font-semibold text-[#F1F7F8]"
              >
                <BarChart3 className="w-4 h-4 text-[#66C1BF]" />
                <span>Relatórios & SLA</span>
              </button>
              <button
                onClick={() => { setIsNewTicketOpen(true); setIsMenuOpen(false); }}
                className="col-span-2 flex items-center justify-center gap-2.5 p-3 rounded-[8px] bg-[#66C1BF] text-[#08252B] font-bold text-xs shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Abrir Novo Chamado</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#102A40]/98 border-t border-[#234963] px-2 py-1.5 shadow-[0_-4px_14px_rgba(0,0,0,0.25)] touch-manipulation">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center py-1 px-2.5 rounded-[6px] text-[11px] font-semibold transition-colors ${
              activeTab === 'dashboard' ? 'text-[#66C1BF] font-bold' : 'text-[#9EB5C1] hover:text-[#F1F7F8]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mb-0.5" />
            <span>Início</span>
          </button>

          <button
            onClick={() => setActiveTab('chamados')}
            className={`flex flex-col items-center py-1 px-2.5 rounded-[6px] text-[11px] font-semibold transition-colors ${
              activeTab === 'chamados' ? 'text-[#66C1BF] font-bold' : 'text-[#9EB5C1] hover:text-[#F1F7F8]'
            }`}
          >
            <Headphones className="w-4 h-4 mb-0.5" />
            <span>Chamados</span>
          </button>

          <button
            onClick={() => setActiveTab('obras')}
            className={`flex flex-col items-center py-1 px-2.5 rounded-[6px] text-[11px] font-semibold transition-colors ${
              activeTab === 'obras' ? 'text-[#66C1BF] font-bold' : 'text-[#9EB5C1] hover:text-[#F1F7F8]'
            }`}
          >
            <Building className="w-4 h-4 mb-0.5" />
            <span>Locais</span>
          </button>

          <button
            onClick={() => setActiveTab('categorias')}
            className={`flex flex-col items-center py-1 px-2.5 rounded-[6px] text-[11px] font-semibold transition-colors ${
              activeTab === 'categorias' ? 'text-[#66C1BF] font-bold' : 'text-[#9EB5C1] hover:text-[#F1F7F8]'
            }`}
          >
            <Layers className="w-4 h-4 mb-0.5" />
            <span>Categorias</span>
          </button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col items-center py-1 px-2.5 rounded-[6px] text-[11px] font-semibold text-[#9EB5C1] hover:text-[#F1F7F8] transition-colors"
          >
            <Menu className="w-4 h-4 mb-0.5" />
            <span>Mais</span>
          </button>
        </div>
      </nav>
    </>
  );
}
