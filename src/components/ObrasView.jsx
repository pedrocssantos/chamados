import React from 'react';
import { Building, MapPin, User, LifeBuoy, ChevronRight, QrCode } from 'lucide-react';
import { useTickets } from '../context/TicketContext';

export default function ObrasView() {
  const { obras, chamados, setActiveTab } = useTickets();

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Header */}
      <div className="bg-[#102A40] border border-[#234963] rounded-[10px] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)]">
        <div className="flex items-center gap-3 mb-1">
          <div className="bg-[#66C1BF] text-[#08252B] p-2.5 rounded-[8px]">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#F1F7F8]">Obras & Empreendimentos</h2>
            <p className="text-xs text-[#9EB5C1]">
              Canteiros de obra ativos e sedes operacionais da Construtora Maximo Aldana.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {obras.map(obra => {
          const ticketsCount = chamados.filter(c => c.obraId === obra.id && c.status !== 'Concluído').length;
          const totalCount = chamados.filter(c => c.obraId === obra.id).length;

          return (
            <div
              key={obra.id}
              className="bg-[#102A40] border border-[#234963] hover:border-[#66C1BF]/60 rounded-[10px] p-5 shadow-sm space-y-4 transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10.5px] font-extrabold uppercase text-[#66C1BF] tracking-wider bg-[#66C1BF]/15 px-2 py-0.5 rounded border border-[#66C1BF]/30">
                    {obra.status}
                  </span>
                  <h3 className="text-lg font-extrabold text-[#F1F7F8] mt-1.5">{obra.nome}</h3>
                  <p className="text-xs text-[#9EB5C1] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#7893A2]" />
                    <span>{obra.cidade}</span>
                  </p>
                </div>

                <span className="font-mono text-xs text-[#66C1BF] bg-[#081724] px-2.5 py-1 rounded border border-[#234963]">
                  {obra.codigoQr}
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#9EB5C1]">Avanço Físico da Obra</span>
                  <span className="text-[#66C1BF]">{obra.progresso}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#081724] border border-[#234963] overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#66C1BF] to-[#43C486] transition-all"
                    style={{ width: `${obra.progresso}%` }}
                  ></div>
                </div>
              </div>

              {/* Details footer */}
              <div className="pt-3 border-t border-[#234963] flex items-center justify-between text-xs">
                <span className="text-[#9EB5C1] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#66C1BF]" />
                  <span>Residente: <strong className="text-[#F1F7F8]">{obra.engenheiro}</strong></span>
                </span>

                <button
                  onClick={() => setActiveTab('chamados')}
                  className="text-xs font-bold text-[#66C1BF] hover:underline flex items-center gap-1"
                >
                  <LifeBuoy className="w-3.5 h-3.5" />
                  <span>{ticketsCount} chamados pendentes</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
