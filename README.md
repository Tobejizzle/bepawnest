# Hearthly — Google Ads dropshipping storefront

A fast, conversion-focused static storefront built for **Google Ads dropshipping**.
Pure HTML/CSS/vanilla JS — no build step, no framework, no platform fee. PayPal
checkout, Google Ads / GA4 conversion tracking, and Consent Mode v2 are all wired in.

👉 **To deploy, follow [DEPLOY.md](DEPLOY.md).**

## What's included

```
storefront/
├── index.html          Home / storefront
├── product.html        Product detail page (reads ?id=)
├── cart.html           Cart + PayPal checkout
├── about.html          About / brand story
├── contact.html        Contact form + business details
├── shipping.html       Shipping policy   ┐
├── returns.html        Returns & refunds ├─ required for Google Ads approval
├── privacy.html        Privacy policy    │
├── terms.html          Terms of service  ┘
├── 404.html            Branded not-found page
├── robots.txt          Crawl rules (set your domain)
├── sitemap.xml         Sitemap (set your domain)
├── _headers            Security + cache headers (Cloudflare Pages / Netlify)
└── assets/
    ├── css/styles.css         Design system — edit :root variables to rebrand
    ├── js/products.js         ← YOUR STORE: products, prices, PayPal + tracking IDs
    ├── js/store.js            Cart + rendering + checkout engine + event hooks
    ├── js/seo-analytics.js    Google tag, Consent Mode v2, cookie banner, dynamic SEO
    └── img/                   Placeholder images (.svg) + generator + favicon
```

## Run it locally

```bash
cd storefront
node serve.js          # → http://localhost:4173
```

## The one file you edit: `assets/js/products.js`

- **Store details** — name, support email, currency (`STORE`).
- **Products** — the `PRODUCTS` array (id, name, price, compareAt, image, gallery, description, features, specs).
- **Product photos** — drop square images into `assets/img/` and point `image`/`gallery` at them. Regenerate placeholders any time with `node assets/img/_generate.js`.
- **Payments + tracking** — `paypalClientId`, `siteUrl`, `ga4Id`, `googleAdsId`, `adsConversionLabel`.
- **Rebrand colors** — `:root` variables at the top of `assets/css/styles.css`.

## Built-in Google Ads optimization

- **Conversion tracking** — `add_to_cart`, `begin_checkout`, and `purchase` + Google Ads `conversion` fire automatically (GA4 ecommerce format). Add your IDs to switch it on.
- **Consent Mode v2** — cookie banner; tags stay denied until the visitor accepts (EU/UK safe).
- **SEO** — per-page titles/descriptions, canonical + Open Graph (from `siteUrl`), JSON-LD `Organization` (home) and `Product` (product pages) structured data, sitemap, robots.
- **Performance** — static + CDN-friendly, images carry width/height (no layout shift), lazy-loaded grid, `font-display: swap`, cache headers.
- **Trust** — full policy pages, contact info, secure PayPal checkout — what Google looks for in dropshipping reviews.

## Connect the contact form (optional)

The form shows a confirmation only. To receive messages, use [Formspree](https://formspree.io):
set `<form id="contact-form">` to `action="https://formspree.io/f/XXXX" method="POST"` and
remove the demo `#contact-form` submit handler in `store.js`.

---

See **[DEPLOY.md](DEPLOY.md)** for the full launch + Google Ads checklist.
