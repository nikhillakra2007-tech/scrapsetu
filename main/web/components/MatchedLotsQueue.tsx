'use client';

import React, { useState } from 'react';
import {
  Package,
  MapPin,
  Sparkles,
  Check,
  AlertTriangle,
  Flame,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { LotMatch } from '@/types/database';

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
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Incoming Matched Scrap Lots</h2>
          <p>
            Candidate lots pre-ranked by PostGIS distance, category rate, and
            facility authorization.
          </p>
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['ALL', 'PCB', 'BATTERY', 'CABLE_WIRE', 'WHOLE_DEVICE'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Lot Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {filteredLots.map((match) => {
          const lot = match.lot;
          if (!lot) return null;
          const isAccepted = acceptedIds[match.id];

          return (
            <div
              key={match.id}
              className="content-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                border: isAccepted ? '1px solid var(--emerald-accent)' : '1px solid var(--border-subtle)',
              }}
            >
              {/* Header Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span className="badge badge-cyan" style={{ fontSize: '11px', fontWeight: 700 }}>
                    {lot.parent_code}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="badge badge-safe" style={{ fontSize: '11px' }}>
                      {match.score}% MATCH SCORE
                    </span>
                  </div>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
                  {lot.sub_code.replace(/_/g, ' ').toUpperCase()}
                </h3>

                {/* Location and Collector info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  <MapPin size={14} color="var(--emerald-accent)" />
                  <span>{lot.ward_name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>• {lot.collector_name}</span>
                </div>

                {/* Hazard Flags */}
                {lot.hazard_flags.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    {lot.hazard_flags.map((flag) => (
                      <span key={flag} className="badge badge-hazard" style={{ fontSize: '11px' }}>
                        <Flame size={12} />
                        {flag.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                )}

                {/* Weight & Valuation Metrics Box */}
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    marginBottom: '18px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Collector Weight
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {lot.weight_kg} kg
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Offered Payout
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--emerald-accent)' }}>
                      ₹{lot.estimated_value.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Rate / kg</div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>₹{lot.ai_suggested_rate_per_kg}/kg</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Vision AI Confidence</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#38bdf8' }}>
                      {Math.round(lot.ai_confidence * 100)}% Verified
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div>
                {isAccepted ? (
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    onClick={() => onInitiateHandover(match)}
                  >
                    <Check size={16} />
                    <span>Proceed to Handover & QR</span>
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAccept(match)}
                    >
                      Accept Lot @ ₹{lot.ai_suggested_rate_per_kg}/kg
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
