import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_CHAMADOS, MOCK_OBRAS, MOCK_CATEGORIAS, MOCK_TECNICOS, MOCK_TERMOS_NOTEBOOKS } from '../data/mockData';

const TicketContext = createContext();

const brazilNow = () => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const brTime = new Date(utc - (3600000 * 3));
  const dd = String(brTime.getDate()).padStart(2, '0');
  const mm = String(brTime.getMonth() + 1).padStart(2, '0');
  const yyyy = brTime.getFullYear();
  const hh = String(brTime.getHours()).padStart(2, '0');
  const min = String(brTime.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
};

const brazilDateFromNow = (hoursAdded) => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const brTime = new Date(utc - (3600000 * 3) + (hoursAdded * 3600000));
  const dd = String(brTime.getDate()).padStart(2, '0');
  const mm = String(brTime.getMonth() + 1).padStart(2, '0');
  const yyyy = brTime.getFullYear();
  const hh = String(brTime.getHours()).padStart(2, '0');
  const min = String(brTime.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
};

export const TicketProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const [activeTab, setActiveTab] = useState('dashboard');

  const [chamados, setChamados] = useState(() => {
    try {
      const saved = localStorage.getItem('maximo_chamados_ti');
      return saved ? JSON.parse(saved) : MOCK_CHAMADOS;
    } catch (e) {
      console.error('Failed to parse chamados', e);
      return MOCK_CHAMADOS;
    }
  });

  const [termos, setTermos] = useState(() => {
    try {
      const saved = localStorage.getItem('maximo_termos_notebooks');
      return saved ? JSON.parse(saved) : MOCK_TERMOS_NOTEBOOKS;
    } catch (e) {
      console.error('Failed to parse termos', e);
      return MOCK_TERMOS_NOTEBOOKS;
    }
  });

  const [obras] = useState(MOCK_OBRAS);
  const [categorias] = useState(MOCK_CATEGORIAS);
  const [tecnicos] = useState(MOCK_TECNICOS);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [scannedQrCode, setScannedQrCode] = useState(null);
  const [user, setUser] = useState({
    nome: 'Pedro Henrique Santos',
    cargo: 'Tecnologia da Informação (TI)',
    email: 'pedro.santos@maximoaldana.com.br',
    avatar: 'PS'
  });

  const [ticketFilters, setTicketFiltersState] = useState({ status: null, prioridade: null, obraId: null, categoriaId: null });

  const setTicketFilters = (filters) => {
    setTicketFiltersState(prev => ({ ...prev, ...filters }));
    setActiveTab('chamados');
  };

  useEffect(() => {
    localStorage.setItem('maximo_chamados_ti', JSON.stringify(chamados));
  }, [chamados]);

  useEffect(() => {
    localStorage.setItem('maximo_termos_notebooks', JSON.stringify(termos));
  }, [termos]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const addTermo = (termo) => {
    setTermos([termo, ...termos]);
  };

  const updateTermo = (id, updates) => {
    setTermos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const createTicket = (ticketData) => {
    const maxSeq = chamados.reduce((max, t) => {
      const parts = t.id.split('-');
      const seq = parseInt(parts[parts.length - 1], 10);
      return !isNaN(seq) && seq > max ? seq : max;
    }, 0);
    const nextSeq = maxSeq > 0 ? maxSeq + 1 : 1;
    const newId = `MA-TI-2026-${String(nextSeq).padStart(4, '0')}`;
    const nowStr = brazilNow();
    
    const catObj = categorias.find(c => c.id === ticketData.categoriaId) || categorias[0];
    const slaHours = catObj.slaHoras || 24;
    const slaStr = brazilDateFromNow(slaHours);

    const obraObj = obras.find(o => o.id === ticketData.obraId) || obras[0];

    const newTicket = {
      id: newId,
      titulo: ticketData.titulo,
      descricao: ticketData.descricao,
      obraId: ticketData.obraId,
      obraNome: obraObj.nome,
      localizacao: ticketData.localizacao,
      categoriaId: ticketData.categoriaId,
      categoriaNome: catObj.nome,
      prioridade: ticketData.prioridade || 'Média',
      status: 'Aberto',
      solicitante: ticketData.solicitante || `${user.nome} (${user.cargo})`,
      tecnicoAtribuido: 'Pendente de Atribuição',
      dataCriacao: nowStr,
      prazoSla: slaStr,
      historico: [
        {
          data: nowStr,
          autor: ticketData.solicitante || user.nome,
          texto: `Chamado registrado com sucesso. Prioridade: ${ticketData.prioridade || 'Média'}.`
        }
      ]
    };

    setChamados([newTicket, ...chamados]);
    setIsNewTicketOpen(false);
    setScannedQrCode(null);
    return newTicket;
  };

  const openNewTicketWithQr = (qrCode) => {
    setScannedQrCode(qrCode);
    setIsNewTicketOpen(true);
  };

  const deleteTicket = (ticketId) => {
    setChamados(prev => prev.filter(t => t.id !== ticketId));
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(null);
    }
  };

  const editTicket = (ticketId, updates) => {
    const nowStr = brazilNow();
    
    setChamados(prev => prev.map(t => {
      if (t.id === ticketId) {
        const newHist = [...t.historico, {
          data: nowStr,
          autor: user.nome,
          texto: 'Chamado editado (título/descrição/localização/prioridade).'
        }];
        
        let obraNome = t.obraNome;
        if (updates.obraId && updates.obraId !== t.obraId) {
          const obraObj = obras.find(o => o.id === updates.obraId);
          if (obraObj) obraNome = obraObj.nome;
        }

        const updated = {
          ...t,
          titulo: updates.titulo || t.titulo,
          descricao: updates.descricao || t.descricao,
          localizacao: updates.localizacao || t.localizacao,
          prioridade: updates.prioridade || t.prioridade,
          obraId: updates.obraId || t.obraId,
          obraNome: obraNome,
          historico: newHist
        };

        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket(updated);
        }

        return updated;
      }
      return t;
    }));
  };

  const updateTicketStatus = (ticketId, newStatus, tecnico, comentario) => {
    const nowStr = brazilNow();
    
    setChamados(prev => prev.map(t => {
      if (t.id === ticketId) {
        const newHist = [...t.historico];
        if (comentario) {
          newHist.push({
            data: nowStr,
            autor: user.nome,
            texto: comentario
          });
        }
        if (newStatus && newStatus !== t.status) {
          newHist.push({
            data: nowStr,
            autor: user.nome,
            texto: `Status alterado de "${t.status}" para "${newStatus}".`
          });
        }

        const updated = {
          ...t,
          status: newStatus || t.status,
          tecnicoAtribuido: tecnico || t.tecnicoAtribuido,
          historico: newHist
        };

        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket(updated);
        }

        return updated;
      }
      return t;
    }));
  };

  return (
    <TicketContext.Provider
      value={{
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        chamados,
        termos,
        obras,
        categorias,
        tecnicos,
        selectedTicket,
        setSelectedTicket,
        isNewTicketOpen,
        setIsNewTicketOpen,
        scannedQrCode,
        openNewTicketWithQr,
        createTicket,
        updateTicketStatus,
        deleteTicket,
        editTicket,
        user,
        setUser,
        ticketFilters,
        setTicketFilters,
        addTermo,
        updateTermo
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => useContext(TicketContext);
