'use client';

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/shell/AppShell';
import RecyclerOverview from '@/features/recycler/RecyclerOverview';
import MatchedLotsQueue from '@/features/recycler/MatchedLotsQueue';
import RateCardManager from '@/features/recycler/RateCardManager';
import HandoverTraceabilityView from '@/features/handover/HandoverTraceabilityView';
import HandoverVerificationModal from '@/features/handover/HandoverVerificationModal';
import { MOCK_MATCHED_LOTS, MOCK_PICKUP_REQUESTS } from '@/lib/mock-data';
import { LotMatch } from '@/types/database';
import {
  Building2,
  CheckCircle2,
  ShieldCheck,
  Inbox,
  MapPin,
  LayoutDashboard,
  CreditCard,
  QrCode,
} from 'lucide-react';
import styles from './RecyclerWorkspace.module.css';

export default function RecyclerWorkspace() {
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email?: string;
    role?: 'recycler' | 'collector' | 'admin';
  } | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('recycler-overview');
  const [matchedLots, setMatchedLots] = useState<LotMatch[]>(MOCK_MATCHED_LOTS);
  const [selectedHandoverMatch, setSelectedHandoverMatch] = useState<LotMatch | null>(null);
  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState<boolean>(false);

  // Authentication gate & role verification
  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined'
        ? localStorage.getItem('scrapsetu_auth_user')
        : null;

      if (!stored) {
        window.location.href = '/auth';
        return;
      }

      const user = JSON.parse(stored);
      if (user.role === 'collector') {
        window.location.href = '/collector';
        return;
      }
      if (user.role === 'admin') {
        window.location.href = '/admin';
        return;
      }

      setCurrentUser(user);
    } catch (e) {
      window.location.href = '/auth';
      return;
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  const handleSignOut = () => {
    try {
      localStorage.removeItem('scrapsetu_auth_user');
    } catch (e) {}
    window.location.href = '/';
  };

  const handleAcceptLot = (match: LotMatch) => {
    setMatchedLots((prev) =>
      prev.map((m) =>
        m.id === match.id ? { ...m, status: 'accepted' } : m
      )
    );
  };

  const handleInitiateHandover = (match: LotMatch) => {
    setSelectedHandoverMatch(match);
    setIsHandoverModalOpen(true);
  };

  const handleHandoverSuccess = (_code: string) => {
    // Handover successfully verified
  };

  if (isAuthLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-app, #F6F8F5)',
          fontFamily: "var(--font-sans, sans-serif)",
          color: 'var(--text-primary, #0B1220)',
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            border: '3px solid var(--border-subtle, #DCE5E0)',
            borderTopColor: 'var(--brand-primary, #087F5B)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            marginBottom: '1rem',
          }}
        />
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #52606D)', fontWeight: 600 }}>
          Verifying Recycler credentials...
        </span>
      </div>
    );
  }

  return (
    <AppShell
      role="recycler"
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      currentUser={currentUser}
      onSignOut={handleSignOut}
      matchedCount={matchedLots.length}
      pickupCount={MOCK_PICKUP_REQUESTS.length}
    >
      <div className={styles.recyclerContainer}>
        {/* Facility Operational Header */}
        <div className={styles.facilityHeader}>
          <div className={styles.facilityHeaderLeft}>
            <div className={styles.titleRow}>
              <h1 className={styles.facilityTitle}>Recycler Facility Hub</h1>
              <span className={styles.verifiedBadge}>
                <CheckCircle2 size={13} />
                <span>DPCC Authorized</span>
              </span>
            </div>
            <p className={styles.facilitySubtitle}>
              Monitor incoming verified feedstock, configure procurement rate cards, and record digital QR handover manifests.
            </p>

            <div className={styles.facilityMetaRow}>
              <span className={styles.facilityMetaItem}>
                <MapPin size={14} />
                <span>Okhla Industrial Area, Phase III</span>
              </span>
              <span className={styles.facilityMetaItem}>
                <span>REG ID:</span>
                <span className={styles.facilityMetaMono}>DPCC/EW/2024/0981</span>
              </span>
              <span className={styles.facilityMetaItem}>
                <ShieldCheck size={14} color="var(--brand-primary)" />
                <span>EPR Traceability: Active</span>
              </span>
            </div>
          </div>
        </div>

        {/* Facility Infrastructure Operational Panel */}
        <div className={styles.facilityPanel}>
          <div className={styles.facilityIdentity}>
            <div className={styles.facilityLogoIcon}>
              <Building2 size={24} />
            </div>
            <div className={styles.facilityInfo}>
              <span className={styles.facilityHubName}>EcoRecycle Scientific Hub</span>
              <div className={styles.facilityTags}>
                <span className={styles.facTag}>DELHI NCR CLUSTER</span>
                <span className={styles.facTag}>PCB / COPPER / LI-ION</span>
                <span className={`${styles.facTag} ${styles.facTagEpr}`}>EPR ACTIVE</span>
              </div>
            </div>
          </div>

          <div className={styles.facilityTelemetryStats}>
            <div className={styles.telemetryStat}>
              <span className={styles.telemetryStatLabel}>INTAKE TODAY</span>
              <span className={styles.telemetryStatValue}>135.5 KG</span>
            </div>
            <div className={styles.telemetryStat}>
              <span className={styles.telemetryStatLabel}>PENDING LOTS</span>
              <span className={styles.telemetryStatValue}>{matchedLots.length} ACTIVE</span>
            </div>
            <div className={styles.telemetryStat}>
              <span className={styles.telemetryStatLabel}>AI VERIFICATION</span>
              <span className={styles.telemetryStatValue}>98.4% CONF</span>
            </div>
          </div>
        </div>

        {/* 4 Clean Centered Section Switcher Cards */}
        <div className={styles.sectionSwitcherContainer}>
          <span className={styles.sectionSwitcherLabel}>Select Facility Workflow</span>

          <div className={styles.sectionCardsGrid}>
            <button
              type="button"
              className={`${styles.sectionCard} ${activeTab === 'recycler-overview' ? styles.sectionCardActive : ''}`}
              onClick={() => setActiveTab('recycler-overview')}
            >
              <div className={styles.sectionCardHeader}>
                <div className={styles.sectionIconBadge}>
                  <LayoutDashboard size={18} />
                </div>
                {activeTab === 'recycler-overview' && <span className={styles.activeSectionIndicator} />}
              </div>
              <div className={styles.sectionCardContent}>
                <span className={styles.sectionCardTitle}>Facility Overview</span>
                <span className={styles.sectionCardDesc}>
                  Procurement KPIs, material volume summaries & fast action dispatch.
                </span>
              </div>
            </button>

            <button
              type="button"
              className={`${styles.sectionCard} ${activeTab === 'matched-lots' ? styles.sectionCardActive : ''}`}
              onClick={() => setActiveTab('matched-lots')}
            >
              <div className={styles.sectionCardHeader}>
                <div className={styles.sectionIconBadge}>
                  <Inbox size={18} />
                </div>
                {activeTab === 'matched-lots' ? (
                  <span className={styles.activeSectionIndicator} />
                ) : (
                  <span className={styles.sectionCardTag}>{matchedLots.length} NEW</span>
                )}
              </div>
              <div className={styles.sectionCardContent}>
                <span className={styles.sectionCardTitle}>Incoming Lots</span>
                <span className={styles.sectionCardDesc}>
                  Review AI-graded feedstock matched from nearby registered collectors.
                </span>
              </div>
            </button>

            <button
              type="button"
              className={`${styles.sectionCard} ${activeTab === 'handover' ? styles.sectionCardActive : ''}`}
              onClick={() => setActiveTab('handover')}
            >
              <div className={styles.sectionCardHeader}>
                <div className={styles.sectionIconBadge}>
                  <QrCode size={18} />
                </div>
                {activeTab === 'handover' && <span className={styles.activeSectionIndicator} />}
              </div>
              <div className={styles.sectionCardContent}>
                <span className={styles.sectionCardTitle}>Handover & QR</span>
                <span className={styles.sectionCardDesc}>
                  Verify calibrated scale weights and execute cryptographic QR handshakes.
                </span>
              </div>
            </button>

            <button
              type="button"
              className={`${styles.sectionCard} ${activeTab === 'rate-cards' ? styles.sectionCardActive : ''}`}
              onClick={() => setActiveTab('rate-cards')}
            >
              <div className={styles.sectionCardHeader}>
                <div className={styles.sectionIconBadge}>
                  <CreditCard size={18} />
                </div>
                {activeTab === 'rate-cards' && <span className={styles.activeSectionIndicator} />}
              </div>
              <div className={styles.sectionCardContent}>
                <span className={styles.sectionCardTitle}>Rate Cards</span>
                <span className={styles.sectionCardDesc}>
                  Configure offered buying rates per kg against CPCB benchmark rates.
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Clean Active Feature Subview Surface */}
        <div className={styles.activeViewSurface} key={activeTab}>
          {activeTab === 'recycler-overview' && (
            <RecyclerOverview
              matchedLots={matchedLots}
              onNavigateToLots={() => setActiveTab('matched-lots')}
              onNavigateToHandover={() => setActiveTab('handover')}
              onNavigateToRateCards={() => setActiveTab('rate-cards')}
            />
          )}

          {activeTab === 'matched-lots' && (
            <MatchedLotsQueue
              lots={matchedLots}
              onAcceptLot={handleAcceptLot}
              onInitiateHandover={handleInitiateHandover}
            />
          )}

          {activeTab === 'handover' && <HandoverTraceabilityView />}

          {activeTab === 'rate-cards' && <RateCardManager />}
        </div>
      </div>

      {/* Handover Verification Modal */}
      {isHandoverModalOpen && (
        <HandoverVerificationModal
          match={selectedHandoverMatch}
          onClose={() => setIsHandoverModalOpen(false)}
          onSuccess={handleHandoverSuccess}
        />
      )}
    </AppShell>
  );
}
