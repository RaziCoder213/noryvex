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
    title: 'Noryvex | AI Voice Agents & Business Automation — Muhammad Razi',
    description: 'Noryvex builds custom AI Voice Agents, Autonomous Receptionists, and Business Automation systems that work 24/7 under 800ms. Founded by Muhammad Razi. Try the live demo free.',
    canonical: `${BASE_URL}/`,
  },
  solutions: {
    title: 'AI Solutions & Services | Noryvex — AI Voice Agents, CRM Automation',
    description: 'Explore Noryvex\'s full suite of AI solutions: Voice Agents, AI Receptionists, Workflow Automation, CRM Integration, Web Apps, Mobile Apps, SaaS Development, and API Integrations.',
    canonical: `${BASE_URL}/#solutions`,
  },
  'live-demo': {
    title: 'Live AI Receptionist Demo — Talk to Chloe | Noryvex',
    description: 'Experience Noryvex AI live. Talk to Chloe — our interactive AI receptionist — and see how AI Voice Agents qualify leads, book meetings, and answer questions in real time.',
    canonical: `${BASE_URL}/#live-demo`,
  },
  about: {
    title: 'About Noryvex & Founder Muhammad Razi | AI Automation Agency',
    description: 'Learn about Noryvex and its founder Muhammad Razi — a Full-Stack AI Developer building the next generation of AI Voice Agents and business automation tools.',
    canonical: `${BASE_URL}/#about`,
  },
  contact: {
    title: 'Book a Free Strategy Call | Noryvex AI Automation',
    description: 'Ready to automate your business? Book a free strategy call with Noryvex. We\'ll design a custom AI Voice Agent or automation solution tailored to your operations.',
    canonical: `${BASE_URL}/#contact`,
  },
  privacy: {
    title: 'Privacy Policy | Noryvex',
    description: 'Read the Noryvex Privacy Policy — how we collect, use, and protect your personal data in compliance with GDPR and applicable privacy regulations.',
    canonical: `${BASE_URL}/#privacy`,
  },
  terms: {
    title: 'Terms of Service | Noryvex',
    description: 'Read the Noryvex Terms of Service — the rules governing use of our website, services, and AI automation solutions.',
    canonical: `${BASE_URL}/#terms`,
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
