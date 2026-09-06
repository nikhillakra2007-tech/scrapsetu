'use client';
import { T, useLocale } from '@/components/language/Language';

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
 const {t:translate}=useLocale();

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
          <h2 className={styles.pageTitle}><T>Delhi E-Waste Price Board</T></h2>
          <p className={styles.pageSubtitle}><T>
            7-day rolling benchmark aggregated from verified formal recyclers across Delhi industrial clusters.
          </T></p>
        </div>
        <div className={styles.updateBadge}>
          <span><T>UPDATED HOURLY · DPCC RECYCLER POOL</T></span>
        </div>
      </div>

      {/* Benchmark Cards Grid */}
      <div className={styles.cardsGrid}>
        <T>{MOCK_PRICE_BOARD.map((item) => {
          const isSpeaking = speakingItem === item.sub_code;

          return (
            <div key={item.sub_code} className={styles.priceCard}>
              <div>
                {/* Header Tag and Audio Action */}
                <div className={styles.cardHeader}>
                  <span className={styles.cpcbTag}><T>{item.parent_code}</T></span>

                  <div className={styles.headerRightGroup}>
                    <T>{item.is_hazardous && (
                      <span className={styles.hazardTag}>
                        <AlertTriangle size={11} />
                        <span><T>HAZARDOUS</T></span>
                      </span>
                    )}</T>

                    {/* Hindi Audio Read-Aloud */}
                    <button
                      type="button"
                      onClick={() => speakPrice(item)}
                      className={`${styles.speechBtn} ${isSpeaking ? styles.speechBtnSpeaking : ''}`}
                      title={translate("Read aloud in Hindi")}
                    >
                      <Volume2 size={13} />
                      <span><T>{isSpeaking ? 'बोल रहा है...' : 'बोलें 🔊'}</T></span>
                    </button>
                  </div>
                </div>

                <h3 className={styles.itemTitle}><T>{item.sub_name}</T></h3>

                {/* Main Benchmark Price */}
                <div className={styles.priceRow}>
                  <div className={styles.priceValue}><T>₹</T><T>{item.avg_price_per_kg}</T></div>
                  <div className={styles.priceUnit}><T>/ kg</T></div>

                  <T>{item.trend_percentage && (
                    <div
                      className={`${styles.trendBadge} ${
                        item.trend_percentage >= 0 ? styles.trendPositive : styles.trendNegative
                      }`}
                    >
                      <T>{item.trend_percentage >= 0 ? (
                        <ArrowUpRight size={14} />
                      ) : (
                        <ArrowDownRight size={14} />
                      )}</T>
                      <span><T>{Math.abs(item.trend_percentage)}</T><T>% 7d</T></span>
                    </div>
                  )}</T>
                </div>

                {/* Min / Max Spread Box */}
                <div className={styles.spreadBox}>
                  <div className={styles.spreadItem}>
                    <span className={styles.spreadLabel}><T>Min: </T></span>
                    <strong className={styles.spreadVal}><T>₹</T><T>{item.min_price_per_kg}</T><T>/kg</T></strong>
                  </div>
                  <div className={styles.spreadItem}>
                    <span className={styles.spreadLabel}><T>Max: </T></span>
                    <strong className={styles.spreadVal}><T>₹</T><T>{item.max_price_per_kg}</T><T>/kg</T></strong>
                  </div>
                  <div className={styles.spreadItem}>
                    <span className={styles.spreadLabel}><T>Trades: </T></span>
                    <span><T>{item.data_points_count}</T></span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}</T>
      </div>
    </div>
  );
}
