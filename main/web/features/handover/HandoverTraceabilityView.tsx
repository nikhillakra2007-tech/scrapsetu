'use client';

import React, { useState } from 'react';
import {
  QrCode,
  CheckCircle2,
  Search,
} from 'lucide-react';
import styles from './Handover.module.css';

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
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Traceability Ledger & Handover Audit</h2>
          <p className={styles.pageSubtitle}>
            Immutable digital handover records linking informal waste-pickers with CPCB/DPCC authorized recyclers.
          </p>
        </div>

        {/* Search Input */}
        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by KC-DL code, material, collector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Audit Table Card */}
      <div className={styles.tableCard}>
        <div className={styles.tableResponsive}>
          <table className={styles.customTable}>
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
                    <div className={styles.refCodeGroup}>
                      <QrCode size={16} className={styles.qrCodeIcon} />
                      <span className={styles.refCodeText}>
                        {rec.refCode}
                      </span>
                    </div>
                    <div className={styles.timestampText}>
                      {rec.timestamp}
                    </div>
                  </td>
                  <td>
                    <div className={styles.materialNameText}>
                      {rec.material}
                    </div>
                  </td>
                  <td>
                    <span className={styles.collectorNameText}>
                      {rec.collector}
                    </span>
                  </td>
                  <td>
                    <div className={styles.recyclerNameText}>
                      {rec.recycler}
                    </div>
                    <div className={styles.methodTag}>
                      {rec.method}
                    </div>
                  </td>
                  <td>
                    <span className={styles.scaleWeightText}>{rec.scaleWeight}</span>
                  </td>
                  <td>
                    <span className={styles.payoutText}>
                      {rec.payout}
                    </span>
                  </td>
                  <td>
                    <span className={styles.verifiedBadge}>
                      <CheckCircle2 size={13} />
                      <span>{rec.status}</span>
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
