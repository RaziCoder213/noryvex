import React from 'react';
import { FileText } from 'lucide-react';

export default function Terms({ setActivePage }) {
  return (
    <div className="legal-page page-enter">
      <div className="legal-hero">
        <div className="container">
          <div className="legal-hero-icon"><FileText size={28} /></div>
          <span className="section-tag">Legal</span>
          <h1 className="legal-title">Terms of Service</h1>
          <p className="legal-subtitle">Last updated: July 23, 2025</p>
        </div>
      </div>

      <div className="container legal-body">
        <div className="legal-content">

          <section className="legal-section">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using the Noryvex website and services ("Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Services. These Terms apply to all visitors, users, and others who access or use our Services.</p>
          </section>

          <section className="legal-section">
            <h2>2. Description of Services</h2>
            <p>Noryvex provides AI-powered business solutions including, but not limited to:</p>
            <ul>
              <li>AI Voice Agents and virtual receptionists</li>
              <li>Business process and workflow automation</li>
              <li>CRM integrations and data pipeline engineering</li>
              <li>Custom software and SaaS development</li>
              <li>Web and mobile application development</li>
              <li>API integrations and system connectivity</li>
            </ul>
            <p>The specific scope of services for any engagement will be defined in a separate Statement of Work or Service Agreement between Noryvex and the client.</p>
          </section>

          <section className="legal-section">
            <h2>3. Use of Website</h2>
            <p>You agree to use our website only for lawful purposes and in a manner that does not infringe the rights of others. You must not:</p>
            <ul>
              <li>Use the website in any way that violates applicable local, national, or international law</li>
              <li>Transmit unsolicited commercial communications (spam)</li>
              <li>Attempt to gain unauthorized access to any part of our website or systems</li>
              <li>Use automated tools to scrape, crawl, or extract data from our website without written consent</li>
              <li>Reproduce, duplicate, or resell any part of our website without express written permission</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Intellectual Property</h2>
            <p>All content on this website, including but not limited to text, graphics, logos, images, audio clips, and software, is the property of Noryvex or its content suppliers and is protected by applicable intellectual property laws.</p>
            <p>You are granted a limited, non-exclusive, non-transferable license to access and use the website for personal, non-commercial purposes only. No license is granted to reproduce, distribute, or create derivative works without our explicit written consent.</p>
          </section>

          <section className="legal-section">
            <h2>5. Client Deliverables</h2>
            <p>For paid client engagements, the ownership of final deliverables (custom software, AI agents, automations) will be governed by the individual service agreement. Unless otherwise specified:</p>
            <ul>
              <li>Upon full payment, clients receive full ownership of custom-built deliverables specific to their project</li>
              <li>Noryvex retains rights to underlying tools, frameworks, and proprietary methodologies</li>
              <li>Noryvex may showcase completed work in its portfolio unless the client requests confidentiality in writing</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. Payment Terms</h2>
            <p>All pricing and payment terms are outlined in individual client agreements. General terms include:</p>
            <ul>
              <li>A deposit may be required before project commencement</li>
              <li>Invoices are due within the timeframe specified in the agreement</li>
              <li>Late payments may incur interest charges as specified in the contract</li>
              <li>Noryvex reserves the right to pause or terminate services for unpaid invoices</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>7. Confidentiality</h2>
            <p>Both parties agree to keep confidential any proprietary information, business processes, or trade secrets shared during the course of engagement. This obligation survives the termination of any service agreement.</p>
          </section>

          <section className="legal-section">
            <h2>8. Disclaimer of Warranties</h2>
            <p>Our website and services are provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied. Noryvex does not warrant that the website will be uninterrupted, error-free, or free of viruses or other harmful components.</p>
          </section>

          <section className="legal-section">
            <h2>9. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, Noryvex shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or services, even if we have been advised of the possibility of such damages.</p>
            <p>Our total liability for any claim arising from these Terms or your use of our Services shall not exceed the amount paid by you to Noryvex in the three (3) months preceding the claim.</p>
          </section>

          <section className="legal-section">
            <h2>10. Third-Party Services</h2>
            <p>Our services may integrate with or depend on third-party platforms (e.g., HubSpot, Calendly, OpenAI, Twilio). We are not responsible for the availability, performance, or terms of those third-party services. Use of third-party services is subject to their respective terms and conditions.</p>
          </section>

          <section className="legal-section">
            <h2>11. Termination</h2>
            <p>We reserve the right to terminate or suspend your access to our website and services at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.</p>
          </section>

          <section className="legal-section">
            <h2>12. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with applicable law. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in the applicable jurisdiction. If you are unsure of your local jurisdiction requirements, please seek legal advice.</p>
          </section>

          <section className="legal-section">
            <h2>13. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on this page with an updated date. Your continued use of our Services after any modifications constitutes your acceptance of the updated Terms.</p>
          </section>

          <section className="legal-section">
            <h2>14. Contact Us</h2>
            <p>For questions about these Terms, please reach out:</p>
            <div className="legal-contact-card">
              <p><strong>Noryvex</strong></p>
              <p>Email: <a href="mailto:codingwithrazi@gmail.com">codingwithrazi@gmail.com</a></p>
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
        .legal-title { font-size: clamp(2.2rem, 5vw, 3.5rem); margin: 12px 0 8px; }
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
          padding: 24px; margin-top: 16px;
        }
        .legal-contact-card p { margin-bottom: 8px; }
      `}</style>
    </div>
  );
}
