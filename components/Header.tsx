'use client';

import { useEffect, useState } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur transition-shadow ${
        scrolled ? 'shadow-sm border-b border-slate-200' : 'border-b border-transparent'
      }`}
    >
      <div className="container-x flex items-center justify-between h-16">
        <a href="#top" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-brand-800 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-sm">
            ZY
          </div>
          <span className="font-semibold text-[15px] text-slate-900 hidden sm:inline">
            Ziyo Yog&apos;dusi
          </span>
        </a>
        <a
          href="#contact"
          className="bg-brand-800 hover:bg-brand-900 text-white text-[13px] font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          Ariza topshirish
        </a>
      </div>
    </header>
  );
}
