'use client';
import { T } from '@/components/language/Language';

import React, { useState } from 'react';
import { Save, CheckCircle2, TrendingUp } from 'lucide-react';
import { RecyclerRateCard } from '@/types/database';
import { MOCK_RATE_CARDS } from '@/lib/mock-data';
import styles from './Recycler.module.css';

export default function RateCardManager() {
  const [rates, setRates] = useState<RecyclerRateCard[]>(MOCK_RATE_CARDS);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleRateChange = (id: string, newRate: number) => {
    setRates((prev) =>
      prev.map((r) => (r.id === id ? { ...r, rate_per_kg: newRate } : r))
    );
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}><T>Procurement Rate Cards</T></h2>
          <p className={styles.pageSubtitle}><T>
            Configure your offered procurement rates per kg across Delhi industrial zones.
            Competitive rates increase deterministic matching priority in PostGIS scoring.
          </T></p>
        </div>
        <button type="button" className={styles.saveRateBtn} onClick={handleSave}>
          <Save size={16} />
          <span><T>Save Changes</T></span>
        </button>
      </div>

      <T>{savedSuccess && (
        <div className={styles.saveSuccessNotice}>
          <CheckCircle2 size={18} />
          <span><T>Rate card successfully updated & broadcasted to matching engine.</T></span>
        </div>
      )}</T>

      {/* 1. Mobile Adaptive Rate Cards (Zero horizontal scroll, full digits visible) */}
      <div className={styles.mobileRateCardsContainer}>
        <T>{rates.map((card) => {
          const minBench = Math.round(card.rate_per_kg * 0.96);
          const maxBench = Math.round(card.rate_per_kg * 1.05);
          return (
            <div key={card.id} className={styles.mobileRateCard}>
              <div className={styles.mobileRateCardTop}>
                <span className={styles.cpcbTag}><T>{card.parent_code}</T></span>
                <span className={styles.mobileBenchmarkBadge}>
                  <TrendingUp size={12} />
                  <span><T>Delhi: ₹</T><T>{minBench}</T><T>–₹</T><T>{maxBench}</T></span>
                </span>
              </div>

              <div className={styles.mobileRateMaterialTitle}>
                <T>{card.sub_code.replace(/_/g, ' ').toUpperCase()}</T>
              </div>

              <div className={styles.mobileRateInputRow}>
                <span className={styles.mobileRateLabel}><T>Your Offered Rate:</T></span>
                <div className={styles.rateInputWrapper}>
                  <span className={styles.currencySymbol}><T>₹</T></span>
                  <input
                    type="number"
                    className={styles.rateInput}
                    value={card.rate_per_kg}
                    onChange={(e) =>
                      handleRateChange(card.id, parseFloat(e.target.value) || 0)
                    }
                  />
                  <span className={styles.rateUnitText}><T>/kg</T></span>
                </div>
              </div>
            </div>
          );
        })}</T>
      </div>

      {/* 2. Desktop Full Table (Visible on screens > 768px) */}
      <div className={styles.desktopTableCard}>
        <div className={styles.tableResponsive}>
          <table className={styles.customTable}>
            <thead>
              <tr>
                <th><T>Category</T></th>
                <th><T>Sub-Classification</T></th>
                <th><T>Current Delhi Benchmark</T></th>
                <th><T>Your Offered Rate (₹/kg)</T></th>
                <th><T>Effective Date</T></th>
              </tr>
            </thead>
            <tbody>
              <T>{rates.map((card) => (
                <tr key={card.id}>
                  <td>
                    <span className={styles.cpcbTag}><T>{card.parent_code}</T></span>
                  </td>
                  <td>
                    <div className={styles.tablePrimaryText}>
                      <T>{card.sub_code.replace(/_/g, ' ').toUpperCase()}</T>
                    </div>
                  </td>
                  <td>
                    <span className={styles.tableSecondaryText}><T>
                      ₹</T><T>{Math.round(card.rate_per_kg * 0.96)}</T><T> - ₹</T><T>{Math.round(card.rate_per_kg * 1.05)}</T><T> /kg
                    </T></span>
                  </td>
                  <td style={{ minWidth: '180px' }}>
                    <div className={styles.rateInputWrapper}>
                      <span className={styles.currencySymbol}><T>₹</T></span>
                      <input
                        type="number"
                        className={styles.rateInput}
                        value={card.rate_per_kg}
                        onChange={(e) =>
                          handleRateChange(card.id, parseFloat(e.target.value) || 0)
                        }
                      />
                      <span className={styles.rateUnitText}><T>/kg</T></span>
                    </div>
                  </td>
                  <td>
                    <span className={styles.tableSecondaryText}>
                      <T>{card.effective_date}</T>
                    </span>
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
