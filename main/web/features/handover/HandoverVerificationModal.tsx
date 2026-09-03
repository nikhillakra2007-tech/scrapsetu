'use client';

import React, { useState } from 'react';
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  X,
  Scale,
} from 'lucide-react';
import { LotMatch } from '@/types/database';
import styles from './Handover.module.css';

interface HandoverVerificationProps {
  match?: LotMatch | null;
  onClose: () => void;
  onSuccess: (code: string) => void;
}

export default function HandoverVerificationModal({
  match,
  onClose,
  onSuccess,
}: HandoverVerificationProps) {
  const lot = match?.lot;
  const [scaleWeight, setScaleWeight] = useState<string>(
    lot ? String(lot.weight_kg) : '14.20'
  );
  const [confirmationMethod, setConfirmationMethod] = useState<'app_tap' | 'otp' | 'qr_scan'>('app_tap');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi'>('cash');
  const [isCompleted, setIsCompleted] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('KC-DL-982A1B');

  const weightNum = parseFloat(scaleWeight) || 0;
  const rate = lot?.ai_suggested_rate_per_kg || 450;
  const finalPayout = Math.round(weightNum * rate);

  const handleConfirm = () => {
    const code = 'KC-DL-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setGeneratedCode(code);
    setIsCompleted(true);
    onSuccess(code);
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleGroup}>
            <div className={styles.shieldIconWrapper}>
              <ShieldCheck size={20} className={styles.shieldIcon} />
            </div>
            <div>
              <h3 className={styles.modalTitle}>
                {isCompleted ? 'Handover Confirmed' : 'Verify Handover & Traceability'}
              </h3>
              <p className={styles.modalSubtitle}>
                DPCC Rule 2022 Traceability Record · NCT of Delhi
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {isCompleted ? (
          /* Confirmation Receipt View */
          <div className={styles.receiptView}>
            <div className={styles.receiptBanner}>
              <CheckCircle2 size={44} className={styles.receiptCheckIcon} />
              <h4 className={styles.receiptTitle}>Handover Confirmed & Locked</h4>
              <p className={styles.receiptDesc}>
                A permanent audit record has been anchored with timestamp & coordinates.
              </p>

              {/* Unique Reference QR Token */}
              <div className={styles.qrTokenBox}>
                <QrCode size={36} className={styles.qrIcon} />
                <div className={styles.qrTextGroup}>
                  <div className={styles.qrLabel}>UNIQUE HANDOVER ID</div>
                  <div className={styles.qrCodeValue}>{generatedCode}</div>
                </div>
              </div>
            </div>

            <div className={styles.receiptDetails}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Material:</span>
                <span className={styles.detailValue}>
                  {lot?.sub_code.replace(/_/g, ' ').toUpperCase() || 'ELECTRONIC SCRAP'}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Verified Scale Weight:</span>
                <span className={styles.detailValue}>{scaleWeight} kg</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Final Payout:</span>
                <span className={styles.detailValueHighlight}>
                  ₹{finalPayout.toLocaleString()} ({paymentMode.toUpperCase()})
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Facility Location:</span>
                <span className={styles.detailValue}>Mandoli Industrial Area (DPCC-033)</span>
              </div>
            </div>

            <button
              type="button"
              className={styles.finishBtn}
              onClick={onClose}
            >
              Done & Return to Dashboard
            </button>
          </div>
        ) : (
          /* Handover Entry Form */
          <div className={styles.formView}>
            <div className={styles.formGroup}>
              <label htmlFor="facility-scale-weight" className={styles.formLabel}>
                <Scale size={15} />
                <span>Facility Weighbridge Scale Reading (kg)</span>
              </label>
              <input
                id="facility-scale-weight"
                type="number"
                step="0.1"
                className={styles.scaleInput}
                value={scaleWeight}
                onChange={(e) => setScaleWeight(e.target.value)}
                placeholder="Enter physical scale weight"
                required
              />
              <span className={styles.reportedWeightHint}>
                Collector reported weight: {lot?.weight_kg || '14.2'} kg
              </span>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Confirmation Method</label>
              <div className={styles.toggleGrid3}>
                {(['app_tap', 'otp', 'qr_scan'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    className={`${styles.toggleBtn} ${confirmationMethod === method ? styles.toggleBtnActive : ''}`}
                    onClick={() => setConfirmationMethod(method)}
                  >
                    {method.replace('_', ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Settlement Mode</label>
              <div className={styles.toggleGrid2}>
                {(['cash', 'upi'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={`${styles.toggleBtn} ${paymentMode === mode ? styles.toggleBtnActive : ''}`}
                    onClick={() => setPaymentMode(mode)}
                  >
                    {mode === 'cash' ? 'Cash First (Default)' : 'UPI Deep-Link'}
                  </button>
                ))}
              </div>
            </div>

            {/* Payout Calculation Box */}
            <div className={styles.payoutCalcBox}>
              <div className={styles.payoutRow}>
                <span className={styles.payoutLabel}>Calculated Payout:</span>
                <span className={styles.payoutAmount}>₹{finalPayout.toLocaleString()}</span>
              </div>
              <div className={styles.payoutFormula}>
                Agreed Rate: ₹{rate}/kg × {scaleWeight} kg scale reading
              </div>
            </div>

            <div className={styles.modalActionRow}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.confirmHandoverBtn}
                onClick={handleConfirm}
              >
                Sign & Confirm Handover
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
