import React from 'react';
import { Layers, Clock, ShieldCheck } from 'lucide-react';
import { useTickets } from '../context/TicketContext';

export default function CategoriasView() {
  const { categorias, chamados } = useTickets();

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Header */}
      <div className="bg-[#102A40] border border-[#234963] rounded-[10px] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)]">
        <div className="flex items-center gap-3 mb-1">
          <div className="bg-[#66C1BF] text-[#08252B] p-2.5 rounded-[8px]">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#F1F7F8]">Categorias de Atendimento e Prazos SLA</h2>
            <p className="text-xs text-[#9EB5C1]">
              Prazos de atendimento regulamentados por categoria e severidade para os canteiros de obra.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categorias.map(cat => {
          const catTickets = chamados.filter(c => c.categoriaId === cat.id);
          const activeCount = catTickets.filter(c => c.status !== 'Concluído').length;

          return (
            <div
              key={cat.id}
              className="bg-[#102A40] border border-[#234963] rounded-[10px] p-5 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.cor }}></span>
                <span className="text-xs font-mono font-bold text-[#E2B552] bg-[#081724] px-2 py-0.5 rounded border border-[#234963] flex items-center gap-1">
                  <Clock className="w-3 h-3" /> SLA: {cat.slaHoras}h
                </span>
              </div>

              <h3 className="text-base font-extrabold text-[#F1F7F8]">{cat.nome}</h3>
              <p className="text-xs text-[#9EB5C1] leading-relaxed">{cat.descricao}</p>

              <div className="pt-3 border-t border-[#234963] flex items-center justify-between text-xs text-[#7893A2]">
                <span>Total Registrado: <strong className="text-[#F1F7F8]">{catTickets.length}</strong></span>
                <span className="text-[#66C1BF] font-bold">{activeCount} em andamento</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
