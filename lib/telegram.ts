// Telegram'ga xabar yuborish

interface LeadData {
  name: string;
  phone: string;
  grade: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function sendToTelegram(lead: LeadData): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return { ok: false, error: 'Telegram credentials not configured' };
  }

  const now = new Date().toLocaleString('uz-UZ', {
    timeZone: 'Asia/Tashkent',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  const text =
    `🎓 <b>Yangi ariza — Ziyo Yog'dusi</b>\n\n` +
    `👤 <b>Ism:</b> ${escapeHtml(lead.name)}\n` +
    `📞 <b>Telefon:</b> <a href="tel:${escapeHtml(lead.phone)}">${escapeHtml(lead.phone)}</a>\n` +
    `📚 <b>Sinf:</b> ${escapeHtml(lead.grade)}\n\n` +
    `🕐 <i>${now}</i>`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      return { ok: false, error: data.description || 'Telegram API error' };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown Telegram error' };
  }
}
