import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { MOCK_CHAMADOS, MOCK_OBRAS, MOCK_CATEGORIAS, MOCK_TECNICOS } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sendEmailNotification } from '../services/emailService';
import { brazilNow, brazilDateFromNow } from '../utils/dateUtils';

const TicketContext = createContext();

// Initial Seed Users
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
    role: 'suporte',
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
  solicitanteId: row.solicitante_id,
  solicitanteEmail: row.solicitante_email,
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
  solicitante_id: item.solicitanteId || null,
  solicitante_email: item.solicitanteEmail || null,
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
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.id) {
          return parsed;
        }
      }
      return DEFAULT_USERS[0];
    } catch (e) {
      return DEFAULT_USERS[0];
    }
  });

  const [rawChamados, setRawChamados] = useState(() => {
    try {
      const saved = localStorage.getItem('maximo_chamados_ti');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return MOCK_CHAMADOS;
    } catch (e) {
      return MOCK_CHAMADOS;
    }
  });

  const [obras, setObras] = useState(() => {
    try {
      const saved = localStorage.getItem('maximo_obras_db');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return MOCK_OBRAS;
    } catch (e) {
      return MOCK_OBRAS;
    }
  });

  const [categorias, setCategorias] = useState(() => {
    try {
      const saved = localStorage.getItem('maximo_categorias_db');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return MOCK_CATEGORIAS;
    } catch (e) {
      return MOCK_CATEGORIAS;
    }
  });

  const [tecnicos, setTecnicos] = useState(MOCK_TECNICOS);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [scannedQrCode, setScannedQrCode] = useState(null);

  // Filter State
  const [ticketFilters, setTicketFiltersState] = useState({ status: null, prioridade: null, obraId: null, categoriaId: null });

  // STRICT VISIBILITY FILTERING
  const visibleChamados = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'suporte') {
      return rawChamados || [];
    }

    // Cliente: filtra apenas por ID do solicitante, e-mail do solicitante ou nome do usuário
    const userEmail = (currentUser?.email || '').toLowerCase().trim();
    const userName = (currentUser?.nome || '').toLowerCase().trim();
    const userId = currentUser?.id;

    return (rawChamados || []).filter(t => {
      if (!t) return false;
      if (userId && t.solicitanteId && t.solicitanteId === userId) return true;
      if (userEmail && t.solicitanteEmail && t.solicitanteEmail.toLowerCase().trim() === userEmail) return true;
      if (userName && t.solicitante && t.solicitante.toLowerCase().includes(userName)) return true;
      return false;
    });
  }, [rawChamados, currentUser]);

  // Robust filter setters
  const setTicketFilters = (filters) => {
    if (!filters || Object.keys(filters).length === 0) {
      setTicketFiltersState({ status: null, prioridade: null, obraId: null, categoriaId: null });
    } else {
      const cleanFilters = {
        status: (filters.status && filters.status !== 'TODOS' && filters.status !== 'TODAS') ? filters.status : null,
        prioridade: (filters.prioridade && filters.prioridade !== 'TODAS' && filters.prioridade !== 'TODOS') ? filters.prioridade : null,
        obraId: (filters.obraId && filters.obraId !== 'TODAS' && filters.obraId !== 'TODOS') ? filters.obraId : null,
        categoriaId: (filters.categoriaId && filters.categoriaId !== 'TODAS' && filters.categoriaId !== 'TODOS') ? filters.categoriaId : null,
      };
      setTicketFiltersState(cleanFilters);
    }
    setActiveTab('chamados');
  };

  const clearTicketFilters = () => {
    setTicketFiltersState({ status: null, prioridade: null, obraId: null, categoriaId: null });
  };

  // Sync to local cache
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
    localStorage.setItem('maximo_chamados_ti', JSON.stringify(rawChamados));
  }, [rawChamados]);

  useEffect(() => {
    localStorage.setItem('maximo_obras_db', JSON.stringify(obras));
  }, [obras]);

  useEffect(() => {
    localStorage.setItem('maximo_categorias_db', JSON.stringify(categorias));
  }, [categorias]);

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
            setRawChamados(chamadosRes.data.map(mapDbChamadoToFront));
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
          setRawChamados(prev => [newFront, ...prev.filter(t => t.id !== newFront.id)]);
        } else if (payload.eventType === 'UPDATE') {
          const updatedFront = mapDbChamadoToFront(payload.new);
          setRawChamados(prev => prev.map(t => t.id === updatedFront.id ? updatedFront : t));
          setSelectedTicket(prev => prev && prev.id === updatedFront.id ? updatedFront : prev);
        } else if (payload.eventType === 'DELETE') {
          setRawChamados(prev => prev.filter(t => t.id !== payload.old.id));
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
      clearTicketFilters();
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
    clearTicketFilters();
    setActiveTab('dashboard');
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
    setSelectedTicket(null);
    clearTicketFilters();
  };

  // CRUD FOR CHAMADOS
  const createTicket = async (ticketData) => {
    const maxSeq = rawChamados.reduce((max, t) => {
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

    const requesterName = currentUser ? `${currentUser.nome} (${currentUser.cargo})` : (ticketData.solicitante || 'Colaborador');

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
      solicitanteId: currentUser?.id || null,
      solicitanteEmail: currentUser?.email || null,
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

    setRawChamados(prev => [newTicket, ...prev]);
    setIsNewTicketOpen(false);
    setScannedQrCode(null);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('chamados').insert([mapFrontChamadoToDb(newTicket)]);
      } catch (err) {
        console.error('Erro ao salvar chamado no Supabase:', err);
      }
    }

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
    setRawChamados(prev => prev.filter(t => t.id !== ticketId));
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

    setRawChamados(prev => prev.map(t => {
      if (t.id === ticketId) {
        const newHist = [...t.historico, {
          data: nowStr,
          autor: currentUser?.nome || 'Usuário',
          texto: 'Chamado editado (dados da ocorrência atualizados).'
        }];
        
        let obraNome = t.obraNome;
        if (updates.obraId && updates.obraId !== t.obraId) {
          const obraObj = obras.find(o => o.id === updates.obraId);
          if (obraObj) obraNome = obraObj.nome;
        }

        let catNome = t.categoriaNome;
        if (updates.categoriaId && updates.categoriaId !== t.categoriaId) {
          const catObj = categorias.find(c => c.id === updates.categoriaId);
          if (catObj) catNome = catObj.nome;
        }

        const updated = {
          ...t,
          titulo: updates.titulo || t.titulo,
          descricao: updates.descricao || t.descricao,
          localizacao: updates.localizacao || t.localizacao,
          prioridade: updates.prioridade || t.prioridade,
          obraId: updates.obraId || t.obraId,
          obraNome: obraNome,
          categoriaId: updates.categoriaId || t.categoriaId,
          categoriaNome: catNome,
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
    
    setRawChamados(prev => prev.map(t => {
      if (t.id === ticketId) {
        const newHist = [...t.historico];
        if (comentario) {
          newHist.push({
            data: nowStr,
            autor: currentUser?.nome || 'Usuário',
            texto: comentario
          });
        }
        if (newStatus && newStatus !== t.status) {
          newHist.push({
            data: nowStr,
            autor: currentUser?.nome || 'Usuário',
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

      if (newStatus === 'Concluído') {
        sendEmailNotification({
          type: 'chamado_concluido',
          ticket: updatedTicket,
          comentario
        });
      }
    }
  };

  // CRUD FOR OBRAS
  const addObra = async (obraData) => {
    const newObra = {
      id: `loc-${Date.now()}`,
      nome: obraData.nome,
      cidade: obraData.cidade,
      engenheiro: obraData.engenheiro || 'A definir',
      progresso: parseInt(obraData.progresso, 10) || 0,
      status: obraData.status || 'Operacional',
      codigoQr: `LOC-[#${obraData.nome.toUpperCase().replace(/\s+/g, '-')}]`
    };

    setObras(prev => [newObra, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('obras').insert([{
          id: newObra.id,
          nome: newObra.nome,
          cidade: newObra.cidade,
          engenheiro: newObra.engenheiro,
          progresso: newObra.progresso,
          status: newObra.status
        }]);
      } catch (err) {
        console.error('Erro ao salvar obra no Supabase:', err);
      }
    }
    return newObra;
  };

  const deleteObra = async (obraId) => {
    setObras(prev => prev.filter(o => o.id !== obraId));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('obras').delete().eq('id', obraId);
      } catch (err) {
        console.error('Erro ao deletar obra no Supabase:', err);
      }
    }
  };

  // CRUD FOR CATEGORIAS
  const addCategoria = async (catData) => {
    const newCat = {
      id: `cat-${Date.now()}`,
      nome: catData.nome,
      slaHoras: parseInt(catData.slaHoras, 10) || 8,
      cor: catData.cor || '#66C1BF',
      descricao: catData.descricao || ''
    };

    setCategorias(prev => [newCat, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('categorias').insert([{
          id: newCat.id,
          nome: newCat.nome,
          sla_horas: newCat.slaHoras,
          cor: newCat.cor,
          descricao: newCat.descricao
        }]);
      } catch (err) {
        console.error('Erro ao salvar categoria no Supabase:', err);
      }
    }
    return newCat;
  };

  const editObra = async (obraId, updates) => {
    let updatedObj = null;
    setObras(prev => prev.map(o => {
      if (o.id === obraId) {
        const updated = {
          ...o,
          nome: updates.nome || o.nome,
          cidade: updates.cidade || o.cidade,
          engenheiro: updates.engenheiro !== undefined ? updates.engenheiro : o.engenheiro,
          progresso: updates.progresso !== undefined ? parseInt(updates.progresso, 10) : o.progresso,
          status: updates.status || o.status
        };
        updatedObj = updated;
        return updated;
      }
      return o;
    }));

    if (updatedObj && isSupabaseConfigured && supabase) {
      try {
        await supabase.from('obras').update({
          nome: updatedObj.nome,
          cidade: updatedObj.cidade,
          engenheiro: updatedObj.engenheiro,
          progresso: updatedObj.progresso,
          status: updatedObj.status
        }).eq('id', obraId);
      } catch (err) {
        console.error('Erro ao editar obra no Supabase:', err);
      }
    }
  };

  const editCategoria = async (catId, updates) => {
    let updatedObj = null;
    setCategorias(prev => prev.map(c => {
      if (c.id === catId) {
        const updated = {
          ...c,
          nome: updates.nome || c.nome,
          slaHoras: updates.slaHoras !== undefined ? parseInt(updates.slaHoras, 10) : c.slaHoras,
          cor: updates.cor || c.cor,
          descricao: updates.descricao !== undefined ? updates.descricao : c.descricao
        };
        updatedObj = updated;
        return updated;
      }
      return c;
    }));

    if (updatedObj && isSupabaseConfigured && supabase) {
      try {
        await supabase.from('categorias').update({
          nome: updatedObj.nome,
          sla_horas: updatedObj.slaHoras,
          cor: updatedObj.cor,
          descricao: updatedObj.descricao
        }).eq('id', catId);
      } catch (err) {
        console.error('Erro ao editar categoria no Supabase:', err);
      }
    }
  };

  const updateUserProfile = (profileData) => {
    if (!currentUser) return;
    const initials = (profileData.nome || currentUser.nome)
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(n => n[0].toUpperCase())
      .join('');

    let obraNome = currentUser.obraNome;
    if (profileData.obraId) {
      const foundObra = obras.find(o => o.id === profileData.obraId);
      if (foundObra) obraNome = foundObra.nome;
    }

    const updatedUser = {
      ...currentUser,
      nome: profileData.nome || currentUser.nome,
      email: profileData.email || currentUser.email,
      telefone: profileData.telefone !== undefined ? profileData.telefone : currentUser.telefone,
      cargo: profileData.cargo || currentUser.cargo,
      obraId: profileData.obraId || currentUser.obraId,
      obraNome: obraNome,
      password: profileData.password || currentUser.password,
      avatar: initials || currentUser.avatar || 'MA'
    };

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    return { success: true, user: updatedUser };
  };

  return (
    <TicketContext.Provider
      value={{
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        chamados: visibleChamados,
        allChamados: rawChamados,
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
        addObra,
        editObra,
        deleteObra,
        addCategoria,
        editCategoria,
        deleteCategoria,
        updateUserProfile,
        user: currentUser,
        currentUser,
        login,
        registerUser,
        logout,
        ticketFilters,
        setTicketFilters,
        clearTicketFilters,
        isOnlineDb: isSupabaseConfigured,
        isLoadingDb,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => useContext(TicketContext);
