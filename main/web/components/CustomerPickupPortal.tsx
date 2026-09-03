'use client';

import React, { useState } from 'react';
import {
  Truck,
  Calculator,
  Calendar,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  Building2,
  Home,
  Sparkles,
} from 'lucide-react';
import { CustomerPickupRequest } from '@/types/database';
import { MOCK_PICKUP_REQUESTS, MOCK_CATEGORIES } from '@/lib/mock-data';

export default function CustomerPickupPortal() {
  const [activeSubTab, setActiveSubTab] = useState<'book' | 'estimator' | 'track'>('book');
  const [requests, setRequests] = useState<CustomerPickupRequest[]>(MOCK_PICKUP_REQUESTS);
  const [isBulk, setIsBulk] = useState(false);
  
  // Form State
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('5');
  const [preferredDate, setPreferredDate] = useState('2026-09-05');
  const [preferredWindow, setPreferredWindow] = useState('10:00 AM - 01:00 PM');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Estimator State
  const [estCategory, setEstCategory] = useState('PCB');
  const [estWeight, setEstWeight] = useState('10');

  const getEstRate = (cat: string) => {
    switch (cat) {
      case 'PCB': return 450;
      case 'BATTERY': return 180;
      case 'CABLE_WIRE': return 385;
      case 'LCD_LED_PANEL': return 110;
      case 'METAL_SCRAP': return 530;
      case 'WHOLE_DEVICE': return 480;
      default: return 200;
    }
  };

  const calculatedEstimate = (parseFloat(estWeight) || 0) * getEstRate(estCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: CustomerPickupRequest = {
      id: 'req-' + Date.now(),
      customer_phone: phone || '+91 98765 43210',
      pickup_address: address || 'Connaught Place, Central Delhi',
      material_description: description || 'Mixed e-waste cables and devices',
      approx_weight_kg: parseFloat(weight) || 5,
      preferred_date: `${preferredDate} (${preferredWindow})`,
      is_bulk: isBulk,
      status: 'pending',
      created_at: 'Just now',
    };
    setRequests([newReq, ...requests]);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setActiveSubTab('track');
    }, 1500);
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Household & Bulk E-Waste Pickups</h2>
          <p>
            Connect directly with verified local kabadiwalas or authorized recyclers for fair-value e-waste pickup.
          </p>
        </div>

        {/* Sub Navigation */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn btn-sm ${activeSubTab === 'book' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubTab('book')}
          >
            <Truck size={14} />
            <span>Book a Pickup</span>
          </button>
          <button
            className={`btn btn-sm ${activeSubTab === 'estimator' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubTab('estimator')}
          >
            <Calculator size={14} />
            <span>Price Estimator</span>
          </button>
          <button
            className={`btn btn-sm ${activeSubTab === 'track' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubTab('track')}
          >
            <span>Track Requests ({requests.length})</span>
          </button>
        </div>
      </div>

      {/* 1. BOOKING FORM */}
      {activeSubTab === 'book' && (
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div className="content-card">
            {submittedSuccess ? (
              <div style={{ textAlign: 'center', padding: '32px' }}>
                <CheckCircle2 size={48} color="var(--emerald-accent)" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>
                  Pickup Request Broadcasted!
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  Your request has been routed to verified informal collectors in your Delhi ward.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Household vs Bulk Toggle */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                  <button
                    type="button"
                    className={`btn ${!isBulk ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setIsBulk(false)}
                    style={{ padding: '14px' }}
                  >
                    <Home size={18} />
                    <span>Household / Small Generator</span>
                  </button>
                  <button
                    type="button"
                    className={`btn ${isBulk ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setIsBulk(true)}
                    style={{ padding: '14px' }}
                  >
                    <Building2 size={18} />
                    <span>Institutional / Bulk Generator</span>
                  </button>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number (For Collector Arrival SMS)</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+91 98112 34567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Pickup Address & Ward (Delhi)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Flat 302, Mayur Vihar Ph-1, East Delhi"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Material Description</label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    placeholder="Describe electronics: e.g. 2 old laptops, 4 chargers, 1 desktop CPU..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Estimated Total Weight (kg)</label>
                    <input
                      type="number"
                      step="0.5"
                      className="form-input"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Preferred Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Time Window</label>
                  <select
                    className="form-select"
                    value={preferredWindow}
                    onChange={(e) => setPreferredWindow(e.target.value)}
                  >
                    <option>09:00 AM - 12:00 PM</option>
                    <option>12:00 PM - 03:00 PM</option>
                    <option>03:00 PM - 06:00 PM</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '15px' }}>
                  Confirm & Request Collector Pickup
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2. PRICE ESTIMATOR (FR15) */}
      {activeSubTab === 'estimator' && (
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div className="content-card">
            <div className="card-title-bar">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="var(--cyan-accent)" />
                Indicative Fair Market Price Calculator
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Check prevailing benchmark prices before handing over material to prevent lowball offers.
            </p>

            <div className="form-group">
              <label className="form-label">Select E-Waste Category</label>
              <select
                className="form-select"
                value={estCategory}
                onChange={(e) => setEstCategory(e.target.value)}
              >
                <option value="PCB">Printed Circuit Boards (Mobile/PC Motherboards)</option>
                <option value="BATTERY">Batteries (Lithium-Ion / Lead Acid)</option>
                <option value="CABLE_WIRE">Cables & Wires (Copper)</option>
                <option value="LCD_LED_PANEL">Flat Displays & Panels</option>
                <option value="METAL_SCRAP">Heavy Scrap Metal / Copper</option>
                <option value="WHOLE_DEVICE">Whole Intact Devices (Laptops/Phones)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Approximate Weight (kg)</label>
              <input
                type="number"
                step="0.5"
                className="form-input"
                value={estWeight}
                onChange={(e) => setEstWeight(e.target.value)}
              />
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.1))',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                textAlign: 'center',
                border: '1px solid var(--border-active)',
                marginTop: '24px',
              }}
            >
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Estimated Fair Handover Value
              </div>
              <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--emerald-accent)', margin: '8px 0' }}>
                ₹{calculatedEstimate.toLocaleString()}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Indicative rate: ₹{getEstRate(estCategory)}/kg (7-Day Rolling Delhi Average)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TRACKING LIST */}
      {activeSubTab === 'track' && (
        <div className="content-card">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Customer Phone</th>
                  <th>Pickup Address</th>
                  <th>Materials</th>
                  <th>Weight</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{r.id}</span>
                    </td>
                    <td>{r.customer_phone}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={13} color="var(--text-muted)" />
                        <span>{r.pickup_address}</span>
                      </div>
                    </td>
                    <td>{r.material_description}</td>
                    <td>{r.approx_weight_kg} kg</td>
                    <td>
                      <span className={`badge ${r.is_bulk ? 'badge-amber' : 'badge-cyan'}`}>
                        {r.is_bulk ? 'BULK' : 'HOUSEHOLD'}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-safe">
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
