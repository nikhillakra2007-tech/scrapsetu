'use client';

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
          <h2 className={styles.pageTitle}>Procurement Rate Cards</h2>
          <p className={styles.pageSubtitle}>
            Configure your offered procurement rates per kg across Delhi industrial zones.
            Competitive rates increase deterministic matching priority in PostGIS scoring.
          </p>
        </div>
        <button type="button" className={styles.saveRateBtn} onClick={handleSave}>
          <Save size={16} />
          <span>Save Changes</span>
        </button>
      </div>

      {savedSuccess && (
        <div className={styles.saveSuccessNotice}>
          <CheckCircle2 size={18} />
          <span>Rate card successfully updated & broadcasted to matching engine.</span>
        </div>
      )}

      {/* 1. Mobile Adaptive Rate Cards (Zero horizontal scroll, full digits visible) */}
      <div className={styles.mobileRateCardsContainer}>
        {rates.map((card) => {
          const minBench = Math.round(card.rate_per_kg * 0.96);
          const maxBench = Math.round(card.rate_per_kg * 1.05);
          return (
            <div key={card.id} className={styles.mobileRateCard}>
              <div className={styles.mobileRateCardTop}>
                <span className={styles.cpcbTag}>{card.parent_code}</span>
                <span className={styles.mobileBenchmarkBadge}>
                  <TrendingUp size={12} />
                  <span>Delhi: ₹{minBench}–₹{maxBench}</span>
                </span>
              </div>

              <div className={styles.mobileRateMaterialTitle}>
                {card.sub_code.replace(/_/g, ' ').toUpperCase()}
              </div>

              <div className={styles.mobileRateInputRow}>
                <span className={styles.mobileRateLabel}>Your Offered Rate:</span>
                <div className={styles.rateInputWrapper}>
                  <span className={styles.currencySymbol}>₹</span>
                  <input
                    type="number"
                    className={styles.rateInput}
                    value={card.rate_per_kg}
                    onChange={(e) =>
                      handleRateChange(card.id, parseFloat(e.target.value) || 0)
                    }
                  />
                  <span className={styles.rateUnitText}>/kg</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Desktop Full Table (Visible on screens > 768px) */}
      <div className={styles.desktopTableCard}>
        <div className={styles.tableResponsive}>
          <table className={styles.customTable}>
            <thead>
              <tr>
                <th>Category</th>
                <th>Sub-Classification</th>
                <th>Current Delhi Benchmark</th>
                <th>Your Offered Rate (₹/kg)</th>
                <th>Effective Date</th>
              </tr>
            </thead>
            <tbody>
              {rates.map((card) => (
                <tr key={card.id}>
                  <td>
                    <span className={styles.cpcbTag}>{card.parent_code}</span>
                  </td>
                  <td>
                    <div className={styles.tablePrimaryText}>
                      {card.sub_code.replace(/_/g, ' ').toUpperCase()}
                    </div>
                  </td>
                  <td>
                    <span className={styles.tableSecondaryText}>
                      ₹{Math.round(card.rate_per_kg * 0.96)} - ₹{Math.round(card.rate_per_kg * 1.05)} /kg
                    </span>
                  </td>
                  <td style={{ minWidth: '180px' }}>
                    <div className={styles.rateInputWrapper}>
                      <span className={styles.currencySymbol}>₹</span>
                      <input
                        type="number"
                        className={styles.rateInput}
                        value={card.rate_per_kg}
                        onChange={(e) =>
                          handleRateChange(card.id, parseFloat(e.target.value) || 0)
                        }
                      />
                      <span className={styles.rateUnitText}>/kg</span>
                    </div>
                  </td>
                  <td>
                    <span className={styles.tableSecondaryText}>
                      {card.effective_date}
                    </span>
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
