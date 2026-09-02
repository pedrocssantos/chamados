import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_CHAMADOS, MOCK_OBRAS, MOCK_CATEGORIAS, MOCK_TECNICOS } from '../data/mockData';

const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  // Theme state: dark (default) or light
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // Active view tab
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, chamados, scanner, etiquetas, obras, categorias, relatorios

  // Data lists
  const [chamados, setChamados] = useState(() => {
    const saved = localStorage.getItem('maximo_chamados');
    return saved ? JSON.parse(saved) : MOCK_CHAMADOS;
  });

  const [obras] = useState(MOCK_OBRAS);
  const [categorias] = useState(MOCK_CATEGORIAS);
  const [tecnicos] = useState(MOCK_TECNICOS);

  // Modals & Active selected items
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [prefilledQr, setPrefilledQr] = useState('');
  const [user, setUser] = useState({
    nome: 'Carlos Eduardo',
    cargo: 'Engenheiro Residente',
    obraPadrao: 'Residencial Aldana Tower',
    avatar: 'CE'
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('maximo_chamados', JSON.stringify(chamados));
  }, [chamados]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Add new ticket
  const createTicket = (ticketData) => {
    const nextSeq = chamados.length + 843;
    const newId = `MA-2026-${String(nextSeq).padStart(4, '0')}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    // Calculate SLA deadline based on category
    const catObj = categorias.find(c => c.id === ticketData.categoriaId) || categorias[0];
    const slaHours = catObj.slaHoras || 24;
    const slaDate = new Date(Date.now() + slaHours * 3600 * 1000);
    const slaStr = slaDate.toISOString().replace('T', ' ').substring(0, 16);

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
      qrCodeItem: ticketData.qrCodeItem || `MA-LOCAL-${Date.now().toString().slice(-6)}`,
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
    setPrefilledQr('');
    return newTicket;
  };

  // Update existing ticket status or technician or add comment
  const updateTicketStatus = (ticketId, newStatus, tecnico, comentario) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
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

  const openNewTicketWithQr = (qrCodeStr) => {
    setPrefilledQr(qrCodeStr);
    setIsNewTicketOpen(true);
  };

  return (
    <TicketContext.Provider
      value={{
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        chamados,
        obras,
        categorias,
        tecnicos,
        selectedTicket,
        setSelectedTicket,
        isNewTicketOpen,
        setIsNewTicketOpen,
        prefilledQr,
        setPrefilledQr,
        createTicket,
        updateTicketStatus,
        openNewTicketWithQr,
        user,
        setUser
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => useContext(TicketContext);
