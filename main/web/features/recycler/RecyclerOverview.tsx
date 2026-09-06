"use client";
import { T } from '@/components/language/Language';

import React from "react";
import {
  Package,
  ShieldCheck,
  IndianRupee,
  ArrowUpRight,
  Sparkles,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { LotMatch } from "@/types/database";
import styles from "./Recycler.module.css";

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
    0,
  );
  const totalOfferedValue = matchedLots.reduce(
    (acc, m) => acc + (m.lot?.estimated_value || 0),
    0,
  );

  return (
    <div className={styles.container}>
      {/* KPI Stats Grid */}
      <div className={`${styles.kpiGrid} drop-segment-2`}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span><T>Incoming lots</T></span>
            <Package size={18} className={styles.kpiIconBrand} />
          </div>
          <div className={styles.kpiValue}><T>{matchedLots.length}</T></div>
          <div className={styles.kpiSub}>
            <ArrowUpRight size={14} className={styles.kpiSuccessIcon} />
            <span><T>Ready for your review</T></span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span><T>Available material</T></span>
            <Sparkles size={18} className={styles.kpiIconBrand} />
          </div>
          <div className={styles.kpiValue}>
            <T>{totalOfferedWeight.toFixed(1)}</T><T> kg
          </T></div>
          <div className={styles.kpiSub}>
            <span><T>Across PCB, Batteries & Cables</T></span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span><T>Estimated value</T></span>
            <IndianRupee size={18} className={styles.kpiIconBrand} />
          </div>
          <div className={styles.kpiValue}><T>
            ₹</T><T>{totalOfferedValue.toLocaleString()}</T>
          </div>
          <div className={styles.kpiSub}>
            <span><T>Based on 7-day rolling benchmark</T></span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span><T>Digital records</T></span>
            <ShieldCheck size={18} className={styles.kpiIconBrand} />
          </div>
          <div className={styles.kpiValue}><T>QR</T></div>
          <div className={styles.kpiSub}>
            <span className={styles.kpiSuccessText}><T>
              Keep a record of each exchange
            </T></span>
          </div>
        </div>
      </div>

      {/* Action Banner for Matched Lots */}
      <div className={`${styles.bannerCard} drop-segment-3`}>
        <div className={styles.bannerContent}>
          <div className={styles.bannerBadgeRow}>
            <span className={styles.bannerBadge}><T>A LITTLE MOMENTUM</T></span>
            <span className={styles.bannerZone}><T>Mandoli & Okhla Zones</T></span>
          </div>
          <h3 className={styles.bannerTitle}><T>
            Your next good exchange is waiting.
          </T></h3>
          <p className={styles.bannerDesc}><T>
            Explore materials matched to your facility. Review the details and
            choose what works for you.
          </T></p>
        </div>
        <div className={styles.bannerActions}>
          <button
            type="button"
            className={styles.primaryActionBtn}
            onClick={onNavigateToLots}
          ><T>
            Explore incoming lots
          </T></button>
          <button
            type="button"
            className={styles.secondaryActionBtn}
            onClick={onNavigateToRateCards}
          ><T>
            Manage rates
          </T></button>
        </div>
      </div>

      {/* Recent Candidate Lots Table */}
      <div className={`${styles.tableCard} drop-segment-4`}>
        <div className={styles.cardHeaderBar}>
          <h3 className={styles.cardTitle}><T>Materials worth a closer look</T></h3>
          <button
            type="button"
            className={styles.viewAllBtn}
            onClick={onNavigateToLots}
          >
            <span><T>View All (</T><T>{matchedLots.length}</T><T>)</T></span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.customTable}>
            <thead>
              <tr>
                <th><T>Category</T></th>
                <th><T>Collector</T></th>
                <th><T>Weight</T></th>
                <th><T>Indicative rate</T></th>
                <th><T>Estimated Total</T></th>
                <th><T>Match</T></th>
                <th><T>Action</T></th>
              </tr>
            </thead>
            <tbody>
              <T>{matchedLots.slice(0, 4).map((match) => (
                <tr key={match.id}>
                  <td>
                    <div className={styles.tablePrimaryText}>
                      <T>{match.lot?.sub_code.replace(/_/g, " ").toUpperCase()}</T>
                    </div>
                    <div className={styles.tableSecondaryText}>
                      <T>{match.lot?.parent_code}</T>
                    </div>
                  </td>
                  <td>
                    <div className={styles.collectorNameRow}>
                      <MapPin size={13} className={styles.locationPin} />
                      <span><T>{match.lot?.collector_name}</T></span>
                    </div>
                    <div className={styles.tableSecondaryText}>
                      <T>{match.lot?.ward_name}</T>
                    </div>
                  </td>
                  <td>
                    <span className={styles.weightCell}>
                      <T>{match.lot?.weight_kg}</T><T> kg
                    </T></span>
                  </td>
                  <td><T>₹</T><T>{match.lot?.ai_suggested_rate_per_kg}</T><T>/kg</T></td>
                  <td>
                    <span className={styles.valuationCell}><T>
                      ₹</T><T>{match.lot?.estimated_value.toLocaleString()}</T>
                    </span>
                  </td>
                  <td>
                    <span className={styles.matchScoreBadge}>
                      <T>{match.score}</T><T>% match
                    </T></span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={styles.inspectBtn}
                      onClick={onNavigateToLots}
                    ><T>
                      Inspect
                    </T></button>
                  </td>
                </tr>
              ))}</T>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
