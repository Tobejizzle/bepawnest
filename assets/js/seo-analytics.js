/* ===========================================================================
   seo-analytics.js — Google Ads + GA4 tracking, Consent Mode v2, dynamic SEO.
   --------------------------------------------------------------------------
   Config comes from STORE in products.js (ga4Id, googleAdsId,
   adsConversionLabel, siteUrl). NOTHING loads and NO cookie banner appears
   until you fill in at least one tag ID — so the store works untouched.

   Loaded with `defer` in <head>, which runs AFTER products.js (end of body)
   so STORE is available, but before DOMContentLoaded so tracking is ready
   before any user interaction.
   ======================================================================== */
(function () {
  "use strict";
  var cfg = (typeof STORE !== "undefined" && STORE) ? STORE : {};
  var GA4 = (cfg.ga4Id || "").trim();
  var ADS = (cfg.googleAdsId || "").trim();
  var LABEL = (cfg.adsConversionLabel || "").trim();
  var SITE = (cfg.siteUrl || "").replace(/\/+$/, "");
  var CURRENCY = cfg.currency || "USD";
  var enabled = !!(GA4 || ADS);
  var CONSENT_KEY = "hearthly_consent_v1";

  /* ---- dynamic SEO: canonical + Open Graph + Twitter ----------------- */
  function meta(attr, key, val) {
    if (!val) return;
    var el = document.head.querySelector("meta[" + attr + '="' + key + '"]');
    if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
    el.setAttribute("content", val);
  }
  function link(rel, href) {
    var el = document.head.querySelector('link[rel="' + rel + '"]');
    if (!el) { el = document.createElement("link"); el.setAttribute("rel", rel); document.head.appendChild(el); }
    el.setAttribute("href", href);
  }
  function applySEO() {
    var descEl = document.head.querySelector('meta[name="description"]');
    var desc = (descEl && descEl.content) || cfg.tagline || "";
    var title = document.title;
    if (SITE) {
      var full = SITE + location.pathname + location.search;
      link("canonical", full.split("?")[0]);
      meta("property", "og:url", full);
      meta("property", "og:image", SITE + "/assets/img/hero.svg");
      meta("name", "twitter:image", SITE + "/assets/img/hero.svg");
    }
    meta("property", "og:title", title);
    meta("property", "og:description", desc);
    meta("property", "og:type", "website");
    meta("property", "og:site_name", cfg.name || "");
    meta("name", "twitter:card", "summary_large_image");
    meta("name", "twitter:title", title);
    meta("name", "twitter:description", desc);
  }

  /* ---- Organization structured data (homepage only) ------------------ */
  function orgJsonLd() {
    var path = location.pathname;
    var isHome = path === "/" || path === "" || /\/index\.html$/.test(path);
    if (!isHome) return;
    var data = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: cfg.name,
      description: cfg.tagline,
      email: cfg.supportEmail
    };
    if (SITE) { data.url = SITE; data.logo = SITE + "/assets/img/favicon.svg"; }
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }

  /* ---- Consent Mode v2 + gtag ---------------------------------------- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  function grant() {
    gtag("consent", "update", {
      ad_storage: "granted", ad_user_data: "granted",
      ad_personalization: "granted", analytics_storage: "granted"
    });
  }
  function loadGtag() {
    var id = GA4 || ADS;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
    gtag("js", new Date());
    if (GA4) gtag("config", GA4);
    if (ADS) gtag("config", ADS);
  }

  if (enabled) {
    // Default everything denied until the visitor chooses (EU/UK safe).
    gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      wait_for_update: 500
    });
    var prior = null;
    try { prior = localStorage.getItem(CONSENT_KEY); } catch (e) {}
    if (prior === "granted") grant();
    loadGtag();
  }

  /* ---- consent banner ------------------------------------------------ */
  function showBanner() {
    if (!enabled) return;
    var prior = null;
    try { prior = localStorage.getItem(CONSENT_KEY); } catch (e) {}
    if (prior) return;
    var bar = document.createElement("div");
    bar.className = "consent-banner";
    bar.innerHTML =
      "<p>We use cookies to improve your experience and measure our advertising. " +
      'See our <a href="privacy.html">privacy policy</a>.</p>' +
      '<div class="consent-actions">' +
      '<button class="btn btn-ghost" data-consent="deny">Decline</button>' +
      '<button class="btn btn-primary" data-consent="accept">Accept</button>' +
      "</div>";
    document.body.appendChild(bar);
    bar.addEventListener("click", function (e) {
      var b = e.target.closest("[data-consent]");
      if (!b) return;
      var choice = b.dataset.consent === "accept" ? "granted" : "denied";
      try { localStorage.setItem(CONSENT_KEY, choice); } catch (e) {}
      if (choice === "granted") grant();
      bar.remove();
    });
  }

  /* ---- tracking API consumed by store.js ----------------------------- */
  window.HEARTHLY_TRACK = {
    addToCart: function (item) {
      if (!enabled) return;
      gtag("event", "add_to_cart", {
        currency: CURRENCY,
        value: item.value != null ? item.value : (item.price * item.quantity),
        items: [item]
      });
    },
    beginCheckout: function (o) {
      if (!enabled) return;
      gtag("event", "begin_checkout", { currency: CURRENCY, value: o.value, items: o.items });
    },
    purchase: function (o) {
      if (!enabled) return;
      gtag("event", "purchase", {
        transaction_id: o.transactionId, currency: CURRENCY, value: o.value, items: o.items
      });
      if (ADS && LABEL) {
        gtag("event", "conversion", {
          send_to: ADS + "/" + LABEL,
          value: o.value, currency: CURRENCY, transaction_id: o.transactionId
        });
      }
    }
  };

  /* ---- run ----------------------------------------------------------- */
  applySEO();
  orgJsonLd();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showBanner);
  } else {
    showBanner();
  }
})();
