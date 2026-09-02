import React, { useState, useMemo } from 'react';
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
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Download,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';

const parseBrazilDate = (str) => {
  if (!str) return null;
  const parts = str.split(/[\s/:]/);
  if (parts.length >= 5) {
    const [dd, mm, yyyy, hh, min] = parts;
    return new Date(yyyy, mm - 1, dd, hh, min);
  }
  return null;
};

export default function TicketsView() {
  const { 
    chamados, 
    obras, 
    categorias, 
    tecnicos,
    setSelectedTicket, 
    setIsNewTicketOpen, 
    ticketFilters,
    setTicketFilters,
    deleteTicket,
    updateTicketStatus,
    user
  } = useTickets();

  // Local Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedObra, setSelectedObra] = useState('TODAS');
  const [selectedCategoria, setSelectedCategoria] = useState('TODAS');
  const [selectedStatus, setSelectedStatus] = useState('TODOS');
  const [selectedPrioridade, setSelectedPrioridade] = useState('TODAS');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  // Sort state
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Bulk actions state
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [bulkTechnician, setBulkTechnician] = useState('');

  // Clear context filters
  const clearContextFilters = () => {
    if (setTicketFilters) {
      setTicketFilters({});
    }
  };

  // Filter Integration
  const filteredChamados = useMemo(() => {
    return chamados.filter(ticket => {
      // Apply Context Filters
      if (ticketFilters?.status && ticket.status !== ticketFilters.status) return false;
      if (ticketFilters?.prioridade && ticket.prioridade !== ticketFilters.prioridade) return false;
      if (ticketFilters?.obraId && ticket.obraId !== ticketFilters.obraId) return false;
      if (ticketFilters?.categoriaId && ticket.categoriaId !== ticketFilters.categoriaId) return false;

      // Apply Local Filters
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
  }, [chamados, ticketFilters, searchTerm, selectedObra, selectedCategoria, selectedStatus, selectedPrioridade]);

  // Column Sorting
  const sortedChamados = useMemo(() => {
    let sortableTickets = [...filteredChamados];
    if (sortConfig.key !== null) {
      sortableTickets.sort((a, b) => {
        if (sortConfig.key === 'dataCriacao' || sortConfig.key === 'prazoSla') {
          const dateA = parseBrazilDate(a[sortConfig.key]);
          const dateB = parseBrazilDate(b[sortConfig.key]);
          if (!dateA && !dateB) return 0;
          if (!dateA) return sortConfig.direction === 'asc' ? 1 : -1;
          if (!dateB) return sortConfig.direction === 'asc' ? -1 : 1;
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        } else if (sortConfig.key === 'prioridade') {
          const priorities = { 'Baixa': 1, 'Média': 2, 'Alta': 3, 'Crítica': 4 };
          const pA = priorities[a.prioridade] || 0;
          const pB = priorities[b.prioridade] || 0;
          return sortConfig.direction === 'asc' ? pA - pB : pB - pA;
        } else {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
        }
      });
    }
    return sortableTickets;
  }, [filteredChamados, sortConfig]);

  // Pagination
  const paginatedChamados = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedChamados.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedChamados, currentPage]);

  const totalPages = Math.ceil(sortedChamados.length / itemsPerPage);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return null;
    }
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 inline ml-1" /> : <ChevronDown className="w-3 h-3 inline ml-1" />;
  };

  // SLA Breach Indicator
  const getSLAIndicator = (ticket) => {
    if (ticket.status === 'Concluído' || !ticket.prazoSla) return null;
    const prazo = parseBrazilDate(ticket.prazoSla);
    if (!prazo) return null;
    const now = new Date();
    
    if (now > prazo) {
      return <span className="ml-2 px-2 py-0.5 rounded-[4px] text-[10px] font-extrabold bg-[#E16666] text-[#0B1D2D]">SLA VENCIDO</span>;
    }
    
    const diffHours = (prazo - now) / (1000 * 60 * 60);
    if (diffHours <= 2) {
      return <span className="ml-2 px-2 py-0.5 rounded-[4px] text-[10px] font-extrabold bg-[#E2B552] text-[#0B1D2D]">SLA URGENTE</span>;
    }
    
    return null;
  };

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
      return <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-extrabold bg-[#E16666] text-[#0B1D2D]">CRÍTICA</span>;
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
    clearContextFilters();
    setCurrentPage(1);
  };

  // CSV Export
  const exportCSV = () => {
    const headers = ['ID', 'Título', 'Obra', 'Categoria', 'Prioridade', 'Status', 'Solicitante', 'Data Criação', 'Prazo SLA', 'Técnico'];
    const rows = sortedChamados.map(ticket => [
      ticket.id,
      `"${ticket.titulo.replace(/"/g, '""')}"`,
      `"${ticket.obraNome}"`,
      `"${ticket.categoriaNome}"`,
      ticket.prioridade,
      ticket.status,
      `"${ticket.solicitante}"`,
      ticket.dataCriacao,
      ticket.prazoSla || '',
      `"${ticket.tecnicoAtribuido || ''}"`
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'chamados.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Checkbox toggle
  const toggleSelectTicket = (id) => {
    setSelectedTickets(prev => 
      prev.includes(id) ? prev.filter(ticketId => ticketId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedTickets.length === paginatedChamados.length && paginatedChamados.length > 0) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(paginatedChamados.map(t => t.id));
    }
  };

  const handleBulkClose = () => {
    selectedTickets.forEach(id => {
      updateTicketStatus && updateTicketStatus(id, 'Concluído');
    });
    setSelectedTickets([]);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir este chamado?')) {
      deleteTicket && deleteTicket(id);
    }
  };

  return (
    <div className="space-y-5 animate-page-enter relative pb-16">
      {/* Filter Integration Banner */}
      {Object.keys(ticketFilters || {}).length > 0 && (
        <div className="bg-[#66C1BF]/10 border border-[#66C1BF]/30 rounded-[8px] p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#66C1BF] text-sm font-bold">
            <Filter className="w-4 h-4" />
            <span>Filtro aplicado do Dashboard</span>
          </div>
          <button onClick={clearContextFilters} className="text-[#9EB5C1] hover:text-[#F1F7F8] flex items-center gap-1 text-xs">
            <X className="w-4 h-4" /> Limpar
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#102A40] border border-[#234963] rounded-[10px] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LifeBuoy className="w-4 h-4 text-[#66C1BF]" />
            <h2 className="text-xl font-extrabold text-[#F1F7F8]">
              {user?.role === 'cliente' ? 'Meus Chamados Criados' : 'Central de Chamados Técnicos'}
            </h2>
          </div>
          <p className="text-xs text-[#9EB5C1]">
            {user?.role === 'cliente' 
              ? `Acompanhe o status das solicitações de TI abertas por você (${user.nome}).`
              : 'Gerencie, filtre e acompanhe a resolução dos chamados de todas as obras ativas da Maximo Aldana.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export CSV Button */}
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-[6px] bg-[#14334C] hover:bg-[#163A55] text-[#9EB5C1] hover:text-[#F1F7F8] border border-[#234963] text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Exportar CSV"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>

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
              <option value="TODAS">Todas as Obras ({obras?.length || 0})</option>
              {obras?.map(o => (
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
              {categorias?.map(c => (
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
            
            {(searchTerm || selectedObra !== 'TODAS' || selectedCategoria !== 'TODAS' || selectedStatus !== 'TODOS' || Object.keys(ticketFilters || {}).length > 0) && (
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
      {paginatedChamados.length === 0 ? (
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
                  <th className="py-3 px-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-[#234963] bg-[#14334C] text-[#66C1BF] focus:ring-[#66C1BF]"
                      checked={selectedTickets.length === paginatedChamados.length && paginatedChamados.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="py-3 px-4">Protocolo</th>
                  <th className="py-3 px-4 cursor-pointer hover:text-[#F1F7F8]" onClick={() => requestSort('dataCriacao')}>
                    Título e Criação {getSortIcon('dataCriacao')}
                  </th>
                  <th className="py-3 px-4">Obra & Local</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4 cursor-pointer hover:text-[#F1F7F8]" onClick={() => requestSort('prioridade')}>
                    Prioridade {getSortIcon('prioridade')}
                  </th>
                  <th className="py-3 px-4 cursor-pointer hover:text-[#F1F7F8]" onClick={() => requestSort('status')}>
                    Status {getSortIcon('status')}
                  </th>
                  <th className="py-3 px-4 cursor-pointer hover:text-[#F1F7F8]" onClick={() => requestSort('prazoSla')}>
                    Prazo SLA {getSortIcon('prazoSla')}
                  </th>
                  <th className="py-3 px-4">Técnico</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#234963]">
                {paginatedChamados.map(ticket => (
                  <tr
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className="hover:bg-[#14334C] cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        className="rounded border-[#234963] bg-[#14334C] text-[#66C1BF] focus:ring-[#66C1BF]"
                        checked={selectedTickets.includes(ticket.id)}
                        onChange={() => toggleSelectTicket(ticket.id)}
                      />
                    </td>
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
                      <div className="flex items-center">
                        {getStatusBadge(ticket.status)}
                        {getSLAIndicator(ticket)}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#9EB5C1] whitespace-nowrap">
                      {ticket.prazoSla || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-[#9EB5C1] whitespace-nowrap">
                      {ticket.tecnicoAtribuido || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => handleDelete(e, ticket.id)}
                          className="p-1.5 rounded-[4px] text-[#E16666] hover:bg-[#E16666]/10 transition-colors"
                          title="Excluir Chamado"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTicket(ticket);
                          }}
                          className="p-1.5 rounded-[4px] bg-[#14334C] hover:bg-[#66C1BF] text-[#66C1BF] hover:text-[#08252B] transition-colors"
                          title="Ver Detalhes"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
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
          {paginatedChamados.map(ticket => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className="bg-[#102A40] border border-[#234963] hover:border-[#66C1BF]/60 rounded-[10px] p-4 shadow-sm hover:shadow-[0_12px_30px_rgba(0,0,0,0.22)] cursor-pointer transition-all hover:-translate-y-0.5 space-y-3 group relative"
            >
              <div className="absolute top-4 left-4" onClick={(e) => e.stopPropagation()}>
                 <input 
                  type="checkbox" 
                  className="rounded border-[#234963] bg-[#14334C] text-[#66C1BF] focus:ring-[#66C1BF]"
                  checked={selectedTickets.includes(ticket.id)}
                  onChange={() => toggleSelectTicket(ticket.id)}
                />
              </div>
              <div className="flex items-center justify-between pl-6">
                <span className="font-mono text-xs font-bold text-[#66C1BF] bg-[#081724] px-2 py-0.5 rounded border border-[#234963]">
                  {ticket.id}
                </span>
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  {getPriorityBadge(ticket.prioridade)}
                  {getStatusBadge(ticket.status)}
                </div>
              </div>
              {getSLAIndicator(ticket) && (
                <div className="flex justify-end">{getSLAIndicator(ticket)}</div>
              )}

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
                <span className="text-[#7893A2]">Técnico: <strong className="text-[#66C1BF]">{ticket.tecnicoAtribuido || '-'}</strong></span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDelete(e, ticket.id)}
                    className="p-1 rounded-[4px] text-[#E16666] hover:bg-[#E16666]/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[#66C1BF] font-bold group-hover:underline flex items-center gap-0.5">
                    Detalhes
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-[#234963] mt-6">
          <span className="text-xs text-[#9EB5C1]">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, sortedChamados.length)} de {sortedChamados.length} resultados
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 rounded-[4px] border border-[#234963] bg-[#14334C] text-[#9EB5C1] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#163A55] hover:text-[#F1F7F8] text-xs font-bold transition-colors"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 rounded-[4px] border border-[#234963] text-xs font-bold transition-colors ${
                  currentPage === page ? 'bg-[#66C1BF] text-[#08252B]' : 'bg-[#14334C] text-[#9EB5C1] hover:bg-[#163A55] hover:text-[#F1F7F8]'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1.5 rounded-[4px] border border-[#234963] bg-[#14334C] text-[#9EB5C1] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#163A55] hover:text-[#F1F7F8] text-xs font-bold transition-colors"
            >
              Próxima
            </button>
          </div>
        </div>
      )}

      {/* Bulk Actions Floating Bar */}
      {selectedTickets.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#102A40] border border-[#66C1BF] rounded-[10px] p-3 shadow-[0_12px_30px_rgba(0,0,0,0.5)] flex items-center gap-4 z-50">
          <div className="flex items-center gap-2 text-[#66C1BF] font-bold text-sm bg-[#081724] px-3 py-1.5 rounded-[6px]">
            <CheckCircle2 className="w-4 h-4" />
            <span>{selectedTickets.length} {selectedTickets.length === 1 ? 'chamado selecionado' : 'chamados selecionados'}</span>
          </div>
          
          <div className="h-6 w-px bg-[#234963]" />
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkClose}
              className="px-3 py-1.5 rounded-[6px] bg-[#43C486]/10 text-[#43C486] hover:bg-[#43C486]/20 border border-[#43C486]/30 text-xs font-bold transition-colors"
            >
              Fechar Selecionados
            </button>
            
            <select
              value={bulkTechnician}
              onChange={(e) => {
                setBulkTechnician(e.target.value);
                if(e.target.value) {
                  alert('Técnico atribuído aos chamados selecionados (Simulação)');
                  setBulkTechnician('');
                  setSelectedTickets([]);
                }
              }}
              className="px-3 py-1.5 rounded-[6px] bg-[#14334C] border border-[#234963] focus:border-[#66C1BF] text-xs text-[#F1F7F8] focus:outline-none"
            >
              <option value="">Atribuir Técnico...</option>
              {tecnicos?.map(t => (
                <option key={t.id} value={t.nome}>{t.nome}</option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={() => setSelectedTickets([])}
            className="p-1.5 text-[#9EB5C1] hover:text-[#F1F7F8] ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
