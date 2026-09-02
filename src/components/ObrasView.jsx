import React, { useState } from 'react';
import { Building, MapPin, User, LifeBuoy, Plus, Trash2, X, CheckCircle2, Edit } from 'lucide-react';
import { useTickets } from '../context/TicketContext';

export default function ObrasView() {
  const { obras, chamados, setActiveTab, addObra, editObra, deleteObra, setTicketFilters } = useTickets();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingObra, setEditingObra] = useState(null);

  // Form states
  const [nome, setNome] = useState('');
  const [cidade, setCidade] = useState('');
  const [engenheiro, setEngenheiro] = useState('');
  const [progresso, setProgresso] = useState('50');
  const [status, setStatus] = useState('Operacional');

  const openCreateModal = () => {
    setEditingObra(null);
    setNome('');
    setCidade('');
    setEngenheiro('');
    setProgresso('50');
    setStatus('Operacional');
    setIsModalOpen(true);
  };

  const openEditModal = (obra) => {
    setEditingObra(obra);
    setNome(obra.nome);
    setCidade(obra.cidade);
    setEngenheiro(obra.engenheiro || '');
    setProgresso(String(obra.progresso || 0));
    setStatus(obra.status || 'Operacional');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome.trim() || !cidade.trim()) return;

    if (editingObra) {
      editObra(editingObra.id, {
        nome,
        cidade,
        engenheiro: engenheiro || 'Engenharia de Campo',
        progresso: parseInt(progresso, 10) || 0,
        status
      });
    } else {
      addObra({
        nome,
        cidade,
        engenheiro: engenheiro || 'Engenharia de Campo',
        progresso: parseInt(progresso, 10) || 0,
        status
      });
    }

    setIsModalOpen(false);
    setEditingObra(null);
  };

  const handleDelete = (id, nomeObra) => {
    if (window.confirm(`Deseja realmente remover a obra "${nomeObra}"? Esta ação removerá a obra do catálogo.`)) {
      deleteObra(id);
    }
  };

  return (
    <div className="space-y-6 animate-page-enter relative">
      {/* Header */}
      <div className="bg-[#102A40] border border-[#234963] rounded-[10px] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#66C1BF] text-[#08252B] p-2.5 rounded-[8px]">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#F1F7F8]">Obras e Canteiros</h2>
            <p className="text-xs text-[#9EB5C1]">
              Canteiros de obra ativos e sedes operacionais da Construtora Maximo Aldana.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-[8px] bg-[#66C1BF] hover:bg-[#4FA9A7] text-[#08252B] font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Cadastrar Nova Obra</span>
        </button>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {obras.map(obra => {
          const ticketsCount = chamados.filter(c => c.obraId === obra.id && c.status !== 'Concluído').length;

          return (
            <div
              key={obra.id}
              className="bg-[#102A40] border border-[#234963] hover:border-[#66C1BF]/60 rounded-[10px] p-5 shadow-sm space-y-4 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10.5px] font-extrabold uppercase text-[#66C1BF] tracking-wider bg-[#66C1BF]/15 px-2 py-0.5 rounded border border-[#66C1BF]/30">
                    {obra.status || 'Operacional'}
                  </span>
                  <h3 className="text-lg font-extrabold text-[#F1F7F8] mt-1.5">{obra.nome}</h3>
                  <p className="text-xs text-[#9EB5C1] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#7893A2]" />
                    <span>{obra.cidade}</span>
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs text-[#66C1BF] bg-[#081724] px-2.5 py-1 rounded border border-[#234963]">
                    {obra.codigoQr || obra.id}
                  </span>
                  
                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => openEditModal(obra)}
                    className="p-1.5 rounded bg-[#14334C] hover:bg-[#66C1BF] text-[#7893A2] hover:text-[#08252B] border border-[#234963] transition-colors cursor-pointer"
                    title="Editar Informações da Obra"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDelete(obra.id, obra.nome)}
                    className="p-1.5 rounded bg-[#14334C] hover:bg-[#E16666] text-[#7893A2] hover:text-[#0B1D2D] border border-[#234963] transition-colors cursor-pointer"
                    title="Excluir Obra"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#9EB5C1]">Avanço Físico da Obra</span>
                  <span className="text-[#66C1BF]">{obra.progresso}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#081724] border border-[#234963] overflow-hidden">
                  <div 
                    className="h-full bg-[#66C1BF] transition-all"
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
                  type="button"
                  onClick={() => {
                    setTicketFilters({ obraId: obra.id });
                  }}
                  className="text-xs font-bold text-[#66C1BF] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <LifeBuoy className="w-3.5 h-3.5" />
                  <span>{ticketsCount} chamados pendentes</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: NOVA OBRA / EDITAR OBRA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-[#0B1D2D]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#102A40] border border-[#66C1BF]/40 rounded-[12px] max-w-lg w-full p-6 shadow-2xl space-y-4 animate-page-enter">
            <div className="flex items-center justify-between pb-3 border-b border-[#234963]">
              <h3 className="text-base font-extrabold text-[#F1F7F8] flex items-center gap-2">
                <Building className="w-5 h-5 text-[#66C1BF]" />
                <span>{editingObra ? 'Editar Obra / Canteiro' : 'Cadastrar Nova Obra / Canteiro'}</span>
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
                <label className="text-[#9EB5C1] font-bold block mb-1">Nome do Empreendimento</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Obra Residencial Bella Vista"
                  className="w-full px-3 py-2.5 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-[#F1F7F8] font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#9EB5C1] font-bold block mb-1">Cidade / UF</label>
                  <input
                    type="text"
                    required
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="Ex: Santo André - SP"
                    className="w-full px-3 py-2.5 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-[#F1F7F8] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[#9EB5C1] font-bold block mb-1">Engenheiro Responsável</label>
                  <input
                    type="text"
                    value={engenheiro}
                    onChange={(e) => setEngenheiro(e.target.value)}
                    placeholder="Ex: Eng. Lucas Silveira"
                    className="w-full px-3 py-2.5 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-[#F1F7F8] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#9EB5C1] font-bold block mb-1">Status Operacional</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-[#F1F7F8] outline-none font-bold"
                  >
                    <option value="Operacional">Operacional</option>
                    <option value="Em Fundação">Em Fundação</option>
                    <option value="Em Acabamento">Em Acabamento</option>
                    <option value="Entregue">Entregue</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#9EB5C1] font-bold block mb-1">Avanço Físico: {progresso}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progresso}
                    onChange={(e) => setProgresso(e.target.value)}
                    className="w-full accent-[#66C1BF] mt-2"
                  />
                </div>
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
                  className="px-5 py-2 rounded-[6px] bg-[#66C1BF] hover:bg-[#4FA9A7] text-[#08252B] font-extrabold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingObra ? 'Salvar Modificações' : 'Salvar Obra'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
