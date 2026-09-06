'use client';
import { T } from '@/components/language/Language';

import React, { useState } from 'react';
import {
  Package,
  MapPin,
  Check,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { LotMatch } from '@/types/database';
import styles from './Recycler.module.css';

interface MatchedLotsQueueProps {
  lots: LotMatch[];
  onAcceptLot: (match: LotMatch) => void;
  onInitiateHandover: (match: LotMatch) => void;
}

export default function MatchedLotsQueue({
  lots,
  onAcceptLot,
  onInitiateHandover,
}: MatchedLotsQueueProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [acceptedIds, setAcceptedIds] = useState<Record<string, boolean>>({});

  const filteredLots =
    selectedCategory === 'ALL'
      ? lots
      : lots.filter((m) => m.lot?.parent_code === selectedCategory);

  const handleAccept = (match: LotMatch) => {
    setAcceptedIds((prev) => ({ ...prev, [match.id]: true }));
    onAcceptLot(match);
  };

  return (
    <div className={styles.container}>
      {/* Header & Filter Controls */}
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}><T>Incoming Matched Scrap Lots</T></h2>
          <p className={styles.pageSubtitle}><T>
            Candidate lots pre-ranked by PostGIS distance, category rate cards, and facility authorization.
          </T></p>
        </div>

        {/* Category Filters */}
        <div className={styles.filterRow}>
          <T>{['ALL', 'PCB', 'BATTERY', 'CABLE_WIRE', 'WHOLE_DEVICE'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`${styles.filterBtn} ${selectedCategory === cat ? styles.filterBtnActive : ''}`}
            >
              <T>{cat.replace('_', ' ')}</T>
            </button>
          ))}</T>
        </div>
      </div>

      {/* Grid of Lot Cards */}
      <div className={styles.lotsGrid}>
        <T>{filteredLots.map((match) => {
          const lot = match.lot;
          if (!lot) return null;
          const isAccepted = acceptedIds[match.id] || match.status === 'accepted';

          return (
            <div
              key={match.id}
              className={`${styles.lotCard} ${isAccepted ? styles.lotCardAccepted : ''}`}
            >
              <div>
                {/* Top Badge Row */}
                <div className={styles.cardTopRow}>
                  <span className={styles.lotCategoryBadge}><T>{lot.parent_code}</T></span>
                  <span className={styles.lotScoreBadge}><T>{match.score}</T><T>% MATCH</T></span>
                </div>

                <h3 className={styles.lotTitle}>
                  <T>{lot.sub_code.replace(/_/g, ' ').toUpperCase()}</T>
                </h3>

                {/* Location and Collector Info */}
                <div className={styles.lotLocationRow}>
                  <MapPin size={14} className={styles.locationPin} />
                  <span><T>{lot.ward_name}</T></span>
                  <span className={styles.collectorSeparator}><T>• </T><T>{lot.collector_name}</T></span>
                </div>

                {/* Hazard Warning Tags */}
                <T>{lot.hazard_flags.length > 0 && (
                  <div className={styles.hazardRow}>
                    <T>{lot.hazard_flags.map((flag) => (
                      <span key={flag} className={styles.hazardBadge}>
                        <Flame size={12} />
                        <span><T>{flag.replace(/_/g, ' ')}</T></span>
                      </span>
                    ))}</T>
                  </div>
                )}</T>

                {/* Weight & Valuation Metrics Box */}
                <div className={styles.metricsBox}>
                  <div className={styles.metricItem}>
                    <span className={styles.metricItemLabel}><T>Collector Weight</T></span>
                    <span className={styles.metricItemValue}><T>{lot.weight_kg}</T><T> kg</T></span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricItemLabel}><T>Offered Payout</T></span>
                    <span className={styles.metricItemPayout}><T>₹</T><T>{lot.estimated_value.toLocaleString()}</T></span>
                  </div>
                  <div className={styles.metricSubItem}>
                    <span className={styles.metricSubLabel}><T>Rate / kg</T></span>
                    <span className={styles.metricSubValue}><T>₹</T><T>{lot.ai_suggested_rate_per_kg}</T><T>/kg</T></span>
                  </div>
                  <div className={styles.metricSubItem}>
                    <span className={styles.metricSubLabel}><T>AI Confidence</T></span>
                    <span className={styles.metricSubAi}>
                      <T>{Math.round(lot.ai_confidence * 100)}</T><T>% Verified
                    </T></span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className={styles.cardActions}>
                <T>{isAccepted ? (
                  <button
                    type="button"
                    className={styles.proceedHandoverBtn}
                    onClick={() => onInitiateHandover(match)}
                  >
                    <Check size={16} />
                    <span><T>Proceed to Handover & QR</T></span>
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className={styles.acceptLotBtn}
                    onClick={() => handleAccept(match)}
                  ><T>
                    Accept Lot @ ₹</T><T>{lot.ai_suggested_rate_per_kg}</T><T>/kg
                  </T></button>
                )}</T>
              </div>
            </div>
          );
        })}</T>
      </div>
    </div>
  );
}
