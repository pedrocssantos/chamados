import React, { useState } from 'react';
import { Layers, Clock, Plus, Trash2, X, CheckCircle2 } from 'lucide-react';
import { useTickets } from '../context/TicketContext';

export default function CategoriasView() {
  const { categorias, chamados, addCategoria, deleteCategoria, setTicketFilters } = useTickets();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [slaHoras, setSlaHoras] = useState('8');
  const [cor, setCor] = useState('#66C1BF');
  const [descricao, setDescricao] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome.trim()) return;

    addCategoria({
      nome,
      slaHoras: parseInt(slaHoras, 10) || 8,
      cor,
      descricao
    });

    setNome('');
    setSlaHoras('8');
    setCor('#66C1BF');
    setDescricao('');
    setIsModalOpen(false);
  };

  const handleDelete = (id, nomeCat) => {
    if (window.confirm(`Deseja remover a categoria "${nomeCat}"?`)) {
      deleteCategoria(id);
    }
  };

  return (
    <div className="space-y-6 animate-page-enter relative">
      {/* Header */}
      <div className="bg-[#102A40] border border-[#234963] rounded-[10px] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
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

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-[8px] bg-[#66C1BF] hover:bg-[#4FA9A7] text-[#08252B] font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Cadastrar Nova Categoria</span>
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categorias.map(cat => {
          const catTickets = chamados.filter(c => c.categoriaId === cat.id);
          const activeCount = catTickets.filter(c => c.status !== 'Concluído').length;

          return (
            <div
              key={cat.id}
              className="bg-[#102A40] border border-[#234963] hover:border-[#66C1BF]/50 rounded-[10px] p-5 shadow-sm space-y-3 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: cat.cor }}></span>
                  <span className="text-xs font-mono font-bold text-[#E2B552] bg-[#081724] px-2 py-0.5 rounded border border-[#234963] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> SLA: {cat.slaHoras || cat.sla_horas}h
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(cat.id, cat.nome)}
                  className="p-1 rounded bg-[#14334C] hover:bg-[#E16666] text-[#7893A2] hover:text-[#0B1D2D] border border-[#234963] transition-colors"
                  title="Excluir Categoria"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h3 className="text-base font-extrabold text-[#F1F7F8]">{cat.nome}</h3>
              <p className="text-xs text-[#9EB5C1] leading-relaxed">{cat.descricao || 'Sem descrição cadastrada.'}</p>

              <div className="pt-3 border-t border-[#234963] flex items-center justify-between text-xs text-[#7893A2]">
                <span>Total Registrado: <strong className="text-[#F1F7F8]">{catTickets.length}</strong></span>
                <button
                  type="button"
                  onClick={() => setTicketFilters({ categoriaId: cat.id })}
                  className="text-[#66C1BF] font-bold hover:underline cursor-pointer"
                >
                  {activeCount} em andamento
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: NOVA CATEGORIA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-[#0B1D2D]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#102A40] border border-[#66C1BF]/40 rounded-[12px] max-w-lg w-full p-6 shadow-2xl space-y-4 animate-page-enter">
            <div className="flex items-center justify-between pb-3 border-b border-[#234963]">
              <h3 className="text-base font-extrabold text-[#F1F7F8] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#66C1BF]" />
                <span>Cadastrar Nova Categoria e SLA</span>
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[#7893A2] hover:text-[#F1F7F8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[#9EB5C1] font-bold block mb-1">Nome da Categoria</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Cabeamento Estruturado e Fibra"
                  className="w-full px-3 py-2.5 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-[#F1F7F8] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#9EB5C1] font-bold block mb-1">Prazo Máximo SLA (Horas)</label>
                  <input
                    type="number"
                    min="1"
                    max="168"
                    required
                    value={slaHoras}
                    onChange={(e) => setSlaHoras(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-[#F1F7F8] outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="text-[#9EB5C1] font-bold block mb-1">Cor da Identificação</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={cor}
                      onChange={(e) => setCor(e.target.value)}
                      className="w-10 h-9 p-1 rounded-[6px] bg-[#081724] border border-[#234963] cursor-pointer"
                    />
                    <span className="font-mono text-xs text-[#9EB5C1]">{cor}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[#9EB5C1] font-bold block mb-1">Descrição e Escopo de Atendimento</label>
                <textarea
                  rows={3}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descreva o que se enquadra nesta categoria de suporte..."
                  className="w-full px-3 py-2 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-[#F1F7F8] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#234963]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-[6px] bg-[#14334C] text-[#9EB5C1] hover:text-[#F1F7F8] font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-[6px] bg-[#66C1BF] hover:bg-[#4FA9A7] text-[#08252B] font-extrabold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Salvar Categoria</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
