// Run this with: node create-icons.js
// Requires: npm install canvas

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function createIcon(size, filename) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#f59e0b');
    gradient.addColorStop(1, '#d97706');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Add text
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${size/3}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('S', size/2, size/2);
    
    // Save
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(__dirname, 'public', filename), buffer);
    console.log(`Created ${filename}`);
}

// Create icons
createIcon(192, 'pwa-192x192.png');
createIcon(512, 'pwa-512x512.png');
createIcon(180, 'apple-touch-icon.png');

console.log('All icons created successfully!');
