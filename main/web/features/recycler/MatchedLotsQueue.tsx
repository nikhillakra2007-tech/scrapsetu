'use client';

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
          <h2 className={styles.pageTitle}>Incoming Matched Scrap Lots</h2>
          <p className={styles.pageSubtitle}>
            Candidate lots pre-ranked by PostGIS distance, category rate cards, and facility authorization.
          </p>
        </div>

        {/* Category Filters */}
        <div className={styles.filterRow}>
          {['ALL', 'PCB', 'BATTERY', 'CABLE_WIRE', 'WHOLE_DEVICE'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`${styles.filterBtn} ${selectedCategory === cat ? styles.filterBtnActive : ''}`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Lot Cards */}
      <div className={styles.lotsGrid}>
        {filteredLots.map((match) => {
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
                  <span className={styles.lotCategoryBadge}>{lot.parent_code}</span>
                  <span className={styles.lotScoreBadge}>{match.score}% MATCH</span>
                </div>

                <h3 className={styles.lotTitle}>
                  {lot.sub_code.replace(/_/g, ' ').toUpperCase()}
                </h3>

                {/* Location and Collector Info */}
                <div className={styles.lotLocationRow}>
                  <MapPin size={14} className={styles.locationPin} />
                  <span>{lot.ward_name}</span>
                  <span className={styles.collectorSeparator}>• {lot.collector_name}</span>
                </div>

                {/* Hazard Warning Tags */}
                {lot.hazard_flags.length > 0 && (
                  <div className={styles.hazardRow}>
                    {lot.hazard_flags.map((flag) => (
                      <span key={flag} className={styles.hazardBadge}>
                        <Flame size={12} />
                        <span>{flag.replace(/_/g, ' ')}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Weight & Valuation Metrics Box */}
                <div className={styles.metricsBox}>
                  <div className={styles.metricItem}>
                    <span className={styles.metricItemLabel}>Collector Weight</span>
                    <span className={styles.metricItemValue}>{lot.weight_kg} kg</span>
                  </div>
                  <div className={styles.metricItem}>
                    <span className={styles.metricItemLabel}>Offered Payout</span>
                    <span className={styles.metricItemPayout}>₹{lot.estimated_value.toLocaleString()}</span>
                  </div>
                  <div className={styles.metricSubItem}>
                    <span className={styles.metricSubLabel}>Rate / kg</span>
                    <span className={styles.metricSubValue}>₹{lot.ai_suggested_rate_per_kg}/kg</span>
                  </div>
                  <div className={styles.metricSubItem}>
                    <span className={styles.metricSubLabel}>AI Confidence</span>
                    <span className={styles.metricSubAi}>
                      {Math.round(lot.ai_confidence * 100)}% Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className={styles.cardActions}>
                {isAccepted ? (
                  <button
                    type="button"
                    className={styles.proceedHandoverBtn}
                    onClick={() => onInitiateHandover(match)}
                  >
                    <Check size={16} />
                    <span>Proceed to Handover & QR</span>
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className={styles.acceptLotBtn}
                    onClick={() => handleAccept(match)}
                  >
                    Accept Lot @ ₹{lot.ai_suggested_rate_per_kg}/kg
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
