# Ziyo Yog'dusi — Landing Page

Next.js 14 (App Router) + TypeScript + Tailwind CSS. Sotuvga moslangan minimalist landing page Telegram bot va Meta Pixel/CAPI integratsiyasi bilan.

## 🚀 Texnologiyalar

- **Next.js 14** (App Router, Server Actions)
- **TypeScript** — strict mode
- **Tailwind CSS** — minimalist dizayn (oq fon, ko'k aksent)
- **Telegram Bot API** — arizalarni qabul qilish
- **Meta Pixel** — client-side tracking
- **Meta Conversions API (CAPI)** — server-side tracking (iOS 14+ uchun muhim, dedup eventID orqali)

## 📂 Loyiha tuzilishi

```
.
├── app/
│   ├── api/lead/route.ts      # Lead API: Telegram + CAPI
│   ├── thanks/page.tsx        # Thanks page (10s redirect)
│   ├── globals.css
│   ├── icon.png               # Favicon
│   ├── layout.tsx             # Root layout + Meta Pixel script
│   └── page.tsx               # Asosiy landing page
├── components/
│   ├── Header.tsx             # Sticky header
│   ├── Hero.tsx               # Hero section + 3 stat
│   ├── About.tsx              # Maktab haqida + rasm + 4 feature
│   ├── LeadForm.tsx           # Ariza formasi (Pixel Lead event bilan)
│   ├── Footer.tsx             # Manzil, telefon, ish vaqti
│   └── ThanksClient.tsx       # Countdown + Telegram redirect
├── lib/
│   ├── telegram.ts            # Telegram bot integratsiya
│   ├── meta-pixel.ts          # Client-side fbq helpers
│   └── meta-capi.ts           # Server-side CAPI (SHA-256 hashing)
├── public/
│   └── school.jpg             # Maktab rasmi (placeholder)
├── .env.example               # Environment template
└── package.json
```

## ⚙️ O'rnatish

```bash
# Dependencies
npm install

# Environment variables
cp .env.example .env.local
# .env.local ni to'ldiring (pastdagi bo'limga qarang)

# Development
npm run dev          # http://localhost:3000

# Production
npm run build
npm start
```

## 🔐 Environment Variables (`.env.local`)

```env
# ===== TELEGRAM =====
TELEGRAM_BOT_TOKEN=123456789:AAaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
TELEGRAM_CHAT_ID=-1001234567890
NEXT_PUBLIC_TELEGRAM_CHANNEL_URL=https://t.me/ziyo_yogdusi

# ===== META PIXEL (client) =====
NEXT_PUBLIC_META_PIXEL_ID=1234567890123456

# ===== META CAPI (server) =====
META_CAPI_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxx
META_PIXEL_ID=1234567890123456
META_TEST_EVENT_CODE=         # Faqat test paytida, productionda bo'sh
```

### Telegram credentials qanday olinadi

1. [@BotFather](https://t.me/BotFather) → `/newbot` → token oling
2. Botni o'z kanalingiz/guruhingizga admin qiling
3. Chat ID olish:
   - Botga `/start` yozing yoki kanalga xabar yuboring
   - `https://api.telegram.org/bot<TOKEN>/getUpdates` ni oching
   - `chat.id` ni topib qo'ying (guruh/kanal uchun `-100...` bilan boshlanadi)

### Meta CAPI Access Token

1. [Facebook Events Manager](https://business.facebook.com/events_manager) → Pixel'ingizni tanlang
2. Settings → Conversions API → Generate Access Token
3. Token va Pixel ID ni `.env.local` ga qo'ying
4. **Muhim:** Server domain'ni Domain Verification orqali tasdiqlang

## ✅ Meta Pixel + CAPI dedup qanday ishlaydi

Bir xil event Pixel (browser) va CAPI (server)dan ikki marta yuboriladi — Meta `event_id` orqali ularni birlashtiradi:

1. `LeadForm.tsx` da `eventId` generatsiya qilinadi
2. Bir vaqtning o'zida:
   - **Client:** `fbq('track', 'Lead', {...}, { eventID })` — Pixel orqali
   - **Server:** `POST /api/lead` → CAPI'ga bir xil `event_id` bilan
3. Meta server tomonida deduplikatsiya qiladi (qo'sh hisoblamaslik uchun)
4. CAPI'ga `fbp` va `fbc` cookielar ham yuboriladi (yaxshi match score uchun)

PII (telefon, ism) **SHA-256 hashed** ko'rinishda yuboriladi (Meta talabi).

### Test qilish

1. `.env.local` ga `META_TEST_EVENT_CODE=TEST12345` qo'ying (Events Manager → Test Events bo'limidan oling)
2. Saytda forma yuboring
3. Events Manager → Test Events da ikkala source ham (`Browser` + `Server`) ko'rinishi kerak

## 🎨 Dizayn

- **Fon:** oq (toza, ishonchli)
- **Aksent:** brand-800 (`#1E40AF`) — professional ko'k
- **Tipografiya:** Inter (CDN orqali)
- **Yondashuv:** minimalist, generous whitespace, kichik borderlar
- **Mobile-first** responsive

## 🔄 User flow

1. Foydalanuvchi sahifaga keladi → Pixel `PageView` event
2. Formani to'ldirib "Arizani yuborish" bosadi
3. Client-side validatsiya o'tadi
4. `fbq('track', 'Lead', ..., {eventID})` chiqadi
5. `POST /api/lead` server'ga ketadi:
   - Telegram'ga xabar yuboriladi (asosiy)
   - CAPI'ga bir xil `eventID` bilan `Lead` event
6. Muvaffaqiyat → `/thanks` sahifa
7. 10 sekund countdown → Telegram kanalga avtomatik o'tadi

## 🛡️ Xavfsizlik

- Telefon/ism validatsiya — client + server
- Telegram credentials `.env` da (commit qilinmaydi)
- CAPI tokeni faqat server tomonda
- PII SHA-256 hashed
- `/thanks` sahifa `noindex`
- API route `force-dynamic` (cache yo'q)

## 📝 Maktab rasmini almashtirish

`public/school.jpg` — hozir placeholder. O'zingizning haqiqiy rasmingiz bilan almashtiring (`public/school.jpg` nomi bilan, optimal o'lcham 1200x900px, < 200KB).

## 🚢 Deploy

**Vercel** (eng oson):

```bash
npm i -g vercel
vercel
```

Environment variables'ni Vercel dashboard'da kiriting.

**Boshqa hosting:** `npm run build` → `.next` papkasi va `npm start` (Node.js 18+).

## 📞 Yordam

Muammo bo'lsa, browser console'ni tekshiring va `/api/lead` response'ni Network tab'da ko'ring.
# ziyo-yogdusi-maktabi
