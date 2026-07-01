# Deploying BePawnest — turnkey guide

This is a static site (HTML/CSS/JS, **no build step**). Everything below is set up
and ready; you just need to create the accounts and click through. Budget ~10–15 min.

There are 3 one-time things only you can do (security: I can't create accounts,
buy a domain, or enter payment for you):

1. **Buy a domain**
2. **Create a host account + connect the repo**
3. **Paste in your PayPal + Google tracking IDs**

---

## Step 1 — Push the code to GitHub

A git repo is already initialised in this folder with a first commit.
Create an empty repo on github.com (no README), then:

```bash
cd storefront
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git branch -M main
git push -u origin main
```

## Step 2 — Deploy on Cloudflare Pages (recommended) or Netlify

**Cloudflare Pages** — best for paid traffic (unlimited bandwidth, fastest CDN, bot protection):
1. Sign up / log in at <https://dash.cloudflare.com> → **Workers & Pages → Create → Pages → Connect to Git**.
2. Pick your repo.
3. Build settings: **Framework preset: None**, **Build command: (leave blank)**, **Build output directory: `/`**.
4. Deploy. You get a live `*.pages.dev` URL in ~1 minute. Every `git push` auto-deploys.

**Netlify** — simplest alternative:
1. <https://app.netlify.com> → **Add new site → Import an existing project** → pick your repo.
2. Build command: blank. Publish directory: `/`. Deploy.
   *(Or skip Git entirely: drag the `storefront` folder onto <https://app.netlify.com/drop>.)*

## Step 3 — Connect your custom domain (REQUIRED for Google Ads)

> Do **not** run ads at a `*.pages.dev` / `*.netlify.app` subdomain — Google distrusts
> them and it hurts approval. A real domain (~$10/yr) is non-negotiable.

1. Buy a brandable `.com` (Cloudflare Registrar is at-cost; Namecheap/Porkbun also fine).
2. In your host's dashboard → **Custom domains → add your domain** and follow the DNS steps.
3. HTTPS is provisioned automatically and free. Wait for the cert to go green.

## Step 4 — Turn on payments + tracking

All of these live in **`assets/js/products.js`** (top `STORE` block):

| Field | Where to get it | What it does |
|---|---|---|
| `paypalClientId` | developer.paypal.com → Apps & Credentials → **Live** | Real payments (currently `"sb"` = test mode) |
| `siteUrl` | your domain, e.g. `"https://yourstore.com"` | Canonical tags, Open Graph, structured data |
| `ga4Id` | analytics.google.com → Admin → Data Streams → `G-XXXX` | Google Analytics 4 |
| `googleAdsId` | ads.google.com → Tools → Conversions → tag → `AW-XXXX` | Google Ads tag |
| `adsConversionLabel` | the purchase conversion action's label | Fires the purchase conversion |

Then update two more places:
- **`robots.txt`** and **`sitemap.xml`**: replace `YOUR-DOMAIN.com` with your real domain.
- **`contact.html`**: replace the placeholder business name/address; set `supportEmail` in `products.js`.

Commit + push, and it's live.

---

## How tracking works (already wired)

`assets/js/seo-analytics.js` loads Google's tag with **Consent Mode v2** (everything
denied until the visitor accepts the cookie banner — EU/UK safe). It fires the standard
Google Ads / GA4 ecommerce events automatically:

- `add_to_cart` — when a product is added
- `begin_checkout` — when the cart page loads with items
- `purchase` + Google Ads `conversion` — on a completed PayPal payment (with order value + ID)

Nothing tracks and no banner shows until you fill in `ga4Id` or `googleAdsId`, so the
site works untouched during development.

## ⚠️ Before you scale ad spend

1. **Harden payments server-side.** The PayPal flow here captures payment in the browser.
   Fine for launch/testing, but a determined user could alter the amount. Add a serverless
   function (or PayPal webhook) to verify/capture orders before putting real budget behind it.
2. **Replace placeholder product images** with real photos (Google rates landing-page quality).
3. **Use a real, monitored support inbox** and accurate business details.
4. **Don't make health claims** you can't back up on the posture/wellness items.

## Google Ads launch checklist

- [ ] Custom domain live with HTTPS
- [ ] Real product photos in `assets/img/`
- [ ] Real business name/address/email (contact page + `products.js`)
- [ ] Live PayPal Client ID; currency matches your PayPal account
- [ ] `ga4Id` + `googleAdsId` + `adsConversionLabel` set; test a sandbox purchase and confirm the conversion fires
- [ ] `siteUrl` set; `robots.txt` + `sitemap.xml` domain updated
- [ ] Submit `sitemap.xml` in Google Search Console
- [ ] Policy pages (shipping/returns/privacy/terms) accurate to how you operate
