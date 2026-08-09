import React, { useState, useMemo, useRef } from 'react';
import { ArrowRight, Phone, DollarSign, Calculator as CalcIcon, ChevronDown, AlertCircle, TrendingDown, Info } from 'lucide-react';

const BUSINESS_TYPES = [
  { value: 'dental',       label: 'Dental Practice',         unit: 'dental appointment',        eg: '$150' },
  { value: 'medical',      label: 'Medical / Healthcare',    unit: 'patient appointment',        eg: '$200' },
  { value: 'restaurant',   label: 'Restaurant',              unit: 'reservation / table',        eg: '$60'  },
  { value: 'home_svc',     label: 'Home Services',           unit: 'service visit / job',        eg: '$250' },
  { value: 'salon',        label: 'Salon / Spa',             unit: 'appointment',                eg: '$80'  },
  { value: 'real_estate',  label: 'Real Estate',             unit: 'consultation / showing',     eg: '$500' },
  { value: 'legal',        label: 'Legal Services',          unit: 'client consultation',        eg: '$350' },
  { value: 'other',        label: 'Other Business',          unit: 'new customer',               eg: '$150' },
];

export default function Calculator({ setActivePage }) {
  const [callsPerWeek, setCallsPerWeek] = useState(40);
  const [missedPct,    setMissedPct]    = useState(15);
  const [avgValue,     setAvgValue]     = useState(150);
  const [businessType, setBusinessType] = useState('dental');

  const resultRef = useRef(null);
  const business  = BUSINESS_TYPES.find(b => b.value === businessType) || BUSINESS_TYPES[0];

  // ── Pure client-side math ──────────────────────────────────────────
  const calc = useMemo(() => {
    const cpw = Math.max(0, parseFloat(callsPerWeek) || 0);
    const pct = Math.max(0, Math.min(100, parseFloat(missedPct) || 0));
    const val = Math.max(0, parseFloat(avgValue) || 0);
    const missedPerWeek  = cpw * (pct / 100);
    const missedPerMonth = missedPerWeek * 4.3;
    const revenueLost    = missedPerMonth * val;
    return { cpw, pct, val, missedPerWeek, missedPerMonth, revenueLost };
  }, [callsPerWeek, missedPct, avgValue]);

  const fmt    = n => new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(n);
  const fmtUSD = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  const sliderBg = `linear-gradient(to right, var(--accent-neon) ${missedPct}%, rgba(255,255,255,0.06) ${missedPct}%)`;

  return (
    <div className="calculator-page page-enter">

      {/* ── Hero header ─────────────────────────────────────────── */}
      <section className="calc-hero">
        <div className="container" style={{ textAlign: 'center', maxWidth: '680px' }}>
          <span className="section-tag txt-slide" style={{ display: 'block', margin: '0 auto 16px auto' }}>
            Revenue Calculator
          </span>
          <h1 className="calc-hero-title txt-reveal-2">
            How much revenue are missed calls costing you?
          </h1>
          <p className="section-subtitle txt-blur-in" style={{ margin: '0 auto' }}>
            Enter a few numbers about your business below. We'll show you a clear, step-by-step estimate of potential monthly revenue lost to unanswered calls — no email required.
          </p>
        </div>
      </section>

      {/* ── Calculator body ─────────────────────────────────────── */}
      <section className="calc-body-section">
        <div className="container">
          <div className="calc-grid">

            {/* ── LEFT: Inputs ────────────────────────────────── */}
            <div
              className="glass-card calc-inputs-card"
              role="form"
              aria-label="Missed call revenue calculator inputs"
            >
              <h2 className="calc-panel-heading">
                <CalcIcon size={18} style={{ color: 'var(--accent-neon)' }} />
                Your Numbers
              </h2>

              {/* 1 — Calls per week */}
              <div className="calc-field">
                <label htmlFor="calc-calls" className="calc-label">
                  Calls received per week
                </label>
                <p className="calc-hint">
                  How many inbound calls does your business typically receive in a week?
                </p>
                <div className="calc-input-wrap">
                  <Phone size={15} className="calc-input-icon" aria-hidden="true" />
                  <input
                    id="calc-calls"
                    type="number"
                    min="1"
                    max="9999"
                    value={callsPerWeek}
                    onChange={e => setCallsPerWeek(e.target.value)}
                    className="calc-input"
                    aria-label="Average calls received per week"
                  />
                  <span className="calc-input-suffix">calls / week</span>
                </div>
              </div>

              {/* 2 — Missed % */}
              <div className="calc-field">
                <label htmlFor="calc-missed" className="calc-label">
                  Missed or unanswered calls
                  <span className="calc-pct-badge" aria-live="polite">{missedPct}%</span>
                </label>
                <p className="calc-hint">
                  Roughly what percentage of your calls go unanswered, to voicemail, or get abandoned? Enter your own estimate.
                </p>
                <input
                  id="calc-missed"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={missedPct}
                  onChange={e => setMissedPct(e.target.value)}
                  className="calc-slider"
                  style={{ background: sliderBg }}
                  aria-label="Percentage of calls missed or unanswered"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={missedPct}
                  aria-valuetext={`${missedPct} percent`}
                />
                <div className="calc-slider-markers" aria-hidden="true">
                  <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                </div>
              </div>

              {/* 3 — Avg customer value */}
              <div className="calc-field">
                <label htmlFor="calc-value" className="calc-label">
                  Average value of a new {business.unit}
                </label>
                <p className="calc-hint">
                  What's a typical {business.unit} worth to your business? (e.g. {business.eg})
                </p>
                <div className="calc-input-wrap">
                  <DollarSign size={15} className="calc-input-icon" aria-hidden="true" />
                  <input
                    id="calc-value"
                    type="number"
                    min="0"
                    max="999999"
                    value={avgValue}
                    onChange={e => setAvgValue(e.target.value)}
                    className="calc-input"
                    aria-label="Average value of a new customer booking in US dollars"
                  />
                </div>
              </div>

              {/* 4 — Business type */}
              <div className="calc-field" style={{ marginBottom: 0 }}>
                <label htmlFor="calc-type" className="calc-label">
                  Business type
                  <span style={{ color: 'var(--text-muted)', fontWeight: '400', fontSize: '0.78rem' }}>
                    optional — personalizes the copy
                  </span>
                </label>
                <div className="calc-select-wrap">
                  <select
                    id="calc-type"
                    value={businessType}
                    onChange={e => setBusinessType(e.target.value)}
                    className="calc-select"
                    aria-label="Business type"
                  >
                    {BUSINESS_TYPES.map(b => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={15} className="calc-select-icon" aria-hidden="true" />
                </div>
              </div>
            </div>

            {/* ── RIGHT: Result ────────────────────────────────── */}
            <div className="calc-result-sticky" ref={resultRef}>
              <div className="glass-card calc-result-card" aria-live="polite" aria-atomic="true">

                {/* Panel heading */}
                <h2 className="calc-panel-heading">
                  <TrendingDown size={18} style={{ color: '#ef4444' }} />
                  Estimated Revenue Lost
                </h2>

                {/* Big number */}
                <div className="calc-big-number-block">
                  <span className="calc-big-label">To missed calls per month</span>
                  <span
                    className="calc-big-number"
                    style={{ color: calc.revenueLost > 0 ? '#ef4444' : 'var(--text-muted)' }}
                    aria-label={`Estimated revenue lost: ${fmtUSD(calc.revenueLost)} per month`}
                  >
                    {fmtUSD(calc.revenueLost)}
                  </span>
                  <span className="calc-big-sub">per month</span>
                </div>

                {/* Step-by-step breakdown */}
                <div style={{ marginBottom: '20px' }}>
                  <div className="calc-breakdown-heading">
                    <Info size={12} aria-hidden="true" />
                    How we calculated this
                  </div>
                  <div className="calc-breakdown" role="region" aria-label="Calculation breakdown">
                    <div className="calc-step">
                      <span className="cs-label">Calls per week</span>
                      <span className="cs-val">{calc.cpw}</span>
                    </div>
                    <div className="calc-step">
                      <span className="cs-label">× Missed rate</span>
                      <span className="cs-val">{calc.pct}% ÷ 100 = {calc.pct / 100}</span>
                    </div>
                    <div className="calc-step calc-step-sub">
                      <span className="cs-label">= Missed calls / week</span>
                      <span className="cs-val">{fmt(calc.missedPerWeek)}</span>
                    </div>

                    <div className="calc-divider" aria-hidden="true" />

                    <div className="calc-step">
                      <span className="cs-label">Missed calls / week</span>
                      <span className="cs-val">{fmt(calc.missedPerWeek)}</span>
                    </div>
                    <div className="calc-step">
                      <span className="cs-label">× Avg weeks / month</span>
                      <span className="cs-val">4.3</span>
                    </div>
                    <div className="calc-step calc-step-sub">
                      <span className="cs-label">= Missed calls / month</span>
                      <span className="cs-val">{fmt(calc.missedPerMonth)}</span>
                    </div>

                    <div className="calc-divider" aria-hidden="true" />

                    <div className="calc-step">
                      <span className="cs-label">Missed calls / month</span>
                      <span className="cs-val">{fmt(calc.missedPerMonth)}</span>
                    </div>
                    <div className="calc-step">
                      <span className="cs-label">× Avg {business.unit} value</span>
                      <span className="cs-val">{fmtUSD(calc.val)}</span>
                    </div>
                    <div className="calc-step calc-step-final">
                      <span className="cs-label">= Revenue lost / month</span>
                      <span className="cs-val" style={{ color: '#ef4444' }}>{fmtUSD(calc.revenueLost)}</span>
                    </div>
                  </div>
                </div>

                {/* Disclaimer — non-negotiable per spec */}
                <div className="calc-disclaimer" role="note">
                  <AlertCircle size={13} aria-hidden="true" />
                  <p>
                    This is an estimate based on the numbers you entered, not a guarantee or audit of your actual call data. Real results vary by business.
                  </p>
                </div>

                {/* CTA */}
                <div className="calc-cta-block">
                  <p className="calc-cta-copy">
                    An AI receptionist answers calls your team can't get to — see how it works:
                  </p>
                  <button
                    onClick={() => setActivePage('contact', 'trial')}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    aria-label="Book a free strategy call to learn about Noryvex AI receptionist"
                  >
                    Book a Free Strategy Call <ArrowRight size={16} />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Why missed calls matter ─────────────────────────────── */}
      <section className="calc-explainer-section">
        <div className="container" style={{ maxWidth: '720px', textAlign: 'center' }}>
          <span className="section-tag" style={{ display: 'block', margin: '0 auto 14px auto' }}>
            About this tool
          </span>
          <h2 className="calc-explainer-title">
            The revenue gap most businesses don't measure
          </h2>
          <p className="calc-explainer-body">
            Most businesses track revenue from sales that happened. Very few track the revenue
            from calls that <em>never got answered</em> — the potential patient who hung up,
            called a competitor, or never called back. This calculator illustrates the scale of
            that invisible gap using only numbers you control. No industry benchmarks, no
            fabricated statistics — just your inputs, the math shown in full, and an honest disclaimer.
          </p>
          <div className="calc-stat-row">
            <div className="calc-stat-item">
              <span className="calc-stat-num">48 hrs</span>
              <span className="calc-stat-desc">to get your AI receptionist live</span>
            </div>
            <div className="calc-stat-divider" aria-hidden="true" />
            <div className="calc-stat-item">
              <span className="calc-stat-num">24 / 7</span>
              <span className="calc-stat-desc">call coverage, no front-desk needed</span>
            </div>
            <div className="calc-stat-divider" aria-hidden="true" />
            <div className="calc-stat-item">
              <span className="calc-stat-num">$0</span>
              <span className="calc-stat-desc">to hear your custom demo first</span>
            </div>
          </div>
          <button
            onClick={() => setActivePage('contact', 'trial')}
            className="btn btn-primary btn-lg"
            style={{ marginTop: '40px' }}
          >
            Get Your Free Clinic Demo <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ── Page styles ─────────────────────────────────────────── */}
      <style>{`

        /* ── Hero ── */
        .calc-hero {
          padding: 80px 0 64px 0;
          border-bottom: 1px solid var(--border-light);
          background: var(--bg-dark);
        }
        .calc-hero-title {
          font-size: clamp(1.9rem, 4.5vw, 3rem);
          font-weight: 800;
          color: var(--text-white);
          line-height: 1.15;
          letter-spacing: -0.025em;
          margin-bottom: 20px;
        }

        /* ── Body section ── */
        .calc-body-section {
          padding: var(--section-padding-desktop) 0;
          background: var(--bg-pure);
        }

        /* ── Two-col grid ── */
        .calc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .calc-grid { grid-template-columns: 1fr; }
        }

        /* ── Shared card heading ── */
        .calc-panel-heading {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-white);
          margin: 0 0 28px 0;
          line-height: 1.3;
        }

        /* ── Inputs card ── */
        .calc-inputs-card {
          padding: 32px;
        }

        /* ── Sticky result ── */
        .calc-result-sticky {
          position: sticky;
          top: 100px;
        }
        .calc-result-card {
          padding: 32px;
          display: flex;
          flex-direction: column;
        }

        /* ── Form fields ── */
        .calc-field {
          margin-bottom: 28px;
        }
        .calc-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-white);
          margin-bottom: 6px;
          font-family: var(--font-sans);
          flex-wrap: wrap;
        }
        .calc-hint {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin: 0 0 12px 0;
          line-height: 1.5;
        }

        /* % badge next to slider label */
        .calc-pct-badge {
          font-size: 0.82rem;
          font-weight: 900;
          color: var(--accent-neon);
          background: var(--accent-neon-glow);
          border: 1px solid var(--accent-neon-border);
          padding: 2px 10px;
          border-radius: 100px;
          font-family: var(--font-display);
          min-width: 3ch;
          text-align: center;
        }

        /* Number input wrapper */
        .calc-input-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-light);
          border-radius: 10px;
          padding: 0 16px;
          transition: border-color 0.2s ease;
        }
        .calc-input-wrap:focus-within {
          border-color: var(--accent-neon);
          box-shadow: 0 0 0 3px rgba(199,255,61,0.06);
        }
        .calc-input-icon {
          color: var(--text-muted);
          flex-shrink: 0;
        }
        .calc-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          color: var(--text-white);
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 700;
          padding: 13px 8px;
          min-width: 0;
        }
        .calc-input::-webkit-outer-spin-button,
        .calc-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .calc-input[type=number] { -moz-appearance: textfield; }
        .calc-input-suffix {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* Slider */
        .calc-slider {
          width: 100%;
          -webkit-appearance: none;
          appearance: none;
          height: 5px;
          border-radius: 100px;
          outline: none;
          cursor: pointer;
          margin-bottom: 8px;
          transition: background 0.1s;
        }
        .calc-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--accent-neon);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(199,255,61,0.55);
          border: 2px solid rgba(0,0,0,0.25);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .calc-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 16px rgba(199,255,61,0.75);
        }
        .calc-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--accent-neon);
          cursor: pointer;
          border: 2px solid rgba(0,0,0,0.25);
          box-shadow: 0 0 10px rgba(199,255,61,0.55);
        }
        .calc-slider-markers {
          display: flex;
          justify-content: space-between;
          font-size: 0.68rem;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 4px;
        }

        /* Dropdown */
        .calc-select-wrap { position: relative; }
        .calc-select {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-light);
          border-radius: 10px;
          padding: 13px 40px 13px 16px;
          color: var(--text-white);
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 500;
          outline: none;
          cursor: pointer;
          -webkit-appearance: none;
          appearance: none;
          transition: border-color 0.2s ease;
        }
        .calc-select:focus { border-color: var(--accent-neon); }
        .calc-select option { background: #121215; color: var(--text-white); }
        .calc-select-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }

        /* ── Big number block ── */
        .calc-big-number-block {
          text-align: center;
          padding: 24px 20px;
          background: var(--bg-dark);
          border: 1px solid var(--border-light);
          border-radius: 12px;
          margin-bottom: 22px;
        }
        .calc-big-label {
          display: block;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 10px;
        }
        .calc-big-number {
          display: block;
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.04em;
          font-family: var(--font-display);
          transition: color 0.3s ease;
        }
        .calc-big-sub {
          display: block;
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-top: 6px;
          font-weight: 500;
        }

        /* ── Breakdown ── */
        .calc-breakdown-heading {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 10px;
        }
        .calc-breakdown {
          background: var(--bg-dark);
          border: 1px solid var(--border-light);
          border-radius: 10px;
          padding: 14px 16px;
        }
        .calc-step {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 4px 0;
        }
        .cs-label {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-family: 'Courier New', monospace;
        }
        .cs-val {
          font-size: 0.8rem;
          color: var(--text-gray);
          font-weight: 600;
          font-family: 'Courier New', monospace;
          text-align: right;
          white-space: nowrap;
        }
        .calc-step-sub .cs-label,
        .calc-step-sub .cs-val {
          color: var(--text-light);
          font-weight: 700;
        }
        .calc-step-final .cs-label,
        .calc-step-final .cs-val {
          font-size: 0.88rem;
          color: var(--text-white);
          font-weight: 800;
        }
        .calc-divider {
          height: 1px;
          background: var(--border-light);
          margin: 8px 0;
        }

        /* ── Disclaimer ── */
        .calc-disclaimer {
          display: flex;
          gap: 9px;
          align-items: flex-start;
          padding: 12px 14px;
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          margin-bottom: 20px;
          margin-top: 4px;
        }
        .calc-disclaimer svg {
          color: var(--text-muted);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .calc-disclaimer p {
          font-size: 0.76rem;
          color: var(--text-muted);
          line-height: 1.55;
          margin: 0;
        }

        /* ── CTA block ── */
        .calc-cta-block {
          padding: 20px;
          background: var(--accent-neon-glow);
          border: 1px solid var(--accent-neon-border);
          border-radius: 10px;
          margin-top: auto;
        }
        .calc-cta-copy {
          font-size: 0.87rem;
          color: var(--text-light);
          margin: 0 0 14px 0;
          line-height: 1.5;
        }

        /* ── Explainer section ── */
        .calc-explainer-section {
          padding: 92px 0;
          background: var(--bg-dark);
          border-top: 1px solid var(--border-light);
        }
        .calc-explainer-title {
          font-size: clamp(1.5rem, 3vw, 2.1rem);
          font-weight: 800;
          color: var(--text-white);
          line-height: 1.2;
          letter-spacing: -0.02em;
          margin-bottom: 18px;
        }
        .calc-explainer-body {
          font-size: 1rem;
          color: var(--text-gray);
          line-height: 1.75;
          margin-bottom: 40px;
        }
        .calc-explainer-body em {
          color: var(--text-light);
          font-style: normal;
          font-weight: 600;
        }

        /* Stats row */
        .calc-stat-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          flex-wrap: wrap;
          padding: 24px 32px;
          background: var(--bg-glass);
          border: 1px solid var(--border-light);
          border-radius: 16px;
        }
        .calc-stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px 28px;
        }
        .calc-stat-num {
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--accent-neon);
          letter-spacing: -0.02em;
          font-family: var(--font-display);
          line-height: 1;
        }
        .calc-stat-desc {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 500;
          text-align: center;
        }
        .calc-stat-divider {
          width: 1px;
          height: 40px;
          background: var(--border-light);
          flex-shrink: 0;
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .calc-inputs-card,
          .calc-result-card { padding: var(--card-padding-mobile); }
          .calc-result-sticky { position: static; }
          .calc-stat-row { padding: 16px 12px; gap: 0; }
          .calc-stat-item { padding: 10px 16px; }
          .calc-stat-divider { display: none; }
          .calc-hero { padding: 56px 0 48px 0; }
          .calc-explainer-section { padding: 60px 0; }
        }

      `}</style>
    </div>
  );
}
