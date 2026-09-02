import React, { useState } from 'react';
import { FileText, Laptop, CheckCircle, Plus, Search, Download, ShieldCheck } from 'lucide-react';
import { useTickets } from '../context/TicketContext';

export default function TermosNotebooksView() {
  const { termos, addTermo } = useTickets();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [colaborador, setColaborador] = useState('');
  const [cargo, setCargo] = useState('');
  const [equipamento, setEquipamento] = useState('');
  const [patrimonio, setPatrimonio] = useState('');

  const filteredTermos = termos.filter(t => 
    t.colaborador.toLowerCase().includes(search.toLowerCase()) ||
    t.equipamento.toLowerCase().includes(search.toLowerCase()) ||
    t.patrimonio.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddTermo = (e) => {
    e.preventDefault();
    if (!colaborador || !equipamento || !patrimonio) return;

    const newTermo = {
      id: `TERMO-2026-${String(termos.length + 1).padStart(2, '0')}`,
      colaborador,
      cargo: cargo || 'Colaborador',
      equipamento,
      patrimonio,
      dataEntrega: new Date().toISOString().substring(0, 10),
      status: 'Aguardando Assinatura'
    };

    addTermo(newTermo);
    setIsModalOpen(false);
    setColaborador('');
    setCargo('');
    setEquipamento('');
    setPatrimonio('');
  };

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Header */}
      <div className="bg-[#102A40] border border-[#234963] rounded-[10px] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#66C1BF] text-[#08252B] p-2.5 rounded-[8px]">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#F1F7F8]">Termos de Responsabilidade de Notebooks</h2>
            <p className="text-xs text-[#9EB5C1]">
              Controle de entrega, devolução e assinaturas digitais de equipamentos de TI da Maximo Aldana.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-[6px] bg-[#66C1BF] hover:bg-[#4FA9A7] text-[#08252B] font-extrabold text-xs flex items-center gap-1.5 shadow-[0_2px_8px_rgba(102,193,191,0.25)] transition-all hover:-translate-y-0.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Termo de Entrega</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#102A40] border border-[#234963] p-4 rounded-[10px] flex items-center gap-3">
        <Search className="w-4 h-4 text-[#7893A2]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por colaborador, modelo de notebook ou nº de patrimônio..."
          className="w-full bg-transparent text-xs text-[#F1F7F8] placeholder-[#7893A2] focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-[#102A40] border border-[#234963] rounded-[10px] overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#081724] border-b border-[#234963] text-[#7893A2] font-extrabold uppercase text-[10.5px]">
              <th className="py-3 px-4">Cód. Termo</th>
              <th className="py-3 px-4">Colaborador / Cargo</th>
              <th className="py-3 px-4">Equipamento de TI</th>
              <th className="py-3 px-4">Patrimônio</th>
              <th className="py-3 px-4">Data Entrega</th>
              <th className="py-3 px-4">Status Termo</th>
              <th className="py-3 px-4 text-right">Download PDF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#234963]">
            {filteredTermos.map(t => (
              <tr key={t.id} className="hover:bg-[#14334C]">
                <td className="py-3 px-4 font-mono font-bold text-[#66C1BF]">{t.id}</td>
                <td className="py-3 px-4 font-bold text-[#F1F7F8]">
                  {t.colaborador}
                  <span className="block text-[11px] font-normal text-[#7893A2]">{t.cargo}</span>
                </td>
                <td className="py-3 px-4 text-[#9EB5C1]">{t.equipamento}</td>
                <td className="py-3 px-4 font-mono font-bold text-[#E2B552]">{t.patrimonio}</td>
                <td className="py-3 px-4 text-[#7893A2]">{t.dataEntrega}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10.5px] font-extrabold bg-[#43C486]/15 text-[#43C486] border border-[#43C486]/30 flex items-center gap-1 w-fit">
                    <ShieldCheck className="w-3 h-3" />
                    {t.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button 
                    onClick={() => window.print()}
                    className="p-1.5 rounded bg-[#14334C] hover:bg-[#66C1BF] text-[#66C1BF] hover:text-[#08252B] transition-colors"
                    title="Baixar Termo Assinado PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Add Termo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-[#0B1D2D]/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#102A40] border border-[#66C1BF]/40 p-5 rounded-[10px] max-w-md w-full space-y-4 animate-page-enter">
            <h3 className="text-base font-extrabold text-[#F1F7F8]">Gerar Termo de Responsabilidade</h3>
            <form onSubmit={handleAddTermo} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Nome do Colaborador (ex: Eng. Carlos Eduardo)"
                value={colaborador}
                onChange={(e) => setColaborador(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#081724] border border-[#234963] text-xs text-[#F1F7F8] focus:outline-none"
              />
              <input
                type="text"
                placeholder="Cargo / Departamento"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#081724] border border-[#234963] text-xs text-[#F1F7F8] focus:outline-none"
              />
              <input
                type="text"
                required
                placeholder="Modelo do Equipamento (ex: Dell Latitude i7)"
                value={equipamento}
                onChange={(e) => setEquipamento(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#081724] border border-[#234963] text-xs text-[#F1F7F8] focus:outline-none"
              />
              <input
                type="text"
                required
                placeholder="Nº Patrimônio TI (ex: MA-TI-NB-095)"
                value={patrimonio}
                onChange={(e) => setPatrimonio(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#081724] border border-[#234963] text-xs text-[#F1F7F8] focus:outline-none"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 bg-[#14334C] text-[#9EB5C1] rounded text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#66C1BF] text-[#08252B] font-extrabold rounded text-xs"
                >
                  Gerar Termo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
