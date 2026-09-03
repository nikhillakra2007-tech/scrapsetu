'use client';

import React, { useState } from 'react';
import {
  Flame,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import styles from './Safety.module.css';

export default function SafetyGuidanceView() {
  const [selectedLang, setSelectedLang] = useState<'hi' | 'mr'>('hi');

  const guides = [
    {
      category: 'BATTERY (लिथियम व लेड-एसिड)',
      hazard: 'विस्फोट व जहरीला धुआं (Fire & Toxic Gas Risk)',
      doNot: 'बैटरी को कभी न जलाएं, न ही हथौड़े से तोड़ें।',
      doThis: 'सूखी जगह पर रखें और सीधे अधिकृत रिसाइक्लर को सौंपें।',
      colorVar: 'danger',
    },
    {
      category: 'CRT TV & MONITOR (सीआरटी टीवी स्क्रीन)',
      hazard: 'जहरीला सीसा (Leaded Glass Exposure)',
      doNot: 'कांच की स्क्रीन को कभी न फोड़ें।',
      doThis: 'पूरी यूनिट को बिना तोड़े संभालकर सुरक्षित रखें।',
      colorVar: 'warning',
    },
    {
      category: 'CABLE & WIRE (बिजली के तार)',
      hazard: 'फेफड़ों का कैंसर व डायोक्सिन धुआं (Open Burning)',
      doNot: 'तांबा निकालने के लिए तारों को आग में कभी न झोंकें।',
      doThis: 'मैनुअल या इलेक्ट्रिक वायर-स्ट्रिपर से छीलें।',
      colorVar: 'info',
    },
    {
      category: 'CFL & TUBELIGHT (लाइटिंग उपकरण)',
      hazard: 'पारे का वाष्प (Mercury Poisoning)',
      doNot: 'ट्यूबलाइट को कचरे में न पटकें या न तोड़ें।',
      doThis: 'गत्ते के डिब्बे में रखकर सुरक्षित हैंडओवर करें।',
      colorVar: 'brand',
    },
  ];

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>E-Waste Worker Safety & Hazards</h2>
          <p className={styles.pageSubtitle}>
            Pictorial and vernacular safety directives for informal collectors, waste-pickers, and collection hubs.
          </p>
        </div>

        {/* Vernacular Language Toggle */}
        <div className={styles.langToggleGroup}>
          <button
            type="button"
            className={`${styles.langBtn} ${selectedLang === 'hi' ? styles.langBtnActive : ''}`}
            onClick={() => setSelectedLang('hi')}
          >
            हिंदी (Hindi)
          </button>
          <button
            type="button"
            className={`${styles.langBtn} ${selectedLang === 'mr' ? styles.langBtnActive : ''}`}
            onClick={() => setSelectedLang('mr')}
          >
            मराठी (Marathi)
          </button>
        </div>
      </div>

      {/* Safety Cards Grid */}
      <div className={styles.cardsGrid}>
        {guides.map((item, idx) => (
          <div
            key={idx}
            className={`${styles.safetyCard} ${styles[`border-${item.colorVar}`]}`}
          >
            <div>
              <div className={styles.hazardHeader}>
                <Flame size={18} className={styles[`icon-${item.colorVar}`]} />
                <span className={`${styles.hazardText} ${styles[`text-${item.colorVar}`]}`}>
                  {item.hazard}
                </span>
              </div>

              <h3 className={styles.categoryTitle}>
                {item.category}
              </h3>

              {/* Prohibited Action Box */}
              <div className={styles.doNotBox}>
                <XCircle size={16} className={styles.doNotIcon} />
                <div>
                  <strong className={styles.doNotTitle}>क्या न करें:</strong>{' '}
                  <span className={styles.doNotText}>{item.doNot}</span>
                </div>
              </div>

              {/* Safe Protocol Box */}
              <div className={styles.doThisBox}>
                <CheckCircle2 size={16} className={styles.doThisIcon} />
                <div>
                  <strong className={styles.doThisTitle}>सुरक्षित तरीका:</strong>{' '}
                  <span className={styles.doThisText}>{item.doThis}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
