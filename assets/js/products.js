/* ===========================================================================
   PRODUCT CATALOG  —  edit this file to manage your store.
   --------------------------------------------------------------------------
   To add/replace a product:
     1. Drop a real product photo into assets/img/  (square JPG/PNG works best)
     2. Copy one of the blocks below and update the fields.
     3. `image` / `gallery` paths are relative to the site root.
   Prices are in whatever currency you set CURRENCY to (must match your PayPal account).
   ======================================================================== */

const STORE = {
  name: "Hearthly",
  tagline: "Small upgrades for everyday living.",
  currency: "USD",
  currencySymbol: "$",
  supportEmail: "support@hearthly.example",   // <-- change to your real inbox
  // PayPal: replace "sb" with your live Client ID from developer.paypal.com.
  // "sb" = sandbox (test) mode and will NOT take real money.
  paypalClientId: "sb",

  // ---- Live site URL (set this once your domain is connected) -----------
  // Powers canonical tags, Open Graph, and structured data. e.g. "https://yourstore.com"
  siteUrl: "",

  // ---- Google Ads / Analytics (paste your IDs to switch tracking on) ----
  // Nothing loads and no cookie banner shows until at least one is filled in.
  ga4Id: "",                 // GA4 Measurement ID, e.g. "G-XXXXXXXXXX"
  googleAdsId: "",           // Google Ads ID, e.g. "AW-1234567890"
  adsConversionLabel: ""     // Purchase conversion label, e.g. "AbC-D_efGh1iJ2"
};

const PRODUCTS = [
  {
    id: "posture-brace",
    name: "PostureLift Support Brace",
    tagline: "Gently trains your shoulders back so you sit and stand taller — all day comfort.",
    price: 34.95,
    compareAt: 59.95,
    rating: 4.8,
    reviews: 1294,
    badge: "Bestseller",
    image: "assets/img/posture-brace.svg",
    gallery: ["assets/img/posture-brace.svg", "assets/img/posture-brace-2.svg"],
    description:
      "Slouching all day takes a toll on your neck and back. The PostureLift brace uses a breathable, adjustable design to keep your shoulders aligned without digging in — so good posture becomes a habit, not a chore.",
    features: [
      "Adjustable figure-8 straps fit chest sizes 28\"–48\"",
      "Breathable mesh stays cool under clothing",
      "Lightweight — wear it 20–30 min a day to build the habit",
      "Discreet enough to wear under a shirt"
    ],
    specs: {
      Material: "Breathable mesh + soft-touch padding",
      Sizing: "One size, fully adjustable (28–48\" chest)",
      Weight: "180 g",
      "In the box": "1 × brace, fit guide"
    }
  },
  {
    id: "sunset-lamp",
    name: "Aura Sunset Projection Lamp",
    tagline: "Wash any room in a warm golden-hour glow with a twist of the head.",
    price: 29.95,
    compareAt: 49.95,
    rating: 4.9,
    reviews: 2071,
    badge: "Trending",
    image: "assets/img/sunset-lamp.svg",
    gallery: ["assets/img/sunset-lamp.svg", "assets/img/sunset-lamp-2.svg"],
    description:
      "The lamp that took over everyone's feed. Project a rich, photogenic sunset onto your wall or ceiling in seconds. The rotating head lets you dial the angle for the perfect ambient glow — ideal for bedrooms, photos, and unwinding.",
    features: [
      "180° rotating head aims the glow anywhere",
      "16 colour modes from sunset orange to aurora red",
      "USB-powered — plug into any adapter or power bank",
      "Photographer-favourite warm, even light"
    ],
    specs: {
      Power: "USB-C, 5 V (adapter not included)",
      Modes: "16 colours, adjustable brightness",
      Cable: "1.5 m USB-C",
      "In the box": "1 × lamp, USB-C cable"
    }
  },
  {
    id: "spin-scrubber",
    name: "TurboClean Cordless Spin Scrubber",
    tagline: "Power through grime in the bath, tile, and kitchen — no scrubbing by hand.",
    price: 49.95,
    compareAt: 89.95,
    rating: 4.7,
    reviews: 863,
    badge: "Save 44%",
    image: "assets/img/spin-scrubber.svg",
    gallery: ["assets/img/spin-scrubber.svg", "assets/img/spin-scrubber-2.svg"],
    description:
      "Let the motor do the work. TurboClean spins at up to 400 RPM to lift soap scum, grout grime, and stuck-on residue while you simply guide it. The extendable handle reaches tubs, tiles, and corners without you bending or kneeling.",
    features: [
      "Up to 400 RPM removes grime hands-free",
      "4 interchangeable brush heads for every surface",
      "Extends to 110 cm — clean without bending",
      "IPX7 waterproof, rechargeable (90 min runtime)"
    ],
    specs: {
      Battery: "Rechargeable Li-ion, ~90 min per charge",
      Speed: "Up to 400 RPM",
      "Waterproof": "IPX7 rated",
      "In the box": "Handle, 4 brush heads, USB charger"
    }
  },
  {
    id: "laptop-stand",
    name: "Elevate Aluminium Laptop Stand",
    tagline: "Bring your screen to eye level and end the neck strain — folds flat to travel.",
    price: 39.95,
    compareAt: 69.95,
    rating: 4.9,
    reviews: 1542,
    badge: "Staff pick",
    image: "assets/img/laptop-stand.svg",
    gallery: ["assets/img/laptop-stand.svg", "assets/img/laptop-stand-2.svg"],
    description:
      "A healthier desk in one move. Elevate raises your laptop to a natural eye line, opening airflow underneath to keep it cool. Aircraft-grade aluminium feels rock-solid, yet the whole thing folds flat to slip into your bag.",
    features: [
      "6 adjustable height angles for the perfect eye line",
      "Open design improves airflow & cooling",
      "Fits 10\"–17\" laptops; silicone pads grip & protect",
      "Folds flat — only 1.5 cm thick to carry"
    ],
    specs: {
      Material: "Aircraft-grade aluminium alloy",
      Compatibility: "10\"–17\" laptops",
      Folded: "1.5 cm thick, 240 g",
      "In the box": "1 × stand, carry pouch"
    }
  },
  {
    id: "mini-blender",
    name: "FreshGo Portable Mini Blender",
    tagline: "Blend smoothies anywhere and drink straight from the bottle.",
    price: 32.95,
    compareAt: 54.95,
    rating: 4.6,
    reviews: 977,
    badge: "New",
    image: "assets/img/mini-blender.svg",
    gallery: ["assets/img/mini-blender.svg", "assets/img/mini-blender-2.svg"],
    description:
      "Smoothies on your schedule. FreshGo's six stainless blades crush fruit, ice, and protein in 30 seconds, then the jar becomes your travel bottle. USB-rechargeable, so it goes from gym bag to office to trail.",
    features: [
      "6 stainless-steel blades crush ice & frozen fruit",
      "USB-C rechargeable — ~15 blends per charge",
      "BPA-free 380 ml jar doubles as a travel bottle",
      "One-button blend with safety lock"
    ],
    specs: {
      Capacity: "380 ml",
      Battery: "4000 mAh, USB-C rechargeable",
      Blades: "6 × 304 stainless steel",
      "In the box": "Blender, lid, USB-C cable"
    }
  },
  {
    id: "knee-pillow",
    name: "AlignRest Memory Foam Knee Pillow",
    tagline: "Side-sleeper relief — keeps hips and spine aligned through the night.",
    price: 24.95,
    compareAt: 39.95,
    rating: 4.8,
    reviews: 1816,
    badge: "Bestseller",
    image: "assets/img/knee-pillow.svg",
    gallery: ["assets/img/knee-pillow.svg", "assets/img/knee-pillow-2.svg"],
    description:
      "Wake up without the morning ache. AlignRest's contoured memory foam sits between your knees to keep your hips, pelvis, and spine in a neutral line — easing pressure for side sleepers and anyone with lower-back tension.",
    features: [
      "Ergonomic contour keeps hips & spine aligned",
      "Premium memory foam holds its shape all night",
      "Removable, machine-washable breathable cover",
      "Adjustable strap keeps it in place as you move"
    ],
    specs: {
      Material: "High-density memory foam",
      Cover: "Removable, machine-washable",
      Dimensions: "25 × 20 × 15 cm",
      "In the box": "1 × pillow, washable cover, strap"
    }
  }
];
