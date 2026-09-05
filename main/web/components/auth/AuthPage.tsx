"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
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
  ArrowUpRight,
  Recycle,
  ChevronRight,
  Truck,
  Building2,
  Shield,
  FileCheck2,
  Cpu,
  Sparkles,
} from "lucide-react";
import styles from "./AuthPage.module.css";
import MaterialFlow from "@/components/material-flow/MaterialFlow";

interface DemoAccount {
  id: string;
  name: string;
  email: string;
  role: "recycler" | "collector" | "admin";
  roleLabel: string;
  roleDescription: string;
  initial: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

// Helper to resolve route by user role
const getRoleDestination = (role?: string) => {
  if (role === "collector") return "/collector";
  if (role === "admin") return "/admin";
  return "/recycler";
};

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<
    "collector" | "recycler" | "admin"
  >("recycler");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasExistingSession, setHasExistingSession] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Pre-configured Pilot Demo Accounts (All 3 Canonical Roles)
  const DEMO_ACCOUNTS: DemoAccount[] = [
    {
      id: "demo-ramesh",
      name: "Ramesh Kumar",
      email: "ramesh.collector@scrapsetu.in",
      role: "collector",
      roleLabel: "Field Collector",
      roleDescription: "Field collection and material intake",
      initial: "R",
      icon: Truck,
    },
    {
      id: "demo-vinayak",
      name: "Vinayak Sharma",
      email: "vinayak.recycler@scrapsetu.in",
      role: "recycler",
      roleLabel: "Authorized Recycler",
      roleDescription: "Facility intake and processing workflow",
      initial: "V",
      icon: Building2,
    },
    {
      id: "demo-admin",
      name: "Priya Verma",
      email: "priya.admin@scrapsetu.in",
      role: "admin",
      roleLabel: "Platform Admin",
      roleDescription: "Network governance and operations",
      initial: "P",
      icon: Shield,
    },
  ];

  // Detect existing Supabase or Demo session
  useEffect(() => {
    let isMounted = true;

    async function checkExistingSession() {
      // 1. Instant local storage check
      try {
        const storedUser =
          typeof window !== "undefined"
            ? localStorage.getItem("scrapsetu_auth_user")
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
            window.location.href = "/recycler";
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
            window.location.href = "/recycler";
          }
        },
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
      "scrapsetu_auth_user",
      JSON.stringify({
        name: account.name,
        email: account.email,
        role: account.role,
      }),
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
      setErrorMessage("Please provide both your email and password.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      // Fast pilot demo path if remote Supabase is unconfigured
      if (!isSupabaseConfigured) {
        const demoUser = {
          name: email.split("@")[0],
          email: email.trim(),
          role: selectedRole,
        };
        localStorage.setItem("scrapsetu_auth_user", JSON.stringify(demoUser));
        setHasExistingSession(true);
        setTimeout(() => {
          window.location.href = getRoleDestination(demoUser.role);
        }, 200);
        return;
      }

      if (authMode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        if (data.session) {
          localStorage.setItem(
            "scrapsetu_auth_user",
            JSON.stringify({
              name: data.session.user.email?.split("@")[0] || "User",
              email: data.session.user.email,
              role: selectedRole,
            }),
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
            "scrapsetu_auth_user",
            JSON.stringify({
              name: data.session.user.email?.split("@")[0] || "User",
              email: data.session.user.email,
              role: selectedRole,
            }),
          );
          setHasExistingSession(true);
          window.location.href = getRoleDestination(selectedRole);
        } else {
          setSuccessMessage(
            "Account created! If confirmation is required, please check your inbox.",
          );
        }
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      const rawMsg = errorObj?.message || "";
      if (rawMsg.toLowerCase().includes("invalid login credentials")) {
        setErrorMessage(
          "Invalid email or password. Please verify or create an account.",
        );
      } else if (rawMsg.toLowerCase().includes("user already registered")) {
        setErrorMessage(
          "An account with this email already exists. Please sign in.",
        );
      } else if (rawMsg.toLowerCase().includes("password should be at least")) {
        setErrorMessage("Password must be at least 6 characters.");
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
      "scrapsetu_auth_user",
      JSON.stringify({
        name: account.name,
        email: account.email,
        role: account.role,
      }),
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
        typeof window !== "undefined" ? window.location.origin : "";
      const redirectUrl = `${redirectOrigin}/auth`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
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
    <div className={styles.screen}>
      <aside className={styles.cover}>
        <Link href="/" className={styles.brand}>
          <Recycle size={28} />
          ScrapSetu<span>®</span>
        </Link>
        <div className={styles.coverCopy}>
          <span className={styles.eyebrow}>WELCOME TO THE CIRCULAR SIDE.</span>
          <h2>
            Good to have
            <br />
            you <em>in the loop.</em>
          </h2>
          <p>
            A little connection can change where a material’s story goes next.
          </p>
        </div>
        <div className={styles.authFlow}>
          <MaterialFlow compact />
        </div>
        <div className={styles.coverFoot}>
          <span>DELHI NCR PILOT</span>
          <span>Every material. A new possibility.</span>
        </div>
      </aside>
      <main className={styles.formPanel}>
        <div className={styles.formShell}>
          <Link href="/" className={styles.back}>
            <ArrowLeft size={15} /> Back to home
          </Link>
          <h1>{authMode === "signin" ? "Welcome back." : "Join the loop."}</h1>
          <p className={styles.subtitle}>
            {authMode === "signin"
              ? "Your next good exchange starts here."
              : "A better connection for your everyday work."}
          </p>
          <div className={styles.tabs}>
            <button
              type="button"
              className={authMode === "signin" ? styles.active : ""}
              onClick={() => setAuthMode("signin")}
            >
              Sign in
            </button>
            <button
              type="button"
              className={authMode === "signup" ? styles.active : ""}
              onClick={() => setAuthMode("signup")}
            >
              Create account
            </button>
          </div>
          {errorMessage && (
            <p role="alert" className={styles.error}>
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p role="status" className={styles.success}>
              {successMessage}
            </p>
          )}
          <button
            type="button"
            className={styles.google}
            disabled={isFormBusy}
            onClick={() => {
              if (!isSupabaseConfigured) {
                setErrorMessage(
                  "Google sign-in is not connected in this local preview. Try a demo workspace below.",
                );
                return;
              }
              handleDirectOAuth();
            }}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 01-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.36z"
              />
              <path
                fill="#34A853"
                d="M12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.81-1.76-5.6-4.12H3.06v2.59A10 10 0 0012 22z"
              />
              <path
                fill="#FBBC05"
                d="M6.4 13.92A6 6 0 016.4 10.08V7.49H3.06a10 10 0 000 9.02z"
              />
              <path
                fill="#EA4335"
                d="M12 5.96c1.47 0 2.79.5 3.82 1.49l2.86-2.87A9.6 9.6 0 0012 2a10 10 0 00-8.94 5.49l3.34 2.59C7.19 7.72 9.4 5.96 12 5.96z"
              />
            </svg>
            {isGoogleLoading ? "Connecting…" : "Continue with Google"}
          </button>
          <div className={styles.demoHeader}>
            <span>Just looking? Try a demo.</span>
            <span>No account needed</span>
          </div>
          <div className={styles.demoGrid}>
            {DEMO_ACCOUNTS.map((a) => (
              <button
                disabled={isFormBusy}
                type="button"
                key={a.id}
                onClick={() => handleQuickPilotLogin(a)}
              >
                <a.icon size={20} />
                <span>
                  {a.role === "collector"
                    ? "Collector"
                    : a.role === "recycler"
                      ? "Recycler"
                      : "Admin"}
                </span>
                <ArrowUpRight size={13} />
              </button>
            ))}
          </div>
          <div className={styles.divider}>
            <span>or continue with email</span>
          </div>
          <form onSubmit={handleEmailAuth}>
            <label htmlFor="auth-email">Email address</label>
            <div className={styles.input}>
              <Mail size={17} />
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isFormBusy}
              />
            </div>
            <label htmlFor="auth-password">Password</label>
            <div className={styles.input}>
              <Lock size={17} />
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                autoComplete={
                  authMode === "signin" ? "current-password" : "new-password"
                }
                required
                minLength={6}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isFormBusy}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            <label htmlFor="auth-role">Your workspace</label>
            <select
              id="auth-role"
              value={selectedRole}
              onChange={(e) =>
                setSelectedRole(
                  e.target.value as "collector" | "recycler" | "admin",
                )
              }
            >
              <option value="collector">Collector</option>
              <option value="recycler">Recycler</option>
              <option value="admin">Admin · pilot preview</option>
            </select>
            <button
              type="submit"
              className={styles.submit}
              disabled={isFormBusy}
            >
              {isLoading
                ? "Opening your workspace…"
                : authMode === "signin"
                  ? "Sign in to your workspace"
                  : "Create account"}
              <ArrowRight size={17} />
            </button>
          </form>
          <p className={styles.note}>Local pilot preview · sample data</p>
        </div>
      </main>
    </div>
  );
}
