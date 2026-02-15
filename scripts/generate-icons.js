import sharp from 'sharp';

const sizes = [192, 512];

for (const size of sizes) {
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#000000" rx="${size * 0.15}"/>
    <text x="50%" y="52%" text-anchor="middle" dominant-baseline="central" fill="#FF0000" font-family="serif" font-size="${size * 0.45}" font-weight="bold">C</text>
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(`public/icons/icon-${size}.png`);
  console.log(`Generated icon-${size}.png`);
}

console.log('Icons generated.');
