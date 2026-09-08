import React from 'react';
import { ArrowRight } from 'lucide-react';

const row1 = [
  { name: 'Trello', icon: '/tools/trello.png' },
  { name: 'Notion', icon: '/tools/notion.png' },
  { name: 'Slack', icon: '/tools/slack.png' },
  { name: 'Google', icon: '/tools/google.png' },
  { name: 'Salesforce', icon: '/tools/salesforce.png' },
  { name: 'Zapier', icon: '/tools/zapier.png' },
];

const row2 = [
  { name: 'Linear', icon: '/tools/linear.png' },
  { name: 'Intercom', icon: '/tools/intercom.png' },
  { name: 'Dropbox', icon: '/tools/dropbox.png' },
  { name: 'Jira', icon: '/tools/jira.png' },
  { name: 'Google Drive', icon: '/tools/drive.png' },
  { name: 'HubSpot', icon: '/tools/hubspot.png' },
];

const row3 = [
  { name: 'Google Sheets', icon: '/tools/sheets.png' },
  { name: 'HubSpot CRM', icon: '/tools/hubspot2.png' },
  { name: 'GitHub', icon: '/tools/github.png' },
  { name: 'Cloud Storage', icon: '/tools/dropbox2.png' },
  { name: 'Notion Team', icon: '/tools/notion.png' },
  { name: 'Slack Connect', icon: '/tools/slack.png' },
];

function TickerRow({ items, direction = 'left', speed = '30s' }) {
  // Repeat items 4 times to ensure seamless infinite looping on all screen sizes
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div className={`tools-ticker-row tools-ticker-${direction}`}>
      <div 
        className="tools-ticker-track" 
        style={{ 
          animationDuration: speed,
          animationDirection: direction === 'right' ? 'reverse' : 'normal'
        }}
      >
        {repeated.map((item, idx) => (
          <div key={`${item.name}-${idx}`} className="tools-card" title={item.name}>
            <img src={item.icon} alt={`${item.name} logo`} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ToolsTicker({ setActivePage }) {
  return (
    <section className="container nrx-reveal" style={{ padding: 'var(--section-padding) 0' }}>
      <div className="framer-tools-section">
        {/* Left column: Heading, copy, CTA */}
        <div className="framer-tools-left">
          <div className="framer-eyebrow">
            <span className="dot" />
            <span>Integrations</span>
          </div>
          <h2 className="framer-tools-title">
            Works with the tools <span className="framer-tools-title-muted">you already use.</span>
          </h2>
          <p className="framer-tools-desc">
            Connect your stack in one click. Noryvex plugs into 100+ apps, clinical PMS platforms, and calendar workflows — with an open API for everything else.
          </p>
          <div className="framer-tools-cta">
            <button 
              onClick={() => setActivePage ? setActivePage('contact') : window.location.assign('/contact')} 
              className="btn-framer-primary"
            >
              Get Free Clinic Demo <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Right column: 3 moving ticker rows */}
        <div className="framer-tools-right">
          <div className="tools-tickers-wrapper">
            <TickerRow items={row1} direction="left" speed="28s" />
            <TickerRow items={row2} direction="right" speed="32s" />
            <TickerRow items={row3} direction="left" speed="26s" />
          </div>
        </div>
      </div>
    </section>
  );
}
