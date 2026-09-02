import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MOCK_CHAMADOS, MOCK_OBRAS, MOCK_CATEGORIAS, MOCK_TECNICOS, MOCK_TERMOS_NOTEBOOKS } from '../data/mockData';
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

// Map snake_case from DB to camelCase for frontend
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

const mapDbTermoToFront = (row) => ({
  id: row.id,
  codigoTermo: row.codigo_termo,
  colaboradorNome: row.colaborador_nome,
  cargo: row.cargo,
  equipamentoModelo: row.equipamento_modelo,
  numeroPatrimonio: row.numero_patrimonio,
  dataEntrega: row.data_entrega,
  status: row.status,
  statusTermo: row.status_termo,
  assinaturaDigital: row.assinatura_digital,
});

export const TicketProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoadingDb, setIsLoadingDb] = useState(false);

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

  const [obras, setObras] = useState(MOCK_OBRAS);
  const [categorias, setCategorias] = useState(MOCK_CATEGORIAS);
  const [tecnicos, setTecnicos] = useState(MOCK_TECNICOS);

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

  // Sync to localStorage as offline cache
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

  // Load from Supabase on mount + setup Realtime
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    let isMounted = true;
    setIsLoadingDb(true);

    const loadSupabaseData = async () => {
      try {
        const [chamadosRes, termosRes, obrasRes, catsRes, tecsRes] = await Promise.all([
          supabase.from('chamados').select('*').order('created_at', { ascending: false }),
          supabase.from('termos_notebooks').select('*').order('created_at', { ascending: false }),
          supabase.from('obras').select('*'),
          supabase.from('categorias').select('*'),
          supabase.from('tecnicos').select('*')
        ]);

        if (isMounted) {
          if (chamadosRes.data && chamadosRes.data.length > 0) {
            setChamados(chamadosRes.data.map(mapDbChamadoToFront));
          }
          if (termosRes.data && termosRes.data.length > 0) {
            setTermos(termosRes.data.map(mapDbTermoToFront));
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'termos_notebooks' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newTermo = mapDbTermoToFront(payload.new);
          setTermos(prev => [newTermo, ...prev.filter(t => t.id !== newTermo.id)]);
        } else if (payload.eventType === 'UPDATE') {
          const updated = mapDbTermoToFront(payload.new);
          setTermos(prev => prev.map(t => t.id === updated.id ? updated : t));
        } else if (payload.eventType === 'DELETE') {
          setTermos(prev => prev.filter(t => t.id !== payload.old.id));
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

  const addTermo = async (termo) => {
    setTermos(prev => [termo, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('termos_notebooks').insert([{
          id: termo.id,
          codigo_termo: termo.codigoTermo,
          colaborador_nome: termo.colaboradorNome,
          cargo: termo.cargo,
          equipamento_modelo: termo.equipamentoModelo,
          numero_patrimonio: termo.numeroPatrimonio,
          data_entrega: termo.dataEntrega,
          status: termo.status || 'Ativo',
          status_termo: termo.statusTermo || 'Assinado Digitalmente',
          assinatura_digital: termo.assinaturaDigital || null
        }]);
      } catch (err) {
        console.error('Erro ao salvar termo no Supabase:', err);
      }
    }
  };

  const updateTermo = async (id, updates) => {
    setTermos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));

    if (isSupabaseConfigured && supabase) {
      try {
        const dbUpdates = {};
        if (updates.status) dbUpdates.status = updates.status;
        if (updates.statusTermo) dbUpdates.status_termo = updates.statusTermo;
        await supabase.from('termos_notebooks').update(dbUpdates).eq('id', id);
      } catch (err) {
        console.error('Erro ao atualizar termo no Supabase:', err);
      }
    }
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

    const newTicket = {
      id: newId,
      titulo: ticketData.titulo,
      descricao: ticketData.descricao,
      obraId: ticketData.obraId,
      obraNome: obraObj?.nome || 'Não especificado',
      localizacao: ticketData.localizacao,
      categoriaId: ticketData.categoriaId,
      categoriaNome: catObj?.nome || 'TI Geral',
      prioridade: ticketData.prioridade || 'Média',
      status: 'Aberto',
      solicitante: ticketData.solicitante || `${user.nome} (${user.cargo})`,
      tecnicoAtribuido: 'Pendente de Atribuição',
      anexo: ticketData.anexo || null,
      anexoNome: ticketData.anexoNome || null,
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
        termos,
        setTermos,
        addTermo,
        updateTermo,
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
        isOnlineDb: isSupabaseConfigured,
        isLoadingDb,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => useContext(TicketContext);
