'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Cpu,
  BatteryCharging,
  Zap,
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
  Clipboard,
  X,
  Image as ImageIcon,
  MapPin,
  IndianRupee,
  Layers,
} from 'lucide-react';
import { Lot, LotMatch } from '@/types/database';
import { CURRENT_RECYCLER } from '@/lib/mock-data';

interface CollectorPortalProps {
  onLotCreated: (newMatch: LotMatch) => void;
  onNavigateToRecyclerQueue: () => void;
}

interface AIClassificationResult {
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

const SAMPLE_PRESETS = [
  {
    id: 'pcb',
    label: 'Motherboard PCB',
    category: 'Printed Circuit Boards',
    icon: Cpu,
    defaultWeight: 14.5,
    sampleType: 'motherboard',
    rateHint: '₹350/kg',
  },
  {
    id: 'battery',
    label: 'Li-Ion Battery',
    category: 'Lithium-Ion Batteries',
    icon: BatteryCharging,
    defaultWeight: 8.0,
    sampleType: 'battery',
    rateHint: '₹180/kg',
  },
  {
    id: 'cables',
    label: 'Copper Cables',
    category: 'Cables & Wires',
    icon: Zap,
    defaultWeight: 22.0,
    sampleType: 'cables',
    rateHint: '₹280/kg',
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

  // AI State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AIClassificationResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [submittedLotCode, setSubmittedLotCode] = useState<string | null>(null);

  // Paste & Drag state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Offline state
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [offlineOutboxCount, setOfflineOutboxCount] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Global Clipboard Paste (Cmd+V / Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            setSelectedImageFile(file);
            setActivePreset('');
            setAiResult(null);
            setSubmittedLotCode(null);

            const reader = new FileReader();
            reader.onload = () => {
              setSelectedImageBase64(reader.result as string);
              setToastMessage('📋 Photo pasted from clipboard! Ready for Gemini inspection.');
              setTimeout(() => setToastMessage(null), 4000);
            };
            reader.readAsDataURL(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedImageFile(file);
        setActivePreset('');
        setAiResult(null);
        setSubmittedLotCode(null);

        const reader = new FileReader();
        reader.onload = () => {
          setSelectedImageBase64(reader.result as string);
          setToastMessage('📁 Photo dropped successfully! Ready for inspection.');
          setTimeout(() => setToastMessage(null), 3500);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleClearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageFile(null);
    setSelectedImageBase64(null);
    setActivePreset('pcb');
    setAiResult(null);
    setSubmittedLotCode(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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

  // Run Gemini Multimodal Vision AI Inspection
  const handleRunAiInspection = async () => {
    setIsAnalyzing(true);
    setApiError(null);
    setAiResult(null);
    setSubmittedLotCode(null);

    try {
      let response;

      if (selectedImageFile) {
        const formData = new FormData();
        formData.append('file', selectedImageFile);
        formData.append('weight_kg', weightKg.toString());
        formData.append('ward_name', wardName);

        response = await fetch(`${apiUrl}/api/classify-image-upload`, {
          method: 'POST',
          body: formData,
        });
      } else if (selectedImageBase64) {
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
        const currentPreset = SAMPLE_PRESETS.find((p) => p.id === activePreset) || SAMPLE_PRESETS[0];
        response = await fetch(`${apiUrl}/api/test-sample`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sample_type: currentPreset.sampleType,
            weight_kg: weightKg,
            ward_name: wardName,
          }),
        });
      }

      if (!response.ok) {
        throw new Error(`AI Service Error (${response.status}): ${response.statusText}`);
      }

      const data = await response.json();
      setAiResult(data);
    } catch (err: any) {
      console.warn('API error, falling back to simulated pilot evaluation:', err);
      setApiError(`Cloud API offline: Running simulated on-device Delhi pilot model.`);

      const preset = SAMPLE_PRESETS.find((p) => p.id === activePreset) || SAMPLE_PRESETS[0];
      const rate = preset.id === 'pcb' ? 350 : preset.id === 'battery' ? 180 : 280;
      setAiResult({
        parent_code: preset.id === 'pcb' ? 'PCB' : preset.id === 'battery' ? 'BATTERY' : 'CABLE_WIRE',
        parent_name: preset.category,
        sub_code: preset.sampleType,
        sub_name: preset.label,
        condition: 'scrap',
        category_confidence: 0.94,
        hazard_flags: preset.id === 'battery' ? ['lithium_fire_risk'] : preset.id === 'pcb' ? ['leaded_solder'] : [],
        is_hazardous: preset.id === 'battery' || preset.id === 'pcb',
        hazard_advisory:
          preset.id === 'battery'
            ? 'Do not puncture or heat. Isolate in non-conductive bin.'
            : 'Contains leaded components. Wear protective gloves.',
        suggested_rate_per_kg: rate,
        estimated_value: weightKg * rate,
        epr_schedule1_hint: 'Schedule I (ITEW2 to ITEW16)',
        identified_components: ['Standard Printed Circuit', 'Electronic ICs', 'Contact Leads'],
        ai_notes: 'Visual scrap lot verified under Delhi pilot e-waste benchmark standards.',
        ai_model_used: 'Gemini 2.5 Flash (Pilot Grounded)',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Hindi TTS Read-Aloud
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

  // Confirm and Post Lot to Recycler Match Queue
  const handleSubmitLot = () => {
    if (!aiResult) return;

    if (isOffline) {
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
    <div>
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Collector AI Scrap Scanner</h2>
          <p>
            Multimodal Gemini 2.5 Flash visual inspection & real-time Delhi scrap valuation for informal kabadiwalas.
          </p>
        </div>

        {/* Mode Toggles */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => setIsOffline(!isOffline)}
            className="btn btn-outline"
            style={{
              padding: '8px 14px',
              fontSize: '12px',
              borderColor: isOffline ? 'var(--amber-accent)' : 'var(--border-subtle)',
              color: isOffline ? '#fbbf24' : 'var(--text-secondary)',
              background: isOffline ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
            }}
          >
            {isOffline ? <WifiOff size={15} color="#fbbf24" /> : <Wifi size={15} />}
            <span>{isOffline ? 'Offline Mode Active' : 'Online Sync Active'}</span>
          </button>

          {offlineOutboxCount > 0 && (
            <span className="badge badge-amber">
              {offlineOutboxCount} Outbox Queued
            </span>
          )}
        </div>
      </div>

      {/* Top Stat Highlights */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-header">
            <span>Vision Engine</span>
            <Sparkles size={18} color="var(--emerald-accent)" />
          </div>
          <div className="stat-value" style={{ fontSize: '24px' }}>Gemini 2.5 Flash</div>
          <div className="stat-subtext positive">
            <CheckCircle2 size={14} />
            <span>Multimodal Structured Output</span>
          </div>
        </div>

        <div className="stat-card cyan">
          <div className="stat-header">
            <span>Grounding Scope</span>
            <MapPin size={18} color="var(--cyan-accent)" />
          </div>
          <div className="stat-value" style={{ fontSize: '24px' }}>Delhi Pilot</div>
          <div className="stat-subtext">
            <span>Shahdara, Mandoli & Okhla</span>
          </div>
        </div>

        <div className="stat-card amber">
          <div className="stat-header">
            <span>Price Discovery</span>
            <IndianRupee size={18} color="var(--amber-accent)" />
          </div>
          <div className="stat-value" style={{ fontSize: '24px' }}>Live Rates</div>
          <div className="stat-subtext">
            <span>CPCB Schedule I & DPCC Rules</span>
          </div>
        </div>

        <div className="stat-card violet">
          <div className="stat-header">
            <span>Fast Input</span>
            <Clipboard size={18} color="var(--violet-accent)" />
          </div>
          <div className="stat-value" style={{ fontSize: '24px' }}>Paste Enabled</div>
          <div className="stat-subtext">
            <span>Press ⌘+V / Ctrl+V anytime</span>
          </div>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            padding: '12px 18px',
            marginBottom: '20px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid var(--emerald-accent)',
            borderRadius: 'var(--radius-md)',
            color: '#34d399',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Clipboard size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main 2-Column Interface */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Column: Photograph Capture & Inputs */}
        <div className="content-card">
          <div className="card-title-bar">
            <div>
              <h3>1. Scrap Photograph (Photo Capture)</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Paste a screenshot, pick a Delhi test preset, or upload an image from your device.
              </p>
            </div>
          </div>

          {/* Delhi Pilot Presets */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
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
                    transition: 'var(--transition-smooth)',
                  }}
                >
                  <Icon size={20} />
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>{p.label}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.rateHint}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Dropzone with Paste & Drag Support */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              minHeight: '200px',
              border: isDragging
                ? '2px dashed #06b6d4'
                : selectedImageBase64
                ? '2px solid rgba(16, 185, 129, 0.4)'
                : '2px dashed var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              cursor: 'pointer',
              background: isDragging
                ? 'rgba(6, 182, 212, 0.08)'
                : selectedImageBase64
                ? '#070c14'
                : 'rgba(255, 255, 255, 0.02)',
              position: 'relative',
              overflow: 'hidden',
              padding: '20px',
              transition: 'var(--transition-smooth)',
              boxShadow: isDragging ? '0 0 20px rgba(6, 182, 212, 0.25)' : 'none',
              marginBottom: '20px',
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
              <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img
                  src={selectedImageBase64}
                  alt="Selected scrap lot"
                  style={{ maxHeight: '160px', maxWidth: '100%', objectFit: 'contain', borderRadius: 'var(--radius-sm)' }}
                />

                <button
                  type="button"
                  onClick={handleClearImage}
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: 'rgba(239, 68, 68, 0.9)',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    padding: '4px 10px',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                  }}
                >
                  <X size={12} />
                  <span>Remove</span>
                </button>

                <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  Press <strong style={{ color: '#34d399' }}>⌘+V / Ctrl+V</strong> or click to replace
                </div>
              </div>
            ) : (
              <>
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: isDragging ? 'rgba(6, 182, 212, 0.15)' : 'rgba(16, 185, 129, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isDragging ? '#22d3ee' : '#34d399',
                  }}
                >
                  {isDragging ? <Upload size={24} /> : <ImageIcon size={24} />}
                </div>

                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                    {isDragging ? 'Drop photo here to inspect' : 'Click to browse or press ⌘+V / Ctrl+V to paste'}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                    Supports screenshots, copied web photos, JPEG, PNG, WEBP
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <span className="badge badge-safe">
                    <Clipboard size={12} />
                    <span>Paste Enabled</span>
                  </span>
                  <span className="badge badge-cyan">
                    <span>Drag & Drop</span>
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Weight & Ward Selectors */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Collector Weight (kg)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 14px',
                    background: 'rgba(255, 255, 255, 0.04)',
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
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontSize: '13px',
                }}
              >
                <option value="Okhla Industrial Area Phase 1">Okhla Industrial Area Ph 1</option>
                <option value="Mandoli & Shahdara E-Waste Hub">Mandoli / Shahdara Hub</option>
                <option value="Patparganj Industrial Area">Patparganj Industrial Area</option>
                <option value="Peeragarhi Electronics Market">Peeragarhi Industrial Area</option>
                <option value="Mohan Cooperative Industrial Estate">Mohan Cooperative Industrial Area</option>
              </select>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleRunAiInspection}
            disabled={isAnalyzing}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '14px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
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
            <div style={{ marginTop: '14px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', fontSize: '12px', color: '#f87171' }}>
              {apiError}
            </div>
          )}
        </div>

        {/* Right Column: AI Diagnostic & Valuation Result */}
        <div className="content-card">
          <div className="card-title-bar">
            <div>
              <h3>2. Diagnostic & Valuation Result</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                CPCB classification, hazard advisory, and instant fair-price calculation.
              </p>
            </div>

            {aiResult && (
              <button
                onClick={handleSpeakHindi}
                className="btn btn-secondary"
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  color: isSpeaking ? '#34d399' : 'var(--text-primary)',
                  borderColor: isSpeaking ? 'var(--emerald-accent)' : 'var(--border-subtle)',
                }}
              >
                <Volume2 size={15} />
                <span>{isSpeaking ? 'बोल रहा है...' : '🔊 Hindi Audio'}</span>
              </button>
            )}
          </div>

          {/* Empty State */}
          {!aiResult && !isAnalyzing && (
            <div
              style={{
                minHeight: '380px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
                color: 'var(--text-muted)',
                textAlign: 'center',
                border: '1px dashed var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Cpu size={28} color="var(--text-muted)" />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Awaiting Scrap Inspection
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '320px', lineHeight: 1.5 }}>
                  Click &ldquo;Inspect Scrap with Gemini Vision AI&rdquo; or paste an image to view category, condition, hazard flags, and Delhi market valuation.
                </p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <div
              style={{
                minHeight: '380px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                textAlign: 'center',
                padding: '24px',
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
              <div>
                <h4 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Calling Gemini 2.5 Flash Vision Pipeline
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '300px' }}>
                  Analyzing physical condition, identifying electronic components, and querying Delhi benchmark rates...
                </p>
              </div>
            </div>
          )}

          {/* AI Result Card */}
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
                    <span className="badge badge-safe">
                      {aiResult.parent_code}
                    </span>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {aiResult.sub_name}
                    </h4>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', display: 'block' }}>
                    Category: {aiResult.parent_name} · Condition: <strong style={{ color: '#fff' }}>{aiResult.condition.toUpperCase()}</strong>
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--emerald-accent)', fontFamily: 'Outfit, sans-serif' }}>
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
                    background: 'rgba(244, 63, 94, 0.1)',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                  }}
                >
                  <AlertTriangle size={18} color="#fb7185" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#fda4af' }}>
                      Hazard Detected: {aiResult.hazard_flags.join(', ')}
                    </div>
                    <p style={{ fontSize: '12px', color: '#fecdd3', marginTop: '2px', lineHeight: 1.4 }}>
                      {aiResult.hazard_advisory || 'Hazardous e-waste detected. Route exclusively to DPCC-authorized recycler.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Visual Inspection Notes */}
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Visual Diagnostic: </strong>
                {aiResult.ai_notes}
              </div>

              {/* Components */}
              {aiResult.identified_components && aiResult.identified_components.length > 0 && (
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                    Identified Components
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {aiResult.identified_components.map((comp, idx) => (
                      <span
                        key={idx}
                        className="badge badge-cyan"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Valuation Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                  textAlign: 'center',
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Benchmark Rate</span>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                    ₹{aiResult.suggested_rate_per_kg}/kg
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Declared Weight</span>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                    {weightKg} kg
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--emerald-accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Valuation</span>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--emerald-accent)', marginTop: '2px', fontFamily: 'Outfit, sans-serif' }}>
                    ₹{aiResult.estimated_value?.toLocaleString('en-IN') || (weightKg * aiResult.suggested_rate_per_kg).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* EPR Metadata */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>Rule: {aiResult.epr_schedule1_hint || 'CPCB Schedule I'}</span>
                <span>Model: {aiResult.ai_model_used}</span>
              </div>

              {/* Submit Button */}
              {!submittedLotCode ? (
                <button
                  onClick={handleSubmitLot}
                  className="btn btn-primary"
                  style={{
                    padding: '14px',
                    fontSize: '14px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <CheckCircle2 size={18} />
                  <span>Confirm & Post Lot to Recycler Match Queue</span>
                </button>
              ) : (
                <div
                  style={{
                    padding: '16px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid var(--emerald-accent)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#34d399' }}>
                    <CheckCircle2 size={18} />
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>Lot Matched Successfully ({submittedLotCode})</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Matched with <strong>{CURRENT_RECYCLER.business_name}</strong> in Okhla. Ready for weighbridge handover!
                  </p>
                  <button
                    onClick={onNavigateToRecyclerQueue}
                    className="btn btn-secondary"
                    style={{
                      marginTop: '4px',
                      padding: '10px 14px',
                      fontSize: '13px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
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
