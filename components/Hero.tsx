export default function Hero() {
  return (
    <section id="top" className="bg-white pt-12 pb-16 sm:pt-16 sm:pb-20">
      <div className="container-x text-center">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-800 px-3 py-1.5 rounded-full text-[12px] font-medium mb-5">
          <span className="w-1.5 h-1.5 bg-brand-800 rounded-full" />
          2015-yildan beri · Litsenziyalangan
        </div>

        <h1 className="text-[28px] sm:text-[40px] lg:text-[48px] font-semibold text-slate-900 leading-[1.15] mb-5 tracking-tight">
          Farzandingiz uchun eng yaxshi
          <br className="hidden sm:block" />{' '}
          <span className="text-brand-800">ta&apos;lim makoni</span>
        </h1>

        <p className="text-[15px] sm:text-[17px] text-slate-600 max-w-xl mx-auto mb-8 leading-relaxed">
          Zamonaviy metodikalar, malakali o&apos;qituvchilar va shaxsiy yondashuv bilan
          har bir bolaning iqtidorini ochib beramiz.
        </p>

        <a href="#contact" className="btn-primary-lg">
          Hoziroq ariza topshirish
          <span aria-hidden>→</span>
        </a>

        <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-12 max-w-2xl mx-auto">
          <Stat value="800+" label="O'quvchilar" />
          <Stat value="90%" label="OTM ga kirish" />
          <Stat value="10+" label="Yillik tajriba" />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 sm:p-5">
      <div className="text-[24px] sm:text-[32px] font-semibold text-brand-800 leading-none">
        {value}
      </div>
      <div className="text-[12px] sm:text-[13px] text-slate-600 mt-1.5">{label}</div>
    </div>
  );
}
