// wa.me requires the full international number (country code, no leading 0/15).
// Using the AR mobile format with country code 54 + 9 prefix as a sane default —
// double check this resolves correctly once the real WhatsApp Business number is confirmed.
export const WHATSAPP_NUMBER = '3491687912';
export const WHATSAPP_URL = `https://wa.me/549${WHATSAPP_NUMBER}`;
