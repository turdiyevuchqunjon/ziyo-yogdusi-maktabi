import Image from 'next/image';

const features = [
  { title: 'Litsenziyalangan', desc: 'Davlat standartlariga mos' },
  { title: 'Malakali kadrlar', desc: 'Tajribali ustozlar jamoasi' },
  { title: 'Zamonaviy bino', desc: "Qulay o'quv muhiti" },
  { title: 'Olimpiada g\'oliblari', desc: 'Respublika miqyosida' },
];

export default function About() {
  return (
    <section id="about" className="bg-slate-50 py-16 sm:py-20 border-y border-slate-100">
      <div className="container-x">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-100 shadow-sm border border-slate-200">
              <Image
                src="/school.jpg"
                alt="Ziyo Yog'dusi maktabi"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority={false}
              />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="text-[12px] font-semibold text-brand-800 tracking-wider uppercase mb-3">
              Biz haqimizda
            </div>
            <h2 className="text-[24px] sm:text-[32px] font-semibold text-slate-900 leading-tight mb-4 tracking-tight">
              10 yillik tajriba va yutuqlar
            </h2>
            <p className="text-[15px] text-slate-600 leading-relaxed mb-6">
              Ziyo Yog&apos;dusi maktabi 2015-yildan beri faoliyat yuritib, mingdan ortiq
              o&apos;quvchilarga sifatli ta&apos;lim bermoqda va yorqin kelajakka yo&apos;l
              ochib beradi.
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="flex items-start gap-3 bg-white border border-slate-100 rounded-lg p-3"
                >
                  <div className="w-5 h-5 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="text-brand-800"
                    >
                      <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-slate-900">{f.title}</div>
                    <div className="text-[12px] text-slate-500 mt-0.5">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
