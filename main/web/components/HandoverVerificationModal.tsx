'use client';

import React, { useState } from 'react';
import {
  QrCode,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  X,
  Scale,
  Receipt,
  Download,
} from 'lucide-react';
import { LotMatch } from '@/types/database';

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
    // Generate human-readable reference code
    const code = 'KC-DL-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setGeneratedCode(code);
    setIsCompleted(true);
    onSuccess(code);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={20} color="var(--emerald-accent)" />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>
                {isCompleted ? 'Handover Confirmed' : 'Verify Handover & Traceability'}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                DPCC Rule 2022 Traceability Record (Traceability Dataset)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {isCompleted ? (
          /* Confirmation Receipt View */
          <div>
            <div
              style={{
                textAlign: 'center',
                padding: '24px',
                background: 'rgba(16, 185, 129, 0.08)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-active)',
                marginBottom: '20px',
              }}
            >
              <CheckCircle2 size={48} color="var(--emerald-accent)" style={{ margin: '0 auto 12px' }} />
              <h4 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>
                Handover Confirmed & Locked
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                A permanent audit record has been anchored with timestamp & coordinates.
              </p>

              {/* Unique Reference QR Token */}
              <div
                style={{
                  background: '#0a0f18',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  border: '1px dashed var(--emerald-accent)',
                }}
              >
                <QrCode size={36} color="var(--emerald-accent)" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    UNIQUE HANDOVER ID
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
                    {generatedCode}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
              <div><strong>Material:</strong> {lot?.sub_code.replace(/_/g, ' ').toUpperCase()}</div>
              <div><strong>Verified Scale Weight:</strong> {scaleWeight} kg</div>
              <div><strong>Final Payout:</strong> ₹{finalPayout.toLocaleString()} ({paymentMode.toUpperCase()})</div>
              <div><strong>Facility Location:</strong> Mandoli Industrial Area (DPCC-033)</div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={onClose}>
              Done & Return to Dashboard
            </button>
          </div>
        ) : (
          /* Handover Entry Form */
          <div>
            <div className="form-group">
              <label className="form-label">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Scale size={14} />
                  Facility Scale Reading (kg)
                </span>
              </label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={scaleWeight}
                onChange={(e) => setScaleWeight(e.target.value)}
                placeholder="Enter physical scale weight"
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Collector reported weight: {lot?.weight_kg || '14.2'} kg
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Confirmation Method</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {(['app_tap', 'otp', 'qr_scan'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    className={`btn btn-sm ${confirmationMethod === method ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setConfirmationMethod(method)}
                  >
                    {method.replace('_', ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Settlement Mode</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {(['cash', 'upi'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={`btn btn-sm ${paymentMode === mode ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setPaymentMode(mode)}
                  >
                    {mode === 'cash' ? 'Cash First (Default)' : 'UPI Deep-Link'}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Calculated Payout:</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--emerald-accent)' }}>
                  ₹{finalPayout.toLocaleString()}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Rate: ₹{rate}/kg × {scaleWeight} kg
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleConfirm}>
                Sign & Confirm Handover
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
