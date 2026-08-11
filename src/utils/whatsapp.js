// wa.me requires the full international number (country code, no leading 0/15).
// AR mobile format: country code 54 + 9 prefix. Confirmed as the real business number.
export const WHATSAPP_NUMBER = '3491687912';
export const WHATSAPP_URL = `https://wa.me/549${WHATSAPP_NUMBER}`;

// Same link, with a prefilled message — used by the quick-option buttons in
// the WhatsApp chat widget so the visitor's first message is already typed.
export function waLink(message) {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
}
