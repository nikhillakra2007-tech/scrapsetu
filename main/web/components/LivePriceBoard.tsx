'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Volume2,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
} from 'lucide-react';
import { MOCK_PRICE_BOARD } from '@/lib/mock-data';

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
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Delhi E-Waste Price Board</h2>
          <p>
            7-day rolling benchmark aggregated from verified formal recyclers across Delhi industrial clusters.
          </p>
        </div>
        <div className="badge badge-safe" style={{ fontSize: '12px', padding: '6px 14px' }}>
          <span>UPDATED HOURLY VIA PG_CRON</span>
        </div>
      </div>

      {/* Grid of Category Benchmark Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {MOCK_PRICE_BOARD.map((item) => {
          const isSpeaking = speakingItem === item.sub_code;

          return (
            <div
              key={item.sub_code}
              className="content-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'var(--transition-smooth)',
                position: 'relative',
              }}
            >
              <div>
                {/* Header with Hazard Tag & Audio Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="badge badge-cyan" style={{ fontSize: '11px', fontWeight: 700 }}>
                    {item.parent_code}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {item.is_hazardous && (
                      <span className="badge badge-hazard" style={{ fontSize: '10px' }}>
                        <AlertTriangle size={11} /> HAZARDOUS
                      </span>
                    )}

                    {/* Speech TTS Button for Accessibility */}
                    <button
                      onClick={() => speakPrice(item)}
                      className={`btn btn-sm ${isSpeaking ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '4px 8px', borderRadius: 'var(--radius-full)' }}
                      title="Bol ke batao / Read aloud in Hindi"
                    >
                      <Volume2 size={14} color={isSpeaking ? '#ffffff' : 'var(--emerald-accent)'} />
                      <span style={{ fontSize: '11px' }}>{isSpeaking ? 'बोल रहा है...' : 'बोलें 🔊'}</span>
                    </button>
                  </div>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>
                  {item.sub_name}
                </h3>

                {/* Primary Price Metric */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--emerald-accent)', fontFamily: 'Outfit' }}>
                    ₹{item.avg_price_per_kg}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/ kg</div>

                  {item.trend_percentage && (
                    <div
                      style={{
                        marginLeft: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: item.trend_percentage >= 0 ? 'var(--emerald-accent)' : 'var(--rose-accent)',
                      }}
                    >
                      {item.trend_percentage >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      <span>{Math.abs(item.trend_percentage)}% 7d</span>
                    </div>
                  )}
                </div>

                {/* Min / Max Spread Range */}
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Min: </span>
                    <strong>₹{item.min_price_per_kg}/kg</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Max: </span>
                    <strong>₹{item.max_price_per_kg}/kg</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Trades: </span>
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
