'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import RecyclerOverview from '@/components/RecyclerOverview';
import MatchedLotsQueue from '@/components/MatchedLotsQueue';
import HandoverVerificationModal from '@/components/HandoverVerificationModal';
import RateCardManager from '@/components/RateCardManager';
import CustomerPickupPortal from '@/components/CustomerPickupPortal';
import LivePriceBoard from '@/components/LivePriceBoard';
import SafetyGuidanceView from '@/components/SafetyGuidanceView';
import HandoverTraceabilityView from '@/components/HandoverTraceabilityView';
import CollectorPortal from '@/components/CollectorPortal';
import { MOCK_MATCHED_LOTS, MOCK_PICKUP_REQUESTS } from '@/lib/mock-data';
import { LotMatch } from '@/types/database';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('recycler-overview');
  const [matchedLots, setMatchedLots] = useState<LotMatch[]>(MOCK_MATCHED_LOTS);
  const [selectedHandoverMatch, setSelectedHandoverMatch] = useState<LotMatch | null>(null);
  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState<boolean>(false);

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
    // Optionally update lot status to confirmed
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        matchedCount={matchedLots.length}
        pickupCount={MOCK_PICKUP_REQUESTS.length}
      />

      {/* Main Layout */}
      <div className="app-main">
        <Header currentTab={activeTab} onSelectTab={setActiveTab} />

        <main className="page-container">
          {activeTab === 'collector-scan' && (
            <CollectorPortal
              onLotCreated={handleLotCreated}
              onNavigateToRecyclerQueue={() => setActiveTab('matched-lots')}
            />
          )}

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

          {activeTab === 'customer-pickup' && <CustomerPickupPortal />}

          {activeTab === 'price-board' && <LivePriceBoard />}

          {activeTab === 'safety-guidance' && <SafetyGuidanceView />}
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
    </div>
  );
}
