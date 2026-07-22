import React, { useState, useEffect, useRef } from 'react';
import {
  Phone, PhoneOff, Mic, MicOff, Volume2, Send,
  Zap, Calendar, Shield, Clock, ChevronRight,
  Star, CheckCircle, ArrowRight, Bot, Headphones
} from 'lucide-react';
import AudioWaveform from '../components/AudioWaveform';

/* ─── Capability cards ──────────────────────────────────── */
const CAPABILITIES = [
  { icon: <Calendar size={20} />, title: 'Booking & Scheduling', desc: 'Books meetings directly into Calendly, HubSpot, or any CRM in real time.' },
  { icon: <Shield  size={20} />, title: 'Lead Qualification',   desc: 'Asks smart questions to qualify leads before routing to your sales team.' },
  { icon: <Zap     size={20} />, title: 'Instant Responses',    desc: 'Replies in under 800ms — no hold music, no lost leads, no frustration.' },
  { icon: <Clock   size={20} />, title: '24 / 7 Availability',  desc: 'Never miss a call. Chloe handles every inquiry day and night, 365 days.' },
];

const STATS = [
  { value: '<800ms', label: 'Response latency' },
  { value: '24/7',   label: 'Availability'     },
  { value: '98%',    label: 'Accuracy rate'    },
  { value: '150+',   label: 'Agents deployed'  },
];

const QUICK_PROMPTS = [
  "What services does Noryvex offer?",
  "Can I book a strategy call?",
  "Who founded Noryvex?",
  "How does AI voice work?",
  "What's the pricing?",
  "Do you work with small businesses?",
];

const AI_REPLIES = {
  default: "I didn't quite catch that — could you rephrase? You can ask about our services, scheduling a call, pricing, or who founded Noryvex.",
  hello:   "Hi there! Great to connect. I'm Chloe, Noryvex's AI receptionist. I can book you a strategy call, explain our AI solutions, or answer any questions you have. What's on your mind?",
  book:    "Absolutely! To schedule a strategy call with Muhammad Razi, head over to our Contact page. Would you like me to guide you there? The call is completely free and usually 20–30 minutes.",
  service: "Noryvex builds AI Voice Agents, Business Automation pipelines, CRM integrations, and custom software. Our agents handle inbound calls, qualify leads, and book appointments — all automatically.",
  price:   "Our solutions are fully custom-built, so pricing depends on scope and integrations. We don't do generic packages. Book a free strategy call and we'll give you a tailored quote with no pressure.",
  founder: "Noryvex was founded by Muhammad Razi — a Full-Stack AI Developer specializing in intelligent workflow automation and custom AI systems.",
  small:   "Absolutely! We work with businesses of all sizes. Whether you're a solo founder or a growing team, we can build an AI solution that fits your budget and scales with you.",
  ai:      "AI voice agents use large language models combined with ultra-low-latency text-to-speech. They understand context, handle interruptions, and sound completely natural — under 800ms response time.",
  thanks:  "You're very welcome! Feel free to reach out anytime at codingwithrazi@gmail.com. Have a fantastic day — and I hope to connect you with the Noryvex team soon! 👋",
};

function getReply(text) {
  const t = text.toLowerCase();
  if (/hello|hi |hey/.test(t))                                        return AI_REPLIES.hello;
  if (/book|schedul|meeting|call|calendar|strategy/.test(t))          return AI_REPLIES.book;
  if (/service|do you|build|capabilit|offer/.test(t))                 return AI_REPLIES.service;
  if (/pric|cost|rate|package|budget/.test(t))                        return AI_REPLIES.price;
  if (/founder|owner|razi|muhammad|who/.test(t))                      return AI_REPLIES.founder;
  if (/small|startup|solo|size/.test(t))                              return AI_REPLIES.small;
  if (/how.*work|latency|voice|800|ms|model|llm/.test(t))             return AI_REPLIES.ai;
  if (/thank|bye|goodbye|great|awesome/.test(t))                      return AI_REPLIES.thanks;
  return AI_REPLIES.default;
}

export default function LiveDemo({ setActivePage }) {
  const [callState, setCallState]   = useState('idle');
  const [isMuted, setIsMuted]       = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [duration, setDuration]     = useState(0);
  const [aiTyping, setAiTyping]     = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [textInput, setTextInput]   = useState('');
  const [activeCapability, setActiveCapability] = useState(0);

  const timerRef        = useRef(null);
  const chatLogRef      = useRef(null);
  const recognitionRef  = useRef(null);

  const GREETING = "Noryvex Systems, this is Chloe! Thanks for calling. How can I help automate your business today?";

  /* ── Speech recognition ─────────────────────── */
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SR();
      rec.continuous = false; rec.interimResults = false; rec.lang = 'en-US';
      rec.onstart  = () => setIsListening(true);
      rec.onerror  = () => setIsListening(false);
      rec.onend    = () => setIsListening(false);
      rec.onresult = (ev) => { const t = ev.results[0][0].transcript; if (t.trim()) handleUtterance(t); };
      recognitionRef.current = rec;
    }
  }, []);

  /* ── Scroll chat log ────────────────────────── */
  useEffect(() => {
    if (chatLogRef.current) chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
  }, [transcript, aiTyping]);

  /* ── Timer ──────────────────────────────────── */
  useEffect(() => {
    if (callState === 'connected') {
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    } else { clearInterval(timerRef.current); setDuration(0); }
    return () => clearInterval(timerRef.current);
  }, [callState]);

  /* ── Capability auto-cycle ──────────────────── */
  useEffect(() => {
    if (callState !== 'idle') return;
    const t = setInterval(() => setActiveCapability(c => (c + 1) % CAPABILITIES.length), 3000);
    return () => clearInterval(t);
  }, [callState]);

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const addMsg = (sender, text) => setTranscript(p => [...p, { sender, text, time: new Date() }]);

  const speak = (text) => {
    if (!('speechSynthesis' in window)) { setAiSpeaking(true); setTimeout(() => setAiSpeaking(false), 3000); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const v = voices.find(v => v.name.includes('Google US English') || v.name.includes('Zira') || v.lang.startsWith('en-'));
    if (v) u.voice = v;
    u.rate = 1.0; u.pitch = 1.05;
    u.onstart = () => setAiSpeaking(true);
    u.onend   = () => { setAiSpeaking(false); if (!isMuted && recognitionRef.current) { try { recognitionRef.current.start(); } catch(e){} } };
    window.speechSynthesis.speak(u);
  };

  const handleUtterance = (text) => {
    addMsg('user', text);
    setAiTyping(true);
    setTimeout(() => {
      const reply = getReply(text);
      setAiTyping(false);
      addMsg('agent', reply);
      speak(reply);
    }, 1200 + Math.random() * 400);
  };

  const startCall = () => {
    setCallState('dialing');
    setTranscript([]);
    setTimeout(() => {
      setCallState('connected');
      setAiTyping(true);
      setTimeout(() => { setAiTyping(false); addMsg('agent', GREETING); speak(GREETING); }, 1000);
    }, 1800);
  };

  const endCall = () => {
    window.speechSynthesis?.cancel();
    recognitionRef.current?.abort();
    setCallState('ended'); setIsListening(false); setAiSpeaking(false); setAiTyping(false);
  };

  const triggerListening = () => {
    if (isListening) { recognitionRef.current?.stop(); return; }
    window.speechSynthesis?.cancel(); setAiSpeaking(false);
    try { recognitionRef.current?.start(); } catch(e) {}
  };

  const handleTextSubmit = (e) => { e.preventDefault(); if (!textInput.trim()) return; handleUtterance(textInput); setTextInput(''); };

  return (
    <div className="ld-page page-enter">

      {/* ═══════════════════════════════════════════════════
          HERO — split layout
      ═══════════════════════════════════════════════════ */}
      <section className="ld-hero">
        <div className="ld-hero-bg" />
        <div className="container ld-hero-grid">

          {/* LEFT ── value prop */}
          <div className="ld-left">
            <span className="section-tag ld-tag">Live Interactive Demo</span>
            <h1 className="ld-headline">
              Meet <span className="ld-name-highlight">Chloe</span> —<br />
              Your AI Receptionist
            </h1>
            <p className="ld-sub">
              Chloe handles inbound calls, qualifies leads, and books meetings — 24/7, under 800ms, completely autonomously. Click the phone to experience it yourself.
            </p>

            {/* Trust pills */}
            <div className="ld-trust-row">
              {STATS.map((s, i) => (
                <div key={i} className="ld-trust-pill">
                  <span className="ld-trust-val">{s.value}</span>
                  <span className="ld-trust-lbl">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Capability cards */}
            <div className="ld-caps">
              {CAPABILITIES.map((c, i) => (
                <div
                  key={i}
                  className={`ld-cap-card ${i === activeCapability ? 'active' : ''}`}
                  onClick={() => setActiveCapability(i)}
                >
                  <div className="ld-cap-icon">{c.icon}</div>
                  <div>
                    <div className="ld-cap-title">{c.title}</div>
                    <div className="ld-cap-desc">{c.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div className="ld-social">
              <div className="ld-stars">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#C7FF3D" color="#C7FF3D" />)}
              </div>
              <span className="ld-social-text">"The AI sounded completely human — our clients couldn't even tell."</span>
            </div>
          </div>

          {/* RIGHT ── phone */}
          <div className="ld-right">

            {/* Ambient glow behind phone */}
            <div className="ld-phone-glow" />

            <div className="ld-phone-frame">
              {/* Notch */}
              <div className="ld-notch" />

              {/* Status bar */}
              <div className="ld-status-bar">
                <span>9:41</span>
                <div className="ld-status-center">
                  <div className={`ld-live-dot ${callState === 'connected' ? 'active' : ''}`} />
                  {callState === 'connected' ? 'Live Call' : 'Noryvex AI'}
                </div>
                <span>100%</span>
              </div>

              {/* ── IDLE ── */}
              {callState === 'idle' && (
                <div className="ld-screen ld-screen-idle">
                  <div className="ld-avatar-wrap">
                    <div className="ld-avatar-ring r1" />
                    <div className="ld-avatar-ring r2" />
                    <div className="ld-avatar-core">
                      <img src="/logo.png" alt="Chloe" />
                    </div>
                  </div>
                  <h2 className="ld-chloe-name">Chloe</h2>
                  <p className="ld-chloe-role">Noryvex AI Receptionist</p>
                  <div className="ld-idle-features">
                    {['Qualifies leads', 'Books meetings', 'Answers FAQs', '24/7 active'].map((f,i) => (
                      <span key={i} className="ld-idle-chip">
                        <CheckCircle size={11} /> {f}
                      </span>
                    ))}
                  </div>
                  <button className="ld-call-btn" onClick={startCall}>
                    <Phone size={22} />
                    <span>Start Demo Call</span>
                  </button>
                  <p className="ld-idle-hint">↑ Tap to connect with Chloe</p>
                </div>
              )}

              {/* ── DIALING ── */}
              {callState === 'dialing' && (
                <div className="ld-screen ld-screen-dialing">
                  <div className="ld-dial-ring">
                    <div className="ld-dial-pulse" />
                    <div className="ld-dial-pulse p2" />
                    <div className="ld-dial-inner">
                      <Phone size={28} color="#C7FF3D" />
                    </div>
                  </div>
                  <h2>Connecting…</h2>
                  <p className="ld-dial-sub">Routing to Noryvex server</p>
                  <div className="ld-dial-dots">
                    <span /><span /><span />
                  </div>
                  <button className="ld-hangup-btn" onClick={endCall}><PhoneOff size={20} /></button>
                </div>
              )}

              {/* ── CONNECTED / ENDED ── */}
              {(callState === 'connected' || callState === 'ended') && (
                <div className="ld-screen ld-screen-connected">

                  {/* Top bar */}
                  <div className="ld-call-top">
                    <div className="ld-call-info">
                      <span className={`ld-call-badge ${callState === 'ended' ? 'ended' : 'live'}`}>
                        {callState === 'ended' ? '● Ended' : '● Live'}
                      </span>
                      <span className="ld-timer">{fmt(duration)}</span>
                    </div>
                    <AudioWaveform active={aiSpeaking} barCount={16} />
                    <span className="ld-speaking-lbl">
                      {aiSpeaking ? 'Chloe speaking…' : aiTyping ? 'Chloe thinking…' : isListening ? 'Listening…' : 'Ready'}
                    </span>
                  </div>

                  {/* Chat log */}
                  <div className="ld-chat-log" ref={chatLogRef}>
                    {transcript.length === 0 && (
                      <div className="ld-chat-empty">
                        <Bot size={24} />
                        <span>Chloe will respond here</span>
                      </div>
                    )}
                    {transcript.map((msg, i) => (
                      <div key={i} className={`ld-bubble-wrap ${msg.sender}`}>
                        {msg.sender === 'agent' && (
                          <div className="ld-agent-avatar"><img src="/logo.png" alt="Chloe" /></div>
                        )}
                        <div className="ld-bubble">{msg.text}</div>
                      </div>
                    ))}
                    {aiTyping && (
                      <div className="ld-bubble-wrap agent">
                        <div className="ld-agent-avatar"><img src="/logo.png" alt="Chloe" /></div>
                        <div className="ld-bubble ld-typing">
                          <span/><span/><span/>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="ld-controls">
                    {callState === 'connected' ? (<>

                      {/* Quick prompts */}
                      <div className="ld-prompts-scroll">
                        {QUICK_PROMPTS.map((p, i) => (
                          <button
                            key={i}
                            className="ld-prompt-chip"
                            onClick={() => handleUtterance(p)}
                            disabled={aiTyping || aiSpeaking}
                          >{p}</button>
                        ))}
                      </div>

                      {/* Text input */}
                      <form onSubmit={handleTextSubmit} className="ld-text-form">
                        <input
                          className="ld-text-input"
                          type="text"
                          placeholder="Type or speak to Chloe…"
                          value={textInput}
                          onChange={e => setTextInput(e.target.value)}
                          disabled={aiTyping || aiSpeaking}
                        />
                        <button type="submit" className="ld-send-btn" disabled={!textInput.trim()}>
                          <Send size={14} />
                        </button>
                      </form>

                      {/* Control buttons */}
                      <div className="ld-btn-row">
                        {speechSupported ? (
                          <button className={`ld-ctrl ${isListening ? 'listening' : ''}`} onClick={triggerListening} title="Speak">
                            {isListening ? <Mic size={18} /> : <MicOff size={18} />}
                          </button>
                        ) : (
                          <div className="ld-ctrl disabled"><MicOff size={18} /></div>
                        )}
                        <button className="ld-ctrl mute" onClick={() => setIsMuted(m => !m)} title="Mute speaker">
                          <Volume2 size={18} style={{ opacity: isMuted ? 0.3 : 1 }} />
                        </button>
                        <button className="ld-ctrl hangup" onClick={endCall} title="End call">
                          <PhoneOff size={18} />
                        </button>
                      </div>

                    </>) : (
                      <div className="ld-ended">
                        <CheckCircle size={32} color="#C7FF3D" />
                        <h3>Call Complete</h3>
                        <p>That's what your customers will experience — 24/7.</p>
                        <div className="ld-ended-btns">
                          <button className="ld-call-btn sm" onClick={startCall}>
                            <Phone size={16}/> Call Again
                          </button>
                          {setActivePage && (
                            <button className="ld-book-btn" onClick={() => setActivePage('contact')}>
                              Book a Real Call <ArrowRight size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

            {/* Floating labels around phone */}
            <div className="ld-float-label f1"><Zap size={12} /> 800ms latency</div>
            <div className="ld-float-label f2"><Headphones size={12} /> Natural voice</div>
            <div className="ld-float-label f3"><Calendar size={12} /> Auto-books</div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          HOW IT WORKS strip
      ═══════════════════════════════════════════════════ */}
      <section className="ld-how">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">How It Works</span>
            <h2 className="section-title">Three steps to never miss a call</h2>
          </div>
          <div className="ld-how-grid">
            {[
              { n:'01', title:'Customer Calls', desc:'Your phone number routes to Chloe — instant pickup, no hold music, no voicemail.', icon:<Phone size={24}/> },
              { n:'02', title:'Chloe Engages', desc:'She listens, understands intent, qualifies the lead, and answers questions naturally.', icon:<Bot size={24}/> },
              { n:'03', title:'Action Taken',  desc:'Meeting booked, CRM updated, or routed to your team — all within the same call.', icon:<CheckCircle size={24}/> },
            ].map((s, i) => (
              <div key={i} className="ld-how-card nrx-reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="ld-how-num">{s.n}</div>
                <div className="ld-how-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                {i < 2 && <div className="ld-how-arrow"><ChevronRight size={20} /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CTA
      ═══════════════════════════════════════════════════ */}
      <section className="ld-cta">
        <div className="container ld-cta-inner">
          <div className="ld-cta-glow" />
          <span className="section-tag">Ready to automate?</span>
          <h2 className="ld-cta-title">Build your own Chloe in&nbsp;days</h2>
          <p className="ld-cta-sub">Custom-trained on your business. Integrated with your CRM. Live in under 2 weeks.</p>
          <div className="ld-cta-btns">
            {setActivePage && (<>
              <button className="btn btn-primary btn-lg" onClick={() => setActivePage('contact')}>
                Book a Free Strategy Call <ArrowRight size={18} />
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => setActivePage('solutions')}>
                View All Solutions
              </button>
            </>)}
          </div>
          <div className="ld-cta-checks">
            {['No commitment required', 'Free strategy call', 'Live in under 2 weeks', '24/7 support'].map((c,i) => (
              <span key={i}><CheckCircle size={14} color="#C7FF3D" /> {c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          ALL STYLES
      ═══════════════════════════════════════════════════ */}
      <style>{`
        .ld-page { min-height: 100vh; background: var(--bg-pure); }

        /* ── Hero ─────────────────────────────────────── */
        .ld-hero {
          position: relative;
          padding: 100px 0 80px;
          overflow: hidden;
        }
        .ld-hero-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 70% 40%, rgba(199,255,61,0.06) 0%, transparent 65%),
            radial-gradient(ellipse 50% 40% at 20% 60%, rgba(199,255,61,0.03) 0%, transparent 60%);
          pointer-events: none;
        }
        .ld-hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        /* LEFT */
        .ld-tag { margin-bottom: 20px; }
        .ld-headline {
          font-size: clamp(2.4rem, 4.5vw, 3.6rem);
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 20px;
        }
        .ld-name-highlight {
          background: linear-gradient(135deg, #C7FF3D 0%, #fff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ld-sub {
          font-size: 1.1rem;
          color: var(--text-gray);
          line-height: 1.65;
          margin-bottom: 32px;
          max-width: 480px;
        }

        /* Trust pills */
        .ld-trust-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }
        .ld-trust-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px 16px;
          border: 1px solid var(--border-light);
          border-radius: 10px;
          background: rgba(255,255,255,0.02);
          min-width: 70px;
        }
        .ld-trust-val {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--accent-neon);
          line-height: 1;
        }
        .ld-trust-lbl {
          font-size: 0.65rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-top: 4px;
          white-space: nowrap;
        }

        /* Capability cards */
        .ld-caps { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
        .ld-cap-card {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 14px 16px;
          border: 1px solid var(--border-light);
          border-radius: 12px;
          background: rgba(255,255,255,0.01);
          cursor: pointer;
          transition: border-color 0.25s, background 0.25s, transform 0.25s;
        }
        .ld-cap-card.active {
          border-color: rgba(199,255,61,0.35);
          background: rgba(199,255,61,0.04);
          transform: translateX(4px);
        }
        .ld-cap-icon {
          width: 38px; height: 38px; flex-shrink: 0;
          border-radius: 9px;
          border: 1px solid var(--border-light);
          background: rgba(199,255,61,0.06);
          display: flex; align-items: center; justify-content: center;
          color: var(--accent-neon);
          transition: border-color 0.25s;
        }
        .ld-cap-card.active .ld-cap-icon { border-color: var(--accent-neon-border); }
        .ld-cap-title { font-size: 0.88rem; font-weight: 700; color: var(--text-white); margin-bottom: 2px; }
        .ld-cap-desc  { font-size: 0.78rem; color: var(--text-muted); line-height: 1.45; }

        /* Social proof */
        .ld-social { display: flex; align-items: center; gap: 10px; }
        .ld-stars { display: flex; gap: 2px; }
        .ld-social-text { font-size: 0.8rem; color: var(--text-gray); font-style: italic; }

        /* ── RIGHT: Phone ──────────────────────────── */
        .ld-right {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }
        .ld-phone-glow {
          position: absolute;
          width: 340px; height: 500px;
          background: radial-gradient(ellipse, rgba(199,255,61,0.1) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .ld-phone-frame {
          width: 330px;
          height: 680px;
          background: #111114;
          border: 10px solid #222226;
          border-radius: 44px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow:
            0 40px 80px rgba(0,0,0,0.8),
            0 0 0 1px rgba(255,255,255,0.04),
            inset 0 0 0 1px rgba(255,255,255,0.06);
          z-index: 1;
        }
        .ld-notch {
          position: absolute; top: 8px; left: 50%;
          transform: translateX(-50%);
          width: 100px; height: 20px;
          background: #222226;
          border-radius: 0 0 14px 14px;
          z-index: 20;
        }
        .ld-status-bar {
          height: 44px;
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 0 18px;
          font-size: 0.68rem;
          color: var(--text-muted);
          background: #0a0a0d;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          flex-shrink: 0;
          z-index: 10;
        }
        .ld-status-center {
          display: flex; align-items: center; gap: 6px;
          font-weight: 600; color: var(--text-white);
          font-size: 0.75rem;
        }
        .ld-live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--text-muted);
          transition: background 0.3s;
        }
        .ld-live-dot.active { background: #C7FF3D; box-shadow: 0 0 6px #C7FF3D; }

        /* Screen base */
        .ld-screen {
          flex: 1;
          display: flex; flex-direction: column;
          overflow: hidden;
          background: #0a0a0d;
        }

        /* ── IDLE screen ── */
        .ld-screen-idle {
          align-items: center; justify-content: center;
          padding: 24px; text-align: center; gap: 8px;
        }
        .ld-avatar-wrap {
          position: relative; width: 120px; height: 120px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 8px;
        }
        .ld-avatar-ring {
          position: absolute; border-radius: 50%;
          border: 1px solid rgba(199,255,61,0.15);
        }
        .ld-avatar-ring.r1 { width: 100%; height: 100%; }
        .ld-avatar-ring.r2 { width: 80%;  height: 80%;  border-color: rgba(199,255,61,0.1); }
        .ld-avatar-core {
          width: 80px; height: 80px; border-radius: 50%;
          border: 2px solid rgba(199,255,61,0.3);
          background: #161619;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 30px rgba(199,255,61,0.12);
          z-index: 1;
        }
        .ld-avatar-core img { width: 48px; height: 48px; object-fit: contain; }
        .ld-chloe-name { font-size: 1.4rem; font-weight: 800; margin-bottom: 2px; }
        .ld-chloe-role { font-size: 0.72rem; color: var(--accent-neon); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.08em; }
        .ld-idle-features { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-bottom: 24px; }
        .ld-idle-chip {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 0.68rem; color: var(--text-gray);
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-light);
          padding: 4px 10px; border-radius: 100px;
        }
        .ld-call-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 28px;
          background: #C7FF3D; color: #000;
          border: none; border-radius: 100px;
          font-family: var(--font-display);
          font-size: 0.9rem; font-weight: 800;
          cursor: pointer;
          box-shadow: 0 8px 30px rgba(199,255,61,0.35);
          transition: transform 0.2s, box-shadow 0.2s;
          margin-bottom: 10px;
        }
        .ld-call-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(199,255,61,0.5); }
        .ld-call-btn.sm { padding: 10px 18px; font-size: 0.8rem; margin-bottom: 0; }
        .ld-idle-hint { font-size: 0.65rem; color: var(--text-muted); }

        /* ── DIALING screen ── */
        .ld-screen-dialing { align-items: center; justify-content: center; gap: 12px; text-align: center; padding: 24px; }
        .ld-dial-ring {
          width: 100px; height: 100px; border-radius: 50%;
          position: relative;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 8px;
        }
        .ld-dial-pulse {
          position: absolute; inset: 0; border-radius: 50%;
          background: rgba(199,255,61,0.08);
          animation: dial-expand 2s ease-out infinite;
        }
        .ld-dial-pulse.p2 { animation-delay: 1s; }
        @keyframes dial-expand {
          0%   { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .ld-dial-inner {
          width: 70px; height: 70px; border-radius: 50%;
          background: rgba(199,255,61,0.08);
          border: 1px solid rgba(199,255,61,0.25);
          display: flex; align-items: center; justify-content: center;
          z-index: 1;
        }
        .ld-dial-sub { font-size: 0.75rem; color: var(--text-muted); }
        .ld-dial-dots { display: flex; gap: 6px; }
        .ld-dial-dots span {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--accent-neon); opacity: 0.4;
          animation: dot-wave 1.2s ease-in-out infinite;
        }
        .ld-dial-dots span:nth-child(2) { animation-delay: 0.2s; }
        .ld-dial-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dot-wave { 0%,100%{opacity:0.3;transform:translateY(0)} 50%{opacity:1;transform:translateY(-4px)} }
        .ld-hangup-btn {
          width: 52px; height: 52px; border-radius: 50%;
          background: #ef4444; border: none; color: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; margin-top: 8px;
          box-shadow: 0 4px 16px rgba(239,68,68,0.4);
        }

        /* ── CONNECTED screen ── */
        .ld-screen-connected { overflow: hidden; }
        .ld-call-top {
          padding: 12px 14px 8px;
          background: rgba(199,255,61,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.04);
          flex-shrink: 0;
          display: flex; flex-direction: column; align-items: center; gap: 4px;
        }
        .ld-call-info { display: flex; align-items: center; gap: 10px; }
        .ld-call-badge {
          font-size: 0.62rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.06em;
          padding: 2px 8px; border-radius: 100px;
        }
        .ld-call-badge.live  { background: rgba(199,255,61,0.15); color: #C7FF3D; }
        .ld-call-badge.ended { background: rgba(255,255,255,0.06); color: var(--text-muted); }
        .ld-timer { font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; }
        .ld-speaking-lbl { font-size: 0.62rem; color: var(--text-muted); margin-top: 2px; }

        /* Chat log */
        .ld-chat-log {
          flex: 1; overflow-y: auto;
          padding: 12px; display: flex; flex-direction: column; gap: 10px;
        }
        .ld-chat-empty {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 8px; color: var(--text-muted); font-size: 0.75rem;
          opacity: 0.5;
        }
        .ld-bubble-wrap { display: flex; align-items: flex-end; gap: 6px; }
        .ld-bubble-wrap.user { flex-direction: row-reverse; }
        .ld-agent-avatar {
          width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
          border: 1px solid rgba(199,255,61,0.2);
          background: #1a1a1e; overflow: hidden;
        }
        .ld-agent-avatar img { width: 100%; height: 100%; object-fit: contain; }
        .ld-bubble {
          max-width: 78%;
          padding: 9px 12px;
          border-radius: 14px;
          font-size: 0.78rem; line-height: 1.45;
        }
        .agent .ld-bubble {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          color: var(--text-light);
          border-bottom-left-radius: 4px;
        }
        .user .ld-bubble {
          background: #C7FF3D; color: #000; font-weight: 600;
          border-bottom-right-radius: 4px;
        }
        .ld-typing {
          display: flex; gap: 4px; padding: 12px 14px;
        }
        .ld-typing span {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--text-gray);
          animation: dot-wave 1.2s ease-in-out infinite;
        }
        .ld-typing span:nth-child(2) { animation-delay: 0.2s; }
        .ld-typing span:nth-child(3) { animation-delay: 0.4s; }

        /* Controls */
        .ld-controls {
          padding: 10px 12px;
          background: #0a0a0d;
          border-top: 1px solid rgba(255,255,255,0.05);
          flex-shrink: 0;
        }
        .ld-prompts-scroll {
          display: flex; gap: 6px; overflow-x: auto;
          padding-bottom: 8px; margin-bottom: 8px;
          scrollbar-width: none;
        }
        .ld-prompts-scroll::-webkit-scrollbar { display: none; }
        .ld-prompt-chip {
          white-space: nowrap; flex-shrink: 0;
          padding: 5px 10px; border-radius: 100px;
          border: 1px solid var(--border-light);
          background: rgba(255,255,255,0.02);
          color: var(--text-gray); font-size: 0.68rem; font-weight: 500;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .ld-prompt-chip:hover:not(:disabled) {
          border-color: rgba(199,255,61,0.4); color: #fff;
          background: rgba(199,255,61,0.05);
        }
        .ld-prompt-chip:disabled { opacity: 0.4; cursor: not-allowed; }
        .ld-text-form { display: flex; gap: 6px; margin-bottom: 10px; }
        .ld-text-input {
          flex: 1; height: 34px;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-light);
          border-radius: 8px; padding: 0 10px;
          color: var(--text-white);
          font-size: 0.75rem; font-family: var(--font-sans);
        }
        .ld-text-input:focus { outline: none; border-color: rgba(199,255,61,0.4); }
        .ld-send-btn {
          width: 34px; height: 34px; border-radius: 8px;
          background: #C7FF3D; border: none; color: #000;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0;
          transition: opacity 0.2s;
        }
        .ld-send-btn:disabled { opacity: 0.4; cursor: not-allowed; background: var(--text-muted); }
        .ld-btn-row { display: flex; justify-content: space-around; }
        .ld-ctrl {
          width: 42px; height: 42px; border-radius: 50%;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-light);
          color: var(--text-white);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .ld-ctrl:hover { background: rgba(255,255,255,0.08); }
        .ld-ctrl.listening { background: #C7FF3D; color: #000; border-color: #C7FF3D; }
        .ld-ctrl.hangup { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.3); color: #f87171; }
        .ld-ctrl.hangup:hover { background: #ef4444; color: #fff; }
        .ld-ctrl.disabled { opacity: 0.3; cursor: not-allowed; }

        /* Ended */
        .ld-ended {
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
          gap: 8px; padding: 16px 12px;
        }
        .ld-ended h3 { font-size: 1.1rem; }
        .ld-ended p  { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px; }
        .ld-ended-btns { display: flex; flex-direction: column; gap: 8px; width: 100%; }
        .ld-book-btn {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 10px; border-radius: 10px;
          background: rgba(199,255,61,0.08);
          border: 1px solid rgba(199,255,61,0.25);
          color: #C7FF3D;
          font-size: 0.8rem; font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }
        .ld-book-btn:hover { background: rgba(199,255,61,0.15); }

        /* Floating labels */
        .ld-float-label {
          position: absolute;
          display: flex; align-items: center; gap: 6px;
          padding: 6px 12px;
          background: rgba(15,15,18,0.9);
          border: 1px solid var(--border-light);
          border-radius: 100px;
          font-size: 0.7rem; font-weight: 600;
          color: var(--text-gray);
          white-space: nowrap;
          z-index: 2;
          animation: float-bob 5s ease-in-out infinite;
        }
        .ld-float-label svg { color: var(--accent-neon); }
        .f1 { top: 12%;  left: -8%;  animation-delay: 0s; }
        .f2 { top: 42%;  right: -8%; animation-delay: 1.5s; }
        .f3 { bottom: 16%; left: -4%; animation-delay: 0.8s; }
        @keyframes float-bob {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }

        /* ── HOW IT WORKS ──────────────────────────── */
        .ld-how { padding: 100px 0; background: #050507; border-top: 1px solid var(--border-light); }
        .ld-how-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 2px; position: relative;
          margin-top: 48px;
        }
        .ld-how-card {
          background: rgba(255,255,255,0.015);
          border: 1px solid var(--border-light);
          padding: 36px 28px;
          position: relative;
          border-radius: 16px;
        }
        .ld-how-card:hover { background: rgba(199,255,61,0.02); border-color: rgba(199,255,61,0.15); }
        .ld-how-num {
          font-family: var(--font-display);
          font-size: 3rem; font-weight: 900;
          color: rgba(199,255,61,0.08);
          line-height: 1; margin-bottom: 16px;
        }
        .ld-how-icon {
          width: 48px; height: 48px; border-radius: 12px;
          background: rgba(199,255,61,0.07);
          border: 1px solid var(--accent-neon-border);
          display: flex; align-items: center; justify-content: center;
          color: var(--accent-neon); margin-bottom: 20px;
        }
        .ld-how-card h3 { font-size: 1.15rem; margin-bottom: 10px; }
        .ld-how-card p  { font-size: 0.875rem; color: var(--text-gray); line-height: 1.6; }
        .ld-how-arrow {
          position: absolute; right: -14px; top: 50%;
          transform: translateY(-50%);
          width: 28px; height: 28px; border-radius: 50%;
          background: var(--bg-pure); border: 1px solid var(--border-light);
          display: flex; align-items: center; justify-content: center;
          color: var(--accent-neon); z-index: 2;
        }

        /* ── CTA ───────────────────────────────────── */
        .ld-cta {
          padding: 120px 0;
          background: var(--bg-dark);
          border-top: 1px solid var(--border-light);
        }
        .ld-cta-inner {
          text-align: center; position: relative; overflow: hidden;
        }
        .ld-cta-glow {
          position: absolute; inset: -100px;
          background: radial-gradient(ellipse 60% 50% at 50% 100%, rgba(199,255,61,0.06) 0%, transparent 65%);
          pointer-events: none;
        }
        .ld-cta-title {
          font-size: clamp(2rem, 4.5vw, 3.2rem);
          margin: 12px 0 16px;
          letter-spacing: -0.03em;
        }
        .ld-cta-sub {
          color: var(--text-gray); font-size: 1.05rem;
          max-width: 500px; margin: 0 auto 40px; line-height: 1.6;
        }
        .ld-cta-btns { display: flex; gap: 14px; justify-content: center; margin-bottom: 32px; flex-wrap: wrap; }
        .ld-cta-checks {
          display: flex; gap: 24px; justify-content: center;
          flex-wrap: wrap;
        }
        .ld-cta-checks span {
          display: flex; align-items: center; gap: 6px;
          font-size: 0.82rem; color: var(--text-muted);
        }

        /* ── Responsive ────────────────────────────── */
        @media (max-width: 1024px) {
          .ld-hero-grid { grid-template-columns: 1fr; gap: 60px; }
          .ld-right { order: -1; }
          .ld-float-label { display: none; }
          .ld-how-grid { grid-template-columns: 1fr; gap: 16px; }
          .ld-how-arrow { display: none; }
        }
        @media (max-width: 600px) {
          .ld-phone-frame { width: 300px; height: 620px; }
          .ld-trust-row { gap: 8px; }
          .ld-cta-btns { flex-direction: column; align-items: center; }
        }
      `}</style>
    </div>
  );
}
