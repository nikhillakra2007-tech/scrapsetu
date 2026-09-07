'use client';
import { T, useLocale } from '@/components/language/Language';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { LanguageSwitcher } from '@/components/language/Language';
import {
  Recycle,
  Bell,
  CheckCircle2,
  LogOut,
  Sparkles,
  LayoutDashboard,
  Inbox,
  ShieldCheck,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Truck,
  Building2,
  FileCheck2,
  X,
  ExternalLink,
  Check,
} from 'lucide-react';
import styles from './Header.module.css';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'verification' | 'price' | 'pickup' | 'manifest';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Lot Handover Verified',
    message: 'EcoRecycle Scientific Hub confirmed intake for LOT-DEL-089 (45.0 kg PCB).',
    time: '12m ago',
    isRead: false,
    type: 'verification',
  },
  {
    id: 'notif-2',
    title: 'Benchmark Price Adjusted',
    message: 'DPCC indexed Delhi copper benchmark rate to ₹385/kg (+₹15/kg).',
    time: '1h ago',
    isRead: false,
    type: 'price',
  },
  {
    id: 'notif-3',
    title: 'New Citizen Doorstep Request',
    message: 'Residential pickup requested in Okhla Phase II (Est: 18kg electronics).',
    time: '2h ago',
    isRead: false,
    type: 'pickup',
  },
  {
    id: 'notif-4',
    title: 'Cryptographic Audit Logged',
    message: 'EPR Form 2 manifest sealed with SHA-256 hash SETU-DEL-8942-OKHLA.',
    time: '4h ago',
    isRead: true,
    type: 'manifest',
  },
];

interface HeaderProps {
  role: 'collector' | 'recycler' | 'admin' | 'citizen';
  currentTab: string;
  onSelectTab: (tab: string) => void;
  currentUser?: {
    name: string;
    email?: string;
    role?: 'collector' | 'recycler' | 'admin' | 'citizen';
  } | null;
  onSignOut?: () => void;
  matchedCount?: number;
  pickupCount?: number;
}

export default function Header({
  role,
  currentTab,
  onSelectTab,
  currentUser,
  onSignOut,
  matchedCount = 0,
  pickupCount = 0,
}: HeaderProps) {
 const {t:translate}=useLocale();

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    if (isNotifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotifOpen]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markSingleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  interface NavTabItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    isAi?: boolean;
    count?: number;
  }

  // Nav items per role
  const collectorTabs: NavTabItem[] = [
    { id: 'collector-scan', label: 'AI Scrap Scanner', icon: Sparkles, isAi: true },
    { id: 'price-board', label: 'Price Board', icon: TrendingUp },
    { id: 'safety-guidance', label: 'Worker Safety', icon: AlertTriangle },
    { id: 'customer-pickup', label: 'Doorstep Pickups', icon: Truck, count: pickupCount },
  ];

  const recyclerTabs: NavTabItem[] = [
    { id: 'recycler-overview', label: 'Facility Hub', icon: LayoutDashboard },
    { id: 'matched-lots', label: 'Incoming Feedstock', icon: Inbox, count: matchedCount },
    { id: 'handover', label: 'Handover & QR', icon: ShieldCheck },
    { id: 'rate-cards', label: 'Rate Cards', icon: CreditCard },
  ];

  const adminTabs: NavTabItem[] = [
    { id: 'facilities', label: 'Facility Registry', icon: Building2 },
    { id: 'manifests', label: 'Audit Manifests', icon: FileCheck2 },
    { id: 'verification', label: 'Verification Queue', icon: ShieldCheck, count: 1 },
  ];

  const currentTabs: NavTabItem[] =
    role === 'citizen' ? [{ id: 'estimate', label: 'Price estimator', icon: TrendingUp }, { id: 'pickup', label: 'Book pickup', icon: Truck }] : role === 'collector'
      ? collectorTabs
      : role === 'recycler'
      ? recyclerTabs
      : adminTabs;

  const roleLabels = {
    citizen: 'Citizen workspace',
    collector: 'Field Collector Portal',
    recycler: 'Recycler Facility Hub',
    admin: 'Platform Administration',
  };

  return (
    <header className={styles.topNav}>
      <div className={styles.navInner}>
        {/* Left: Brand Logo matching Landing Page */}
        <div className={styles.brandGroup}>
          <Link href="/" className={styles.navBrand} title={translate("Return to Public Homepage")}>
            <div className={styles.brandIconWrap}>
              <Recycle size={27} strokeWidth={1.7} />
            </div>
            <span className={styles.brandName}><T>
              SmartScrapSetu</T><span className={styles.brandDot}><T>®</T></span>
            </span>
          </Link>

          <span className={styles.roleSubtextPill}>
            <T>{roleLabels[role]}</T>
          </span>
        </div>

        {/* Center: Clean Horizontal Navigation */}
        <nav className={styles.navTabs} aria-label={translate("Role Navigation")}>
          <T>{currentTabs.map((item) => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                className={`${styles.tabBtn} ${isActive ? styles.tabBtnActive : ''}`}
                onClick={() => onSelectTab(item.id)}
              >
                <Icon size={16} className={styles.tabIcon} />
                <span><T>{item.label}</T></span>
                <T>{item.isAi && <span className={styles.aiPill}><T>AI</T></span>}</T>
                <T>{Boolean(item.count && item.count > 0) && (
                  <span className={styles.countBadge}><T>{item.count}</T></span>
                )}</T>
              </button>
            );
          })}</T>
        </nav>

        {/* Right Actions */}
        <div className={styles.rightActions}><LanguageSwitcher/>
          {/* Live Network Status */}
          <div className={styles.networkBadge}>
            <span className={styles.pulseDot} />
            <span className={styles.networkLabel}><T>DELHI NCR ONLINE</T></span>
          </div>

          {/* Alert Notification Button with Functional Popover */}
          <div className={styles.notifWrapper} ref={notifRef}>
            <button
              type="button"
              className={`${styles.notifBtn} ${isNotifOpen ? styles.notifBtnActive : ''}`}
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              title={translate("System Alerts & Notifications")}
              aria-label={translate("System Alerts")}
            >
              <Bell size={18} />
              <T>{unreadCount > 0 && (
                <span className={styles.unreadDot} title={`${unreadCount} unread alerts`} />
              )}</T>
            </button>

            {/* Notification Popover Dropdown */}
            <T>{isNotifOpen && (
              <div className={styles.notifDropdown}>
                <div className={styles.notifHeader}>
                  <div className={styles.notifTitleRow}>
                    <span className={styles.notifTitle}><T>System Notifications</T></span>
                    <T>{unreadCount > 0 && (
                      <span className={styles.unreadCountTag}><T>{unreadCount}</T><T> new</T></span>
                    )}</T>
                  </div>
                  <T>{unreadCount > 0 && (
                    <button
                      type="button"
                      className={styles.markAllBtn}
                      onClick={markAllAsRead}
                    ><T>
                      Mark all read
                    </T></button>
                  )}</T>
                </div>

                <div className={styles.notifList}>
                  <T>{notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`${styles.notifItem} ${!notif.isRead ? styles.notifUnread : ''}`}
                      onClick={() => markSingleRead(notif.id)}
                    >
                      <div className={styles.notifIconWrap}>
                        <T>{notif.type === 'verification' && <CheckCircle2 size={16} color="var(--brand-primary)" />}</T>
                        <T>{notif.type === 'price' && <TrendingUp size={16} color="var(--accent-amber, #D97706)" />}</T>
                        <T>{notif.type === 'pickup' && <Truck size={16} color="var(--accent-tech, #0F9F9A)" />}</T>
                        <T>{notif.type === 'manifest' && <FileCheck2 size={16} color="#4F46E5" />}</T>
                      </div>

                      <div className={styles.notifContent}>
                        <div className={styles.notifItemTitleRow}>
                          <span className={styles.notifItemTitle}><T>{notif.title}</T></span>
                          <span className={styles.notifTime}><T>{notif.time}</T></span>
                        </div>
                        <p className={styles.notifMessage}><T>{notif.message}</T></p>
                      </div>

                      <T>{!notif.isRead && <span className={styles.itemUnreadPip} />}</T>
                    </div>
                  ))}</T>
                </div>

                <div className={styles.notifFooter}>
                  <span className={styles.notifFooterText}><T>CPCB & DPCC Telemetry Stream</T></span>
                  <button
                    type="button"
                    className={styles.closeNotifBtn}
                    onClick={() => setIsNotifOpen(false)}
                  ><T>
                    Close
                  </T></button>
                </div>
              </div>
            )}</T>
          </div>

          {/* User Profile Pill */}
          <T>{currentUser && (
            <div
              className={styles.userProfilePill}
              title={`Logged in as ${currentUser.name}`}
            >
              <div className={styles.userAvatar}>
                <T>{currentUser.name.charAt(0).toUpperCase()}</T>
              </div>
              <span className={styles.userNameText}>
                <T>{currentUser.name.split(' ')[0]}</T>
              </span>
            </div>
          )}</T>

          {/* Sign Out Button */}
          <T>{onSignOut && (
            <button
              type="button"
              className={styles.signOutBtn}
              onClick={onSignOut}
              title={translate("Sign out of session")}
              aria-label={translate("Sign Out")}
            >
              <LogOut size={16} />
            </button>
          )}</T>
        </div>
      </div>
    </header>
  );
}
