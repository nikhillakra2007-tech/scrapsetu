import type { Metadata } from 'next';
import AdminWorkspace from '@/components/admin/AdminWorkspace';

export const metadata: Metadata = {
  title: 'Platform Admin — SmartScrapSetu',
  description: 'SmartScrapSetu Platform Administration & Verification Console.',
};

export default function AdminPage() {
  return <AdminWorkspace />;
}
