import type { Metadata } from 'next';
import AuthPage from '@/components/auth/AuthPage';

export const metadata: Metadata = {
  title: 'Sign In — ScrapSetu',
  description:
    'Sign in or create a free ScrapSetu account with Google to access Delhi’s unified e-waste and recycler network.',
};

export default function Page() {
  return <AuthPage />;
}
