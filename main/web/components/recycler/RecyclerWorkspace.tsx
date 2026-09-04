'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/shell/Header';
import MobileNav from '@/components/shell/MobileNav';
import SmoothScroll from '@/components/SmoothScroll';
import SetuAssistant from '@/components/SetuAssistant';
import RecyclerOverview from '@/features/recycler/RecyclerOverview';
import MatchedLotsQueue from '@/features/recycler/MatchedLotsQueue';
import RateCardManager from '@/features/recycler/RateCardManager';
import HandoverTraceabilityView from '@/features/handover/HandoverTraceabilityView';
import HandoverVerificationModal from '@/features/handover/HandoverVerificationModal';
import { MOCK_MATCHED_LOTS, MOCK_PICKUP_REQUESTS } from '@/lib/mock-data';
import { LotMatch } from '@/types/database';
import { ArrowLeft } from 'lucide-react';

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
      // Prevent unauthorized cross-role access: If user is a collector, send to collector hub
      if (user.role === 'collector') {
        window.location.href = '/collector';
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
          backgroundColor: '#FAF8EE',
          fontFamily: "'Outfit', sans-serif",
          color: '#020F12',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            border: '3px solid #E2DDD0',
            borderTopColor: '#005F52',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            marginBottom: '1rem',
          }}
        />
        <span style={{ fontSize: '0.9rem', color: '#3D5A47', fontWeight: 600 }}>
          Verifying Recycler credentials...
        </span>
      </div>
    );
  }

  return (
    <SmoothScroll>
      <div className="app-container">
        {/* Recycler Header */}
        <Header
          currentTab={activeTab}
          onSelectTab={setActiveTab}
          matchedCount={matchedLots.length}
          pickupCount={MOCK_PICKUP_REQUESTS.length}
          activeRole="recycler"
          onToggleRole={() => {}}
          currentUser={currentUser}
          onSignOut={handleSignOut}
        />

        <div className="app-main">
          {activeTab !== 'recycler-overview' && (
            <div style={{ maxWidth: 1400, margin: '0 auto', padding: '1rem 2rem 0', width: '100%' }}>
              <button
                type="button"
                onClick={() => setActiveTab('recycler-overview')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'color var(--transition-fast)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                <ArrowLeft size={14} />
                <span>Return to Command Hub</span>
              </button>
            </div>
          )}

          <main className="page-container section-transition-active" key={activeTab}>
            {activeTab === 'recycler-overview' && (
              <RecyclerOverview
                matchedLots={matchedLots}
                onNavigateToLots={() => setActiveTab('matched-lots')}
                onNavigateToHandover={() => {
                  if (matchedLots.length > 0) {
                    setSelectedHandoverMatch(matchedLots[0]);
                    setIsHandoverModalOpen(true);
                  } else {
                    setActiveTab('handover');
                  }
                }}
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
          </main>
        </div>

        {/* QR Handover Modal */}
        {isHandoverModalOpen && (
          <HandoverVerificationModal
            match={selectedHandoverMatch}
            onClose={() => setIsHandoverModalOpen(false)}
            onSuccess={handleHandoverSuccess}
          />
        )}

        {/* Mobile Navigation */}
        <MobileNav
          currentTab={activeTab}
          onSelectTab={setActiveTab}
          activeRole="recycler"
          matchedCount={matchedLots.length}
          pickupCount={MOCK_PICKUP_REQUESTS.length}
        />

        <SetuAssistant />
      </div>
    </SmoothScroll>
  );
}
