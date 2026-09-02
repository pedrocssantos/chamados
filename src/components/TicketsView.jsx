import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  LifeBuoy, 
  QrCode, 
  Clock, 
  Building, 
  User, 
  ChevronRight,
  LayoutGrid,
  List,
  RefreshCw
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';

export default function TicketsView() {
  const { chamados, obras, categorias, setSelectedTicket, setIsNewTicketOpen, setActiveTab } = useTickets();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedObra, setSelectedObra] = useState('TODAS');
  const [selectedCategoria, setSelectedCategoria] = useState('TODAS');
  const [selectedStatus, setSelectedStatus] = useState('TODOS');
  const [selectedPrioridade, setSelectedPrioridade] = useState('TODAS');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  // Filter logic
  const filteredChamados = chamados.filter(ticket => {
    const matchesSearch = 
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.solicitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.localizacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.obraNome.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesObra = selectedObra === 'TODAS' || ticket.obraId === selectedObra;
    const matchesCat = selectedCategoria === 'TODAS' || ticket.categoriaId === selectedCategoria;
    const matchesStatus = selectedStatus === 'TODOS' || ticket.status === selectedStatus;
    const matchesPrio = selectedPrioridade === 'TODAS' || ticket.prioridade === selectedPrioridade;

    return matchesSearch && matchesObra && matchesCat && matchesStatus && matchesPrio;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Aberto':
        return <span className="px-2.5 py-1 rounded-[4px] text-[11px] font-extrabold bg-[#8E7CF8]/15 text-[#8E7CF8] border border-[#8E7CF8]/30">Aberto</span>;
      case 'Em Atendimento':
        return <span className="px-2.5 py-1 rounded-[4px] text-[11px] font-extrabold bg-[#E2B552]/15 text-[#E2B552] border border-[#E2B552]/30">Em Atendimento</span>;
      case 'Aguardando Peça':
        return <span className="px-2.5 py-1 rounded-[4px] text-[11px] font-extrabold bg-[#E16666]/15 text-[#E16666] border border-[#E16666]/30">Aguardando Peça</span>;
      case 'Concluído':
        return <span className="px-2.5 py-1 rounded-[4px] text-[11px] font-extrabold bg-[#43C486]/15 text-[#43C486] border border-[#43C486]/30">Concluído</span>;
      default:
        return <span className="px-2.5 py-1 rounded-[4px] text-[11px] font-extrabold bg-[#7893A2]/15 text-[#7893A2]">{status}</span>;
    }
  };

  const getPriorityBadge = (prioridade) => {
    if (prioridade === 'Crítica') {
      return <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-extrabold bg-[#E16666] text-[#0B1D2D] animate-pulse">CRÍTICA</span>;
    }
    if (prioridade === 'Alta') {
      return <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#E16666]/20 text-[#E16666]">ALTA</span>;
    }
    if (prioridade === 'Média') {
      return <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#E2B552]/20 text-[#E2B552]">MÉDIA</span>;
    }
    return <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-semibold bg-[#7893A2]/20 text-[#9EB5C1]">BAIXA</span>;
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedObra('TODAS');
    setSelectedCategoria('TODAS');
    setSelectedStatus('TODOS');
    setSelectedPrioridade('TODAS');
  };

  return (
    <div className="space-y-5 animate-page-enter">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#102A40] border border-[#234963] rounded-[10px] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LifeBuoy className="w-4 h-4 text-[#66C1BF]" />
            <h2 className="text-xl font-extrabold text-[#F1F7F8]">Central de Chamados Técnicos</h2>
          </div>
          <p className="text-xs text-[#9EB5C1]">
            Gerencie, filtre e acompanhe a resolução dos chamados de todas as obras ativas da Maximo Aldana.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="bg-[#14334C] p-1 rounded-[6px] border border-[#234963] flex items-center gap-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded text-xs transition-colors ${viewMode === 'list' ? 'bg-[#66C1BF] text-[#08252B]' : 'text-[#9EB5C1] hover:text-[#F1F7F8]'}`}
              title="Visualização em Lista"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded text-xs transition-colors ${viewMode === 'grid' ? 'bg-[#66C1BF] text-[#08252B]' : 'text-[#9EB5C1] hover:text-[#F1F7F8]'}`}
              title="Visualização em Cards"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsNewTicketOpen(true)}
            className="px-3.5 py-2 rounded-[6px] bg-[#66C1BF] hover:bg-[#4FA9A7] text-[#08252B] text-xs font-extrabold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(102,193,191,0.25)] transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Chamado</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#102A40] border border-[#234963] rounded-[10px] p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-[#7893A2] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por protocolo (#MA-...), palavra-chave, local ou solicitante..."
              className="w-full pl-9 pr-3 py-2 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs text-[#F1F7F8] placeholder-[#7893A2] focus:outline-none transition-colors"
            />
          </div>

          {/* Obra Filter */}
          <div>
            <select
              value={selectedObra}
              onChange={(e) => setSelectedObra(e.target.value)}
              className="w-full px-3 py-2 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs text-[#F1F7F8] focus:outline-none"
            >
              <option value="TODAS">Todas as Obras ({obras.length})</option>
              {obras.map(o => (
                <option key={o.id} value={o.id}>{o.nome}</option>
              ))}
            </select>
          </div>

          {/* Categoria Filter */}
          <div>
            <select
              value={selectedCategoria}
              onChange={(e) => setSelectedCategoria(e.target.value)}
              className="w-full px-3 py-2 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs text-[#F1F7F8] focus:outline-none"
            >
              <option value="TODAS">Todas as Categorias</option>
              {categorias.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs text-[#F1F7F8] focus:outline-none"
            >
              <option value="TODOS">Todos os Status</option>
              <option value="Aberto">Aberto</option>
              <option value="Em Atendimento">Em Atendimento</option>
              <option value="Aguardando Peça">Aguardando Peça</option>
              <option value="Concluído">Concluído</option>
            </select>
          </div>
        </div>

        {/* Secondary Filter options & Count */}
        <div className="flex items-center justify-between pt-2 border-t border-[#234963]/50 text-xs text-[#9EB5C1]">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[#F1F7F8]">
              Exibindo <strong className="text-[#66C1BF]">{filteredChamados.length}</strong> de {chamados.length} chamados
            </span>
            
            {(searchTerm || selectedObra !== 'TODAS' || selectedCategoria !== 'TODAS' || selectedStatus !== 'TODOS') && (
              <button
                onClick={resetFilters}
                className="text-[#E2B552] hover:underline flex items-center gap-1 font-bold text-[11px]"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Limpar Filtros</span>
              </button>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-[#7893A2]">Filtrar por Prioridade:</span>
            {['TODAS', 'Crítica', 'Alta', 'Média', 'Baixa'].map(prio => (
              <button
                key={prio}
                onClick={() => setSelectedPrioridade(prio)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                  selectedPrioridade === prio
                    ? 'bg-[#66C1BF] text-[#08252B]'
                    : 'bg-[#14334C] text-[#9EB5C1] hover:text-[#F1F7F8] border border-[#234963]'
                }`}
              >
                {prio}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tickets Content View */}
      {filteredChamados.length === 0 ? (
        <div className="bg-[#102A40] border border-[#234963] rounded-[10px] p-12 text-center space-y-3">
          <LifeBuoy className="w-10 h-10 text-[#7893A2] mx-auto opacity-50" />
          <h3 className="text-base font-bold text-[#F1F7F8]">Nenhum chamado encontrado</h3>
          <p className="text-xs text-[#9EB5C1] max-w-md mx-auto">
            Não há nenhum chamado correspondente aos filtros selecionados. Tente ajustar a busca ou limpe os filtros.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-[#14334C] hover:bg-[#163A55] text-[#66C1BF] rounded-[6px] border border-[#234963] text-xs font-bold transition-colors inline-block mt-2"
          >
            Limpar Filtros
          </button>
        </div>
      ) : viewMode === 'list' ? (
        /* List View */
        <div className="bg-[#102A40] border border-[#234963] rounded-[10px] overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.22)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#081724] border-b border-[#234963] text-[#7893A2] font-extrabold uppercase tracking-wider text-[10.5px]">
                  <th className="py-3 px-4">Protocolo</th>
                  <th className="py-3 px-4">Título do Chamado</th>
                  <th className="py-3 px-4">Obra & Local</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Prioridade</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Técnico</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#234963]">
                {filteredChamados.map(ticket => (
                  <tr
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className="hover:bg-[#14334C] cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#66C1BF] whitespace-nowrap">
                      {ticket.id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#F1F7F8] group-hover:text-[#66C1BF] transition-colors max-w-xs truncate">
                      {ticket.titulo}
                      <p className="text-[10.5px] font-normal text-[#7893A2] truncate">
                        Aberto por {ticket.solicitante} em {ticket.dataCriacao}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-[#9EB5C1] whitespace-nowrap">
                      <strong className="text-[#F1F7F8] block font-semibold">{ticket.obraNome}</strong>
                      <span className="text-[11px] text-[#7893A2]">{ticket.localizacao}</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#9EB5C1] whitespace-nowrap">
                      {ticket.categoriaNome}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getPriorityBadge(ticket.prioridade)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="py-3.5 px-4 text-[#9EB5C1] whitespace-nowrap">
                      {ticket.tecnicoAtribuido}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTicket(ticket);
                        }}
                        className="p-1.5 rounded-[4px] bg-[#14334C] hover:bg-[#66C1BF] text-[#66C1BF] hover:text-[#08252B] transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChamados.map(ticket => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className="bg-[#102A40] border border-[#234963] hover:border-[#66C1BF]/60 rounded-[10px] p-4 shadow-sm hover:shadow-[0_12px_30px_rgba(0,0,0,0.22)] cursor-pointer transition-all hover:-translate-y-0.5 space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#66C1BF] bg-[#081724] px-2 py-0.5 rounded border border-[#234963]">
                  {ticket.id}
                </span>
                <div className="flex items-center gap-1.5">
                  {getPriorityBadge(ticket.prioridade)}
                  {getStatusBadge(ticket.status)}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-[#F1F7F8] group-hover:text-[#66C1BF] transition-colors line-clamp-2">
                  {ticket.titulo}
                </h4>
                <p className="text-xs text-[#9EB5C1] mt-1 line-clamp-2">
                  {ticket.descricao}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#234963]/50 text-xs text-[#9EB5C1]">
                <p className="flex items-center gap-1.5 truncate">
                  <Building className="w-3.5 h-3.5 text-[#66C1BF] shrink-0" />
                  <strong className="text-[#F1F7F8] truncate">{ticket.obraNome}</strong>
                </p>
                <p className="text-[11px] text-[#7893A2] truncate pl-5">
                  📍 {ticket.localizacao}
                </p>
                <p className="flex items-center gap-1.5 text-[11px] text-[#7893A2]">
                  <User className="w-3.5 h-3.5 shrink-0" />
                  <span>Solicitante: <strong className="text-[#F1F7F8]">{ticket.solicitante}</strong></span>
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 text-[11px] border-t border-[#234963]/30">
                <span className="text-[#7893A2]">Técnico: <strong className="text-[#66C1BF]">{ticket.tecnicoAtribuido}</strong></span>
                <span className="text-[#66C1BF] font-bold group-hover:underline flex items-center gap-0.5">
                  Detalhes
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
