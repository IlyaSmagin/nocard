import { mkdirSync, writeFileSync } from 'fs';

// Create a minimal SVG font converted to a WOFF2-compatible format
// We'll use a CSS @font-face with a system monospace fallback
// and create a simple CSS file that applies the dot-matrix style

mkdirSync('public/fonts', { recursive: true });

// We'll create a minimal placeholder - the actual font-face in globals.css 
// will fall back to monospace. For a true dot-matrix look we apply 
// letter-spacing and text-transform via CSS.
writeFileSync('public/fonts/dot-matrix.woff2', Buffer.alloc(0));

console.log('Font placeholder created. Using monospace fallback with dot-matrix styling.');
