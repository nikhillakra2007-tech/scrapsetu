'use client';

import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Cpu,
  BatteryCharging,
  Zap,
  Tv,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Volume2,
  TrendingUp,
  ArrowRight,
  Wifi,
  WifiOff,
  RefreshCw,
  Scale,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import { Lot, LotMatch } from '@/types/database';
import { CURRENT_RECYCLER } from '@/lib/mock-data';

interface CollectorPortalProps {
  onLotCreated: (newMatch: LotMatch) => void;
  onNavigateToRecyclerQueue: () => void;
}

interface AIClassificationResult {
  success: boolean;
  parent_code: string;
  parent_name: string;
  sub_code: string;
  sub_name: string;
  condition: string;
  hazard_flags: string[];
  is_hazardous: boolean;
  hazard_advisory?: string | null;
  category_confidence: number;
  image_quality: string;
  ai_notes: string;
  identified_components: string[];
  suggested_rate_per_kg: number;
  weight_kg?: number | null;
  estimated_value?: number | null;
  epr_schedule1_hint?: string | null;
  benchmark_delhi_rate_range?: { min_rate: number; avg_rate: number; max_rate: number };
  ai_model_used: string;
  mode: string;
}

// Sample presets for 1-click live demo testing
const SAMPLE_PRESETS = [
  {
    id: 'pcb',
    label: 'Motherboard PCB',
    subLabel: 'Computer Motherboard with CPU',
    icon: Cpu,
    defaultWeight: 14.5,
    sampleType: 'motherboard',
    // 1x1 green image or sample base64
    previewColor: '#0e5224',
  },
  {
    id: 'battery',
    label: 'Li-Ion Battery',
    subLabel: 'Swollen Laptop/Mobile Cell',
    icon: BatteryCharging,
    defaultWeight: 6.0,
    sampleType: 'battery',
    previewColor: '#991b1b',
  },
  {
    id: 'cable',
    label: 'Copper Cables',
    subLabel: 'Stripped Telecom Wire',
    icon: Zap,
    defaultWeight: 22.0,
    sampleType: 'cables',
    previewColor: '#b45309',
  },
];

export default function CollectorPortal({
  onLotCreated,
  onNavigateToRecyclerQueue,
}: CollectorPortalProps) {
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [activePreset, setActivePreset] = useState<string>('pcb');
  const [weightKg, setWeightKg] = useState<number>(14.5);
  const [wardName, setWardName] = useState<string>('Okhla Industrial Area Phase 1');
  
  // State for AI processing
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AIClassificationResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [submittedLotCode, setSubmittedLotCode] = useState<string | null>(null);

  // Offline outbox simulation
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [offlineOutboxCount, setOfflineOutboxCount] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImageFile(file);
      setActivePreset('');

      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImageBase64(reader.result as string);
        setAiResult(null);
        setSubmittedLotCode(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger Gemini Vision AI Inspection
  const handleRunAiInspection = async () => {
    setIsAnalyzing(true);
    setApiError(null);
    setAiResult(null);
    setSubmittedLotCode(null);

    try {
      let response;

      if (selectedImageFile) {
        // Use multipart upload endpoint
        const formData = new FormData();
        formData.append('file', selectedImageFile);
        formData.append('weight_kg', weightKg.toString());
        formData.append('ward_name', wardName);

        response = await fetch(`${apiUrl}/api/classify-image-upload`, {
          method: 'POST',
          body: formData,
        });
      } else if (selectedImageBase64) {
        // Use JSON base64 endpoint
        response = await fetch(`${apiUrl}/api/classify-lot`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image_base64: selectedImageBase64,
            weight_kg: weightKg,
            ward_name: wardName,
          }),
        });
      } else {
        // Use sample test endpoint
        const sampleType = activePreset === 'battery' ? 'battery' : activePreset === 'cable' ? 'cables' : 'motherboard';
        response = await fetch(
          `${apiUrl}/api/test-sample?sample_type=${sampleType}&weight_kg=${weightKg}&ward_name=${encodeURIComponent(wardName)}`,
          { method: 'POST' }
        );
      }

      if (!response.ok) {
        throw new Error(`API returned HTTP ${response.status}: ${await response.text()}`);
      }

      const data: AIClassificationResult = await response.json();
      setAiResult(data);
    } catch (err: any) {
      console.error('AI Inspection error:', err);
      setApiError(err.message || 'Failed to connect to Python Bot API at http://localhost:8000');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Low-literacy Hindi Web Speech TTS
  const handleSpeakGuidanceHindi = () => {
    if (!aiResult) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis not supported on this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const hindiText = `यह स्क्रैप ${aiResult.parent_name} की श्रेणी में आता है। इसकी स्थिति ${aiResult.condition} है। सरकारी रेट ${aiResult.suggested_rate_per_kg} रुपये प्रति किलो है। ${aiResult.weight_kg} किलो का कुल अनुमानित भाव ${aiResult.estimated_value} रुपये बनता है। ${aiResult.is_hazardous ? 'चेतावनी: इसमें खतरनाक रसायन है, सावधानी से संभालें।' : 'यह रीसाइक्लिंग के लिए सुरक्षित है।'}`;

    const utterance = new SpeechSynthesisUtterance(hindiText);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Submit Lot into Recycler Matching
  const handleSubmitLot = () => {
    if (!aiResult) return;

    if (isOffline) {
      // Save in offline outbox
      setOfflineOutboxCount((prev) => prev + 1);
      alert('ऑफ़लाइन मोड सक्रिय! लॉट आपके डिवाइस में सुरक्षित सेव हो गया है। इंटरनेट कनेक्ट होते ही अपने आप रीसाइक्लर को भेजा जाएगा।');
      setSubmittedLotCode(`OFFLINE-LOT-${Math.floor(1000 + Math.random() * 9000)}`);
      return;
    }

    const lotId = `lot-live-${Date.now()}`;
    const refCode = `KC-DL-${Math.floor(100000 + Math.random() * 900000)}`;

    const newLot: Lot = {
      id: lotId,
      collector_id: 'coll-delhi-prakhar',
      collector_name: 'Prakhar Aggregators (Mandoli Cluster)',
      parent_code: aiResult.parent_code,
      sub_code: aiResult.sub_code,
      condition: aiResult.condition as any,
      weight_kg: weightKg,
      hazard_flags: aiResult.hazard_flags,
      ai_suggested_rate_per_kg: aiResult.suggested_rate_per_kg,
      ai_confidence: aiResult.category_confidence,
      estimated_value: aiResult.estimated_value || weightKg * aiResult.suggested_rate_per_kg,
      status: 'matched',
      ward_name: wardName,
      client_created_at: new Date().toISOString(),
    };

    const newMatch: LotMatch = {
      id: `match-live-${Date.now()}`,
      lot_id: lotId,
      recycler_id: CURRENT_RECYCLER.id,
      score: Math.round(aiResult.category_confidence * 100),
      rank: 1,
      status: 'offered',
      offered_at: new Date().toISOString(),
      lot: newLot,
    };

    onLotCreated(newMatch);
    setSubmittedLotCode(refCode);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner & Offline Toggle */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-glass)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <Sparkles size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Collector Portal (Kabadiwala Hub)
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Multimodal Vision AI E-Waste Appraisal · Grounded in Delhi Pilot Mandoli & Okhla Rate Cards
            </p>
          </div>
        </div>

        {/* Offline Demo Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setIsOffline(!isOffline)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              background: isOffline ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.12)',
              border: `1px solid ${isOffline ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
              color: isOffline ? '#f87171' : '#34d399',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            {isOffline ? <WifiOff size={16} /> : <Wifi size={16} />}
            <span>{isOffline ? 'Offline Mode (Airplane Mode)' : 'Online Sync Active'}</span>
          </button>

          {offlineOutboxCount > 0 && (
            <span
              style={{
                fontSize: '12px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(245, 158, 11, 0.2)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: '#fbbf24',
                fontWeight: 600,
              }}
            >
              {offlineOutboxCount} Outbox Queued
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '24px' }}>
        {/* Left Column: Photo Upload & Presets */}
        <div
          style={{
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
              1. Scrap Photograph (Photo Capture)
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Upload an e-waste photograph from your device or pick a Delhi pilot preset to test Gemini Vision.
            </p>
          </div>

          {/* Preset Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {SAMPLE_PRESETS.map((p) => {
              const Icon = p.icon;
              const isSelected = activePreset === p.id && !selectedImageFile;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePreset(p.id);
                    setSelectedImageFile(null);
                    setSelectedImageBase64(null);
                    setWeightKg(p.defaultWeight);
                    setAiResult(null);
                    setSubmittedLotCode(null);
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '12px 8px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${isSelected ? 'var(--emerald-accent)' : 'var(--border-subtle)'}`,
                    color: isSelected ? '#34d399' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Icon size={20} />
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* Dropzone / Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              height: '180px',
              border: '2px dashed var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              background: selectedImageBase64 ? '#0a101d' : 'rgba(255, 255, 255, 0.02)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />

            {selectedImageBase64 ? (
              <img
                src={selectedImageBase64}
                alt="Selected scrap"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#34d399',
                  }}
                >
                  <Upload size={20} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                  Click to upload custom scrap photo
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Supports JPEG, PNG, WEBP (camera or device gallery)
                </span>
              </>
            )}
          </div>

          {/* Weight and Location Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Collector Weight (kg)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                />
                <span style={{ position: 'absolute', right: '12px', top: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  KG
                </span>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Pilot Ward / Cluster
              </label>
              <select
                value={wardName}
                onChange={(e) => setWardName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontSize: '13px',
                }}
              >
                <option value="Okhla Industrial Area Phase 1">Okhla Phase 1</option>
                <option value="Mandoli & Shahdara E-Waste Hub">Mandoli / Shahdara</option>
                <option value="Patparganj Industrial Area">Patparganj</option>
                <option value="Peeragarhi Electronics Market">Peeragarhi</option>
                <option value="Mohan Cooperative Industrial Estate">Mohan Cooperative</option>
              </select>
            </div>
          </div>

          {/* Run Scan Button */}
          <button
            onClick={handleRunAiInspection}
            disabled={isAnalyzing}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 700,
              cursor: isAnalyzing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.2s ease',
            }}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw size={18} className="spin-animation" />
                <span>Gemini 2.5 Flash Inspecting Scrap...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Inspect Scrap with Gemini Vision AI</span>
              </>
            )}
          </button>

          {apiError && (
            <div
              style={{
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                color: '#f87171',
              }}
            >
              {apiError}
            </div>
          )}
        </div>

        {/* Right Column: AI Inspection Results */}
        <div
          style={{
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                2. AI Diagnostic & Valuation Result
              </h4>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Multimodal classification & hazard detection
              </span>
            </div>

            {aiResult && (
              <button
                onClick={handleSpeakGuidanceHindi}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: isSpeaking ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--border-subtle)',
                  color: isSpeaking ? '#34d399' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                <Volume2 size={15} />
                <span>{isSpeaking ? 'बोल रहा है...' : '🔊 Hindi Audio'}</span>
              </button>
            )}
          </div>

          {!aiResult && !isAnalyzing && (
            <div
              style={{
                height: '340px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                color: 'var(--text-muted)',
                textAlign: 'center',
                border: '1px dashed var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <Cpu size={36} strokeWidth={1.5} color="var(--text-muted)" />
              <p style={{ fontSize: '13px', maxWidth: '280px' }}>
                Click "Inspect Scrap with Gemini Vision AI" to execute real multimodal visual classification.
              </p>
            </div>
          )}

          {isAnalyzing && (
            <div
              style={{
                height: '340px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                color: 'var(--text-secondary)',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: '3px solid rgba(16, 185, 129, 0.2)',
                  borderTopColor: 'var(--emerald-accent)',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Calling Gemini 2.5 Flash Multimodal Pipeline
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Extracting circuit topology, component grading, and Delhi rate cards...
                </p>
              </div>
            </div>
          )}

          {aiResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Category & Confidence Badge */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#34d399',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                      }}
                    >
                      {aiResult.parent_code}
                    </span>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {aiResult.sub_name}
                    </h4>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
                    Parent Category: {aiResult.parent_name} · Condition: <strong style={{ color: '#fff' }}>{aiResult.condition.toUpperCase()}</strong>
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#34d399' }}>
                    {Math.round(aiResult.category_confidence * 100)}%
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>AI Confidence</span>
                </div>
              </div>

              {/* Hazard Alert Banner */}
              {aiResult.is_hazardous && (
                <div
                  style={{
                    padding: '12px 14px',
                    background: 'rgba(244, 63, 94, 0.12)',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                  }}
                >
                  <AlertTriangle size={18} color="#fb7185" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#fda4af' }}>
                      Hazard Alert: {aiResult.hazard_flags.join(', ')}
                    </div>
                    <p style={{ fontSize: '11px', color: '#fecdd3', marginTop: '2px', lineHeight: 1.4 }}>
                      {aiResult.hazard_advisory || 'Hazardous e-waste detected. Route exclusively to authorized recycler.'}
                    </p>
                  </div>
                </div>
              )}

              {/* AI Notes & Components */}
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--text-primary)' }}>Visual Inspection: </strong>
                {aiResult.ai_notes}
              </div>

              {aiResult.identified_components && aiResult.identified_components.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {aiResult.identified_components.map((comp, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              )}

              {/* Valuation Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                  textAlign: 'center',
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Benchmark Rate</span>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                    ₹{aiResult.suggested_rate_per_kg}/kg
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Declared Weight</span>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                    {weightKg} kg
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: '#34d399', fontWeight: 600 }}>Estimated Valuation</span>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>
                    ₹{aiResult.estimated_value?.toLocaleString('en-IN') || (weightKg * aiResult.suggested_rate_per_kg).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Compliance Tag & Model info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>EPR Rule: {aiResult.epr_schedule1_hint || 'Schedule I'}</span>
                <span>Model: {aiResult.ai_model_used}</span>
              </div>

              {/* Submit / Match Action */}
              {!submittedLotCode ? (
                <button
                  onClick={handleSubmitLot}
                  style={{
                    padding: '14px',
                    background: 'var(--emerald-accent)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    color: '#000',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '4px',
                  }}
                >
                  <CheckCircle2 size={18} />
                  <span>Confirm & Post Lot to Recycler Match Queue</span>
                </button>
              ) : (
                <div
                  style={{
                    padding: '14px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid var(--emerald-accent)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#34d399' }}>
                    <CheckCircle2 size={18} />
                    <span style={{ fontWeight: 700 }}>Lot Successfully Matched ({submittedLotCode})</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Matched with <strong>{CURRENT_RECYCLER.business_name}</strong> in Okhla. Ready for weighbridge handover!
                  </p>
                  <button
                    onClick={onNavigateToRecyclerQueue}
                    style={{
                      marginTop: '6px',
                      padding: '8px 14px',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>View in Recycler Incoming Lots Queue</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
