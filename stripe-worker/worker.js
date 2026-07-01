/* ===========================================================================
   BePawnest — Stripe checkout Worker (Cloudflare)
   --------------------------------------------------------------------------
   A tiny, self-contained backend. The storefront POSTs its cart here; this
   Worker builds the order from its OWN price list (so the browser can't fake
   prices), creates a Stripe Checkout Session, and returns the pay URL.

   Deploy this as a standalone Cloudflare Worker and set ONE secret:
       STRIPE_SECRET_KEY   (sk_test_... to start, sk_live_... when live)
   Then paste this Worker's URL into assets/js/products.js -> checkoutApiUrl.
   Full steps: see stripe-worker/README.md
   ======================================================================== */

// Authoritative prices in cents. KEEP IN SYNC with assets/js/products.js.
const CATALOG = {
  "slow-feeder":      { name: "No-Gulp Slow Feeder Bowl",                 amount: 1995 },
  "deshedding-brush": { name: "FurEase Self-Cleaning Deshedding Brush",   amount: 2495 },
  "calming-bed":      { name: "CloudNest Calming Donut Bed",              amount: 4495 },
  "treat-puzzle":     { name: "BrainyPaws Treat Puzzle Toy",              amount: 2295 },
  "lick-mat":         { name: "CalmLick Slow-Feed Lick Mat (2-pack)",     amount: 1695 },
  "no-pull-harness":  { name: "EasyWalk No-Pull Dog Harness",             amount: 2995 },
};

const CURRENCY = "usd";
const SITE = "https://bepawnest.com";
const SHIP_TO = ["US", "CA", "GB", "AU", "IE", "NZ"];

// Origins allowed to call this Worker (CORS).
const ALLOWED_ORIGINS = [
  "https://bepawnest.com",
  "https://www.bepawnest.com",
  "http://localhost:4173",
];

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    const url = new URL(request.url);
    try {
      if (url.pathname === "/create-checkout-session" && request.method === "POST") {
        return await createSession(request, env, cors);
      }
      if (url.pathname === "/session-status" && request.method === "GET") {
        return await sessionStatus(url, env, cors);
      }
      return json({ ok: true, service: "BePawnest checkout" }, 200, cors);
    } catch (err) {
      return json({ error: "server error" }, 500, cors);
    }
  },
};

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : SITE;
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

async function createSession(request, env, cors) {
  if (!env.STRIPE_SECRET_KEY) return json({ error: "checkout not configured" }, 500, cors);

  let cart;
  try { cart = (await request.json()).cart; } catch { return json({ error: "bad request" }, 400, cors); }
  if (!Array.isArray(cart) || cart.length === 0) return json({ error: "empty cart" }, 400, cors);

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", `${SITE}/success.html?session_id={CHECKOUT_SESSION_ID}`);
  params.set("cancel_url", `${SITE}/cart.html`);
  params.set("billing_address_collection", "auto");
  params.set("phone_number_collection[enabled]", "true");
  SHIP_TO.forEach((c, i) => params.set(`shipping_address_collection[allowed_countries][${i}]`, c));

  let i = 0;
  for (const line of cart) {
    const p = CATALOG[line && line.id];
    if (!p) continue;
    const qty = Math.max(1, Math.min(99, parseInt(line.qty, 10) || 1));
    params.set(`line_items[${i}][price_data][currency]`, CURRENCY);
    params.set(`line_items[${i}][price_data][product_data][name]`, p.name);
    params.set(`line_items[${i}][price_data][unit_amount]`, String(p.amount));
    params.set(`line_items[${i}][quantity]`, String(qty));
    i++;
  }
  if (i === 0) return json({ error: "no valid items" }, 400, cors);

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  const data = await res.json();
  if (!res.ok) return json({ error: (data.error && data.error.message) || "stripe error" }, 502, cors);
  return json({ url: data.url }, 200, cors);
}

async function sessionStatus(url, env, cors) {
  if (!env.STRIPE_SECRET_KEY) return json({ error: "not configured" }, 500, cors);
  const id = url.searchParams.get("session_id");
  if (!id) return json({ error: "missing session_id" }, 400, cors);

  const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(id)}`, {
    headers: { "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}` },
  });
  const data = await res.json();
  if (!res.ok) return json({ error: "not found" }, 404, cors);
  return json({
    paid: data.payment_status === "paid",
    amount_total: data.amount_total,
    currency: data.currency,
  }, 200, cors);
}
