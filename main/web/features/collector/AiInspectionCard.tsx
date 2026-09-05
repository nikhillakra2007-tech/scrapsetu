'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import { CURRENT_RECYCLER } from '@/lib/mock-data';
import styles from './Collector.module.css';

export interface AIClassificationResult {
  parent_code: string;
  parent_name: string;
  sub_code: string;
  sub_name: string;
  condition: string;
  category_confidence: number;
  hazard_flags: string[];
  is_hazardous: boolean;
  hazard_advisory?: string;
  suggested_rate_per_kg: number;
  estimated_value: number;
  epr_schedule1_hint?: string;
  identified_components?: string[];
  ai_notes: string;
  ai_model_used: string;
}

interface AiInspectionCardProps {
  aiResult: AIClassificationResult | null;
  isAnalyzing: boolean;
  weightKg: number;
  submittedLotCode: string | null;
  onSubmitLot: () => void;
  onNavigateToRecyclerQueue: () => void;
}

export default function AiInspectionCard({
  aiResult,
  isAnalyzing,
  weightKg,
  submittedLotCode,
  onSubmitLot,
  onNavigateToRecyclerQueue,
}: AiInspectionCardProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Hindi TTS Read-Aloud for low-literacy operators
  const handleSpeakHindi = () => {
    if (!aiResult || typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = `सामग्री प्रकार: ${aiResult.parent_name}। वजन: ${weightKg} किलोग्राम। अनुमानित सरकारी दर: ₹${aiResult.suggested_rate_per_kg} प्रति किलो। कुल अनुमानित मूल्य: ₹${aiResult.estimated_value}। ${
      aiResult.is_hazardous ? 'चेतावनी: यह खतरनाक ई-कचरा है। सीधे अधिकृत रीसाइक्लर को ही सौंपें।' : ''
    }`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // 1. Awaiting Inspection State
  if (!aiResult && !isAnalyzing) {
    return (
      <div className={styles.emptyCardState}>
        <span className={styles.estimatePlaceholder} aria-hidden="true">₹ —</span>
        <h4 className={styles.emptyTitle}>Your estimate will appear here</h4>
        <p className={styles.emptyDescription}>
          Add your material details, then choose Inspect material.
        </p>
      </div>
    );
  }

  // 2. Analyzing State
  if (isAnalyzing) {
    return (
      <div className={styles.analyzingCardState}>
        <div className={styles.analyzingSpinner} />
        <h4 className={styles.analyzingTitle}>Inspecting your material…</h4>
        <p className={styles.analyzingDescription}>
          Checking your material details and estimate.
        </p>
      </div>
    );
  }

  if (!aiResult) return null;

  return (
    <div className={styles.resultContainer} aria-live="polite">
      <div className={styles.estimateLead}>
        <span>Estimated value</span>
        <strong>₹{aiResult.estimated_value.toLocaleString('en-IN')}</strong>
        <span>{weightKg} kg × ₹{aiResult.suggested_rate_per_kg}/kg</span>
      </div>
      {/* Category Header with Hindi Audio Action */}
      <div className={styles.resultHeader}>
        <div>
          <div className={styles.categoryBadgeRow}>
            <span className={styles.cpcbTag}>{aiResult.parent_code}</span>
            <h4 className={styles.resultSubName}>{aiResult.sub_name}</h4>
          </div>
          <span className={styles.categoryMeta}>
            Category: {aiResult.parent_name} · Condition: <strong className={styles.conditionHighlight}>{aiResult.condition.toUpperCase()}</strong>
          </span>
        </div>

        <div className={styles.confidenceSection}>
          <button
            type="button"
            onClick={handleSpeakHindi}
            className={`${styles.audioBtn} ${isSpeaking ? styles.audioBtnSpeaking : ''}`}
            title="Read valuation aloud in Hindi"
          >
            <Volume2 size={15} />
            <span>{isSpeaking ? 'बोल रहा है...' : 'बोलें 🔊'}</span>
          </button>
          <div className={styles.confidenceScore}>
            {Math.round(aiResult.category_confidence * 100)}%
          </div>
          <span className={styles.confidenceLabel}>AI Confidence</span>
        </div>
      </div>

      {/* Hazard Warning Banner */}
      {aiResult.is_hazardous && (
        <div className={styles.hazardBanner}>
          <AlertTriangle size={18} className={styles.hazardIcon} />
          <div>
            <div className={styles.hazardTitle}>
              Hazard Warning: {aiResult.hazard_flags.join(', ')}
            </div>
            <p className={styles.hazardAdvisory}>
              {aiResult.hazard_advisory || 'Hazardous e-waste detected. Route exclusively to DPCC-authorized recycler.'}
            </p>
          </div>
        </div>
      )}

      <details className={styles.inspectionDetails}><summary>Inspection details</summary>
      {/* Visual Diagnostic Notes */}
      <div className={styles.notesBox}>
        <strong className={styles.notesHeading}>Visual Diagnostic: </strong>
        <span>{aiResult.ai_notes}</span>
      </div>

      {/* Identified Components */}
      {aiResult.identified_components && aiResult.identified_components.length > 0 && (
        <div className={styles.componentsSection}>
          <span className={styles.sectionSmallHeading}>Identified Electronic Components</span>
          <div className={styles.tagsRow}>
            {aiResult.identified_components.map((comp, idx) => (
              <span key={idx} className={styles.componentTag}>
                {comp}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Regulatory & Model Footer */}
      <div className={styles.regulatoryMeta}>
        <span>CPCB EPR: {aiResult.epr_schedule1_hint || 'Schedule I'}</span>
        <span>Vision Engine: {aiResult.ai_model_used}</span>
      </div>

      </details>
      {/* Confirmation & Post Action */}
      {!submittedLotCode ? (
        <button
          type="button"
          onClick={onSubmitLot}
          className={styles.submitLotBtn}
        >
          <CheckCircle2 size={18} />
          <span>Confirm & find recycler</span>
        </button>
      ) : (
        <div className={styles.successBox}>
          <div className={styles.successHeading}>
            <CheckCircle2 size={20} className={styles.successIcon} />
            <span>Lot Matched Successfully ({submittedLotCode})</span>
          </div>
          <p className={styles.successSubtext}>
            Paired with <strong>{CURRENT_RECYCLER.business_name}</strong> in Okhla. Ready for weighbridge handover!
          </p>
          <button
            type="button"
            onClick={onNavigateToRecyclerQueue}
            className={styles.viewQueueBtn}
          >
            <span>View in Recycler Incoming Lots Queue</span>
            <ArrowRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
