import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Printer, Download, Plus, Building2, QrCode, Sparkles } from 'lucide-react';
import { useTickets } from '../context/TicketContext';

export default function QrStudioView() {
  const { obras } = useTickets();
  const [tagTitle, setTagTitle] = useState('Gerador Toyama 15kVA');
  const [tagCode, setTagCode] = useState('EQP-GERADOR-TOYAMA-04');
  const [tagObra, setTagObra] = useState(obras[0]?.nome || 'Residencial Aldana Tower');
  const [tagLocal, setTagLocal] = useState('Canteiro Central - Área de Máquinas #04');
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        tagCode,
        {
          width: 180,
          margin: 1,
          color: {
            dark: '#08252B',
            light: '#FFFFFF'
          }
        },
        (err) => {
          if (err) console.error(err);
        }
      );
    }
  }, [tagCode]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Header Banner */}
      <div className="bg-[#102A40] border border-[#234963] rounded-[10px] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#66C1BF] text-[#08252B] p-3 rounded-[8px]">
            <Printer className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#F1F7F8]">Estúdio de Etiquetas QR Code</h2>
            <p className="text-xs text-[#9EB5C1]">
              Gere e imprima etiquetas adesivas para fixar em equipamentos, ferramentas e cômodos dos canteiros de obra.
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-[6px] bg-[#66C1BF] hover:bg-[#4FA9A7] text-[#08252B] font-extrabold text-xs flex items-center gap-1.5 shadow-[0_2px_8px_rgba(102,193,191,0.25)] transition-all hover:-translate-y-0.5 shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir Etiquetas</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Form Controls */}
        <div className="bg-[#102A40] border border-[#234963] rounded-[10px] p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-[#F1F7F8] flex items-center gap-2 pb-2 border-b border-[#234963]">
            <Sparkles className="w-4 h-4 text-[#66C1BF]" />
            <span>Configurar Nova Etiqueta</span>
          </h3>

          <div className="space-y-1">
            <label className="text-xs text-[#9EB5C1] font-semibold">Nome do Item / Máquina / Cômodo</label>
            <input
              type="text"
              value={tagTitle}
              onChange={(e) => setTagTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs text-[#F1F7F8] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-[#9EB5C1] font-semibold">Código do QR Code / Tombamento</label>
            <input
              type="text"
              value={tagCode}
              onChange={(e) => setTagCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs font-mono font-bold text-[#66C1BF] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-[#9EB5C1] font-semibold">Obra de Destino</label>
            <select
              value={tagObra}
              onChange={(e) => setTagObra(e.target.value)}
              className="w-full px-3 py-2 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs text-[#F1F7F8] focus:outline-none"
            >
              {obras.map(o => (
                <option key={o.id} value={o.nome}>{o.nome}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-[#9EB5C1] font-semibold">Localização Específica na Obra</label>
            <input
              type="text"
              value={tagLocal}
              onChange={(e) => setTagLocal(e.target.value)}
              className="w-full px-3 py-2 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs text-[#F1F7F8] focus:outline-none"
            />
          </div>
        </div>

        {/* Right Live Tag Preview */}
        <div className="bg-[#102A40] border border-[#234963] rounded-[10px] p-5 shadow-sm flex flex-col items-center justify-center space-y-4">
          <h3 className="text-sm font-extrabold text-[#F1F7F8]">Pré-visualização da Etiqueta Impressa</h3>

          {/* Printable Ticket Badge Card */}
          <div className="w-[300px] bg-white text-slate-900 rounded-[10px] p-4 border-4 border-[#66C1BF] shadow-xl flex flex-col items-center text-center space-y-2">
            
            {/* Header */}
            <div className="bg-[#0B1D2D] text-[#66C1BF] w-full py-1.5 px-2 rounded font-black text-xs tracking-wider flex items-center justify-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>MAXIMO ALDANA</span>
            </div>

            {/* QR Canvas */}
            <div className="p-2 bg-white rounded border border-gray-200">
              <canvas ref={canvasRef} className="mx-auto"></canvas>
            </div>

            {/* Tag Info */}
            <div className="w-full text-center space-y-0.5">
              <p className="font-mono font-bold text-xs text-[#08252B] tracking-wider">{tagCode}</p>
              <h4 className="font-extrabold text-sm text-gray-900 leading-tight">{tagTitle}</h4>
              <p className="text-[10.5px] font-semibold text-gray-600 truncate">{tagObra}</p>
              <p className="text-[10px] text-gray-500 truncate">{tagLocal}</p>
            </div>

            <p className="text-[9px] text-gray-400 uppercase tracking-widest pt-1 border-t border-gray-200 w-full">
              Escaneie para Abrir Chamado
            </p>
          </div>

          <p className="text-xs text-[#7893A2] text-center max-w-xs">
            Imprima esta etiqueta em papel adesivo vinílico ou plastificado para alta durabilidade no canteiro.
          </p>
        </div>

      </div>
    </div>
  );
}
