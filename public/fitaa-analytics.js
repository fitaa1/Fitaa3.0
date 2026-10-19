/*
  FITAA ANALYTICS · one file for every page on this site
  ──────────────────────────────────────────────────────
  1. Google Analytics 4 (views + clicks): paste the Measurement ID into GA_ID below.
     It starts with G- and is public, not a secret. Until it's pasted, GA stays off.
  2. Vercel Web Analytics (views): switch it on in Vercel, Project → Analytics → Enable.
     Nothing to paste here. On Vercel's free plan it counts page views only.
  3. Only real visits count: preview links and your own testing on other hosts are ignored.
     Add a new domain to LIVE_HOSTS when the site moves (e.g. fitaacreative.com).

  Clicks sent to GA4 as events (see them in GA → Reports → Engagement → Events):
    whatsapp_click   any WhatsApp link or button
    booking_request  a demo booking form sent to WhatsApp
    call_click       phone links        email_click   email links
    demo_open        a demo card on the Fully Booked page
    niche_switch     the Hosts / Studios switch
    outbound_click   any other link that leaves the site
  Each event carries: label (button text), page, and niche (hosts or studios) when known.

  Copying a page to another site? Copy this file too, or remove its <script> tag.
*/
(function () {
  var GA_ID = 'G-D62TL0T2VD';            // Fitaa Creative GA4 property (public ID, not a secret)
  var LIVE_HOSTS = ['fitaacreative.vercel.app', 'fitaadigital.vercel.app', 'fitaacreative.com', 'www.fitaacreative.com'];
  var VERCEL_ANALYTICS = true;           // false if this site moves off Vercel

  var live = LIVE_HOSTS.indexOf(location.hostname) !== -1;
  var gaOn = live && /^G-[A-Z0-9]{6,}$/.test(GA_ID) && GA_ID !== 'G-XXXXXXXXXX';

  function load(src) { var s = document.createElement('script'); s.defer = true; s.src = src; document.head.appendChild(s); }

  if (live && VERCEL_ANALYTICS) {
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
    load('/_vercel/insights/script.js');
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  if (gaOn) {
    load('https://www.googletagmanager.com/gtag/js?id=' + GA_ID);
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }

  // Public helper: pages call fitaaTrack('booking_request', { label: '...' })
  window.fitaaTrack = function (name, params) {
    params = params || {};
    params.page = params.page || location.pathname;
    if (window.FITAA_NICHE && !params.niche) params.niche = window.FITAA_NICHE;
    if (gaOn) window.gtag('event', name, params);
    if (!live && window.console) console.debug('[fitaa-analytics, not live]', name, params);
  };

  function label(el) {
    return (el.getAttribute('data-track') || el.getAttribute('aria-label') || el.textContent || '')
      .replace(/\s+/g, ' ').trim().slice(0, 80);
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('a,[data-niche]') : null;
    if (!t) return;
    if (t.hasAttribute('data-niche') && !t.href) {
      return window.fitaaTrack('niche_switch', { label: t.getAttribute('data-niche'), niche: t.getAttribute('data-niche') });
    }
    var href = t.getAttribute('href') || '';
    if (/wa\.me|whatsapp\.com/i.test(href)) return window.fitaaTrack('whatsapp_click', { label: label(t) });
    if (/^tel:/i.test(href)) return window.fitaaTrack('call_click', { label: label(t) });
    if (/^mailto:/i.test(href)) return window.fitaaTrack('email_click', { label: label(t) });
    if (t.classList.contains('demo')) return window.fitaaTrack('demo_open', { label: label(t), niche: t.getAttribute('data-for') || undefined });
    if (t.host && t.host !== location.host) return window.fitaaTrack('outbound_click', { label: label(t), link_url: t.href });
  }, true);
})();
