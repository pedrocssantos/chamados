import React, { useState } from 'react';
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

  const [obraId, setObraId] = useState(obras[0]?.id || '');
  const [categoriaId, setCategoriaId] = useState(categorias[0]?.id || '');
  const [prioridade, setPrioridade] = useState('Média');
  const [titulo, setTitulo] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [descricao, setDescricao] = useState('');
  const [solicitante, setSolicitante] = useState(`${user.nome} (${user.cargo})`);
  const [fileName, setFileName] = useState('');
  const [anexoBase64, setAnexoBase64] = useState('');
  const [formError, setFormError] = useState('');

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
      obraId,
      categoriaId,
      prioridade,
      localizacao,
      descricao,
      solicitante,
      anexo: anexoBase64
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0B1D2D]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#102A40] border border-[#66C1BF]/40 rounded-[12px] max-w-2xl w-full max-h-[92vh] flex flex-col shadow-[0_25px_60px_rgba(0,0,0,0.45)] animate-page-enter overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-[#081724] px-5 py-4 border-b border-[#234963] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-[#66C1BF] text-[#08252B] p-2 rounded shadow-sm">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#F1F7F8]">
                Abertura de Novo Chamado de TI
              </h3>
              <p className="text-xs text-[#9EB5C1]">
                Registro oficial para problemas de redes, computadores, sistemas e impressoras.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsNewTicketOpen(false)}
            className="p-1.5 rounded-[6px] text-[#7893A2] hover:text-[#F1F7F8] hover:bg-[#14334C] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* Obra & Categoria row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-[#9EB5C1] font-semibold flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-[#66C1BF]" /> Obra / Local de TI *
              </label>
              <select
                value={obraId}
                onChange={(e) => setObraId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs text-[#F1F7F8] focus:outline-none"
              >
                {obras.map(o => (
                  <option key={o.id} value={o.id}>{o.nome} ({o.cidade})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#9EB5C1] font-semibold flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-[#66C1BF]" /> Categoria de TI *
              </label>
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs text-[#F1F7F8] focus:outline-none"
              >
                {categorias.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Title & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs text-[#9EB5C1] font-semibold flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-[#66C1BF]" /> Título do Chamado *
              </label>
              <input
                type="text"
                required
                value={titulo}
                onChange={(e) => {
                  setTitulo(e.target.value);
                  if (formError && e.target.value) setFormError('');
                }}
                placeholder="Ex: Queda da internet Starlink no contêiner / Reset de Senha Sienge"
                className={`w-full px-3 py-2.5 rounded-[6px] bg-[#081724] border ${formError && !titulo ? 'border-[#E16666]' : 'border-[#234963]'} focus:border-[#66C1BF] text-xs text-[#F1F7F8] placeholder-[#7893A2] focus:outline-none`}
              />
              {formError && !titulo && <p className="text-[10px] text-[#E16666] font-bold">Título é obrigatório</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#9EB5C1] font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-[#E2B552]" /> Urgência / Prioridade
              </label>
              <select
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value)}
                className="w-full px-3 py-2.5 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs font-bold text-[#F1F7F8] focus:outline-none"
              >
                <option value="Baixa">Baixa</option>
                <option value="Média">Média (Padrão)</option>
                <option value="Alta">Alta</option>
                <option value="Crítica">Crítica (Rede/Link Offline)</option>
              </select>
            </div>
          </div>

          {/* Exact Location & Requester */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-[#9EB5C1] font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#66C1BF]" /> Localização Exata *
              </label>
              <input
                type="text"
                required
                value={localizacao}
                onChange={(e) => {
                  setLocalizacao(e.target.value);
                  if (formError && e.target.value) setFormError('');
                }}
                placeholder="Ex: Contêiner de Engenharia / 2º Andar Sede"
                className={`w-full px-3 py-2.5 rounded-[6px] bg-[#081724] border ${formError && !localizacao ? 'border-[#E16666]' : 'border-[#234963]'} focus:border-[#66C1BF] text-xs text-[#F1F7F8] placeholder-[#7893A2] focus:outline-none`}
              />
              {formError && !localizacao && <p className="text-[10px] text-[#E16666] font-bold">Localização é obrigatória</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#9EB5C1] font-semibold flex items-center gap-1">
                Solicitante / Contato
              </label>
              <input
                type="text"
                value={solicitante}
                onChange={(e) => setSolicitante(e.target.value)}
                className="w-full px-3 py-2.5 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs text-[#F1F7F8] focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs text-[#9EB5C1] font-semibold">
              Descrição Detalhada da Ocorrência *
            </label>
            <textarea
              required
              rows={4}
              value={descricao}
              onChange={(e) => {
                setDescricao(e.target.value);
                if (formError && e.target.value) setFormError('');
              }}
              placeholder="Descreva o problema encontrado, mensagem de erro ou equipamento afetado..."
              className={`w-full px-3 py-2.5 rounded-[6px] bg-[#081724] border ${formError && !descricao ? 'border-[#E16666]' : 'border-[#234963]'} focus:border-[#66C1BF] text-xs text-[#F1F7F8] placeholder-[#7893A2] focus:outline-none resize-none`}
            />
            {formError && !descricao && <p className="text-[10px] text-[#E16666] font-bold">Descrição é obrigatória</p>}
          </div>

          {/* Image Upload */}
          <div className="space-y-1">
            <label className="text-xs text-[#9EB5C1] font-semibold flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-[#66C1BF]" /> Captura / Print de Erro (Opcional)
            </label>
            <div className="border-2 border-dashed border-[#234963] hover:border-[#66C1BF]/50 rounded-[8px] p-4 text-center bg-[#081724]/60 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
              <Camera className="w-6 h-6 text-[#7893A2] mx-auto mb-1" />
              {fileName ? (
                <p className="text-xs font-bold text-[#66C1BF]">Arquivo selecionado: {fileName}</p>
              ) : (
                <p className="text-xs text-[#9EB5C1]">Clique para anexar imagem ou print de erro</p>
              )}
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-3 border-t border-[#234963] flex items-center justify-between gap-3">
            <div className="text-[#E16666] text-xs font-bold">{formError}</div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsNewTicketOpen(false)}
                className="px-4 py-2.5 rounded-[6px] bg-[#14334C] hover:bg-[#163A55] text-[#9EB5C1] hover:text-[#F1F7F8] border border-[#234963] text-xs font-bold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-[6px] bg-[#66C1BF] hover:bg-[#4FA9A7] text-[#08252B] font-extrabold text-xs shadow-[0_2px_8px_rgba(102,193,191,0.25)] transition-all hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Registrar Chamado</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
