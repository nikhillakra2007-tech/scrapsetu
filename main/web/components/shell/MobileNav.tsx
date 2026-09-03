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
} from 'lucide-react';
import styles from './MobileNav.module.css';

interface MobileNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  activeRole: 'recycler' | 'collector';
  matchedCount?: number;
  pickupCount?: number;
}

export default function MobileNav({
  currentTab,
  onSelectTab,
  activeRole,
  matchedCount = 0,
  pickupCount = 0,
}: MobileNavProps) {
  const recyclerItems = [
    { id: 'recycler-overview', label: 'Hub', icon: LayoutDashboard },
    { id: 'matched-lots', label: 'Lots', icon: Inbox, count: matchedCount },
    { id: 'handover', label: 'Handover', icon: ShieldCheck },
    { id: 'rate-cards', label: 'Rates', icon: CreditCard },
  ];

  const collectorItems = [
    { id: 'collector-scan', label: 'Scan', icon: Sparkles },
    { id: 'price-board', label: 'Price Board', icon: TrendingUp },
    { id: 'safety-guidance', label: 'Safety', icon: AlertTriangle },
    { id: 'customer-pickup', label: 'Pickups', icon: Truck, count: pickupCount },
  ];

  const items = activeRole === 'recycler' ? recyclerItems : collectorItems;

  return (
    <nav className={styles.mobileNav} aria-label="Mobile Navigation">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={`${styles.mobileNavItem} ${isActive ? styles.mobileNavItemActive : ''}`}
            onClick={() => onSelectTab(item.id)}
          >
            <div className={styles.iconWrapper}>
              <Icon size={18} />
              {Boolean(item.count && item.count > 0) && (
                <span className={styles.mobileBadge}>{item.count}</span>
              )}
            </div>
            <span className={styles.mobileNavLabel}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
