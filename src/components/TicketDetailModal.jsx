import React, { useState } from 'react';
import { 
  X, 
  User, 
  Clock, 
  Send, 
  Printer, 
  Calendar, 
  MapPin, 
  CheckCircle2,
  Headphones,
  Edit,
  Trash2,
  Save,
  Undo2,
  Building,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';

export default function TicketDetailModal() {
  const { 
    selectedTicket, 
    setSelectedTicket, 
    updateTicketStatus, 
    editTicket, 
    deleteTicket, 
    tecnicos, 
    obras, 
    categorias, 
    user 
  } = useTickets();

  const [newComment, setNewComment] = useState('');
  const [statusSelect, setStatusSelect] = useState(selectedTicket?.status || 'Aberto');
  const [tecnicoSelect, setTecnicoSelect] = useState(selectedTicket?.tecnicoAtribuido || 'Pendente de Atribuição');

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitulo, setEditTitulo] = useState(selectedTicket?.titulo || '');
  const [editDescricao, setEditDescricao] = useState(selectedTicket?.descricao || '');
  const [editLocalizacao, setEditLocalizacao] = useState(selectedTicket?.localizacao || '');
  const [editObraId, setEditObraId] = useState(selectedTicket?.obraId || '');
  const [editCategoriaId, setEditCategoriaId] = useState(selectedTicket?.categoriaId || '');
  const [editPrioridade, setEditPrioridade] = useState(selectedTicket?.prioridade || 'Média');

  if (!selectedTicket) return null;

  const isClient = user?.role === 'cliente';

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    if (!newComment && isClient) return;
    
    updateTicketStatus(
      selectedTicket.id, 
      isClient ? selectedTicket.status : statusSelect, 
      isClient ? selectedTicket.tecnicoAtribuido : tecnicoSelect, 
      newComment
    );
    setNewComment('');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editTitulo.trim() || !editDescricao.trim()) {
      alert('Preencha ao menos o título e a descrição.');
      return;
    }

    editTicket(selectedTicket.id, {
      titulo: editTitulo,
      descricao: editDescricao,
      localizacao: editLocalizacao,
      obraId: editObraId,
      categoriaId: editCategoriaId,
      prioridade: editPrioridade,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir o chamado ${selectedTicket.id}? Esta ação não pode ser desfeita.`)) {
      deleteTicket(selectedTicket.id);
      setSelectedTicket(null);
    }
  };

  const getPriorityBadge = (prioridade) => {
    if (prioridade === 'Crítica') {
      return <span className="px-2.5 py-1 rounded-[4px] text-[11px] font-extrabold bg-[#E16666] text-[#0B1D2D]">URGÊNCIA CRÍTICA</span>;
    }
    if (prioridade === 'Alta') {
      return <span className="px-2.5 py-1 rounded-[4px] text-[11px] font-bold bg-[#E16666]/20 text-[#E16666]">PRIORIDADE ALTA</span>;
    }
    if (prioridade === 'Média') {
      return <span className="px-2.5 py-1 rounded-[4px] text-[11px] font-bold bg-[#E2B552]/20 text-[#E2B552]">PRIORIDADE MÉDIA</span>;
    }
    return <span className="px-2.5 py-1 rounded-[4px] text-[11px] font-semibold bg-[#7893A2]/20 text-[#9EB5C1]">PRIORIDADE BAIXA</span>;
  };

  const printTicket = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0B1D2D]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#102A40] border border-[#66C1BF]/40 rounded-[12px] max-w-4xl w-full max-h-[92vh] flex flex-col shadow-[0_25px_60px_rgba(0,0,0,0.45)] animate-page-enter overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-[#081724] px-5 py-4 border-b border-[#234963] flex items-center justify-between gap-4 shrink-0 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-[#66C1BF] text-[#08252B] font-mono font-black text-sm px-3 py-1 rounded shadow-sm shrink-0">
              {selectedTicket.id}
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-extrabold text-[#F1F7F8] truncate max-w-md sm:max-w-xl">
                {selectedTicket.titulo}
              </h3>
              <p className="text-xs text-[#66C1BF] font-semibold">
                Obra / Ponto: {selectedTicket.obraNome}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => {
                  setEditTitulo(selectedTicket.titulo);
                  setEditDescricao(selectedTicket.descricao);
                  setEditLocalizacao(selectedTicket.localizacao);
                  setEditObraId(selectedTicket.obraId);
                  setEditCategoriaId(selectedTicket.categoriaId);
                  setEditPrioridade(selectedTicket.prioridade);
                  setIsEditing(true);
                }}
                className="px-3 py-1.5 rounded-[6px] bg-[#14334C] hover:bg-[#163A55] text-[#66C1BF] border border-[#234963] hover:border-[#66C1BF] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Editar dados deste chamado"
              >
                <Edit className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Editar</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-[6px] bg-[#14334C] hover:bg-[#163A55] text-[#9EB5C1] border border-[#234963] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Cancelar Edição</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDelete}
              className="p-1.5 rounded-[6px] bg-[#E16666]/10 hover:bg-[#E16666] text-[#E16666] hover:text-[#0B1D2D] border border-[#E16666]/30 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              title="Excluir Chamado"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={printTicket}
              title="Imprimir Comprovante de Chamado"
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-[6px] bg-[#14334C] hover:bg-[#163A55] text-[#66C1BF] border border-[#234963] text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir OS</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTicket(null)}
              className="p-1.5 rounded-[6px] text-[#7893A2] hover:text-[#F1F7F8] hover:bg-[#14334C] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* EDIT FORM (When in Edit Mode) */}
          {isEditing ? (
            <form onSubmit={handleSaveEdit} className="bg-[#081724] border border-[#66C1BF]/40 rounded-[10px] p-5 space-y-4 animate-page-enter">
              <div className="flex items-center justify-between pb-3 border-b border-[#234963]">
                <h4 className="text-sm font-extrabold text-[#66C1BF] flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  <span>Editar Informações do Chamado</span>
                </h4>
                <span className="text-[11px] text-[#9EB5C1]">Altere os campos e clique em Salvar</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[#9EB5C1] font-semibold block mb-1">Título do Chamado</label>
                  <input
                    type="text"
                    value={editTitulo}
                    onChange={(e) => setEditTitulo(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-[6px] bg-[#14334C] border border-[#234963] focus:border-[#66C1BF] text-xs font-bold text-[#F1F7F8] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#9EB5C1] font-semibold block mb-1">Obra / Localidade</label>
                    <select
                      value={editObraId}
                      onChange={(e) => setEditObraId(e.target.value)}
                      className="w-full px-3 py-2 rounded-[6px] bg-[#14334C] border border-[#234963] focus:border-[#66C1BF] text-xs font-bold text-[#F1F7F8] outline-none"
                    >
                      {obras.map(o => (
                        <option key={o.id} value={o.id}>{o.nome}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[#9EB5C1] font-semibold block mb-1">Categoria de Atendimento</label>
                    <select
                      value={editCategoriaId}
                      onChange={(e) => setEditCategoriaId(e.target.value)}
                      className="w-full px-3 py-2 rounded-[6px] bg-[#14334C] border border-[#234963] focus:border-[#66C1BF] text-xs font-bold text-[#F1F7F8] outline-none"
                    >
                      {categorias.map(c => (
                        <option key={c.id} value={c.id}>{c.nome}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[#9EB5C1] font-semibold block mb-1">Prioridade</label>
                    <select
                      value={editPrioridade}
                      onChange={(e) => setEditPrioridade(e.target.value)}
                      className="w-full px-3 py-2 rounded-[6px] bg-[#14334C] border border-[#234963] focus:border-[#66C1BF] text-xs font-bold text-[#F1F7F8] outline-none"
                    >
                      <option value="Baixa">Baixa</option>
                      <option value="Média">Média</option>
                      <option value="Alta">Alta</option>
                      <option value="Crítica">Crítica (Urgente)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[#9EB5C1] font-semibold block mb-1">Localização Exata no Canteiro</label>
                    <input
                      type="text"
                      value={editLocalizacao}
                      onChange={(e) => setEditLocalizacao(e.target.value)}
                      className="w-full px-3 py-2 rounded-[6px] bg-[#14334C] border border-[#234963] focus:border-[#66C1BF] text-xs font-bold text-[#F1F7F8] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#9EB5C1] font-semibold block mb-1">Descrição Detalhada do Problema</label>
                  <textarea
                    rows={4}
                    value={editDescricao}
                    onChange={(e) => setEditDescricao(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-[6px] bg-[#14334C] border border-[#234963] focus:border-[#66C1BF] text-xs text-[#F1F7F8] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-[6px] bg-[#14334C] text-[#9EB5C1] hover:text-[#F1F7F8] text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-[6px] bg-[#66C1BF] hover:bg-[#4FA9A7] text-[#08252B] text-xs font-extrabold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Modificações</span>
                </button>
              </div>
            </form>
          ) : (
            /* READ-ONLY MAIN CARD */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Left side details (2 cols) */}
              <div className="md:col-span-2 space-y-4">
                {/* Badges bar */}
                <div className="flex items-center gap-2 flex-wrap">
                  {getPriorityBadge(selectedTicket.prioridade)}
                  <span className="px-2.5 py-1 rounded-[4px] text-[11px] font-extrabold bg-[#66C1BF]/15 text-[#66C1BF] border border-[#66C1BF]/30">
                    {selectedTicket.categoriaNome}
                  </span>
                  <span className="px-2.5 py-1 rounded-[4px] text-[11px] font-bold bg-[#14334C] text-[#F1F7F8] border border-[#234963]">
                    Status: {selectedTicket.status}
                  </span>
                </div>

                {/* Description */}
                <div className="bg-[#081724] border border-[#234963] p-4 rounded-[8px] space-y-2">
                  <h4 className="text-xs font-extrabold uppercase text-[#7893A2] tracking-wider">
                    Descrição Detalhada da Ocorrência de TI
                  </h4>
                  <p className="text-sm text-[#F1F7F8] leading-relaxed whitespace-pre-line">
                    {selectedTicket.descricao}
                  </p>
                </div>

                {/* Meta Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#14334C]/50 border border-[#234963] p-3 rounded-[6px] space-y-1">
                    <span className="text-[#7893A2] flex items-center gap-1 font-semibold text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-[#66C1BF]" /> Localização Exata
                    </span>
                    <p className="font-extrabold text-[#F1F7F8]">{selectedTicket.localizacao}</p>
                  </div>

                  <div className="bg-[#14334C]/50 border border-[#234963] p-3 rounded-[6px] space-y-1">
                    <span className="text-[#7893A2] flex items-center gap-1 font-semibold text-[11px]">
                      <User className="w-3.5 h-3.5 text-[#66C1BF]" /> Solicitante
                    </span>
                    <p className="font-extrabold text-[#F1F7F8]">{selectedTicket.solicitante}</p>
                  </div>

                  <div className="bg-[#14334C]/50 border border-[#234963] p-3 rounded-[6px] space-y-1">
                    <span className="text-[#7893A2] flex items-center gap-1 font-semibold text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-[#66C1BF]" /> Data de Abertura
                    </span>
                    <p className="font-extrabold text-[#F1F7F8]">{selectedTicket.dataCriacao}</p>
                  </div>

                  <div className="bg-[#14334C]/50 border border-[#234963] p-3 rounded-[6px] space-y-1">
                    <span className="text-[#7893A2] flex items-center gap-1 font-semibold text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-[#E2B552]" /> Prazo Máximo SLA
                    </span>
                    <p className="font-extrabold text-[#E2B552]">{selectedTicket.prazoSla}</p>
                  </div>
                </div>
              </div>

              {/* Right side Panel (Admin Controls or Client Tracker) */}
              <div className="bg-[#081724] border border-[#234963] p-4 rounded-[8px] space-y-4">
                <h4 className="text-xs font-extrabold uppercase text-[#66C1BF] tracking-wider pb-2 border-b border-[#234963]">
                  {isClient ? 'Status do Atendimento' : 'Painel de Atendimento TI'}
                </h4>

                {isClient ? (
                  /* Client Read-Only Status Card */
                  <div className="space-y-3">
                    <div className="p-3 bg-[#14334C]/60 rounded-[8px] border border-[#234963] space-y-2">
                      <span className="text-[10.5px] font-bold text-[#7893A2] uppercase block">Status do seu chamado</span>
                      <span className="inline-block px-3 py-1 rounded text-xs font-black bg-[#66C1BF] text-[#08252B]">
                        {selectedTicket.status}
                      </span>
                    </div>

                    <div className="p-3 bg-[#14334C]/60 rounded-[8px] border border-[#234963] space-y-1">
                      <span className="text-[10.5px] font-bold text-[#7893A2] uppercase block">Técnico Responsável</span>
                      <p className="text-xs font-bold text-[#F1F7F8] flex items-center gap-1.5">
                        <Headphones className="w-3.5 h-3.5 text-[#66C1BF]" />
                        <span>{selectedTicket.tecnicoAtribuido}</span>
                      </p>
                    </div>

                    <div className="p-2.5 bg-[#66C1BF]/10 rounded-[6px] border border-[#66C1BF]/20 text-[11px] text-[#9EB5C1]">
                      💡 Use o campo abaixo para enviar mensagens ou dúvidas diretamente à equipe técnica.
                    </div>
                  </div>
                ) : (
                  /* Admin Management Panel */
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs text-[#9EB5C1] font-semibold block">Status Atual</label>
                      <select
                        value={statusSelect}
                        onChange={(e) => setStatusSelect(e.target.value)}
                        className="w-full px-3 py-2 rounded-[6px] bg-[#14334C] border border-[#234963] focus:border-[#66C1BF] text-xs font-bold text-[#F1F7F8] focus:outline-none"
                      >
                        <option value="Aberto">Aberto</option>
                        <option value="Em Atendimento">Em Atendimento</option>
                        <option value="Aguardando Peça">Aguardando Peça</option>
                        <option value="Concluído">Concluído</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-[#9EB5C1] font-semibold block">Técnico Responsável</label>
                      <select
                        value={tecnicoSelect}
                        onChange={(e) => setTecnicoSelect(e.target.value)}
                        className="w-full px-3 py-2 rounded-[6px] bg-[#14334C] border border-[#234963] focus:border-[#66C1BF] text-xs font-bold text-[#F1F7F8] focus:outline-none"
                      >
                        <option value="Pendente de Atribuição">Pendente de Atribuição</option>
                        {tecnicos.map(t => (
                          <option key={t.id} value={t.nome}>{t.nome} ({t.especialidade})</option>
                        ))}
                      </select>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleUpdateStatus}
                        className="w-full py-2.5 bg-[#66C1BF] hover:bg-[#4FA9A7] text-[#08252B] font-extrabold rounded-[6px] text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Salvar Alterações</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Timeline / Historico */}
          <div className="space-y-3 pt-4 border-t border-[#234963]">
            <h4 className="text-sm font-extrabold text-[#F1F7F8] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#66C1BF]" />
              <span>Histórico de Atendimento e Interações</span>
            </h4>

            <div className="space-y-3">
              {selectedTicket.historico?.map((item, idx) => (
                <div key={idx} className="flex gap-3 text-xs bg-[#081724] border border-[#234963] p-3 rounded-[6px]">
                  <div className="w-7 h-7 rounded-full bg-[#14334C] border border-[#66C1BF] text-[#66C1BF] font-bold flex items-center justify-center shrink-0">
                    {item.autor.charAt(0)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-[#7893A2]">
                      <strong className="text-[#F1F7F8] font-bold">{item.autor}</strong>
                      <span className="text-[10px]">{item.data}</span>
                    </div>
                    <p className="text-[#9EB5C1]">{item.texto}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleUpdateStatus} className="mt-4 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={isClient ? "Adicionar observação para a equipe de TI..." : "Adicionar observação técnica ou nota de andamento..."}
                className="flex-1 px-3 py-2 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs text-[#F1F7F8] placeholder-[#7893A2] focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#14334C] hover:bg-[#66C1BF] text-[#66C1BF] hover:text-[#08252B] border border-[#234963] hover:border-[#66C1BF] rounded-[6px] text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
