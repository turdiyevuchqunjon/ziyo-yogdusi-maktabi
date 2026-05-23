// Meta Conversions API (CAPI) — server-side event yuborish
import crypto from 'crypto';

interface CapiUserData {
  phone?: string;
  name?: string;
  fbp?: string;
  fbc?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
}

interface CapiEventPayload {
  eventName: string;
  eventId: string;
  eventSourceUrl?: string;
  userData: CapiUserData;
  customData?: Record<string, unknown>;
}

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

function splitName(fullName: string): { fn?: string; ln?: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return {};
  if (parts.length === 1) return { fn: parts[0] };
  return { fn: parts[0], ln: parts.slice(1).join(' ') };
}

export async function sendCapiEvent(payload: CapiEventPayload): Promise<{ ok: boolean; error?: string }> {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  const testEventCode = process.env.META_TEST_EVENT_CODE;

  if (!pixelId || !accessToken) {
    return { ok: false, error: 'Meta CAPI credentials not configured' };
  }

  const user_data: Record<string, unknown> = {};

  if (payload.userData.phone) {
    user_data.ph = [sha256(normalizePhone(payload.userData.phone))];
  }
  if (payload.userData.name) {
    const { fn, ln } = splitName(payload.userData.name);
    if (fn) user_data.fn = [sha256(fn)];
    if (ln) user_data.ln = [sha256(ln)];
  }
  if (payload.userData.fbp) user_data.fbp = payload.userData.fbp;
  if (payload.userData.fbc) user_data.fbc = payload.userData.fbc;
  if (payload.userData.clientIpAddress) user_data.client_ip_address = payload.userData.clientIpAddress;
  if (payload.userData.clientUserAgent) user_data.client_user_agent = payload.userData.clientUserAgent;

  const eventData = {
    event_name: payload.eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: payload.eventId,
    action_source: 'website' as const,
    event_source_url: payload.eventSourceUrl,
    user_data,
    custom_data: payload.customData || {},
  };

  const body: Record<string, unknown> = {
    data: [eventData],
  };
  if (testEventCode) {
    body.test_event_code = testEventCode;
  }

  const url = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      return { ok: false, error: JSON.stringify(data) };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown CAPI error' };
  }
}
