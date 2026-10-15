import { useEffect } from 'react';

/**
 * useSEO — Updates document.title, meta description, meta keywords, og:title,
 * og:description, twitter cards, and canonical link dynamically on each page change.
 * Optimized for US Search Engines (Google, Bing) & AI Engines (ChatGPT, Perplexity, Claude, Gemini).
 */

const BASE_URL = 'https://trynoryvex.com';
const SITE_NAME = 'Noryvex';

export const PAGE_META = {
  home: {
    title: 'Noryvex — AI Automation Agency USA & 24/7 AI Voice Receptionists',
    description: 'Noryvex is a premier USA AI automation agency building custom 24/7 AI voice receptionists, dental clinic AI answering agents, and intelligent workflow automation. Free custom demo built in 48 hours.',
    keywords: 'AI automation agency, AI automation agency USA, artificial intelligence agency, AI voice receptionist, AI receptionist for dental clinics, dental AI receptionist, AI voice agents USA, custom AI solutions, business AI automation, conversational AI agency, HIPAA compliant AI receptionist, Noryvex, trynoryvex',
    canonical: `${BASE_URL}/`,
  },
  solutions: {
    title: 'AI Automation Solutions & Custom Voice AI Agents | Noryvex USA',
    description: 'Explore Noryvex artificial intelligence solutions: 24/7 AI Voice Receptionists, Dental Clinic Call Automation, CRM & PMS Workflow Sync (Dentrix, Eaglesoft, Open Dental), and Custom AI Software Development.',
    keywords: 'AI automation services USA, custom AI voice agents, dental AI solutions, CRM workflow automation, artificial intelligence development agency, HIPAA voice AI, Dentrix AI integration, Eaglesoft AI integration, Open Dental automation, Noryvex solutions',
    canonical: `${BASE_URL}/solutions`,
  },
  'live-demo': {
    title: 'Live AI Voice Receptionist Demo — Hear Noryvex AI in Action',
    description: 'Experience our sub-500ms latency AI voice receptionist live in your browser. Hear how Noryvex AI answers calls, handles clinic FAQs, triages emergencies, and books appointments in real time.',
    keywords: 'live AI voice agent demo, AI receptionist demo, conversational voice AI test, dental AI receptionist audio demo, Noryvex live demo, interactive AI phone agent',
    canonical: `${BASE_URL}/live-demo`,
  },
  calculator: {
    title: 'Missed Call Revenue Calculator for Dental Clinics & Businesses | Noryvex',
    description: 'Calculate how much monthly revenue your dental practice or business loses to unanswered calls and voicemail. Free instant ROI calculator by Noryvex AI Automation Agency.',
    keywords: 'missed call revenue calculator, dental clinic ROI calculator, missed patient call cost, AI receptionist ROI, dental practice revenue loss calculator, Noryvex calculator',
    canonical: `${BASE_URL}/calculator`,
  },
  about: {
    title: 'About Noryvex & Founder Muhammad Razi | USA AI Automation Agency',
    description: 'Meet Muhammad Razi, Founder & Lead AI Architect at Noryvex. Learn how our USA AI automation agency engineers founder-reviewed, HIPAA-compliant 24/7 AI voice receptionists in 48 hours.',
    keywords: 'Muhammad Razi, Noryvex founder, Lead AI Architect, about Noryvex AI, US AI automation agency team, HIPAA compliant AI engineering, custom voice AI developers',
    canonical: `${BASE_URL}/about`,
  },
  contact: {
    title: 'Claim Your Free Custom AI Demo | Contact Noryvex AI Agency',
    description: 'Get a free custom AI voice receptionist demo built specifically for your clinic or business in 48 hours. Book a strategy call with Noryvex or request your risk-free prototype today.',
    keywords: 'free AI receptionist demo, book AI automation strategy call, contact Noryvex, custom dental AI demo, hire AI automation agency USA, Noryvex contact',
    canonical: `${BASE_URL}/contact`,
  },
  privacy: {
    title: 'Privacy Policy & HIPAA Data Security | Noryvex AI',
    description: 'Read the Noryvex Privacy Policy — how we protect patient and business data using TLS 1.3 encryption, AES-256 storage, signed HIPAA BAAs, and zero public model training.',
    keywords: 'Noryvex privacy policy, HIPAA compliant AI privacy, dental AI data security, Business Associate Agreement BAA AI',
    canonical: `${BASE_URL}/privacy`,
  },
  terms: {
    title: 'Terms of Service | Noryvex AI Automation Agency',
    description: 'Read the Noryvex Terms of Service governing the use of our AI voice receptionists, workflow automation systems, and custom software services.',
    keywords: 'Noryvex terms of service, AI automation agency terms, Noryvex legal agreement',
    canonical: `${BASE_URL}/terms`,
  },
};

function setMeta(name, content, attr = 'name') {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(url) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', url);
}

export default function useSEO(pageId) {
  useEffect(() => {
    const meta = PAGE_META[pageId] || PAGE_META.home;

    // Title
    document.title = meta.title;

    // Primary meta
    setMeta('description', meta.description);
    setMeta('keywords', meta.keywords);
    setMeta('author', 'Muhammad Razi — Noryvex AI Automation Agency');

    // Open Graph
    setMeta('og:title', meta.title, 'property');
    setMeta('og:description', meta.description, 'property');
    setMeta('og:url', meta.canonical, 'property');
    setMeta('og:site_name', SITE_NAME, 'property');

    // Twitter
    setMeta('twitter:title', meta.title);
    setMeta('twitter:description', meta.description);
    setMeta('twitter:url', meta.canonical);

    // Canonical
    setCanonical(meta.canonical);
  }, [pageId]);
}
