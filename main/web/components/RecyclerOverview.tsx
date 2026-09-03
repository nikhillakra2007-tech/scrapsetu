'use client';

import React from 'react';
import {
  TrendingUp,
  Package,
  ShieldCheck,
  IndianRupee,
  ArrowUpRight,
  Clock,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { LotMatch } from '@/types/database';

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
    <div>
      <div className="page-header">
        <h2>Procurement & Facility Dashboard</h2>
        <p>
          Real-time matched e-waste lots from informal collectors across Delhi
          Industrial Clusters.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span>Incoming Matched Lots</span>
            <Package size={18} color="var(--emerald-accent)" />
          </div>
          <div className="stat-value">{matchedLots.length}</div>
          <div className="stat-subtext positive">
            <ArrowUpRight size={14} />
            <span>Deterministic matches in Delhi</span>
          </div>
        </div>

        <div className="stat-card cyan">
          <div className="stat-header">
            <span>Available Volume</span>
            <Sparkles size={18} color="var(--cyan-accent)" />
          </div>
          <div className="stat-value">{totalOfferedWeight.toFixed(1)} kg</div>
          <div className="stat-subtext">
            <span>Across PCB, Batteries & Cable</span>
          </div>
        </div>

        <div className="stat-card amber">
          <div className="stat-header">
            <span>Estimated Lot Value</span>
            <IndianRupee size={18} color="var(--amber-accent)" />
          </div>
          <div className="stat-value">₹{totalOfferedValue.toLocaleString()}</div>
          <div className="stat-subtext">
            <span>Based on 7-day rolling benchmark</span>
          </div>
        </div>

        <div className="stat-card violet">
          <div className="stat-header">
            <span>Traceable Handovers</span>
            <ShieldCheck size={18} color="var(--violet-accent)" />
          </div>
          <div className="stat-value">100%</div>
          <div className="stat-subtext positive">
            <span>DPCC EPR Compliance Ready</span>
          </div>
        </div>
      </div>

      {/* Action Banner for Matched Lots */}
      <div
        className="content-card"
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 182, 212, 0.06))',
          borderColor: 'var(--border-active)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-safe">NEW LOTS AWAITING REVIEW</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Mandoli & Okhla Zones
            </span>
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>
            {matchedLots.length} High-Affinity E-Waste Lots Ready for Acceptance
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '600px' }}>
            Pre-classified via Gemini Vision AI and scored by PostGIS geographic proximity to your Mandoli facility.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" onClick={onNavigateToLots}>
            Review Matched Lots
          </button>
          <button className="btn btn-secondary" onClick={onNavigateToRateCards}>
            Update My Rates
          </button>
        </div>
      </div>

      {/* Recent Matched Lots Preview */}
      <div className="content-card">
        <div className="card-title-bar">
          <h3>Top Candidate Lots</h3>
          <button
            className="btn btn-outline-emerald btn-sm"
            onClick={onNavigateToLots}
          >
            View All ({matchedLots.length})
          </button>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
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
              {matchedLots.slice(0, 3).map((match) => (
                <tr key={match.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {match.lot?.sub_code.replace(/_/g, ' ').toUpperCase()}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {match.lot?.parent_code}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={13} color="var(--text-muted)" />
                      <span>{match.lot?.collector_name}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {match.lot?.ward_name}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {match.lot?.weight_kg} kg
                    </span>
                  </td>
                  <td>₹{match.lot?.ai_suggested_rate_per_kg}/kg</td>
                  <td style={{ fontWeight: 700, color: 'var(--emerald-accent)' }}>
                    ₹{match.lot?.estimated_value.toLocaleString()}
                  </td>
                  <td>
                    <span className="badge badge-safe">
                      {match.score}% match
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
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
