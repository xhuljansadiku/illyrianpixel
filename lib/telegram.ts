// Njoftime instant në Telegram për adminin (lead i ri, ofertë e pranuar etj.).
// Kërkon env: TELEGRAM_BOT_TOKEN (nga @BotFather) dhe TELEGRAM_CHAT_ID (chat-i yt me botin).
// Nëse mungojnë, funksioni s'bën asgjë — asnjë gabim, asnjë varësi.

export async function sendTelegramMessage(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
  } catch {
    // best-effort — njoftimi s'duhet të bllokojë asnjë rrjedhë kryesore
  }
}

export function escapeTelegramHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
