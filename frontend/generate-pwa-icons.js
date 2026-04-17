// Simple script to create basic PWA icons
// Run with: node generate-pwa-icons.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create a simple SVG icon
const createSVGIcon = (size) => {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#d97706;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size/10}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size/2}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">S</text>
</svg>`;
};

// Save SVG files that can be used as PNG alternatives
const publicDir = path.join(__dirname, 'public');

// Create 192x192 icon
fs.writeFileSync(
  path.join(publicDir, 'pwa-192x192.svg'),
  createSVGIcon(192)
);

// Create 512x512 icon
fs.writeFileSync(
  path.join(publicDir, 'pwa-512x512.svg'),
  createSVGIcon(512)
);

console.log('✅ SVG icons created successfully!');
console.log('Note: For production, convert these to PNG using an online tool or ImageMagick');
console.log('Example: https://cloudconvert.com/svg-to-png');
