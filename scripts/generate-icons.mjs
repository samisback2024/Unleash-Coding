import sharp from "sharp";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const svg = readFileSync(resolve(root, "public/favicon.svg"));

const icons = [
  { size: 512, out: "public/icon-512.png" },
  { size: 192, out: "public/icon-192.png" },
  { size: 180, out: "public/apple-touch-icon.png" },
];

for (const { size, out } of icons) {
  await sharp(svg).resize(size, size).png().toFile(resolve(root, out));
  console.log(`✓ ${out} (${size}x${size})`);
}
