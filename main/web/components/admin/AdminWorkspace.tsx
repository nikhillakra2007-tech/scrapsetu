"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AppShell from "@/components/shell/AppShell";
import {
  ShieldAlert,
  ArrowLeft,
  Building2,
  Users,
  PackageCheck,
  Scale,
  CheckCircle2,
  Clock,
  FileCheck2,
  Download,
  AlertCircle,
  Eye,
  Check,
  ShieldCheck,
} from "lucide-react";
import styles from "./AdminWorkspace.module.css";

interface AuthorizedFacility {
  id: string;
  name: string;
  region: string;
  dpccRegId: string;
  category: string;
  status: "verified" | "pending";
  lastInspection: string;
}

const INITIAL_FACILITIES: AuthorizedFacility[] = [
  {
    id: "fac-1",
    name: "EcoRecycle Hub",
    region: "Okhla Phase III, South Delhi",
    dpccRegId: "DPCC/EW/2024/0981",
    category: "High-Grade Telecom & Circuit Boards",
    status: "verified",
    lastInspection: "12 Aug 2026",
  },
  {
    id: "fac-2",
    name: "GreenE-Waste Technologies",
    region: "Mayapuri Industrial Area, West Delhi",
    dpccRegId: "DPCC/EW/2023/0442",
    category: "Li-ion Batteries & Portable Electronics",
    status: "verified",
    lastInspection: "24 Jul 2026",
  },
  {
    id: "fac-3",
    name: "Apex Non-Ferrous Smelters",
    region: "Bawana Industrial Zone, North Delhi",
    dpccRegId: "DPCC/NF/2024/1105",
    category: "Electrolytic Copper & Cable Scrap",
    status: "verified",
    lastInspection: "18 Aug 2026",
  },
  {
    id: "fac-4",
    name: "Capital EPR Aggregators",
    region: "Narela Industrial Cluster, North Delhi",
    dpccRegId: "DPCC/EW/2024/1390",
    category: "Enterprise Servers & Metal Casings",
    status: "pending",
    lastInspection: "Pending Inspection",
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
    lotId: "LOT-DEL-089",
    collectorName: "Ramesh Kumar",
    facilityName: "EcoRecycle Hub",
    material: "Telecom Circuit Boards",
    weight: "45.0 kg",
    qrHash: "SETU-DEL-8942-OKHLA",
    timestamp: "04 Sep, 11:20 AM",
    compliance: "EPR Form 2 Logged",
  },
  {
    lotId: "LOT-DEL-088",
    collectorName: "Mohd. Salim",
    facilityName: "GreenE-Waste Technologies",
    material: "Mixed Smartphones & Lithium Cells",
    weight: "28.5 kg",
    qrHash: "SETU-DEL-4102-MAYA",
    timestamp: "04 Sep, 09:45 AM",
    compliance: "EPR Form 2 Logged",
  },
  {
    lotId: "LOT-DEL-087",
    collectorName: "Sunil Paswan",
    facilityName: "Apex Non-Ferrous Smelters",
    material: "Grade 1 Stripped Copper",
    weight: "62.0 kg",
    qrHash: "SETU-DEL-7731-BAW",
    timestamp: "03 Sep, 04:15 PM",
    compliance: "EPR Form 2 Logged",
  },
];

export default function AdminWorkspace() {
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    role: string;
    email?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("facilities");
  const [facilities, setFacilities] =
    useState<AuthorizedFacility[]>(INITIAL_FACILITIES);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored =
        typeof window !== "undefined"
          ? localStorage.getItem("scrapsetu_auth_user")
          : null;

      if (!stored) {
        window.location.href = "/auth";
        return;
      }

      const user = JSON.parse(stored);
      setCurrentUser(user);
    } catch (e) {
      window.location.href = "/auth";
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSignOut = () => {
    try {
      localStorage.removeItem("scrapsetu_auth_user");
    } catch (e) {}
    window.location.href = "/";
  };

  const handleApproveFacility = (id: string, name: string) => {
    setFacilities((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              status: "verified",
              lastInspection: "05 Sep 2026 (Verified)",
            }
          : f,
      ),
    );
    setActionNotice(
      `Facility "${name}" has been approved and issued DPCC verified operational status.`,
    );
    setTimeout(() => setActionNotice(null), 4000);
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--bg-app, #F6F8F5)",
          fontFamily: "var(--font-sans, sans-serif)",
          color: "var(--text-primary, #0B1220)",
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            border: "3px solid var(--border-subtle, #DCE5E0)",
            borderTopColor: "var(--brand-primary, #087F5B)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            marginBottom: "1rem",
          }}
        />
        <span
          style={{
            fontSize: "0.9rem",
            color: "var(--text-secondary, #52606D)",
            fontWeight: 600,
          }}
        >
          Verifying administrative credentials...
        </span>
      </div>
    );
  }

  // Strict Role Boundary: If not admin, provide clean restricted banner with navigation back
  if (currentUser?.role !== "admin") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--bg-app, #F6F8F5)",
          padding: "2rem",
          fontFamily: "var(--font-sans, sans-serif)",
        }}
      >
        <div
          style={{
            maxWidth: 480,
            backgroundColor: "#FFFFFF",
            borderRadius: 20,
            border: "1px solid var(--border-subtle, #DCE5E0)",
            padding: "2.5rem",
            textAlign: "center",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              backgroundColor: "var(--danger-bg, #FEF2F2)",
              color: "var(--danger-text, #991B1B)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
            }}
          >
            <ShieldAlert size={28} />
          </div>

          <h1
            style={{
              fontSize: "1.4rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: "0.75rem",
            }}
          >
            Access Restricted
          </h1>

          <p
            style={{
              fontSize: "0.925rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              marginBottom: "2rem",
            }}
          >
            Your account is authenticated as{" "}
            <strong>
              {currentUser?.role === "collector"
                ? "Field Collector"
                : "Recycler Partner"}
            </strong>
            . The Administrative Oversight Console is restricted to DPCC/CPCB
            platform regulators.
          </p>

          <Link
            href={
              currentUser?.role === "collector" ? "/collector" : "/recycler"
            }
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              backgroundColor: "var(--brand-primary, #087F5B)",
              color: "#FFFFFF",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={16} />
            <span>Return to Your Workspace</span>
          </Link>
        </div>
      </div>
    );
  }

  const pendingCount = facilities.filter((f) => f.status === "pending").length;

  return (
    <AppShell
      role="admin"
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      currentUser={
        currentUser
          ? { name: currentUser.name, email: currentUser.email, role: "admin" }
          : null
      }
      onSignOut={handleSignOut}
    >
      <div className={styles.adminContainer}>
        {/* Regulatory Operational Header */}
        <div className={styles.adminHeader}>
          <div className={styles.adminHeaderLeft}>
            <div className={styles.titleRow}>
              <h1 className={styles.adminTitle}>Network Operations</h1>
              <span className={styles.regulatorBadge}>
                <CheckCircle2 size={13} />
                <span>DPCC / CPCB Console</span>
              </span>
            </div>
            <p className={styles.adminSubtitle}>
              Regulatory governance, authorized facility registry, and
              cryptographic chain of custody for Delhi NCR circular economy.
            </p>
          </div>

          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.complianceReportBtn}
              onClick={() => {
                setActionNotice(
                  "EPR Compliance Audit Report exported successfully (PDF/CSV).",
                );
                setTimeout(() => setActionNotice(null), 4000);
              }}
            >
              <Download size={15} />
              <span>Export EPR Report</span>
            </button>
          </div>
        </div>

        {/* Action Notice Alert */}
        {actionNotice && (
          <div
            style={{
              padding: "0.85rem 1.25rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--brand-tint)",
              border: "1px solid var(--brand-soft)",
              color: "var(--brand-primary)",
              fontSize: "0.875rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <CheckCircle2 size={18} />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* 4 Key Metrics */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Authorized Facilities</span>
              <div className={styles.statIconWrap}>
                <Building2 size={16} />
              </div>
            </div>
            <div className={styles.statValue}>12</div>
            <span className={styles.statSubtext}>
              ✓ 11 Verified · 1 In Review
            </span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Active Collectors</span>
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
            <span className={styles.statSubtext}>
              100% Cryptographically Traced
            </span>
          </div>
        </div>

        {/* Tab 1: Authorized Facilities Registry */}
        {activeTab === "facilities" && (
          <div className={styles.tableCard}>
            <div className={styles.tableHeaderBar}>
              <h2 className={styles.tableCardTitle}>
                DPCC Registered Recycling Units
              </h2>
              <span className={styles.tableCardCount}>
                {facilities.length} Facilities Listed
              </span>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Facility Name</th>
                    <th>Region</th>
                    <th>DPCC Reg ID</th>
                    <th>Authorized Category</th>
                    <th>Status</th>
                    <th>Last Audited</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {facilities.map((fac) => (
                    <tr key={fac.id}>
                      <td className={styles.primaryCell}>{fac.name}</td>
                      <td>{fac.region}</td>
                      <td>
                        <span className={styles.monoCode}>{fac.dpccRegId}</span>
                      </td>
                      <td>{fac.category}</td>
                      <td>
                        {fac.status === "verified" ? (
                          <span className={styles.statusVerified}>
                            <CheckCircle2 size={12} />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className={styles.statusPending}>
                            <Clock size={12} />
                            <span>Audit Pending</span>
                          </span>
                        )}
                      </td>
                      <td>{fac.lastInspection}</td>
                      <td>
                        {fac.status === "pending" ? (
                          <button
                            type="button"
                            className={styles.approveBtn}
                            onClick={() =>
                              handleApproveFacility(fac.id, fac.name)
                            }
                          >
                            <Check size={13} />
                            <span>Approve</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            className={styles.inspectBtn}
                            onClick={() => {
                              setActionNotice(
                                `Audit logs for ${fac.name} loaded.`,
                              );
                              setTimeout(() => setActionNotice(null), 3000);
                            }}
                          >
                            <Eye size={13} />
                            <span>View KYC</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Audit Manifests */}
        {activeTab === "manifests" && (
          <div className={styles.tableCard}>
            <div className={styles.tableHeaderBar}>
              <h2 className={styles.tableCardTitle}>
                Immutable Chain of Custody Manifests
              </h2>
              <span className={styles.tableCardCount}>
                SHA-256 Telemetry Logged
              </span>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Lot Identifier</th>
                    <th>Collector (Source)</th>
                    <th>Facility (Dest)</th>
                    <th>Material</th>
                    <th>Net Weight</th>
                    <th>Cryptographic Hash</th>
                    <th>Timestamp</th>
                    <th>Regulatory State</th>
                  </tr>
                </thead>
                <tbody>
                  {AUDIT_MANIFESTS.map((manifest) => (
                    <tr key={manifest.lotId}>
                      <td className={styles.primaryCell}>{manifest.lotId}</td>
                      <td>{manifest.collectorName}</td>
                      <td>{manifest.facilityName}</td>
                      <td>{manifest.material}</td>
                      <td>
                        <span
                          style={{
                            fontWeight: 700,
                            color: "var(--text-primary)",
                          }}
                        >
                          {manifest.weight}
                        </span>
                      </td>
                      <td>
                        <span className={styles.monoCode}>
                          {manifest.qrHash}
                        </span>
                      </td>
                      <td>{manifest.timestamp}</td>
                      <td>
                        <span className={styles.statusVerified}>
                          <CheckCircle2 size={12} />
                          <span>{manifest.compliance}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Verification Queue */}
        {activeTab === "verification" && (
          <div className={styles.tableCard}>
            <div className={styles.tableHeaderBar}>
              <h2 className={styles.tableCardTitle}>
                Pending Facility Verification Queue
              </h2>
              <span className={styles.tableCardCount}>
                {pendingCount} Units Pending
              </span>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Facility</th>
                    <th>Jurisdiction</th>
                    <th>DPCC Application ID</th>
                    <th>Intake Categories</th>
                    <th>Review Priority</th>
                    <th>Operational Action</th>
                  </tr>
                </thead>
                <tbody>
                  {facilities
                    .filter((f) => f.status === "pending")
                    .map((fac) => (
                      <tr key={fac.id}>
                        <td className={styles.primaryCell}>{fac.name}</td>
                        <td>{fac.region}</td>
                        <td>
                          <span className={styles.monoCode}>
                            {fac.dpccRegId}
                          </span>
                        </td>
                        <td>{fac.category}</td>
                        <td>
                          <span className={styles.statusPending}>
                            <AlertCircle size={12} />
                            <span>HIGH PRIORITY</span>
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className={styles.approveBtn}
                            onClick={() =>
                              handleApproveFacility(fac.id, fac.name)
                            }
                          >
                            <Check size={13} />
                            <span>Issue DPCC License</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  {facilities.filter((f) => f.status === "pending").length ===
                    0 && (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          textAlign: "center",
                          padding: "3rem 1rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        <CheckCircle2
                          size={28}
                          color="var(--brand-primary)"
                          style={{ margin: "0 auto 0.5rem", display: "block" }}
                        />
                        <span style={{ fontWeight: 600 }}>
                          All facility verification queues are cleared and
                          compliant!
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
