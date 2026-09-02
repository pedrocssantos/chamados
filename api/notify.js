import { Resend } from 'resend';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(200).json({ 
      warning: 'RESEND_API_KEY não configurada na Vercel. Notificação por e-mail ignorada.',
      simulated: true 
    });
  }

  const resend = new Resend(apiKey);
  const fromEmail = process.env.NOTIFICATION_EMAIL_FROM || 'TI Maximo Aldana <onboarding@resend.dev>';
  const toDefault = process.env.NOTIFICATION_EMAIL_TO || 'pedro.santos@maximoaldana.com.br';

  const { type, ticket, recipientEmail, comentario } = req.body || {};

  if (!ticket || !ticket.id) {
    return res.status(400).json({ error: 'Dados do chamado (ticket) são obrigatórios.' });
  }

  const destination = recipientEmail || toDefault;

  // Build subject and body based on notification type
  let subject = `[TI Maximo Aldana] ${ticket.id} - ${ticket.titulo}`;
  let headline = 'Notificação de Chamado de TI';
  let badgeColor = '#009693';
  let badgeText = ticket.status;

  if (type === 'novo_chamado') {
    subject = `[Novo Chamado] ${ticket.id} (${ticket.prioridade}) - ${ticket.titulo}`;
    headline = 'Novo Chamado de TI Aberto';
    badgeColor = ticket.prioridade === 'Crítica' ? '#E16666' : '#009693';
    badgeText = `Prioridade: ${ticket.prioridade}`;
  } else if (type === 'chamado_concluido') {
    subject = `[Chamado Concluído] ${ticket.id} - ${ticket.titulo}`;
    headline = 'Chamado de TI Concluído com Sucesso';
    badgeColor = '#43C486';
    badgeText = 'Status: Concluído';
  } else if (type === 'sla_alerta') {
    subject = `⚠️ [ALERTA SLA] ${ticket.id} - Prazo Próximo do Vencimento`;
    headline = 'Alerta de Prazo de Atendimento (SLA)';
    badgeColor = '#E16666';
    badgeText = 'SLA em Risco';
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F8FA; margin: 0; padding: 24px; color: #132A3A; }
        .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 10px; border: 1px solid #D9E5EC; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.04); }
        .header { background-color: #0B1D2D; padding: 20px 24px; color: #F1F7F8; }
        .header h1 { margin: 0; font-size: 18px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { margin: 4px 0 0 0; font-size: 12px; color: #66C1BF; font-weight: 600; }
        .content { padding: 24px; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold; color: #FFFFFF; background-color: ${badgeColor}; margin-bottom: 16px; }
        .title { font-size: 16px; font-weight: bold; margin: 0 0 12px 0; color: #0B1D2D; }
        .meta-table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
        .meta-table td { padding: 8px 12px; border-bottom: 1px solid #EDF3F5; }
        .meta-table td.label { font-weight: bold; color: #5E7A8A; width: 35%; background: #F8FAFC; }
        .meta-table td.value { color: #132A3A; font-weight: 600; }
        .desc-box { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 14px; border-radius: 6px; font-size: 13px; line-height: 1.5; color: #334155; margin-top: 16px; }
        .footer { background: #F8FAFC; padding: 16px 24px; text-align: center; font-size: 11px; color: #8BA2B0; border-top: 1px solid #EDF3F5; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>MAXIMO ALDANA — SUPORTE TI</h1>
          <p>${headline}</p>
        </div>
        <div class="content">
          <span class="badge">${badgeText}</span>
          <h2 class="title">${ticket.id}: ${ticket.titulo}</h2>
          
          <table class="meta-table">
            <tr>
              <td class="label">Obra / Local:</td>
              <td class="value">${ticket.obraNome || 'Não especificado'}</td>
            </tr>
            <tr>
              <td class="label">Localização Exata:</td>
              <td class="value">${ticket.localizacao || 'Canteiro de Obras'}</td>
            </tr>
            <tr>
              <td class="label">Categoria:</td>
              <td class="value">${ticket.categoriaNome || 'TI Geral'}</td>
            </tr>
            <tr>
              <td class="label">Solicitante:</td>
              <td class="value">${ticket.solicitante || 'Colaborador'}</td>
            </tr>
            <tr>
              <td class="label">Técnico Responsável:</td>
              <td class="value">${ticket.tecnicoAtribuido || 'Pendente de Atribuição'}</td>
            </tr>
            <tr>
              <td class="label">Data de Abertura:</td>
              <td class="value">${ticket.dataCriacao || '-'}</td>
            </tr>
            <tr>
              <td class="label">Prazo Limite (SLA):</td>
              <td class="value">${ticket.prazoSla || '-'}</td>
            </tr>
          </table>

          <div class="desc-box">
            <strong>Descrição da Ocorrência:</strong><br/>
            ${ticket.descricao}
          </div>

          ${comentario ? `
            <div class="desc-box" style="margin-top: 10px; border-left: 3px solid #009693; background: #F0FDF4;">
              <strong>Nova Observação Técnica:</strong><br/>
              ${comentario}
            </div>
          ` : ''}
        </div>
        <div class="footer">
          Mensagem automática enviada pelo Sistema de Chamados de TI da Construtora Maximo Aldana.<br/>
          Hospedado na Vercel com banco de dados Supabase e entrega por Resend.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [destination],
      subject,
      html: htmlContent,
    });

    if (error) {
      console.error('Erro Resend API:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Falha no envio de e-mail:', err);
    return res.status(500).json({ error: err.message || 'Erro interno ao disparar e-mail.' });
  }
}
