// Generates favicons, app icons and brand mark files from the Nordic Pixel
// mark (a pixel "N" with a Swedish-yellow accent pixel).
//
//   npm run icons
//
// Outputs:
//   app/icon.svg, app/favicon.ico, app/apple-icon.png      (picked up by Next.js)
//   public/icons/icon-192.png, icon-512.png, icon-maskable-512.png (web manifest)
//   public/brand/*.svg + nordic-pixel-logo-512.png         (logo variants)
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Keep in sync with components/brand/Logo.tsx
const MARK_PATH = "M0 0H4V4H8V8H12V12H16V4H20V20H16V16H12V12H8V8H4V20H0Z";
const COLORS = { blue: "#006AA7", yellow: "#FECC00", black: "#0B1117", white: "#FFFFFF", navy: "#001F3F" };

/** Mark on a transparent 20 × 20 grid. */
const markSvg = (body, accent) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="200" height="200"><path d="${MARK_PATH}" fill="${body}"/><rect x="16" y="0" width="4" height="4" fill="${accent}"/></svg>`;

/** App icon: blue tile with white mark. `radius` 0 = full bleed (for maskable/iOS). */
const tileSvg = ({ radius = 7, inset = 6, size = 32 } = {}) => {
  const scale = (size - inset * 2) / 20;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="${COLORS.blue}"/><g transform="translate(${inset} ${inset}) scale(${scale})"><path d="${MARK_PATH}" fill="${COLORS.white}"/><rect x="16" y="0" width="4" height="4" fill="${COLORS.yellow}"/></g></svg>`;
};

const png = (svg, size) => sharp(Buffer.from(svg), { density: 600 }).resize(size, size).png().toBuffer();

/** ICO container with embedded PNG images (supported by all current browsers). */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  const entries = [];
  let offset = 6 + images.length * 16;
  for (const { size, data } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(entry);
  }
  return Buffer.concat([header, ...entries, ...images.map((image) => image.data)]);
}

async function write(relativePath, data) {
  const target = join(root, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, data);
  console.log(`✓ ${relativePath}`);
}

const appIcon = tileSvg();

await write("app/icon.svg", appIcon);
await write(
  "app/favicon.ico",
  ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(appIcon, size) })))),
);
await write("app/apple-icon.png", await png(tileSvg({ radius: 0, inset: 7, size: 32 }), 180));
await write("public/icons/icon-192.png", await png(appIcon, 192));
await write("public/icons/icon-512.png", await png(appIcon, 512));
// Maskable icons need the mark inside the central safe zone (~80 %).
await write("public/icons/icon-maskable-512.png", await png(tileSvg({ radius: 0, inset: 9, size: 32 }), 512));

await write("public/brand/nordic-pixel-mark.svg", markSvg(COLORS.blue, COLORS.yellow));
await write("public/brand/nordic-pixel-mark-blue.svg", markSvg(COLORS.blue, COLORS.blue));
await write("public/brand/nordic-pixel-mark-black.svg", markSvg(COLORS.black, COLORS.black));
await write("public/brand/nordic-pixel-mark-white.svg", markSvg(COLORS.white, COLORS.yellow));
await write("public/brand/nordic-pixel-app-icon.svg", appIcon);
await write("public/brand/nordic-pixel-logo-512.png", await png(appIcon, 512));
