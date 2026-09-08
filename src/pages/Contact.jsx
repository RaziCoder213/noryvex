import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar, Clock, CheckCircle, CheckCircle2,
  ChevronLeft, ArrowRight, Shield, Lock, Mail, Phone,
  User, Building2
} from 'lucide-react';
import { dbSaveMeeting, dbSaveContact } from '../utils/dbHelper';

// ── Calendar config ──────────────────────────────────────
const SLOT_HOURS_NY = [9, 10, 11, 12, 13, 14, 15, 16];
const AHEAD_DAYS    = 14;
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
  return h >= 12 ? -(24 - h) : h;
};

const makeNYSlot = (dateStr, hour24) => {
  const off  = getNYOffsetH(dateStr);
  const sign = off < 0 ? '-' : '+';
  const abs  = padZ(Math.abs(off));
  return new Date(`${dateStr}T${padZ(hour24)}:00:00${sign}${abs}:00`);
};

const tzFmt = (date, tz, opts) =>
  new Intl.DateTimeFormat('en-US', { timeZone: tz, ...opts }).format(date);

const loadBooked = () => {
  try {
    const raw = localStorage.getItem(BOOKED_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const cutoff = Date.now() - 45 * 86_400_000;
    return Object.fromEntries(Object.entries(parsed).filter(([, v]) => v > cutoff));
  } catch { return {}; }
};

const persistBooked = (dateStr, hour24) => {
  const slots = loadBooked();
  slots[`${dateStr}|${hour24}`] = Date.now();
  try { localStorage.setItem(BOOKED_KEY, JSON.stringify(slots)); } catch {}
};

const DAY_ABBR    = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ── Component ────────────────────────────────────────────
export default function Contact({ addToast, initialTab }) {
  const [activeView, setActiveView] = useState(initialTab === 'trial' ? 'form' : 'calendar');
  const [userTz, setUserTz] = useState('');
  const [step, setStep] = useState('pick-date');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookedMap, setBookedMap] = useState({});
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', pms: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setUserTz(Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York');
    setBookedMap(loadBooked());
  }, []);

  const businessDays = useMemo(() => getBusinessDays(), []);

  const slotsForDay = useMemo(() => {
    if (!selectedDate || !userTz) return [];
    return SLOT_HOURS_NY.map(h => {
      const dt = makeNYSlot(selectedDate, h);
      const key = `${selectedDate}|${h}`;
      return {
        hour24: h,
        dateObj: dt,
        labelNY: tzFmt(dt, 'America/New_York', { hour: 'numeric', minute: '2-digit', hour12: true }),
        labelLocal: userTz !== 'America/New_York' ? tzFmt(dt, userTz, { hour: 'numeric', minute: '2-digit', hour12: true }) : null,
        booked: !!bookedMap[key],
        past: dt.getTime() < Date.now(),
      };
    });
  }, [selectedDate, userTz, bookedMap]);

  // ── Submit contact/demo request form ────────────────────
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setSubmitting(true);
    try {
      await dbSaveContact({
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        service: form.pms,
        message: form.message || 'Demo request from contact page',
      });
      setSubmitted(true);
      if (addToast) addToast('Request submitted! We\'ll be in touch within 24 hours.', 'success');
    } catch (err) {
      if (addToast) addToast('Something went wrong. Please try again or email us directly.', 'error');
    }
    setSubmitting(false);
  };

  // ── Submit calendar booking ─────────────────────────────
  const handleBooking = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !selectedSlot) return;
    setSubmitting(true);
    try {
      const dateLabel = tzFmt(selectedSlot.dateObj, 'America/New_York', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      await dbSaveMeeting({
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        date: dateLabel,
        time: selectedSlot.labelNY + ' ET',
        notes: form.message,
      });
      persistBooked(selectedDate, selectedSlot.hour24);
      setBookedMap(loadBooked());
      setStep('success');
      if (addToast) addToast('Strategy call booked! Check your email for confirmation.', 'success');
    } catch (err) {
      if (addToast) addToast('Booking failed. Please try again.', 'error');
    }
    setSubmitting(false);
  };

  return (
    <div className="home-page-container">
      <section className="framer-hero" style={{ padding: 'var(--hero-padding-top) 0 36px 0' }}>
        <div className="container framer-hero-content">
          <h1 className="framer-hero-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Let's get your practice set up.
          </h1>
          <p className="framer-hero-desc" style={{ maxWidth: '560px' }}>
            Request your free custom clinic demo or book a call with our AI architect. No commitment, no credit card.
          </p>
        </div>
      </section>

      <section className="container" style={{ padding: '0 0 var(--section-padding) 0' }}>
        {/* View switcher */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '40px' }}>
          <button
            onClick={() => { setActiveView('form'); setSubmitted(false); }}
            className={`framer-tab-btn ${activeView === 'form' ? 'active' : ''}`}
          >
            <Mail size={16} /> Request Demo
          </button>
          <button
            onClick={() => { setActiveView('calendar'); setStep('pick-date'); }}
            className={`framer-tab-btn ${activeView === 'calendar' ? 'active' : ''}`}
          >
            <Calendar size={16} /> Book a Call
          </button>
        </div>

        {/* ── DEMO REQUEST FORM ──────────────────────────── */}
        {activeView === 'form' && !submitted && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', maxWidth: '900px', margin: '0 auto' }}>
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="contact-field">
                <label>Your name *</label>
                <div className="contact-input-wrap">
                  <User size={16} className="contact-input-icon" />
                  <input
                    type="text" placeholder="Dr. Sarah Mitchell"
                    value={form.name} onChange={e => setForm({...form, name: e.target.value})} required
                  />
                </div>
              </div>
              <div className="contact-field">
                <label>Work email *</label>
                <div className="contact-input-wrap">
                  <Mail size={16} className="contact-input-icon" />
                  <input
                    type="email" placeholder="sarah@smilecare.com"
                    value={form.email} onChange={e => setForm({...form, email: e.target.value})} required
                  />
                </div>
              </div>
              <div className="contact-field">
                <label>Practice phone</label>
                <div className="contact-input-wrap">
                  <Phone size={16} className="contact-input-icon" />
                  <input
                    type="tel" placeholder="(555) 123-4567"
                    value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="contact-field">
                <label>Practice / Clinic name</label>
                <div className="contact-input-wrap">
                  <Building2 size={16} className="contact-input-icon" />
                  <input
                    type="text" placeholder="Smile Care Dental"
                    value={form.company} onChange={e => setForm({...form, company: e.target.value})}
                  />
                </div>
              </div>
              <div className="contact-field">
                <label>Practice management system</label>
                <select
                  value={form.pms} onChange={e => setForm({...form, pms: e.target.value})}
                  style={{
                    width: '100%', padding: '12px 14px',
                    background: 'var(--bg-input)', border: '1px solid var(--border-light)',
                    borderRadius: '10px', color: 'var(--text-light)', fontSize: '0.95rem',
                    fontFamily: 'var(--font-sans)', outline: 'none', appearance: 'none',
                  }}
                >
                  <option value="">Select your PMS (optional)</option>
                  <option value="Dentrix">Dentrix</option>
                  <option value="Eaglesoft">Eaglesoft</option>
                  <option value="Open Dental">Open Dental</option>
                  <option value="Curve Dental">Curve Dental</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="contact-field">
                <label>Anything else?</label>
                <textarea
                  placeholder="Tell us about your practice or what you need..."
                  value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                  rows={3}
                  style={{
                    width: '100%', padding: '12px 14px',
                    background: 'var(--bg-input)', border: '1px solid var(--border-light)',
                    borderRadius: '10px', color: 'var(--text-light)', fontSize: '0.95rem',
                    fontFamily: 'var(--font-sans)', outline: 'none', resize: 'vertical',
                  }}
                />
              </div>
              <button type="submit" className="btn-framer-primary" disabled={submitting} style={{ width: '100%', marginTop: '8px' }}>
                {submitting ? 'Sending...' : 'Request My Practice Demo →'}
              </button>
            </form>

            {/* Right column — trust & founder */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{
                background: 'var(--bg-dark)', border: '1px solid var(--border-light)',
                borderRadius: '16px', padding: '28px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <img src="/logo.png" alt="Noryvex" style={{ width: '44px', height: '44px', borderRadius: '12px' }} />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-white)', fontSize: '1rem' }}>Muhammad Razi</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Lead AI Architect</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-gray)', lineHeight: 1.6 }}>
                  "You'll talk directly with me — not a sales rep. I'll personally review your clinic's needs and build your custom AI receptionist demo."
                </p>
              </div>

              <div style={{
                background: 'var(--bg-dark)', border: '1px solid var(--border-light)',
                borderRadius: '16px', padding: '24px',
              }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-white)', marginBottom: '16px' }}>
                  What happens next:
                </div>
                {[
                  'We review your practice details within 24 hours',
                  'Build your custom AI receptionist prototype',
                  'You call and test it with your team',
                  'Go live when you\'re ready — we handle everything'
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--accent-neon)', marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-gray)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {[
                  { icon: <Shield size={14} />, label: 'HIPAA Compliant' },
                  { icon: <Lock size={14} />, label: 'No Credit Card' },
                  { icon: <Clock size={14} />, label: '48-Hour Setup' },
                ].map((badge, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '6px 12px', background: 'var(--accent-neon-subtle)',
                    border: '1px solid var(--accent-neon-border)', borderRadius: '8px',
                    fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent-neon)',
                  }}>
                    {badge.icon} {badge.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── FORM SUCCESS ───────────────────────────────── */}
        {activeView === 'form' && submitted && (
          <div style={{ textAlign: 'center', maxWidth: '480px', margin: '0 auto', padding: '48px 0' }}>
            <CheckCircle size={48} style={{ color: 'var(--accent-neon)', marginBottom: '20px' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-white)', marginBottom: '12px' }}>
              Request received!
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-gray)', lineHeight: 1.6, marginBottom: '28px' }}>
              We'll review your details and get back to you within 24 hours with your custom clinic demo.
            </p>
            <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', company: '', pms: '', message: '' }); }} className="btn-framer-secondary">
              Submit another request
            </button>
          </div>
        )}

        {/* ── CALENDAR BOOKING ───────────────────────────── */}
        {activeView === 'calendar' && step === 'pick-date' && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-white)', marginBottom: '8px', textAlign: 'center' }}>
              Pick a date
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '28px' }}>
              30-minute strategy call with Muhammad Razi · All times in Eastern
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
              {businessDays.map(d => {
                const ds = toDateStr(d);
                return (
                  <button key={ds} onClick={() => { setSelectedDate(ds); setStep('pick-slot'); }}
                    style={{
                      padding: '14px 8px', background: 'var(--bg-dark)',
                      border: '1px solid var(--border-light)', borderRadius: '12px',
                      color: 'var(--text-white)', cursor: 'pointer', textAlign: 'center',
                      transition: 'border-color 0.2s, transform 0.2s',
                      fontFamily: 'var(--font-sans)',
                    }}
                    onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(199,255,61,0.35)'}
                    onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                  >
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px' }}>
                      {DAY_ABBR[d.getDay()]}
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{d.getDate()}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {MONTH_NAMES[d.getMonth()]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeView === 'calendar' && step === 'pick-slot' && (
          <div style={{ maxWidth: '480px', margin: '0 auto' }}>
            <button onClick={() => setStep('pick-date')} style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              background: 'transparent', border: 'none', color: 'var(--text-muted)',
              fontSize: '0.85rem', cursor: 'pointer', marginBottom: '20px',
              fontFamily: 'var(--font-sans)',
            }}>
              <ChevronLeft size={16} /> Change date
            </button>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-white)', marginBottom: '20px' }}>
              Available times · {selectedDate && (() => { const [y,m,d] = selectedDate.split('-').map(Number); const dt = new Date(y,m-1,d); return `${DAY_ABBR[dt.getDay()]}, ${MONTH_NAMES[dt.getMonth()]} ${d}`; })()}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {slotsForDay.map(slot => {
                const disabled = slot.booked || slot.past;
                const selected = selectedSlot?.hour24 === slot.hour24;
                return (
                  <button key={slot.hour24} disabled={disabled}
                    onClick={() => { setSelectedSlot(slot); setStep('form'); }}
                    style={{
                      padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: selected ? 'var(--accent-neon-subtle)' : 'var(--bg-dark)',
                      border: `1px solid ${selected ? 'var(--accent-neon-border)' : 'var(--border-light)'}`,
                      borderRadius: '12px', color: disabled ? 'var(--text-muted)' : 'var(--text-white)',
                      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
                      transition: 'border-color 0.2s', fontFamily: 'var(--font-sans)',
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{slot.labelNY} ET</span>
                    {slot.labelLocal && <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{slot.labelLocal} local</span>}
                    {slot.booked && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Booked</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeView === 'calendar' && step === 'form' && (
          <div style={{ maxWidth: '480px', margin: '0 auto' }}>
            <button onClick={() => setStep('pick-slot')} style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              background: 'transparent', border: 'none', color: 'var(--text-muted)',
              fontSize: '0.85rem', cursor: 'pointer', marginBottom: '20px',
              fontFamily: 'var(--font-sans)',
            }}>
              <ChevronLeft size={16} /> Change time
            </button>

            {selectedSlot && (
              <div style={{
                padding: '14px 18px', background: 'var(--accent-neon-subtle)',
                border: '1px solid var(--accent-neon-border)', borderRadius: '12px',
                marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <Calendar size={18} style={{ color: 'var(--accent-neon)' }} />
                <span style={{ color: 'var(--text-white)', fontWeight: 600, fontSize: '0.92rem' }}>
                  {selectedSlot.labelNY} ET · {(() => { const [y,m,d] = selectedDate.split('-').map(Number); const dt = new Date(y,m-1,d); return `${DAY_ABBR[dt.getDay()]}, ${MONTH_NAMES[dt.getMonth()]} ${d}`; })()}
                </span>
              </div>
            )}

            <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="contact-field">
                <label>Full name *</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required
                  placeholder="Dr. Sarah Mitchell"
                  style={{ width: '100%', padding: '12px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: '10px', color: 'var(--text-light)', fontSize: '0.95rem', fontFamily: 'var(--font-sans)', outline: 'none' }}
                />
              </div>
              <div className="contact-field">
                <label>Email *</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required
                  placeholder="sarah@smilecare.com"
                  style={{ width: '100%', padding: '12px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: '10px', color: 'var(--text-light)', fontSize: '0.95rem', fontFamily: 'var(--font-sans)', outline: 'none' }}
                />
              </div>
              <div className="contact-field">
                <label>Clinic name</label>
                <input type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})}
                  placeholder="Smile Care Dental"
                  style={{ width: '100%', padding: '12px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: '10px', color: 'var(--text-light)', fontSize: '0.95rem', fontFamily: 'var(--font-sans)', outline: 'none' }}
                />
              </div>
              <div className="contact-field">
                <label>Notes (optional)</label>
                <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                  placeholder="Anything you'd like to discuss?"
                  rows={3}
                  style={{ width: '100%', padding: '12px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-light)', borderRadius: '10px', color: 'var(--text-light)', fontSize: '0.95rem', fontFamily: 'var(--font-sans)', outline: 'none', resize: 'vertical' }}
                />
              </div>
              <button type="submit" className="btn-framer-primary" disabled={submitting} style={{ width: '100%' }}>
                {submitting ? 'Booking...' : 'Confirm Strategy Call →'}
              </button>
            </form>
          </div>
        )}

        {activeView === 'calendar' && step === 'success' && (
          <div style={{ textAlign: 'center', maxWidth: '480px', margin: '0 auto', padding: '48px 0' }}>
            <CheckCircle size={48} style={{ color: 'var(--accent-neon)', marginBottom: '20px' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-white)', marginBottom: '12px' }}>
              Call booked!
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-gray)', lineHeight: 1.6, marginBottom: '28px' }}>
              Check your email for confirmation. Looking forward to speaking with you.
            </p>
            <button onClick={() => { setStep('pick-date'); setSelectedDate(null); setSelectedSlot(null); setForm({ name: '', email: '', phone: '', company: '', pms: '', message: '' }); }} className="btn-framer-secondary">
              Book another call
            </button>
          </div>
        )}
      </section>

      <style>{`
        .contact-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .contact-field label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-gray);
          letter-spacing: 0.01em;
        }
        .contact-input-wrap {
          position: relative;
        }
        .contact-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }
        .contact-input-wrap input {
          width: 100%;
          padding: 12px 14px 12px 40px;
          background: var(--bg-input);
          border: 1px solid var(--border-light);
          border-radius: 10px;
          color: var(--text-light);
          font-size: 0.95rem;
          font-family: var(--font-sans);
          outline: none;
          transition: border-color 0.2s;
        }
        .contact-input-wrap input:focus {
          border-color: var(--accent-neon-border);
        }
        @media (max-width: 768px) {
          .contact-field + .contact-field { }
          div[style*="gridTemplateColumns: '1fr 1fr'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
