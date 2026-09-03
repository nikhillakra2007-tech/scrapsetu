'use client';

import React, { useState } from 'react';
import {
  Flame,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  PhoneCall,
  ShieldAlert,
} from 'lucide-react';
import styles from './Safety.module.css';

type Language = 'en' | 'hi' | 'mr';

interface SafetyGuide {
  id: string;
  category: Record<Language, string>;
  hazard: Record<Language, string>;
  doNot: Record<Language, string>;
  doThis: Record<Language, string>;
  ppe: Record<Language, string>;
  colorVar: string;
}

export default function SafetyGuidanceView() {
  const [selectedLang, setSelectedLang] = useState<Language>('en');

  const UI_TEXT = {
    title: {
      en: 'E-Waste Worker Safety & Hazard Protocols',
      hi: 'ई-कचरा श्रमिक सुरक्षा व जोखिम दिशानिर्देश',
      mr: 'ई-कचरा कामगार सुरक्षा व धोके नियमावली',
    },
    subtitle: {
      en: 'Standard Operating Procedures (SOPs) for informal collectors, waste-pickers, and aggregation points under CPCB guidelines.',
      hi: 'सीपीसीबी (CPCB) दिशानिर्देशों के तहत अनौपचारिक कबाड़ी भाइयों व गोदामों के लिए सचित्र व व्यावहारिक सुरक्षा नियम।',
      mr: 'सीपीसीबी (CPCB) मार्गदर्शक तत्त्वांच्या अंतर्गत असंघटित भंगार वेचक व गोदामांसाठी सचित्र व प्रत्यक्ष सुरक्षा मार्गदर्शक तत्त्वे.',
    },
    doNotLabel: {
      en: 'Strictly Prohibited (What to Avoid):',
      hi: 'सख्ती से मना है (क्या न करें):',
      mr: 'सक्त मनाई आहे (काय करू नये):',
    },
    doThisLabel: {
      en: 'Mandatory Safe Protocol (What to Do):',
      hi: 'अनिवार्य सुरक्षित तरीका (क्या करें):',
      mr: 'अनिवार्य सुरक्षित पद्धत (काय करावे):',
    },
    ppeLabel: {
      en: 'Required Safety Gear:',
      hi: 'जरूरी सुरक्षा उपकरण:',
      mr: 'आवश्यक सुरक्षा उपकरणे:',
    },
    emergencyTitle: {
      en: 'Delhi NCT Industrial Hazard Helpline',
      hi: 'दिल्ली औद्योगिक दुर्घटना हेल्पलाइन',
      mr: 'दिल्ली औद्योगिक दुर्घटना हेल्पलाइन',
    },
    emergencyText: {
      en: 'In case of battery fire or acid splash, immediately evacuate and call DPCC / Delhi Fire Service (101). Never use water on burning lithium-ion cells.',
      hi: 'बैटरी विस्फोट या एसिड रिसाव की स्थिति में तुरंत सुरक्षित दूरी बनाएं और फायर सर्विस (101) को कॉल करें। लिथियम सेल पर कभी पानी न डालें, बालू (रेत) का प्रयोग करें।',
      mr: 'बॅटरी स्फोट किंवा ॲसिड गळती झाल्यास तातडीने सुरक्षित अंतर ठेवा आणि अग्निशामक दल (101) ला कॉल करा. पेटत्या लिथियमवर कधीही पाणी टाकू नका, वाळूचा वापर करा.',
    },
  };

  const guides: SafetyGuide[] = [
    {
      id: 'battery',
      category: {
        en: 'BATTERIES (Lithium-Ion & Lead-Acid)',
        hi: 'बैटरी (लिथियम-आयन व लेड-एसिड)',
        mr: 'बॅटरी (लिथियम-आयन आणि लेड-ॲसिड)',
      },
      hazard: {
        en: 'Thermal Runaway, Explosive Fire & Toxic Hydrofluoric Fumes',
        hi: 'विस्फोट, भीषण आग व जहरीला धुआं (Thermal Runaway)',
        mr: 'स्फोट, भयानक आग आणि विषारी वायूचा धोका (Thermal Runaway)',
      },
      doNot: {
        en: 'Never puncture, crush with hammers, short-circuit terminals, or burn batteries.',
        hi: 'बैटरी को कभी न जलाएं, न ही हथौड़े से तोड़ें या नुकीली चीज से छेदें।',
        mr: 'बॅटरी कधीही जाळू नका, हातोड्याने फोडू नका किंवा टोकदार वस्तूने छिद्र करू नका.',
      },
      doThis: {
        en: 'Store terminals taped with non-conductive tape in a dry sand bucket. Hand over intact to an authorized recycler.',
        hi: 'टर्मिनल्स पर सेलोटेप लगाएं, सूखे बालू (रेत) से भरी बाल्टी में रखें और सीधे अधिकृत रिसाइक्लर को सौंपें।',
        mr: 'टर्मिनल्सवर इन्सुलेशन टेप लावा, कोरड्या वाळूच्या बादलीत ठेवा आणि थेट अधिकृत रिसायकलरकडे सुपूर्द करा.',
      },
      ppe: {
        en: 'Heat-resistant Kevlar gloves & safety goggles',
        hi: 'अग्निरोधक दस्ताने व सुरक्षा चश्मा',
        mr: 'अग्निरोधक हातमोजे आणि सुरक्षा चष्मा',
      },
      colorVar: 'danger',
    },
    {
      id: 'crt',
      category: {
        en: 'CRT TV SCREENS & MONITORS',
        hi: 'सीआरटी टीवी स्क्रीन व मॉनिटर (CRT)',
        mr: 'सीआरटी टीव्ही स्क्रीन आणि मॉनिटर (CRT)',
      },
      hazard: {
        en: 'Leaded Glass Toxicity & Vacuum Implosion Hazard',
        hi: 'जहरीला सीसा (Lead Poisoning) व वैक्यूम विस्फोट का खतरा',
        mr: 'विषारी शिसे (Lead Toxicity) आणि व्हॅक्यूम स्फोटाचा धोका',
      },
      doNot: {
        en: 'Never smash the funnel glass or break CRT screens to salvage internal copper yokes.',
        hi: 'तांबे का छल्ला निकालने के लिए शीशे की स्क्रीन को कभी पत्थर या हथौड़े से न फोड़ें।',
        mr: 'तांब्याचे कॉइल काढण्यासाठी काचेची स्क्रीन कधीही दगड किंवा हातोड्याने फोडू नका.',
      },
      doThis: {
        en: 'Keep the entire display tube intact. Store upright on padded wooden pallets.',
        hi: 'पूरी सीआरटी ट्यूब को बिना तोड़े सुरक्षित रखें और गत्ते के डिब्बे या लकड़ी के तख्त पर रखें।',
        mr: 'संपूर्ण सीआरटी ट्यूब अखंड ठेवा आणि लाकडी फळीवर किंवा खोक्यात सुरक्षित ठेवा.',
      },
      ppe: {
        en: 'Heavy cut-proof leather gloves & face shield',
        hi: 'कटेगा नहीं ऐसे मोटे चमड़े के दस्ताने व फेस शील्ड',
        mr: 'जाड चामड्याचे हातमोजे आणि फेस शील्ड',
      },
      colorVar: 'warning',
    },
    {
      id: 'cables',
      category: {
        en: 'CABLES & COPPER WIRES',
        hi: 'बिजली के तार व केबल (Cables & Wires)',
        mr: 'विद्युत तारा आणि केबल्स (Cables & Wires)',
      },
      hazard: {
        en: 'Carcinogenic Dioxin Smoke & Severe Lung Damage from Burning',
        hi: 'फेफड़ों का कैंसर, जहरीला डायोक्सिन धुआं व वायु प्रदूषण',
        mr: 'फुफ्फुसांचा कर्करोग, विषारी डायोक्सिन धूर आणि हवेचे प्रदूषण',
      },
      doNot: {
        en: 'Never burn plastic/PVC insulation in open ground or pits to extract copper core.',
        hi: 'प्लास्टिक हटाने और तांबा निकालने के लिए तारों को खुली आग या गड्ढों में कभी न जलाएं।',
        mr: 'तांबे काढण्यासाठी प्लास्टिकचे आवरण असलेल्या तारा उघड्या आगीत कधीही जाळू नका.',
      },
      doThis: {
        en: 'Use mechanical wire strippers or hand blade tools. DPCC recyclers pay more for unburnt clean copper.',
        hi: 'मैनुअल या इलेक्ट्रिक वायर-स्ट्रिपर से तार छीलें। बिना जले साफ तांबे का रिसाइक्लर ज्यादा रेट देते हैं।',
        mr: 'मॅन्युअल किंवा इलेक्ट्रिक वायर-स्ट्रिपरने तारा सोला. न जळलेल्या स्वच्छ तांब्याला रिसायकलर जास्त भाव देतात.',
      },
      ppe: {
        en: 'Anti-cut grip gloves & N95 particle dust mask',
        hi: 'ग्रिप वाले कट-रेजिस्टेंट दस्ताने व एन-95 डस्ट मास्क',
        mr: 'कट-रेझिस्टंट हातमोजे आणि एन-९५ डस्ट मास्क',
      },
      colorVar: 'info',
    },
    {
      id: 'pcb',
      category: {
        en: 'PRINTED CIRCUIT BOARDS (PCBs)',
        hi: 'मदरबोर्ड व इलेक्ट्रॉनिक सर्किट (PCBs)',
        mr: 'मदरबोर्ड आणि सर्किट बोर्ड (PCBs)',
      },
      hazard: {
        en: 'Toxic Heavy Metal Leaching (Lead, Brominated Flame Retardants)',
        hi: 'जहरीले एसिड का रिसाव व ब्रोमिनेटेड रसायन का धुआं',
        mr: 'विषारी ॲसिड गळती आणि ब्रोमिनेटेड रसायनांचा धूर',
      },
      doNot: {
        en: 'Never heat motherboards over charcoal stoves or dip in crude nitric/sulfuric acid baths.',
        hi: 'गोल्ड निकालने के लिए सर्किट को स्टोव पर न तपाएं और न ही कच्चा तेजाब (एसिड) इस्तेमाल करें।',
        mr: 'सोने काढण्यासाठी सर्किट बोर्ड शेगडीवर तापवू नका आणि घातक ॲसिडमध्ये बुडवू नका.',
      },
      doThis: {
        en: 'Sort intact boards by grading (Telecom > Computer > Monitor). Sell to authorized dockets.',
        hi: 'बोर्ड्स को बिना तोड़े अलग रखें (टेलीकॉम बोर्ड्स का रेट ज्यादा है)। इन्हें सीधे अधिकृत रिसाइक्लर को दें।',
        mr: 'बोर्ड न तोडता श्रेणीनुसार वेगळे ठेवा (टेलिकॉम बोर्ड्सना जास्त दर मिळतो). थेट अधिकृत केंद्रांना द्या.',
      },
      ppe: {
        en: 'Chemical-resistant nitrile gloves & protective apron',
        hi: 'नाइट्राइल केमिकल दस्ताने व सुरक्षा एप्रन',
        mr: 'नायट्राइल रासायनिक हातमोजे आणि संरक्षक ॲप्रन',
      },
      colorVar: 'brand',
    },
  ];

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>{UI_TEXT.title[selectedLang]}</h2>
          <p className={styles.pageSubtitle}>
            {UI_TEXT.subtitle[selectedLang]}
          </p>
        </div>

        {/* Trilingual Language Selector (English | हिंदी | मराठी) */}
        <div className={styles.langToggleGroup}>
          <button
            type="button"
            className={`${styles.langBtn} ${selectedLang === 'en' ? styles.langBtnActive : ''}`}
            onClick={() => setSelectedLang('en')}
          >
            English
          </button>
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

      {/* Emergency Helpline Banner */}
      <div className={styles.emergencyBanner}>
        <div className={styles.emergencyIconCircle}>
          <ShieldAlert size={20} className={styles.emergencyIcon} />
        </div>
        <div className={styles.emergencyTextContent}>
          <h4 className={styles.emergencyTitle}>
            <PhoneCall size={14} style={{ display: 'inline', marginRight: 6 }} />
            {UI_TEXT.emergencyTitle[selectedLang]}
          </h4>
          <p className={styles.emergencyDesc}>
            {UI_TEXT.emergencyText[selectedLang]}
          </p>
        </div>
      </div>

      {/* Safety Cards Grid */}
      <div className={styles.cardsGrid}>
        {guides.map((item) => (
          <div
            key={item.id}
            className={`${styles.safetyCard} ${styles[`border-${item.colorVar}`]}`}
          >
            <div>
              <div className={styles.hazardHeader}>
                <Flame size={18} className={styles[`icon-${item.colorVar}`]} />
                <span className={`${styles.hazardText} ${styles[`text-${item.colorVar}`]}`}>
                  {item.hazard[selectedLang]}
                </span>
              </div>

              <h3 className={styles.categoryTitle}>
                {item.category[selectedLang]}
              </h3>

              {/* Prohibited Action Box */}
              <div className={styles.doNotBox}>
                <XCircle size={16} className={styles.doNotIcon} />
                <div>
                  <strong className={styles.doNotTitle}>
                    {UI_TEXT.doNotLabel[selectedLang]}
                  </strong>{' '}
                  <span className={styles.doNotText}>{item.doNot[selectedLang]}</span>
                </div>
              </div>

              {/* Safe Protocol Box */}
              <div className={styles.doThisBox}>
                <CheckCircle2 size={16} className={styles.doThisIcon} />
                <div>
                  <strong className={styles.doThisTitle}>
                    {UI_TEXT.doThisLabel[selectedLang]}
                  </strong>{' '}
                  <span className={styles.doThisText}>{item.doThis[selectedLang]}</span>
                </div>
              </div>

              {/* PPE Gear Box */}
              <div className={styles.ppeBox}>
                <span className={styles.ppeLabel}>{UI_TEXT.ppeLabel[selectedLang]}</span>
                <span className={styles.ppeValue}>{item.ppe[selectedLang]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
