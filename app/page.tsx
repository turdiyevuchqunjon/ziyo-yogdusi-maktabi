'use client';

import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

// ============================================
// CONFIG
// ============================================
const TELEGRAM_CHANNEL_URL =
  process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL || 'https://t.me/ziyo_yogdusi';
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';

// Meta Pixel global declaration
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

const GRADES = [
  '1-sinf', '2-sinf', '3-sinf', '4-sinf', '5-sinf', '6-sinf',
  '7-sinf', '8-sinf', '9-sinf', '10-sinf', '11-sinf',
];

// ============================================
// STYLES (inline CSS, no Tailwind)
// ============================================
const STYLES = `
  *, *::before, *::after { box-sizing: border-box; }
  * { margin: 0; padding: 0; }
  html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: #0f172a;
    background: #ffffff;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  img, svg { display: block; max-width: 100%; }
  button, input, select { font: inherit; color: inherit; }
  button { cursor: pointer; background: none; border: none; }
  a { color: inherit; text-decoration: none; }
  input, select { -webkit-appearance: none; appearance: none; }

  .zy-container { width: 100%; max-width: 1100px; margin: 0 auto; padding: 0 20px; }

  /* HEADER */
  .zy-header {
    position: sticky; top: 0; z-index: 50;
    background: rgba(255,255,255,0.95);
    -webkit-backdrop-filter: saturate(180%) blur(10px);
    backdrop-filter: saturate(180%) blur(10px);
    border-bottom: 1px solid transparent;
    transition: border-color .15s, box-shadow .15s;
  }
  .zy-header.scrolled { border-bottom-color: #e2e8f0; box-shadow: 0 1px 2px rgba(0,0,0,.03); }
  .zy-header-inner {
    display: flex; align-items: center; justify-content: space-between; height: 64px;
  }
  .zy-logo { display: flex; align-items: center; gap: 10px; }
  .zy-logo-mark {
    width: 36px; height: 36px; background: #1E40AF; color: #fff;
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
    font-weight: 600; font-size: 14px;
  }
  .zy-logo-text { font-weight: 600; font-size: 15px; color: #0f172a; }
  @media (max-width: 480px) { .zy-logo-text { display: none; } }

  /* BUTTONS */
  .zy-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    background: #1E40AF; color: #fff; font-weight: 500; font-size: 14px;
    padding: 10px 18px; border-radius: 8px; border: none; cursor: pointer;
    transition: background .15s, box-shadow .15s, transform .05s;
    box-shadow: 0 1px 2px rgba(30,64,175,.15);
    font-family: inherit;
  }
  .zy-btn:hover { background: #1E3A8A; box-shadow: 0 2px 6px rgba(30,64,175,.25); }
  .zy-btn:active { transform: translateY(1px); }
  .zy-btn:disabled { opacity: .65; cursor: not-allowed; }
  .zy-btn-lg { padding: 14px 28px; font-size: 15px; }
  .zy-btn-block { width: 100%; }

  /* HERO */
  .zy-hero { padding: 64px 0 80px; text-align: center; background: #fff; }
  @media (min-width: 640px) { .zy-hero { padding: 80px 0 96px; } }
  .zy-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: #EFF6FF; color: #1E40AF; font-size: 12px; font-weight: 500;
    padding: 6px 14px; border-radius: 999px; margin-bottom: 20px;
  }
  .zy-badge-dot { width: 6px; height: 6px; background: #1E40AF; border-radius: 50%; }
  .zy-hero-title {
    font-size: 32px; font-weight: 700; line-height: 1.15;
    letter-spacing: -.02em; color: #0f172a; margin-bottom: 18px;
  }
  @media (min-width: 640px) { .zy-hero-title { font-size: 44px; } }
  @media (min-width: 1024px) { .zy-hero-title { font-size: 52px; } }
  .zy-hero-title .accent { color: #1E40AF; }
  .zy-hero-subtitle {
    font-size: 16px; color: #475569; max-width: 560px; margin: 0 auto 32px; line-height: 1.6;
  }
  @media (min-width: 640px) { .zy-hero-subtitle { font-size: 17px; } }

  /* STATS */
  .zy-stats {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
    max-width: 560px; margin: 48px auto 0;
  }
  @media (min-width: 640px) { .zy-stats { gap: 16px; } }
  .zy-stat {
    background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px;
    padding: 18px 12px; text-align: center;
  }
  @media (min-width: 640px) { .zy-stat { padding: 22px 16px; } }
  .zy-stat-value {
    font-size: 26px; font-weight: 700; color: #1E40AF; line-height: 1; margin-bottom: 6px;
  }
  @media (min-width: 640px) { .zy-stat-value { font-size: 32px; } }
  .zy-stat-label { font-size: 12px; color: #64748b; }
  @media (min-width: 640px) { .zy-stat-label { font-size: 13px; } }

  /* ABOUT */
  .zy-about {
    background: #f8fafc; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9;
    padding: 64px 0;
  }
  @media (min-width: 640px) { .zy-about { padding: 80px 0; } }
  .zy-about-grid {
    display: grid; grid-template-columns: 1fr; gap: 40px; align-items: center;
  }
  @media (min-width: 900px) { .zy-about-grid { grid-template-columns: 1fr 1fr; gap: 56px; } }
  .zy-about-image {
    position: relative; aspect-ratio: 4/3; background: #DBEAFE;
    border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;
    box-shadow: 0 4px 12px rgba(0,0,0,.04);
  }
  .zy-about-image img { width: 100%; height: 100%; object-fit: cover; }
  .zy-eyebrow {
    font-size: 12px; font-weight: 600; color: #1E40AF;
    letter-spacing: .08em; text-transform: uppercase; margin-bottom: 12px;
  }
  .zy-section-title {
    font-size: 26px; font-weight: 700; letter-spacing: -.015em; line-height: 1.2;
    color: #0f172a; margin-bottom: 16px;
  }
  @media (min-width: 640px) { .zy-section-title { font-size: 32px; } }
  .zy-section-lead { font-size: 15px; color: #475569; line-height: 1.65; margin-bottom: 24px; }
  .zy-features { display: grid; grid-template-columns: 1fr; gap: 10px; }
  @media (min-width: 480px) { .zy-features { grid-template-columns: 1fr 1fr; } }
  .zy-feature {
    display: flex; align-items: flex-start; gap: 12px;
    background: #fff; border: 1px solid #f1f5f9; border-radius: 10px; padding: 12px 14px;
  }
  .zy-feature-check {
    width: 22px; height: 22px; flex-shrink: 0; margin-top: 1px;
    background: #EFF6FF; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; color: #1E40AF;
  }
  .zy-feature-title { font-size: 13px; font-weight: 600; color: #0f172a; line-height: 1.3; }
  .zy-feature-desc { font-size: 12px; color: #64748b; margin-top: 2px; line-height: 1.4; }

  /* FORM */
  .zy-form-section { background: #fff; padding: 64px 0; }
  @media (min-width: 640px) { .zy-form-section { padding: 80px 0; } }
  .zy-section-head { text-align: center; margin-bottom: 32px; }
  .zy-section-head .zy-section-title { margin-bottom: 8px; }
  .zy-section-head p { font-size: 15px; color: #64748b; }
  .zy-form-card {
    max-width: 440px; margin: 0 auto;
    background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 16px;
    padding: 28px 24px;
  }
  @media (min-width: 480px) { .zy-form-card { padding: 32px; } }
  .zy-field { margin-bottom: 16px; }
  .zy-field label {
    display: block; font-size: 13px; font-weight: 500; color: #0f172a; margin-bottom: 6px;
  }
  .zy-input, .zy-select {
    display: block; width: 100%; background: #fff; border: 1px solid #e2e8f0;
    border-radius: 8px; padding: 12px 14px; font-size: 14px; color: #0f172a;
    transition: border-color .15s, box-shadow .15s;
    font-family: inherit;
  }
  .zy-input::placeholder { color: #94a3b8; }
  .zy-input:focus, .zy-select:focus {
    outline: none; border-color: #1E40AF; box-shadow: 0 0 0 3px rgba(30,64,175,.12);
  }
  .zy-input:disabled, .zy-select:disabled { background: #f1f5f9; cursor: not-allowed; }
  .zy-phone-wrap { position: relative; }
  .zy-phone-prefix {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: #64748b; font-size: 14px; pointer-events: none;
    font-variant-numeric: tabular-nums;
  }
  .zy-phone-wrap .zy-input { padding-left: 56px; }
  .zy-select {
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 14px center;
    padding-right: 36px; cursor: pointer;
  }
  .zy-error {
    background: #FEF2F2; border: 1px solid #FECACA; color: #DC2626;
    font-size: 13px; padding: 10px 12px; border-radius: 8px; margin-bottom: 12px;
  }
  .zy-form-hint { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 10px; }
  .zy-spinner {
    width: 16px; height: 16px;
    border: 2.5px solid rgba(255,255,255,.35); border-top-color: #fff;
    border-radius: 50%; animation: zy-spin .7s linear infinite;
  }
  @keyframes zy-spin { to { transform: rotate(360deg); } }

  /* FOOTER */
  .zy-footer { background: #0f172a; color: #cbd5e1; padding: 48px 0 28px; }
  .zy-footer-head { text-align: center; margin-bottom: 36px; }
  .zy-footer-head .zy-eyebrow { color: #93C5FD; margin-bottom: 8px; }
  .zy-footer-head h3 {
    font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -.015em;
  }
  @media (min-width: 640px) { .zy-footer-head h3 { font-size: 26px; } }
  .zy-contact-grid {
    display: grid; grid-template-columns: 1fr; gap: 24px; max-width: 800px; margin: 0 auto;
  }
  @media (min-width: 640px) { .zy-contact-grid { grid-template-columns: repeat(3, 1fr); } }
  .zy-contact-item { text-align: center; }
  @media (min-width: 640px) { .zy-contact-item { text-align: left; } }
  .zy-contact-head {
    display: inline-flex; align-items: center; gap: 8px;
    color: #93C5FD; font-size: 13px; font-weight: 500; margin-bottom: 6px;
  }
  .zy-contact-value { font-size: 14px; color: #fff; transition: color .15s; }
  a.zy-contact-value:hover { color: #93C5FD; }
  .zy-footer-bottom {
    border-top: 1px solid #1e293b; margin-top: 36px; padding-top: 24px; text-align: center;
  }
  .zy-footer-bottom .zy-logo { justify-content: center; margin-bottom: 8px; display: inline-flex; }
  .zy-footer-bottom .zy-logo-mark { width: 28px; height: 28px; font-size: 12px; }
  .zy-footer-bottom .zy-logo-text { color: #fff; }
  .zy-copyright { font-size: 12px; color: #64748b; }
`;

// ============================================
// HELPERS
// ============================================
function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 9);
  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 5),
    digits.slice(5, 7),
    digits.slice(7, 9),
  ].filter(Boolean);
  return parts.join(' ');
}

function fbqTrack(event: string, params?: Record<string, unknown>, eventID?: string) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  if (eventID) {
    window.fbq('track', event, params || {}, { eventID });
  } else {
    window.fbq('track', event, params || {});
  }
}

function getFbCookies(): { fbp?: string; fbc?: string } {
  if (typeof document === 'undefined') return {};
  const cookies = document.cookie.split(';').reduce<Record<string, string>>((acc, c) => {
    const [k, ...v] = c.trim().split('=');
    if (k) acc[k] = decodeURIComponent(v.join('='));
    return acc;
  }, {});
  return { fbp: cookies._fbp, fbc: cookies._fbc };
}

function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

// ============================================
// MAIN PAGE
// ============================================
export default function Page() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [grade, setGrade] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Header scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Init Meta Pixel
  useEffect(() => {
    if (!META_PIXEL_ID || typeof window === 'undefined') return;
    if (window.fbq) return;

    const script = document.createElement('script');
    script.async = true;
    script.innerHTML = `
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${META_PIXEL_ID}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);
  }, []);

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError("Ismni to'liq kiriting");
      return;
    }
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 9) {
      setError("Telefon raqamini to'liq kiriting");
      return;
    }
    if (!grade) {
      setError('Sinfni tanlang');
      return;
    }

    setLoading(true);

    const eventId = generateEventId();
    const { fbp, fbc } = getFbCookies();
    const fullPhone = `+998${digits}`;

    fbqTrack(
      'Lead',
      { content_name: 'School Application', content_category: 'Education', currency: 'UZS' },
      eventId
    );

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: fullPhone,
          grade,
          eventId,
          fbp,
          fbc,
          sourceUrl: window.location.href,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Xato yuz berdi. Iltimos, qaytadan urinib ko'ring.");
        setLoading(false);
        return;
      }
      router.push('/thanks');
    } catch {
      setError("Tarmoqda xato. Internetni tekshirib, qaytadan urinib ko'ring.");
      setLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />

      {/* HEADER */}
      <header className={`zy-header${scrolled ? ' scrolled' : ''}`}>
        <div className="zy-container zy-header-inner">
          <a href="#top" className="zy-logo">
            <span className="zy-logo-mark">ZY</span>
            <span className="zy-logo-text">Ziyo Yog&apos;dusi</span>
          </a>
          <a href="#contact" className="zy-btn">Ariza topshirish</a>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section id="top" className="zy-hero">
          <div className="zy-container">
            <div className="zy-badge">
              <span className="zy-badge-dot" />
              2015-yildan beri · Litsenziyalangan
            </div>

            <h1 className="zy-hero-title">
              Farzandingiz uchun eng yaxshi
              <br />
              <span className="accent">ta&apos;lim makoni</span>
            </h1>

            <p className="zy-hero-subtitle">
              Zamonaviy metodikalar, malakali o&apos;qituvchilar va shaxsiy yondashuv bilan
              har bir bolaning iqtidorini ochib beramiz.
            </p>

            <a href="#contact" className="zy-btn zy-btn-lg">
              Hoziroq ariza topshirish
              <span aria-hidden>→</span>
            </a>

            <div className="zy-stats">
              <div className="zy-stat">
                <div className="zy-stat-value">800+</div>
                <div className="zy-stat-label">O&apos;quvchilar</div>
              </div>
              <div className="zy-stat">
                <div className="zy-stat-value">90%</div>
                <div className="zy-stat-label">OTM ga kirish</div>
              </div>
              <div className="zy-stat">
                <div className="zy-stat-value">10+</div>
                <div className="zy-stat-label">Yillik tajriba</div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="zy-about">
          <div className="zy-container">
            <div className="zy-about-grid">
              <div className="zy-about-image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/bino.png" alt="Ziyo Yog'dusi maktabi" />
              </div>

              <div>
                <div className="zy-eyebrow">Biz haqimizda</div>
                <h2 className="zy-section-title">10 yillik tajriba va yutuqlar</h2>
                <p className="zy-section-lead">
                  Ziyo Yog&apos;dusi maktabi 2015-yildan beri faoliyat yuritib, mingdan ortiq
                  o&apos;quvchilarga sifatli ta&apos;lim bermoqda va yorqin kelajakka yo&apos;l
                  ochib beradi.
                </p>

                <div className="zy-features">
                  {[
                    { title: 'Litsenziyalangan', desc: 'Davlat standartlariga mos' },
                    { title: 'Malakali kadrlar', desc: 'Tajribali ustozlar jamoasi' },
                    { title: 'Zamonaviy bino', desc: "Qulay o'quv muhiti" },
                    { title: "Olimpiada g'oliblari", desc: 'Respublika miqyosida' },
                  ].map((f) => (
                    <div key={f.title} className="zy-feature">
                      <span className="zy-feature-check">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="3"
                          strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      <div>
                        <div className="zy-feature-title">{f.title}</div>
                        <div className="zy-feature-desc">{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FORM */}
        <section id="contact" className="zy-form-section">
          <div className="zy-container">
            <div className="zy-section-head">
              <div className="zy-eyebrow">Ariza</div>
              <h2 className="zy-section-title">Ro&apos;yxatdan o&apos;ting</h2>
              <p>Ma&apos;lumotlaringizni qoldiring, biz siz bilan tezda bog&apos;lanamiz</p>
            </div>

            <form onSubmit={onSubmit} className="zy-form-card" noValidate>
              <div className="zy-field">
                <label htmlFor="name">Ota-ona ismi</label>
                <input
                  id="name"
                  className="zy-input"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ismingizni kiriting"
                  disabled={loading}
                  required
                  minLength={2}
                  maxLength={80}
                />
              </div>

              <div className="zy-field">
                <label htmlFor="phone">Telefon raqam</label>
                <div className="zy-phone-wrap">
                  <span className="zy-phone-prefix">+998</span>
                  <input
                    id="phone"
                    className="zy-input"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="99 999 99 99"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="zy-field">
                <label htmlFor="grade">Farzand sinfi</label>
                <select
                  id="grade"
                  className="zy-select"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  disabled={loading}
                  required
                >
                  <option value="">Sinfni tanlang</option>
                  {GRADES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {error && <div className="zy-error">{error}</div>}

              <button type="submit" className="zy-btn zy-btn-block" disabled={loading}>
                {loading ? (
                  <>
                    <span className="zy-spinner" /> Yuborilmoqda...
                  </>
                ) : (
                  'Arizani yuborish'
                )}
              </button>

              <p className="zy-form-hint">Ma&apos;lumotlaringiz xavfsiz saqlanadi</p>
            </form>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="zy-footer">
        <div className="zy-container">
          <div className="zy-footer-head">
            <div className="zy-eyebrow">Manzil</div>
            <h3>Bizni toping</h3>
          </div>

          <div className="zy-contact-grid">
            <div className="zy-contact-item">
              <div className="zy-contact-head">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Manzil</span>
              </div>
              <div className="zy-contact-value">Samarqand viloyati, Pastarg&apos;om tumani</div>
            </div>

            <div className="zy-contact-item">
              <div className="zy-contact-head">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
                </svg>
                <span>Telefon</span>
              </div>
              <a className="zy-contact-value" href="tel:+998999999999">+998 99 999 99 99</a>
            </div>

            <div className="zy-contact-item">
              <div className="zy-contact-head">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>Ish vaqti</span>
              </div>
              <div className="zy-contact-value">Du-Sh: 8:00 - 18:00</div>
            </div>
          </div>

          <div className="zy-footer-bottom">
            <div className="zy-logo">
              <span className="zy-logo-mark">ZY</span>
              <span className="zy-logo-text">Ziyo Yog&apos;dusi</span>
            </div>
            <p className="zy-copyright">
              © {new Date().getFullYear()} Ziyo Yog&apos;dusi maktabi. Barcha huquqlar himoyalangan.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}