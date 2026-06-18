import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export const metadata: Metadata = {
  title: "Ziyo Yog'dusi — Farzandingiz uchun eng yaxshi ta'lim bizda",
  description:
    "2015-yildan beri faoliyat yuritayotgan litsenziyalangan maktab. Zamonaviy metodikalar, malakali o'qituvchilar va 90% OTM ga kirish ko'rsatkichi.",
  keywords: ["maktab", "Samarqand", "Pastarg'om", "ta'lim", "Ziyo Yog'dusi"],
  openGraph: {
    title: "Ziyo Yog'dusi — Eng yaxshi ta'lim makoni",
    description: "10+ yillik tajriba, 800+ o'quvchilar, 90% OTM ga kirish",
    type: 'website',
    locale: 'uz_UZ',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1E40AF',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body>
        {/* Meta Pixel — Standard install */}
        {PIXEL_ID && (
          <>
            <Script id="meta-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${PIXEL_ID}');
                fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                alt=""
                src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
              />
            </noscript>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
