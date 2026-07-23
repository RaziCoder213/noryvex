import React from 'react';
import { Shield } from 'lucide-react';

export default function Privacy({ setActivePage }) {
  return (
    <div className="legal-page page-enter">
      <div className="legal-hero">
        <div className="container">
          <div className="legal-hero-icon"><Shield size={28} /></div>
          <span className="section-tag">Legal</span>
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-subtitle">Last updated: July 23, 2025</p>
        </div>
      </div>

      <div className="container legal-body">
        <div className="legal-content">

          <section className="legal-section">
            <h2>1. Introduction</h2>
            <p>Welcome to Noryvex ("we", "our", or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>
          </section>

          <section className="legal-section">
            <h2>2. Information We Collect</h2>
            <p>We may collect information about you in a variety of ways:</p>
            <ul>
              <li><strong>Personal Data:</strong> Name, email address, phone number, and company name when you fill out our contact form or book a strategy call.</li>
              <li><strong>Usage Data:</strong> Information about how you access and use our website, including your IP address, browser type, pages visited, and time spent on pages.</li>
              <li><strong>Communications:</strong> Any messages, inquiries, or other content you send us directly.</li>
              <li><strong>Cookies &amp; Tracking:</strong> We use cookies and similar tracking technologies to track activity on our website. See Section 7 for more details.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Respond to your inquiries and fulfill your requests</li>
              <li>Send you information about our services, offers, and updates (with your consent)</li>
              <li>Improve, personalize, and optimize our website and services</li>
              <li>Analyze usage trends to enhance user experience</li>
              <li>Comply with applicable legal obligations</li>
              <li>Prevent fraudulent or unauthorized activity</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Sharing Your Information</h2>
            <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except:</p>
            <ul>
              <li><strong>Service Providers:</strong> Trusted third-party vendors who assist us in operating our website (e.g., hosting, email, analytics).</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or government authority.</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Data Retention</h2>
            <p>We retain your personal data only as long as necessary to fulfill the purposes outlined in this policy, or as required by law. Contact form submissions are retained for up to 24 months. You may request deletion of your data at any time.</p>
          </section>

          <section className="legal-section">
            <h2>6. Data Security</h2>
            <p>We implement appropriate technical and organizational security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section className="legal-section">
            <h2>7. Cookies</h2>
            <p>We use cookies to enhance your experience on our website. Cookies are small data files placed on your device. We use:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for basic website functionality and cannot be disabled.</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our site.</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and choices.</li>
            </ul>
            <p>You can control cookies through your browser settings or by using our cookie consent banner. Disabling non-essential cookies will not affect core website functionality.</p>
          </section>

          <section className="legal-section">
            <h2>8. Your Rights</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul>
              <li>Right to access your personal data</li>
              <li>Right to correct inaccurate data</li>
              <li>Right to request deletion of your data</li>
              <li>Right to withdraw consent at any time</li>
              <li>Right to data portability</li>
              <li>Right to lodge a complaint with a supervisory authority</li>
            </ul>
            <p>To exercise any of these rights, contact us at <a href="mailto:hello@trynoryvex.com">hello@trynoryvex.com</a>.</p>
          </section>

          <section className="legal-section">
            <h2>9. Third-Party Links</h2>
            <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites. We encourage you to review their privacy policies before submitting any personal information.</p>
          </section>

          <section className="legal-section">
            <h2>10. Children's Privacy</h2>
            <p>Our services are not directed to individuals under the age of 16. We do not knowingly collect personal data from children. If you believe we have inadvertently collected information from a minor, please contact us immediately.</p>
          </section>

          <section className="legal-section">
            <h2>11. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on this page with a revised effective date. Your continued use of our website after changes constitute acceptance of the updated policy.</p>
          </section>

          <section className="legal-section">
            <h2>12. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <div className="legal-contact-card">
              <p><strong>Noryvex</strong></p>
              <p>Email: <a href="mailto:hello@trynoryvex.com">hello@trynoryvex.com</a></p>
              <p>LinkedIn: <a href="https://www.linkedin.com/company/noryvex" target="_blank" rel="noopener noreferrer">linkedin.com/company/noryvex</a></p>
            </div>
          </section>

        </div>
      </div>

      <style>{`
        .legal-page { min-height: 100vh; }
        .legal-hero {
          padding: 120px 0 60px;
          background: linear-gradient(180deg, rgba(199,255,61,0.04) 0%, transparent 100%);
          border-bottom: 1px solid var(--border-light);
          text-align: center;
        }
        .legal-hero-icon {
          width: 56px; height: 56px;
          background: rgba(199,255,61,0.08);
          border: 1px solid var(--accent-neon-border);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          color: var(--accent-neon);
          margin: 0 auto 20px;
        }
        .legal-title {
          font-size: clamp(2.2rem, 5vw, 3.5rem);
          margin: 12px 0 8px;
        }
        .legal-subtitle { font-size: 0.9rem; color: var(--text-muted); }
        .legal-body { padding: 80px 24px; }
        .legal-content { max-width: 780px; margin: 0 auto; }
        .legal-section { margin-bottom: 48px; }
        .legal-section h2 {
          font-size: 1.25rem;
          color: var(--text-white);
          margin-bottom: 14px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--border-light);
        }
        .legal-section p { margin-bottom: 12px; line-height: 1.7; }
        .legal-section ul { margin: 12px 0 12px 20px; }
        .legal-section ul li { margin-bottom: 8px; color: var(--text-gray); line-height: 1.6; }
        .legal-section strong { color: var(--text-white); }
        .legal-section a { color: var(--accent-neon); text-decoration: none; }
        .legal-section a:hover { text-decoration: underline; }
        .legal-contact-card {
          background: rgba(199,255,61,0.03);
          border: 1px solid var(--border-light);
          border-radius: 12px;
          padding: 24px;
          margin-top: 16px;
        }
        .legal-contact-card p { margin-bottom: 8px; }
      `}</style>
    </div>
  );
}
