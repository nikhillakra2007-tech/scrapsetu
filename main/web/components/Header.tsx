'use client';

import React from 'react';
import { MapPin, Shield, Bell, CheckCircle2 } from 'lucide-react';
import { CURRENT_RECYCLER } from '@/lib/mock-data';

interface HeaderProps {
  currentTab: string;
}

export default function Header({ currentTab }: HeaderProps) {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'recycler-overview': return 'Recycler Command Center';
      case 'matched-lots': return 'Matched Incoming Scrap Lots';
      case 'handover': return 'Digital Handover & QR Traceability';
      case 'rate-cards': return 'Recycler Procurement Rate Cards';
      case 'customer-pickup': return 'Customer & Bulk Generator Portal';
      case 'price-board': return 'Transparent Rolling Price Benchmark';
      case 'safety-guidance': return 'Worker Safety & Hazardous Material Rules';
      default: return 'Kabadiwala Connect';
    }
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>{getTabTitle()}</h2>
        </div>
        <div className="location-tag">
          <MapPin size={14} />
          <span>Delhi Pilot (Shahdara & Okhla)</span>
        </div>
      </div>

      <div className="header-right">
        {/* Recycler Authorization Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
            fontSize: '13px',
          }}
        >
          <CheckCircle2 size={16} color="#10b981" />
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {CURRENT_RECYCLER.business_name.split('(')[0]}
          </span>
          <span
            style={{
              fontSize: '11px',
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              fontWeight: 700,
            }}
          >
            DPCC VERIFIED
          </span>
        </div>
      </div>
    </header>
  );
}
