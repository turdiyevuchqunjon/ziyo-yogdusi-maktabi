import type { Metadata } from 'next';
import ThanksClient from '@/components/ThanksClient';

export const metadata: Metadata = {
  title: "Rahmat! — Ziyo Yog'dusi",
  description: 'Arizangiz qabul qilindi',
  robots: { index: false, follow: false },
};

export default function ThanksPage() {
  return <ThanksClient />;
}
