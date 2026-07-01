/* Generates branded SVG placeholder images for each product + the hero.
   Run:  node assets/img/_generate.js   (from the storefront/ folder)
   Replace the output .svg files with real product photos before going live. */
const fs = require("fs");
const path = require("path");

const palettes = {
  a: ["#eaf3f0", "#cfe6dd", "#2f6f5e"],
  b: ["#fbf1e7", "#f6d8bf", "#e0794b"],
  c: ["#eef0f6", "#d6def0", "#5566a6"],
  d: ["#fdeef0", "#f7d3da", "#c25a73"],
};

const icons = {
  posture: `<circle cx="50" cy="26" r="11"/><path d="M30 78c0-13 9-22 20-22s20 9 20 22"/><path d="M34 52h32"/>`,
  lamp: `<rect x="36" y="62" width="28" height="10" rx="3"/><path d="M50 62V44"/><path d="M50 44a14 14 0 1 0-.01 0Z"/><path d="M50 30v-8M68 38l6-5M32 38l-6-5"/>`,
  scrubber: `<circle cx="50" cy="38" r="16"/><path d="M50 38l10-10M50 38l-10 6"/><path d="M50 54v22"/><rect x="44" y="74" width="12" height="8" rx="2"/>`,
  laptop: `<rect x="26" y="32" width="48" height="30" rx="3"/><path d="M20 70h60l-4 6H24z"/><path d="M34 44h26"/>`,
  blender: `<path d="M38 30h24l-3 34a4 4 0 0 1-4 4h-10a4 4 0 0 1-4-4z"/><rect x="40" y="74" width="20" height="6" rx="2"/><path d="M44 40h12M45 50h10"/>`,
  pillow: `<path d="M30 44c10-8 30-8 40 0 6 5 6 18-2 22-6 3-8-4-18-4s-12 7-18 4c-8-4-8-17-2-22z"/>`,
};

const map = {
  "posture-brace": ["posture", "a"],
  "sunset-lamp": ["lamp", "b"],
  "spin-scrubber": ["scrubber", "c"],
  "laptop-stand": ["laptop", "a"],
  "mini-blender": ["blender", "d"],
  "knee-pillow": ["pillow", "b"],
};

function svg(iconKey, palKey, variant) {
  const [c1, c2, accent] = palettes[palKey];
  const icon = icons[iconKey];
  const angle = variant === 2 ? 320 : 145;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <linearGradient id="g" gradientTransform="rotate(${angle})">
      <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#g)"/>
  <circle cx="300" cy="285" r="150" fill="#ffffff" opacity="${variant === 2 ? 0.55 : 0.7}"/>
  <g transform="translate(150,135) scale(3)" fill="none" stroke="${accent}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
    ${icon}
  </g>
  <text x="300" y="540" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="${accent}" opacity="0.85">Hearthly</text>
</svg>`;
}

const outDir = __dirname;
for (const [id, [iconKey, palKey]] of Object.entries(map)) {
  fs.writeFileSync(path.join(outDir, `${id}.svg`), svg(iconKey, palKey, 1));
  fs.writeFileSync(path.join(outDir, `${id}-2.svg`), svg(iconKey, palKey, 2));
}

const hero = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 680" width="800" height="680">
  <defs><linearGradient id="h" gradientTransform="rotate(150)">
    <stop offset="0" stop-color="#fbf8f3"/><stop offset="1" stop-color="#cfe6dd"/></linearGradient></defs>
  <rect width="800" height="680" fill="url(#h)"/>
  ${[
    [120, 110, "lamp", "b"],
    [430, 90, "blender", "d"],
    [110, 380, "scrubber", "c"],
    [430, 360, "pillow", "a"],
  ].map(([x, y, k, p]) => `
    <g transform="translate(${x},${y})">
      <rect width="250" height="220" rx="20" fill="#ffffff" opacity="0.85"/>
      <g transform="translate(50,30) scale(1.5)" fill="none" stroke="${palettes[p][2]}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">${icons[k]}</g>
    </g>`).join("")}
</svg>`;
fs.writeFileSync(path.join(outDir, "hero.svg"), hero);

console.log("Generated placeholder images in", outDir);
