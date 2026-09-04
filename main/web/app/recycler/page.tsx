import type { Metadata } from 'next';
import RecyclerWorkspace from '@/components/recycler/RecyclerWorkspace';

export const metadata: Metadata = {
  title: 'Recycler Command Hub — ScrapSetu',
  description: 'Manage incoming matched scrap lots, benchmark rate cards, and digital QR handover verification.',
};

export default function RecyclerPage() {
  return <RecyclerWorkspace />;
}
