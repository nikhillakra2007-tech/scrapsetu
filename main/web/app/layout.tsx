import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kabadiwala Connect (ScrapSetu) — Delhi Pilot',
  description:
    'Bridging informal e-waste collectors with DPCC/CPCB authorized recyclers through transparent price discovery and traceable digital handovers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="ambient-glow" />
        {children}
      </body>
    </html>
  );
}
