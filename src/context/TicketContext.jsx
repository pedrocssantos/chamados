import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_CHAMADOS, MOCK_OBRAS, MOCK_CATEGORIAS, MOCK_TECNICOS } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sendEmailNotification } from '../services/emailService';

const TicketContext = createContext();

export const brazilNow = () => {
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

export const brazilDateFromNow = (hoursAdded) => {
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

// Initial Seed Users (Suporte TI and Cliente de Obra)
const DEFAULT_USERS = [
  {
    id: 'usr-1',
    nome: 'Pedro Henrique Santos',
    email: 'pedro.santos@maximoaldana.com.br',
    password: 'bXwxAUL5@pedro24',
    cargo: 'Tecnologia da Informação (TI)',
    telefone: '(11) 98765-4321',
    obraId: 'loc-3',
    obraNome: 'Sede Corporativa Maximo Aldana',
    role: 'suporte', // 'suporte' (admin) | 'cliente' (solicitante obra)
    avatar: 'PS'
  },
  {
    id: 'usr-2',
    nome: 'Eng. Roberto Farias',
    email: 'roberto.farias@maximoaldana.com.br',
    password: 'senha123',
    cargo: 'Engenheiro Residente',
    telefone: '(11) 97654-3210',
    obraId: 'loc-1',
    obraNome: 'Obra Residencial Grand Aldana',
    role: 'cliente',
    avatar: 'RF'
  }
];

const mapDbChamadoToFront = (row) => ({
  id: row.id,
  titulo: row.titulo,
  descricao: row.descricao,
  obraId: row.obra_id,
  obraNome: row.obra_nome,
  localizacao: row.localizacao,
  categoriaId: row.categoria_id,
  categoriaNome: row.categoria_nome,
  prioridade: row.prioridade,
  status: row.status,
  solicitante: row.solicitante,
  tecnicoAtribuido: row.tecnico_atribuido,
  anexo: row.anexo_base64,
  anexoNome: row.anexo_nome,
  dataCriacao: row.data_criacao,
  prazoSla: row.prazo_sla,
  dataConclusao: row.data_conclusao,
  historico: Array.isArray(row.historico) ? row.historico : (typeof row.historico === 'string' ? JSON.parse(row.historico) : []),
});

const mapFrontChamadoToDb = (item) => ({
  id: item.id,
  titulo: item.titulo,
  descricao: item.descricao,
  obra_id: item.obraId,
  obra_nome: item.obraNome,
  localizacao: item.localizacao,
  categoria_id: item.categoriaId,
  categoria_nome: item.categoriaNome,
  prioridade: item.prioridade,
  status: item.status,
  solicitante: item.solicitante,
  tecnico_atribuido: item.tecnicoAtribuido,
  anexo_base64: item.anexo || null,
  anexo_nome: item.anexoNome || null,
  data_criacao: item.dataCriacao,
  prazo_sla: item.prazoSla,
  data_conclusao: item.dataConclusao || null,
  historico: item.historico || [],
});

export const TicketProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoadingDb, setIsLoadingDb] = useState(false);

  // Authentication State
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('maximo_users_db');
      return saved ? JSON.parse(saved) : DEFAULT_USERS;
    } catch (e) {
      return DEFAULT_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('maximo_auth_user');
      return saved ? JSON.parse(saved) : DEFAULT_USERS[0]; // Default logged in as Pedro
    } catch (e) {
      return DEFAULT_USERS[0];
    }
  });

  const [chamados, setChamados] = useState(() => {
    try {
      const saved = localStorage.getItem('maximo_chamados_ti');
      return saved ? JSON.parse(saved) : MOCK_CHAMADOS;
    } catch (e) {
      return MOCK_CHAMADOS;
    }
  });

  const [obras, setObras] = useState(MOCK_OBRAS);
  const [categorias, setCategorias] = useState(MOCK_CATEGORIAS);
  const [tecnicos, setTecnicos] = useState(MOCK_TECNICOS);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [scannedQrCode, setScannedQrCode] = useState(null);

  const [ticketFilters, setTicketFiltersState] = useState({ status: null, prioridade: null, obraId: null, categoriaId: null });

  const setTicketFilters = (filters) => {
    setTicketFiltersState(prev => ({ ...prev, ...filters }));
    setActiveTab('chamados');
  };

  // Sync users and current auth session
  useEffect(() => {
    localStorage.setItem('maximo_users_db', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('maximo_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('maximo_auth_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('maximo_chamados_ti', JSON.stringify(chamados));
  }, [chamados]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Load from Supabase on mount + setup Realtime
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    let isMounted = true;
    setIsLoadingDb(true);

    const loadSupabaseData = async () => {
      try {
        const [chamadosRes, obrasRes, catsRes, tecsRes] = await Promise.all([
          supabase.from('chamados').select('*').order('created_at', { ascending: false }),
          supabase.from('obras').select('*'),
          supabase.from('categorias').select('*'),
          supabase.from('tecnicos').select('*')
        ]);

        if (isMounted) {
          if (chamadosRes.data && chamadosRes.data.length > 0) {
            setChamados(chamadosRes.data.map(mapDbChamadoToFront));
          }
          if (obrasRes.data && obrasRes.data.length > 0) {
            setObras(obrasRes.data);
          }
          if (catsRes.data && catsRes.data.length > 0) {
            setCategorias(catsRes.data);
          }
          if (tecsRes.data && tecsRes.data.length > 0) {
            setTecnicos(tecsRes.data);
          }
        }
      } catch (err) {
        console.warn('Erro ao carregar dados do Supabase, utilizando cache local:', err);
      } finally {
        if (isMounted) setIsLoadingDb(false);
      }
    };

    loadSupabaseData();

    // Setup Supabase Realtime Subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chamados' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newFront = mapDbChamadoToFront(payload.new);
          setChamados(prev => [newFront, ...prev.filter(t => t.id !== newFront.id)]);
        } else if (payload.eventType === 'UPDATE') {
          const updatedFront = mapDbChamadoToFront(payload.new);
          setChamados(prev => prev.map(t => t.id === updatedFront.id ? updatedFront : t));
          setSelectedTicket(prev => prev && prev.id === updatedFront.id ? updatedFront : prev);
        } else if (payload.eventType === 'DELETE') {
          setChamados(prev => prev.filter(t => t.id !== payload.old.id));
          setSelectedTicket(prev => prev && prev.id === payload.old.id ? null : prev);
        }
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // AUTH METHODS
  const login = (email, password) => {
    const foundUser = users.find(u => 
      u.email.toLowerCase().trim() === email.toLowerCase().trim() && 
      u.password === password
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      setActiveTab('dashboard');
      return { success: true, user: foundUser };
    }

    return { 
      success: false, 
      message: 'E-mail corporativo ou senha incorretos. Verifique suas credenciais.' 
    };
  };

  const registerUser = (userData) => {
    const existing = users.find(u => u.email.toLowerCase().trim() === userData.email.toLowerCase().trim());
    if (existing) {
      return { success: false, message: 'Já existe um cadastro com este e-mail corporativo.' };
    }

    const initials = userData.nome
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(n => n[0].toUpperCase())
      .join('');

    const newUser = {
      id: `usr-${Date.now()}`,
      nome: userData.nome,
      email: userData.email,
      telefone: userData.telefone || '',
      cargo: userData.cargo || 'Colaborador',
      obraId: userData.obraId || 'loc-1',
      obraNome: userData.obraNome || 'Obra Residencial Grand Aldana',
      role: userData.role || 'cliente',
      password: userData.password,
      avatar: initials || 'MA'
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setActiveTab('dashboard');
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
    setSelectedTicket(null);
  };

  const createTicket = async (ticketData) => {
    const maxSeq = chamados.reduce((max, t) => {
      const parts = (t.id || '').split('-');
      const seq = parseInt(parts[parts.length - 1], 10);
      return !isNaN(seq) && seq > max ? seq : max;
    }, 0);
    const nextSeq = maxSeq > 0 ? maxSeq + 1 : 1;
    const newId = `MA-TI-2026-${String(nextSeq).padStart(4, '0')}`;
    const nowStr = brazilNow();
    
    const catObj = categorias.find(c => c.id === ticketData.categoriaId) || categorias[0];
    const slaHours = catObj?.slaHoras || catObj?.sla_horas || 24;
    const slaStr = brazilDateFromNow(slaHours);

    const obraObj = obras.find(o => o.id === ticketData.obraId) || obras[0];

    const requesterName = ticketData.solicitante || `${currentUser?.nome || 'Colaborador'} (${currentUser?.cargo || 'Obra'})`;

    const newTicket = {
      id: newId,
      titulo: ticketData.titulo,
      descricao: ticketData.descricao,
      obraId: ticketData.obraId || currentUser?.obraId || obras[0]?.id,
      obraNome: obraObj?.nome || currentUser?.obraNome || 'Não especificado',
      localizacao: ticketData.localizacao,
      categoriaId: ticketData.categoriaId,
      categoriaNome: catObj?.nome || 'TI Geral',
      prioridade: ticketData.prioridade || 'Média',
      status: 'Aberto',
      solicitante: requesterName,
      tecnicoAtribuido: 'Pendente de Atribuição',
      anexo: ticketData.anexo || null,
      anexoNome: ticketData.anexoNome || null,
      dataCriacao: nowStr,
      prazoSla: slaStr,
      historico: [
        {
          data: nowStr,
          autor: requesterName,
          texto: `Chamado registrado com sucesso. Prioridade: ${ticketData.prioridade || 'Média'}.`
        }
      ]
    };

    // Update local state immediately (optimistic UI)
    setChamados(prev => [newTicket, ...prev]);
    setIsNewTicketOpen(false);
    setScannedQrCode(null);

    // Persist to Supabase if connected
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('chamados').insert([mapFrontChamadoToDb(newTicket)]);
      } catch (err) {
        console.error('Erro ao salvar chamado no Supabase:', err);
      }
    }

    // Trigger Resend email notification
    sendEmailNotification({
      type: 'novo_chamado',
      ticket: newTicket,
    });

    return newTicket;
  };

  const openNewTicketWithQr = (qrCode) => {
    setScannedQrCode(qrCode);
    setIsNewTicketOpen(true);
  };

  const deleteTicket = async (ticketId) => {
    setChamados(prev => prev.filter(t => t.id !== ticketId));
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(null);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('chamados').delete().eq('id', ticketId);
      } catch (err) {
        console.error('Erro ao deletar chamado no Supabase:', err);
      }
    }
  };

  const editTicket = async (ticketId, updates) => {
    const nowStr = brazilNow();
    let updatedObj = null;

    setChamados(prev => prev.map(t => {
      if (t.id === ticketId) {
        const newHist = [...t.historico, {
          data: nowStr,
          autor: currentUser?.nome || 'Técnico TI',
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

        updatedObj = updated;
        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket(updated);
        }

        return updated;
      }
      return t;
    }));

    if (updatedObj && isSupabaseConfigured && supabase) {
      try {
        await supabase.from('chamados').update(mapFrontChamadoToDb(updatedObj)).eq('id', ticketId);
      } catch (err) {
        console.error('Erro ao editar chamado no Supabase:', err);
      }
    }
  };

  const updateTicketStatus = async (ticketId, newStatus, tecnico, comentario) => {
    const nowStr = brazilNow();
    let updatedTicket = null;
    
    setChamados(prev => prev.map(t => {
      if (t.id === ticketId) {
        const newHist = [...t.historico];
        if (comentario) {
          newHist.push({
            data: nowStr,
            autor: currentUser?.nome || 'Técnico TI',
            texto: comentario
          });
        }
        if (newStatus && newStatus !== t.status) {
          newHist.push({
            data: nowStr,
            autor: currentUser?.nome || 'Técnico TI',
            texto: `Status alterado de "${t.status}" para "${newStatus}".`
          });
        }

        const updated = {
          ...t,
          status: newStatus || t.status,
          tecnicoAtribuido: tecnico || t.tecnicoAtribuido,
          dataConclusao: newStatus === 'Concluído' ? (t.dataConclusao || nowStr) : (newStatus ? null : t.dataConclusao),
          historico: newHist
        };

        updatedTicket = updated;
        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket(updated);
        }

        return updated;
      }
      return t;
    }));

    if (updatedTicket) {
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('chamados').update(mapFrontChamadoToDb(updatedTicket)).eq('id', ticketId);
        } catch (err) {
          console.error('Erro ao atualizar status no Supabase:', err);
        }
      }

      // Send email if ticket was concluded
      if (newStatus === 'Concluído') {
        sendEmailNotification({
          type: 'chamado_concluido',
          ticket: updatedTicket,
          comentario
        });
      }
    }
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
        scannedQrCode,
        openNewTicketWithQr,
        createTicket,
        updateTicketStatus,
        deleteTicket,
        editTicket,
        user: currentUser,
        currentUser,
        login,
        registerUser,
        logout,
        ticketFilters,
        setTicketFilters,
        isOnlineDb: isSupabaseConfigured,
        isLoadingDb,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => useContext(TicketContext);
