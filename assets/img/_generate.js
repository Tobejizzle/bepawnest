/* Generates branded SVG placeholder images for each product + the hero.
   Run:  node assets/img/_generate.js   (from the storefront/ folder)
   Replace the output .svg files with real product photos before going live. */
const fs = require("fs");
const path = require("path");

const palettes = {
  teal:   ["#e2f2ef", "#c5e6e0", "#12796f"],
  coral:  ["#fdeee7", "#f8d6c6", "#f4794e"],
  sky:    ["#e9f1f7", "#cfe1f0", "#3f7fb0"],
  sand:   ["#fbf2e6", "#f2ddbf", "#c98a3c"],
};

// simple white line icons, 0 0 100 100 viewBox, stroked, centered
const icons = {
  // slow feeder bowl — bowl + wavy maze
  bowl: `<path d="M20 46h60a30 30 0 0 1-60 0z"/><path d="M30 46q6 9 12 0 6 9 12 0 6 9 12 0"/><path d="M24 40h52"/>`,
  // deshedding brush — head + bristles + handle
  brush: `<rect x="32" y="30" width="36" height="18" rx="4"/><path d="M37 48v11M45 48v13M55 48v13M63 48v11"/><rect x="44" y="16" width="12" height="14" rx="3"/>`,
  // calming donut bed — outer ring + inner well
  bed: `<ellipse cx="50" cy="56" rx="32" ry="19"/><ellipse cx="50" cy="53" rx="17" ry="9"/>`,
  // treat puzzle — treat ball with holes
  puzzle: `<circle cx="50" cy="50" r="25"/><circle cx="41" cy="44" r="3.4"/><circle cx="59" cy="44" r="3.4"/><circle cx="50" cy="60" r="3.4"/>`,
  // lick mat — rounded mat + bump grid
  mat: `<rect x="24" y="30" width="52" height="40" rx="9"/><path d="M36 42h.01M50 42h.01M64 42h.01M36 54h.01M50 54h.01M64 54h.01"/>`,
  // harness / collar — loop + hanging tag
  collar: `<ellipse cx="50" cy="48" rx="26" ry="20"/><path d="M50 68v6"/><circle cx="50" cy="80" r="6"/>`,
  // paw (used in hero mix)
  paw: `<circle cx="50" cy="58" r="13"/><circle cx="34" cy="44" r="6"/><circle cx="50" cy="38" r="6"/><circle cx="66" cy="44" r="6"/>`,
};

const map = {
  "slow-feeder":      ["bowl", "teal"],
  "deshedding-brush": ["brush", "coral"],
  "calming-bed":      ["bed", "sand"],
  "treat-puzzle":     ["puzzle", "sky"],
  "lick-mat":         ["mat", "teal"],
  "no-pull-harness":  ["collar", "coral"],
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
  <text x="300" y="540" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="${accent}" opacity="0.85">BePawnest</text>
</svg>`;
}

const outDir = __dirname;
for (const [id, [iconKey, palKey]] of Object.entries(map)) {
  fs.writeFileSync(path.join(outDir, `${id}.svg`), svg(iconKey, palKey, 1));
  fs.writeFileSync(path.join(outDir, `${id}-2.svg`), svg(iconKey, palKey, 2));
}

const hero = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 680" width="800" height="680">
  <defs><linearGradient id="h" gradientTransform="rotate(150)">
    <stop offset="0" stop-color="#fbf7f2"/><stop offset="1" stop-color="#c5e6e0"/></linearGradient></defs>
  <rect width="800" height="680" fill="url(#h)"/>
  ${[
    [120, 110, "bowl", "teal"],
    [430, 90, "paw", "coral"],
    [110, 380, "collar", "sky"],
    [430, 360, "bed", "sand"],
  ].map(([x, y, k, p]) => `
    <g transform="translate(${x},${y})">
      <rect width="250" height="220" rx="20" fill="#ffffff" opacity="0.85"/>
      <g transform="translate(50,30) scale(1.5)" fill="none" stroke="${palettes[p][2]}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">${icons[k]}</g>
    </g>`).join("")}
</svg>`;
fs.writeFileSync(path.join(outDir, "hero.svg"), hero);

console.log("Generated placeholder images in", outDir);
