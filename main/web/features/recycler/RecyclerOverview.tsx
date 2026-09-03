'use client';

import React from 'react';
import {
  Package,
  ShieldCheck,
  IndianRupee,
  ArrowUpRight,
  Sparkles,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { LotMatch } from '@/types/database';
import styles from './Recycler.module.css';

interface RecyclerOverviewProps {
  matchedLots: LotMatch[];
  onNavigateToLots: () => void;
  onNavigateToHandover: () => void;
  onNavigateToRateCards: () => void;
}

export default function RecyclerOverview({
  matchedLots,
  onNavigateToLots,
  onNavigateToHandover,
  onNavigateToRateCards,
}: RecyclerOverviewProps) {
  const totalOfferedWeight = matchedLots.reduce(
    (acc, m) => acc + (m.lot?.weight_kg || 0),
    0
  );
  const totalOfferedValue = matchedLots.reduce(
    (acc, m) => acc + (m.lot?.estimated_value || 0),
    0
  );

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={`${styles.pageHeader} drop-segment-1`}>
        <div>
          <h2 className={styles.pageTitle}>Procurement & Facility Dashboard</h2>
          <p className={styles.pageSubtitle}>
            Real-time matched e-waste lots from informal collectors across Delhi Industrial Clusters.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className={`${styles.kpiGrid} drop-segment-2`}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>Incoming Matched Lots</span>
            <Package size={18} className={styles.kpiIconBrand} />
          </div>
          <div className={styles.kpiValue}>{matchedLots.length}</div>
          <div className={styles.kpiSub}>
            <ArrowUpRight size={14} className={styles.kpiSuccessIcon} />
            <span>Deterministic matches in Delhi</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>Available Volume</span>
            <Sparkles size={18} className={styles.kpiIconBrand} />
          </div>
          <div className={styles.kpiValue}>{totalOfferedWeight.toFixed(1)} kg</div>
          <div className={styles.kpiSub}>
            <span>Across PCB, Batteries & Cables</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>Estimated Lot Value</span>
            <IndianRupee size={18} className={styles.kpiIconBrand} />
          </div>
          <div className={styles.kpiValue}>₹{totalOfferedValue.toLocaleString()}</div>
          <div className={styles.kpiSub}>
            <span>Based on 7-day rolling benchmark</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>Traceable Handovers</span>
            <ShieldCheck size={18} className={styles.kpiIconBrand} />
          </div>
          <div className={styles.kpiValue}>100%</div>
          <div className={styles.kpiSub}>
            <span className={styles.kpiSuccessText}>DPCC EPR Compliance Ready</span>
          </div>
        </div>
      </div>

      {/* Action Banner for Matched Lots */}
      <div className={`${styles.bannerCard} drop-segment-3`}>
        <div className={styles.bannerContent}>
          <div className={styles.bannerBadgeRow}>
            <span className={styles.bannerBadge}>NEW LOTS AWAITING REVIEW</span>
            <span className={styles.bannerZone}>Mandoli & Okhla Zones</span>
          </div>
          <h3 className={styles.bannerTitle}>
            {matchedLots.length} High-Affinity E-Waste Lots Ready for Procurement
          </h3>
          <p className={styles.bannerDesc}>
            Pre-classified via Gemini Vision AI and scored by PostGIS geographic proximity to your facility.
          </p>
        </div>
        <div className={styles.bannerActions}>
          <button type="button" className={styles.primaryActionBtn} onClick={onNavigateToLots}>
            Review Matched Lots
          </button>
          <button type="button" className={styles.secondaryActionBtn} onClick={onNavigateToRateCards}>
            Update My Rates
          </button>
        </div>
      </div>

      {/* Recent Candidate Lots Table */}
      <div className={`${styles.tableCard} drop-segment-4`}>
        <div className={styles.cardHeaderBar}>
          <h3 className={styles.cardTitle}>Top Candidate Lots</h3>
          <button
            type="button"
            className={styles.viewAllBtn}
            onClick={onNavigateToLots}
          >
            <span>View All ({matchedLots.length})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.customTable}>
            <thead>
              <tr>
                <th>Category</th>
                <th>Collector</th>
                <th>Weight</th>
                <th>AI Suggested Rate</th>
                <th>Estimated Total</th>
                <th>Match Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {matchedLots.slice(0, 4).map((match) => (
                <tr key={match.id}>
                  <td>
                    <div className={styles.tablePrimaryText}>
                      {match.lot?.sub_code.replace(/_/g, ' ').toUpperCase()}
                    </div>
                    <div className={styles.tableSecondaryText}>
                      {match.lot?.parent_code}
                    </div>
                  </td>
                  <td>
                    <div className={styles.collectorNameRow}>
                      <MapPin size={13} className={styles.locationPin} />
                      <span>{match.lot?.collector_name}</span>
                    </div>
                    <div className={styles.tableSecondaryText}>
                      {match.lot?.ward_name}
                    </div>
                  </td>
                  <td>
                    <span className={styles.weightCell}>
                      {match.lot?.weight_kg} kg
                    </span>
                  </td>
                  <td>₹{match.lot?.ai_suggested_rate_per_kg}/kg</td>
                  <td>
                    <span className={styles.valuationCell}>
                      ₹{match.lot?.estimated_value.toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <span className={styles.matchScoreBadge}>
                      {match.score}% match
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={styles.inspectBtn}
                      onClick={onNavigateToLots}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
