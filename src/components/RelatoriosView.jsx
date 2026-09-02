import React from 'react';
import { BarChart3, CheckCircle2, Clock, AlertTriangle, Printer, TrendingUp, User } from 'lucide-react';
import { useTickets } from '../context/TicketContext';

export default function RelatoriosView() {
  const { chamados, tecnicos } = useTickets();

  const total = chamados.length;
  const concluidos = chamados.filter(c => c.status === 'Concluído').length;
  const slaCumprido = total > 0 ? Math.round((concluidos / total) * 100) : 100;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Header */}
      <div className="bg-[#102A40] border border-[#234963] rounded-[10px] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#66C1BF] text-[#08252B] p-2.5 rounded-[8px]">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#F1F7F8]">Relatórios & Indicadores de SLA</h2>
            <p className="text-xs text-[#9EB5C1]">
              Métricas consolidadas de eficiência de atendimento e tempo de resposta nas obras.
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-[6px] bg-[#66C1BF] hover:bg-[#4FA9A7] text-[#08252B] font-extrabold text-xs flex items-center gap-1.5 shadow-[0_2px_8px_rgba(102,193,191,0.25)] transition-all hover:-translate-y-0.5 shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Exportar Relatório</span>
        </button>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#102A40] border border-[#234963] p-5 rounded-[10px]">
          <span className="text-[11px] font-extrabold uppercase text-[#7893A2] tracking-wider">Índice de Cumprimento de SLA</span>
          <p className="text-3xl font-black text-[#43C486] mt-1">{slaCumprido}%</p>
          <p className="text-xs text-[#9EB5C1] mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-[#43C486]" />
            <span>Resoluções no prazo estipulado</span>
          </p>
        </div>

        <div className="bg-[#102A40] border border-[#234963] p-5 rounded-[10px]">
          <span className="text-[11px] font-extrabold uppercase text-[#7893A2] tracking-wider">Tempo Médio de Atendimento</span>
          <p className="text-3xl font-black text-[#66C1BF] mt-1">4.2h</p>
          <p className="text-xs text-[#9EB5C1] mt-1">Desde a abertura até a resolução</p>
        </div>

        <div className="bg-[#102A40] border border-[#234963] p-5 rounded-[10px]">
          <span className="text-[11px] font-extrabold uppercase text-[#7893A2] tracking-wider">Resolvidos no Primeiro Atendimento</span>
          <p className="text-3xl font-black text-[#E2B552] mt-1">88%</p>
          <p className="text-xs text-[#9EB5C1] mt-1">Eficiência de equipe técnica</p>
        </div>
      </div>

      {/* Technician Performance Table */}
      <div className="bg-[#102A40] border border-[#234963] rounded-[10px] p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-[#F1F7F8] flex items-center gap-2">
          <User className="w-4 h-4 text-[#66C1BF]" />
          <span>Desempenho por Técnico Responsável</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#081724] border-b border-[#234963] text-[#7893A2] font-extrabold uppercase text-[10.5px]">
                <th className="py-3 px-4">Técnico</th>
                <th className="py-3 px-4">Especialidade</th>
                <th className="py-3 px-4 text-center">Atendimentos</th>
                <th className="py-3 px-4 text-center">Concluídos</th>
                <th className="py-3 px-4 text-right">Avaliação de SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#234963]">
              {tecnicos.map(tec => {
                const tecTickets = chamados.filter(c => c.tecnicoAtribuido === tec.nome);
                const done = tecTickets.filter(c => c.status === 'Concluído').length;

                return (
                  <tr key={tec.id} className="hover:bg-[#14334C]">
                    <td className="py-3 px-4 font-bold text-[#F1F7F8]">{tec.nome}</td>
                    <td className="py-3 px-4 text-[#9EB5C1]">{tec.especialidade}</td>
                    <td className="py-3 px-4 text-center font-extrabold text-[#66C1BF]">{tecTickets.length}</td>
                    <td className="py-3 px-4 text-center font-extrabold text-[#43C486]">{done}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded text-[10.5px] font-extrabold bg-[#43C486]/15 text-[#43C486] border border-[#43C486]/30">
                        100% OK
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
