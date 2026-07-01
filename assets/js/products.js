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
  name: "BePawnest",
  tagline: "Honest essentials for the pets you love.",
  currency: "USD",
  currencySymbol: "$",
  supportEmail: "support@bepawnest.com",   // <-- change if your inbox differs

  // ---- Stripe checkout backend (your Cloudflare Worker URL) -------------
  // After you deploy stripe-worker/worker.js, paste its URL here, e.g.
  // "https://bepawnest-checkout.YOURNAME.workers.dev". Until then the
  // checkout button shows a "not connected" note. See stripe-worker/README.md.
  checkoutApiUrl: "",

  // ---- Live site URL (used for canonical tags, Open Graph, structured data) ----
  siteUrl: "https://bepawnest.com",

  // ---- Google Ads / Analytics (paste your IDs to switch tracking on) ----
  // Nothing loads and no cookie banner shows until at least one is filled in.
  ga4Id: "",                 // GA4 Measurement ID, e.g. "G-XXXXXXXXXX"
  googleAdsId: "",           // Google Ads ID, e.g. "AW-1234567890"
  adsConversionLabel: ""     // Purchase conversion label, e.g. "AbC-D_efGh1iJ2"
};

const PRODUCTS = [
  {
    id: "slow-feeder",
    name: "No-Gulp Slow Feeder Bowl",
    tagline: "Turns fast, gulpy meals into a calm, healthy pace — less bloat, less mess.",
    price: 19.95,
    compareAt: 32.00,
    rating: 4.8,
    reviews: 1643,
    badge: "Bestseller",
    image: "assets/img/slow-feeder.svg",
    gallery: ["assets/img/slow-feeder.svg", "assets/img/slow-feeder-2.svg"],
    description:
      "If your dog inhales dinner in ten seconds flat, this is the fix. The raised maze pattern makes them work for each bite, slowing eating by up to 10× — which helps prevent bloating, vomiting, and that desperate 'I'm starving' act. Honestly, it's the cheapest health upgrade in the shop.",
    features: [
      "Maze design slows eating up to 10× for easier digestion",
      "Food-grade, BPA-free, and dishwasher-safe",
      "Non-slip base stays put through the most enthusiastic eater",
      "Works with dry or wet food — great for dogs & cats"
    ],
    specs: {
      Material: "BPA-free, food-grade plastic",
      Size: "Ø 22 cm, holds up to 2 cups",
      Care: "Top-rack dishwasher safe",
      "In the box": "1 × slow feeder bowl"
    }
  },
  {
    id: "deshedding-brush",
    name: "FurEase Self-Cleaning Deshedding Brush",
    tagline: "Lifts out loose undercoat in minutes, then retracts the bristles with one click.",
    price: 24.95,
    compareAt: 39.95,
    rating: 4.9,
    reviews: 2288,
    badge: "Trending",
    image: "assets/img/deshedding-brush.svg",
    gallery: ["assets/img/deshedding-brush.svg", "assets/img/deshedding-brush-2.svg"],
    description:
      "The brush that ends the fur tumbleweeds. Fine angled bristles reach through the topcoat to lift loose undercoat before it lands on your sofa — then one press of the button retracts the bristles so all that hair wipes straight into the bin. No more picking fur off by hand.",
    features: [
      "Reaches loose undercoat without scratching the skin",
      "One-click retractable bristles for mess-free cleanup",
      "Anti-slip grip stays comfy through long grooming sessions",
      "Works on dogs & cats, short or long hair"
    ],
    specs: {
      Material: "ABS handle, stainless-steel bristles",
      "Best for": "Medium to heavy shedders",
      Care: "Wipe clean",
      "In the box": "1 × deshedding brush"
    }
  },
  {
    id: "calming-bed",
    name: "CloudNest Calming Donut Bed",
    tagline: "A plush raised rim they can burrow into and nuzzle — anxiety-soothing comfort.",
    price: 44.95,
    compareAt: 79.95,
    rating: 4.8,
    reviews: 1412,
    badge: "Save 44%",
    image: "assets/img/calming-bed.svg",
    gallery: ["assets/img/calming-bed.svg", "assets/img/calming-bed-2.svg"],
    description:
      "Dogs and cats are wired to nest, and the CloudNest leans right into it. The puffy raised rim gives their head and neck something to rest against, while the deep faux-fur filling wraps them in self-warming comfort — the kind of hug that settles anxious, restless sleepers. Honestly, they'll pick this over your bed.",
    features: [
      "Raised rim supports head & neck to ease anxiety",
      "Ultra-soft faux fur with deep, self-warming filling",
      "Machine-washable — zips off and tumbles clean",
      "Non-slip base; sizes from cats to large dogs"
    ],
    specs: {
      Sizes: "S / M / L (60–90 cm)",
      Fill: "Recycled poly-fibre",
      Care: "Machine washable, cold",
      "In the box": "1 × calming bed"
    }
  },
  {
    id: "treat-puzzle",
    name: "BrainyPaws Treat Puzzle Toy",
    tagline: "Turns treat time into a slow, happy brain workout — beats boredom and mischief.",
    price: 22.95,
    compareAt: 36.95,
    rating: 4.7,
    reviews: 987,
    badge: "New",
    image: "assets/img/treat-puzzle.svg",
    gallery: ["assets/img/treat-puzzle.svg", "assets/img/treat-puzzle-2.svg"],
    description:
      "A bored pet is a mischievous pet. BrainyPaws hides kibble and treats behind flips, slides, and cups your dog has to nudge open — rewarding patience instead of your couch cushions. The mental workout tires them out as much as a walk, and honestly, it's a joy to watch them figure it out.",
    features: [
      "Interactive puzzle rewards problem-solving",
      "Slows fast eaters and curbs boredom behaviours",
      "Non-slip base with no removable small parts",
      "Wipe-clean, food-safe design"
    ],
    specs: {
      Level: "Beginner to intermediate",
      Material: "BPA-free, food-safe plastic",
      Care: "Hand wash, wipe clean",
      "In the box": "1 × puzzle toy"
    }
  },
  {
    id: "lick-mat",
    name: "CalmLick Slow-Feed Lick Mat (2-pack)",
    tagline: "Spread on a treat and let the licking soothe them through baths, trims, and storms.",
    price: 16.95,
    compareAt: 27.95,
    rating: 4.8,
    reviews: 1755,
    badge: "Bestseller",
    image: "assets/img/lick-mat.svg",
    gallery: ["assets/img/lick-mat.svg", "assets/img/lick-mat-2.svg"],
    description:
      "Licking releases calming endorphins — so a smear of peanut butter or wet food on the CalmLick keeps pets happily distracted through baths, grooming, vet visits, and thunder. The strong suction base sticks to any smooth surface so it won't skate around. Two mats, because one is never enough.",
    features: [
      "Textured surface soothes anxiety through the lick reflex",
      "Strong suction base grips the tub, wall, or floor",
      "Freezer-friendly for longer-lasting summer treats",
      "Food-grade silicone, dishwasher-safe — 2-pack"
    ],
    specs: {
      Material: "Food-grade silicone",
      Size: "20 × 20 cm each",
      Care: "Dishwasher safe",
      "In the box": "2 × lick mats"
    }
  },
  {
    id: "no-pull-harness",
    name: "EasyWalk No-Pull Dog Harness",
    tagline: "Gentle front-clip control that stops pulling without choking — walks you'll both enjoy.",
    price: 29.95,
    compareAt: 49.95,
    rating: 4.9,
    reviews: 2034,
    badge: "Staff pick",
    image: "assets/img/no-pull-harness.svg",
    gallery: ["assets/img/no-pull-harness.svg", "assets/img/no-pull-harness-2.svg"],
    description:
      "Pulling on the leash hurts their throat and your shoulder. The EasyWalk's front clip gently steers your dog back toward you when they lunge — no choking, no harsh corrections, just calmer walks. Padded straps and four adjustment points give a snug, comfy fit that won't rub. The humane way to teach loose-leash walking.",
    features: [
      "Front D-ring redirects pulling gently — no choking",
      "4 adjustment points for a secure, no-escape fit",
      "Padded chest & belly straps prevent rubbing",
      "Reflective stitching for safe low-light walks"
    ],
    specs: {
      Sizes: "XS–XL (girth 33–96 cm)",
      Material: "Padded nylon, metal hardware",
      Clips: "Front + back D-rings",
      "In the box": "1 × harness"
    }
  }
];
