// Meta Pixel client-side helpers

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

export function fbqTrack(event: string, params?: Record<string, unknown>, eventID?: string) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  if (eventID) {
    window.fbq('track', event, params || {}, { eventID });
  } else {
    window.fbq('track', event, params || {});
  }
}

// fbp/fbc cookie'lardan o'qish (CAPI dedup uchun)
export function getFbCookies(): { fbp?: string; fbc?: string } {
  if (typeof document === 'undefined') return {};
  const cookies = document.cookie.split(';').reduce<Record<string, string>>((acc, c) => {
    const [k, ...v] = c.trim().split('=');
    if (k) acc[k] = decodeURIComponent(v.join('='));
    return acc;
  }, {});
  return { fbp: cookies._fbp, fbc: cookies._fbc };
}

// Unique event ID — Pixel va CAPI'da bir xil bo'lishi kerak (deduplication)
export function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}
