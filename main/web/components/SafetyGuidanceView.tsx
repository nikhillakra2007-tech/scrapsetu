'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Flame,
  ShieldCheck,
  Eye,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { MOCK_SAFETY_GUIDES } from '@/lib/mock-data';

export default function SafetyGuidanceView() {
  const [selectedLang, setSelectedLang] = useState<'hi' | 'mr'>('hi');

  const guides = [
    {
      category: 'BATTERY (लिथियम व लेड-एसिड)',
      hazard: 'विस्फोट व जहरीला धुआं (Fire & Toxic Gas Risk)',
      doNot: 'बैटरी को कभी न जलाएं, न ही हथौड़े से तोड़ें।',
      doThis: 'सूखी जगह पर रखें और सीधे अधिकृत रिसाइक्लर को सौंपें।',
      color: 'var(--rose-accent)',
    },
    {
      category: 'CRT TV & MONITOR (सीआरटी टीवी स्क्रीन)',
      hazard: 'जहरीला सीसा (Leaded Glass Exposure)',
      doNot: 'कांच की स्क्रीन को कभी न फोड़ें।',
      doThis: 'पूरी यूनिट को बिना तोड़े संभालकर सुरक्षित रखें।',
      color: 'var(--amber-accent)',
    },
    {
      category: 'CABLE & WIRE (बिजली के तार)',
      hazard: 'फेफड़ों का कैंसर व डायोक्सिन धुआं (Open Burning)',
      doNot: 'तांबा निकालने के लिए तारों को आग में कभी न झोंकें।',
      doThis: 'मैनुअल या इलेक्ट्रिक वायर-स्ट्रिपर से छीलें।',
      color: 'var(--cyan-accent)',
    },
    {
      category: 'CFL & TUBELIGHT (लाइटिंग उपकरण)',
      hazard: 'पारे का वाष्प (Mercury Poisoning)',
      doNot: 'ट्यूबलाइट को कचरे में न पटकें या न तोड़ें।',
      doThis: 'गत्ते के डिब्बे में रखकर सुरक्षित हैंडओवर करें।',
      color: 'var(--violet-accent)',
    },
  ];

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>E-Waste Worker Safety & Hazards</h2>
          <p>
            Pictorial and multilingual safety guidance for informal waste-pickers and collection points.
          </p>
        </div>

        {/* Language Toggle */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn btn-sm ${selectedLang === 'hi' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedLang('hi')}
          >
            हिंदी (Hindi)
          </button>
          <button
            className={`btn btn-sm ${selectedLang === 'mr' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedLang('mr')}
          >
            मराठी (Marathi)
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {guides.map((item, idx) => (
          <div
            key={idx}
            className="content-card"
            style={{
              borderLeft: `4px solid ${item.color}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Flame size={18} color={item.color} />
                <span style={{ fontSize: '12px', fontWeight: 700, color: item.color }}>
                  {item.hazard}
                </span>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
                {item.category}
              </h3>

              <div
                style={{
                  background: 'rgba(244, 63, 94, 0.08)',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '10px',
                  border: '1px solid rgba(244, 63, 94, 0.2)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  fontSize: '13px',
                }}
              >
                <XCircle size={16} color="var(--rose-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--rose-accent)' }}>क्या न करें:</strong>{' '}
                  <span>{item.doNot}</span>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  fontSize: '13px',
                }}
              >
                <CheckCircle2 size={16} color="var(--emerald-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--emerald-accent)' }}>सुरक्षित तरीका:</strong>{' '}
                  <span>{item.doThis}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
