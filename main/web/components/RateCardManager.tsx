'use client';

import React, { useState } from 'react';
import { CreditCard, Save, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import { RecyclerRateCard } from '@/types/database';
import { MOCK_RATE_CARDS } from '@/lib/mock-data';

export default function RateCardManager() {
  const [rates, setRates] = useState<RecyclerRateCard[]>(MOCK_RATE_CARDS);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleRateChange = (id: string, newRate: number) => {
    setRates((prev) =>
      prev.map((r) => (r.id === id ? { ...r, rate_per_kg: newRate } : r))
    );
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Procurement Rate Cards</h2>
          <p>
            Configure your offered procurement rates per kg across Delhi industrial zones.
            Higher rates increase deterministic matching priority.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={16} />
          <span>Save Changes</span>
        </button>
      </div>

      {savedSuccess && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid var(--border-active)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 18px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--emerald-accent)',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={18} />
          <span>Rate card successfully updated & broadcasted to matching engine.</span>
        </div>
      )}

      <div className="content-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Sub-Classification</th>
                <th>Current Benchmark</th>
                <th>Your Offered Rate (₹/kg)</th>
                <th>Effective Date</th>
              </tr>
            </thead>
            <tbody>
              {rates.map((card) => (
                <tr key={card.id}>
                  <td>
                    <span className="badge badge-cyan">{card.parent_code}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {card.sub_code.replace(/_/g, ' ').toUpperCase()}
                    </div>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                      ₹{Math.round(card.rate_per_kg * 0.96)} - ₹{Math.round(card.rate_per_kg * 1.05)} /kg
                    </span>
                  </td>
                  <td style={{ width: '180px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--emerald-accent)' }}>₹</span>
                      <input
                        type="number"
                        className="form-input"
                        style={{ padding: '6px 10px', fontSize: '14px', fontWeight: 700 }}
                        value={card.rate_per_kg}
                        onChange={(e) =>
                          handleRateChange(card.id, parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {card.effective_date}
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
