# BePawnest checkout Worker (Stripe)

This is the small backend that lets your static store take real card payments
through **Stripe Checkout**. It runs as a standalone Cloudflare Worker. Your
storefront POSTs the cart to it; it builds the order from its *own* price list
(so prices can't be faked in the browser), creates a Stripe Checkout Session,
and hands back the pay URL. The customer pays on Stripe's hosted page and
returns to `success.html`.

> **VPN off.** Create your Stripe account with any VPN/proxy disabled — Stripe's
> identity/bank verification uses the same fraud checks that blocked PayPal.

---

## 1. Get your Stripe test key
1. Sign up at [dashboard.stripe.com](https://dashboard.stripe.com) (free).
2. Make sure **Test mode** is ON (toggle, top-right).
3. **Developers → API keys** → copy the **Secret key** (`sk_test_...`).
   - The Secret key is sensitive — it goes only into Cloudflare (next step). **Never** commit it or paste it anywhere public.

## 2. Deploy this Worker on Cloudflare
**Dashboard (easiest):**
1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages → Create → Create Worker**.
2. Name it `bepawnest-checkout` → **Deploy** (the placeholder code is fine for now).
3. **Edit code** → delete the placeholder → paste the entire contents of `worker.js` → **Deploy**.

**Or with Wrangler CLI:**
```bash
cd stripe-worker
npx wrangler deploy worker.js --name bepawnest-checkout --compatibility-date 2024-11-01
```

## 3. Add your Stripe secret key to the Worker
In the Worker → **Settings → Variables and Secrets → Add**:
- Type: **Secret**
- Name: `STRIPE_SECRET_KEY`
- Value: your `sk_test_...` key → **Save and deploy**.

## 4. Connect the storefront to the Worker
1. Copy the Worker's URL (e.g. `https://bepawnest-checkout.YOURNAME.workers.dev`).
2. In `assets/js/products.js`, set:
   ```js
   checkoutApiUrl: "https://bepawnest-checkout.YOURNAME.workers.dev",
   ```
3. Commit + push. Cloudflare redeploys the site; the checkout button goes live.

## 5. Test it (test mode — no real money)
On the live cart, click **Proceed to secure checkout**. On Stripe's page use the
test card:
- Card `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP.

You should land on `success.html` ("Thank you!") and see the payment in your
Stripe **Test mode** dashboard.

## 6. Go live (real money)
1. In Stripe, complete **account activation** (business details + bank + identity — the KYC step). VPN off.
2. Switch Stripe to **Live mode**, copy the **live** Secret key (`sk_live_...`).
3. Update the Worker's `STRIPE_SECRET_KEY` secret to the live key (Settings → Variables and Secrets).
4. Do one small real purchase to confirm, then refund yourself in Stripe.

---

### Keep prices in sync
The Worker has its own `CATALOG` (prices in cents) — that's deliberate, so the
server, not the browser, decides the price. **If you change a price in
`assets/js/products.js`, update the matching amount in `worker.js` too** and
redeploy the Worker.

### What's collected
Stripe Checkout collects the customer's card, email, phone, and **shipping
address** — everything you need to fulfil the order. Line items carry each
product name, so your Stripe dashboard shows exactly what was bought.
