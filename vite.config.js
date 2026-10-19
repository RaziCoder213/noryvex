import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const STATIC_ROUTES = {
  solutions: {
    title: 'AI Automation Solutions & Custom Voice AI Agents | Noryvex USA',
    description: 'Explore Noryvex artificial intelligence solutions: 24/7 AI Voice Receptionists, Dental Clinic Call Automation, CRM & PMS Workflow Sync (Dentrix, Eaglesoft, Open Dental), and Custom AI Software Development.',
    keywords: 'AI automation services USA, custom AI voice agents, dental AI solutions, CRM workflow automation, artificial intelligence development agency, HIPAA voice AI, Dentrix AI integration, Eaglesoft AI integration, Open Dental automation, Noryvex solutions',
    canonical: 'https://trynoryvex.com/solutions',
    h1: 'AI Automation Solutions &amp; Custom 24/7 AI Voice Receptionists',
    lead: 'Complete voice and workflow infrastructure built and managed by Noryvex: 24/7 AI Voice Receptionists, Automated Appointment Capture, Dental FAQ &amp; Insurance Handling, Emergency Call Escalation, and Direct Dentrix, Eaglesoft &amp; Open Dental PMS Sync.',
  },
  'live-demo': {
    title: 'Live AI Voice Receptionist Demo — Hear Noryvex AI in Action',
    description: 'Experience our sub-500ms latency AI voice receptionist live in your browser. Hear how Noryvex AI answers calls, handles clinic FAQs, triages emergencies, and books appointments in real time.',
    keywords: 'live AI voice agent demo, AI receptionist demo, conversational voice AI test, dental AI receptionist audio demo, Noryvex live demo, interactive AI phone agent',
    canonical: 'https://trynoryvex.com/live-demo',
    h1: 'Live AI Voice Receptionist Demo — Hear Noryvex AI in Action',
    lead: 'Experience our sub-500ms latency AI voice receptionist live in your browser. Hear how Chloe answers patient calls, handles dental clinic FAQs, triages urgent emergencies, and captures appointment requests in real time.',
  },
  calculator: {
    title: 'Missed Call Revenue Calculator for Dental Clinics & Businesses | Noryvex',
    description: 'Calculate how much monthly revenue your dental practice or business loses to unanswered calls and voicemail. Free instant ROI calculator by Noryvex AI Automation Agency.',
    keywords: 'missed call revenue calculator, dental clinic ROI calculator, missed patient call cost, AI receptionist ROI, dental practice revenue loss calculator, Noryvex calculator',
    canonical: 'https://trynoryvex.com/calculator',
    h1: 'Missed Call Revenue Calculator for Dental Clinics &amp; Businesses',
    lead: 'Calculate how much monthly revenue your dental practice or service business loses to unanswered calls and voicemail with our transparent, step-by-step ROI calculator.',
  },
  about: {
    title: 'About Noryvex & Founder Muhammad Razi | USA AI Automation Agency',
    description: 'Meet Muhammad Razi, Founder & Lead AI Architect at Noryvex. Learn how our USA AI automation agency engineers founder-reviewed, HIPAA-compliant 24/7 AI voice receptionists in 48 hours.',
    keywords: 'Muhammad Razi, Noryvex founder, Lead AI Architect, about Noryvex AI, US AI automation agency team, HIPAA compliant AI engineering, custom voice AI developers',
    canonical: 'https://trynoryvex.com/about',
    h1: 'About Noryvex &amp; Founder Muhammad Razi — USA AI Automation Agency',
    lead: 'Meet Muhammad Razi, Founder &amp; Lead AI Architect at Noryvex. Every AI voice receptionist and automation pipeline is founder-reviewed, sandbox-tested, and deployed within 48 hours under HIPAA-compliant security.',
  },
  contact: {
    title: 'Claim Your Free Custom AI Demo | Contact Noryvex AI Agency',
    description: 'Get a free custom AI voice receptionist demo built specifically for your clinic or business in 48 hours. Book a strategy call with Noryvex or request your risk-free prototype today.',
    keywords: 'free AI receptionist demo, book AI automation strategy call, contact Noryvex, custom dental AI demo, hire AI automation agency USA, Noryvex contact',
    canonical: 'https://trynoryvex.com/contact',
    h1: 'Claim Your Free Custom AI Voice Receptionist Demo',
    lead: 'We build a working custom AI receptionist demo using your real clinic or business name, services, hours, and FAQs within 48 hours at zero cost. Test it live before paying a single dollar.',
  },
  trial: {
    title: 'Claim Your Free Custom AI Demo | Contact Noryvex AI Agency',
    description: 'Get a free custom AI voice receptionist demo built specifically for your clinic or business in 48 hours. Book a strategy call with Noryvex or request your risk-free prototype today.',
    keywords: 'free AI receptionist demo, custom dental AI demo, Noryvex free trial prototype',
    canonical: 'https://trynoryvex.com/contact',
    h1: 'Claim Your Free Custom AI Voice Receptionist Demo',
    lead: 'We build a working custom AI receptionist demo using your real clinic or business name, services, hours, and FAQs within 48 hours at zero cost.',
  },
  call: {
    title: 'Book a Strategy Call | Noryvex AI Automation Agency',
    description: 'Book a 1-on-1 strategy call with Muhammad Razi at Noryvex to discuss custom 24/7 AI voice receptionists and workflow automation for your practice.',
    keywords: 'book AI strategy call, Noryvex consultation, dental AI receptionist consultation',
    canonical: 'https://trynoryvex.com/contact',
    h1: 'Book a Strategy Call with Noryvex AI Automation Agency',
    lead: 'Schedule a 15-minute discovery and strategy session to see how a custom 24/7 AI voice receptionist integrates with your clinic or business.',
  },
  privacy: {
    title: 'Privacy Policy & HIPAA Data Security | Noryvex AI',
    description: 'Read the Noryvex Privacy Policy — how we protect patient and business data using TLS 1.3 encryption, AES-256 storage, signed HIPAA BAAs, and zero public model training.',
    keywords: 'Noryvex privacy policy, HIPAA compliant AI privacy, dental AI data security, Business Associate Agreement BAA AI',
    canonical: 'https://trynoryvex.com/privacy',
    h1: 'Privacy Policy &amp; HIPAA Data Security — Noryvex',
    lead: 'How Noryvex protects client and patient information using TLS 1.3 in-transit encryption, AES-256 storage, signed HIPAA Business Associate Agreements (BAAs), and strict access controls.',
  },
  terms: {
    title: 'Terms of Service | Noryvex AI Automation Agency',
    description: 'Read the Noryvex Terms of Service governing the use of our AI voice receptionists, workflow automation systems, and custom software services.',
    keywords: 'Noryvex terms of service, AI automation agency terms, Noryvex legal agreement',
    canonical: 'https://trynoryvex.com/terms',
    h1: 'Terms of Service — Noryvex AI Automation Agency',
    lead: 'Terms and conditions governing the use of the Noryvex website, AI voice receptionists, workflow automation systems, and custom software services.',
  },
};

function generateStaticRouteHtmlPlugin() {
  return {
    name: 'noryvex-static-route-html',
    closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist');
      const indexFile = path.join(distDir, 'index.html');
      if (!fs.existsSync(indexFile)) return;

      const baseHtml = fs.readFileSync(indexFile, 'utf8');

      // 1. Generate per-route static index.html files for Vercel filesystem routing
      for (const [route, meta] of Object.entries(STATIC_ROUTES)) {
        const routeHtml = baseHtml
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${meta.title}</title>`)
          .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${meta.canonical}" />`)
          .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${meta.description}" />`)
          .replace(/<meta name="keywords" content="[^"]*"\s*\/?>/, `<meta name="keywords" content="${meta.keywords}" />`)
          .replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${meta.canonical}" />`)
          .replace(/<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${meta.title}" />`)
          .replace(/<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${meta.description}" />`)
          .replace(/<meta name="twitter:url" content="[^"]*"\s*\/?>/, `<meta name="twitter:url" content="${meta.canonical}" />`)
          .replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${meta.title}" />`)
          .replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${meta.description}" />`)
          .replace(/<h1 id="ssr-heading">[\s\S]*?<\/h1>/, `<h1 id="ssr-heading">${meta.h1}</h1>`)
          .replace(/<p id="ssr-description">[\s\S]*?<\/p>/, `<p id="ssr-description">${meta.lead}</p>`);

        const routeDir = path.join(distDir, route);
        fs.mkdirSync(routeDir, { recursive: true });
        fs.writeFileSync(path.join(routeDir, 'index.html'), routeHtml, 'utf8');
      }

      // 2. Generate dist/admin/index.html with noindex, nofollow
      const adminDir = path.join(distDir, 'admin');
      fs.mkdirSync(adminDir, { recursive: true });
      const adminHtml = baseHtml
        .replace(/<title>[\s\S]*?<\/title>/, '<title>Admin Console | Noryvex</title>')
        .replace(/<meta name="robots" content="[^"]*"\s*\/?>/, '<meta name="robots" content="noindex, nofollow" />')
        .replace(/<meta name="googlebot" content="[^"]*"\s*\/?>/, '<meta name="googlebot" content="noindex, nofollow" />');
      fs.writeFileSync(path.join(adminDir, 'index.html'), adminHtml, 'utf8');

      // 3. Generate dist/404.html with noindex, nofollow so Vercel returns true 404
      const notFoundHtml = baseHtml
        .replace(/<title>[\s\S]*?<\/title>/, '<title>404 — Page Not Found | Noryvex</title>')
        .replace(/<meta name="robots" content="[^"]*"\s*\/?>/, '<meta name="robots" content="noindex, nofollow" />')
        .replace(/<meta name="googlebot" content="[^"]*"\s*\/?>/, '<meta name="googlebot" content="noindex, nofollow" />')
        .replace(/<h1 id="ssr-heading">[\s\S]*?<\/h1>/, '<h1 id="ssr-heading">404 — Page Not Found</h1>')
        .replace(/<p id="ssr-description">[\s\S]*?<\/p>/, '<p id="ssr-description">The requested page does not exist. Return to the Noryvex homepage or contact our team.</p>');
      fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml, 'utf8');
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), generateStaticRouteHtmlPlugin()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
