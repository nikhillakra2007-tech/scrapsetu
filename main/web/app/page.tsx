import type { Metadata } from 'next';
import LandingPage from '@/components/landing/LandingPage';

export const metadata: Metadata = {
  title: 'ScrapSetu — Bridging Informal Collectors & Authorized Recyclers',
  description:
    'Transparent price discovery, AI-assisted scrap classification, and traceable digital handovers connecting grassroots collectors with CPCB/DPCC authorized recyclers.',
};

export default function Page() {
  return <LandingPage />;
}
