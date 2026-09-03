'use client';

import React, { useState } from 'react';
import {
  Volume2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';
import { MOCK_PRICE_BOARD } from '@/lib/mock-data';
import styles from './PriceBoard.module.css';

export default function LivePriceBoard() {
  const [speakingItem, setSpeakingItem] = useState<string | null>(null);

  // Audio Speech Synthesis for accessibility / low-literacy users (PRD FR10)
  const speakPrice = (item: (typeof MOCK_PRICE_BOARD)[0]) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    setSpeakingItem(item.sub_code);

    const hindiText = `आज दिल्ली में ${item.sub_name} का औसत भाव ${Math.round(item.avg_price_per_kg)} रुपये प्रति किलोग्राम है। न्यूनतम भाव ${Math.round(item.min_price_per_kg)} रुपये और अधिकतम भाव ${Math.round(item.max_price_per_kg)} रुपये है।`;

    const utterance = new SpeechSynthesisUtterance(hindiText);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setSpeakingItem(null);
    utterance.onerror = () => setSpeakingItem(null);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Delhi E-Waste Price Board</h2>
          <p className={styles.pageSubtitle}>
            7-day rolling benchmark aggregated from verified formal recyclers across Delhi industrial clusters.
          </p>
        </div>
        <div className={styles.updateBadge}>
          <span>UPDATED HOURLY · DPCC RECYCLER POOL</span>
        </div>
      </div>

      {/* Benchmark Cards Grid */}
      <div className={styles.cardsGrid}>
        {MOCK_PRICE_BOARD.map((item) => {
          const isSpeaking = speakingItem === item.sub_code;

          return (
            <div key={item.sub_code} className={styles.priceCard}>
              <div>
                {/* Header Tag and Audio Action */}
                <div className={styles.cardHeader}>
                  <span className={styles.cpcbTag}>{item.parent_code}</span>

                  <div className={styles.headerRightGroup}>
                    {item.is_hazardous && (
                      <span className={styles.hazardTag}>
                        <AlertTriangle size={11} />
                        <span>HAZARDOUS</span>
                      </span>
                    )}

                    {/* Hindi Audio Read-Aloud */}
                    <button
                      type="button"
                      onClick={() => speakPrice(item)}
                      className={`${styles.speechBtn} ${isSpeaking ? styles.speechBtnSpeaking : ''}`}
                      title="Read aloud in Hindi"
                    >
                      <Volume2 size={13} />
                      <span>{isSpeaking ? 'बोल रहा है...' : 'बोलें 🔊'}</span>
                    </button>
                  </div>
                </div>

                <h3 className={styles.itemTitle}>{item.sub_name}</h3>

                {/* Main Benchmark Price */}
                <div className={styles.priceRow}>
                  <div className={styles.priceValue}>₹{item.avg_price_per_kg}</div>
                  <div className={styles.priceUnit}>/ kg</div>

                  {item.trend_percentage && (
                    <div
                      className={`${styles.trendBadge} ${
                        item.trend_percentage >= 0 ? styles.trendPositive : styles.trendNegative
                      }`}
                    >
                      {item.trend_percentage >= 0 ? (
                        <ArrowUpRight size={14} />
                      ) : (
                        <ArrowDownRight size={14} />
                      )}
                      <span>{Math.abs(item.trend_percentage)}% 7d</span>
                    </div>
                  )}
                </div>

                {/* Min / Max Spread Box */}
                <div className={styles.spreadBox}>
                  <div className={styles.spreadItem}>
                    <span className={styles.spreadLabel}>Min: </span>
                    <strong className={styles.spreadVal}>₹{item.min_price_per_kg}/kg</strong>
                  </div>
                  <div className={styles.spreadItem}>
                    <span className={styles.spreadLabel}>Max: </span>
                    <strong className={styles.spreadVal}>₹{item.max_price_per_kg}/kg</strong>
                  </div>
                  <div className={styles.spreadItem}>
                    <span className={styles.spreadLabel}>Trades: </span>
                    <span>{item.data_points_count}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
