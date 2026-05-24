'use client';

import { useEffect, useState, FormEvent, ChangeEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';

// ============================================
// CONFIG
// ============================================
const TELEGRAM_CHANNEL_URL =
  process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL || 'https://t.me/ziyo_yogdusi';
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';

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
// STYLES — original design + animations
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
    overflow-x: hidden;
  }
  img, svg { display: block; max-width: 100%; }
  button, input, select { font: inherit; color: inherit; }
  button { cursor: pointer; background: none; border: none; }
  a { color: inherit; text-decoration: none; }
  input, select { -webkit-appearance: none; appearance: none; }

  .zy-container { width: 100%; max-width: 1100px; margin: 0 auto; padding: 0 20px; position: relative; }

  /* ============ KEYFRAMES ============ */
  @keyframes zy-fade-up {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes zy-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes zy-pulse-dot {
    0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(30,64,175,0.5); }
    50%      { transform: scale(1.2); box-shadow: 0 0 0 6px rgba(30,64,175,0); }
  }
  @keyframes zy-float {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-12px); }
  }
  @keyframes zy-bounce-x {
    0%, 100% { transform: translateX(0); }
    50%      { transform: translateX(4px); }
  }
  @keyframes zy-spin { to { transform: rotate(360deg); } }
  @keyframes zy-shimmer-bg {
    0%, 100% { background-position: 0% 50%; }
    50%      { background-position: 100% 50%; }
  }

  /* Reveal-on-scroll */
  .zy-reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity .7s cubic-bezier(0.16, 1, 0.3, 1),
                transform .7s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .zy-reveal.zy-revealed { opacity: 1; transform: translateY(0); }
  .zy-reveal-left { transform: translateX(-32px); }
  .zy-reveal-left.zy-revealed { transform: translateX(0); }
  .zy-reveal-right { transform: translateX(32px); }
  .zy-reveal-right.zy-revealed { transform: translateX(0); }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: .01ms !important;
      transition-duration: .01ms !important;
    }
    .zy-reveal { opacity: 1; transform: none; }
  }

  /* HEADER */
  .zy-header {
    position: sticky; top: 0; z-index: 50;
    background: rgba(255,255,255,0.95);
    -webkit-backdrop-filter: saturate(180%) blur(10px);
    backdrop-filter: saturate(180%) blur(10px);
    border-bottom: 1px solid transparent;
    transition: all .3s cubic-bezier(0.16, 1, 0.3, 1);
    animation: zy-fade-in .6s ease-out;
  }
  .zy-header.scrolled {
    border-bottom-color: #e2e8f0;
    box-shadow: 0 4px 20px rgba(0,0,0,.06);
  }
  .zy-header-inner {
    display: flex; align-items: center; justify-content: space-between; height: 64px;
  }
  .zy-logo {
    display: flex; align-items: center; gap: 10px;
    transition: transform .25s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .zy-logo:hover { transform: scale(1.04); }
  .zy-logo-mark {
    width: 36px; height: 36px; background: #1E40AF; color: #fff;
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
    font-weight: 600; font-size: 14px;
  }
  .zy-logo-text { font-weight: 600; font-size: 15px; color: #0f172a; }
  @media (max-width: 480px) { .zy-logo-text { display: none; } }

  /* BUTTONS */
  .zy-btn {
    position: relative;
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    background: #1E40AF; color: #fff; font-weight: 500; font-size: 14px;
    padding: 10px 18px; border-radius: 8px; border: none; cursor: pointer;
    transition: all .25s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 1px 2px rgba(30,64,175,.15), 0 4px 12px rgba(30,64,175,.1);
    font-family: inherit;
    overflow: hidden;
    isolation: isolate;
  }
  .zy-btn::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.25), transparent);
    transition: left .6s ease;
    z-index: -1;
  }
  .zy-btn:hover::before { left: 100%; }
  .zy-btn:hover {
    background: #1E3A8A;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(30,64,175,.2), 0 10px 20px rgba(30,64,175,.2);
  }
  .zy-btn:active { transform: translateY(0); box-shadow: 0 1px 2px rgba(30,64,175,.2); }
  .zy-btn:disabled { opacity: .65; cursor: not-allowed; transform: none; background: #1E40AF; }
  .zy-btn:disabled::before { display: none; }
  .zy-btn-lg { padding: 14px 28px; font-size: 15px; }
  .zy-btn-block { width: 100%; }
  .zy-arrow { display: inline-block; transition: transform .25s ease; }
  .zy-btn:hover .zy-arrow { animation: zy-bounce-x .8s ease infinite; }

  /* HERO */
  .zy-hero { padding: 64px 0 80px; text-align: center; background: #fff; }
  @media (min-width: 640px) { .zy-hero { padding: 80px 0 96px; } }
  .zy-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: #EFF6FF; color: #1E40AF; font-size: 12px; font-weight: 500;
    padding: 6px 14px; border-radius: 999px; margin-bottom: 20px;
    border: 1px solid #DBEAFE;
    animation: zy-fade-up .6s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .zy-badge-dot {
    width: 6px; height: 6px;
    background: #1E40AF; border-radius: 50%;
    animation: zy-pulse-dot 2s ease-in-out infinite;
  }
  .zy-hero-title {
    font-size: 32px; font-weight: 700; line-height: 1.15;
    letter-spacing: -.02em; color: #0f172a; margin-bottom: 18px;
    animation: zy-fade-up .7s cubic-bezier(0.16, 1, 0.3, 1) .1s both;
  }
  @media (min-width: 640px) { .zy-hero-title { font-size: 44px; } }
  @media (min-width: 1024px) { .zy-hero-title { font-size: 52px; } }
  .zy-hero-title .accent {
    background: linear-gradient(90deg, #1E40AF, #3B82F6, #1E40AF);
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: zy-shimmer-bg 4s linear infinite;
  }
  .zy-hero-subtitle {
    font-size: 16px; color: #475569; max-width: 560px; margin: 0 auto 32px; line-height: 1.6;
    animation: zy-fade-up .7s cubic-bezier(0.16, 1, 0.3, 1) .25s both;
  }
  @media (min-width: 640px) { .zy-hero-subtitle { font-size: 17px; } }
  .zy-hero-cta {
    display: inline-block;
    animation: zy-fade-up .7s cubic-bezier(0.16, 1, 0.3, 1) .4s both;
  }

  /* STATS */
  .zy-stats {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
    max-width: 560px; margin: 48px auto 0;
  }
  @media (min-width: 640px) { .zy-stats { gap: 16px; } }
  .zy-stat {
    background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px;
    padding: 18px 12px; text-align: center;
    transition: all .3s cubic-bezier(0.16, 1, 0.3, 1);
    animation: zy-fade-up .6s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .zy-stat:nth-child(1) { animation-delay: .55s; }
  .zy-stat:nth-child(2) { animation-delay: .7s; }
  .zy-stat:nth-child(3) { animation-delay: .85s; }
  .zy-stat:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(30,64,175,.1);
    border-color: #BFDBFE;
    background: #fff;
  }
  @media (min-width: 640px) { .zy-stat { padding: 22px 16px; } }
  .zy-stat-value {
    font-size: 26px; font-weight: 700; color: #1E40AF; line-height: 1; margin-bottom: 6px;
    font-variant-numeric: tabular-nums;
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
    transition: transform .5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow .5s ease;
  }
  .zy-about-image:hover {
    transform: scale(1.02);
    box-shadow: 0 20px 60px rgba(30,64,175,.15);
  }
  .zy-about-image img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform .8s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .zy-about-image:hover img { transform: scale(1.06); }
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
    transition: all .25s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .zy-feature:hover {
    transform: translateY(-3px);
    border-color: #BFDBFE;
    box-shadow: 0 6px 20px rgba(30,64,175,.08);
  }
  .zy-feature-check {
    width: 22px; height: 22px; flex-shrink: 0; margin-top: 1px;
    background: #EFF6FF; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; color: #1E40AF;
    transition: all .3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .zy-feature:hover .zy-feature-check {
    background: #1E40AF; color: #fff;
    transform: rotate(360deg) scale(1.1);
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
    transition: all .4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .zy-form-card:hover {
    box-shadow: 0 20px 50px rgba(30,64,175,.08);
    transform: translateY(-2px);
  }
  @media (min-width: 480px) { .zy-form-card { padding: 32px; } }
  .zy-field { margin-bottom: 16px; }
  .zy-field label {
    display: block; font-size: 13px; font-weight: 500; color: #0f172a; margin-bottom: 6px;
    transition: color .2s ease;
  }
  .zy-field:focus-within label { color: #1E40AF; }
  .zy-input, .zy-select {
    display: block; width: 100%; background: #fff; border: 1px solid #e2e8f0;
    border-radius: 8px; padding: 12px 14px; font-size: 14px; color: #0f172a;
    transition: all .25s cubic-bezier(0.16, 1, 0.3, 1);
    font-family: inherit;
  }
  .zy-input::placeholder { color: #94a3b8; transition: opacity .2s ease; }
  .zy-input:focus::placeholder { opacity: .5; }
  .zy-input:focus, .zy-select:focus {
    outline: none; border-color: #1E40AF;
    box-shadow: 0 0 0 4px rgba(30,64,175,.12);
    transform: translateY(-1px);
  }
  .zy-input:disabled, .zy-select:disabled { background: #f1f5f9; cursor: not-allowed; }
  .zy-phone-wrap { position: relative; }
  .zy-phone-prefix {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: #64748b; font-size: 14px; pointer-events: none;
    font-variant-numeric: tabular-nums;
    transition: color .2s ease;
  }
  .zy-phone-wrap:focus-within .zy-phone-prefix { color: #1E40AF; font-weight: 500; }
  .zy-phone-wrap .zy-input { padding-left: 56px; }
  .zy-select {
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 14px center;
    padding-right: 36px; cursor: pointer;
  }
  .zy-error {
    background: #FEF2F2; border: 1px solid #FECACA; color: #DC2626;
    font-size: 13px; padding: 10px 12px; border-radius: 8px; margin-bottom: 12px;
    animation: zy-fade-up .3s ease-out;
  }
  .zy-form-hint { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 10px; }
  .zy-spinner {
    width: 16px; height: 16px;
    border: 2.5px solid rgba(255,255,255,.35); border-top-color: #fff;
    border-radius: 50%; animation: zy-spin .7s linear infinite;
  }

  /* FOOTER */
  .zy-footer { background: #0f172a; color: #cbd5e1; padding: 48px 0 28px; position: relative; }
  .zy-footer::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, #1E40AF, transparent);
  }
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
  .zy-contact-item { text-align: center; transition: transform .25s ease; }
  .zy-contact-item:hover { transform: translateY(-3px); }
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
    digits.slice(0, 2), digits.slice(2, 5),
    digits.slice(5, 7), digits.slice(7, 9),
  ].filter(Boolean);
  return parts.join(' ');
}

function fbqTrack(event: string, params?: Record<string, unknown>, eventID?: string) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  if (eventID) window.fbq('track', event, params || {}, { eventID });
  else window.fbq('track', event, params || {});
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
// COUNT-UP NUMBER (with safe fallback)
// ============================================
function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [value, setValue] = useState(target); // fallback: agar animatsiya ishlamasa, raqam darhol ko'rinadi
  const ref = useRef<HTMLSpanElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;

    // IntersectionObserver yo'q bo'lsa — darhol animatsiyani boshlaymiz
    if (typeof IntersectionObserver === 'undefined') {
      startedRef.current = true;
      animate();
      return;
    }

    const node = ref.current;
    if (!node) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            animate();
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    obs.observe(node);

    // Fallback timer — agar 1s ichida observer ishlamasa, animatsiyani majburan boshlaymiz
    const fallback = setTimeout(() => {
      if (!startedRef.current) {
        startedRef.current = true;
        animate();
      }
    }, 1000);

    function animate() {
      const duration = 1600;
      const start = performance.now();
      setValue(0);
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 4);
        setValue(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    return () => {
      obs.disconnect();
      clearTimeout(fallback);
    };
  }, [target]);

  return (
    <span ref={ref}>
      {value}{suffix}
    </span>
  );
}

// ============================================
// REVEAL HOOK
// ============================================
function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setRevealed(true);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    obs.observe(node);

    // Fallback — 1.5s ichida ko'rinmasa, majburan ko'rsatamiz (ekran kichik bo'lsa ham xato bo'lmasligi uchun)
    const t = setTimeout(() => setRevealed(true), 1500);

    return () => {
      obs.disconnect();
      clearTimeout(t);
    };
  }, []);

  return { ref, revealed };
}

// ============================================
// MAIN PAGE
// ============================================
export default function Page() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  const aboutImage = useReveal<HTMLDivElement>();
  const aboutContent = useReveal<HTMLDivElement>();
  const formWrap = useReveal<HTMLDivElement>();
  const footerWrap = useReveal<HTMLDivElement>();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [grade, setGrade] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

    if (name.trim().length < 2) { setError("Ismni to'liq kiriting"); return; }
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 9) { setError("Telefon raqamini to'liq kiriting"); return; }
    if (!grade) { setError('Sinfni tanlang'); return; }

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
          name: name.trim(), phone: fullPhone, grade,
          eventId, fbp, fbc,
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Ziyo Yog'dusi" width="120" height="50" />
          </a>
          <a href="#contact" className="zy-btn">Ma'lumot uchun</a>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section id="top" className="zy-hero">
          <div className="zy-container">
            <div className="zy-badge">
              <span className="zy-badge-dot" />
              · Litsenziyaga ega
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

            <a href="#contact" className="zy-btn zy-btn-lg zy-hero-cta">
              Hoziroq ariza topshirish
              <span className="zy-arrow" aria-hidden>→</span>
            </a>

            <div className="zy-stats">
              <div className="zy-stat">
                <div className="zy-stat-value">
                  <CountUp target={800} suffix="+" />
                </div>
                <div className="zy-stat-label">O&apos;quvchilar</div>
              </div>
              <div className="zy-stat">
                <div className="zy-stat-value">
                  <CountUp target={90} suffix="%" />
                </div>
                <div className="zy-stat-label">OTM ga kirish</div>
              </div>
              <div className="zy-stat">
                <div className="zy-stat-value">
                  <CountUp target={10} suffix="+" />
                </div>
                <div className="zy-stat-label">Yillik tajriba</div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="zy-about">
          <div className="zy-container">
            <div className="zy-about-grid">
              <div
                ref={aboutImage.ref}
                className={`zy-about-image zy-reveal zy-reveal-left${aboutImage.revealed ? ' zy-revealed' : ''}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/bino.png" alt="Ziyo Yog'dusi maktabi" />
              </div>

              <div
                ref={aboutContent.ref}
                className={`zy-reveal zy-reveal-right${aboutContent.revealed ? ' zy-revealed' : ''}`}
              >
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
            <div
              ref={formWrap.ref}
              className={`zy-reveal${formWrap.revealed ? ' zy-revealed' : ''}`}
            >
              <div className="zy-section-head">
                <div className="zy-eyebrow">Ma'lumot uchun</div>
                <h2 className="zy-section-title">Ro&apos;yxatdan o&apos;ting</h2>
                <p>Ma&apos;lumotlaringizni qoldiring, biz siz bilan tezda bog&apos;lanamiz</p>
              </div>

              <form onSubmit={onSubmit} className="zy-form-card" noValidate>
                <div className="zy-field">
                  <label htmlFor="name">Ota-ona ismi</label>
                  <input
                    id="name" className="zy-input" type="text" autoComplete="name"
                    value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Ismingizni kiriting"
                    disabled={loading} required minLength={2} maxLength={80}
                  />
                </div>

                <div className="zy-field">
                  <label htmlFor="phone">Telefon raqam</label>
                  <div className="zy-phone-wrap">
                    <span className="zy-phone-prefix">+998</span>
                    <input
                      id="phone" className="zy-input" type="tel"
                      inputMode="numeric" autoComplete="tel"
                      value={phone} onChange={handlePhoneChange}
                      placeholder="99 999 99 99"
                      disabled={loading} required
                    />
                  </div>
                </div>

                <div className="zy-field">
                  <label htmlFor="grade">Farzand sinfi</label>
                  <select
                    id="grade" className="zy-select"
                    value={grade} onChange={(e) => setGrade(e.target.value)}
                    disabled={loading} required
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
                    <>
                      Ma'luotlarni yuborish
                      <span className="zy-arrow" aria-hidden>→</span>
                    </>
                  )}
                </button>

                <p className="zy-form-hint">Ma&apos;lumotlaringiz xavfsiz saqlanadi</p>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="zy-footer">
        <div className="zy-container">
          <div
            ref={footerWrap.ref}
            className={`zy-reveal${footerWrap.revealed ? ' zy-revealed' : ''}`}
          >
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
                <a className="zy-contact-value" href="tel:++998770608877">+998 77 060 88 77</a>
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/oq.png" alt="Ziyo Yog'dusi" width="120" height="50" />
              </div>
              <p className="zy-copyright">
                © {new Date().getFullYear()} Ziyo Yog&apos;dusi maktabi. Barcha huquqlar himoyalangan.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}