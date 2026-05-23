const contactItems = [
  {
    label: 'Manzil',
    value: "Samarqand viloyati, Pastarg'om tumani",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    label: 'Telefon',
    value: '+998 99 999 99 99',
    href: 'tel:+998999999999',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/>
      </svg>
    ),
  },
  {
    label: 'Ish vaqti',
    value: 'Du-Sh: 8:00 - 18:00',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="container-x">
        <div className="text-center mb-8">
          <div className="text-[12px] font-semibold text-brand-200 tracking-wider uppercase mb-2">
            Manzil
          </div>
          <h3 className="text-[20px] sm:text-[24px] font-semibold text-white">
            Bizni toping
          </h3>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {contactItems.map((item) => (
            <div key={item.label} className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-brand-200 mb-1.5">
                {item.icon}
                <span className="text-[13px] font-medium">{item.label}</span>
              </div>
              {item.href ? (
                <a
                  href={item.href}
                  className="text-[14px] text-white hover:text-brand-200 transition-colors"
                >
                  {item.value}
                </a>
              ) : (
                <div className="text-[14px] text-slate-400">{item.value}</div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-7 h-7 bg-brand-800 rounded-md flex items-center justify-center text-white font-semibold text-[11px]">
              ZY
            </div>
            <span className="text-white font-medium text-[14px]">Ziyo Yog&apos;dusi</span>
          </div>
          <p className="text-[12px] text-slate-500">
            © {new Date().getFullYear()} Ziyo Yog&apos;dusi maktabi. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </footer>
  );
}
