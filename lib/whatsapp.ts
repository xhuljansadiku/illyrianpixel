// Njoftime WhatsApp për adminin përmes CallMeBot.
// Kërkon env: WHATSAPP_PHONE (numri me kod vendi, p.sh. 355694726827) dhe WHATSAPP_APIKEY
// (merret duke i shkruar "I allow callmebot to send me messages" numrit +34 644 59 71 67 në WhatsApp).
// Nëse mungojnë, funksioni s'bën asgjë — asnjë gabim, asnjë varësi.

export async function sendWhatsAppMessage(text: string): Promise<void> {
  const phone = process.env.WHATSAPP_PHONE;
  const apikey = process.env.WHATSAPP_APIKEY;
  if (!phone || !apikey) return;

  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(text)}&apikey=${apikey}`;
    await fetch(url);
  } catch {
    // best-effort — njoftimi s'duhet të bllokojë asnjë rrjedhë kryesore
  }
}
