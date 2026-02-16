/**
 * PWA Icon Generator Script
 * Generates placeholder PWA icons in all required sizes
 * For production, replace with actual designed icons
 *
 * @type {NodeJS.Module}
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

// Required icon sizes for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Icon directory
const iconDir = path.join(__dirname, "..", "public", "icons");

// Ensure icons directory exists
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
  console.log("✅ Created icons directory");
}

// Generate SVG placeholder icon
function generateSVGIcon(size) {
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="#2563eb" rx="${size * 0.15}"/>
  
  <!-- Medical Cross -->
  <g transform="translate(${size * 0.5}, ${size * 0.5})">
    <!-- Vertical bar -->
    <rect x="${-size * 0.08}" y="${-size * 0.28}" width="${
    size * 0.16
  }" height="${size * 0.56}" fill="white" rx="${size * 0.02}"/>
    <!-- Horizontal bar -->
    <rect x="${-size * 0.28}" y="${-size * 0.08}" width="${
    size * 0.56
  }" height="${size * 0.16}" fill="white" rx="${size * 0.02}"/>
  </g>
  
  <!-- OrthoCare Text -->
  <text x="${size * 0.5}" y="${
    size * 0.85
  }" font-family="Arial, sans-serif" font-size="${
    size * 0.1
  }" font-weight="bold" fill="white" text-anchor="middle">OC</text>
</svg>`;

  return svg;
}

// Generate PNG using SVG (requires conversion tool in production)
function generatePlaceholderPNG(size) {
  // Note: This creates SVG files. For PNG conversion, use:
  // - Online: https://realfavicongenerator.net/
  // - CLI: ImageMagick, Sharp, or svg2png
  // For now, we'll save as SVG and rename to .png
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(iconDir, filename);

  fs.writeFileSync(filepath.replace(".png", ".svg"), generateSVGIcon(size));
  console.log(`📝 Created SVG for ${filename} (convert to PNG for production)`);
}

// Generate Apple Touch Icon (180x180)
function generateAppleTouchIcon() {
  const svg = generateSVGIcon(180);
  const filepath = path.join(__dirname, "..", "public", "apple-touch-icon.png");

  fs.writeFileSync(filepath.replace(".png", ".svg"), svg);
  console.log(
    "✅ Generated apple-touch-icon.svg (convert to PNG for production)",
  );
}

// Main execution
console.log("🎨 Generating PWA Icons...\n");

// Generate all required sizes
sizes.forEach((size) => {
  generatePlaceholderPNG(size);
});

// Generate Apple Touch Icon
generateAppleTouchIcon();

console.log("\n✅ Icon generation complete!");
console.log("\n📌 NEXT STEPS:");
console.log("1. Convert SVG files to PNG using:");
console.log("   - Online: https://realfavicongenerator.net/");
console.log("   - ImageMagick: magick icon.svg icon.png");
console.log("   - Or use a design tool (Figma, Sketch, etc.)");
console.log("\n2. Design professional icons with your branding");
console.log("3. Ensure icons have proper safe zones (10% padding)");
console.log("4. Test icons in Chrome DevTools > Application > Manifest");
