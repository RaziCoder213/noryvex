import { useEffect } from 'react';

/**
 * useSEO — Updates document.title, meta description, og:title,
 * og:description and canonical link dynamically on each page change.
 * Keeps search engines and social scrapers happy.
 */

const BASE_URL = 'https://trynoryvex.com';
const SITE_NAME = 'Noryvex';

const PAGE_META = {
  home: {
    title: 'AI Receptionist for Dental Clinics — Free Demo First | Noryvex',
    description: 'Noryvex builds custom AI voice receptionists for dental clinics. GPT-4o powered. We build your demo free first — you only pay when you love it. 50+ AI assistants deployed, 15K+ patient calls handled. 24/7 call answering, appointment booking, and patient FAQ handling. No software to learn.',
    canonical: `${BASE_URL}/`,
  },
  solutions: {
    title: 'AI Voice Agent Solutions for Dental Clinics | Noryvex',
    description: 'Explore Noryvex\'s full AI service suite: Custom AI Voice Receptionists, 24/7 Call Handling, Appointment Booking Automation, Patient FAQ AI, CRM & Calendar Integration, HIPAA-aware Infrastructure. GPT-4o LLM-powered. Free demo built for every clinic before payment.',
    canonical: `${BASE_URL}/solutions`,
  },
  'live-demo': {
    title: 'Live AI Dental Receptionist Demo — Talk to Chloe | Noryvex',
    description: 'Experience a Noryvex AI dental receptionist live in your browser. Talk to Chloe — our GPT-4o powered AI voice agent — and hear how she handles patient calls, answers dental FAQs, and books appointments in real time. Free to try, no login required.',
    canonical: `${BASE_URL}/live-demo`,
  },
  about: {
    title: 'About Noryvex | AI Voice Agent Agency Built for Dental Clinics',
    description: 'Noryvex is founded by Muhammad Razi, a Full-Stack AI Developer specializing in LLM-powered voice agents and conversational AI. We\'ve shipped 50+ custom AI receptionists for dental clinics across 12+ US states. Learn why dental practices trust Noryvex.',
    canonical: `${BASE_URL}/about`,
  },
  contact: {
    title: 'Get Your Free AI Receptionist Demo | Book a Strategy Call | Noryvex',
    description: 'Request a free custom AI receptionist demo for your dental clinic — built by Noryvex in 48 hours, zero commitment. Book a strategy call via calendar (full timezone support), chat on WhatsApp, or connect on Slack. No upfront cost. You only pay when you\'re ready.',
    canonical: `${BASE_URL}/contact`,
  },
  privacy: {
    title: 'Privacy Policy | Noryvex AI Receptionist Agency',
    description: 'Read the Noryvex Privacy Policy — how we collect, use, and protect your personal data and clinic information in compliance with GDPR, HIPAA-aware standards, and applicable privacy regulations.',
    canonical: `${BASE_URL}/privacy`,
  },
  terms: {
    title: 'Terms of Service | Noryvex AI Receptionist Agency',
    description: 'Read the Noryvex Terms of Service — the rules governing use of our website, AI receptionist services, and automation solutions for dental clinics.',
    canonical: `${BASE_URL}/terms`,
  },
  calculator: {
    title: 'Dental Missed Call Revenue Calculator | How Much Are You Losing? | Noryvex',
    description: 'Calculate exactly how much revenue your dental clinic loses every month from missed patient calls. Free tool by Noryvex — enter your call volume and conversion rate. Takes 30 seconds. Most dental practices lose $3,000–$15,000+ monthly from unanswered calls.',
    canonical: `${BASE_URL}/calculator`,
  },
};

function setMeta(name, content, attr = 'name') {
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
    setMeta('description',    meta.description);
    setMeta('author',         'Muhammad Razi — Noryvex');

    // Open Graph
    setMeta('og:title',       meta.title,       'property');
    setMeta('og:description', meta.description, 'property');
    setMeta('og:url',         meta.canonical,   'property');
    setMeta('og:site_name',   SITE_NAME,        'property');

    // Twitter
    setMeta('twitter:title',       meta.title);
    setMeta('twitter:description', meta.description);
    setMeta('twitter:url',         meta.canonical);

    // Canonical
    setCanonical(meta.canonical);
  }, [pageId]);
}
