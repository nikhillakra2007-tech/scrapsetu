'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  QrCode,
  CheckCircle2,
  Search,
  Filter,
  ArrowUpRight,
  Receipt,
} from 'lucide-react';

export default function HandoverTraceabilityView() {
  const [searchQuery, setSearchQuery] = useState('');

  const records = [
    {
      refCode: 'KC-DL-982A1B',
      material: 'MOBILE PHONE PCB (HIGH GRADE)',
      collector: 'Ramesh Kabadi (Shahdara)',
      recycler: 'M/s Fozia Traders (Mandoli DPCC-033)',
      scaleWeight: '14.20 kg',
      payout: '₹6,390',
      status: 'VERIFIED & LOCKED',
      timestamp: 'Today, 12:45 PM',
      method: 'APP TAP CONFIRMED',
    },
    {
      refCode: 'KC-DL-412C8E',
      material: 'LITHIUM-ION MOBILE BATTERIES',
      collector: 'Okhla Scrap Aggregator',
      recycler: 'M/s Shivnath Computers (Okhla DPCC-150)',
      scaleWeight: '28.50 kg',
      payout: '₹5,130',
      status: 'VERIFIED & LOCKED',
      timestamp: 'Today, 11:15 AM',
      method: 'QR SCAN VERIFIED',
    },
    {
      refCode: 'KC-DL-773D9F',
      material: 'INSULATED COPPER WIRE (THICK)',
      collector: 'Ramesh Kabadi (Shahdara)',
      recycler: 'M/s Greenscape Eco Management (Patparganj)',
      scaleWeight: '45.00 kg',
      payout: '₹17,325',
      status: 'VERIFIED & LOCKED',
      timestamp: 'Yesterday, 04:30 PM',
      method: 'APP TAP CONFIRMED',
    },
  ];

  const filtered = records.filter(
    (r) =>
      r.refCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.collector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Traceability Ledger & Handover Audit</h2>
          <p>
            Immutable digital handover records linking informal waste-pickers with CPCB/DPCC authorized recyclers.
          </p>
        </div>

        {/* Search input */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px' }}
            placeholder="Search by KC-DL code or collector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="content-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Reference ID</th>
                <th>Material</th>
                <th>Collector</th>
                <th>Authorized Recycler</th>
                <th>Scale Weight</th>
                <th>Payout</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((rec) => (
                <tr key={rec.refCode}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <QrCode size={16} color="var(--emerald-accent)" />
                      <span style={{ fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
                        {rec.refCode}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {rec.timestamp}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {rec.material}
                    </div>
                  </td>
                  <td>{rec.collector}</td>
                  <td>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {rec.recycler}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--emerald-accent)' }}>
                      {rec.method}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700 }}>{rec.scaleWeight}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: 'var(--emerald-accent)' }}>
                      {rec.payout}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-safe">
                      <CheckCircle2 size={12} />
                      {rec.status}
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
