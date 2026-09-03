'use client';

import React, { useState } from 'react';
import Header from '@/components/shell/Header';
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
  const [activeRole, setActiveRole] = useState<'recycler' | 'collector'>('recycler');
  const [activeTab, setActiveTab] = useState<string>('recycler-overview');
  const [matchedLots, setMatchedLots] = useState<LotMatch[]>(MOCK_MATCHED_LOTS);
  const [selectedHandoverMatch, setSelectedHandoverMatch] = useState<LotMatch | null>(null);
  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState<boolean>(false);

  // Toggle between Recycler and Collector personas
  const handleToggleRole = () => {
    if (activeRole === 'recycler') {
      setActiveRole('collector');
      setActiveTab('collector-scan');
    } else {
      setActiveRole('recycler');
      setActiveTab('recycler-overview');
    }
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

  return (
    <SmoothScroll>
      <div className="app-container">
        {/* LeafLine-Inspired Navigation Header with Physical Role Switch */}
        <Header
          currentTab={activeTab}
          onSelectTab={setActiveTab}
          matchedCount={matchedLots.length}
          pickupCount={MOCK_PICKUP_REQUESTS.length}
          activeRole={activeRole}
          onToggleRole={handleToggleRole}
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
            {/* COLLECTOR FEATURES */}
            {activeTab === 'collector-scan' && (
              <CollectorPortal
                onLotCreated={handleLotCreated}
                onNavigateToRecyclerQueue={() => {
                  setActiveRole('recycler');
                  setActiveTab('matched-lots');
                }}
              />
            )}

            {activeTab === 'price-board' && <LivePriceBoard />}

            {activeTab === 'safety-guidance' && <SafetyGuidanceView />}

            {activeTab === 'customer-pickup' && <CustomerPickupPortal />}

            {/* RECYCLER FEATURES */}
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

        {/* Handover & QR Traceability Modal */}
        {isHandoverModalOpen && (
          <HandoverVerificationModal
            match={selectedHandoverMatch}
            onClose={() => setIsHandoverModalOpen(false)}
            onSuccess={handleHandoverSuccess}
          />
        )}

        {/* Floating Setu Assistant */}
        <SetuAssistant />
      </div>
    </SmoothScroll>
  );
}
