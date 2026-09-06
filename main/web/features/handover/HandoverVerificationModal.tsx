'use client';
import { T, useLocale } from '@/components/language/Language';

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
 const {t:translate}=useLocale();

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
                <T>{isCompleted ? 'Handover Confirmed' : 'Verify Handover & Traceability'}</T>
              </h3>
              <p className={styles.modalSubtitle}><T>
                DPCC Rule 2022 Traceability Record · NCT of Delhi
              </T></p>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label={translate("Close modal")}
          >
            <X size={20} />
          </button>
        </div>

        <T>{isCompleted ? (
          /* Confirmation Receipt View */
          <div className={styles.receiptView}>
            <div className={styles.receiptBanner}>
              <CheckCircle2 size={44} className={styles.receiptCheckIcon} />
              <h4 className={styles.receiptTitle}><T>Handover Confirmed & Locked</T></h4>
              <p className={styles.receiptDesc}><T>
                A permanent audit record has been anchored with timestamp & coordinates.
              </T></p>

              {/* Unique Reference QR Token */}
              <div className={styles.qrTokenBox}>
                <QrCode size={36} className={styles.qrIcon} />
                <div className={styles.qrTextGroup}>
                  <div className={styles.qrLabel}><T>UNIQUE HANDOVER ID</T></div>
                  <div className={styles.qrCodeValue}><T>{generatedCode}</T></div>
                </div>
              </div>
            </div>

            <div className={styles.receiptDetails}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}><T>Material:</T></span>
                <span className={styles.detailValue}>
                  <T>{lot?.sub_code.replace(/_/g, ' ').toUpperCase() || 'ELECTRONIC SCRAP'}</T>
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}><T>Verified Scale Weight:</T></span>
                <span className={styles.detailValue}><T>{scaleWeight}</T><T> kg</T></span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}><T>Final Payout:</T></span>
                <span className={styles.detailValueHighlight}><T>
                  ₹</T><T>{finalPayout.toLocaleString()}</T><T> (</T><T>{paymentMode.toUpperCase()}</T><T>)
                </T></span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}><T>Facility Location:</T></span>
                <span className={styles.detailValue}><T>Mandoli Industrial Area (DPCC-033)</T></span>
              </div>
            </div>

            <button
              type="button"
              className={styles.finishBtn}
              onClick={onClose}
            ><T>
              Done & Return to Dashboard
            </T></button>
          </div>
        ) : (
          /* Handover Entry Form */
          <div className={styles.formView}>
            <div className={styles.formGroup}>
              <label htmlFor="facility-scale-weight" className={styles.formLabel}>
                <Scale size={15} />
                <span><T>Facility Weighbridge Scale Reading (kg)</T></span>
              </label>
              <input
                id="facility-scale-weight"
                type="number"
                step="0.1"
                className={styles.scaleInput}
                value={scaleWeight}
                onChange={(e) => setScaleWeight(e.target.value)}
                placeholder={translate("Enter physical scale weight")}
                required
              />
              <span className={styles.reportedWeightHint}><T>
                Collector reported weight: </T><T>{lot?.weight_kg || '14.2'}</T><T> kg
              </T></span>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}><T>Confirmation Method</T></label>
              <div className={styles.toggleGrid3}>
                <T>{(['app_tap', 'otp', 'qr_scan'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    className={`${styles.toggleBtn} ${confirmationMethod === method ? styles.toggleBtnActive : ''}`}
                    onClick={() => setConfirmationMethod(method)}
                  >
                    <T>{method.replace('_', ' ').toUpperCase()}</T>
                  </button>
                ))}</T>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}><T>Settlement Mode</T></label>
              <div className={styles.toggleGrid2}>
                <T>{(['cash', 'upi'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={`${styles.toggleBtn} ${paymentMode === mode ? styles.toggleBtnActive : ''}`}
                    onClick={() => setPaymentMode(mode)}
                  >
                    <T>{mode === 'cash' ? 'Cash First (Default)' : 'UPI Deep-Link'}</T>
                  </button>
                ))}</T>
              </div>
            </div>

            {/* Payout Calculation Box */}
            <div className={styles.payoutCalcBox}>
              <div className={styles.payoutRow}>
                <span className={styles.payoutLabel}><T>Calculated Payout:</T></span>
                <span className={styles.payoutAmount}><T>₹</T><T>{finalPayout.toLocaleString()}</T></span>
              </div>
              <div className={styles.payoutFormula}><T>
                Agreed Rate: ₹</T><T>{rate}</T><T>/kg × </T><T>{scaleWeight}</T><T> kg scale reading
              </T></div>
            </div>

            <div className={styles.modalActionRow}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={onClose}
              ><T>
                Cancel
              </T></button>
              <button
                type="button"
                className={styles.confirmHandoverBtn}
                onClick={handleConfirm}
              ><T>
                Sign & Confirm Handover
              </T></button>
            </div>
          </div>
        )}</T>
      </div>
    </div>
  );
}
