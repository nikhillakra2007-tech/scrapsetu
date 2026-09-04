'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  LayoutDashboard,
  Inbox,
  ShieldCheck,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Truck,
  CheckCircle2,
  LogOut,
} from 'lucide-react';
import styles from './Header.module.css';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  matchedCount?: number;
  pickupCount?: number;
  activeRole: 'recycler' | 'collector';
  onToggleRole: () => void;
  currentUser?: { name: string; email?: string; role?: 'recycler' | 'collector' | 'admin' } | null;
  onSignOut?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  isAi?: boolean;
  count?: number;
}

export default function Header({
  currentTab,
  onSelectTab,
  matchedCount = 0,
  pickupCount = 0,
  activeRole,
  currentUser,
  onSignOut,
}: HeaderProps) {
  // Segregated Feature Sets per Role (PRD Architecture)
  const recyclerNavItems: NavItem[] = [
    { id: 'recycler-overview', label: 'Command Hub', icon: LayoutDashboard },
    { id: 'matched-lots', label: 'Incoming Lots', icon: Inbox, count: matchedCount },
    { id: 'handover', label: 'Handover & QR', icon: ShieldCheck },
    { id: 'rate-cards', label: 'Rate Cards', icon: CreditCard },
  ];

  const collectorNavItems: NavItem[] = [
    { id: 'collector-scan', label: 'AI Scrap Scanner', icon: Sparkles, isAi: true },
    { id: 'price-board', label: 'Price Board', icon: TrendingUp },
    { id: 'safety-guidance', label: 'Worker Safety', icon: AlertTriangle },
    { id: 'customer-pickup', label: 'Citizen Pickups', icon: Truck, count: pickupCount },
  ];

  const currentNavItems = activeRole === 'recycler' ? recyclerNavItems : collectorNavItems;

  const handleLogout = () => {
    try {
      localStorage.removeItem('scrapsetu_auth_user');
    } catch (e) {}
    if (onSignOut) {
      onSignOut();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <header className={`${styles.header} drop-segment-1`}>
      <div className={styles.headerInner}>
        {/* Left: Brand Logo that links back to public landing page */}
        <Link
          href="/"
          className={styles.logoBtn}
          title="Return to Public Homepage"
          style={{ textDecoration: 'none' }}
        >
          <span className={styles.logoText}>ScrapSetu<span className={styles.logoDot}>.</span></span>
          <span className={styles.roleSubtext}>
            {activeRole === 'recycler' ? 'Recycler Facility Portal' : 'Field Collector App'}
          </span>
        </Link>

        {/* Center: Clean Role-Specific Navigation Links */}
        <nav className={styles.navLinks} aria-label="Role Navigation">
          {currentNavItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                onClick={() => onSelectTab(item.id)}
              >
                <span>{item.label}</span>
                {item.isAi && <span className={styles.aiPill}>AI</span>}
                {Boolean(item.count && item.count > 0) && (
                  <span className={styles.countBadge}>{item.count}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Role Badge, User Info, and Logout Button */}
        <div className={styles.headerRight}>
          {/* Strict Role Locked Verification Badge */}
          <div
            className={`${styles.roleLockedBadge} ${
              activeRole === 'collector' ? styles.roleLockedCollector : ''
            }`}
          >
            <CheckCircle2 size={13} />
            <span className={styles.badgeText}>
              {activeRole === 'recycler'
                ? 'DPCC Recycler'
                : 'Verified Collector'}
            </span>
          </div>

          {/* User Profile Pill */}
          {currentUser && (
            <div className={styles.userProfilePill} title={`Signed in as ${currentUser.name}`}>
              <div className={styles.userAvatar}>
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <span className={styles.userNameText}>
                {currentUser.name.split(' ')[0]}
              </span>
            </div>
          )}

          {/* Logout Button right in the dashboard */}
          <button
            type="button"
            className={styles.logoutBtn}
            onClick={handleLogout}
            title="Log out and return to home"
          >
            <LogOut size={13} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
