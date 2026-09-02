/**
 * Dispara notificação por e-mail via Vercel Serverless Function + Resend
 */
export async function sendEmailNotification({ type, ticket, recipientEmail, comentario }) {
  try {
    const response = await fetch('/api/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        ticket,
        recipientEmail,
        comentario,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.warn('Aviso ao disparar e-mail:', err);
      return { success: false, error: err };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    // Graceful fallback (e.g. dev environment without vercel dev serverless)
    console.info('Notificação Resend (local/offline):', { type, ticketId: ticket?.id });
    return { success: false, error: err.message };
  }
}
