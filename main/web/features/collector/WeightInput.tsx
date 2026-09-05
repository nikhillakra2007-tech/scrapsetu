'use client';

import React from 'react';
import styles from './Collector.module.css';

interface WeightInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export default function WeightInput({ value, onChange, disabled }: WeightInputProps) {
  return (
    <div className={styles.inputGroup}>
      <label htmlFor="collector-weight" className={styles.inputLabel}>
        Collector Scale Weight (kg)
      </label>
      <div className={styles.weightInputWrapper}>
        <input
          id="collector-weight"
          type="number"
          step="any"
          min="0.1"
          value={value || ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          disabled={disabled}
          className={styles.textInput}
          placeholder="e.g. 14.5"
          required
        />
        <span className={styles.weightUnit}>KG</span>
      </div>
      <span className={styles.fieldHint}>
        Physical scale weight
      </span>
    </div>
  );
}
