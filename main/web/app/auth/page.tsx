import type { Metadata } from 'next';
import AuthPage from '@/components/auth/AuthPage';

export const metadata: Metadata = {
  title: 'Sign In — SmartScrapSetu',
  description:
    'Sign in or create a free SmartScrapSetu account with Google to access Delhi’s unified e-waste and recycler network.',
};

export default function Page() {
  return <AuthPage />;
}
