import React, { useState, useEffect } from 'react';
import { 
  X, 
  PlusCircle, 
  Building, 
  Layers, 
  AlertTriangle, 
  MapPin, 
  FileText, 
  Camera, 
  CheckCircle2
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';

export default function NewTicketModal() {
  const { 
    isNewTicketOpen, 
    setIsNewTicketOpen, 
    obras, 
    categorias, 
    createTicket, 
    user 
  } = useTickets();

  const [obraId, setObraId] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [prioridade, setPrioridade] = useState('Média');
  const [titulo, setTitulo] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [descricao, setDescricao] = useState('');
  const [solicitante, setSolicitante] = useState('');
  const [fileName, setFileName] = useState('');
  const [anexoBase64, setAnexoBase64] = useState('');
  const [formError, setFormError] = useState('');

  // Sync state whenever modal opens or user loads
  useEffect(() => {
    if (isNewTicketOpen) {
      setObraId(user?.obraId || obras?.[0]?.id || '');
      setCategoriaId(categorias?.[0]?.id || '');
      setPrioridade('Média');
      setTitulo('');
      setLocalizacao('');
      setDescricao('');
      setSolicitante(user ? `${user.nome || 'Colaborador'} (${user.cargo || 'Geral'})` : 'Colaborador Maximo Aldana');
      setFileName('');
      setAnexoBase64('');
      setFormError('');
    }
  }, [isNewTicketOpen, user, obras, categorias]);

  if (!isNewTicketOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAnexoBase64(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFileName('');
      setAnexoBase64('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!titulo || !localizacao || !descricao) {
      setFormError('Por favor, preencha todos os campos obrigatórios (*).');
      return;
    }

    createTicket({
      titulo,
      descricao,
      localizacao,
      obraId: obraId || obras?.[0]?.id,
      categoriaId: categoriaId || categorias?.[0]?.id,
      prioridade,
      solicitante: solicitante || (user ? `${user.nome} (${user.cargo})` : 'Colaborador'),
      anexo: anexoBase64,
      anexoNome: fileName
    });

    setIsNewTicketOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0B1D2D]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#102A40] border border-[#66C1BF]/40 rounded-[12px] max-w-2xl w-full max-h-[92vh] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.4)] animate-page-enter overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-[#081724] px-5 py-4 border-b border-[#234963] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-[6px] bg-[#66C1BF] text-[#08252B]">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#F1F7F8]">Abertura de Chamado de TI</h3>
              <p className="text-xs text-[#9EB5C1]">
                {user?.role === 'cliente' 
                  ? `Solicitação direta para ${user.obraNome || 'sua obra'}`
                  : 'Registre um chamado técnico para suporte e infraestrutura'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNewTicketOpen(false)}
            className="p-1 rounded-[6px] text-[#7893A2] hover:text-[#F1F7F8] hover:bg-[#14334C] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {formError && (
            <div className="p-3 bg-[#E16666]/15 border border-[#E16666]/40 rounded-[6px] text-xs font-bold text-[#E16666] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Obra e Categoria row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#9EB5C1] flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#66C1BF]" />
                <span>Obra / Unidade *</span>
              </label>
              <select
                value={obraId}
                onChange={(e) => setObraId(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs font-bold text-[#F1F7F8] outline-none"
              >
                {(obras || []).map(o => (
                  <option key={o.id} value={o.id}>{o.nome} ({o.cidade})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#9EB5C1] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#66C1BF]" />
                <span>Categoria do Problema *</span>
              </label>
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs font-bold text-[#F1F7F8] outline-none"
              >
                {(categorias || []).map(c => (
                  <option key={c.id} value={c.id}>{c.nome} (SLA: {c.slaHoras || c.sla_horas}h)</option>
                ))}
              </select>
            </div>
          </div>

          {/* Title and Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-[#9EB5C1] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#66C1BF]" />
                <span>Título Resumido da Ocorrência *</span>
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Wi-Fi do contêiner instável / Troca de toner"
                required
                className="w-full px-3 py-2 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs font-bold text-[#F1F7F8] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#9EB5C1] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#E2B552]" />
                <span>Prioridade *</span>
              </label>
              <select
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value)}
                className="w-full px-3 py-2 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs font-bold text-[#F1F7F8] outline-none"
              >
                <option value="Baixa">Baixa (Dúvida/Melhoria)</option>
                <option value="Média">Média (Impacto Parcial)</option>
                <option value="Alta">Alta (Impacto Operacional)</option>
                <option value="Crítica">Crítica (Canteiro Parado)</option>
              </select>
            </div>
          </div>

          {/* Exact Location and Requester */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#9EB5C1] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#66C1BF]" />
                <span>Localização Exata na Obra *</span>
              </label>
              <input
                type="text"
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                placeholder="Ex: Contêiner 02 - Sala dos Engenheiros"
                required
                className="w-full px-3 py-2 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs font-bold text-[#F1F7F8] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#9EB5C1] flex items-center gap-1.5">
                <span>Nome do Solicitante</span>
              </label>
              <input
                type="text"
                value={solicitante}
                onChange={(e) => setSolicitante(e.target.value)}
                className="w-full px-3 py-2 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs font-bold text-[#F1F7F8] outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#9EB5C1]">
              Descrição Detalhada do Problema *
            </label>
            <textarea
              rows={4}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva detalhadamente o ocorrido..."
              required
              className="w-full px-3 py-2 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs text-[#F1F7F8] outline-none"
            />
          </div>

          {/* File attachment */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#9EB5C1] flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#66C1BF]" />
              <span>Anexar Foto ou Comprovante (Opcional)</span>
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="w-full text-xs text-[#7893A2] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-bold file:bg-[#14334C] file:text-[#66C1BF] hover:file:bg-[#163A55]"
            />
            {fileName && (
              <p className="text-[11px] text-[#66C1BF]">Arquivo selecionado: {fileName}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#234963]">
            <button
              type="button"
              onClick={() => setIsNewTicketOpen(false)}
              className="px-4 py-2 rounded-[6px] bg-[#14334C] hover:bg-[#163A55] text-[#9EB5C1] hover:text-[#F1F7F8] text-xs font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-[6px] bg-[#66C1BF] hover:bg-[#4FA9A7] text-[#08252B] font-extrabold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Registrar Chamado</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
