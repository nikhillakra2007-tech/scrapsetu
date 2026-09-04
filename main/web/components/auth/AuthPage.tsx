'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  ShieldCheck,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Recycle,
  ChevronRight,
} from 'lucide-react';
import styles from './AuthPage.module.css';

interface DemoAccount {
  id: string;
  name: string;
  email: string;
  role: 'recycler' | 'collector' | 'admin';
  roleLabel: string;
  initial: string;
  avatarClass: string;
}

// Helper to resolve route by user role
const getRoleDestination = (role?: string) => {
  if (role === 'collector') return '/collector';
  if (role === 'admin') return '/admin';
  return '/recycler';
};

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasExistingSession, setHasExistingSession] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Pre-configured Pilot Demo Accounts (All 3 Canonical Roles)
  const DEMO_ACCOUNTS: DemoAccount[] = [
    {
      id: 'demo-vinayak',
      name: 'Vinayak Sharma',
      email: 'vinayak.recycler@scrapsetu.in',
      role: 'recycler',
      roleLabel: 'Verified Recycler Partner',
      initial: 'V',
      avatarClass: styles.avatarVinayak,
    },
    {
      id: 'demo-ramesh',
      name: 'Ramesh Kumar',
      email: 'ramesh.collector@scrapsetu.in',
      role: 'collector',
      roleLabel: 'Authorized Field Collector',
      initial: 'R',
      avatarClass: styles.avatarRamesh,
    },
    {
      id: 'demo-admin',
      name: 'Priya Verma',
      email: 'priya.admin@scrapsetu.in',
      role: 'admin',
      roleLabel: 'DPCC Platform Administrator',
      initial: 'P',
      avatarClass: styles.avatarVinayak,
    },
  ];

  // Detect existing Supabase or Demo session
  useEffect(() => {
    let isMounted = true;

    async function checkExistingSession() {
      // 1. Instant local storage check
      try {
        const storedUser = typeof window !== 'undefined'
          ? localStorage.getItem('scrapsetu_auth_user')
          : null;

        if (storedUser && isMounted) {
          setHasExistingSession(true);
          const parsed = JSON.parse(storedUser);
          const target = getRoleDestination(parsed?.role);
          window.location.href = target;
          return;
        }
      } catch (e) {
        // Ignore parse error
      }

      // 2. Only check remote Supabase session if valid credentials exist
      if (isSupabaseConfigured) {
        try {
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();
          if (error) throw error;

          if (session && isMounted) {
            setHasExistingSession(true);
            window.location.href = '/recycler';
            return;
          }
        } catch (err) {
          // Silent catch for initial check
        }
      }
    }

    checkExistingSession();

    // Only subscribe to remote auth events if configured
    if (isSupabaseConfigured) {
      const { data: authSubscription } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (session && isMounted) {
            setHasExistingSession(true);
            window.location.href = '/recycler';
          }
        }
      );

      return () => {
        isMounted = false;
        authSubscription?.subscription?.unsubscribe();
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Email + Password Authentication
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isGoogleLoading) return;

    if (!email.trim() || !password) {
      setErrorMessage('Please provide both your email and password.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      // Fast pilot demo path if remote Supabase is unconfigured
      if (!isSupabaseConfigured) {
        const demoUser = {
          name: email.split('@')[0],
          email: email.trim(),
          role: 'recycler' as const,
        };
        localStorage.setItem('scrapsetu_auth_user', JSON.stringify(demoUser));
        setHasExistingSession(true);
        setTimeout(() => {
          window.location.href = getRoleDestination(demoUser.role);
        }, 200);
        return;
      }

      if (authMode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        if (data.session) {
          localStorage.setItem(
            'scrapsetu_auth_user',
            JSON.stringify({
              name: data.session.user.email?.split('@')[0] || 'User',
              email: data.session.user.email,
              role: 'recycler',
            })
          );
          setHasExistingSession(true);
          window.location.href = '/recycler';
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        if (data.session) {
          setHasExistingSession(true);
          window.location.href = '/recycler';
        } else {
          setSuccessMessage(
            'Account created! If confirmation is required, please check your inbox.'
          );
        }
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      const rawMsg = errorObj?.message || '';
      if (rawMsg.toLowerCase().includes('invalid login credentials')) {
        setErrorMessage('Invalid email or password. Please verify or create an account.');
      } else if (rawMsg.toLowerCase().includes('user already registered')) {
        setErrorMessage('An account with this email already exists. Please sign in.');
      } else if (rawMsg.toLowerCase().includes('password should be at least')) {
        setErrorMessage('Password must be at least 6 characters.');
      } else {
        setErrorMessage(rawMsg || "We couldn't sign you in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Select Demo Google Account (Instant, Zero Buffering)
  const handleSelectDemoAccount = (account: DemoAccount) => {
    setIsGoogleModalOpen(false);
    setIsGoogleLoading(true);
    setErrorMessage(null);

    // Store authenticated demo session
    localStorage.setItem(
      'scrapsetu_auth_user',
      JSON.stringify({
        name: account.name,
        email: account.email,
        role: account.role,
      })
    );

    setHasExistingSession(true);
    // Instant redirect to the designated workspace
    setTimeout(() => {
      window.location.href = getRoleDestination(account.role);
    }, 200);
  };

  // Direct Supabase Google OAuth sign in
  const handleDirectOAuth = async () => {
    setIsGoogleModalOpen(false);
    if (isLoading || isGoogleLoading) return;

    try {
      setIsGoogleLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const redirectOrigin =
        typeof window !== 'undefined' ? window.location.origin : '';
      const redirectUrl = `${redirectOrigin}/auth`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (err) {
      setIsGoogleLoading(false);
      setErrorMessage("We couldn't connect to Google. Please try again.");
    }
  };

  const isFormBusy = isLoading || isGoogleLoading || hasExistingSession;

  return (
    <div className={styles.authContainer}>
      {/* Smooth Lighter Mint Green Ambient Aura */}
      <div className={styles.refractionBackdrop} aria-hidden="true">
        <div className={styles.cardAuraGlow} />
      </div>

      {/* Entire Section Drops & Bounces with Soothing Clean Bounce */}
      <div className={styles.authWrapper}>
        <div className={styles.dropElementWrapper} aria-hidden="true">
          <div
            className={styles.recyclableToken}
            title="ScrapSetu Circular Recyclable Token"
          >
            <div className={styles.tokenRimGlow} />
            <Recycle
              className={styles.recycleSymbolSvg}
              strokeWidth={2.4}
            />
          </div>
        </div>

        {/* Compact Authentication Card */}
        <div className={styles.authCard}>
          <header className={styles.brandHeader}>
            <h1 className={styles.logoTitle}>
              ScrapSetu<span className={styles.brandDot}>.</span>
            </h1>
            <p className={styles.tagline}>
              {authMode === 'signin'
                ? 'Sign in to access your recycling workspace'
                : 'Create your free account to join the network'}
            </p>
          </header>

          {/* Session Banner */}
          {hasExistingSession && (
            <div className={styles.sessionBanner} role="status" aria-live="polite">
              <CheckCircle size={15} />
              <span>Signed in! Entering workspace...</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className={styles.successBanner} role="status" aria-live="polite">
              <CheckCircle size={15} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className={styles.errorBanner} role="alert" aria-live="assertive">
              <AlertCircle size={15} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Direct Email & Password Form */}
          <form className={styles.authForm} onSubmit={handleEmailAuth} noValidate>
            <div className={styles.inputGroup}>
              <label htmlFor="auth-email" className={styles.inputLabel}>
                Email address
              </label>
              <div className={styles.inputWrapper}>
                <Mail size={15} className={styles.inputIcon} />
                <input
                  id="auth-email"
                  type="email"
                  className={styles.textInput}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isFormBusy}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="auth-password" className={styles.inputLabel}>
                Password
              </label>
              <div className={styles.inputWrapper}>
                <Lock size={15} className={styles.inputIcon} />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  className={styles.textInput}
                  placeholder={authMode === 'signin' ? 'Enter password' : 'Min 6 characters'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isFormBusy}
                  autoComplete={authMode === 'signin' ? 'current-password' : 'new-password'}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggleBtn}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={styles.primarySubmitBtn}
              disabled={isFormBusy}
            >
              {isLoading ? (
                <>
                  <span className={styles.btnSpinnerLight} aria-hidden="true" />
                  <span>{authMode === 'signin' ? 'Signing In...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  <span>{authMode === 'signin' ? 'Sign In' : 'Create Free Account'}</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className={styles.dividerContainer}>
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>or</span>
            <div className={styles.dividerLine} />
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            className={styles.googleBtn}
            onClick={() => setIsGoogleModalOpen(true)}
            disabled={isFormBusy}
            aria-label="Continue with Google"
            aria-busy={isGoogleLoading}
          >
            {isGoogleLoading ? (
              <>
                <span className={styles.btnSpinner} aria-hidden="true" />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <span className={styles.googleIconWrapper} aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.25 21.32 7.31 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.58H1.26C.46 8.18 0 9.98 0 12s.46 3.82 1.26 5.42l4.02-3.13z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.68 1.26 6.58l4.02 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
                    />
                  </svg>
                </span>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Mode Switch Footer */}
          <footer className={styles.authFooter}>
            {authMode === 'signin' ? (
              <button
                type="button"
                className={styles.toggleModeBtn}
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
              >
                Don’t have an account?{' '}
                <span className={styles.toggleAccent}>Create one for free</span>
              </button>
            ) : (
              <button
                type="button"
                className={styles.toggleModeBtn}
                onClick={() => {
                  setAuthMode('signin');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
              >
                Already have an account?{' '}
                <span className={styles.toggleAccent}>Sign in</span>
              </button>
            )}
          </footer>
        </div>

        {/* Verification & Trust Indicators */}
        <div className={styles.trustBar}>
          <div className={styles.trustItem}>
            <ShieldCheck size={13} className={styles.trustIcon} />
            <span>DPCC Authorized</span>
          </div>
          <div className={styles.trustItem}>
            <CheckCircle size={13} className={styles.trustIcon} />
            <span>CPCB Certified</span>
          </div>
        </div>

        {/* Return to home link */}
        <Link href="/" className={styles.homeLink}>
          <ArrowLeft size={13} />
          <span>Return to ScrapSetu</span>
        </Link>
      </div>

      {/* Google Demo Account Picker Modal */}
      {isGoogleModalOpen && (
        <div
          className={styles.modalBackdrop}
          role="dialog"
          aria-modal="true"
          aria-labelledby="google-modal-title"
          onClick={() => setIsGoogleModalOpen(false)}
        >
          <div
            className={styles.accountModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.googleLogoBadge}>
                <svg width="28" height="28" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.25 21.32 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.58H1.26C.46 8.18 0 9.98 0 12s.46 3.82 1.26 5.42l4.02-3.13z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.68 1.26 6.58l4.02 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
                  />
                </svg>
              </div>
              <h2 id="google-modal-title" className={styles.modalTitle}>
                Choose an account
              </h2>
              <p className={styles.modalSubtitle}>to continue to ScrapSetu</p>
            </div>

            <div className={styles.accountList}>
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.id}
                  type="button"
                  className={styles.accountRow}
                  onClick={() => handleSelectDemoAccount(account)}
                >
                  <div className={`${styles.accountAvatar} ${account.avatarClass}`}>
                    {account.initial}
                  </div>
                  <div className={styles.accountInfo}>
                    <span className={styles.accountName}>{account.name}</span>
                    <span className={styles.accountEmail}>{account.email}</span>
                    <span className={styles.accountRoleTag}>{account.roleLabel}</span>
                  </div>
                  <ChevronRight size={16} color="#85D699" />
                </button>
              ))}
            </div>

            <div className={styles.modalFooterActions}>
              <button
                type="button"
                className={styles.directOauthBtn}
                onClick={handleDirectOAuth}
              >
                Use another Google Account
              </button>
              <button
                type="button"
                className={styles.cancelModalBtn}
                onClick={() => setIsGoogleModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
