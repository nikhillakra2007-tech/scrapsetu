"use client";
import { T, useLocale } from '@/components/language/Language';

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
 const {t:translate}=useLocale();

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
        ><T>
          Verifying administrative credentials...
        </T></span>
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
          ><T>
            Access Restricted
          </T></h1>

          <p
            style={{
              fontSize: "0.925rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              marginBottom: "2rem",
            }}
          ><T>
            Your account is authenticated as</T><T>{" "}</T>
            <strong>
              <T>{currentUser?.role === "collector"
                ? "Field Collector"
                : "Recycler Partner"}</T>
            </strong><T>
            . The Administrative Oversight Console is restricted to DPCC/CPCB
            platform regulators.
          </T></p>

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
            <span><T>Return to Your Workspace</T></span>
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
              <h1 className={styles.adminTitle}><T>Network Operations</T></h1>
              <span className={styles.regulatorBadge}>
                <CheckCircle2 size={13} />
                <span><T>DPCC / CPCB Console</T></span>
              </span>
            </div>
            <p className={styles.adminSubtitle}><T>
              Regulatory governance, authorized facility registry, and
              cryptographic chain of custody for Delhi NCR circular economy.
            </T></p>
          </div>

          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.complianceReportBtn}
              onClick={() => {
                const rows = [
                  ["Lot Identifier", "Collector (Source)", "Facility (Dest)", "Material", "Net Weight", "Cryptographic Hash", "Timestamp", "Regulatory State", "Data Source"],
                  ...AUDIT_MANIFESTS.map((manifest) => [
                    manifest.lotId,
                    manifest.collectorName,
                    manifest.facilityName,
                    manifest.material,
                    manifest.weight,
                    manifest.qrHash,
                    manifest.timestamp,
                    manifest.compliance,
                    "Demo data",
                  ]),
                ];
                const csv = rows
                  .map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(","))
                  .join("\r\n");
                const url = URL.createObjectURL(
                  new Blob(["\uFEFF", csv, "\r\n"], { type: "text/csv;charset=utf-8;" }),
                );
                const download = document.createElement("a");
                download.href = url;
                download.download = `scrapsetu-epr-report-${new Date().toISOString().slice(0, 10)}.csv`;
                document.body.appendChild(download);
                download.click();
                download.remove();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
              }}
            >
              <Download size={15} />
              <span><T>Export EPR Report</T></span>
            </button>
          </div>
        </div>

        {/* Action Notice Alert */}
        <T>{actionNotice && (
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
            <span><T>{actionNotice}</T></span>
          </div>
        )}</T>

        {/* 4 Key Metrics */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}><T>Authorized Facilities</T></span>
              <div className={styles.statIconWrap}>
                <Building2 size={16} />
              </div>
            </div>
            <div className={styles.statValue}><T>12</T></div>
            <span className={styles.statSubtext}><T>
              ✓ 11 Verified · 1 In Review
            </T></span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}><T>Active Collectors</T></span>
              <div className={styles.statIconWrap}>
                <Users size={16} />
              </div>
            </div>
            <div className={styles.statValue}><T>48</T></div>
            <span className={styles.statSubtext}><T>✓ Delhi NCR Registered</T></span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}><T>Lots In Pipeline</T></span>
              <div className={styles.statIconWrap}>
                <PackageCheck size={16} />
              </div>
            </div>
            <div className={styles.statValue}><T>14</T></div>
            <span className={styles.statSubtext}><T>Active Handover Matches</T></span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}><T>Material Diverted</T></span>
              <div className={styles.statIconWrap}>
                <Scale size={16} />
              </div>
            </div>
            <div className={styles.statValue}><T>1,840 kg</T></div>
            <span className={styles.statSubtext}><T>
              100% Cryptographically Traced
            </T></span>
          </div>
        </div>

        {/* Tab 1: Authorized Facilities Registry */}
        <T>{activeTab === "facilities" && (
          <div className={styles.tableCard}>
            <div className={styles.tableHeaderBar}>
              <h2 className={styles.tableCardTitle}><T>
                DPCC Registered Recycling Units
              </T></h2>
              <span className={styles.tableCardCount}>
                <T>{facilities.length}</T><T> Facilities Listed
              </T></span>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th><T>Facility Name</T></th>
                    <th><T>Region</T></th>
                    <th><T>DPCC Reg ID</T></th>
                    <th><T>Authorized Category</T></th>
                    <th><T>Status</T></th>
                    <th><T>Last Audited</T></th>
                    <th><T>Actions</T></th>
                  </tr>
                </thead>
                <tbody>
                  <T>{facilities.map((fac) => (
                    <tr key={fac.id}>
                      <td className={styles.primaryCell} data-label={translate("Facility Name")}><T>{fac.name}</T></td>
                      <td data-label={translate("Region")}><T>{fac.region}</T></td>
                      <td data-label={translate("DPCC Reg ID")}>
                        <span className={styles.monoCode}><T>{fac.dpccRegId}</T></span>
                      </td>
                      <td data-label={translate("Authorized Category")}><T>{fac.category}</T></td>
                      <td data-label={translate("Status")}>
                        <T>{fac.status === "verified" ? (
                          <span className={styles.statusVerified}>
                            <CheckCircle2 size={12} />
                            <span><T>Verified</T></span>
                          </span>
                        ) : (
                          <span className={styles.statusPending}>
                            <Clock size={12} />
                            <span><T>Audit Pending</T></span>
                          </span>
                        )}</T>
                      </td>
                      <td data-label={translate("Last Audited")}><T>{fac.lastInspection}</T></td>
                      <td data-label={translate("Actions")}>
                        <T>{fac.status === "pending" ? (
                          <button
                            type="button"
                            className={styles.approveBtn}
                            onClick={() =>
                              handleApproveFacility(fac.id, fac.name)
                            }
                          >
                            <Check size={13} />
                            <span><T>Approve</T></span>
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
                            <span><T>View KYC</T></span>
                          </button>
                        )}</T>
                      </td>
                    </tr>
                  ))}</T>
                </tbody>
              </table>
            </div>
          </div>
        )}</T>

        {/* Tab 2: Audit Manifests */}
        <T>{activeTab === "manifests" && (
          <div className={styles.tableCard}>
            <div className={styles.tableHeaderBar}>
              <h2 className={styles.tableCardTitle}><T>
                Immutable Chain of Custody Manifests
              </T></h2>
              <span className={styles.tableCardCount}><T>
                SHA-256 Telemetry Logged
              </T></span>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th><T>Lot Identifier</T></th>
                    <th><T>Collector (Source)</T></th>
                    <th><T>Facility (Dest)</T></th>
                    <th><T>Material</T></th>
                    <th><T>Net Weight</T></th>
                    <th><T>Cryptographic Hash</T></th>
                    <th><T>Timestamp</T></th>
                    <th><T>Regulatory State</T></th>
                  </tr>
                </thead>
                <tbody>
                  <T>{AUDIT_MANIFESTS.map((manifest) => (
                    <tr key={manifest.lotId}>
                      <td className={styles.primaryCell} data-label={translate("Lot Identifier")}><T>{manifest.lotId}</T></td>
                      <td data-label={translate("Collector (Source)")}><T>{manifest.collectorName}</T></td>
                      <td data-label={translate("Facility (Dest)")}><T>{manifest.facilityName}</T></td>
                      <td data-label={translate("Material")}><T>{manifest.material}</T></td>
                      <td data-label={translate("Net Weight")}>
                        <span
                          style={{
                            fontWeight: 700,
                            color: "var(--text-primary)",
                          }}
                        >
                          <T>{manifest.weight}</T>
                        </span>
                      </td>
                      <td data-label={translate("Cryptographic Hash")}>
                        <span className={styles.monoCode}>
                          <T>{manifest.qrHash}</T>
                        </span>
                      </td>
                      <td data-label={translate("Timestamp")}><T>{manifest.timestamp}</T></td>
                      <td data-label={translate("Regulatory State")}>
                        <span className={styles.statusVerified}>
                          <CheckCircle2 size={12} />
                          <span><T>{manifest.compliance}</T></span>
                        </span>
                      </td>
                    </tr>
                  ))}</T>
                </tbody>
              </table>
            </div>
          </div>
        )}</T>

        {/* Tab 3: Verification Queue */}
        <T>{activeTab === "verification" && (
          <div className={styles.tableCard}>
            <div className={styles.tableHeaderBar}>
              <h2 className={styles.tableCardTitle}><T>
                Pending Facility Verification Queue
              </T></h2>
              <span className={styles.tableCardCount}>
                <T>{pendingCount}</T><T> Units Pending
              </T></span>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th><T>Facility</T></th>
                    <th><T>Jurisdiction</T></th>
                    <th><T>DPCC Application ID</T></th>
                    <th><T>Intake Categories</T></th>
                    <th><T>Review Priority</T></th>
                    <th><T>Operational Action</T></th>
                  </tr>
                </thead>
                <tbody>
                  <T>{facilities
                    .filter((f) => f.status === "pending")
                    .map((fac) => (
                      <tr key={fac.id}>
                        <td className={styles.primaryCell} data-label={translate("Facility")}><T>{fac.name}</T></td>
                        <td data-label={translate("Jurisdiction")}><T>{fac.region}</T></td>
                        <td data-label={translate("DPCC Application ID")}>
                          <span className={styles.monoCode}>
                            <T>{fac.dpccRegId}</T>
                          </span>
                        </td>
                        <td data-label={translate("Intake Categories")}><T>{fac.category}</T></td>
                        <td data-label={translate("Review Priority")}>
                          <span className={styles.statusPending}>
                            <AlertCircle size={12} />
                            <span><T>HIGH PRIORITY</T></span>
                          </span>
                        </td>
                        <td data-label={translate("Operational Action")}>
                          <button
                            type="button"
                            className={styles.approveBtn}
                            onClick={() =>
                              handleApproveFacility(fac.id, fac.name)
                            }
                          >
                            <Check size={13} />
                            <span><T>Issue DPCC License</T></span>
                          </button>
                        </td>
                      </tr>
                    ))}</T>
                  <T>{facilities.filter((f) => f.status === "pending").length ===
                    0 && (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          textAlign: "center",
                          padding: "3rem 1rem",
                          color: "var(--text-muted)",
                        }}
                       data-label={translate("Facility")}>
                        <CheckCircle2
                          size={28}
                          color="var(--brand-primary)"
                          style={{ margin: "0 auto 0.5rem", display: "block" }}
                        />
                        <span style={{ fontWeight: 600 }}><T>
                          All facility verification queues are cleared and
                          compliant!
                        </T></span>
                      </td>
                    </tr>
                  )}</T>
                </tbody>
              </table>
            </div>
          </div>
        )}</T>
      </div>
    </AppShell>
  );
}
