import type { Metadata } from 'next';
import CollectorWorkspace from '@/components/collector/CollectorWorkspace';

export const metadata: Metadata = {
  title: 'Collector Portal — ScrapSetu',
  description: 'AI Scrap Scanner, Live Price Board, and Safety Guidance for Grassroots Collectors.',
};

export default function CollectorPage() {
  return <CollectorWorkspace />;
}
