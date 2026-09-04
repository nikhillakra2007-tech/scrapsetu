'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
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
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  ArrowUpRight,
  ExternalLink,
  MapPin,
  Clock,
  ChevronRight,
  ChevronLeft,
  Layers,
  BarChart3,
  BadgeCheck,
  Camera,
  Scan,
  Truck,
  FileText,
  Check,
} from 'lucide-react';
import SmoothScroll from '@/components/SmoothScroll';
import styles from './LandingPage.module.css';

// 6-Stage End-to-End System Journey Steps
interface FlowStepItem {
  id: number;
  stage: string;
  tag: string;
  title: string;
  shortDesc: string;
  telemetry: string;
  complianceDoc: string;
  actionOutput: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const FLOW_STEPS: FlowStepItem[] = [
  {
    id: 1,
    stage: 'Capture',
    tag: 'Field Intake',
    title: 'Mobile Lot Intake & Calibrated Tare',
    shortDesc: 'Collector aggregates scrap lot and initiates digital intake via smartphone camera with calibrated scale zero-tare.',
    telemetry: 'GPS: 28.5245° N, 77.2792° E · Okhla Scrap Cluster · Scale Tare: 0.00 kg certified',
    complianceDoc: 'Form-6 Section A (Intake & Geotag)',
    actionOutput: 'Lot Genesis Manifest Created',
    icon: Camera,
  },
  {
    id: 2,
    stage: 'Identify',
    tag: 'Multimodal AI',
    title: 'Multimodal Alloy Classification & Hazard Check',
    shortDesc: 'Fine-tuned vision model decomposes material composition, grades PCB gold trace density, and isolates swelling Li-ion hazards.',
    telemetry: 'Gemini Vision: 1.2s · FR-4 Multi-layer Grade-A · 98.4% Confidence · Pb solder flagged',
    complianceDoc: 'Material Categorization Standard IS 1448',
    actionOutput: 'Purity & Trace Fractions Verified',
    icon: Scan,
  },
  {
    id: 3,
    stage: 'Price',
    tag: 'Live Index',
    title: 'Transparent DPCC Regional Rate Discovery',
    shortDesc: 'Certified gross scale weight is indexed against daily regional rates in Okhla and Mayapuri, locking in guaranteed gate payout.',
    telemetry: 'Benchmark: ₹420/kg · Certified Net: 45.0 kg · Zero Intermediary Cut · Payout: ₹18,900',
    complianceDoc: 'Regional Fair Trade Tariff Register',
    actionOutput: 'Guaranteed Payout Rate Locked',
    icon: TrendingUp,
  },
  {
    id: 4,
    stage: 'Match',
    tag: 'Smart Dispatch',
    title: 'Licensed Pyrometallurgical Facility Routing',
    shortDesc: 'ScrapSetu routes the lot to the closest authorized facility actively processing that specific alloy category.',
    telemetry: 'Dispatched: EcoRecycle Scientific Hub · Distance: 3.4km · CTO Active through 2027',
    complianceDoc: 'DPCC Registered Facility CTO #4829',
    actionOutput: 'Facility Gate Slot Reserved',
    icon: Truck,
  },
  {
    id: 5,
    stage: 'Handover',
    tag: 'Dual QR Pass',
    title: 'Dual-Party Encrypted Gate Handshake',
    shortDesc: 'Mutual SHA-256 encrypted QR exchange between collector smartphone and receiving scale terminal verifies physical custody.',
    telemetry: 'Payload: SETU-DEL-8942-OKHLA-SHA256 · Dual-party key verified at certified weighbridge',
    complianceDoc: 'CPCB Dual-Signature Digital Manifest',
    actionOutput: 'Physical Custody Transferred',
    icon: QrCode,
  },
  {
    id: 6,
    stage: 'Trace',
    tag: 'EPR Compliance',
    title: 'Instant Payout & Audit-Ready EPR Filing',
    shortDesc: 'The transaction triggers automatic UPI/NEFT transfer to the collector while issuing an audit-ready EPR credit to the recycler.',
    telemetry: 'UPI Settlement: Instant (Txn #OKH8829) · Ledger Block: #94821 · Form-6 auto-filed',
    complianceDoc: 'MoEFCC E-Waste Management Rules 2022',
    actionOutput: '100% Auditable EPR Credit Issued',
    icon: ShieldCheck,
  },
];

// Authentic Scrap Material Catalog for Interactive Product Console
interface ScrapItem {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  weight: string;
  aiClass: string;
  purity: string;
  preciousMetals: string;
  facility: string;
  ratePerKg: string;
  totalPayout: string;
  qrHash: string;
  safetyAlert: string;
  lotId: string;
  cluster: string;
  distance: string;
  co2Saved: string;
}

const SCRAP_ITEMS: ScrapItem[] = [
  {
    id: 'pcb',
    name: 'Telecom PCB Motherboards',
    category: 'Class A E-Waste',
    icon: Cpu,
    weight: '45.0 kg',
    aiClass: 'High-Grade Telecom Gold PCB (FR-4 Multi-Layer)',
    purity: '98.4% Verified Metal Traces',
    preciousMetals: 'Au: 0.82 g/kg · Cu: 28.4% · Ag: 1.4 g/kg',
    facility: 'EcoRecycle Scientific Hub · Okhla Phase III',
    ratePerKg: '₹420 / kg',
    totalPayout: '₹18,900',
    qrHash: 'SETU-DEL-8942-OKHLA-SHA256',
    safetyAlert: 'Contains lead solders — Class II nitrile PPE mandatory',
    lotId: 'LOT-2026-0842',
    cluster: 'Okhla Scrap Cluster, Delhi',
    distance: '3.4 km from gate',
    co2Saved: '142 kg CO₂e',
  },
  {
    id: 'smartphones',
    name: 'End-of-Life Smartphones',
    category: 'Complex Devices',
    icon: Smartphone,
    weight: '28.5 kg',
    aiClass: 'Mixed Li-ion Devices with Cobalt Cathodes',
    purity: 'High Rare-Earth & Cobalt Density',
    preciousMetals: 'Co: 18.2% · Nd: 3.1% · Au: 0.35 g/kg',
    facility: 'GreenE-Waste Technologies · Mayapuri Industrial Area',
    ratePerKg: '₹340 / kg',
    totalPayout: '₹9,690',
    qrHash: 'SETU-DEL-4102-MAYA-SHA256',
    safetyAlert: 'Battery thermal runaway hazard — isolate swollen cells',
    lotId: 'LOT-2026-0619',
    cluster: 'Mayapuri Metal Cluster, Delhi',
    distance: '5.1 km from gate',
    co2Saved: '96 kg CO₂e',
  },
  {
    id: 'copper',
    name: 'Stripped Bright Berry Copper',
    category: 'Non-Ferrous Wire',
    icon: Zap,
    weight: '62.0 kg',
    aiClass: 'Grade 1 Clean Berry Copper Wire (Electrolytic)',
    purity: '99.2% Pure Electrolytic Cu',
    preciousMetals: 'Cu: 99.2% · Fe: <0.05% · Sn: <0.02%',
    facility: 'Apex Non-Ferrous Smelters · Bawana Industrial Area',
    ratePerKg: '₹715 / kg',
    totalPayout: '₹44,330',
    qrHash: 'SETU-DEL-7731-BAW-SHA256',
    safetyAlert: 'Sharp sheared coil ends — heavy leather gloves required',
    lotId: 'LOT-2026-1184',
    cluster: 'Bawana Non-Ferrous Hub, Delhi',
    distance: '8.2 km from gate',
    co2Saved: '310 kg CO₂e',
  },
  {
    id: 'server',
    name: 'Enterprise Server Chassis',
    category: 'Industrial Feedstock',
    icon: Server,
    weight: '110.0 kg',
    aiClass: 'Dual Copper Busbars + Hot-Swap Server Backplanes',
    purity: 'High-Density Structural Aluminum & Copper',
    preciousMetals: 'Cu: 14.5% · Al: 58.0% · Au: 0.22 g/kg',
    facility: 'Capital EPR Aggregators · Narela Industrial Complex',
    ratePerKg: '₹280 / kg',
    totalPayout: '₹30,800',
    qrHash: 'SETU-DEL-6520-NAR-SHA256',
    safetyAlert: 'Heavy assembly (>50kg) — mechanical team lift required',
    lotId: 'LOT-2026-0371',
    cluster: 'Narela Industrial Estate, Delhi',
    distance: '11.4 km from gate',
    co2Saved: '480 kg CO₂e',
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('pcb');
  const [consoleTab, setConsoleTab] = useState<'ai' | 'pricing' | 'facility' | 'qr'>('ai');
  const [activeFlowStep, setActiveFlowStep] = useState<number>(1);
  const [existingUser, setExistingUser] = useState<{
    name: string;
    role: 'collector' | 'recycler' | 'admin';
  } | null>(null);

  // Check active user session
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

  const activeItem =
    SCRAP_ITEMS.find((m) => m.id === selectedMaterialId) || SCRAP_ITEMS[0];

  const workspaceUrl = existingUser
    ? existingUser.role === 'collector'
      ? '/collector'
      : '/recycler'
    : '/auth';

  return (
    <SmoothScroll>
      <div className={styles.pageContainer}>
        {/* ==================================================================
            1. QUIET TOP NAVIGATION BAR
            ================================================================== */}
        <header className={styles.topNav}>
          <div className={styles.navInner}>
            {/* Brand Signature */}
            <a href="#" className={styles.navBrand} aria-label="ScrapSetu Home">
              <div className={styles.brandIconWrap}>
                <Recycle size={18} strokeWidth={2.4} />
              </div>
              <span className={styles.brandName}>
                ScrapSetu<span className={styles.brandDot}>.</span>
              </span>
            </a>

            {/* Middle Nav Links */}
            <nav className={styles.navLinks} aria-label="Main Navigation">
              <a href="#what-it-does" className={styles.navLink}>
                Capabilities
              </a>
              <a href="#how-it-works" className={styles.navLink}>
                End-to-End Flow
              </a>
              <a href="#why-it-matters" className={styles.navLink}>
                Ecosystem Impact
              </a>
              <a href="#console" className={styles.navLink}>
                Live Terminal
              </a>
            </nav>

            {/* Right Actions */}
            <div className={styles.navActions}>
              {existingUser ? (
                <Link href={workspaceUrl} className={styles.navPrimaryBtn}>
                  <UserCheck size={15} />
                  <span>Go to {existingUser.role === 'collector' ? 'Collector' : 'Recycler'} Hub</span>
                </Link>
              ) : (
                <>
                  <Link href="/auth" className={styles.navSignInLink}>
                    Sign In
                  </Link>
                  <Link href="/auth" className={styles.navPrimaryBtn}>
                    <span>Join ScrapSetu</span>
                    <ArrowRight size={14} />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              className={styles.mobileMenuBtn}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className={styles.mobileDrawer}>
              <a href="#what-it-does" onClick={() => setMobileMenuOpen(false)}>
                Capabilities
              </a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>
                End-to-End Flow
              </a>
              <a href="#why-it-matters" onClick={() => setMobileMenuOpen(false)}>
                Ecosystem Impact
              </a>
              <a href="#console" onClick={() => setMobileMenuOpen(false)}>
                Live Terminal
              </a>
              <div className={styles.mobileDrawerActions}>
                {existingUser ? (
                  <Link href={workspaceUrl} className={styles.navPrimaryBtn}>
                    <UserCheck size={16} />
                    <span>Go to Workspace</span>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth" className={styles.navSignInLink}>
                      Sign In to Account
                    </Link>
                    <Link href="/auth" className={styles.navPrimaryBtn}>
                      <span>Join ScrapSetu</span>
                      <ArrowRight size={15} />
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </header>

        {/* ==================================================================
            2. HERO SECTION — 60/40 GOLDEN RATIO SPLIT
            ================================================================== */}
        <section className={styles.heroSection}>
          <div className={styles.heroGrid}>
            {/* Left 60%: High-Impact Infrastructure Story */}
            <div className={styles.heroCopyBlock}>
              <div className={styles.heroStatusEyebrow}>
                <span className={styles.livePulseDot} />
                <span>Delhi NCR Regional Network · DPCC / CPCB Aligned</span>
              </div>

              <h1 className={styles.heroHeadline}>
                The Digital Rail Connecting Informal Scrap with{' '}
                <span className={styles.heroHeadlineHighlight}>Authorized Recyclers</span>.
              </h1>

              <p className={styles.heroDescription}>
                ScrapSetu bridges India’s grassroots kabadiwala ecosystem with government-licensed
                recycling plants through computer vision classification, transparent benchmark pricing,
                and cryptographic QR gate manifests.
              </p>

              <div className={styles.heroActionCluster}>
                {existingUser ? (
                  <Link href={workspaceUrl} className={styles.primaryActionBtn}>
                    <span>Enter {existingUser.role === 'collector' ? 'Collector' : 'Recycler'} Workspace</span>
                    <ArrowRight size={16} />
                  </Link>
                ) : (
                  <Link href="/auth" className={styles.primaryActionBtn}>
                    <span>Join ScrapSetu</span>
                    <ArrowRight size={16} />
                  </Link>
                )}
                <a href="#console" className={styles.secondaryActionBtn}>
                  <span>Explore Live Terminal</span>
                  <ArrowUpRight size={15} />
                </a>
              </div>

              {/* Factual Trust Line */}
              <div className={styles.heroTrustPills}>
                <div className={styles.trustPill}>
                  <BadgeCheck size={15} className={styles.trustIcon} />
                  <span>Direct Gate Settlements (0% Middleman Cut)</span>
                </div>
                <div className={styles.trustPill}>
                  <BadgeCheck size={15} className={styles.trustIcon} />
                  <span>Dual-Party SHA-256 Manifests</span>
                </div>
                <div className={styles.trustPill}>
                  <BadgeCheck size={15} className={styles.trustIcon} />
                  <span>EPR Audit-Ready Feedstock</span>
                </div>
              </div>
            </div>

            {/* Right 42%: Compact Product Snapshot (Preview, not full terminal duplication) */}
            <div className={styles.heroVisualBlock}>
              <div className={styles.systemTerminalCard}>
                {/* Window Chrome */}
                <div className={styles.terminalChrome}>
                  <div className={styles.windowControls}>
                    <span className={styles.dotRed} />
                    <span className={styles.dotYellow} />
                    <span className={styles.dotGreen} />
                  </div>
                  <div className={styles.terminalTitle}>
                    <span>SCRAPSETU // LIVE LOT</span>
                    <span className={styles.terminalLiveTag}>● VERIFIED</span>
                  </div>
                  <div className={styles.terminalLotId}>{activeItem.lotId}</div>
                </div>

                {/* Compact Product Snapshot Body */}
                <div className={styles.snapshotBody}>
                  {/* Material Identification Header */}
                  <div className={styles.snapshotItemHeader}>
                    <div className={styles.snapshotIconBox}>
                      <Cpu size={20} />
                    </div>
                    <div className={styles.snapshotItemMeta}>
                      <span className={styles.snapshotItemCategory}>{activeItem.category}</span>
                      <h3 className={styles.snapshotItemName}>{activeItem.name}</h3>
                    </div>
                    <div className={styles.snapshotClusterPill}>
                      <MapPin size={11} />
                      <span>Delhi NCR</span>
                    </div>
                  </div>

                  {/* 3 Key Metrics Row */}
                  <div className={styles.snapshotMetricsRow}>
                    <div className={styles.snapshotMetricCell}>
                      <span className={styles.snapshotMetricLabel}>AI Confidence</span>
                      <span className={styles.snapshotMetricValTeal}>98.4%</span>
                    </div>
                    <div className={styles.snapshotMetricCell}>
                      <span className={styles.snapshotMetricLabel}>Scale Net</span>
                      <span className={styles.snapshotMetricVal}>{activeItem.weight}</span>
                    </div>
                    <div className={styles.snapshotMetricCell}>
                      <span className={styles.snapshotMetricLabel}>Benchmark Rate</span>
                      <span className={styles.snapshotMetricVal}>{activeItem.ratePerKg}</span>
                    </div>
                  </div>

                  {/* Verification Pipeline Checklist */}
                  <div className={styles.snapshotVerificationsList}>
                    <div className={styles.snapshotVerifyItem}>
                      <CheckCircle2 size={14} className={styles.verifyIconGreen} />
                      <span className={styles.verifyItemText}>
                        Recycler matched: <strong>{activeItem.facility.split('·')[0].trim()}</strong>
                      </span>
                    </div>
                    <div className={styles.snapshotVerifyItem}>
                      <CheckCircle2 size={14} className={styles.verifyIconGreen} />
                      <span className={styles.verifyItemText}>
                        Dual-party QR manifest generated: <code className={styles.qrCodeInline}>{activeItem.qrHash.slice(0, 16)}...</code>
                      </span>
                    </div>
                  </div>

                  {/* Operational Risk Notice */}
                  <div className={styles.snapshotAlertRow}>
                    <AlertTriangle size={12} className={styles.alertIconAmber} />
                    <span className={styles.alertText}>{activeItem.safetyAlert}</span>
                  </div>
                </div>

                {/* Snapshot Footer Bar */}
                <div className={styles.snapshotFooterBar}>
                  <div className={styles.snapshotPayoutInfo}>
                    <span className={styles.snapshotPayoutLabel}>Guaranteed Gate Payout:</span>
                    <strong className={styles.snapshotPayoutTotal}>{activeItem.totalPayout}</strong>
                  </div>
                  <span className={styles.snapshotLedgerSync}>CPCB Form-6 Ready</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            3. TRUST & REGULATORY COMPLIANCE STRIP
            ================================================================== */}
        <section className={styles.trustStripSection}>
          <div className={styles.innerContainer}>
            <div className={styles.trustStripGrid}>
              <div className={styles.trustStripItem}>
                <div className={styles.trustItemIcon}>
                  <Building2 size={20} />
                </div>
                <div className={styles.trustItemText}>
                  <h4>DPCC / CPCB Registered</h4>
                  <p>Aligned with Delhi NCR licensed smelting & recycling mandates</p>
                </div>
              </div>

              <div className={styles.trustStripItem}>
                <div className={styles.trustItemIcon}>
                  <Scale size={20} />
                </div>
                <div className={styles.trustItemText}>
                  <h4>0% Middleman Markup</h4>
                  <p>Certified industrial scale weighment with direct digital payout</p>
                </div>
              </div>

              <div className={styles.trustStripItem}>
                <div className={styles.trustItemIcon}>
                  <QrCode size={20} />
                </div>
                <div className={styles.trustItemText}>
                  <h4>Dual-Party QR Handshakes</h4>
                  <p>Encrypted gate authorization preventing paper manifest fraud</p>
                </div>
              </div>

              <div className={styles.trustStripItem}>
                <div className={styles.trustItemIcon}>
                  <FileCheck2 size={20} />
                </div>
                <div className={styles.trustItemText}>
                  <h4>Audit-Ready EPR Credits</h4>
                  <p>Immutable chain of custody for Extended Producer Responsibility</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            4. PLATFORM CAPABILITIES — ASYMMETRIC EDITORIAL LAYOUT
            ================================================================== */}
        <section id="what-it-does" className={styles.capabilitiesSection}>
          <div className={styles.innerContainer}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionEyebrow}>Core Capabilities</span>
              <h2 className={styles.sectionTitle}>
                Built for the Grassroots Circular Economy
              </h2>
              <p className={styles.sectionSubtitle}>
                Replacing informal guesswork with real-time computer vision, fair price discovery,
                and regulatory chain-of-custody compliance.
              </p>
            </div>

            {/* Asymmetric 65 / 35 Split Layout */}
            <div className={styles.asymmetricGrid}>
              {/* Major Feature: AI Scrap Identification (65% width) */}
              <div className={styles.primaryFeatureCard}>
                <div className={styles.featurePillTag}>
                  <Sparkles size={14} />
                  <span>Flagship AI Vision Engine</span>
                </div>
                <h3 className={styles.featureMainTitle}>
                  Instant Alloy Classification & Hazardous Element Detection
                </h3>
                <p className={styles.featureMainDesc}>
                  Field collectors snap an image of mixed electronic scrap. Our fine-tuned multimodal
                  vision models instantly recognize PCB board grades, identify copper trace densities,
                  and detect high-risk hazards such as punctured lithium-ion cells or leaded solders
                  before processing.
                </p>

                {/* Embedded Technical Telemetry Preview */}
                <div className={styles.featureInteractivePreview}>
                  <div className={styles.telemetryHeader}>
                    <div className={styles.telemetryTag}>Vision Model Telemetry // Okhla Gate</div>
                    <div className={styles.telemetryStatus}>Active Stream</div>
                  </div>
                  <div className={styles.telemetryMetricsGrid}>
                    <div className={styles.metricCell}>
                      <span className={styles.metricCellLabel}>Identified Alloy</span>
                      <span className={styles.metricCellVal}>Telecom Gold Grade-A</span>
                    </div>
                    <div className={styles.metricCell}>
                      <span className={styles.metricCellLabel}>Trace Analysis</span>
                      <span className={styles.metricCellVal}>Au 0.82g · Cu 28.4%</span>
                    </div>
                    <div className={styles.metricCell}>
                      <span className={styles.metricCellLabel}>Contaminant Risk</span>
                      <span className={styles.metricCellValWarning}>Pb Solder (Isolated)</span>
                    </div>
                    <div className={styles.metricCell}>
                      <span className={styles.metricCellLabel}>Inspection Speed</span>
                      <span className={styles.metricCellVal}>1.2s Real-Time</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Supporting Feature 1: Transparent Benchmark Rates (35% width) */}
              <div className={styles.secondaryFeatureCard}>
                <div className={styles.featurePillTagAmber}>
                  <TrendingUp size={14} />
                  <span>Price Discovery Engine</span>
                </div>
                <h3 className={styles.secondaryFeatureTitle}>
                  Transparent Regional Rate Cards
                </h3>
                <p className={styles.secondaryFeatureDesc}>
                  Eliminate predatory broker deductions. ScrapSetu indexes live regional buying rates
                  directly from authorized recyclers in Okhla, Mayapuri, and Bawana.
                </p>

                <div className={styles.liveRateWidget}>
                  <div className={styles.rateWidgetHeader}>
                    <span>Delhi NCR Benchmark Index</span>
                    <span className={styles.liveDotText}>● Updated Daily</span>
                  </div>
                  <div className={styles.rateWidgetList}>
                    <div className={styles.rateItem}>
                      <span>Grade 1 Berry Copper</span>
                      <strong>₹715 / kg</strong>
                    </div>
                    <div className={styles.rateItem}>
                      <span>Telecom Gold Motherboard</span>
                      <strong>₹420 / kg</strong>
                    </div>
                    <div className={styles.rateItem}>
                      <span>Li-ion Mobile Feedstock</span>
                      <strong>₹340 / kg</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Supporting Feature 2: Wide Chain-of-Custody Banner */}
            <div className={styles.fullWidthFeatureBanner}>
              <div className={styles.bannerIconBlock}>
                <QrCode size={32} />
              </div>
              <div className={styles.bannerContent}>
                <div className={styles.bannerEyebrow}>EPR Compliance Infrastructure</div>
                <h3 className={styles.bannerTitle}>
                  Dual-Party Cryptographic QR Verification & Immutable Manifests
                </h3>
                <p className={styles.bannerDesc}>
                  Every lot handover is authorized at the certified scale gate via a dual-key QR handshake.
                  Both the collector and the receiving facility sign the transaction cryptographically,
                  generating an immutable digital manifest that satisfies DPCC Form-6 e-waste filing requirements.
                </p>
              </div>
              <div className={styles.bannerPills}>
                <span className={styles.bannerPill}>SHA-256 Hashed</span>
                <span className={styles.bannerPill}>Zero Manifest Tampering</span>
                <span className={styles.bannerPill}>Automated CPCB Filing</span>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            5. CONNECTED 6-STAGE END-TO-END FLOW (SIGNATURE SECTION)
            ================================================================== */}
        <section id="how-it-works" className={styles.flowSection}>
          <div className={styles.innerContainer}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionEyebrow}>System Architecture</span>
              <h2 className={styles.sectionTitle}>
                How Material Moves Through ScrapSetu
              </h2>
              <p className={styles.sectionSubtitle}>
                A closed-loop digital pipeline taking informal scrap from neighborhood collection
                to authorized pyrometallurgical processing in six verified stages.
              </p>
            </div>

            {/* Connected Journey Grid */}
            <div className={styles.journeyFlow}>
              {/* Dynamic Connecting Transit Line */}
              <div className={styles.journeyTransitLine}>
                <div
                  className={styles.journeyProgressBar}
                  style={{ width: `${((activeFlowStep - 1) / 5) * 100}%` }}
                />
              </div>

              {/* 6 Interactive Stage Cards */}
              <div className={styles.journeyStepsList} role="tablist" aria-label="End-to-End System Journey">
                {FLOW_STEPS.map((step) => {
                  const isActive = step.id === activeFlowStep;
                  const isPast = step.id < activeFlowStep;
                  const StepIcon = step.icon;
                  return (
                    <div
                      key={step.id}
                      role="tab"
                      tabIndex={0}
                      aria-selected={isActive}
                      onClick={() => setActiveFlowStep(step.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setActiveFlowStep(step.id);
                        }
                      }}
                      className={`${styles.journeyStepCard} ${isActive ? styles.journeyStepCardActive : ''} ${isPast ? styles.journeyStepCardPast : ''}`}
                    >
                      <div className={`${styles.stepNodeBadge} ${isActive ? styles.stepNodeBadgeActive : ''} ${isPast ? styles.stepNodeBadgePast : ''}`}>
                        {isPast ? <Check size={14} strokeWidth={3} /> : `0${step.id}`}
                      </div>
                      <div className={styles.stepCardHeader}>
                        <h4 className={styles.stepTitle}>{step.stage}</h4>
                        <div className={styles.stepTag}>{step.tag}</div>
                      </div>
                      <p className={styles.stepExplanation}>{step.shortDesc}</p>
                      <div className={styles.stepCardFooter}>
                        <span className={styles.stepActiveIndicator}>
                          {isActive ? '● Active Step' : 'Click to inspect'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Stage Interactive Deep-Dive Console */}
              {(() => {
                const currentStep = FLOW_STEPS.find((s) => s.id === activeFlowStep) || FLOW_STEPS[0];
                const StepIcon = currentStep.icon;
                return (
                  <div className={styles.stepDetailConsole}>
                    <div className={styles.stepDetailTopBar}>
                      <div className={styles.stepDetailBadge}>
                        <StepIcon size={16} />
                        <span>STAGE 0{currentStep.id} // {currentStep.stage.toUpperCase()} ARCHITECTURE</span>
                      </div>
                      <div className={styles.stepNavButtons}>
                        <button
                          type="button"
                          className={styles.stepNavBtn}
                          disabled={activeFlowStep === 1}
                          onClick={() => setActiveFlowStep((prev) => Math.max(1, prev - 1))}
                          aria-label="Previous Stage"
                        >
                          <ChevronLeft size={14} />
                          <span>Previous</span>
                        </button>
                        <button
                          type="button"
                          className={styles.stepNavBtnPrimary}
                          disabled={activeFlowStep === 6}
                          onClick={() => setActiveFlowStep((prev) => Math.min(6, prev + 1))}
                          aria-label="Next Stage"
                        >
                          <span>Next Stage</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>

                    <div className={styles.stepDetailContentGrid}>
                      <div className={styles.stepDetailMain}>
                        <h3 className={styles.stepDetailTitle}>{currentStep.title}</h3>
                        <p className={styles.stepDetailDesc}>{currentStep.shortDesc}</p>
                        <div className={styles.stepTelemetryBox}>
                          <span className={styles.telemetryPrompt}>telemetry_stream $</span>
                          <span className={styles.telemetryText}>{currentStep.telemetry}</span>
                        </div>
                      </div>
                      <div className={styles.stepDetailSide}>
                        <div className={styles.complianceCard}>
                          <span className={styles.complianceLabel}>Statutory Standard</span>
                          <span className={styles.complianceVal}>{currentStep.complianceDoc}</span>
                        </div>
                        <div className={styles.complianceCard}>
                          <span className={styles.complianceLabel}>Gateway Output</span>
                          <span className={styles.actionOutputVal}>{currentStep.actionOutput}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </section>

        {/* ==================================================================
            6. REAL-WORLD ECOSYSTEM IMPACT — PHYSICAL INFRASTRUCTURE & STAKEHOLDERS
            ================================================================== */}
        <section id="why-it-matters" className={styles.impactSection}>
          <div className={styles.innerContainer}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionEyebrow}>Ecosystem Impact</span>
              <h2 className={styles.sectionTitle}>
                Real-World Infrastructure Meets Digital Traceability
              </h2>
              <p className={styles.sectionSubtitle}>
                Bridging the gap between informal aggregators and state-of-the-art pyrometallurgical
                smelters with direct market incentives and environmental accountability.
              </p>
            </div>

            {/* Real-World Visual Hero: Authentic Recycling Sorting Facility */}
            <div className={styles.facilityVisualHero}>
              <div className={styles.facilityImageContainer}>
                {/* Authentic sorting table photograph */}
                <img
                  src="/images/facility_sorting.jpg"
                  alt="Industrial electronic scrap sorting table with copper wire coils and circuit boards at a licensed recycling facility"
                  className={styles.facilityImage}
                />
                <div className={styles.facilityImageOverlay} />

                {/* Industrial Inspection Telemetry Overlay */}
                <div className={styles.facilityFloatingBadge}>
                  <div className={styles.badgeHeader}>
                    <div className={styles.badgePulseDot} />
                    <span className={styles.badgeHubName}>DPCC LICENSED SMELTING & REFINING HUB // OKHLA PHASE-III</span>
                  </div>
                  <div className={styles.badgeTitle}>
                    High-Grade Non-Ferrous & PCB Feedstock Sorting Table
                  </div>
                  <div className={styles.badgeTags}>
                    <span className={styles.badgeTag}>0% Open Burning</span>
                    <span className={styles.badgeTag}>100% Traceable Ingestion</span>
                    <span className={styles.badgeTag}>Direct Scale Settlement</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Connected Stakeholder Pillars */}
            <div className={styles.stakeholderGrid}>
              {/* Stakeholder 1: Collectors */}
              <div className={`${styles.stakeholderCard} ${styles.collectorCard}`}>
                <div className={styles.stakeholderCategory}>The Informal Collector</div>
                <h3 className={styles.stakeholderHeadline}>
                  Economic Dignity & Fair Margins
                </h3>
                <blockquote className={styles.stakeholderQuote}>
                  &ldquo;Direct market access eliminates exploitative middleman cuts, ensuring same-day digital settlements at certified scale weights.&rdquo;
                </blockquote>
                <div className={styles.impactMetricsBlock}>
                  <div className={styles.metricPair}>
                    <span className={styles.bigStat}>+28%</span>
                    <span className={styles.statLabel}>Average Realized Margin</span>
                  </div>
                  <div className={styles.metricPair}>
                    <span className={styles.bigStat}>100%</span>
                    <span className={styles.statLabel}>Direct Bank / UPI Gate Payout</span>
                  </div>
                </div>
              </div>

              {/* Stakeholder 2: Authorized Recyclers */}
              <div className={`${styles.stakeholderCard} ${styles.recyclerCard}`}>
                <div className={styles.stakeholderCategory}>The Authorized Recycler</div>
                <h3 className={styles.stakeholderHeadline}>
                  Verified Sourcing & EPR Audit Readiness
                </h3>
                <blockquote className={styles.stakeholderQuote}>
                  &ldquo;Continuous, traceable feedstock supply with tamper-evident digital manifests prepared for DPCC and CPCB audit scrutiny.&rdquo;
                </blockquote>
                <div className={styles.impactMetricsBlock}>
                  <div className={styles.metricPair}>
                    <span className={styles.bigStat}>100%</span>
                    <span className={styles.statLabel}>Verified Origin Feedstock</span>
                  </div>
                  <div className={styles.metricPair}>
                    <span className={styles.bigStat}>0 sec</span>
                    <span className={styles.statLabel}>Manual EPR Audit Preparation</span>
                  </div>
                </div>
              </div>

              {/* Stakeholder 3: Cities & Environment */}
              <div className={`${styles.stakeholderCard} ${styles.cityCard}`}>
                <div className={styles.stakeholderCategory}>Cities & Environment</div>
                <h3 className={styles.stakeholderHeadline}>
                  Toxic Waste Diversion from Landfills
                </h3>
                <blockquote className={styles.stakeholderQuote}>
                  &ldquo;Halting dangerous open burning and unscientific acid baths in urban neighborhoods by directing scrap to modern pyrometallurgical furnaces.&rdquo;
                </blockquote>
                <div className={styles.impactMetricsBlock}>
                  <div className={styles.metricPair}>
                    <span className={styles.bigStat}>0%</span>
                    <span className={styles.statLabel}>Acid Bath Leaching Risk</span>
                  </div>
                  <div className={styles.metricPair}>
                    <span className={styles.bigStat}>100%</span>
                    <span className={styles.statLabel}>Scientific Refining</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            7. INTERACTIVE PRODUCT CONSOLE — THE PRIMARY VISUAL ANCHOR
            ================================================================== */}
        <section id="console" className={styles.consoleSection}>
          <div className={styles.innerContainer}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionEyebrow}>Live Verification Terminal</span>
              <h2 className={styles.sectionTitle}>
                Inspect Real-World Scrap Lots in Action
              </h2>
              <p className={styles.sectionSubtitle}>
                Select an aggregated e-waste lot to experience how ScrapSetu decomposes alloys,
                calculates benchmark pricing, and generates DPCC-ready manifests.
              </p>
            </div>

            <div className={styles.consoleContainer}>
              {/* Material Chip Switcher */}
              <div className={styles.materialChipBar} role="tablist" aria-label="Select Material Lot">
                {SCRAP_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isSelected = item.id === selectedMaterialId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      className={`${styles.materialChipBtn} ${isSelected ? styles.materialChipActive : ''}`}
                      onClick={() => setSelectedMaterialId(item.id)}
                    >
                      <Icon size={15} />
                      <span>{item.name}</span>
                      <span className={styles.chipWeightBadge}>{item.weight}</span>
                    </button>
                  );
                })}
              </div>

              {/* Console Main Display */}
              <div className={styles.consoleDisplayCard}>
                {/* Console Nav Tabs */}
                <div className={styles.consoleTabsHeader}>
                  <button
                    type="button"
                    className={`${styles.consoleTabBtn} ${consoleTab === 'ai' ? styles.consoleTabActive : ''}`}
                    onClick={() => setConsoleTab('ai')}
                  >
                    <Sparkles size={14} />
                    <span>AI Vision Decomposition</span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.consoleTabBtn} ${consoleTab === 'pricing' ? styles.consoleTabActive : ''}`}
                    onClick={() => setConsoleTab('pricing')}
                  >
                    <TrendingUp size={14} />
                    <span>Live Valuation</span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.consoleTabBtn} ${consoleTab === 'facility' ? styles.consoleTabActive : ''}`}
                    onClick={() => setConsoleTab('facility')}
                  >
                    <Building2 size={14} />
                    <span>Matched Smelter</span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.consoleTabBtn} ${consoleTab === 'qr' ? styles.consoleTabActive : ''}`}
                    onClick={() => setConsoleTab('qr')}
                  >
                    <QrCode size={14} />
                    <span>Gate QR Manifest</span>
                  </button>
                </div>

                {/* Console Dynamic Screen */}
                <div className={styles.consoleScreenContent}>
                  {consoleTab === 'ai' && (
                    <div className={styles.screenGrid}>
                      <div className={styles.screenMainCol}>
                        <div className={styles.screenLabel}>Vision Classification</div>
                        <div className={styles.screenHeading}>{activeItem.aiClass}</div>
                        <div className={styles.screenSubtext}>
                          Spectrometry traces: <strong>{activeItem.preciousMetals}</strong>
                        </div>
                        <div className={styles.alertBanner}>
                          <AlertTriangle size={15} />
                          <span>{activeItem.safetyAlert}</span>
                        </div>
                        <div className={styles.terminalActionRow}>
                          <button
                            type="button"
                            className={styles.terminalAdvanceBtn}
                            onClick={() => setConsoleTab('pricing')}
                          >
                            <span>Proceed to Live Valuation Stage</span>
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                      <div className={styles.screenSideCol}>
                        <div className={styles.sideDataCard}>
                          <span className={styles.sideDataLabel}>Confidence Level</span>
                          <span className={styles.sideDataValueGreen}>98.4% Exact Match</span>
                        </div>
                        <div className={styles.sideDataCard}>
                          <span className={styles.sideDataLabel}>Carbon Abatement</span>
                          <span className={styles.sideDataValue}>{activeItem.co2Saved}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {consoleTab === 'pricing' && (
                    <div className={styles.screenGrid}>
                      <div className={styles.screenMainCol}>
                        <div className={styles.screenLabel}>Transparent Price Discovery</div>
                        <div className={styles.pricingFormulaRow}>
                          <div className={styles.formulaCol}>
                            <span className={styles.formulaLabel}>Gross Scale Weight</span>
                            <div className={styles.formulaVal}>{activeItem.weight}</div>
                          </div>
                          <div className={styles.formulaOp}>×</div>
                          <div className={styles.formulaCol}>
                            <span className={styles.formulaLabel}>DPCC Benchmark Rate</span>
                            <div className={styles.formulaVal}>{activeItem.ratePerKg}</div>
                          </div>
                          <div className={styles.formulaOp}>=</div>
                          <div className={styles.formulaCol}>
                            <span className={styles.formulaLabel}>Direct Gate Payout</span>
                            <div className={styles.formulaTotal}>{activeItem.totalPayout}</div>
                          </div>
                        </div>
                        <p className={styles.pricingNote}>
                          Settlement occurs immediately upon certified gate scale weighment via direct UPI or NEFT. Zero middleman cuts.
                        </p>
                        <div className={styles.terminalActionRow}>
                          <button
                            type="button"
                            className={styles.terminalAdvanceBtn}
                            onClick={() => setConsoleTab('facility')}
                          >
                            <span>Proceed to Matched Smelter Stage</span>
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                      <div className={styles.screenSideCol}>
                        <div className={styles.sideDataCard}>
                          <span className={styles.sideDataLabel}>Payment Method</span>
                          <span className={styles.sideDataValue}>Direct Bank / UPI</span>
                        </div>
                        <div className={styles.sideDataCard}>
                          <span className={styles.sideDataLabel}>Intermediary Deduction</span>
                          <span className={styles.sideDataValueGreen}>₹0.00 (Zero Cut)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {consoleTab === 'facility' && (
                    <div className={styles.screenGrid}>
                      <div className={styles.screenMainCol}>
                        <div className={styles.screenLabel}>Licensed Pyrometallurgical Facility</div>
                        <div className={styles.screenHeading}>{activeItem.facility}</div>
                        <div className={styles.screenSubtext}>
                          Transit distance: <strong>{activeItem.distance}</strong> · Aggregated in <strong>{activeItem.cluster}</strong>
                        </div>
                        <div className={styles.facilityCompliancePill}>
                          ✓ DPCC Consent to Operate (CTO) Valid through 2027 · CPCB EPR Certified Smelter
                        </div>
                        <div className={styles.terminalActionRow}>
                          <button
                            type="button"
                            className={styles.terminalAdvanceBtn}
                            onClick={() => setConsoleTab('qr')}
                          >
                            <span>Proceed to Gate QR Manifest</span>
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                      <div className={styles.screenSideCol}>
                        <div className={styles.sideDataCard}>
                          <span className={styles.sideDataLabel}>Dispatch Distance</span>
                          <span className={styles.sideDataValue}>{activeItem.distance}</span>
                        </div>
                        <div className={styles.sideDataCard}>
                          <span className={styles.sideDataLabel}>Capacity Utilization</span>
                          <span className={styles.sideDataValue}>4.8 Tonnes / Day</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {consoleTab === 'qr' && (
                    <div className={styles.screenGrid}>
                      <div className={styles.screenMainCol}>
                        <div className={styles.screenLabel}>Gate Authorization Manifest</div>
                        <div className={styles.qrManifestLargeRow}>
                          <div className={styles.qrLargeBox}>
                            <QrCode size={52} />
                          </div>
                          <div className={styles.qrManifestText}>
                            <div className={styles.hashText}>{activeItem.qrHash}</div>
                            <div className={styles.hashDesc}>
                              Mutual SHA-256 handshake between Collector #{activeItem.lotId.slice(-4)} and Certified Gate Inspector.
                            </div>
                            <div className={styles.hashVerified}>
                              <CheckCircle2 size={14} />
                              <span>Immutable manifest filed to DPCC E-Waste Portal</span>
                            </div>
                          </div>
                        </div>
                        <div className={styles.terminalActionRow}>
                          <Link href="/auth" className={styles.terminalAdvanceBtnPrimary}>
                            <span>Create Live Verification Lot</span>
                            <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                      <div className={styles.screenSideCol}>
                        <div className={styles.sideDataCard}>
                          <span className={styles.sideDataLabel}>Manifest Status</span>
                          <span className={styles.sideDataValueGreen}>Ready for Scale</span>
                        </div>
                        <div className={styles.sideDataCard}>
                          <span className={styles.sideDataLabel}>Audit Readiness</span>
                          <span className={styles.sideDataValue}>Form-6 Compliant</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Console Bottom Action */}
                <div className={styles.consoleFooterBar}>
                  <div className={styles.consoleFooterInfo}>
                    Viewing sample lot: <strong>{activeItem.name}</strong> ({activeItem.lotId})
                  </div>
                  <div className={styles.consoleFooterActions}>
                    <Link href="/auth" className={styles.consoleStartBtn}>
                      <span>Start Your Live Lot</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            8. CONCLUDING HIGH-CONTRAST ACTION BLOCK
            ================================================================== */}
        <section className={styles.ctaSection}>
          <div className={styles.innerContainer}>
            <div className={styles.ctaCard}>
              <div className={styles.ctaEyebrow}>Digital Circular Economy</div>
              <h2 className={styles.ctaHeading}>
                Ready to Modernize Scrap Collection in Delhi NCR?
              </h2>
              <p className={styles.ctaSubheading}>
                Whether you are a licensed recycling facility seeking verified feedstock or a grassroots
                collector looking for transparent market prices, ScrapSetu connects you directly.
              </p>
              <div className={styles.ctaActionGroup}>
                {existingUser ? (
                  <Link href={workspaceUrl} className={styles.ctaPrimaryBtn}>
                    <UserCheck size={18} />
                    <span>Enter {existingUser.role === 'collector' ? 'Collector' : 'Recycler'} Workspace</span>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth" className={styles.ctaPrimaryBtn}>
                      <span>Join ScrapSetu Network</span>
                      <ArrowRight size={16} />
                    </Link>
                    <Link href="/auth" className={styles.ctaSecondaryBtn}>
                      <span>Sign In to Portal</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            9. ARCHITECTURAL EDITORIAL FOOTER
            ================================================================== */}
        <footer className={styles.footer}>
          <div className={styles.innerContainer}>
            <div className={styles.footerMainGrid}>
              <div className={styles.footerBrandBlock}>
                <div className={styles.footerLogo}>
                  ScrapSetu<span className={styles.brandDot}>.</span>
                </div>
                <p className={styles.footerStatement}>
                  Digital infrastructure connecting India’s informal scrap collectors with DPCC and CPCB
                  authorized recyclers through computer vision, fair price discovery, and digital QR custody.
                </p>
                <div className={styles.footerStatusBadge}>
                  <span className={styles.livePulseDot} />
                  <span>Delhi NCR Pilot Operation</span>
                </div>
              </div>

              <div className={styles.footerNavCol}>
                <div className={styles.footerColHeading}>Platform</div>
                <a href="#what-it-does">Capabilities</a>
                <a href="#how-it-works">End-to-End Flow</a>
                <a href="#console">Live Terminal</a>
                <Link href="/auth">Role Onboarding</Link>
              </div>

              <div className={styles.footerNavCol}>
                <div className={styles.footerColHeading}>Compliance</div>
                <a href="#why-it-matters">DPCC Alignment</a>
                <a href="#why-it-matters">E-Waste Rules 2022</a>
                <a href="#why-it-matters">EPR Traceability</a>
                <a href="#why-it-matters">Form-6 Manifests</a>
              </div>

              <div className={styles.footerNavCol}>
                <div className={styles.footerColHeading}>Portals</div>
                <Link href="/collector">Collector Portal</Link>
                <Link href="/recycler">Recycler Portal</Link>
                <Link href="/admin">Admin Governance</Link>
                <Link href="/auth">Sign In</Link>
              </div>
            </div>

            <div className={styles.footerBottomBar}>
              <div className={styles.legalNotice}>
                © 2026 ScrapSetu · Kabadiwala Connect Digital Infrastructure. All rights reserved.
              </div>
              <div className={styles.regulatoryAttribution}>
                Compliant with DPCC / CPCB Guidelines for Environmentally Sound E-Waste Management.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </SmoothScroll>
  );
}
