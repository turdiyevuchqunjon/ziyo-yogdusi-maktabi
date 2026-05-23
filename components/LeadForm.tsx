'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent, ChangeEvent } from 'react';
import { fbqTrack, getFbCookies, generateEventId } from '@/lib/meta-pixel';

const GRADES = [
  '1-sinf',
  '2-sinf',
  '3-sinf',
  '4-sinf',
  '5-sinf',
  '6-sinf',
  '7-sinf',
  '8-sinf',
  '9-sinf',
  '10-sinf',
  '11-sinf',
];

// Telefon formatlash: 99 999 99 99
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

export default function LeadForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [grade, setGrade] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validatsiya
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

    // 1. Meta Pixel — client-side Lead event (CAPI bilan dedup eventID orqali)
    fbqTrack(
      'Lead',
      {
        content_name: 'School Application',
        content_category: 'Education',
        currency: 'UZS',
      },
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
          sourceUrl: typeof window !== 'undefined' ? window.location.href : undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || 'Xato yuz berdi. Iltimos, qaytadan urinib ko‘ring.');
        setLoading(false);
        return;
      }

      // Muvaffaqiyat — thanks pagega
      router.push('/thanks');
    } catch {
      setError("Tarmoqda xato. Internetni tekshirib, qaytadan urinib ko'ring.");
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="bg-white py-16 sm:py-20">
      <div className="container-x">
        <div className="text-center mb-8">
          <div className="text-[12px] font-semibold text-brand-800 tracking-wider uppercase mb-3">
            Ariza
          </div>
          <h2 className="text-[24px] sm:text-[32px] font-semibold text-slate-900 leading-tight mb-3 tracking-tight">
            Ro&apos;yxatdan o&apos;ting
          </h2>
          <p className="text-[15px] text-slate-600">
            Ma&apos;lumotlaringizni qoldiring, biz siz bilan tezda bog&apos;lanamiz
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="max-w-md mx-auto bg-slate-50 border border-slate-100 rounded-2xl p-6 sm:p-8"
          noValidate
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="label-field">
                Ota-ona ismi
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ismingizni kiriting"
                className="input-field"
                disabled={loading}
                required
                minLength={2}
                maxLength={80}
              />
            </div>

            <div>
              <label htmlFor="phone" className="label-field">
                Telefon raqam
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-[14px] pointer-events-none">
                  +998
                </span>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="99 999 99 99"
                  className="input-field pl-[58px]"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="grade" className="label-field">
                Farzand sinfi
              </label>
              <select
                id="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="input-field appearance-none bg-white pr-10 cursor-pointer"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 14px center',
                }}
                disabled={loading}
                required
              >
                <option value="">Sinfni tanlang</option>
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2"
            >
              {loading ? (
                <>
                  <Spinner /> Yuborilmoqda...
                </>
              ) : (
                'Arizani yuborish'
              )}
            </button>

            <p className="text-[11px] text-slate-500 text-center mt-1">
              Ma&apos;lumotlaringiz xavfsiz saqlanadi
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-white"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path
        d="M4 12a8 8 0 0 1 8-8"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
