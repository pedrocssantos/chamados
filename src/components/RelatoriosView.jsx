import React, { useState, useMemo } from 'react';
import { BarChart3, Clock, Printer, TrendingUp, User, CheckCircle2 } from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const parseBrazilDate = (str) => {
  if (!str) return null;
  if (str.includes('-')) {
    const [datePart, timePart] = str.split(' ');
    if(!timePart) return new Date(str);
    const [y, m, d] = datePart.split('-');
    const [h, min] = (timePart || '00:00').split(':');
    return new Date(y, m - 1, d, h, min);
  }
  const parts = str.split(/[\s/:]+/);
  if (parts.length >= 5) {
    const [day, month, year, hours, minutes] = parts;
    return new Date(year, month - 1, day, hours, minutes);
  }
  return new Date(str);
};

export default function RelatoriosView() {
  const { chamados, tecnicos } = useTickets();
  const [periodo, setPeriodo] = useState('Todos');

  const now = new Date();

  // Filter by period
  const filteredChamados = useMemo(() => {
    if (periodo === 'Todos') return chamados;
    let dias = 0;
    if (periodo === 'Últimos 7 dias') dias = 7;
    if (periodo === 'Últimos 30 dias') dias = 30;
    if (periodo === 'Últimos 90 dias') dias = 90;

    const limite = new Date(now.getTime() - dias * 24 * 60 * 60 * 1000);
    return chamados.filter(c => {
      const dt = parseBrazilDate(c.dataCriacao);
      return dt && dt >= limite;
    });
  }, [chamados, periodo]);

  // SLA Compliance & Avg Time
  const metrics = useMemo(() => {
    let completedCount = 0;
    let slaCumpridoCount = 0;
    let totalTimeMs = 0;

    filteredChamados.forEach(c => {
      if (c.status === 'Concluído') {
        completedCount++;
        
        // Find last change to Concluído
        const histConcluido = [...(c.historico || [])]
          .reverse()
          .find(h => h.texto?.includes('Concluído') || h.texto?.toLowerCase().includes('resolvido'));
          
        // fallback to last history entry or creation if not found
        const resolucaoDate = histConcluido ? parseBrazilDate(histConcluido.data) : 
            (c.historico?.length > 0 ? parseBrazilDate(c.historico[c.historico.length - 1].data) : parseBrazilDate(c.dataCriacao));
            
        const slaDate = parseBrazilDate(c.prazoSla);
        if (resolucaoDate && slaDate && resolucaoDate <= slaDate) {
          slaCumpridoCount++;
        }

        const criacaoDate = parseBrazilDate(c.dataCriacao);
        if (criacaoDate && resolucaoDate) {
          totalTimeMs += (resolucaoDate - criacaoDate);
        }
      }
    });

    const slaPerc = completedCount > 0 ? Math.round((slaCumpridoCount / completedCount) * 100) : (filteredChamados.length === 0 ? 100 : 0);
    const avgMs = completedCount > 0 ? (totalTimeMs / completedCount) : 0;
    const avgHours = avgMs / (1000 * 60 * 60);
    const avgTimeStr = avgHours > 24 
      ? `${(avgHours / 24).toFixed(1)} dias`
      : `${avgHours.toFixed(1)}h`;

    // First Call Resolution (resolvido no primeiro atendimento) - we approximate by having only 2 history items (criacao + resolucao)
    let fcrCount = 0;
    filteredChamados.forEach(c => {
      if (c.status === 'Concluído' && c.historico?.length <= 2) {
        fcrCount++;
      }
    });
    const fcrPerc = completedCount > 0 ? Math.round((fcrCount / completedCount) * 100) : 0;

    return { slaPerc, avgTimeStr, fcrPerc, completedCount };
  }, [filteredChamados]);

  // Chart Data
  const chartData = useMemo(() => {
    const countsByDate = {};
    filteredChamados.forEach(c => {
      const d = parseBrazilDate(c.dataCriacao);
      if (d) {
        // Group by day
        const key = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
        countsByDate[key] = (countsByDate[key] || 0) + 1;
      }
    });
    // Sort keys and format for chart
    return Object.keys(countsByDate).sort((a,b) => {
       const [da, ma] = a.split('/');
       const [db, mb] = b.split('/');
       if(ma !== mb) return ma - mb;
       return da - db;
    }).map(k => ({
      data: k,
      chamados: countsByDate[k]
    }));
  }, [filteredChamados]);

  // Technicians metrics
  const tecMetrics = useMemo(() => {
    return tecnicos.map(tec => {
      const tix = filteredChamados.filter(c => c.tecnicoAtribuido === tec.nome);
      let done = 0;
      let inSla = 0;
      let timeMs = 0;
      tix.forEach(c => {
        if (c.status === 'Concluído') {
          done++;
          const histConcluido = [...(c.historico || [])].reverse().find(h => h.texto?.includes('Concluído'));
          const resolucaoDate = histConcluido ? parseBrazilDate(histConcluido.data) : (c.historico?.length ? parseBrazilDate(c.historico[c.historico.length - 1].data) : parseBrazilDate(c.dataCriacao));
          const slaDate = parseBrazilDate(c.prazoSla);
          if (resolucaoDate && slaDate && resolucaoDate <= slaDate) inSla++;
          const crDate = parseBrazilDate(c.dataCriacao);
          if(crDate && resolucaoDate) timeMs += (resolucaoDate - crDate);
        }
      });
      const slaPerc = done > 0 ? Math.round((inSla / done) * 100) : 0;
      const avgH = done > 0 ? (timeMs / done / (1000 * 60 * 60)).toFixed(1) : 0;
      return { ...tec, total: tix.length, done, slaPerc, avgH };
    });
  }, [filteredChamados, tecnicos]);

  const handleExportCSV = () => {
    let csv = "Tecnico,Especialidade,Total_Atribuidos,Concluidos,SLA_Cumprido_Perc,Tempo_Medio_Horas\n";
    tecMetrics.forEach(t => {
      csv += `${t.nome},${t.especialidade},${t.total},${t.done},${t.slaPerc},${t.avgH}\n`;
    });
    csv += "\nResumo:\n";
    csv += `Cumprimento_SLA,Tempo_Medio,Total_Chamados,Concluidos\n`;
    csv += `${metrics.slaPerc}%,${metrics.avgTimeStr},${filteredChamados.length},${metrics.completedCount}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Relatorio_TI_${periodo.replace(/ /g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-page-enter">
      {/* Header */}
      <div className="bg-[#102A40] border border-[#234963] rounded-[10px] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#66C1BF] text-[#08252B] p-2.5 rounded-[8px]">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#F1F7F8]">Relatórios & Indicadores de SLA</h2>
            <p className="text-xs text-[#9EB5C1]">
              Métricas consolidadas de eficiência de atendimento e tempo de resposta nas obras.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <select 
            className="bg-[#081724] border border-[#234963] text-[#F1F7F8] text-xs px-3 py-2.5 rounded-[6px] outline-none focus:border-[#66C1BF]"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
          >
            <option value="Últimos 7 dias">Últimos 7 dias</option>
            <option value="Últimos 30 dias">Últimos 30 dias</option>
            <option value="Últimos 90 dias">Últimos 90 dias</option>
            <option value="Todos">Todos</option>
          </select>
          
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-[6px] bg-[#66C1BF] hover:bg-[#4FA9A7] text-[#08252B] font-extrabold text-xs flex items-center gap-1.5 shadow-[0_2px_8px_rgba(102,193,191,0.25)] transition-all hover:-translate-y-0.5"
          >
            <Printer className="w-4 h-4" />
            <span>Exportar Relatório</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#102A40] border border-[#234963] p-5 rounded-[10px]">
          <span className="text-[11px] font-extrabold uppercase text-[#7893A2] tracking-wider">Índice de Cumprimento de SLA</span>
          <p className="text-3xl font-black text-[#43C486] mt-1">{metrics.slaPerc}%</p>
          <p className="text-xs text-[#9EB5C1] mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-[#43C486]" />
            <span>Resoluções no prazo estipulado</span>
          </p>
        </div>

        <div className="bg-[#102A40] border border-[#234963] p-5 rounded-[10px]">
          <span className="text-[11px] font-extrabold uppercase text-[#7893A2] tracking-wider">Tempo Médio de Atendimento</span>
          <p className="text-3xl font-black text-[#66C1BF] mt-1">{metrics.avgTimeStr}</p>
          <p className="text-xs text-[#9EB5C1] mt-1">Desde a abertura até a resolução</p>
        </div>

        <div className="bg-[#102A40] border border-[#234963] p-5 rounded-[10px]">
          <span className="text-[11px] font-extrabold uppercase text-[#7893A2] tracking-wider">Resolvidos no Primeiro Atendimento</span>
          <p className="text-3xl font-black text-[#E2B552] mt-1">{metrics.fcrPerc}%</p>
          <p className="text-xs text-[#9EB5C1] mt-1">Eficiência de equipe técnica</p>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-[#102A40] border border-[#234963] rounded-[10px] p-5 shadow-sm">
        <h3 className="text-sm font-extrabold text-[#F1F7F8] flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-[#66C1BF]" />
          <span>Volume de Chamados (Por Dia)</span>
        </h3>
        <div className="h-64 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#234963" vertical={false} />
                <XAxis dataKey="data" stroke="#7893A2" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#7893A2" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#081724', borderColor: '#234963', color: '#F1F7F8', fontSize: '12px' }}
                  itemStyle={{ color: '#66C1BF' }}
                />
                <Line type="monotone" dataKey="chamados" name="Chamados" stroke="#66C1BF" strokeWidth={3} dot={{ fill: '#102A40', stroke: '#66C1BF', strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-[#9EB5C1]">
              Sem dados para o período selecionado.
            </div>
          )}
        </div>
      </div>

      {/* Technician Performance Table */}
      <div className="bg-[#102A40] border border-[#234963] rounded-[10px] p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-[#F1F7F8] flex items-center gap-2">
          <User className="w-4 h-4 text-[#66C1BF]" />
          <span>Desempenho por Técnico Responsável</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#081724] border-b border-[#234963] text-[#7893A2] font-extrabold uppercase text-[10.5px]">
                <th className="py-3 px-4">Técnico</th>
                <th className="py-3 px-4">Especialidade</th>
                <th className="py-3 px-4 text-center">Atendimentos</th>
                <th className="py-3 px-4 text-center">Concluídos</th>
                <th className="py-3 px-4 text-center">TMA (Horas)</th>
                <th className="py-3 px-4 text-right">Avaliação de SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#234963]">
              {tecMetrics.map(tec => (
                <tr key={tec.id} className="hover:bg-[#14334C]">
                  <td className="py-3 px-4 font-bold text-[#F1F7F8]">{tec.nome}</td>
                  <td className="py-3 px-4 text-[#9EB5C1]">{tec.especialidade}</td>
                  <td className="py-3 px-4 text-center font-extrabold text-[#66C1BF]">{tec.total}</td>
                  <td className="py-3 px-4 text-center font-extrabold text-[#43C486]">{tec.done}</td>
                  <td className="py-3 px-4 text-center font-extrabold text-[#F1F7F8]">{tec.avgH}h</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10.5px] font-extrabold border ${
                      tec.slaPerc >= 90 ? 'bg-[#43C486]/15 text-[#43C486] border-[#43C486]/30' :
                      tec.slaPerc >= 70 ? 'bg-[#E2B552]/15 text-[#E2B552] border-[#E2B552]/30' :
                      'bg-[#E16666]/15 text-[#E16666] border-[#E16666]/30'
                    }`}>
                      {tec.slaPerc}% OK
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
