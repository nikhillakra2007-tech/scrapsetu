'use client';

import React, { useState } from 'react';
import {
  Truck,
  Calculator,
  Calendar,
  MapPin,
  CheckCircle2,
  Building2,
  Home,
  Sparkles,
} from 'lucide-react';
import { CustomerPickupRequest } from '@/types/database';
import { MOCK_PICKUP_REQUESTS } from '@/lib/mock-data';
import styles from './CustomerPickup.module.css';

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
      customer_phone: phone || '+91 98112 34567',
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
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Household & Bulk E-Waste Pickups</h2>
          <p className={styles.pageSubtitle}>
            Connect directly with verified local kabadiwalas or authorized recyclers for door-to-door e-waste pickup.
          </p>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className={styles.tabNavRow}>
          <button
            type="button"
            className={`${styles.tabNavBtn} ${activeSubTab === 'book' ? styles.tabNavBtnActive : ''}`}
            onClick={() => setActiveSubTab('book')}
          >
            <Truck size={14} />
            <span>Book a Pickup</span>
          </button>
          <button
            type="button"
            className={`${styles.tabNavBtn} ${activeSubTab === 'estimator' ? styles.tabNavBtnActive : ''}`}
            onClick={() => setActiveSubTab('estimator')}
          >
            <Calculator size={14} />
            <span>Price Estimator</span>
          </button>
          <button
            type="button"
            className={`${styles.tabNavBtn} ${activeSubTab === 'track' ? styles.tabNavBtnActive : ''}`}
            onClick={() => setActiveSubTab('track')}
          >
            <span>Track Requests ({requests.length})</span>
          </button>
        </div>
      </div>

      {/* 1. BOOKING FORM */}
      {activeSubTab === 'book' && (
        <div className={styles.formCenterWrapper}>
          <div className={styles.contentCard}>
            {submittedSuccess ? (
              <div className={styles.successState}>
                <CheckCircle2 size={44} className={styles.successCheckIcon} />
                <h3 className={styles.successTitle}>Pickup Request Broadcasted!</h3>
                <p className={styles.successDesc}>
                  Your request has been routed to verified informal collectors in your Delhi ward.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.bookingForm}>
                {/* Household vs Bulk Generator Selector */}
                <div className={styles.generatorToggle}>
                  <button
                    type="button"
                    className={`${styles.generatorBtn} ${!isBulk ? styles.generatorBtnActive : ''}`}
                    onClick={() => setIsBulk(false)}
                  >
                    <Home size={18} />
                    <span>Household Generator</span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.generatorBtn} ${isBulk ? styles.generatorBtnActive : ''}`}
                    onClick={() => setIsBulk(true)}
                  >
                    <Building2 size={18} />
                    <span>Bulk / Institutional Generator</span>
                  </button>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="customer-phone" className={styles.formLabel}>
                    Phone Number (For Collector Arrival SMS)
                  </label>
                  <input
                    id="customer-phone"
                    type="tel"
                    className={styles.formInput}
                    placeholder="+91 98112 34567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="customer-address" className={styles.formLabel}>
                    Pickup Address & Ward (Delhi)
                  </label>
                  <input
                    id="customer-address"
                    type="text"
                    className={styles.formInput}
                    placeholder="e.g. Flat 302, Mayur Vihar Ph-1, East Delhi"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="customer-desc" className={styles.formLabel}>
                    Material Description
                  </label>
                  <textarea
                    id="customer-desc"
                    rows={3}
                    className={styles.formTextarea}
                    placeholder="Describe scrap electronics: e.g. 2 old laptops, 4 chargers, 1 desktop CPU..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.twoColRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="customer-weight" className={styles.formLabel}>
                      Estimated Weight (kg)
                    </label>
                    <input
                      id="customer-weight"
                      type="number"
                      step="0.5"
                      className={styles.formInput}
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="customer-date" className={styles.formLabel}>
                      Preferred Date
                    </label>
                    <input
                      id="customer-date"
                      type="date"
                      className={styles.formInput}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="customer-window" className={styles.formLabel}>
                    Preferred Time Window
                  </label>
                  <select
                    id="customer-window"
                    className={styles.formSelect}
                    value={preferredWindow}
                    onChange={(e) => setPreferredWindow(e.target.value)}
                  >
                    <option>09:00 AM - 12:00 PM</option>
                    <option>12:00 PM - 03:00 PM</option>
                    <option>03:00 PM - 06:00 PM</option>
                  </select>
                </div>

                <button type="submit" className={styles.submitBtn}>
                  Confirm & Request Collector Pickup
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2. PRICE ESTIMATOR (FR15) */}
      {activeSubTab === 'estimator' && (
        <div className={styles.estimatorCenterWrapper}>
          <div className={styles.contentCard}>
            <div className={styles.cardHeaderBar}>
              <h3 className={styles.estimatorTitle}>
                <Sparkles size={18} className={styles.sparkleIcon} />
                <span>Indicative Fair Market Price Calculator</span>
              </h3>
            </div>
            <p className={styles.estimatorSubtitle}>
              Check prevailing benchmark rates before handing over material to prevent lowball offers.
            </p>

            <div className={styles.formGroup}>
              <label htmlFor="est-category" className={styles.formLabel}>
                Select E-Waste Category
              </label>
              <select
                id="est-category"
                className={styles.formSelect}
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

            <div className={styles.formGroup}>
              <label htmlFor="est-weight" className={styles.formLabel}>
                Approximate Weight (kg)
              </label>
              <input
                id="est-weight"
                type="number"
                step="0.5"
                className={styles.formInput}
                value={estWeight}
                onChange={(e) => setEstWeight(e.target.value)}
              />
            </div>

            {/* Calculated Fair Valuation Box */}
            <div className={styles.estimateResultBox}>
              <div className={styles.estimateLabel}>
                Estimated Fair Handover Value
              </div>
              <div className={styles.estimateValue}>
                ₹{calculatedEstimate.toLocaleString()}
              </div>
              <div className={styles.estimateSub}>
                Indicative rate: ₹{getEstRate(estCategory)}/kg (7-Day Rolling Delhi Average)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TRACKING LIST */}
      {activeSubTab === 'track' && (
        <div className={styles.tableCard}>
          <div className={styles.tableResponsive}>
            <table className={styles.customTable}>
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
                      <span className={styles.requestIdText}>{r.id}</span>
                    </td>
                    <td>{r.customer_phone}</td>
                    <td>
                      <div className={styles.addressRow}>
                        <MapPin size={13} className={styles.locationPin} />
                        <span>{r.pickup_address}</span>
                      </div>
                    </td>
                    <td>{r.material_description}</td>
                    <td>{r.approx_weight_kg} kg</td>
                    <td>
                      <span className={`${styles.typeBadge} ${r.is_bulk ? styles.bulkBadge : styles.householdBadge}`}>
                        {r.is_bulk ? 'BULK' : 'HOUSEHOLD'}
                      </span>
                    </td>
                    <td>
                      <span className={styles.statusBadge}>
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
