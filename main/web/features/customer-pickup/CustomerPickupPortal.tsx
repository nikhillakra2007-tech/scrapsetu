'use client';
import { T, useLocale } from '@/components/language/Language';

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
 const {t:translate}=useLocale();

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
          <h2 className={styles.pageTitle}><T>Household & Bulk E-Waste Pickups</T></h2>
          <p className={styles.pageSubtitle}><T>
            Connect directly with verified local kabadiwalas or authorized recyclers for door-to-door e-waste pickup.
          </T></p>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className={styles.tabNavRow}>
          <button
            type="button"
            className={`${styles.tabNavBtn} ${activeSubTab === 'book' ? styles.tabNavBtnActive : ''}`}
            onClick={() => setActiveSubTab('book')}
          >
            <Truck size={14} />
            <span><T>Book a Pickup</T></span>
          </button>
          <button
            type="button"
            className={`${styles.tabNavBtn} ${activeSubTab === 'estimator' ? styles.tabNavBtnActive : ''}`}
            onClick={() => setActiveSubTab('estimator')}
          >
            <Calculator size={14} />
            <span><T>Price Estimator</T></span>
          </button>
          <button
            type="button"
            className={`${styles.tabNavBtn} ${activeSubTab === 'track' ? styles.tabNavBtnActive : ''}`}
            onClick={() => setActiveSubTab('track')}
          >
            <span><T>Track Requests (</T><T>{requests.length}</T><T>)</T></span>
          </button>
        </div>
      </div>

      {/* 1. BOOKING FORM */}
      <T>{activeSubTab === 'book' && (
        <div className={styles.formCenterWrapper}>
          <div className={styles.contentCard}>
            <T>{submittedSuccess ? (
              <div className={styles.successState}>
                <CheckCircle2 size={44} className={styles.successCheckIcon} />
                <h3 className={styles.successTitle}><T>Pickup Request Broadcasted!</T></h3>
                <p className={styles.successDesc}><T>
                  Your request has been routed to verified informal collectors in your Delhi ward.
                </T></p>
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
                    <span><T>Household Generator</T></span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.generatorBtn} ${isBulk ? styles.generatorBtnActive : ''}`}
                    onClick={() => setIsBulk(true)}
                  >
                    <Building2 size={18} />
                    <span><T>Bulk / Institutional Generator</T></span>
                  </button>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="customer-phone" className={styles.formLabel}><T>
                    Phone Number (For Collector Arrival SMS)
                  </T></label>
                  <input
                    id="customer-phone"
                    type="tel"
                    className={styles.formInput}
                    placeholder={translate("+91 98112 34567")}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="customer-address" className={styles.formLabel}><T>
                    Pickup Address & Ward (Delhi)
                  </T></label>
                  <input
                    id="customer-address"
                    type="text"
                    className={styles.formInput}
                    placeholder={translate("e.g. Flat 302, Mayur Vihar Ph-1, East Delhi")}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="customer-desc" className={styles.formLabel}><T>
                    Material Description
                  </T></label>
                  <textarea
                    id="customer-desc"
                    rows={3}
                    className={styles.formTextarea}
                    placeholder={translate("Describe scrap electronics: e.g. 2 old laptops, 4 chargers, 1 desktop CPU...")}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.twoColRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="customer-weight" className={styles.formLabel}><T>
                      Estimated Weight (kg)
                    </T></label>
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
                    <label htmlFor="customer-date" className={styles.formLabel}><T>
                      Preferred Date
                    </T></label>
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
                  <label htmlFor="customer-window" className={styles.formLabel}><T>
                    Preferred Time Window
                  </T></label>
                  <select
                    id="customer-window"
                    className={styles.formSelect}
                    value={preferredWindow}
                    onChange={(e) => setPreferredWindow(e.target.value)}
                  >
                    <option><T>09:00 AM - 12:00 PM</T></option>
                    <option><T>12:00 PM - 03:00 PM</T></option>
                    <option><T>03:00 PM - 06:00 PM</T></option>
                  </select>
                </div>

                <button type="submit" className={styles.submitBtn}><T>
                  Confirm & Request Collector Pickup
                </T></button>
              </form>
            )}</T>
          </div>
        </div>
      )}</T>

      {/* 2. PRICE ESTIMATOR (FR15) */}
      <T>{activeSubTab === 'estimator' && (
        <div className={styles.estimatorCenterWrapper}>
          <div className={styles.contentCard}>
            <div className={styles.cardHeaderBar}>
              <h3 className={styles.estimatorTitle}>
                <Sparkles size={18} className={styles.sparkleIcon} />
                <span><T>Indicative Fair Market Price Calculator</T></span>
              </h3>
            </div>
            <p className={styles.estimatorSubtitle}><T>
              Check prevailing benchmark rates before handing over material to prevent lowball offers.
            </T></p>

            <div className={styles.formGroup}>
              <label htmlFor="est-category" className={styles.formLabel}><T>
                Select E-Waste Category
              </T></label>
              <select
                id="est-category"
                className={styles.formSelect}
                value={estCategory}
                onChange={(e) => setEstCategory(e.target.value)}
              >
                <option value="PCB"><T>Printed Circuit Boards (Mobile/PC Motherboards)</T></option>
                <option value="BATTERY"><T>Batteries (Lithium-Ion / Lead Acid)</T></option>
                <option value="CABLE_WIRE"><T>Cables & Wires (Copper)</T></option>
                <option value="LCD_LED_PANEL"><T>Flat Displays & Panels</T></option>
                <option value="METAL_SCRAP"><T>Heavy Scrap Metal / Copper</T></option>
                <option value="WHOLE_DEVICE"><T>Whole Intact Devices (Laptops/Phones)</T></option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="est-weight" className={styles.formLabel}><T>
                Approximate Weight (kg)
              </T></label>
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
              <div className={styles.estimateLabel}><T>
                Estimated Fair Handover Value
              </T></div>
              <div className={styles.estimateValue}><T>
                ₹</T><T>{calculatedEstimate.toLocaleString()}</T>
              </div>
              <div className={styles.estimateSub}><T>
                Indicative rate: ₹</T><T>{getEstRate(estCategory)}</T><T>/kg (7-Day Rolling Delhi Average)
              </T></div>
            </div>
          </div>
        </div>
      )}</T>

      {/* 3. TRACKING LIST */}
      <T>{activeSubTab === 'track' && (
        <div className={styles.tableCard}>
          <div className={styles.tableResponsive}>
            <table className={styles.customTable}>
              <thead>
                <tr>
                  <th><T>Request ID</T></th>
                  <th><T>Customer Phone</T></th>
                  <th><T>Pickup Address</T></th>
                  <th><T>Materials</T></th>
                  <th><T>Weight</T></th>
                  <th><T>Type</T></th>
                  <th><T>Status</T></th>
                </tr>
              </thead>
              <tbody>
                <T>{requests.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <span className={styles.requestIdText}><T>{r.id}</T></span>
                    </td>
                    <td><T>{r.customer_phone}</T></td>
                    <td>
                      <div className={styles.addressRow}>
                        <MapPin size={13} className={styles.locationPin} />
                        <span><T>{r.pickup_address}</T></span>
                      </div>
                    </td>
                    <td><T>{r.material_description}</T></td>
                    <td><T>{r.approx_weight_kg}</T><T> kg</T></td>
                    <td>
                      <span className={`${styles.typeBadge} ${r.is_bulk ? styles.bulkBadge : styles.householdBadge}`}>
                        <T>{r.is_bulk ? 'BULK' : 'HOUSEHOLD'}</T>
                      </span>
                    </td>
                    <td>
                      <span className={styles.statusBadge}>
                        <T>{r.status.toUpperCase()}</T>
                      </span>
                    </td>
                  </tr>
                ))}</T>
              </tbody>
            </table>
          </div>
        </div>
      )}</T>
    </div>
  );
}
