'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Upload, Image as ImageIcon, X, Clipboard, Cpu, BatteryCharging, Zap } from 'lucide-react';
import styles from './Collector.module.css';

export interface SamplePreset {
  id: string;
  label: string;
  category: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  defaultWeight: number;
  sampleType: string;
  rateHint: string;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
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

interface ImageUploaderProps {
  selectedImageBase64: string | null;
  selectedImageFile: File | null;
  activePreset: string;
  onSelectPreset: (preset: SamplePreset) => void;
  onImageSelected: (file: File, base64: string) => void;
  onClearImage: () => void;
}

export default function ImageUploader({
  selectedImageBase64,
  selectedImageFile,
  activePreset,
  onSelectPreset,
  onImageSelected,
  onClearImage,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
            const reader = new FileReader();
            reader.onload = () => {
              onImageSelected(file, reader.result as string);
              setToastMessage('📋 Photo pasted from clipboard! Ready for Gemini inspection.');
              setTimeout(() => setToastMessage(null), 3500);
            };
            reader.readAsDataURL(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onImageSelected]);

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
        const reader = new FileReader();
        reader.onload = () => {
          onImageSelected(file, reader.result as string);
          setToastMessage('📁 Photo dropped successfully! Ready for inspection.');
          setTimeout(() => setToastMessage(null), 3500);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        onImageSelected(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.uploaderContainer}>
      {toastMessage && (
        <div className={styles.toastAlert}>
          <Clipboard size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Interactive Dropzone */}
      <div
        className={`${styles.dropzone} ${isDragging ? styles.dropzoneDragging : ''} ${
          selectedImageBase64 ? styles.dropzoneHasImage : ''
        }`}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Upload scrap photo"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />

        {selectedImageBase64 ? (
          <div className={styles.previewWrapper}>
            <img
              src={selectedImageBase64}
              alt="Selected scrap lot"
              className={styles.previewImage}
            />
            <button
              type="button"
              className={styles.removeImgBtn}
              onClick={(e) => {
                e.stopPropagation();
                onClearImage();
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              aria-label="Remove image"
            >
              <X size={14} />
              <span>Remove</span>
            </button>
            <div className={styles.replaceHint}>
              Press <strong className={styles.highlightText}>⌘+V / Ctrl+V</strong> or click to replace
            </div>
          </div>
        ) : (
          <div className={styles.dropzonePrompt}>
            <div className={styles.uploadIconCircle}>
              {isDragging ? <Upload size={24} /> : <ImageIcon size={24} />}
            </div>
            <div>
              <span className={styles.dropzonePrimaryText}>
                {isDragging ? 'Drop your photo here' : 'Add a scrap photo'}
              </span>
              <span className={styles.dropzoneSubText}>
                Browse, drag a file, or paste · JPG, PNG, WebP
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
