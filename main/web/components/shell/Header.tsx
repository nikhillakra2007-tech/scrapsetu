'use client';

import React from 'react';
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
  currentUser?: { name: string; email?: string; role?: 'recycler' | 'collector' } | null;
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
    if (onSignOut) {
      onSignOut();
    } else {
      try {
        localStorage.removeItem('scrapsetu_auth_user');
        window.location.href = '/auth';
      } catch (e) {}
    }
  };

  return (
    <header className={`${styles.header} drop-segment-1`}>
      <div className={styles.headerInner}>
        {/* Left: Brand Logo in LeafLine style */}
        <button
          type="button"
          className={styles.logoBtn}
          onClick={() => onSelectTab(activeRole === 'recycler' ? 'recycler-overview' : 'collector-scan')}
          title="Return to Dashboard Home"
        >
          <span className={styles.logoText}>ScrapSetu<span className={styles.logoDot}>.</span></span>
          <span className={styles.roleSubtext}>
            {activeRole === 'recycler' ? 'Recycler Facility Portal' : 'Field Collector App'}
          </span>
        </button>

        {/* Center: Clean Role-Specific Navigation Links (Strictly for the active role) */}
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

        {/* Right: Facility / Role Badge, User Info, and Logout Button */}
        <div className={styles.headerRight}>
          {/* Strict Role Locked Verification Badge — switching roles is locked */}
          <div
            className={`${styles.roleLockedBadge} ${
              activeRole === 'collector' ? styles.roleLockedCollector : ''
            }`}
          >
            <CheckCircle2 size={13} />
            <span>
              {activeRole === 'recycler'
                ? 'DPCC Authorized Recycler'
                : 'Verified Field Collector'}
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
            title="Log out of ScrapSetu"
          >
            <LogOut size={13} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
