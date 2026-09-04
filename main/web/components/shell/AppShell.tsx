'use client';

import React from 'react';
import Header from './Header';
import SetuAssistant from '@/components/SetuAssistant';
import SmoothScroll from '@/components/SmoothScroll';
import styles from './AppShell.module.css';

export interface AppShellProps {
  role: 'collector' | 'recycler' | 'admin';
  activeTab: string;
  onSelectTab: (tab: string) => void;
  currentUser?: {
    name: string;
    email?: string;
    role?: 'collector' | 'recycler' | 'admin';
  } | null;
  onSignOut?: () => void;
  matchedCount?: number;
  pickupCount?: number;
  children: React.ReactNode;
}

export default function AppShell({
  role,
  activeTab,
  onSelectTab,
  currentUser,
  onSignOut,
  matchedCount = 0,
  pickupCount = 0,
  children,
}: AppShellProps) {
  return (
    <SmoothScroll>
      <div className={styles.appShell}>
        {/* Full-width Quiet Top Navigation Bar with working notifications & tabs */}
        <Header
          role={role}
          currentTab={activeTab}
          onSelectTab={onSelectTab}
          currentUser={currentUser}
          onSignOut={onSignOut}
          matchedCount={matchedCount}
          pickupCount={pickupCount}
        />

        {/* Centered Golden-Ratio Spacious Workspace Content */}
        <main className={styles.mainContent}>
          <div className={styles.contentContainer}>
            {children}
          </div>
        </main>

        {/* Setu Assistant AI Floater */}
        <SetuAssistant />
      </div>
    </SmoothScroll>
  );
}
