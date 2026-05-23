'use client';

import { useEffect, useState } from 'react';

const REDIRECT_SECONDS = 10;
const CHANNEL_URL =
  process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL || 'https://t.me/ziyo_yogdusi';

export default function ThanksClient() {
  const [seconds, setSeconds] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    if (seconds <= 0) {
      window.location.href = CHANNEL_URL;
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const progress = ((REDIRECT_SECONDS - seconds) / REDIRECT_SECONDS) * 100;

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-brand-800"
            aria-hidden
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="text-[28px] sm:text-[32px] font-semibold text-slate-900 mb-3 tracking-tight">
          Arizangiz qabul qilindi!
        </h1>
        <p className="text-[15px] text-slate-600 leading-relaxed mb-8">
          Rahmat! Tez orada siz bilan bog&apos;lanamiz.
          <br />
          Yangiliklardan xabardor bo&apos;lish uchun bizning Telegram kanalimizga qo&apos;shiling.
        </p>

        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-6">
          <p className="text-[13px] text-slate-500 mb-3">
            Telegram kanalga yo&apos;naltirilmoqda...
          </p>

          <div className="text-[40px] font-semibold text-brand-800 leading-none mb-4 tabular-nums">
            {seconds}
          </div>

          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-800 transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <a
          href={CHANNEL_URL}
          className="btn-primary w-full"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M21.05 2.95a2.04 2.04 0 0 0-2.07-.34L2.79 9.04a1.55 1.55 0 0 0 .12 2.92l3.84 1.21 1.5 4.83a1.04 1.04 0 0 0 1.72.4l2.16-2.13 4.16 3.04a1.55 1.55 0 0 0 2.42-.92l3.7-13.66a2.04 2.04 0 0 0-1.36-2.78ZM9.6 14.4l-.5 3.4 5.7-9.8-7.5 5.4 2.3 1Z" />
          </svg>
          Telegram kanalga o&apos;tish
        </a>

        <a
          href="/"
          className="inline-block mt-4 text-[13px] text-slate-500 hover:text-slate-700 underline underline-offset-2"
        >
          Bosh sahifaga qaytish
        </a>
      </div>
    </main>
  );
}
