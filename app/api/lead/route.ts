import { NextRequest, NextResponse } from 'next/server';
import { sendToTelegram } from '@/lib/telegram';
import { sendCapiEvent } from '@/lib/meta-capi';
import { sendToAmoCrm } from '@/lib/amocrm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Telefon validatsiyasi — O'zbekiston formatlari
function isValidUzPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  // 998 prefiks bilan 12 ta raqam yoki 9 ta raqam (oddiy mobil)
  return /^998\d{9}$/.test(digits) || /^\d{9}$/.test(digits);
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 9) return `+998${digits}`;
  if (digits.startsWith('998')) return `+${digits}`;
  return `+${digits}`;
}

interface RequestBody {
  name?: string;
  phone?: string;
  grade?: string;
  eventId?: string;
  fbp?: string;
  fbc?: string;
  sourceUrl?: string;
}

export async function POST(req: NextRequest) {
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const name = (body.name || '').trim();
  const phoneRaw = (body.phone || '').trim();
  const grade = (body.grade || '').trim();

  // Validatsiya
  if (!name || name.length < 2) {
    return NextResponse.json({ ok: false, error: 'Ism noto‘g‘ri' }, { status: 400 });
  }
  if (!isValidUzPhone(phoneRaw)) {
    return NextResponse.json({ ok: false, error: 'Telefon raqam noto‘g‘ri' }, { status: 400 });
  }
  if (!grade) {
    return NextResponse.json({ ok: false, error: 'Sinf tanlanmagan' }, { status: 400 });
  }

  const phone = normalizePhone(phoneRaw);

  // 1. Telegram'ga yuborish (asosiy — bu fail bo'lsa, error qaytaramiz)
  const tgResult = await sendToTelegram({ name, phone, grade });
  if (!tgResult.ok) {
    console.error('[Telegram error]', tgResult.error);
    return NextResponse.json(
      { ok: false, error: 'Xabar yuborishda xato. Iltimos, keyinroq urinib ko‘ring.' },
      { status: 500 }
    );
  }

  // 2. AmoCRM va 3. Meta CAPI — javobni qaytarishdan oldin KUTAMIZ (await).
  // MUHIM: Vercel kabi serverless muhitda "fire and forget" (await qilinmagan)
  // promise'lar javob qaytarilgandan keyin funksiya to'xtatilib, hech qachon
  // tugamasligi mumkin — production'da AmoCRM'ga lid tushmayotgan muammoning
  // aynan sababi shu edi.
  const eventId = body.eventId || `evt_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    undefined;
  const userAgent = req.headers.get('user-agent') || undefined;

  const [amoResult, capiResult] = await Promise.allSettled([
    sendToAmoCrm({ name, phone, grade, sourceUrl: body.sourceUrl }),
    sendCapiEvent({
      eventName: 'Lead',
      eventId,
      eventSourceUrl: body.sourceUrl,
      userData: {
        phone,
        name,
        fbp: body.fbp,
        fbc: body.fbc,
        clientIpAddress: ip,
        clientUserAgent: userAgent,
      },
      customData: {
        content_name: 'School Application',
        content_category: 'Education',
        grade,
      },
    }),
  ]);

  if (amoResult.status === 'rejected') {
    console.error('[AmoCRM error]', amoResult.reason);
  } else if (!amoResult.value.ok) {
    console.error('[AmoCRM error]', amoResult.value.error);
  }

  if (capiResult.status === 'rejected') {
    console.error('[CAPI error]', capiResult.reason);
  } else if (!capiResult.value.ok) {
    console.error('[CAPI error]', capiResult.value.error);
  }

  // AmoCRM/CAPI fail bo'lsa ham, lid Telegram'ga tushgani uchun foydalanuvchiga OK qaytaramiz.
  return NextResponse.json({ ok: true, eventId });
}