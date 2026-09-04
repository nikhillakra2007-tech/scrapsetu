'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/shell/Header';
import MobileNav from '@/components/shell/MobileNav';
import SmoothScroll from '@/components/SmoothScroll';
import SetuAssistant from '@/components/SetuAssistant';
import CollectorPortal from '@/features/collector/CollectorPortal';
import RecyclerOverview from '@/features/recycler/RecyclerOverview';
import MatchedLotsQueue from '@/features/recycler/MatchedLotsQueue';
import RateCardManager from '@/features/recycler/RateCardManager';
import HandoverTraceabilityView from '@/features/handover/HandoverTraceabilityView';
import HandoverVerificationModal from '@/features/handover/HandoverVerificationModal';
import LivePriceBoard from '@/features/price-board/LivePriceBoard';
import SafetyGuidanceView from '@/features/safety/SafetyGuidanceView';
import CustomerPickupPortal from '@/features/customer-pickup/CustomerPickupPortal';
import { MOCK_MATCHED_LOTS, MOCK_PICKUP_REQUESTS } from '@/lib/mock-data';
import { LotMatch } from '@/types/database';
import { ArrowLeft } from 'lucide-react';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email?: string;
    role?: 'recycler' | 'collector';
  } | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [activeRole, setActiveRole] = useState<'recycler' | 'collector'>('recycler');
  const [activeTab, setActiveTab] = useState<string>('recycler-overview');
  const [matchedLots, setMatchedLots] = useState<LotMatch[]>(MOCK_MATCHED_LOTS);
  const [selectedHandoverMatch, setSelectedHandoverMatch] = useState<LotMatch | null>(null);
  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState<boolean>(false);

  // Authentication gate: Redirect to /auth if not logged in
  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined'
        ? localStorage.getItem('scrapsetu_auth_user')
        : null;

      if (!stored) {
        // No authenticated session -> Redirect directly to login
        window.location.href = '/auth';
        return;
      }

      const user = JSON.parse(stored);
      setCurrentUser(user);

      // Lock role strictly to the authenticated account's assigned persona
      if (user.role === 'collector') {
        setActiveRole('collector');
        setActiveTab('collector-scan');
      } else {
        setActiveRole('recycler');
        setActiveTab('recycler-overview');
      }
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
      window.location.href = '/auth';
    } catch (e) {}
  };

  const handleLotCreated = (newMatch: LotMatch) => {
    setMatchedLots((prev) => [newMatch, ...prev]);
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

  const handleHandoverSuccess = (code: string) => {
    // Handover record locked
  };

  // Splash screen while verifying session
  if (isAuthLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F7FAF8',
          fontFamily: "'Outfit', sans-serif",
          color: '#172019',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            border: '3px solid #DCE6DF',
            borderTopColor: '#3F784C',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            marginBottom: '1rem',
          }}
        />
        <span style={{ fontSize: '0.9rem', color: '#5F6F65', fontWeight: 600 }}>
          Verifying ScrapSetu authentication...
        </span>
      </div>
    );
  }

  return (
    <SmoothScroll>
      <div className="app-container">
        {/* Navigation Header with Strict Single-Role Access and Dashboard Logout */}
        <Header
          currentTab={activeTab}
          onSelectTab={setActiveTab}
          matchedCount={matchedLots.length}
          pickupCount={MOCK_PICKUP_REQUESTS.length}
          activeRole={activeRole}
          onToggleRole={() => {}} // Role switching is locked
          currentUser={currentUser}
          onSignOut={handleSignOut}
        />

        {/* Main Content Surface with 1-Second Smooth Section Transition */}
        <div className="app-main">
          {/* Quick Return to Overview when in deep sub-views */}
          {activeTab !== 'recycler-overview' && activeTab !== 'collector-scan' && (
            <div style={{ maxWidth: 1400, margin: '0 auto', padding: '1rem 2rem 0', width: '100%' }}>
              <button
                type="button"
                onClick={() =>
                  setActiveTab(activeRole === 'recycler' ? 'recycler-overview' : 'collector-scan')
                }
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
                <span>Return to {activeRole === 'recycler' ? 'Command Hub' : 'AI Scanner'}</span>
              </button>
            </div>
          )}

          <main className="page-container section-transition-active" key={activeTab}>
            {/* STRICT ROLE GATED CONTENT: COLLECTOR ONLY */}
            {activeRole === 'collector' && (
              <>
                {activeTab === 'collector-scan' && (
                  <CollectorPortal
                    onLotCreated={handleLotCreated}
                    onNavigateToRecyclerQueue={() => {}}
                  />
                )}
                {activeTab === 'price-board' && <LivePriceBoard />}
                {activeTab === 'safety-guidance' && <SafetyGuidanceView />}
                {activeTab === 'customer-pickup' && <CustomerPickupPortal />}
              </>
            )}

            {/* STRICT ROLE GATED CONTENT: RECYCLER ONLY */}
            {activeRole === 'recycler' && (
              <>
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
              </>
            )}
          </main>
        </div>

        {/* Handover & QR Traceability Modal */}
        {isHandoverModalOpen && (
          <HandoverVerificationModal
            match={selectedHandoverMatch}
            onClose={() => setIsHandoverModalOpen(false)}
            onSuccess={handleHandoverSuccess}
          />
        )}

        {/* Mobile Fixed App Navigation Bar — strictly filtered to active role */}
        <MobileNav
          currentTab={activeTab}
          onSelectTab={setActiveTab}
          activeRole={activeRole}
          matchedCount={matchedLots.length}
          pickupCount={MOCK_PICKUP_REQUESTS.length}
        />

        {/* Floating Setu Assistant */}
        <SetuAssistant />
      </div>
    </SmoothScroll>
  );
}
