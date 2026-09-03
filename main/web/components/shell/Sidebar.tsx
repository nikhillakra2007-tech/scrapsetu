'use client';

import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  ShieldCheck,
  CreditCard,
  Truck,
  TrendingUp,
  AlertTriangle,
  Layers,
  Sparkles,
  X,
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';
import styles from './Sidebar.module.css';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  matchedCount: number;
  pickupCount: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  matchedCount,
  pickupCount,
  isMobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const handleItemClick = (tab: string) => {
    setActiveTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div className={styles.mobileBackdrop} onClick={onCloseMobile} />
      )}

      <aside className={`${styles.sidebar} ${isMobileOpen ? styles.mobileOpen : ''}`}>
        {/* Brand Header */}
        <div className={styles.brandSection}>
          <div className={styles.brandLogo}>
            <Layers size={22} className={styles.brandIcon} />
          </div>
          <div className={styles.brandInfo}>
            <h1 className={styles.brandTitle}>ScrapSetu</h1>
            <span className={styles.brandSubtitle}>Kabadiwala Connect</span>
          </div>
          {onCloseMobile && (
            <button className={styles.closeBtn} onClick={onCloseMobile} aria-label="Close sidebar">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className={styles.navMenu}>
          <div className={styles.navGroup}>
            <span className={styles.groupHeading}>Informal Collector</span>
            <button
              type="button"
              className={`${styles.navItem} ${styles.collectorItem} ${
                activeTab === 'collector-scan' ? styles.activeItem : ''
              }`}
              onClick={() => handleItemClick('collector-scan')}
            >
              <Sparkles size={18} className={styles.collectorIcon} />
              <span className={styles.navLabel}>AI Scrap Scanner</span>
              <span className={styles.highlightBadge}>AI</span>
            </button>
          </div>

          <div className={styles.navGroup}>
            <span className={styles.groupHeading}>Recycler Portal</span>
            <button
              type="button"
              className={`${styles.navItem} ${
                activeTab === 'recycler-overview' ? styles.activeItem : ''
              }`}
              onClick={() => handleItemClick('recycler-overview')}
            >
              <LayoutDashboard size={18} />
              <span className={styles.navLabel}>Dashboard</span>
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${
                activeTab === 'matched-lots' ? styles.activeItem : ''
              }`}
              onClick={() => handleItemClick('matched-lots')}
            >
              <Inbox size={18} />
              <span className={styles.navLabel}>Incoming Lots</span>
              {matchedCount > 0 && (
                <span className={styles.countBadge}>{matchedCount}</span>
              )}
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${
                activeTab === 'handover' ? styles.activeItem : ''
              }`}
              onClick={() => handleItemClick('handover')}
            >
              <ShieldCheck size={18} />
              <span className={styles.navLabel}>Handover & QR</span>
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${
                activeTab === 'rate-cards' ? styles.activeItem : ''
              }`}
              onClick={() => handleItemClick('rate-cards')}
            >
              <CreditCard size={18} />
              <span className={styles.navLabel}>Rate Cards</span>
            </button>
          </div>

          <div className={styles.navGroup}>
            <span className={styles.groupHeading}>Ecosystem Channels</span>
            <button
              type="button"
              className={`${styles.navItem} ${
                activeTab === 'customer-pickup' ? styles.activeItem : ''
              }`}
              onClick={() => handleItemClick('customer-pickup')}
            >
              <Truck size={18} />
              <span className={styles.navLabel}>Customer Pickups</span>
              {pickupCount > 0 && (
                <span className={`${styles.countBadge} ${styles.cyanBadge}`}>
                  {pickupCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${
                activeTab === 'price-board' ? styles.activeItem : ''
              }`}
              onClick={() => handleItemClick('price-board')}
            >
              <TrendingUp size={18} />
              <span className={styles.navLabel}>Live Price Board</span>
            </button>

            <button
              type="button"
              className={`${styles.navItem} ${
                activeTab === 'safety-guidance' ? styles.activeItem : ''
              }`}
              onClick={() => handleItemClick('safety-guidance')}
            >
              <AlertTriangle size={18} />
              <span className={styles.navLabel}>Safety Guidance</span>
            </button>
          </div>
        </nav>

        {/* Footer Connection Status */}
        <div className={styles.footer}>
          <div className={styles.connectionIndicator}>
            <div
              className={styles.statusDot}
              style={{
                backgroundColor: isSupabaseConfigured ? 'var(--success-text)' : 'var(--brand-primary)',
              }}
            />
            <span className={styles.statusText}>
              {isSupabaseConfigured ? 'Supabase Live Connected' : 'Pilot Sandbox Mode'}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
