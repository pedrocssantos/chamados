import React, { useState } from 'react';
import { 
  QrCode, 
  Camera, 
  Search, 
  Plus, 
  CheckCircle2, 
  Laptop, 
  Wifi, 
  Printer, 
  ArrowRight
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';

export default function QrScannerView() {
  const { openNewTicketWithQr, chamados, setSelectedTicket } = useTickets();
  const [manualCode, setManualCode] = useState('');
  const [scannedResult, setScannedResult] = useState(null);

  // IT Equipment QR presets
  const presetQrs = [
    { code: 'TI-ROTEADOR-STARLINK-01', item: 'Roteador Starlink Canteiro #01', local: 'Obra Aldana Tower - Contêiner TI', cat: 'Redes & Conectividade' },
    { code: 'TI-NOTEBOOK-DELL-G15-09', item: 'Notebook Dell G15 i7 #MA-084', local: 'Sede Corporativa - Sala Engenharia', cat: 'Hardware & Computadores' },
    { code: 'TI-PLOTTER-HP-T520', item: 'Plotter de Plantas HP DesignJet T520', local: 'Obra Grand Ville - Sala de Projetos', cat: 'Impressoras & Plotters' },
    { code: 'TI-CATRACA-HENRY-02', item: 'Catraca Biométrica de Entrada #02', local: 'Obra Aldana Tower - Portaria', cat: 'Segurança & Catracas' }
  ];

  const handleScan = (code) => {
    const found = presetQrs.find(q => q.code === code) || {
      code,
      item: `Equipamento de TI (${code})`,
      local: 'Unidade Maximo Aldana',
      cat: 'TI & Infraestrutura'
    };
    setScannedResult(found);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleScan(manualCode.trim().toUpperCase());
  };

  const activeTicketsForItem = scannedResult 
    ? chamados.filter(c => c.qrCodeItem === scannedResult.code)
    : [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-page-enter">
      {/* Header Banner */}
      <div className="bg-[#102A40] border border-[#234963] rounded-[10px] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)] flex items-center gap-3">
        <div className="bg-[#66C1BF] text-[#08252B] p-3 rounded-[8px] shadow-[0_2px_8px_rgba(102,193,191,0.25)]">
          <QrCode className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-[#F1F7F8]">Leitor de QR Code para Ativos de TI</h2>
          <p className="text-xs text-[#9EB5C1]">
            Aponte a câmera para o QR Code de notebooks, roteadores, impressoras ou racks de TI para abrir um chamado.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Side: Camera Scanner Viewfinder */}
        <div className="bg-[#102A40] border border-[#234963] rounded-[10px] p-5 shadow-sm space-y-4 text-center">
          <h3 className="text-sm font-extrabold text-[#F1F7F8] flex items-center justify-center gap-2">
            <Camera className="w-4 h-4 text-[#66C1BF]" />
            <span>Scanner Virtual de Ativos de TI</span>
          </h3>

          {/* Scanner frame */}
          <div className="relative aspect-square max-w-xs mx-auto rounded-[12px] bg-[#081724] border-2 border-[#234963] overflow-hidden flex flex-col items-center justify-center p-4">
            
            {/* Animated Laser line */}
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#66C1BF] to-transparent shadow-[0_0_12px_#66C1BF] animate-bounce top-1/2 -translate-y-1/2"></div>
            
            {/* Corner Markers */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#66C1BF]"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#66C1BF]"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#66C1BF]"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#66C1BF]"></div>

            <QrCode className="w-20 h-20 text-[#66C1BF]/30 mb-2 animate-pulse" />
            <p className="text-xs text-[#9EB5C1] font-semibold z-10">
              Posicione a etiqueta de TI dentro da moldura
            </p>
          </div>

          {/* Manual Input Form */}
          <form onSubmit={handleManualSubmit} className="pt-2 flex gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Digite o código da etiqueta (ex: TI-NOTEBOOK-09)..."
              className="flex-1 px-3 py-2 rounded-[6px] bg-[#081724] border border-[#234963] focus:border-[#66C1BF] text-xs text-[#F1F7F8] placeholder-[#7893A2] focus:outline-none"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-[#66C1BF] hover:bg-[#4FA9A7] text-[#08252B] font-extrabold rounded-[6px] text-xs transition-colors flex items-center gap-1"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Ler</span>
            </button>
          </form>
        </div>

        {/* Right Side: Scan Results & Quick Presets */}
        <div className="space-y-4">
          
          {/* Preset Buttons for Fast Testing */}
          <div className="bg-[#102A40] border border-[#234963] rounded-[10px] p-4 shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-[#7893A2] tracking-wider">
              Simular Leitura de Ativos de TI Cadastrados
            </h4>
            <div className="space-y-2">
              {presetQrs.map(preset => (
                <button
                  key={preset.code}
                  onClick={() => handleScan(preset.code)}
                  className="w-full text-left p-3 rounded-[6px] bg-[#081724] hover:bg-[#14334C] border border-[#234963] hover:border-[#66C1BF]/50 transition-all flex items-center justify-between group"
                >
                  <div>
                    <p className="text-xs font-bold text-[#F1F7F8] group-hover:text-[#66C1BF] transition-colors">
                      {preset.item}
                    </p>
                    <p className="text-[11px] text-[#7893A2]">{preset.local}</p>
                  </div>
                  <span className="font-mono text-[10px] text-[#66C1BF] bg-[#102A40] px-2 py-0.5 rounded border border-[#234963]">
                    {preset.code.substring(0, 14)}...
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Scan Result Card */}
          {scannedResult && (
            <div className="bg-[#102A40] border-2 border-[#66C1BF] rounded-[10px] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)] space-y-4 animate-page-enter">
              <div className="flex items-center justify-between pb-2 border-b border-[#234963]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#43C486]" />
                  <h3 className="text-sm font-extrabold text-[#F1F7F8]">Equipamento Identificado!</h3>
                </div>
                <span className="font-mono text-xs font-bold text-[#66C1BF] bg-[#081724] px-2 py-0.5 rounded">
                  {scannedResult.code}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <p className="text-[#9EB5C1]">Equipamento: <strong className="text-[#F1F7F8] font-bold">{scannedResult.item}</strong></p>
                <p className="text-[#9EB5C1]">Localização: <strong className="text-[#F1F7F8]">{scannedResult.local}</strong></p>
                <p className="text-[#9EB5C1]">Chamados de TI Abertos: <strong className="text-[#E2B552]">{activeTicketsForItem.length}</strong></p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => openNewTicketWithQr(scannedResult.code)}
                  className="flex-1 py-2.5 px-4 bg-[#66C1BF] hover:bg-[#4FA9A7] text-[#08252B] font-extrabold rounded-[6px] text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Abrir Chamado de TI para este Item</span>
                </button>

                {activeTicketsForItem.length > 0 && (
                  <button
                    onClick={() => setSelectedTicket(activeTicketsForItem[0])}
                    className="py-2.5 px-4 bg-[#14334C] hover:bg-[#163A55] text-[#66C1BF] border border-[#234963] font-bold rounded-[6px] text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Ver Chamado Existente</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
