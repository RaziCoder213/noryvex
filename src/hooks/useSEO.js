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
    title: 'Noryvex — 24/7 AI Voice Receptionist for Dental Clinics',
    description: 'Never lose another patient to voicemail. Custom AI receptionists that answer calls, handle FAQs, and book appointments 24/7.',
    canonical: `${BASE_URL}/`,
  },
  solutions: {
    title: 'Solutions — Noryvex',
    description: 'Explore how Noryvex automates patient call handling, appointment booking, and clinic communication.',
    canonical: `${BASE_URL}/solutions`,
  },
  'live-demo': {
    title: 'Live Demo — Noryvex',
    description: 'Hear our AI dental receptionist handle real patient scenarios in real-time.',
    canonical: `${BASE_URL}/live-demo`,
  },
  about: {
    title: 'About — Noryvex',
    description: 'Meet the team behind Noryvex and learn why dental clinics trust us with their patient communication.',
    canonical: `${BASE_URL}/about`,
  },
  contact: {
    title: 'Contact — Noryvex',
    description: 'Get your free custom clinic demo. Talk directly with our AI architect.',
    canonical: `${BASE_URL}/contact`,
  },
  privacy: {
    title: 'Privacy Policy — Noryvex',
    description: 'Read the Noryvex Privacy Policy — how we collect, use, and protect your personal data and clinic information in compliance with GDPR, HIPAA-aware standards, and applicable privacy regulations.',
    canonical: `${BASE_URL}/privacy`,
  },
  terms: {
    title: 'Terms of Service — Noryvex',
    description: 'Read the Noryvex Terms of Service — the rules governing use of our website, AI receptionist services, and automation solutions for dental clinics.',
    canonical: `${BASE_URL}/terms`,
  }
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
