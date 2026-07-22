import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, Send, MessageSquare } from 'lucide-react';
import AudioWaveform from '../components/AudioWaveform';

export default function LiveDemo() {
  const [callState, setCallState] = useState('idle'); // 'idle', 'dialing', 'connected', 'ended'
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [duration, setDuration] = useState(0);
  const [aiTyping, setAiTyping] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [textInput, setTextInput] = useState('');
  
  const timerRef = useRef(null);
  const transcriptEndRef = useRef(null);
  const chatLogRef = useRef(null);
  const recognitionRef = useRef(null);

  const initialGreeting = "Noryvex Systems, this is Chloe. Thanks for calling! How can I help automate your business today?";

  // Check speech synthesis and recognition support
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onerror = (e) => {
        console.error('Speech recognition error', e);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onresult = (event) => {
        const text = event.results[0][0].transcript;
        if (text.trim()) {
          handleUserUtterance(text);
        }
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Scroll ONLY the chat log box — NOT the page
  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [transcript, aiTyping]);

  // Call duration timer
  useEffect(() => {
    if (callState === 'connected') {
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setDuration(0);
    }
    return () => clearInterval(timerRef.current);
  }, [callState]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startCall = () => {
    setCallState('dialing');
    setTranscript([]);
    
    // Simulate dialing lag
    setTimeout(() => {
      setCallState('connected');
      setAiTyping(true);
      
      // AI Greeting delay
      setTimeout(() => {
        setAiTyping(false);
        addMessage('agent', initialGreeting);
        speakResponse(initialGreeting);
      }, 1200);
    }, 2000);
  };

  const endCall = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    setCallState('ended');
    setIsListening(false);
    setAiSpeaking(false);
    setAiTyping(false);
  };

  const addMessage = (sender, text) => {
    setTranscript((prev) => [...prev, { sender, text, time: new Date() }]);
  };

  // Text-to-Speech synthesizer
  const speakResponse = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Find a clean female voice if possible
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(v => 
        v.name.includes('Google US English') || 
        v.name.includes('Zira') || 
        v.name.includes('Samantha') ||
        v.lang.startsWith('en-')
      );
      if (femaleVoice) utterance.voice = femaleVoice;
      
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      utterance.onstart = () => {
        setAiSpeaking(true);
      };

      utterance.onend = () => {
        setAiSpeaking(false);
        // Start listening after speaker finishes
        if (!isMuted && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch(e) {
            console.log(e);
          }
        }
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // Mock speaking animation if unsupported
      setAiSpeaking(true);
      setTimeout(() => setAiSpeaking(false), 3000);
    }
  };

  // Process Chloe's replies
  const handleUserUtterance = (text) => {
    addMessage('user', text);
    setAiTyping(true);

    const inputLower = text.toLowerCase();
    let reply = "I didn't quite catch that. Can you repeat it? You can ask me about scheduling a meeting, our services, or who founded Noryvex.";

    if (inputLower.includes('hello') || inputLower.includes('hi') || inputLower.includes('hey')) {
      reply = "Hi there! I can help you book a consultation, explain our AI voice solutions, or coordinate workflow pipelines. What is on your mind?";
    } else if (inputLower.includes('book') || inputLower.includes('schedule') || inputLower.includes('meeting') || inputLower.includes('call') || inputLower.includes('calendar')) {
      reply = "I would love to help you book a meeting! To schedule a consultation with Muhammad Razi, head over to the Contact page. Would you like me to guide you there?";
    } else if (inputLower.includes('service') || inputLower.includes('do you do') || inputLower.includes('what do you build') || inputLower.includes('capabilities')) {
      reply = "We design high-fidelity AI Voice Agents, CRM integrations, and customized software systems to automate workflows. Our agents connect to Calendly, HubSpot, and custom databases.";
    } else if (inputLower.includes('pricing') || inputLower.includes('cost') || inputLower.includes('rate')) {
      reply = "Because we build fully custom integrations and database syncs, we don't have standard packages. We discuss custom pricing during our free strategy call. Would you like to schedule one?";
    } else if (inputLower.includes('founder') || inputLower.includes('owner') || inputLower.includes('razi') || inputLower.includes('muhammad')) {
      reply = "Noryvex was founded by Muhammad Razi. He is a Full-Stack AI Developer who specializes in designing automated workflows and custom intelligent software.";
    } else if (inputLower.includes('thank') || inputLower.includes('bye') || inputLower.includes('goodbye')) {
      reply = "You're very welcome! Feel free to reach out to us at codingwithrazi@gmail.com. Have a fantastic day!";
    }

    setTimeout(() => {
      setAiTyping(false);
      addMessage('agent', reply);
      speakResponse(reply);
    }, 1500);
  };

  const triggerListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setAiSpeaking(false);
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    handleUserUtterance(textInput);
    setTextInput('');
  };

  const quickPrompts = [
    "What services does Noryvex offer?",
    "Who is the founder of Noryvex?",
    "How can I book a strategy call?",
    "Do you do custom pricing?"
  ];

  return (
    <div className="live-demo-page page-enter">
      <section className="demo-hero">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Interactive Preview</span>
            <h1 className="demo-title">Interact with Chloe</h1>
            <p className="demo-subtitle">Experience our low-latency human-like voice receptionist. Click the call button below to start the live simulator.</p>
          </div>
        </div>
      </section>

      <section className="phone-simulation-section">
        <div className="container phone-container">
          
          {/* Phone Frame Mockup */}
          <div className="phone-wrapper">
            <div className="phone-notch"></div>
            <div className="phone-screen">
              
              {/* Phone Header */}
              <div className="phone-header">
                <div className="status-time">9:41</div>
                <div className="agent-title-bar">
                  <div className="agent-avatar-mini">
                    <img src="/logo.png" alt="Chloe Logo" />
                  </div>
                  <div className="agent-meta">
                    <span className="agent-name">Chloe</span>
                    <span className="agent-title-label">Noryvex AI Agent</span>
                  </div>
                </div>
                <div className="phone-battery">100%</div>
              </div>

              {/* Phone Body / Screens */}
              <div className="phone-body">
                {callState === 'idle' && (
                  <div className="phone-screen-idle">
                    <div className="avatar-pulse-container">
                      <div className="pulse-circle p-1"></div>
                      <div className="pulse-circle p-2"></div>
                      <div className="avatar-core-glow">
                        <img src="/logo.png" alt="Noryvex Avatar" className="avatar-logo" />
                      </div>
                    </div>
                    <h2>Chloe Receptionist</h2>
                    <p>Ready to qualify calls and book calendars automatically.</p>
                    <button onClick={startCall} className="btn btn-primary start-call-btn">
                      <Phone size={18} /> Start Demo Call
                    </button>
                  </div>
                )}

                {callState === 'dialing' && (
                  <div className="phone-screen-dialing">
                    <div className="dial-pulse">
                      <Phone size={36} className="dial-icon-spin" />
                    </div>
                    <h2>Calling Chloe...</h2>
                    <p className="dialing-status">Connecting securely to Noryvex server</p>
                    <button onClick={endCall} className="hang-up-btn">
                      <PhoneOff size={24} />
                    </button>
                  </div>
                )}

                {(callState === 'connected' || callState === 'ended') && (
                  <div className="phone-screen-connected">
                    
                    {/* Visualizer Display */}
                    <div className="phone-visualizer-box">
                      <span className="call-status">
                        {callState === 'ended' ? 'Call Ended' : 'Live Call'}
                      </span>
                      <span className="call-timer">{formatTime(duration)}</span>
                      <AudioWaveform active={aiSpeaking} barCount={18} />
                      <span className="waveform-label">
                        {aiSpeaking ? 'Chloe is speaking' : aiTyping ? 'Chloe is writing...' : 'Chloe is listening'}
                      </span>
                    </div>

                    {/* Chat log / Transcript */}
                    <div className="phone-chat-log" ref={chatLogRef}>
                      {transcript.map((msg, idx) => (
                        <div key={idx} className={`chat-bubble-wrapper ${msg.sender}`}>
                          <div className="chat-bubble">
                            {msg.text}
                          </div>
                        </div>
                      ))}
                      {aiTyping && (
                        <div className="chat-bubble-wrapper agent">
                          <div className="chat-bubble typing-bubble">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                          </div>
                        </div>
                      )}
                      <div ref={transcriptEndRef} />
                    </div>

                    {/* Interactive Controls */}
                    <div className="phone-controls">
                      {callState === 'connected' ? (
                        <>
                          <div className="speech-controls-row">
                            {speechSupported ? (
                              <button 
                                onClick={triggerListening} 
                                className={`control-circle-btn ${isListening ? 'active-listening' : ''}`}
                                title={isListening ? "Stop listening" : "Speak into microphone"}
                              >
                                {isListening ? <Mic size={20} /> : <MicOff size={20} />}
                              </button>
                            ) : (
                              <div className="mic-unsupported-tag">Mic input unsupported</div>
                            )}
                            
                            <button onClick={endCall} className="control-circle-btn hang-up-btn-mini">
                              <PhoneOff size={20} />
                            </button>

                            <button 
                              onClick={() => setIsMuted(!isMuted)} 
                              className={`control-circle-btn ${isMuted ? 'muted' : ''}`}
                            >
                              <Volume2 size={20} />
                            </button>
                          </div>

                          {/* Quick prompts & Text Fallback */}
                          <div className="quick-prompts-container">
                            <span className="quick-prompt-label">Quick options to ask Chloe:</span>
                            <div className="quick-prompts-grid">
                              {quickPrompts.map((prompt, i) => (
                                <button
                                  key={i}
                                  onClick={() => handleUserUtterance(prompt)}
                                  disabled={aiTyping || aiSpeaking}
                                  className="quick-prompt-btn"
                                >
                                  {prompt}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Text input form for silent testing */}
                          <form onSubmit={handleTextSubmit} className="text-chat-form">
                            <input
                              type="text"
                              placeholder="Type a message..."
                              value={textInput}
                              onChange={(e) => setTextInput(e.target.value)}
                              disabled={aiTyping || aiSpeaking}
                              className="chat-input"
                            />
                            <button type="submit" className="chat-submit-btn" disabled={!textInput.trim()}>
                              <Send size={16} />
                            </button>
                          </form>
                        </>
                      ) : (
                        <div className="call-ended-options">
                          <h3>Call Completed</h3>
                          <button onClick={startCall} className="btn btn-outline-neon">
                            Call Again
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .demo-hero {
          padding: 140px 0 40px 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(7,7,8,1) 100%);
        }
        
        .demo-title {
          font-size: 3.5rem;
          margin-bottom: 16px;
        }
        
        .demo-subtitle {
          font-size: 1.2rem;
          color: var(--text-gray);
          max-width: 600px;
          margin: 0 auto;
        }

        .phone-simulation-section {
          padding: 60px 0 100px 0;
          background-color: var(--bg-dark);
          display: flex;
          justify-content: center;
        }

        .phone-container {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* Phone Frame */
        .phone-wrapper {
          width: 360px;
          height: 740px;
          background: #1c1c1e;
          border: 12px solid #2c2c2e;
          border-radius: 40px;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.8),
            0 0 40px rgba(199, 255, 61, 0.05);
          position: relative;
          overflow: hidden;
          padding: 10px;
          display: flex;
          flex-direction: column;
        }

        .phone-notch {
          width: 140px;
          height: 25px;
          background: #2c2c2e;
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 0 0 18px 18px;
          z-index: 100;
        }

        .phone-screen {
          width: 100%;
          height: 100%;
          background: var(--bg-pure);
          border-radius: 28px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        /* Phone Header */
        .phone-header {
          height: 48px;
          background: #0b0b0d;
          border-bottom: 1px solid var(--border-light);
          padding: 0 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          color: var(--text-gray);
          z-index: 10;
        }

        .agent-title-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
        }

        .agent-avatar-mini {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1px solid var(--accent-neon-border);
          overflow: hidden;
          background: var(--bg-charcoal);
        }

        .agent-avatar-mini img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .agent-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .agent-name {
          font-weight: 700;
          color: var(--text-white);
          line-height: 1.1;
        }

        .agent-title-label {
          font-size: 0.6rem;
          color: var(--accent-neon);
        }

        /* Phone Body */
        .phone-body {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }

        /* Screen States */
        .phone-screen-idle {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 24px;
          text-align: center;
        }

        .avatar-pulse-container {
          position: relative;
          width: 140px;
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 32px;
        }

        .pulse-circle {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: var(--accent-neon);
          opacity: 0.05;
        }

        .p-1 { opacity: 0.06; }
        .p-2 { opacity: 0.03; }

        .avatar-core-glow {
          width: 100px;
          height: 100px;
          background: var(--bg-charcoal);
          border: 2px solid var(--accent-neon-border);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          box-shadow: 0 0 30px rgba(199, 255, 61, 0.1);
        }

        .avatar-logo {
          width: 54px;
          height: 54px;
          object-fit: contain;
        }

        .phone-screen-idle h2 {
          font-size: 1.5rem;
          margin-bottom: 12px;
        }

        .phone-screen-idle p {
          font-size: 0.85rem;
          color: var(--text-gray);
          margin-bottom: 32px;
          max-width: 220px;
        }

        .start-call-btn {
          padding: 12px 24px;
          font-size: 0.9rem;
          box-shadow: 0 0 20px rgba(199, 255, 61, 0.2);
        }

        /* Screen Dialing */
        .phone-screen-dialing {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 24px;
          background: radial-gradient(circle at center, rgba(199,255,61,0.05) 0%, rgba(0,0,0,0) 70%);
        }

        .dial-pulse {
          width: 90px;
          height: 90px;
          background: rgba(199, 255, 61, 0.05);
          border: 1px solid var(--accent-neon-border);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 32px;
          color: var(--accent-neon);
          animation: float 2s infinite ease-in-out;
        }

        .dial-icon-spin {
          animation: spin-slow 3s infinite linear;
        }

        .dialing-status {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 8px;
        }

        .hang-up-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #ef4444;
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 48px;
          box-shadow: 0 5px 15px rgba(239, 68, 68, 0.4);
          transition: var(--transition-fast);
        }

        .hang-up-btn:hover {
          transform: scale(1.05);
          background: #f87171;
        }

        /* Screen Connected */
        .phone-screen-connected {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
        }

        .phone-visualizer-box {
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid var(--border-light);
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
        }

        .call-status {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--accent-neon);
        }

        .call-timer {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 4px;
          color: var(--text-white);
        }

        .waveform-label {
          font-size: 0.65rem;
          color: var(--text-muted);
          margin-top: 4px;
        }

        /* Chat Log */
        .phone-chat-log {
          flex-grow: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: rgba(0, 0, 0, 0.2);
        }

        .chat-bubble-wrapper {
          display: flex;
          width: 100%;
        }

        .chat-bubble-wrapper.agent {
          justify-content: flex-start;
        }

        .chat-bubble-wrapper.user {
          justify-content: flex-end;
        }

        .chat-bubble {
          max-width: 80%;
          padding: 10px 14px;
          border-radius: 14px;
          font-size: 0.85rem;
          line-height: 1.4;
          text-align: left;
        }

        .agent .chat-bubble {
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-light);
          border: 1px solid var(--border-light);
          border-bottom-left-radius: 2px;
        }

        .user .chat-bubble {
          background: var(--accent-neon);
          color: var(--bg-pure);
          font-weight: 500;
          border-bottom-right-radius: 2px;
        }

        /* Typing indicators */
        .typing-bubble {
          display: flex;
          gap: 4px;
          padding: 12px 16px;
        }

        .typing-bubble .dot {
          width: 6px;
          height: 6px;
          background: var(--text-gray);
          border-radius: 50%;
          animation: wave-pulse 1s infinite alternate;
        }

        .typing-bubble .dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-bubble .dot:nth-child(3) { animation-delay: 0.4s; }

        /* Phone Controls */
        .phone-controls {
          padding: 16px;
          background: #0b0b0d;
          border-top: 1px solid var(--border-light);
          flex-shrink: 0;
        }

        .speech-controls-row {
          display: flex;
          justify-content: space-around;
          align-items: center;
          margin-bottom: 16px;
        }

        .control-circle-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border-light);
          color: var(--text-white);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-fast);
        }

        .control-circle-btn:hover {
          background: rgba(255,255,255,0.1);
        }

        .control-circle-btn.active-listening {
          background: var(--accent-neon);
          color: var(--bg-pure);
          border-color: var(--accent-neon);
          box-shadow: 0 0 15px var(--accent-neon-glow);
          animation: pulse-neon 2s infinite;
        }

        .control-circle-btn.muted {
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.02);
        }

        .hang-up-btn-mini {
          background: #ef4444;
          border-color: #ef4444;
        }

        .hang-up-btn-mini:hover {
          background: #f87171;
          border-color: #f87171;
        }

        .mic-unsupported-tag {
          font-size: 0.65rem;
          color: var(--text-muted);
          background: rgba(255,255,255,0.02);
          padding: 4px 8px;
          border-radius: 4px;
        }

        /* Quick Prompts */
        .quick-prompts-container {
          margin-bottom: 16px;
          text-align: left;
        }

        .quick-prompt-label {
          font-size: 0.7rem;
          color: var(--text-muted);
          display: block;
          margin-bottom: 8px;
        }

        .quick-prompts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          max-height: 90px;
          overflow-y: auto;
        }

        .quick-prompt-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-light);
          color: var(--text-gray);
          font-size: 0.72rem;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
          text-align: left;
          transition: var(--transition-fast);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .quick-prompt-btn:hover:not(:disabled) {
          border-color: var(--accent-neon);
          color: var(--text-white);
          background: rgba(199, 255, 61, 0.05);
        }

        .quick-prompt-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Text fallback Form */
        .text-chat-form {
          display: flex;
          gap: 8px;
          height: 38px;
        }

        .chat-input {
          flex-grow: 1;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 0 12px;
          color: var(--text-white);
          font-size: 0.8rem;
          font-family: var(--font-sans);
        }

        .chat-input:focus {
          outline: none;
          border-color: var(--accent-neon);
        }

        .chat-submit-btn {
          width: 38px;
          background: var(--accent-neon);
          border: none;
          color: var(--bg-pure);
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-fast);
        }

        .chat-submit-btn:hover:not(:disabled) {
          background: #d4ff66;
        }

        .chat-submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: var(--text-muted);
        }

        .call-ended-options {
          text-align: center;
          padding: 16px 0;
        }

        .call-ended-options h3 {
          font-size: 1.1rem;
          margin-bottom: 12px;
        }
      `}</style>
    </div>
  );
}
