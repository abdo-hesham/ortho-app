# PWA Icons

This folder contains the PWA icons for OrthoCare Dashboard.

## Required Icons

For a full PWA experience, you need the following icon sizes:

- ✅ 72x72px - `icon-72x72.png`
- ✅ 96x96px - `icon-96x96.png`
- ✅ 128x128px - `icon-128x128.png`
- ✅ 144x144px - `icon-144x144.png`
- ✅ 152x152px - `icon-152x152.png`
- ✅ 192x192px - `icon-192x192.png`
- ✅ 384x384px - `icon-384x384.png`
- ✅ 512x512px - `icon-512x512.png`

## How to Generate Icons

### Option 1: Online Tools
1. Create a 512x512px icon with your logo
2. Use https://realfavicongenerator.net/ or https://www.pwabuilder.com/imageGenerator
3. Upload your 512x512 image
4. Download all sizes
5. Place them in this folder

### Option 2: Using ImageMagick
If you have a source icon (e.g., `icon.png` at 512x512):

```bash
# Install ImageMagick first: https://imagemagick.org/script/download.php

# Generate all sizes
magick icon.png -resize 72x72 icon-72x72.png
magick icon.png -resize 96x96 icon-96x96.png
magick icon.png -resize 128x128 icon-128x128.png
magick icon.png -resize 144x144 icon-144x144.png
magick icon.png -resize 152x152 icon-152x152.png
magick icon.png -resize 192x192 icon-192x192.png
magick icon.png -resize 384x384 icon-384x384.png
magick icon.png -resize 512x512 icon-512x512.png
```

### Option 3: Using Node.js Script
Run the included icon generator script:

```bash
node scripts/generate-icons.js
```

## Design Recommendations

For a medical app icon:
- **Background**: White or light blue (#EFF6FF)
- **Main color**: Blue (#2563EB) - matches app theme
- **Symbol**: Medical cross, stethoscope, or orthopedic bone icon
- **Text**: "OC" or medical symbol
- **Safe zone**: Keep important elements 10% away from edges
- **Format**: PNG with transparency (for maskable icons)

## Apple Touch Icon

Also needed in `/public`:
- `apple-touch-icon.png` (180x180px)

## Favicon

Standard favicon in `/public`:
- `favicon.ico` (32x32px or multi-size)

## Testing Icons

After adding icons:
1. Open Chrome DevTools
2. Go to Application tab
3. Check "Manifest" section
4. Verify all icons load correctly

## Current Status

🚨 **ACTION REQUIRED**: Icons need to be generated and placed in this folder.

Use one of the methods above to create your PWA icons.
