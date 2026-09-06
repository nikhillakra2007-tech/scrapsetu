'use client';
import { T, useLocale } from '@/components/language/Language';

import React, { useState, useEffect } from 'react';
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
  actionLabel?: string;
  aiResult: AIClassificationResult | null;
  isAnalyzing: boolean;
  weightKg: number;
  submittedLotCode: string | null;
  onSubmitLot: () => void;
  onNavigateToRecyclerQueue: () => void;
}

export default function AiInspectionCard({
  actionLabel = "Confirm & find recycler",
  aiResult,
  isAnalyzing,
  weightKg,
  submittedLotCode,
  onSubmitLot,
  onNavigateToRecyclerQueue,
}: AiInspectionCardProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);


  const {locale,t}=useLocale();
  const [audioError,setAudioError]=useState('');
  useEffect(()=>{window.speechSynthesis?.cancel();setIsSpeaking(false);setAudioError('');return()=>window.speechSynthesis?.cancel();},[locale,aiResult]);
  const handleSpeakHindi=()=>{
    setAudioError('');
    if(!aiResult)return;
    if(!window.speechSynthesis){setAudioError('Audio is unavailable in this browser.');return;}
    if(isSpeaking){window.speechSynthesis.cancel();setIsSpeaking(false);return;}
    const voices=window.speechSynthesis.getVoices();
    const voice=voices.find(v=>v.lang.toLowerCase().startsWith(locale));
    if(!voice&&locale!=='en'){setAudioError('No voice is installed for this language. Please use the written estimate.');return;}
    const words=locale==='en'?
      t(aiResult.parent_name)+'. Weight: '+weightKg+' kilograms. Estimated value: '+aiResult.estimated_value+' rupees.':locale==='hi'?
      t(aiResult.parent_name)+'। वजन: '+weightKg+' किलोग्राम। अनुमानित मूल्य: '+aiResult.estimated_value+' रुपये।':
      t(aiResult.parent_name)+'. वजन: '+weightKg+' किलोग्रॅम. अंदाजित मूल्य: '+aiResult.estimated_value+' रुपये.';
    const utterance=new SpeechSynthesisUtterance(words);utterance.lang=locale+'-IN';if(voice)utterance.voice=voice;
    utterance.onend=()=>setIsSpeaking(false);utterance.onerror=()=>{setIsSpeaking(false);setAudioError('Audio could not play. Please try again.');};
    window.speechSynthesis.cancel();setIsSpeaking(true);window.speechSynthesis.speak(utterance);
  };

  // 1. Awaiting Inspection State
  if (!aiResult && !isAnalyzing) {
    return (
      <div className={styles.emptyCardState}>
        <span className={styles.estimatePlaceholder} aria-hidden="true"><T>₹ —</T></span>
        <h4 className={styles.emptyTitle}><T>Your estimate will appear here</T></h4>
        <p className={styles.emptyDescription}><T>
          Add your material details, then choose Inspect material.
        </T></p>
      </div>
    );
  }

  // 2. Analyzing State
  if (isAnalyzing) {
    return (
      <div className={styles.analyzingCardState}>
        <div className={styles.analyzingSpinner} />
        <h4 className={styles.analyzingTitle}><T>Inspecting your material…</T></h4>
        <p className={styles.analyzingDescription}><T>
          Checking your material details and estimate.
        </T></p>
      </div>
    );
  }

  if (!aiResult) return null;

  return (
    <div className={styles.resultContainer} aria-live="polite">
      <div className={styles.estimateLead}>
        <span><T>Estimated value</T></span>
        <strong><T>₹</T><T>{aiResult.estimated_value.toLocaleString('en-IN')}</T></strong>
        <span><T>{weightKg}</T><T> kg × ₹</T><T>{aiResult.suggested_rate_per_kg}</T><T>/kg</T></span>
      </div>
      {/* Category Header with Hindi Audio Action */}
      <div className={styles.resultHeader}>
        <div>
          <div className={styles.categoryBadgeRow}>
            <span className={styles.cpcbTag}><T>{aiResult.parent_name}</T></span>
            <h4 className={styles.resultSubName}><T>{aiResult.sub_name}</T></h4>
          </div>
          <span className={styles.categoryMeta}><T>
            Category: </T><T>{aiResult.parent_name}</T><T> · Condition: </T><strong className={styles.conditionHighlight}><T>{aiResult.condition.toUpperCase()}</T></strong>
          </span>
        </div>

        <div className={styles.confidenceSection}>
          <button
            type="button"
            onClick={handleSpeakHindi}
            className={`${styles.audioBtn} ${isSpeaking ? styles.audioBtnSpeaking : ''}`}
            title={t('Read aloud')} aria-pressed={isSpeaking}
          >
            <Volume2 size={15} />
            <span><T>{isSpeaking ? t('Stop audio') : t('Read aloud')}</T></span>
          </button>
          <div className={styles.confidenceScore}>
            <T>{Math.round(aiResult.category_confidence * 100)}</T><T>%
          </T></div>
          <span className={styles.confidenceLabel}><T>AI Confidence</T></span>
        </div>
      </div>

      {audioError && <p role="status"><T>{audioError}</T></p>}
      {/* Hazard Warning Banner */}
      <T>{aiResult.is_hazardous && (
        <div className={styles.hazardBanner}>
          <AlertTriangle size={18} className={styles.hazardIcon} />
          <div>
            <div className={styles.hazardTitle}><T>
              Hazard Warning: </T><T>{aiResult.hazard_flags.map(flag=>t(flag.replaceAll('_',' '))).join(', ')}</T>
            </div>
            <p className={styles.hazardAdvisory}>
              <T>{aiResult.hazard_advisory || 'Hazardous e-waste detected. Route exclusively to DPCC-authorized recycler.'}</T>
            </p>
          </div>
        </div>
      )}</T>

      <details className={styles.inspectionDetails}><summary><T>Inspection details</T></summary>
      {/* Visual Diagnostic Notes */}
      <div className={styles.notesBox}>
        <strong className={styles.notesHeading}><T>Visual Diagnostic: </T></strong>
        <span><T>{aiResult.ai_notes}</T></span>
      </div>

      {/* Identified Components */}
      <T>{aiResult.identified_components && aiResult.identified_components.length > 0 && (
        <div className={styles.componentsSection}>
          <span className={styles.sectionSmallHeading}><T>Identified Electronic Components</T></span>
          <div className={styles.tagsRow}>
            <T>{aiResult.identified_components.map((comp, idx) => (
              <span key={idx} className={styles.componentTag}>
                <T>{comp}</T>
              </span>
            ))}</T>
          </div>
        </div>
      )}</T>

      {/* Regulatory & Model Footer */}
      <div className={styles.regulatoryMeta}>
        <span><T>CPCB EPR: </T><T>{aiResult.epr_schedule1_hint || 'Schedule I'}</T></span>
        <span><T>Vision Engine: </T><T>{aiResult.ai_model_used}</T></span>
      </div>

      </details>
      {/* Confirmation & Post Action */}
      <T>{!submittedLotCode ? (
        <button
          type="button"
          onClick={onSubmitLot}
          className={styles.submitLotBtn}
        >
          <CheckCircle2 size={18} />
          <span><T>{actionLabel}</T></span>
        </button>
      ) : (
        <div className={styles.successBox}>
          <div className={styles.successHeading}>
            <CheckCircle2 size={20} className={styles.successIcon} />
            <span><T>Lot Matched Successfully (</T><T>{submittedLotCode}</T><T>)</T></span>
          </div>
          <p className={styles.successSubtext}><T>
            Paired with </T><strong><T>{CURRENT_RECYCLER.business_name}</T></strong><T> in Okhla. Ready for weighbridge handover!
          </T></p>
          <button
            type="button"
            onClick={onNavigateToRecyclerQueue}
            className={styles.viewQueueBtn}
          >
            <span><T>View in Recycler Incoming Lots Queue</T></span>
            <ArrowRight size={15} />
          </button>
        </div>
      )}</T>
    </div>
  );
}
