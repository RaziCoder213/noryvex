import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar, Clock, MessageCircle, Users, CheckCircle, CheckCircle2,
  ChevronLeft, Globe, ArrowRight, Zap, Shield, AlertCircle, Lock,
  Mail
} from 'lucide-react';
import { dbSaveMeeting } from '../utils/dbHelper';

// ── Update these when ready ──────────────────────────────
const WHATSAPP_NUMBER = '+13478884099'; // TODO: update with real number
const WHATSAPP_MSG    = encodeURIComponent("Hi! I'm interested in Noryvex's AI receptionist for my dental clinic.");
const WHATSAPP_LINK   = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;
const SLACK_LINK      = 'https://join.slack.com/t/noryvex/shared_invite/placeholder'; // TODO: update

// ── Calendar config ──────────────────────────────────────
// Business hours in America/New_York; 9 AM – 4 PM start (last slot = 4–5 PM)
const SLOT_HOURS_NY = [9, 10, 11, 12, 13, 14, 15, 16];
const AHEAD_DAYS    = 14; // rolling 14-business-day window
const BOOKED_KEY    = 'noryvex_booked_slots_v2';

// ── Timezone / date helpers ──────────────────────────────
const padZ = (n) => String(n).padStart(2, '0');

const toDateStr = (d) =>
  `${d.getFullYear()}-${padZ(d.getMonth() + 1)}-${padZ(d.getDate())}`;

const getBusinessDays = (n = AHEAD_DAYS) => {
  const days = [];
  const cur  = new Date();
  cur.setDate(cur.getDate() + 1);
  while (days.length < n) {
    if (cur.getDay() !== 0 && cur.getDay() !== 6) days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
};

/**
 * Get the UTC-offset (in whole hours) that America/New_York uses on dateStr.
 * Handles DST correctly via Intl.DateTimeFormat.
 */
const getNYOffsetH = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const midnight  = new Date(Date.UTC(y, m - 1, d));
  const h = parseInt(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      hour: 'numeric',
      hour12: false,
    }).format(midnight),
    10
  );
  return h >= 12 ? -(24 - h) : h; // e.g. 20 → -4 (EDT), 19 → -5 (EST)
};

/** Create a JS Date that represents `hour24:00` in New York on `dateStr`. */
const makeNYSlot = (dateStr, hour24) => {
  const off  = getNYOffsetH(dateStr);
  const sign = off < 0 ? '-' : '+';
  const abs  = padZ(Math.abs(off));
  return new Date(`${dateStr}T${padZ(hour24)}:00:00${sign}${abs}:00`);
};

const tzFmt = (date, tz, opts) =>
  new Intl.DateTimeFormat('en-US', { timeZone: tz, ...opts }).format(date);

// ── Booked-slots persistence (localStorage) ──────────────
const loadBooked = () => {
  try {
    const raw    = localStorage.getItem(BOOKED_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const cutoff = Date.now() - 45 * 86_400_000; // purge entries older than 45 days
    return Object.fromEntries(Object.entries(parsed).filter(([, v]) => v > cutoff));
  } catch { return {}; }
};

const persistBooked = (dateStr, hour24) => {
  const slots = loadBooked();
  slots[`${dateStr}|${hour24}`] = Date.now();
  try { localStorage.setItem(BOOKED_KEY, JSON.stringify(slots)); } catch { /* ignore */ }
};

// ── Static data ──────────────────────────────────────────
const DAY_ABBR    = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CONTACT_OPTIONS = [
  {
    id:      'calendar',
    icon:    <Calendar size={28} />,
    label:   'Book a Strategy Call',
    desc:    'Pick a time that works for you. 30-min free strategy call with our founder.',
    cta:     'See Available Times',
    primary: true,
    soon:    false,
  },
  {
    id:      'whatsapp',
    icon:    <MessageCircle size={28} />,
    label:   'Chat on WhatsApp',
    desc:    'Prefer text? Send us a message on WhatsApp and we\'ll reply within a few hours.',
    cta:     'Open WhatsApp',
    primary: false,
    soon:    false,
    href:    WHATSAPP_LINK,
  },
  {
    id:      'slack',
    icon:    <Users size={28} />,
    label:   'Join our Slack',
    desc:    'Connect with the team in our community Slack for quick answers and updates.',
    cta:     'Join Slack Channel',
    primary: false,
    soon:    false,
    href:    SLACK_LINK,
  },
  {
    id:      'live-agent',
    icon:    <Zap size={28} />,
    label:   'Live Agent Support',
    desc:    'Real-time 1-on-1 chat with a Noryvex team member — coming very soon.',
    cta:     'Coming Soon',
    primary: false,
    soon:    true,
  },
];

// ── Component ────────────────────────────────────────────
export default function Contact({ addToast }) {
  const [option,       setOption]       = useState('calendar');
  const [userTz,       setUserTz]       = useState('');
  const [step,         setStep]         = useState('pick-date'); // 'pick-date'|'pick-slot'|'form'|'success'
  const [selectedDate, setSelectedDate] = useState(null);       // 'YYYY-MM-DD'
  const [selectedSlot, setSelectedSlot] = useState(null);       // slot object
  const [bookedMap,    setBookedMap]    = useState({});
  const [form,         setForm]         = useState({ name: '', email: '', phone: '', company: '', notes: '' });
  const [submitting,   setSubmitting]   = useState(false);

  useEffect(() => {
    setUserTz(Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York');
    setBookedMap(loadBooked());
  }, []);

  // Pre-compute the 14 business days once
  const businessDays = useMemo(() => getBusinessDays(), []);

  // Re-compute slots whenever date, booked map, or user timezone changes
  const slots = useMemo(() => {
    if (!selectedDate || !userTz) return [];
    return SLOT_HOURS_NY.map((h24) => {
      const slotDate = makeNYSlot(selectedDate, h24);
      const key      = `${selectedDate}|${h24}`;
      return {
        h24,
        key,
        date:     slotDate,
        isBooked: !!bookedMap[key],
        isPast:   slotDate < new Date(),
        local:    tzFmt(slotDate, userTz, { hour: 'numeric', minute: '2-digit', hour12: true }),
        ny:       tzFmt(slotDate, 'America/New_York', { hour: 'numeric', minute: '2-digit', hour12: true }),
      };
    });
  }, [selectedDate, bookedMap, userTz]);

  const pickDate = (dateStr) => {
    setSelectedDate(dateStr);
    setStep('pick-slot');
  };

  const pickSlot = (slot) => {
    if (slot.isBooked || slot.isPast) return;
    setSelectedSlot(slot);
    setStep('form');
  };

  const goBack = () => {
    if (step === 'form')      { setStep('pick-slot'); setSelectedSlot(null); }
    else if (step === 'pick-slot') { setStep('pick-date'); setSelectedDate(null); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      addToast('Name and email are required.', 'error');
      return;
    }
    setSubmitting(true);

    const dateLabel = tzFmt(selectedSlot.date, userTz, {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    });

    const result = await dbSaveMeeting({
      name:    form.name,
      email:   form.email,
      company: form.company,
      phone:   form.phone,
      date:    dateLabel,
      time:    `${selectedSlot.local} your time  ·  ${selectedSlot.ny} EST`,
      notes:   form.notes,
    });

    setSubmitting(false);

    if (result.success) {
      persistBooked(selectedDate, selectedSlot.h24);
      setBookedMap(loadBooked());
      setStep('success');
    } else {
      addToast(result.error || 'Booking failed — please try again.', 'error');
    }
  };

  const resetFlow = () => {
    setStep('pick-date');
    setSelectedDate(null);
    setSelectedSlot(null);
    setForm({ name: '', email: '', phone: '', company: '', notes: '' });
  };

  const tzAbbr = userTz
    ? new Intl.DateTimeFormat('en-US', { timeZone: userTz, timeZoneName: 'short' })
        .formatToParts(new Date())
        .find((p) => p.type === 'timeZoneName')?.value ?? userTz
    : '';

  // ── Render ────────────────────────────────────────────
  return (
    <div className="contact-page page-enter">

      {/* Hero */}
      <section className="contact-hero" style={{
        padding: 'var(--hero-padding-top-desktop) 0 var(--hero-padding-bottom-desktop) 0',
        background: 'linear-gradient(180deg, var(--bg-dark) 0%, var(--bg-pure) 100%)',
        borderBottom: '1px solid var(--border-light)',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-tag txt-slide" style={{ margin: '0 auto 16px auto' }}>GET IN TOUCH</span>
          <h1 className="contact-title txt-reveal" style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '16px' }}>
            Connect with Noryvex
          </h1>
          <p className="contact-subtitle txt-blur-in" style={{
            maxWidth: '620px', margin: '0 auto',
            fontSize: '1.1rem', color: 'var(--text-gray)', lineHeight: '1.65',
          }}>
            Choose how you'd like to reach us. All paths lead to the same result — an AI receptionist that answers every dental patient call.
          </p>
        </div>
      </section>

      {/* Contact option cards */}
      <section style={{ padding: '60px 0 40px', background: 'var(--bg-pure)' }}>
        <div className="container">
          <div className="contact-options-grid">
            {CONTACT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                id={`contact-option-${opt.id}`}
                disabled={opt.soon}
                onClick={() => {
                  if (opt.href) { window.open(opt.href, '_blank', 'noopener,noreferrer'); return; }
                  setOption(opt.id);
                }}
                className={`contact-opt-card glass-card ${opt.id === option && !opt.soon ? 'opt-active' : ''} ${opt.soon ? 'opt-soon' : ''}`}
              >
                <div className={`opt-icon-wrap ${opt.primary ? 'opt-icon-primary' : ''}`}>
                  {opt.icon}
                </div>
                <div>
                  <h3 className="opt-label">{opt.label}</h3>
                  <p className="opt-desc">{opt.desc}</p>
                </div>
                <div className="opt-cta-row">
                  {opt.soon
                    ? <span className="badge-soon">Coming Soon</span>
                    : <span className="opt-cta-link">{opt.cta} <ArrowRight size={14} /></span>
                  }
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Calendar panel — only when "Book a Strategy Call" is selected */}
      {option === 'calendar' && (
        <section id="booking-calendar" style={{
          padding: '0 0 80px', background: 'var(--bg-pure)',
        }}>
          <div className="container">
            <div className="calendar-panel glass-card">

              {/* Panel header */}
              <div className="cal-header">
                <div>
                  <h2 className="cal-title">
                    {step === 'pick-date' && 'Select a Date'}
                    {step === 'pick-slot' && 'Pick a Time Slot'}
                    {step === 'form'      && 'Confirm Your Booking'}
                    {step === 'success'   && 'Booking Confirmed!'}
                  </h2>
                  {userTz && step !== 'success' && (
                    <p className="cal-tz">
                      <Globe size={13} />
                      Times shown in <strong>{tzAbbr}</strong> ({userTz}) &nbsp;·&nbsp; Business hours: 9 AM – 5 PM EST
                    </p>
                  )}
                </div>
                {(step === 'pick-slot' || step === 'form') && (
                  <button className="cal-back-btn btn btn-secondary" onClick={goBack}>
                    <ChevronLeft size={16} /> Back
                  </button>
                )}
              </div>

              {/* ── Step 1: Date picker ── */}
              {step === 'pick-date' && (
                <div>
                  <p className="cal-hint">Showing the next {AHEAD_DAYS} business days (Mon–Fri, weekends excluded).</p>
                  <div className="date-grid">
                    {businessDays.map((d) => {
                      const ds  = toDateStr(d);
                      const dow = DAY_ABBR[d.getDay()];
                      const mon = MONTH_NAMES[d.getMonth()];
                      const day = d.getDate();
                      return (
                        <button
                          key={ds}
                          id={`date-${ds}`}
                          className={`date-btn ${selectedDate === ds ? 'date-active' : ''}`}
                          onClick={() => pickDate(ds)}
                        >
                          <span className="date-dow">{dow}</span>
                          <span className="date-num">{day}</span>
                          <span className="date-mon">{mon}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Step 2: Time-slot picker ── */}
              {step === 'pick-slot' && (
                <div>
                  <p className="cal-hint">
                    Showing slots for <strong>{
                      (() => {
                        const d = new Date(selectedDate + 'T12:00:00');
                        return `${DAY_ABBR[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
                      })()
                    }</strong>.
                    {' '}Greyed-out slots are already taken.
                  </p>
                  <div className="slot-grid">
                    {slots.map((slot) => {
                      const unavail = slot.isBooked || slot.isPast;
                      return (
                        <button
                          key={slot.key}
                          id={`slot-${slot.key}`}
                          className={`slot-btn ${unavail ? 'slot-unavail' : ''} ${selectedSlot?.key === slot.key ? 'slot-active' : ''}`}
                          onClick={() => pickSlot(slot)}
                          disabled={unavail}
                          title={unavail ? (slot.isPast ? 'This time has passed' : 'Already booked') : ''}
                        >
                          <span className="slot-local">{slot.local}</span>
                          <span className="slot-ny">{slot.ny} EST</span>
                          {unavail && (
                            <span className="slot-badge-booked">
                              {slot.isPast ? 'Past' : 'Booked'}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <p className="cal-note">
                    <Shield size={13} /> All times are private 30-minute Zoom calls. A confirmation link will be emailed to you.
                  </p>
                </div>
              )}

              {/* ── Step 3: Booking form ── */}
              {step === 'form' && selectedSlot && (
                <div>
                  {/* Selected slot summary */}
                  <div className="slot-summary">
                    <Clock size={16} className="icon-neon" />
                    <span>
                      <strong>{tzFmt(selectedSlot.date, userTz, { weekday: 'long', month: 'long', day: 'numeric' })}</strong>
                      {' · '}
                      {selectedSlot.local} ({tzAbbr}) &nbsp;/&nbsp; {selectedSlot.ny} EST
                    </span>
                  </div>

                  <form onSubmit={handleSubmit} className="booking-form">
                    <div className="bf-row">
                      <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input
                          type="text" required
                          className="form-control"
                          placeholder="Dr. Jane Smith"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email *</label>
                        <input
                          type="email" required
                          className="form-control"
                          placeholder="jane@clinic.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="bf-row">
                      <div className="form-group">
                        <label className="form-label">Clinic / Company</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Bright Dental"
                          value={form.company}
                          onChange={(e) => setForm({ ...form, company: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          className="form-control"
                          placeholder="+1 (555) 000-0000"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Anything you'd like us to know?</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="e.g. Current call volume, which scheduling software you use, specific goals…"
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn btn-primary"
                        style={{ minWidth: 200 }}
                      >
                        {submitting ? 'Confirming…' : 'Confirm Booking'}
                      </button>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                        <Shield size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                        Your info is never shared or sold.
                      </p>
                    </div>
                  </form>
                </div>
              )}

              {/* ── Step 4: Success ── */}
              {step === 'success' && (
                <div className="booking-success">
                  <div className="success-icon-ring">
                    <CheckCircle size={44} />
                  </div>
                  <h3>You're on the calendar!</h3>
                  <p>
                    We've received your booking for <strong>{tzFmt(selectedSlot.date, userTz, { weekday: 'long', month: 'long', day: 'numeric' })}</strong> at <strong>{selectedSlot.local} ({tzAbbr})</strong>.<br />
                    A confirmation email will be sent to <strong>{form.email}</strong> within the hour.
                  </p>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button onClick={resetFlow} className="btn btn-outline-neon">
                      Book Another Slot
                    </button>
                    <a href="/solutions" className="btn btn-secondary">
                      Explore Solutions
                    </a>
                  </div>
                </div>
              )}

            </div>{/* /.calendar-panel */}
          </div>
        </section>
      )}

      {/* Trust strip */}
      <section style={{
        padding: '40px 0',
        background: 'var(--bg-dark)',
        borderTop: '1px solid var(--border-light)',
      }}>
        <div className="container">
          <div className="contact-trust-strip">
            {[
              { icon: <Shield size={18} />, text: 'HIPAA Compliant' },
              { icon: <CheckCircle2 size={18} />, text: 'No Credit Card Required' },
              { icon: <Clock size={18} />, text: '48-Hour Setup' },
              { icon: <Mail size={18} />, text: 'Direct Founder Access' },
            ].map((t, i) => (
              <div key={i} className="trust-item">
                <span className="icon-neon">{t.icon}</span>
                <span>{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        /* ── Option cards ── */
        .contact-options-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .contact-opt-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 28px 24px;
          text-align: left;
          cursor: pointer;
          border: 1px solid var(--border-light);
          border-radius: 16px;
          background: rgba(255,255,255,0.02);
          transition: border-color 0.2s, transform 0.15s, background 0.2s;
          position: relative;
          width: 100%;
        }
        .contact-opt-card:hover:not(.opt-soon) {
          border-color: rgba(199,255,61,0.3);
          background: rgba(199,255,61,0.02);
          transform: translateY(-2px);
        }
        .contact-opt-card.opt-active {
          border-color: var(--accent-neon-border);
          background: rgba(199,255,61,0.04);
          box-shadow: 0 0 24px rgba(199,255,61,0.06);
        }
        .contact-opt-card.opt-soon {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .opt-icon-wrap {
          width: 52px; height: 52px;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-light);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-gray);
          flex-shrink: 0;
        }
        .opt-icon-primary { background: rgba(199,255,61,0.08); border-color: rgba(199,255,61,0.2); color: var(--accent-neon); }
        .opt-label { font-size: 1rem; font-weight: 700; color: var(--text-white); margin-bottom: 6px; }
        .opt-desc  { font-size: 0.83rem; color: var(--text-gray); line-height: 1.5; margin: 0; }
        .opt-cta-row { margin-top: auto; }
        .opt-cta-link {
          font-size: 0.82rem; font-weight: 600;
          color: var(--accent-neon);
          display: inline-flex; align-items: center; gap: 5px;
        }
        .badge-soon {
          font-size: 0.72rem; font-weight: 700;
          padding: 3px 10px;
          border-radius: 20px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border-light);
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* ── Calendar panel ── */
        .calendar-panel {
          padding: 40px;
          max-width: 900px;
          margin: 0 auto;
        }
        .cal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 28px;
          gap: 16px;
        }
        .cal-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-white);
          margin: 0 0 6px 0;
        }
        .cal-tz {
          font-size: 0.8rem;
          color: var(--text-muted);
          display: flex; align-items: center; gap: 6px;
          margin: 0;
        }
        .cal-hint {
          font-size: 0.85rem;
          color: var(--text-gray);
          margin: 0 0 20px 0;
        }
        .cal-back-btn { flex-shrink: 0; }
        .cal-note {
          font-size: 0.78rem;
          color: var(--text-muted);
          display: flex; align-items: center; gap: 6px;
          margin: 18px 0 0;
        }

        /* ── Date grid ── */
        .date-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 10px;
        }
        .date-btn {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 2px;
          padding: 14px 8px;
          border: 1px solid var(--border-light);
          border-radius: 12px;
          background: rgba(255,255,255,0.02);
          cursor: pointer;
          transition: all 0.15s;
        }
        .date-btn:hover {
          border-color: rgba(199,255,61,0.3);
          background: rgba(199,255,61,0.03);
        }
        .date-btn.date-active {
          border-color: var(--accent-neon);
          background: rgba(199,255,61,0.08);
        }
        .date-dow { font-size: 0.65rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.07em; }
        .date-num { font-size: 1.2rem; font-weight: 800; color: var(--text-white); line-height: 1.1; }
        .date-mon { font-size: 0.65rem; color: var(--text-muted); }
        .date-btn.date-active .date-dow,
        .date-btn.date-active .date-mon { color: rgba(199,255,61,0.7); }
        .date-btn.date-active .date-num  { color: var(--accent-neon); }

        /* ── Slot grid ── */
        .slot-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .slot-btn {
          position: relative;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 4px;
          padding: 16px 10px;
          border: 1px solid var(--border-light);
          border-radius: 12px;
          background: rgba(255,255,255,0.02);
          cursor: pointer;
          transition: all 0.15s;
        }
        .slot-btn:hover:not(.slot-unavail) {
          border-color: rgba(199,255,61,0.3);
          background: rgba(199,255,61,0.04);
        }
        .slot-btn.slot-active {
          border-color: var(--accent-neon);
          background: rgba(199,255,61,0.08);
        }
        .slot-btn.slot-unavail {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .slot-local { font-size: 0.95rem; font-weight: 700; color: var(--text-white); }
        .slot-ny    { font-size: 0.72rem; color: var(--text-muted); }
        .slot-badge-booked {
          position: absolute;
          top: 6px; right: 8px;
          font-size: 0.6rem; font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        /* ── Slot summary bar ── */
        .slot-summary {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 18px;
          border-radius: 10px;
          background: rgba(199,255,61,0.04);
          border: 1px solid rgba(199,255,61,0.12);
          font-size: 0.9rem;
          color: var(--text-light);
          margin-bottom: 28px;
        }

        /* ── Booking form ── */
        .booking-form { display: flex; flex-direction: column; gap: 0; }
        .bf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        /* ── Success state ── */
        .booking-success {
          text-align: center;
          padding: 48px 24px;
          display: flex; flex-direction: column;
          align-items: center; gap: 16px;
        }
        .success-icon-ring {
          width: 80px; height: 80px;
          border-radius: 50%;
          background: rgba(199,255,61,0.08);
          border: 2px solid rgba(199,255,61,0.3);
          display: flex; align-items: center; justify-content: center;
          color: var(--accent-neon);
          animation: float 3s ease-in-out infinite;
        }
        .booking-success h3 { font-size: 1.6rem; margin: 0; }
        .booking-success p  { color: var(--text-gray); line-height: 1.65; max-width: 480px; margin: 0; }

        /* ── Trust strip ── */
        .contact-trust-strip {
          display: flex; flex-wrap: wrap;
          gap: 32px; justify-content: center;
        }
        .trust-item {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.85rem; color: var(--text-gray); font-weight: 500;
        }

        /* ── Responsive ── */
        @media (max-width: 1200px) {
          .contact-options-grid { grid-template-columns: repeat(2, 1fr); }
          .date-grid { grid-template-columns: repeat(5, 1fr); }
        }
        @media (max-width: 900px) {
          .slot-grid { grid-template-columns: repeat(3, 1fr); }
          .calendar-panel { padding: 28px 20px; }
        }
        @media (max-width: 768px) {
          .contact-hero { padding-top: var(--hero-padding-top-mobile) !important; padding-bottom: var(--hero-padding-bottom-mobile) !important; }
          .contact-title { font-size: clamp(2rem, 8vw, 2.6rem) !important; }
          .contact-options-grid { grid-template-columns: 1fr; }
          .date-grid { grid-template-columns: repeat(4, 1fr); gap: 8px; }
          .slot-grid { grid-template-columns: repeat(2, 1fr); }
          .bf-row { grid-template-columns: 1fr; }
          .cal-header { flex-direction: column; }
        }
        @media (max-width: 480px) {
          .date-grid { grid-template-columns: repeat(3, 1fr); }
          .contact-trust-strip { gap: 20px; flex-direction: column; align-items: center; }
        }
      `}</style>
    </div>
  );
}
