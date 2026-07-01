/* ===========================================================================
   store.js — storefront engine (cart, rendering, checkout, tracking hooks)
   Depends on products.js (STORE + PRODUCTS) being loaded first.
   Fires analytics events via window.HEARTHLY_TRACK (defined in seo-analytics.js)
   when it is present — guarded so the store works fine without it.
   ======================================================================== */
(function () {
  "use strict";

  const CART_KEY = "hearthly_cart_v1";
  let checkoutTracked = false;              // begin_checkout fires once per page load
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const money = (n) => STORE.currencySymbol + Number(n).toFixed(2);
  const track = (fn, arg) => { try { window.HEARTHLY_TRACK && window.HEARTHLY_TRACK[fn] && window.HEARTHLY_TRACK[fn](arg); } catch (e) {} };
  const lineItem = (l) => { const p = byId(l.id); return { item_id: l.id, item_name: p && p.name, price: p && p.price, quantity: l.qty }; };

  /* ---- Cart state ---------------------------------------------------- */
  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  }
  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
  }
  function cartCount() {
    return getCart().reduce((n, l) => (byId(l.id) ? n + l.qty : n), 0);
  }
  function cartTotal() {
    return getCart().reduce((sum, l) => {
      const p = byId(l.id);
      return p ? sum + p.price * l.qty : sum;
    }, 0);
  }
  function addToCart(id, qty = 1) {
    const cart = getCart();
    const line = cart.find((l) => l.id === id);
    if (line) line.qty += qty;
    else cart.push({ id, qty });
    saveCart(cart);
    toast(`Added to cart`);
    const p = byId(id);
    if (p) track("addToCart", { item_id: id, item_name: p.name, price: p.price, quantity: qty, value: p.price * qty });
  }
  function setQty(id, qty) {
    let cart = getCart();
    if (qty <= 0) cart = cart.filter((l) => l.id !== id);
    else { const l = cart.find((x) => x.id === id); if (l) l.qty = qty; }
    saveCart(cart);
  }

  function updateCartCount() {
    const n = cartCount();
    $$(".cart-count").forEach((el) => {
      el.textContent = n;
      el.style.display = n > 0 ? "grid" : "none";
    });
  }

  /* ---- Toast --------------------------------------------------------- */
  let toastTimer;
  function toast(msg) {
    let t = $(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      document.body.appendChild(t);
    }
    t.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
      msg;
    requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ---- Small render helpers ------------------------------------------ */
  function starRow(rating, reviews) {
    const full = Math.round(rating);
    const stars = "★★★★★".slice(0, full) + "☆☆☆☆☆".slice(0, 5 - full);
    const rev = reviews != null ? `<span>(${reviews.toLocaleString()})</span>` : "";
    return `<div class="stars">${stars} ${rev}</div>`;
  }
  function savePct(p) {
    if (!p.compareAt || p.compareAt <= p.price) return null;
    return Math.round((1 - p.price / p.compareAt) * 100);
  }

  function productCard(p) {
    const save = savePct(p);
    return `
      <article class="card">
        <a class="card-media" href="product.html?id=${p.id}">
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
          ${save ? `<span class="badge save">−${save}%</span>` : ""}
          <img src="${p.image}" alt="${p.name}" width="600" height="600" loading="lazy">
        </a>
        <div class="card-body">
          <a href="product.html?id=${p.id}"><h3>${p.name}</h3></a>
          ${starRow(p.rating, p.reviews)}
          <p class="card-tag">${p.tagline}</p>
          <div class="price-row">
            <span class="price">${money(p.price)}</span>
            ${p.compareAt ? `<span class="price-old">${money(p.compareAt)}</span>` : ""}
          </div>
          <button class="btn btn-dark btn-block" data-add="${p.id}">Add to cart</button>
        </div>
      </article>`;
  }

  /* ---- Page: product grid (home) ------------------------------------- */
  function renderGrid() {
    const grid = $("#product-grid");
    if (!grid) return;
    grid.innerHTML = PRODUCTS.map(productCard).join("");
  }

  /* ---- Page: product detail ------------------------------------------ */
  function renderPDP() {
    const root = $("#pdp");
    if (!root) return;
    const id = new URLSearchParams(location.search).get("id");
    const p = byId(id) || PRODUCTS[0];
    document.title = `${p.name} — ${STORE.name}`;
    const save = savePct(p);
    const gallery = p.gallery && p.gallery.length ? p.gallery : [p.image];

    root.innerHTML = `
      <div class="pdp-gallery">
        <div class="main"><img id="pdp-main" src="${gallery[0]}" alt="${p.name}" width="600" height="600"></div>
        ${gallery.length > 1 ? `<div class="thumbs">${gallery
          .map((g, i) => `<button class="${i === 0 ? "active" : ""}" data-thumb="${g}"><img src="${g}" alt=""></button>`)
          .join("")}</div>` : ""}
      </div>
      <div class="pdp-info">
        <div class="crumb"><a href="index.html">Home</a> / <a href="index.html#shop">Shop</a> / ${p.name}</div>
        ${starRow(p.rating, p.reviews)}
        <h1>${p.name}</h1>
        <div class="pdp-price">
          <span class="price">${money(p.price)}</span>
          ${p.compareAt ? `<span class="price-old">${money(p.compareAt)}</span>` : ""}
          ${save ? `<span class="pill">Save ${save}%</span>` : ""}
        </div>
        <p class="pdp-desc">${p.description}</p>
        <ul class="features">
          ${p.features.map((f) => `<li>${check()} <span>${f}</span></li>`).join("")}
        </ul>
        <div class="buy-row">
          <div class="qty">
            <button data-qty="-1" aria-label="Decrease">−</button>
            <input id="pdp-qty" value="1" inputmode="numeric" aria-label="Quantity">
            <button data-qty="1" aria-label="Increase">+</button>
          </div>
          <button class="btn btn-primary btn-lg" id="pdp-add">Add to cart — ${money(p.price)}</button>
        </div>
        <div class="assurance">
          <div>${ico('<path d="M20 6 9 17l-5-5"/>')} 30-day returns</div>
          <div>${ico('<rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>')} Free tracked shipping</div>
          <div>${ico('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>')} Secure PayPal checkout</div>
        </div>
      </div>`;

    // spec table
    const specEl = $("#pdp-specs");
    if (specEl && p.specs) {
      specEl.innerHTML = `<h2>Specifications</h2><table class="spec-table"><tbody>${Object.entries(p.specs)
        .map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`)
        .join("")}</tbody></table>`;
    }

    injectProductJsonLd(p);

    // interactions
    const qtyInput = $("#pdp-qty");
    root.addEventListener("click", (e) => {
      const t = e.target.closest("[data-thumb]");
      if (t) {
        $("#pdp-main").src = t.dataset.thumb;
        $$(".thumbs button").forEach((b) => b.classList.toggle("active", b === t));
      }
      const q = e.target.closest("[data-qty]");
      if (q) {
        let v = Math.max(1, (parseInt(qtyInput.value, 10) || 1) + parseInt(q.dataset.qty, 10));
        qtyInput.value = v;
      }
      if (e.target.id === "pdp-add") addToCart(p.id, Math.max(1, parseInt(qtyInput.value, 10) || 1));
    });

    // related products
    const rel = $("#related-grid");
    if (rel) {
      rel.innerHTML = PRODUCTS.filter((x) => x.id !== p.id).slice(0, 3).map(productCard).join("");
    }
  }

  function injectProductJsonLd(p) {
    const base = (typeof STORE !== "undefined" && STORE.siteUrl) ? STORE.siteUrl.replace(/\/+$/, "") + "/" : "";
    const data = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      description: p.description,
      image: base + p.image,
      brand: { "@type": "Brand", name: STORE.name },
      aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviews },
      offers: {
        "@type": "Offer",
        price: p.price.toFixed(2),
        priceCurrency: STORE.currency,
        availability: "https://schema.org/InStock"
      }
    };
    let el = document.getElementById("pdp-jsonld");
    if (!el) { el = document.createElement("script"); el.id = "pdp-jsonld"; el.type = "application/ld+json"; document.head.appendChild(el); }
    el.textContent = JSON.stringify(data);
  }

  /* ---- Page: cart + PayPal checkout ---------------------------------- */
  function renderCart() {
    const root = $("#cart-root");
    if (!root) return;
    const cart = getCart();

    if (!cart.length) {
      root.innerHTML = `
        <div class="empty-cart">
          ${ico('<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>', 56)}
          <h2>Your cart is empty</h2>
          <p class="muted">Looks like you haven't added anything yet.</p>
          <a class="btn btn-primary" href="index.html#shop">Browse products</a>
        </div>`;
      return;
    }

    const lines = cart.map((l) => {
      const p = byId(l.id);
      if (!p) return "";
      return `
        <div class="cart-line" data-line="${p.id}">
          <img src="${p.image}" alt="${p.name}">
          <div>
            <h4>${p.name}</h4>
            <div class="muted" style="font-size:.85rem">${money(p.price)} each</div>
            <div class="qty" style="margin-top:.5rem">
              <button data-line-qty="-1">−</button>
              <input value="${l.qty}" readonly aria-label="Quantity">
              <button data-line-qty="1">+</button>
            </div>
            <button class="remove" data-remove>Remove</button>
          </div>
          <div class="cart-line-price">${money(p.price * l.qty)}</div>
        </div>`;
    }).join("");

    const total = cartTotal();
    root.innerHTML = `
      <div class="cart-layout">
        <div>
          <h1 style="font-size:2rem">Your cart</h1>
          ${lines}
        </div>
        <aside class="summary">
          <h3>Order summary</h3>
          <div class="sum-row"><span>Subtotal</span><span>${money(total)}</span></div>
          <div class="sum-row"><span>Shipping</span><span style="color:var(--ok);font-weight:600">FREE</span></div>
          <div class="sum-row total"><span>Total</span><span>${money(total)}</span></div>
          <div id="paypal-button-container"></div>
          <p class="pay-note">${ico('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>', 13)} Encrypted checkout via PayPal. No account required — pay by card too.</p>
        </aside>
      </div>`;

    // line interactions are handled by the single document-level listener
    // (see "global wiring") so re-rendering the cart never stacks handlers.
    if (!checkoutTracked) {
      checkoutTracked = true;
      track("beginCheckout", { value: total, items: cart.map(lineItem) });
    }
    mountPayPal(total);
  }

  /* ---- PayPal ---------------------------------------------------------
     Loads the PayPal JS SDK with the Client ID from products.js, then
     renders Smart Buttons. "sb" = sandbox; swap for your live Client ID. */
  function mountPayPal(total) {
    const container = $("#paypal-button-container");
    if (!container) return;

    function render() {
      if (!window.paypal) {
        container.innerHTML =
          '<p class="muted" style="font-size:.85rem">PayPal could not load. Check your Client ID in <code>assets/js/products.js</code> and your connection.</p>';
        return;
      }
      container.innerHTML = "";
      window.paypal.Buttons({
        style: { color: "gold", shape: "pill", label: "paypal", height: 48 },
        createOrder: (data, actions) =>
          actions.order.create({
            purchase_units: [{
              amount: {
                value: total.toFixed(2),
                currency_code: STORE.currency
              },
              description: `${STORE.name} order`
            }]
          }),
        onApprove: (data, actions) =>
          actions.order.capture().then((details) => {
            const name = details?.payer?.name?.given_name || "there";
            const orderTotal = cartTotal();
            const orderItems = getCart().map(lineItem);
            track("purchase", {
              transactionId: (details && details.id) || (data && data.orderID),
              value: orderTotal,
              items: orderItems
            });
            saveCart([]);
            $("#cart-root").innerHTML = `
              <div class="empty-cart">
                ${ico('<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>', 56)}
                <h2>Thank you, ${name}! 🎉</h2>
                <p class="muted">Your order is confirmed. A receipt is on its way to your email.<br>
                We'll send tracking once it ships.</p>
                <a class="btn btn-primary" href="index.html">Continue shopping</a>
              </div>`;
            window.scrollTo({ top: 0, behavior: "smooth" });
          }),
        onError: () => toast("Payment could not be completed. Please try again.")
      }).render("#paypal-button-container");
    }

    if (window.paypal) { render(); return; }
    // inject SDK once
    if (!document.getElementById("paypal-sdk")) {
      const s = document.createElement("script");
      s.id = "paypal-sdk";
      s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(STORE.paypalClientId)}&currency=${STORE.currency}`;
      s.onload = render;
      s.onerror = () => { container.innerHTML = '<p class="muted" style="font-size:.85rem">Could not reach PayPal. Add your live Client ID in <code>assets/js/products.js</code>.</p>'; };
      document.head.appendChild(s);
    } else {
      document.getElementById("paypal-sdk").addEventListener("load", render);
    }
  }

  /* ---- tiny icon helpers --------------------------------------------- */
  function ico(inner, size = 16) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  }
  function check() {
    return ico('<path d="M20 6 9 17l-5-5"/>', 18);
  }

  /* ---- global wiring ------------------------------------------------- */
  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (add) { e.preventDefault(); addToCart(add.dataset.add, 1); }
    const mt = e.target.closest(".menu-toggle");
    if (mt) $(".nav-links")?.classList.toggle("open");

    // cart line +/- and remove (cart page). Bound once here so renderCart()
    // re-renders never accumulate duplicate handlers.
    const wrap = e.target.closest("[data-line]");
    if (wrap) {
      const id = wrap.dataset.line;
      const line = getCart().find((l) => l.id === id);
      if (e.target.closest("[data-remove]")) { setQty(id, 0); renderCart(); }
      const q = e.target.closest("[data-line-qty]");
      if (q && line) { setQty(id, line.qty + parseInt(q.dataset.lineQty, 10)); renderCart(); }
    }
  });

  // inject brand name / year wherever marked
  function fillBrand() {
    $$("[data-store-name]").forEach((el) => (el.textContent = STORE.name));
    $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
    $$("[data-support-email]").forEach((el) => {
      el.textContent = STORE.supportEmail;
      if (el.tagName === "A") el.href = "mailto:" + STORE.supportEmail;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    fillBrand();
    updateCartCount();
    renderGrid();
    renderPDP();
    renderCart();

    // contact form (demo — wire to Formspree/your backend in production)
    const cf = $("#contact-form");
    if (cf) cf.addEventListener("submit", (e) => {
      e.preventDefault();
      cf.reset();
      toast("Thanks — we'll reply within 24 hours.");
    });
  });
})();
