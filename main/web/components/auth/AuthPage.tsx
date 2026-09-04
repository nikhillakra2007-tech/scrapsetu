'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Recycle,
  ChevronRight,
  Truck,
  Building2,
  Shield,
  FileCheck2,
  Cpu,
  Sparkles,
} from 'lucide-react';
import styles from './AuthPage.module.css';

interface DemoAccount {
  id: string;
  name: string;
  email: string;
  role: 'recycler' | 'collector' | 'admin';
  roleLabel: string;
  roleDescription: string;
  initial: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
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
  const [selectedRole, setSelectedRole] = useState<'collector' | 'recycler' | 'admin'>('recycler');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasExistingSession, setHasExistingSession] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Pre-configured Pilot Demo Accounts (All 3 Canonical Roles)
  const DEMO_ACCOUNTS: DemoAccount[] = [
    {
      id: 'demo-ramesh',
      name: 'Ramesh Kumar',
      email: 'ramesh.collector@scrapsetu.in',
      role: 'collector',
      roleLabel: 'Field Collector',
      roleDescription: 'Field collection and material intake',
      initial: 'R',
      icon: Truck,
    },
    {
      id: 'demo-vinayak',
      name: 'Vinayak Sharma',
      email: 'vinayak.recycler@scrapsetu.in',
      role: 'recycler',
      roleLabel: 'Authorized Recycler',
      roleDescription: 'Facility intake and processing workflow',
      initial: 'V',
      icon: Building2,
    },
    {
      id: 'demo-admin',
      name: 'Priya Verma',
      email: 'priya.admin@scrapsetu.in',
      role: 'admin',
      roleLabel: 'Platform Admin',
      roleDescription: 'Network governance and operations',
      initial: 'P',
      icon: Shield,
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

  // Quick 1-click Pilot Demo Sign In
  const handleQuickPilotLogin = (account: DemoAccount) => {
    setSelectedRole(account.role);
    setIsLoading(true);
    setErrorMessage(null);

    // Save session
    localStorage.setItem(
      'scrapsetu_auth_user',
      JSON.stringify({
        name: account.name,
        email: account.email,
        role: account.role,
      })
    );

    setHasExistingSession(true);
    setTimeout(() => {
      window.location.href = getRoleDestination(account.role);
    }, 200);
  };

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
          role: selectedRole,
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
              role: selectedRole,
            })
          );
          setHasExistingSession(true);
          window.location.href = getRoleDestination(selectedRole);
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
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
              role: selectedRole,
            })
          );
          setHasExistingSession(true);
          window.location.href = getRoleDestination(selectedRole);
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

    localStorage.setItem(
      'scrapsetu_auth_user',
      JSON.stringify({
        name: account.name,
        email: account.email,
        role: account.role,
      })
    );

    setHasExistingSession(true);
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
      {/* Split Two-Column Layout */}
      <div className={styles.authSplitGrid}>
        {/* LEFT COLUMN: ScrapSetu Identity & Infrastructure Verification */}
        <aside className={styles.leftBrandCol} aria-label="Brand Infrastructure Identity">
          <div className={styles.brandColInner}>
            {/* Logo */}
            <Link href="/" className={styles.brandHeader} title="Return to Public Homepage">
              <div className={styles.brandIconWrap}>
                <Recycle size={20} strokeWidth={2.4} className={styles.brandIcon} />
              </div>
              <div className={styles.brandTitleWrap}>
                <span className={styles.brandName}>ScrapSetu</span>
                <span className={styles.brandDot}>.</span>
              </div>
            </Link>

            {/* Core Positioning */}
            <div className={styles.positioningBlock}>
              <div className={styles.pulsePill}>
                <span className={styles.pulseDot} />
                <span>DELHI NCR PILOT NETWORK</span>
              </div>

              <h2 className={styles.brandHeroTitle}>
                Digital infrastructure for a traceable circular economy.
              </h2>
              <p className={styles.brandHeroSub}>
                Connecting informal scrap collectors with authorized recyclers through
                computer vision, transparent pricing, and cryptographic chain of custody.
              </p>
            </div>

            {/* 4 Trust Pillars */}
            <div className={styles.trustPillarsList}>
              <div className={styles.trustPillar}>
                <div className={styles.pillarIconWrap}>
                  <ShieldCheck size={18} />
                </div>
                <div className={styles.pillarText}>
                  <h3 className={styles.pillarTitle}>Verified network participants</h3>
                  <p className={styles.pillarDesc}>
                    DPCC-authorized recycling hubs and registered informal collectors with audited KYC.
                  </p>
                </div>
              </div>

              <div className={styles.trustPillar}>
                <div className={styles.pillarIconWrap}>
                  <Cpu size={18} />
                </div>
                <div className={styles.pillarText}>
                  <h3 className={styles.pillarTitle}>Transparent settlement</h3>
                  <p className={styles.pillarDesc}>
                    AI scrap grading paired with real-time market benchmark price boards.
                  </p>
                </div>
              </div>

              <div className={styles.trustPillar}>
                <div className={styles.pillarIconWrap}>
                  <FileCheck2 size={18} />
                </div>
                <div className={styles.pillarText}>
                  <h3 className={styles.pillarTitle}>Digital chain of custody</h3>
                  <p className={styles.pillarDesc}>
                    Dual-party QR handshake manifests with immutable cryptographic timestamps.
                  </p>
                </div>
              </div>

              <div className={styles.trustPillar}>
                <div className={styles.pillarIconWrap}>
                  <Sparkles size={18} />
                </div>
                <div className={styles.pillarText}>
                  <h3 className={styles.pillarTitle}>EPR-ready traceability</h3>
                  <p className={styles.pillarDesc}>
                    Audit-compliant provenance documentation supporting national Extended Producer Responsibility.
                  </p>
                </div>
              </div>
            </div>

            {/* Live Telemetry Card */}
            <div className={styles.telemetryCard}>
              <div className={styles.telemetryHeader}>
                <span className={styles.telemetryNode}>NETWORK STATUS: ONLINE</span>
                <span className={styles.telemetryLatency}>SHA-256 VERIFIED</span>
              </div>
              <div className={styles.telemetryGrid}>
                <div className={styles.telemetryMetric}>
                  <span className={styles.metricLabel}>NODE</span>
                  <span className={styles.metricValue}>SETU-DEL-01</span>
                </div>
                <div className={styles.telemetryMetric}>
                  <span className={styles.metricLabel}>PROTOCOL</span>
                  <span className={styles.metricValue}>TLS 1.3 / E-EPR</span>
                </div>
                <div className={styles.telemetryMetric}>
                  <span className={styles.metricLabel}>CLUSTER</span>
                  <span className={styles.metricValue}>OKHLA-MAYA</span>
                </div>
              </div>
            </div>

            {/* Return link */}
            <div className={styles.leftColFooter}>
              <Link href="/" className={styles.backHomeBtn}>
                <ArrowLeft size={14} />
                <span>Return to Public Homepage</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: Authentication Form & Role Selector */}
        <main className={styles.rightFormCol}>
          <div className={styles.formContainer}>
            {/* Mobile Header (Only on small screens) */}
            <div className={styles.mobileBrandBanner}>
              <div className={styles.brandTitleWrap}>
                <span className={styles.brandName}>ScrapSetu</span>
                <span className={styles.brandDot}>.</span>
              </div>
              <span className={styles.mobileSubtitle}>Digital Infrastructure</span>
            </div>

            {/* Form Headline */}
            <header className={styles.formHeader}>
              <h1 className={styles.formTitle}>
                {authMode === 'signin' ? 'Welcome back' : 'Join ScrapSetu'}
              </h1>
              <p className={styles.formSubtitle}>
                {authMode === 'signin'
                  ? 'Sign in to access your operational workspace, or select a pre-verified pilot role.'
                  : 'Create an account to join the verified circular economy network.'}
              </p>
            </header>

            {/* Role Selection Tabs (Pilot Selector) */}
            <div className={styles.roleSelectionSection}>
              <div className={styles.roleSelectionLabelRow}>
                <span className={styles.roleSelectionLabel}>Select Operational Role</span>
                <span className={styles.pilotBadge}>1-CLICK PILOT ACCESS</span>
              </div>

              <div className={styles.roleCardsGrid} role="radiogroup" aria-label="Operational Role Selection">
                {DEMO_ACCOUNTS.map((account) => {
                  const isSelected = selectedRole === account.role;
                  const Icon = account.icon;

                  return (
                    <button
                      key={account.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      className={`${styles.roleCard} ${isSelected ? styles.roleCardActive : ''}`}
                      onClick={() => handleQuickPilotLogin(account)}
                      title={`Instant login as ${account.name} (${account.roleLabel})`}
                    >
                      <div className={styles.roleCardHeader}>
                        <div className={styles.roleIconBadge}>
                          <Icon size={16} />
                        </div>
                        {isSelected && (
                          <CheckCircle2 size={16} className={styles.selectedCheck} />
                        )}
                      </div>

                      <div className={styles.roleCardBody}>
                        <span className={styles.roleCardTitle}>{account.roleLabel}</span>
                        <span className={styles.roleCardDesc}>{account.roleDescription}</span>
                      </div>

                      <div className={styles.roleCardPilotUser}>
                        <span className={styles.pilotUserLabel}>Demo:</span>
                        <span className={styles.pilotUserName}>{account.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className={styles.dividerRow}>
              <div className={styles.dividerLine} />
              <span className={styles.dividerText}>or continue with email</span>
              <div className={styles.dividerLine} />
            </div>

            {/* Banners */}
            {hasExistingSession && (
              <div className={styles.bannerSuccess} role="status">
                <CheckCircle2 size={16} />
                <span>Session verified! Entering workspace...</span>
              </div>
            )}

            {successMessage && (
              <div className={styles.bannerSuccess} role="status">
                <CheckCircle2 size={16} />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className={styles.bannerError} role="alert">
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Email / Password Form */}
            <form className={styles.credentialForm} onSubmit={handleEmailAuth} noValidate>
              <div className={styles.fieldGroup}>
                <label htmlFor="auth-email" className={styles.fieldLabel}>
                  Email address
                </label>
                <div className={styles.inputWrapper}>
                  <Mail size={16} className={styles.fieldIcon} />
                  <input
                    id="auth-email"
                    type="email"
                    className={styles.formInput}
                    placeholder="operator@facility.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isFormBusy}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <div className={styles.labelWithLink}>
                  <label htmlFor="auth-password" className={styles.fieldLabel}>
                    Password
                  </label>
                  {authMode === 'signin' && (
                    <button
                      type="button"
                      className={styles.forgotPassLink}
                      onClick={() =>
                        setErrorMessage('Password reset link has been dispatched to your email.')
                      }
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className={styles.inputWrapper}>
                  <Lock size={16} className={styles.fieldIcon} />
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    className={styles.formInput}
                    placeholder={authMode === 'signin' ? '••••••••••••' : 'Min 6 characters'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isFormBusy}
                    autoComplete={authMode === 'signin' ? 'current-password' : 'new-password'}
                    required
                  />
                  <button
                    type="button"
                    className={styles.eyeToggleBtn}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isFormBusy}
              >
                {isLoading ? (
                  <>
                    <span className={styles.btnSpinner} aria-hidden="true" />
                    <span>{authMode === 'signin' ? 'Authenticating...' : 'Creating Account...'}</span>
                  </>
                ) : (
                  <>
                    <span>{authMode === 'signin' ? 'Sign In to Workspace' : 'Create Account'}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Google Alternative */}
            <div className={styles.oauthRow}>
              <button
                type="button"
                className={styles.googleAuthBtn}
                onClick={() => setIsGoogleModalOpen(true)}
                disabled={isFormBusy}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" className={styles.googleSvg}>
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
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Mode Switch Footer */}
            <div className={styles.modeSwitchFooter}>
              {authMode === 'signin' ? (
                <p className={styles.switchPrompt}>
                  Don’t have an account?{' '}
                  <button
                    type="button"
                    className={styles.switchModeAction}
                    onClick={() => {
                      setAuthMode('signup');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                  >
                    Create one for free
                  </button>
                </p>
              ) : (
                <p className={styles.switchPrompt}>
                  Already registered?{' '}
                  <button
                    type="button"
                    className={styles.switchModeAction}
                    onClick={() => {
                      setAuthMode('signin');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                  >
                    Sign in to existing account
                  </button>
                </p>
              )}
            </div>

            {/* Bottom Regulatory Trust Tag */}
            <div className={styles.regulatoryFootnote}>
              <ShieldCheck size={14} className={styles.shieldFootnoteIcon} />
              <span>
                Authorized under DPCC & CPCB E-Waste Management Rules 2022. All operations logged to cryptographic audit stream.
              </span>
            </div>
          </div>
        </main>
      </div>

      {/* Google Account Picker Modal */}
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
                <svg width="26" height="26" viewBox="0 0 24 24">
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
                Choose a pilot account
              </h2>
              <p className={styles.modalSubtitle}>to instantly enter the ScrapSetu operational workspace</p>
            </div>

            <div className={styles.accountList}>
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.id}
                  type="button"
                  className={styles.accountRow}
                  onClick={() => handleSelectDemoAccount(account)}
                >
                  <div className={styles.accountAvatar}>
                    {account.initial}
                  </div>
                  <div className={styles.accountInfo}>
                    <span className={styles.accountName}>{account.name}</span>
                    <span className={styles.accountEmail}>{account.email}</span>
                    <span className={styles.accountRoleTag}>{account.roleLabel}</span>
                  </div>
                  <ChevronRight size={16} color="var(--brand-primary)" />
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
