'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ArrowLeft,
  Recycle,
  Building2,
  Users,
  PackageCheck,
  Scale,
  CheckCircle2,
  Clock,
  LogOut,
  Home,
  ShieldCheck,
  ExternalLink,
  QrCode,
  FileCheck2,
} from 'lucide-react';
import styles from './AdminWorkspace.module.css';

// Mock Administrative Registry Data
interface AuthorizedFacility {
  id: string;
  name: string;
  region: string;
  dpccRegId: string;
  category: string;
  status: 'verified' | 'pending';
  lastInspection: string;
}

const FACILITIES_REGISTRY: AuthorizedFacility[] = [
  {
    id: 'fac-1',
    name: 'EcoRecycle Hub',
    region: 'Okhla Phase III, South Delhi',
    dpccRegId: 'DPCC/EW/2024/0981',
    category: 'High-Grade Telecom & Circuit Boards',
    status: 'verified',
    lastInspection: '12 Aug 2026',
  },
  {
    id: 'fac-2',
    name: 'GreenE-Waste Technologies',
    region: 'Mayapuri Industrial Area, West Delhi',
    dpccRegId: 'DPCC/EW/2023/0442',
    category: 'Li-ion Batteries & Portable Electronics',
    status: 'verified',
    lastInspection: '24 Jul 2026',
  },
  {
    id: 'fac-3',
    name: 'Apex Non-Ferrous Smelters',
    region: 'Bawana Industrial Zone, North Delhi',
    dpccRegId: 'DPCC/NF/2024/1105',
    category: 'Electrolytic Copper & Cable Scrap',
    status: 'verified',
    lastInspection: '18 Aug 2026',
  },
  {
    id: 'fac-4',
    name: 'Capital EPR Aggregators',
    region: 'Narela Industrial Cluster, North Delhi',
    dpccRegId: 'DPCC/EW/2024/1390',
    category: 'Enterprise Servers & Metal Casings',
    status: 'pending',
    lastInspection: 'Pending Inspection',
  },
];

interface AuditManifest {
  lotId: string;
  collectorName: string;
  facilityName: string;
  material: string;
  weight: string;
  qrHash: string;
  timestamp: string;
  compliance: string;
}

const AUDIT_MANIFESTS: AuditManifest[] = [
  {
    lotId: 'LOT-DEL-089',
    collectorName: 'Ramesh Kumar',
    facilityName: 'EcoRecycle Hub',
    material: 'Telecom Circuit Boards',
    weight: '45.0 kg',
    qrHash: 'SETU-DEL-8942-OKHLA',
    timestamp: '04 Sep, 11:20 AM',
    compliance: 'EPR Form 2 Logged',
  },
  {
    lotId: 'LOT-DEL-088',
    collectorName: 'Mohd. Salim',
    facilityName: 'GreenE-Waste Technologies',
    material: 'Mixed Smartphones & Lithium Cells',
    weight: '28.5 kg',
    qrHash: 'SETU-DEL-4102-MAYA',
    timestamp: '04 Sep, 09:45 AM',
    compliance: 'EPR Form 2 Logged',
  },
  {
    lotId: 'LOT-DEL-087',
    collectorName: 'Sunil Paswan',
    facilityName: 'Apex Non-Ferrous Smelters',
    material: 'Grade 1 Stripped Copper',
    weight: '62.0 kg',
    qrHash: 'SETU-DEL-7731-BAW',
    timestamp: '03 Sep, 04:15 PM',
    compliance: 'EPR Form 2 Logged',
  },
];

export default function AdminWorkspace() {
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    role: string;
    email?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'facilities' | 'manifests'>('facilities');

  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined'
        ? localStorage.getItem('scrapsetu_auth_user')
        : null;

      if (!stored) {
        window.location.href = '/auth';
        return;
      }

      const user = JSON.parse(stored);
      setCurrentUser(user);
    } catch (e) {
      window.location.href = '/auth';
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSignOut = () => {
    try {
      localStorage.removeItem('scrapsetu_auth_user');
    } catch (e) {}
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAF8EE',
          fontFamily: "'Outfit', sans-serif",
          color: '#020F12',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            border: '3px solid #E2DDD0',
            borderTopColor: '#005F52',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            marginBottom: '1rem',
          }}
        />
        <span style={{ fontSize: '0.9rem', color: '#3D5A47', fontWeight: 600 }}>
          Verifying administrative credentials...
        </span>
      </div>
    );
  }

  // Strict Role Boundary: If not admin, show restricted screen
  if (currentUser?.role !== 'admin') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAF8EE',
          padding: '2rem',
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 480,
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            border: '1px solid #E2DDD0',
            padding: '2.5rem',
            textAlign: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              backgroundColor: '#FDF1F1',
              color: '#A62424',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <ShieldAlert size={28} />
          </div>

          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#020F12', marginBottom: '0.75rem' }}>
            Access Restricted
          </h1>

          <p style={{ fontSize: '0.925rem', color: '#3D5A47', lineHeight: 1.6, marginBottom: '2rem' }}>
            Your account is authenticated as <strong>{currentUser?.role === 'collector' ? 'Field Collector' : 'Recycler Partner'}</strong>. The Administrative Oversight Console is restricted to DPCC/CPCB platform regulators.
          </p>

          <Link
            href={currentUser?.role === 'collector' ? '/collector' : '/recycler'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#005F52',
              color: '#FFFFFF',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={16} />
            <span>Return to Your Workspace</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      {/* Admin Sticky Navigation Header */}
      <header className={styles.adminHeader}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brandGroup} title="Return to Public Website">
            <div className={styles.brandLogoWrap}>
              <Recycle size={21} strokeWidth={2.4} />
            </div>
            <div className={styles.brandTextGroup}>
              <span className={styles.brandTitle}>ScrapSetu<span style={{ color: '#1CC596' }}>.</span></span>
              <span className={styles.brandSubtext}>DPCC / CPCB Platform Administration</span>
            </div>
          </Link>

          <div className={styles.headerActions}>
            <Link href="/" className={styles.publicSiteBtn} title="Return to Public Website">
              <Home size={14} />
              <span>Public Site</span>
            </Link>

            <div className={styles.adminBadge}>
              <ShieldCheck size={14} />
              <span>Regulator Console</span>
            </div>

            {currentUser && (
              <div className={styles.userPill} title={`Signed in as ${currentUser.name}`}>
                <div className={styles.userAvatar}>
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className={styles.userName}>{currentUser.name.split(' ')[0]}</span>
              </div>
            )}

            <button
              type="button"
              className={styles.logoutBtn}
              onClick={handleSignOut}
              title="Sign out of ScrapSetu Admin"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Console Surface */}
      <main className={styles.adminMain}>
        <div className={styles.dashboardHeader}>
          <div>
            <h1 className={styles.pageTitle}>Regulatory Oversight & Compliance</h1>
            <p className={styles.pageSubtitle}>
              Monitoring authorized recycling facilities, verified informal collectors, and digital chain of custody in Delhi NCR.
            </p>
          </div>
          <div className={styles.compliancePill}>
            <CheckCircle2 size={14} />
            <span>CPCB Circular Framework v2.4 Active</span>
          </div>
        </div>

        {/* 4 Metric Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Authorized Facilities</span>
              <div className={styles.statIconWrap}>
                <Building2 size={16} />
              </div>
            </div>
            <div className={styles.statValue}>12</div>
            <span className={styles.statSubtext}>✓ 11 Verified · 1 In Review</span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Verified Collectors</span>
              <div className={styles.statIconWrap}>
                <Users size={16} />
              </div>
            </div>
            <div className={styles.statValue}>48</div>
            <span className={styles.statSubtext}>✓ Delhi NCR Registered</span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Lots In Pipeline</span>
              <div className={styles.statIconWrap}>
                <PackageCheck size={16} />
              </div>
            </div>
            <div className={styles.statValue}>14</div>
            <span className={styles.statSubtext}>Active Handover Matches</span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Material Diverted</span>
              <div className={styles.statIconWrap}>
                <Scale size={16} />
              </div>
            </div>
            <div className={styles.statValue}>1,840 kg</div>
            <span className={styles.statSubtext}>Logged & Traced Cleanly</span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className={styles.tabsRow}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'facilities' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('facilities')}
          >
            <Building2 size={16} />
            <span>Authorized Facility Units ({FACILITIES_REGISTRY.length})</span>
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'manifests' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('manifests')}
          >
            <FileCheck2 size={16} />
            <span>Digital Handover Manifests ({AUDIT_MANIFESTS.length})</span>
          </button>
        </div>

        {/* Tab 1: Authorized Facilities Registry */}
        {activeTab === 'facilities' && (
          <div className={styles.tableCard}>
            <div className={styles.tableHeaderBar}>
              <h2 className={styles.tableCardTitle}>DPCC Registered Recycling Units</h2>
              <span className={styles.tableCardCount}>Delhi NCR Jurisdiction</span>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Facility Name</th>
                    <th>Industrial Zone</th>
                    <th>DPCC Registration</th>
                    <th>Material Category Scope</th>
                    <th>Compliance</th>
                    <th>Last Audit</th>
                  </tr>
                </thead>
                <tbody>
                  {FACILITIES_REGISTRY.map((fac) => (
                    <tr key={fac.id}>
                      <td style={{ fontWeight: 700, color: '#005F52' }}>{fac.name}</td>
                      <td>{fac.region}</td>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', background: '#E8F7F3', padding: '0.2rem 0.5rem', borderRadius: 6 }}>
                          {fac.dpccRegId}
                        </span>
                      </td>
                      <td>{fac.category}</td>
                      <td>
                        {fac.status === 'verified' ? (
                          <span className={styles.badgeVerified}>
                            <CheckCircle2 size={12} /> Verified
                          </span>
                        ) : (
                          <span className={styles.badgePending}>
                            <Clock size={12} /> Pending Review
                          </span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: '#647D6D' }}>{fac.lastInspection}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Digital Handover Audit Manifests */}
        {activeTab === 'manifests' && (
          <div className={styles.tableCard}>
            <div className={styles.tableHeaderBar}>
              <h2 className={styles.tableCardTitle}>Dual-Party QR Handover Logs</h2>
              <span className={styles.tableCardCount}>Tamper-Evident Records</span>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Lot ID</th>
                    <th>Collector</th>
                    <th>Recycling Facility</th>
                    <th>Scrap Material</th>
                    <th>Scale Weight</th>
                    <th>Cryptographic QR Manifest</th>
                    <th>Audit Status</th>
                  </tr>
                </thead>
                <tbody>
                  {AUDIT_MANIFESTS.map((m) => (
                    <tr key={m.lotId}>
                      <td style={{ fontWeight: 700, color: '#005F52' }}>{m.lotId}</td>
                      <td>{m.collectorName}</td>
                      <td>{m.facilityName}</td>
                      <td>{m.material}</td>
                      <td style={{ fontWeight: 700 }}>{m.weight}</td>
                      <td>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'monospace', fontSize: '0.775rem', background: '#FAF8EE', padding: '0.2rem 0.55rem', borderRadius: 6, border: '1px solid #E2DDD0' }}>
                          <QrCode size={13} color="#005F52" />
                          <span>{m.qrHash}</span>
                        </div>
                      </td>
                      <td>
                        <span className={styles.badgeVerified}>
                          <CheckCircle2 size={12} /> {m.compliance}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
