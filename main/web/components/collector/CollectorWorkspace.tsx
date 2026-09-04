'use client';

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/shell/AppShell';
import CollectorPortal from '@/features/collector/CollectorPortal';
import LivePriceBoard from '@/features/price-board/LivePriceBoard';
import SafetyGuidanceView from '@/features/safety/SafetyGuidanceView';
import CustomerPickupPortal from '@/features/customer-pickup/CustomerPickupPortal';
import { MOCK_MATCHED_LOTS, MOCK_PICKUP_REQUESTS, CURRENT_RECYCLER } from '@/lib/mock-data';
import { LotMatch } from '@/types/database';
import {
  Package,
  CheckCircle2,
  IndianRupee,
  ShieldCheck,
  Plus,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Truck,
  X,
  ArrowRight,
  Check,
  Building2,
} from 'lucide-react';
import styles from './CollectorWorkspace.module.css';

interface MaterialOption {
  id: string;
  name: string;
  code: string;
  ratePerKg: number;
  category: string;
}

const MATERIAL_OPTIONS: MaterialOption[] = [
  { id: 'pcb', name: 'Printed Circuit Boards (PCB)', code: 'mobile_pcb', ratePerKg: 450, category: 'PCB' },
  { id: 'battery', name: 'Lithium-Ion Battery Packs', code: 'li_ion_mobile_laptop', ratePerKg: 180, category: 'BATTERY' },
  { id: 'copper', name: 'Stripped High-Purity Copper', code: 'copper_wire', ratePerKg: 385, category: 'CABLE_WIRE' },
  { id: 'crt', name: 'CRT Monitor & Leaded Glass', code: 'tv_crt', ratePerKg: 95, category: 'CRT' },
  { id: 'server', name: 'Enterprise Server Backplanes', code: 'server_chassis', ratePerKg: 280, category: 'PCB' },
];

export default function CollectorWorkspace() {
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email?: string;
    role?: 'recycler' | 'collector' | 'admin';
  } | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('collector-scan');
  const [matchedLots, setMatchedLots] = useState<LotMatch[]>(MOCK_MATCHED_LOTS);

  // Workable Create Lot Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialOption>(MATERIAL_OPTIONS[0]);
  const [lotWeight, setLotWeight] = useState<number>(25);
  const [lotCluster, setLotCluster] = useState<string>('Okhla Industrial Area');
  const [creationSuccessNotice, setCreationSuccessNotice] = useState<string | null>(null);

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
      if (user.role === 'recycler') {
        window.location.href = '/recycler';
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

  // Lock background body scroll and prevent wheel leakage when modal is open
  useEffect(() => {
    if (isCreateModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCreateModalOpen]);

  const handleSignOut = () => {
    try {
      localStorage.removeItem('scrapsetu_auth_user');
    } catch (e) {}
    window.location.href = '/';
  };

  const handleLotCreated = (newMatch: LotMatch) => {
    setMatchedLots((prev) => [newMatch, ...prev]);
  };

  // Workable Create Lot Submission
  const handleConfirmCreateLot = (e: React.FormEvent) => {
    e.preventDefault();
    const newLotId = `LOT-DEL-${Math.floor(100 + Math.random() * 900)}`;
    const estimatedValue = Math.round(lotWeight * selectedMaterial.ratePerKg);

    const newMatch: LotMatch = {
      id: `match-${Date.now()}`,
      lot_id: newLotId,
      recycler_id: CURRENT_RECYCLER.id,
      score: 95.0,
      rank: 1,
      status: 'offered',
      offered_at: 'Just now',
      lot: {
        id: newLotId,
        collector_id: 'c0000000-0000-0000-0000-000000000001',
        collector_name: currentUser?.name || 'Ramesh Kumar',
        parent_code: selectedMaterial.category,
        sub_code: selectedMaterial.code,
        condition: 'scrap',
        weight_kg: lotWeight,
        hazard_flags: selectedMaterial.id === 'battery' ? ['fire_hazard'] : [],
        ai_suggested_rate_per_kg: selectedMaterial.ratePerKg,
        ai_confidence: 0.98,
        estimated_value: estimatedValue,
        ward_name: lotCluster,
        status: 'matched',
        client_created_at: 'Just now',
      },
    };

    setMatchedLots((prev) => [newMatch, ...prev]);
    setIsCreateModalOpen(false);
    setCreationSuccessNotice(`Successfully created ${newLotId} (${lotWeight}kg ${selectedMaterial.name})! Matched with EcoRecycle Scientific Hub.`);
    setActiveTab('collector-scan');

    setTimeout(() => {
      setCreationSuccessNotice(null);
    }, 6000);
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
          Verifying Collector credentials...
        </span>
      </div>
    );
  }

  const calculatedPayout = Math.round(lotWeight * selectedMaterial.ratePerKg);

  return (
    <AppShell
      role="collector"
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      currentUser={currentUser}
      onSignOut={handleSignOut}
      matchedCount={matchedLots.length}
      pickupCount={MOCK_PICKUP_REQUESTS.length}
    >
      <div className={styles.collectorContainer}>
        {/* Operational Header Banner */}
        <div className={styles.opHeader}>
          <div className={styles.opHeaderMain}>
            <div className={styles.opTitleRow}>
              <h1 className={styles.opTitle}>Collector Operations</h1>
              <span className={styles.opStatusPill}>
                <CheckCircle2 size={13} />
                <span>Field Active</span>
              </span>
            </div>
            <p className={styles.opSubtitle}>
              Scan scrap materials with multimodal AI vision, check transparent benchmark prices, and dispatch verified lots directly to licensed facilities.
            </p>
          </div>

          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.createLotBtn}
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus size={16} />
              <span>+ Create New Lot</span>
            </button>
          </div>
        </div>

        {/* Success Alert Toast */}
        {creationSuccessNotice && (
          <div
            style={{
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--brand-tint)',
              border: '1px solid var(--brand-soft)',
              color: 'var(--brand-primary)',
              fontSize: '0.875rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <CheckCircle2 size={18} />
            <span>{creationSuccessNotice}</span>
          </div>
        )}

        {/* 4 Concise Operational Metrics */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <span className={styles.metricTitle}>Active Lots</span>
              <div className={styles.metricIconWrap}>
                <Package size={16} />
              </div>
            </div>
            <div className={styles.metricValueRow}>
              <span className={styles.metricValue}>{matchedLots.length} Lots</span>
              <span className={styles.metricSubtext}>in current queue</span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <span className={styles.metricTitle}>Ready for Handover</span>
              <div className={styles.metricIconWrap}>
                <ShieldCheck size={16} />
              </div>
            </div>
            <div className={styles.metricValueRow}>
              <span className={styles.metricValue}>
                {matchedLots.filter((m) => m.status === 'accepted').length || 2} Ready
              </span>
              <span className={styles.metricSubtext}>QR manifest prepared</span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <span className={styles.metricTitle}>Month&apos;s Settlement</span>
              <div className={styles.metricIconWrap}>
                <IndianRupee size={16} />
              </div>
            </div>
            <div className={styles.metricValueRow}>
              <span className={styles.metricValue}>₹24,850</span>
              <span className={styles.metricSubtext}>100% verified</span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <span className={styles.metricTitle}>Verified Lots</span>
              <div className={styles.metricIconWrap}>
                <CheckCircle2 size={16} />
              </div>
            </div>
            <div className={styles.metricValueRow}>
              <span className={styles.metricValue}>18 Lots</span>
              <span className={styles.metricSubtext}>lifetime audited</span>
            </div>
          </div>
        </div>

        {/* 4 Clean Centered Section Switcher Cards */}
        <div className={styles.sectionSwitcherContainer}>
          <span className={styles.sectionSwitcherLabel}>Select Operational Workspace</span>

          <div className={styles.sectionCardsGrid}>
            <button
              type="button"
              className={`${styles.sectionCard} ${activeTab === 'collector-scan' ? styles.sectionCardActive : ''}`}
              onClick={() => setActiveTab('collector-scan')}
            >
              <div className={styles.sectionCardHeader}>
                <div className={styles.sectionIconBadge}>
                  <Sparkles size={18} />
                </div>
                {activeTab === 'collector-scan' ? (
                  <span className={styles.activeSectionIndicator} />
                ) : (
                  <span className={styles.sectionCardTag}>AI VISION</span>
                )}
              </div>
              <div className={styles.sectionCardContent}>
                <span className={styles.sectionCardTitle}>AI Scrap Scanner</span>
                <span className={styles.sectionCardDesc}>
                  Multimodal vision alloy classification, weight tare & instant facility match.
                </span>
              </div>
            </button>

            <button
              type="button"
              className={`${styles.sectionCard} ${activeTab === 'price-board' ? styles.sectionCardActive : ''}`}
              onClick={() => setActiveTab('price-board')}
            >
              <div className={styles.sectionCardHeader}>
                <div className={styles.sectionIconBadge}>
                  <TrendingUp size={18} />
                </div>
                {activeTab === 'price-board' && <span className={styles.activeSectionIndicator} />}
              </div>
              <div className={styles.sectionCardContent}>
                <span className={styles.sectionCardTitle}>Live Price Board</span>
                <span className={styles.sectionCardDesc}>
                  DPCC authorized daily benchmark buying tariffs across Okhla & Mayapuri.
                </span>
              </div>
            </button>

            <button
              type="button"
              className={`${styles.sectionCard} ${activeTab === 'safety-guidance' ? styles.sectionCardActive : ''}`}
              onClick={() => setActiveTab('safety-guidance')}
            >
              <div className={styles.sectionCardHeader}>
                <div className={styles.sectionIconBadge}>
                  <AlertTriangle size={18} />
                </div>
                {activeTab === 'safety-guidance' && <span className={styles.activeSectionIndicator} />}
              </div>
              <div className={styles.sectionCardContent}>
                <span className={styles.sectionCardTitle}>Worker Safety</span>
                <span className={styles.sectionCardDesc}>
                  Hazard protocols for swollen Li-ion batteries, acid leaching & leaded CRT glass.
                </span>
              </div>
            </button>

            <button
              type="button"
              className={`${styles.sectionCard} ${activeTab === 'customer-pickup' ? styles.sectionCardActive : ''}`}
              onClick={() => setActiveTab('customer-pickup')}
            >
              <div className={styles.sectionCardHeader}>
                <div className={styles.sectionIconBadge}>
                  <Truck size={18} />
                </div>
                {activeTab === 'customer-pickup' ? (
                  <span className={styles.activeSectionIndicator} />
                ) : (
                  <span className={styles.sectionCardTag}>{MOCK_PICKUP_REQUESTS.length} ACTIVE</span>
                )}
              </div>
              <div className={styles.sectionCardContent}>
                <span className={styles.sectionCardTitle}>Citizen Pickups</span>
                <span className={styles.sectionCardDesc}>
                  Accept and fulfill scheduled doorstep scrap collections in residential wards.
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Clean Active Feature Subview Surface */}
        <div className={styles.activeViewSurface} key={activeTab}>
          {activeTab === 'collector-scan' && (
            <CollectorPortal
              onLotCreated={handleLotCreated}
              onNavigateToRecyclerQueue={() => {}}
            />
          )}
          {activeTab === 'price-board' && <LivePriceBoard />}
          {activeTab === 'safety-guidance' && <SafetyGuidanceView />}
          {activeTab === 'customer-pickup' && <CustomerPickupPortal />}
        </div>
      </div>

      {/* Workable Create Lot Interactive Modal */}
      {isCreateModalOpen && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          data-lenis-prevent="true"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            className={styles.modalCard}
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleRow}>
                <h2 className={styles.modalTitle}>Create New Scrap Lot</h2>
                <p className={styles.modalSubtitle}>
                  Intake verified material and generate immediate facility match manifest
                </p>
              </div>
              <button
                type="button"
                className={styles.closeModalBtn}
                onClick={() => setIsCreateModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmCreateLot} className={styles.modalForm}>
              <div
                className={styles.modalBody}
                data-lenis-prevent="true"
                onWheel={(e) => e.stopPropagation()}
              >
                {/* Material Selection */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Select Scrap Material Category</label>
                  <div className={styles.materialPillsGrid}>
                    {MATERIAL_OPTIONS.map((mat) => {
                      const isSelected = selectedMaterial.id === mat.id;
                      return (
                        <button
                          key={mat.id}
                          type="button"
                          className={`${styles.materialSelectBtn} ${isSelected ? styles.materialSelectBtnActive : ''}`}
                          onClick={() => setSelectedMaterial(mat)}
                        >
                          <div className={styles.matBtnText}>
                            <span className={styles.matName}>{mat.name}</span>
                            <span className={styles.matRate}>Benchmark: ₹{mat.ratePerKg}/kg</span>
                          </div>
                          {isSelected && <Check size={16} color="var(--brand-primary)" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Net Weight */}
                <div className={styles.formGroup}>
                  <label htmlFor="lot-weight-input" className={styles.formLabel}>
                    Net Weight (Certified Tare)
                  </label>
                  <div className={styles.weightInputRow}>
                    <div className={styles.weightInputWrap}>
                      <input
                        id="lot-weight-input"
                        type="number"
                        min="1"
                        max="5000"
                        step="0.5"
                        className={styles.weightInput}
                        value={lotWeight}
                        onChange={(e) => setLotWeight(parseFloat(e.target.value) || 0)}
                        required
                      />
                      <span className={styles.weightUnit}>KG</span>
                    </div>

                    <div className={styles.weightPresets}>
                      {[10, 25, 45, 100].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          className={styles.presetBtn}
                          onClick={() => setLotWeight(preset)}
                        >
                          {preset}kg
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Location Cluster */}
                <div className={styles.formGroup}>
                  <label htmlFor="lot-cluster-select" className={styles.formLabel}>
                    Industrial Intake Cluster
                  </label>
                  <select
                    id="lot-cluster-select"
                    className={styles.weightInput}
                    value={lotCluster}
                    onChange={(e) => setLotCluster(e.target.value)}
                  >
                    <option value="Okhla Industrial Area">Okhla Industrial Area, Phase III (South Delhi)</option>
                    <option value="Mayapuri Scrap Market">Mayapuri Metal Cluster (West Delhi)</option>
                    <option value="Bawana Industrial Zone">Bawana Non-Ferrous Zone (North Delhi)</option>
                    <option value="Narela Industrial Estate">Narela Aggregation Hub (North Delhi)</option>
                  </select>
                </div>

                {/* AI Valuation Live Preview */}
                <div className={styles.valuationPreviewCard}>
                  <div className={styles.valLeft}>
                    <span className={styles.valHeading}>AI ESTIMATED GATE PAYOUT</span>
                    <span className={styles.valFacility}>EcoRecycle Scientific Hub · 3.4 km</span>
                  </div>
                  <div className={styles.valRight}>
                    <span className={styles.valAmount}>₹{calculatedPayout.toLocaleString()}</span>
                    <span className={styles.valRateSub}>{lotWeight} kg × ₹{selectedMaterial.ratePerKg}/kg</span>
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitLotBtn}
                >
                  <span>Submit Lot & Generate Manifest</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
