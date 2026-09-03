'use client';

import React from 'react';
import styles from './Collector.module.css';

interface LocationSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const DELHI_PILOT_WARDS = [
  { id: 'okhla-1', name: 'Okhla Industrial Area Phase 1' },
  { id: 'mandoli-shahdara', name: 'Mandoli & Shahdara E-Waste Hub' },
  { id: 'patparganj', name: 'Patparganj Industrial Area' },
  { id: 'peeragarhi', name: 'Peeragarhi Electronics Market' },
  { id: 'mohan-coop', name: 'Mohan Cooperative Industrial Estate' },
];

export default function LocationSelector({ value, onChange, disabled }: LocationSelectorProps) {
  return (
    <div className={styles.inputGroup}>
      <label htmlFor="delhi-ward-select" className={styles.inputLabel}>
        Pilot Ward / Industrial Cluster
      </label>
      <select
        id="delhi-ward-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={styles.selectInput}
      >
        {DELHI_PILOT_WARDS.map((w) => (
          <option key={w.id} value={w.name}>
            {w.name}
          </option>
        ))}
      </select>
      <span className={styles.fieldHint}>
        Matched against authorized recyclers within DPCC proximity
      </span>
    </div>
  );
}
