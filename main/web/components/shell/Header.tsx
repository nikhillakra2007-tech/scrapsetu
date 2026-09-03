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
  Recycle,
} from 'lucide-react';
import { CURRENT_RECYCLER } from '@/lib/mock-data';
import styles from './Header.module.css';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  matchedCount?: number;
  pickupCount?: number;
  activeRole: 'recycler' | 'collector';
  onToggleRole: () => void;
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
  onToggleRole,
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

  return (
    <header className={`${styles.header} drop-segment-1`}>
      <div className={styles.headerInner}>
        {/* Left: Brand Logo in LeafLine style */}
        <button
          type="button"
          className={styles.logoBtn}
          onClick={() => onSelectTab(activeRole === 'recycler' ? 'recycler-overview' : 'collector-scan')}
          title="Return to Home"
        >
          <span className={styles.logoText}>ScrapSetu<span className={styles.logoDot}>.</span></span>
          <span className={styles.roleSubtext}>
            {activeRole === 'recycler' ? 'Recycler Portal' : 'Collector App'}
          </span>
        </button>

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

        {/* Right: LeafLine Role Switcher Pill & Verification Tag */}
        <div className={styles.headerRight}>
          <div className={styles.dpccTag}>
            <CheckCircle2 size={13} className={styles.dpccIcon} />
            <span>DPCC Facility</span>
          </div>

          {/* LeafLine Physical Switch Toggle */}
          <div className={styles.loginSwitchBox}>
            <span className={styles.loginLabel}>
              {activeRole === 'recycler' ? 'RECYCLER' : 'COLLECTOR'}
            </span>
            <div
              className={`${styles.switchTrack} ${activeRole === 'collector' ? styles.switchTrackCollector : ''}`}
              onClick={onToggleRole}
              role="button"
              tabIndex={0}
              title={`Currently viewing ${activeRole.toUpperCase()} workspace. Click to switch.`}
            >
              <div className={`${styles.switchThumb} ${activeRole === 'collector' ? styles.switchThumbCollector : ''}`}>
                <Recycle size={12} className={styles.recycleIcon} strokeWidth={2.6} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
