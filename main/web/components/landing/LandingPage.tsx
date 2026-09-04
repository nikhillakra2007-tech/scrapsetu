'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Scan,
  CheckCircle2,
  QrCode,
  Recycle,
  Menu,
  X,
  UserCheck,
  Cpu,
  Smartphone,
  Zap,
  Server,
  Scale,
  Building2,
  Key,
} from 'lucide-react';
import SmoothScroll from '@/components/SmoothScroll';
import styles from './LandingPage.module.css';

// Interactive Scrap Simulator Data Sets
interface ScrapSimulationData {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number }>;
  weight: string;
  aiClass: string;
  purity: string;
  facility: string;
  ratePerKg: string;
  totalPayout: string;
  qrHash: string;
  safetyAlert: string;
}

const SCRAP_CATALOG: ScrapSimulationData[] = [
  {
    id: 'pcb',
    name: 'Telecom PCB',
    icon: Cpu,
    weight: '45.0 kg',
    aiClass: 'High-Grade Telecom Gold PCB',
    purity: '98.4% Gold/Copper traces',
    facility: 'EcoRecycle Hub · Okhla Phase III',
    ratePerKg: '₹420 / kg',
    totalPayout: '₹18,900',
    qrHash: 'SETU-DEL-8942-OKHLA',
    safetyAlert: 'Contains lead solders — PPE gloves advised',
  },
  {
    id: 'smartphones',
    name: 'End-of-Life Phones',
    icon: Smartphone,
    weight: '28.5 kg',
    aiClass: 'Mixed Li-ion Devices (Lithium Batteries)',
    purity: 'High rare-earth & cobalt density',
    facility: 'GreenE-Waste Technologies · Mayapuri',
    ratePerKg: '₹340 / kg',
    totalPayout: '₹9,690',
    qrHash: 'SETU-DEL-4102-MAYA',
    safetyAlert: 'Battery puncture hazard — isolate thermal cells',
  },
  {
    id: 'copper',
    name: 'Stripped Copper',
    icon: Zap,
    weight: '62.0 kg',
    aiClass: 'Grade 1 Clean Berry Copper Wire',
    purity: '99.2% Pure Electrolytic Copper',
    facility: 'Apex Non-Ferrous Smelters · Bawana',
    ratePerKg: '₹715 / kg',
    totalPayout: '₹44,330',
    qrHash: 'SETU-DEL-7731-BAW',
    safetyAlert: 'Sharp sheared ends — handle with reinforced gloves',
  },
  {
    id: 'server',
    name: 'Server Chassis',
    icon: Server,
    weight: '110.0 kg',
    aiClass: 'Enterprise Rack Backplanes & PSU',
    purity: 'Dual copper busbars + alloy casing',
    facility: 'Capital EPR Aggregators · Narela',
    ratePerKg: '₹280 / kg',
    totalPayout: '₹30,800',
    qrHash: 'SETU-DEL-6520-NAR',
    safetyAlert: 'Heavy assembly — mechanical team lift required',
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('pcb');
  const [activeStage, setActiveStage] = useState<'ai' | 'recycler' | 'handover'>('ai');
  const [existingUser, setExistingUser] = useState<{
    name: string;
    role: 'collector' | 'recycler' | 'admin';
  } | null>(null);

  // Check if visitor already has an active session
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('scrapsetu_auth_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.role) {
            setExistingUser(parsed);
          }
        }
      }
    } catch (e) {
      // Ignore parse error
    }
  }, []);

  const activeMaterial =
    SCRAP_CATALOG.find((m) => m.id === selectedMaterialId) || SCRAP_CATALOG[0];

  const workspaceUrl = existingUser
    ? existingUser.role === 'collector'
      ? '/collector'
      : '/recycler'
    : '/auth';

  return (
    <SmoothScroll>
      <div className={styles.landingContainer}>
        {/* --------------------------------------------------------------------
            Sticky Top Navigation
            -------------------------------------------------------------------- */}
        <header className={styles.topNav}>
          <div className={styles.navInner}>
            <a href="#" className={styles.navBrand} aria-label="ScrapSetu Home">
              <div className={styles.brandIconWrap}>
                <Recycle size={21} strokeWidth={2.4} />
              </div>
              <span className={styles.brandName}>
                ScrapSetu<span className={styles.brandDot}>.</span>
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <nav className={styles.navLinks} aria-label="Main Navigation">
              <a href="#what-it-does" className={styles.navLink}>
                What It Does
              </a>
              <a href="#how-it-works" className={styles.navLink}>
                How It Works
              </a>
              <a href="#why-it-matters" className={styles.navLink}>
                Why It Matters
              </a>
            </nav>

            {/* Desktop Action Buttons */}
            <div className={styles.navActions}>
              {existingUser ? (
                <Link href={workspaceUrl} className={styles.navJoinBtn}>
                  <UserCheck size={16} />
                  <span>Go to {existingUser.role === 'collector' ? 'Collector' : 'Recycler'} Hub</span>
                </Link>
              ) : (
                <>
                  <Link href="/auth" className={styles.navSignInBtn}>
                    Sign In
                  </Link>
                  <Link href="/auth" className={styles.navJoinBtn}>
                    <span>Join ScrapSetu</span>
                    <ArrowRight size={15} />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              className={styles.mobileMenuBtn}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className={styles.mobileDropdown}>
              <a href="#what-it-does" onClick={() => setMobileMenuOpen(false)}>
                What It Does
              </a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>
                How It Works
              </a>
              <a href="#why-it-matters" onClick={() => setMobileMenuOpen(false)}>
                Why It Matters
              </a>
              <div className={styles.mobileDropdownActions}>
                {existingUser ? (
                  <Link
                    href={workspaceUrl}
                    className={styles.navJoinBtn}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <UserCheck size={16} />
                    <span>Go to Workspace</span>
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/auth"
                      className={styles.navSignInBtn}
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth"
                      className={styles.navJoinBtn}
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      <span>Join ScrapSetu</span>
                      <ArrowRight size={15} />
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </header>

        {/* --------------------------------------------------------------------
            Hero Section with Gentle Entrance Bounce
            -------------------------------------------------------------------- */}
        <section className={styles.heroSection}>
          <div className={styles.heroGlowCircle} />
          <div className={styles.heroContainer}>
            <div className={styles.heroContent}>
              <div className={styles.heroBadge}>
                <span className={styles.heroBadgeDot} />
                <span>Pilot Program · Delhi NCR</span>
              </div>

              <h1 className={styles.heroTitle}>
                Bridging Grassroots Scrap Collection with{' '}
                <span className={styles.heroTitleAccent}>Formal Recycling</span>.
              </h1>

              <p className={styles.heroSubtitle}>
                ScrapSetu connects informal collectors and neighborhood kabadiwalas with
                DPCC/CPCB authorized recyclers through AI scrap classification, fair price discovery,
                and digital QR handovers.
              </p>

              <div className={styles.heroActions}>
                {existingUser ? (
                  <Link href={workspaceUrl} className={styles.primaryCta}>
                    <span>Enter {existingUser.role === 'collector' ? 'Collector' : 'Recycler'} Workspace</span>
                    <ArrowRight size={18} />
                  </Link>
                ) : (
                  <Link href="/auth" className={styles.primaryCta}>
                    <span>Join ScrapSetu</span>
                    <ArrowRight size={18} />
                  </Link>
                )}
                <a href="#how-it-works" className={styles.secondaryCta}>
                  <span>Explore How It Works</span>
                </a>
              </div>

              <div className={styles.heroMetaPills}>
                <div className={styles.metaItem}>
                  <CheckCircle2 size={16} />
                  <span>DPCC / CPCB Compliant</span>
                </div>
                <div className={styles.metaItem}>
                  <CheckCircle2 size={16} />
                  <span>Zero Middleman Deductions</span>
                </div>
                <div className={styles.metaItem}>
                  <CheckCircle2 size={16} />
                  <span>Dual QR Traceability</span>
                </div>
              </div>
            </div>

            {/* Interactive Scrap Material & Flow Simulator */}
            <div className={styles.simulatorCard}>
              <div className={styles.simulatorHeader}>
                <div className={styles.simulatorTitleGroup}>
                  <span className={styles.simulatorBadge}>Live Flow Simulator</span>
                  <h3 className={styles.simulatorHeading}>Interactive Scrap Verification</h3>
                </div>
                <span className={styles.livePill}>
                  <CheckCircle2 size={13} /> Active Flow
                </span>
              </div>

              {/* Scrap Material Picker Chips */}
              <div className={styles.materialPickerRow} role="tablist" aria-label="Select Scrap Material">
                {SCRAP_CATALOG.map((mat) => {
                  const Icon = mat.icon;
                  const isActive = mat.id === selectedMaterialId;
                  return (
                    <button
                      key={mat.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={`${styles.materialChip} ${isActive ? styles.materialChipActive : ''}`}
                      onClick={() => setSelectedMaterialId(mat.id)}
                    >
                      <Icon size={14} />
                      <span>{mat.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Step Stage Tabs */}
              <div className={styles.stepSelectorRow}>
                <button
                  type="button"
                  className={`${styles.stepTabBtn} ${activeStage === 'ai' ? styles.stepTabBtnActive : ''}`}
                  onClick={() => setActiveStage('ai')}
                >
                  1. AI Scan
                </button>
                <button
                  type="button"
                  className={`${styles.stepTabBtn} ${activeStage === 'recycler' ? styles.stepTabBtnActive : ''}`}
                  onClick={() => setActiveStage('recycler')}
                >
                  2. Recycler Match
                </button>
                <button
                  type="button"
                  className={`${styles.stepTabBtn} ${activeStage === 'handover' ? styles.stepTabBtnActive : ''}`}
                  onClick={() => setActiveStage('handover')}
                >
                  3. QR Handover
                </button>
              </div>

              {/* Stage Dynamic Preview Content */}
              <div className={styles.stagePreviewBox}>
                {activeStage === 'ai' && (
                  <>
                    <div className={styles.stageRow}>
                      <span className={styles.stageLabel}>AI Vision Inspection</span>
                      <span className={styles.stageTagLeaf}>98.4% Confidence</span>
                    </div>
                    <div>
                      <div className={styles.stageValue}>{activeMaterial.aiClass}</div>
                      <div className={styles.stageDetailText}>{activeMaterial.purity}</div>
                    </div>
                    <div className={styles.stageRow} style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.65rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Net Weight:</span>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{activeMaterial.weight}</strong>
                    </div>
                  </>
                )}

                {activeStage === 'recycler' && (
                  <>
                    <div className={styles.stageRow}>
                      <span className={styles.stageLabel}>Matched Authorized Facility</span>
                      <span className={styles.stageTagSuccess}>DPCC Authorized</span>
                    </div>
                    <div>
                      <div className={styles.stageValue}>{activeMaterial.facility}</div>
                      <div className={styles.stageDetailText}>
                        Benchmark Rate: <strong>{activeMaterial.ratePerKg}</strong>
                      </div>
                    </div>
                    <div className={styles.stageRow} style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.65rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Direct Gate Payout:</span>
                      <strong style={{ fontSize: '1.1rem', color: '#005F52' }}>{activeMaterial.totalPayout}</strong>
                    </div>
                  </>
                )}

                {activeStage === 'handover' && (
                  <>
                    <div className={styles.stageRow}>
                      <span className={styles.stageLabel}>Facility Gate Dual QR</span>
                      <span className={styles.stageTagSuccess}>EPR Tamper-Evident</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 8,
                          backgroundColor: '#E8F7F3',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#005F52',
                        }}
                      >
                        <QrCode size={24} />
                      </div>
                      <div>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', fontWeight: 700, color: '#020F12' }}>
                          {activeMaterial.qrHash}
                        </div>
                        <div style={{ fontSize: '0.775rem', color: '#647D6D' }}>Weighment confirmed on certified scale</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.785rem', color: '#0B6141', background: '#E7F8F1', padding: '0.4rem 0.65rem', borderRadius: 8 }}>
                      ✓ Immutable digital manifest logged for DPCC inspection
                    </div>
                  </>
                )}
              </div>

              {/* Simulator Bottom Navigation */}
              <div className={styles.simulatorBottomNav}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Selected: <strong>{activeMaterial.name}</strong> ({activeMaterial.weight})
                </span>
                <button
                  type="button"
                  className={styles.simQuickAction}
                  onClick={() => {
                    const stages: Array<'ai' | 'recycler' | 'handover'> = ['ai', 'recycler', 'handover'];
                    const nextIdx = (stages.indexOf(activeStage) + 1) % stages.length;
                    setActiveStage(stages[nextIdx]);
                  }}
                >
                  <span>Next step in flow</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------------------
            Section: What ScrapSetu Does (Interactive Spotlight Hover)
            -------------------------------------------------------------------- */}
        <section id="what-it-does" className={`${styles.sectionWrapper} ${styles.sectionWrapperAlt}`}>
          <div className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>Platform Capabilities</div>
              <h2 className={styles.sectionTitle}>What ScrapSetu Does</h2>
              <p className={styles.sectionSubtitle}>
                By replacing informal guesswork with structured verification, ScrapSetu transforms
                fragmented waste recovery into a transparent, circular supply chain.
              </p>
            </div>

            {/* Spotlight Grid: Hovering on one card gently dims siblings */}
            <div className={`${styles.spotlightGrid} ${styles.pillarsGrid}`}>
              <div className={`${styles.spotlightItem} ${styles.pillarCard}`}>
                <div className={styles.pillarIconBox}>
                  <Sparkles size={26} />
                </div>
                <h3 className={styles.pillarTitle}>AI Scrap Identification</h3>
                <p className={styles.pillarDescription}>
                  Field collectors snap an image of aggregated scrap. The AI models identify material
                  types, detect electronic component grades, estimate purity levels, and provide safety
                  warnings for hazardous parts.
                </p>
                <span className={styles.pillarFooterTag}>
                  Instant Visual Recognition <ArrowRight size={14} />
                </span>
              </div>

              <div className={`${styles.spotlightItem} ${styles.pillarCard}`}>
                <div className={styles.pillarIconBox}>
                  <TrendingUp size={26} />
                </div>
                <h3 className={styles.pillarTitle}>Transparent Price Discovery</h3>
                <p className={styles.pillarDescription}>
                  Live benchmark rate cards indexed against DPCC/CPCB regional recycler rates ensure
                  informal collectors receive fair, transparent value for their materials without predatory
                  middleman markdowns.
                </p>
                <span className={styles.pillarFooterTag}>
                  Direct Recycler Pricing <ArrowRight size={14} />
                </span>
              </div>

              <div className={`${styles.spotlightItem} ${styles.pillarCard}`}>
                <div className={styles.pillarIconBox}>
                  <QrCode size={26} />
                </div>
                <h3 className={styles.pillarTitle}>Traceable Handover Records</h3>
                <p className={styles.pillarDescription}>
                  Transactions are confirmed at the facility gate using dual-party cryptographic QR codes.
                  Every kilogram transferred is immutably documented for Extended Producer Responsibility (EPR)
                  compliance.
                </p>
                <span className={styles.pillarFooterTag}>
                  End-to-End Chain of Custody <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------------------
            Section: How It Works (5-Step Sequential Workflow with Spotlight)
            -------------------------------------------------------------------- */}
        <section id="how-it-works" className={styles.sectionWrapper}>
          <div className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>Step-by-Step Workflow</div>
              <h2 className={styles.sectionTitle}>How ScrapSetu Operates</h2>
              <p className={styles.sectionSubtitle}>
                From neighborhood collection to certified facility processing, every phase is
                streamlined for speed and regulatory integrity.
              </p>
            </div>

            <div className={`${styles.spotlightGrid} ${styles.stepsGrid}`}>
              <div className={`${styles.spotlightItem} ${styles.stepCard}`}>
                <div className={styles.stepIndex}>01</div>
                <h3 className={styles.stepTitle}>Capture</h3>
                <p className={styles.stepDesc}>
                  Field collector aggregates scrap lots and registers material via mobile scanning or voice note.
                </p>
              </div>

              <div className={`${styles.spotlightItem} ${styles.stepCard}`}>
                <div className={styles.stepIndex}>02</div>
                <h3 className={styles.stepTitle}>Identify</h3>
                <p className={styles.stepDesc}>
                  AI inspects the capture, classifies material category, evaluates contaminants, and estimates net weight.
                </p>
              </div>

              <div className={`${styles.spotlightItem} ${styles.stepCard}`}>
                <div className={styles.stepIndex}>03</div>
                <h3 className={styles.stepTitle}>Match</h3>
                <p className={styles.stepDesc}>
                  ScrapSetu pairs the verified lot with nearby authorized recyclers actively accepting that grade.
                </p>
              </div>

              <div className={`${styles.spotlightItem} ${styles.stepCard}`}>
                <div className={styles.stepIndex}>04</div>
                <h3 className={styles.stepTitle}>Handover</h3>
                <p className={styles.stepDesc}>
                  Physical scale weighment at facility gate confirmed via dual-party encrypted QR verification.
                </p>
              </div>

              <div className={`${styles.spotlightItem} ${styles.stepCard}`}>
                <div className={styles.stepIndex}>05</div>
                <h3 className={styles.stepTitle}>Trace</h3>
                <p className={styles.stepDesc}>
                  Digital manifest is permanently logged, unlocking instant fair payout and CPCB compliance filing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------------------
            Section: Why It Matters (Trust & Transparency with Spotlight)
            -------------------------------------------------------------------- */}
        <section id="why-it-matters" className={`${styles.sectionWrapper} ${styles.sectionWrapperAlt}`}>
          <div className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>Real-World Impact</div>
              <h2 className={styles.sectionTitle}>Why It Matters</h2>
              <p className={styles.sectionSubtitle}>
                Closing the gap between the informal workforce and formal sustainability infrastructure.
              </p>
            </div>

            <div className={`${styles.spotlightGrid} ${styles.impactGrid}`}>
              <div className={`${styles.spotlightItem} ${styles.impactCard}`}>
                <span className={styles.impactPill}>For Collectors</span>
                <h3 className={styles.impactTitle}>Economic Dignity & Fair Margins</h3>
                <p className={styles.impactDesc}>
                  Grassroots collectors gain direct market access, real-time rate transparency, and digital
                  identity recognition, eliminating vulnerable cash exploitation.
                </p>
              </div>

              <div className={`${styles.spotlightItem} ${styles.impactCard}`}>
                <span className={styles.impactPill}>For Recyclers</span>
                <h3 className={styles.impactTitle}>Traceable Sourcing & Compliance</h3>
                <p className={styles.impactDesc}>
                  Authorized recyclers obtain verified, categorized e-waste feedstock with complete audit trails
                  ready for DPCC inspections and national EPR mandates.
                </p>
              </div>

              <div className={`${styles.spotlightItem} ${styles.impactCard}`}>
                <span className={styles.impactPill}>For Cities & Environment</span>
                <h3 className={styles.impactTitle}>Safer Waste Diversion</h3>
                <p className={styles.impactDesc}>
                  Preventing unscientific open burning, acid washing, and toxic leaching by redirecting complex
                  circuitry directly into licensed scientific processing plants.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------------------
            Call To Action Banner:
            Vibrant Refreshing Leaf Green Palette (Light, Soothing, High-Contrast)
            -------------------------------------------------------------------- */}
        <section className={styles.sectionWrapper} style={{ borderTop: 'none', paddingTop: 0 }}>
          <div className={styles.sectionContainer}>
            <div className={styles.ctaBanner}>
              <div className={styles.ctaGlow} />
              <h2 className={styles.ctaTitle}>
                Ready to modernize scrap collection and recycling?
              </h2>
              <p className={styles.ctaSubtitle}>
                Whether you are an authorized recycling facility in Delhi NCR or a field collector
                seeking fair, direct market rates, ScrapSetu connects you directly.
              </p>
              <div className={styles.ctaButtons}>
                {existingUser ? (
                  <Link href={workspaceUrl} className={styles.ctaWhiteBtn}>
                    <UserCheck size={18} />
                    <span>Enter {existingUser.role === 'collector' ? 'Collector' : 'Recycler'} Workspace</span>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth" className={styles.ctaWhiteBtn}>
                      <span>Join ScrapSetu</span>
                      <ArrowRight size={18} />
                    </Link>
                    <Link href="/auth" className={styles.ctaOutlineBtn}>
                      <span>Sign In to Account</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------------------
            Footer
            -------------------------------------------------------------------- */}
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerBrandCol}>
              <div className={styles.footerBrandLogo}>
                ScrapSetu<span style={{ color: '#1CC596' }}>.</span>
              </div>
              <p className={styles.footerStatement}>
                Connecting informal waste collectors with DPCC/CPCB authorized recyclers through
                transparent price discovery and verifiable digital handovers.
              </p>
            </div>

            <div className={styles.footerLinks}>
              <a href="#what-it-does" className={styles.footerLink}>
                What It Does
              </a>
              <a href="#how-it-works" className={styles.footerLink}>
                How It Works
              </a>
              <a href="#why-it-matters" className={styles.footerLink}>
                Why It Matters
              </a>
              <Link href="/auth" className={styles.footerLink}>
                Authentication
              </Link>
            </div>

            <div className={styles.footerLegal}>
              <span>ScrapSetu Delhi Pilot · Kabadiwala Connect Platform</span>
              <span>Designed for regulatory compliance and circular economy traceability</span>
            </div>
          </div>
        </footer>
      </div>
    </SmoothScroll>
  );
}
