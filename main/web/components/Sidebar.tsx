'use client';

import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  ShieldCheck,
  CreditCard,
  Truck,
  TrendingUp,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  matchedCount: number;
  pickupCount: number;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  matchedCount,
  pickupCount,
}: SidebarProps) {
  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div className="brand-section">
        <div className="brand-icon">
          <Layers size={22} />
        </div>
        <div className="brand-info">
          <h1>ScrapSetu</h1>
          <span>Kabadiwala Connect</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="nav-menu">
        <div className="nav-heading">Recycler Portal</div>
        
        <button
          className={`nav-item ${activeTab === 'recycler-overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('recycler-overview')}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'matched-lots' ? 'active' : ''}`}
          onClick={() => setActiveTab('matched-lots')}
        >
          <Inbox size={18} />
          <span>Incoming Lots</span>
          {matchedCount > 0 && <span className="nav-badge">{matchedCount}</span>}
        </button>

        <button
          className={`nav-item ${activeTab === 'handover' ? 'active' : ''}`}
          onClick={() => setActiveTab('handover')}
        >
          <ShieldCheck size={18} />
          <span>Handover & QR</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'rate-cards' ? 'active' : ''}`}
          onClick={() => setActiveTab('rate-cards')}
        >
          <CreditCard size={18} />
          <span>Rate Cards</span>
        </button>

        <div className="nav-heading">Ecosystem Channels</div>

        <button
          className={`nav-item ${activeTab === 'customer-pickup' ? 'active' : ''}`}
          onClick={() => setActiveTab('customer-pickup')}
        >
          <Truck size={18} />
          <span>Customer Pickups</span>
          {pickupCount > 0 && <span className="nav-badge" style={{ background: '#06b6d4' }}>{pickupCount}</span>}
        </button>

        <button
          className={`nav-item ${activeTab === 'price-board' ? 'active' : ''}`}
          onClick={() => setActiveTab('price-board')}
        >
          <TrendingUp size={18} />
          <span>Live Price Board</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'safety-guidance' ? 'active' : ''}`}
          onClick={() => setActiveTab('safety-guidance')}
        >
          <AlertTriangle size={18} />
          <span>Safety Guidance</span>
        </button>
      </nav>

      {/* Footer Connection Status */}
      <div className="sidebar-footer">
        <div className="connection-indicator">
          <div
            className="status-dot"
            style={{
              background: isSupabaseConfigured ? '#10b981' : '#06b6d4',
              boxShadow: isSupabaseConfigured
                ? '0 0 10px #10b981'
                : '0 0 10px #06b6d4',
            }}
          />
          <span>
            {isSupabaseConfigured ? 'Supabase Live Sync' : 'Pilot Sandbox Mode'}
          </span>
        </div>
      </div>
    </aside>
  );
}
