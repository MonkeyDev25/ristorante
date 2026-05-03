const fs = require('fs');
let content = fs.readFileSync('menu.html', 'utf8');

// The replacement mapping for exceptions
const exceptions = {
  'agnello-800x800.webp': 'agnello--800x800.jpg',
  'primitivo-vino-800x800.webp': 'primitivo-1-800x800.jpg'
};

content = content.replace(/<picture>\s*<img decoding="async" src="asset\/immagini\/([^"]+\.webp)" alt="([^"]+)" loading="lazy">\s*<\/picture>/g, (match, webpFile, alt) => {
  const jpgFile = exceptions[webpFile] || webpFile.replace('.webp', '.jpg');
  return `<picture>
              <source type="image/webp" srcset="asset/immagini/${webpFile}">
              <img decoding="async" src="asset/immagini/${jpgFile}" alt="${alt}" loading="lazy">
            </picture>`;
});

// also for the swiper single line format without whitespace if any:
content = content.replace(/<picture><img decoding="async" src="asset\/immagini\/([^"]+\.webp)" alt="([^"]+)" loading="lazy"><\/picture>/g, (match, webpFile, alt) => {
  const jpgFile = exceptions[webpFile] || webpFile.replace('.webp', '.jpg');
  return `<picture><source type="image/webp" srcset="asset/immagini/${webpFile}"><img decoding="async" src="asset/immagini/${jpgFile}" alt="${alt}" loading="lazy"></picture>`;
});

fs.writeFileSync('menu.html', content);
console.log('Updated menu.html successfully.');
