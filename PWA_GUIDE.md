# OrthoCare PWA - Complete Setup Guide

## 🎯 Overview

OrthoCare is now a fully-featured **Progressive Web App (PWA)** optimized for mobile doctors and offline usage. This guide covers installation, testing, and deployment.

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

The following PWA dependencies are already configured:
- `next-pwa` - PWA plugin for Next.js App Router
- Service worker with Workbox

### 2. Generate Icons

**Option A: Use Placeholder Icons (Development)**
```bash
node scripts/generate-icons.js
```

**Option B: Create Production Icons**
1. Design a 512x512px icon with your branding
2. Use [RealFaviconGenerator](https://realfavicongenerator.net/)
3. Upload your icon and download all sizes
4. Place in `/public/icons/` folder

**Required Icon Sizes:**
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
- Apple Touch Icon: 180x180

### 3. Run Development Server

```bash
pnpm dev
```

PWA features are **disabled in development** by default (see `next.config.ts`).

### 4. Build for Production

```bash
pnpm build
pnpm start
```

Service worker is **only active in production builds**.

---

## 📱 PWA Features

### ✅ Installability

**Desktop (Chrome/Edge):**
- Sticky install banner appears at bottom
- "Install" button in browser address bar
- Right-click > "Install OrthoCare"

**Mobile (Chrome/Edge):**
- Bottom banner with "Install App" button
- Chrome menu > "Install app" or "Add to Home Screen"

**iOS (Safari):**
- Tap "How to Install" in banner
- Follow step-by-step instructions
- Share button > "Add to Home Screen"

### ✅ Offline Support

**Cached Resources:**
- Static assets (JS, CSS, images, fonts)
- Previously visited pages
- API responses (24-hour cache)

**Network Strategies:**
- **NetworkFirst**: API calls, dynamic pages
- **CacheFirst**: Fonts, audio, immutable assets
- **StaleWhileRevalidate**: Images, data

**Offline Fallback:**
- `/offline` page shown when offline and page not cached
- Try again button
- Network troubleshooting tips

### ✅ App Shortcuts

Long-press app icon (Android) or right-click (desktop) to access:
- **Dashboard** - View patient dashboard
- **Add Patient** - Quick access to patient creation

### ✅ Optimizations

**Performance:**
- Service worker caching
- Lazy loading components
- Optimized asset delivery
- Compression and minification

**Mobile:**
- Responsive design
- Touch-optimized UI
- Viewport fit cover (notch support)
- Tap highlight removal

**Offline-Ready:**
- Static assets cached
- Smart cache invalidation
- Network-first for critical data

---

## 🧪 Testing PWA

### 1. Lighthouse Audit

```bash
# Build production
pnpm build
pnpm start

# Open Chrome DevTools
# Lighthouse tab > Generate report
```

**Target Scores:**
- ✅ Performance: 90+
- ✅ Accessibility: 90+
- ✅ Best Practices: 90+
- ✅ SEO: 90+
- ✅ PWA: 100 (Installable)

### 2. Manual Testing

**Install Flow:**
1. Open app in Chrome: `http://localhost:3000`
2. Wait for install banner (bottom of page)
3. Click "Install" button
4. Verify app opens in standalone window
5. Check app icon on desktop/home screen

**Offline Test:**
1. Install app
2. Open Chrome DevTools > Network tab
3. Select "Offline" throttling
4. Navigate to new page
5. Should see offline page
6. Navigate to cached page
7. Should load from cache

**Service Worker:**
1. DevTools > Application > Service Workers
2. Verify service worker is registered and activated
3. Check cache storage for cached files
4. Inspect manifest.json

### 3. Cross-Browser Testing

| Browser | Desktop | Mobile | Install | Offline |
|---------|---------|--------|---------|---------|
| Chrome | ✅ | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ⚠️ Limited | ✅ |
| Safari | ✅ | ✅ | ⚠️ Manual | ✅ |

### 4. Mobile Device Testing

**Android (Chrome):**
```bash
# Connect phone via USB
# Enable USB debugging
pnpm build
pnpm start

# Access from phone at your computer's IP
# Example: http://192.168.1.100:3000
```

**iOS (Safari):**
- Deploy to HTTPS domain (required for iOS PWA)
- Use ngrok for local testing: `npx ngrok http 3000`

---

## 🔧 Configuration

### Service Worker Settings

Edit `next.config.ts`:

```typescript
const withPWA = withPWAInit({
  dest: "public",                    // SW output directory
  disable: process.env.NODE_ENV === "development", // Disable in dev
  register: true,                     // Auto-register SW
  skipWaiting: true,                  // Activate new SW immediately
  reloadOnOnline: true,               // Reload when back online
  fallbacks: {
    document: "/offline",             // Offline fallback page
  },
  workboxOptions: {
    // Caching strategies configured here
  },
});
```

### Manifest Customization

Edit `/public/manifest.json`:

```json
{
  "name": "Your App Name",
  "short_name": "App",
  "theme_color": "#yourcolor",
  "start_url": "/your-start-page",
  // ... more options
}
```

### Install Prompt Behavior

Edit `src/components/pwa/InstallPrompt.tsx`:

- Dismiss duration: Change `7 * 24 * 60 * 60 * 1000` (currently 7 days)
- Positioning: Modify `fixed bottom-0` classes
- Styling: Update Tailwind classes

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm i -g vercel

# Deploy
vercel --prod
```

Service worker works automatically on Vercel.

### Netlify

1. Build command: `pnpm build`
2. Publish directory: `.next`
3. Add `_headers` file:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff

/sw.js
  Cache-Control: public, max-age=0, must-revalidate

/workbox-*.js
  Cache-Control: public, max-age=31536000, immutable
```

### Self-Hosted

```bash
# Build
pnpm build

# Start with PM2
pm2 start npm --name "orthocare" -- start

# Or with custom port
PORT=3000 pnpm start
```

---

## 📊 PWA Best Practices

### ✅ Performance

- [x] Minified assets
- [x] Compressed fonts
- [x] Lazy-loaded components
- [x] Optimized images (use Next.js `<Image>`)
- [x] Smart caching strategies

### ✅ User Experience

- [x] Fast load times (<3s)
- [x] Smooth animations
- [x] Touch-friendly UI
- [x] Clear offline indicators
- [x] Install prompt UI

### ✅ Security

- [x] HTTPS only (required for PWA)
- [x] CSP headers (add to deployment)
- [x] Secure cookies
- [x] API key protection

### ✅ Accessibility

- [x] ARIA labels
- [x] Keyboard navigation
- [x] Screen reader support
- [x] Sufficient color contrast

---

## 🐛 Troubleshooting

### Install Button Not Showing

**Causes:**
- Not on HTTPS (except localhost)
- PWA already installed
- User dismissed prompt (check localStorage)
- Missing manifest or icons
- Service worker not registered

**Fix:**
```javascript
// Check localStorage
localStorage.removeItem('pwa-install-dismissed');

// Verify manifest
// DevTools > Application > Manifest

// Check service worker
// DevTools > Application > Service Workers
```

### Service Worker Not Updating

**Fix:**
```javascript
// DevTools > Application > Service Workers
// Check "Update on reload"
// Click "Unregister" then reload

// Or programmatically:
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
});
```

### Icons Not Displaying

**Check:**
1. Icon files exist in `/public/icons/`
2. Correct paths in `manifest.json`
3. PNG format (not SVG)
4. Proper sizes (72, 96, 128, 144, 152, 192, 384, 512)

### Offline Page Not Showing

**Check:**
1. Service worker active (production build only)
2. `/offline` route exists
3. `fallbacks` configured in `next.config.ts`
4. Clear cache and test again

---

## 📱 App Store Submission (Optional)

### Google Play Store (via Trusted Web Activity)

1. Use [PWA Builder](https://www.pwabuilder.com/)
2. Enter your app URL
3. Download Android package
4. Submit to Play Store

### Apple App Store (via Capacitor/Cordova)

1. Install Capacitor: `pnpm add @capacitor/core @capacitor/cli`
2. Init: `npx cap init`
3. Add iOS: `npx cap add ios`
4. Build: `pnpm build && npx cap sync`
5. Open Xcode: `npx cap open ios`
6. Submit to App Store

---

## 📚 Resources

**Documentation:**
- [Next.js PWA](https://github.com/shadowwalker/next-pwa)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

**Tools:**
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/)
- [PWA Builder](https://www.pwabuilder.com/)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Maskable.app](https://maskable.app/) - Icon editor

**Testing:**
- Chrome DevTools (F12 > Application)
- [webhint.io](https://webhint.io/)
- [PWA Testing Checklist](https://web.dev/pwa-checklist/)

---

## ✅ Checklist

Before deploying to production:

- [ ] Generate production icons (512x512 base)
- [ ] Test install flow on desktop
- [ ] Test install flow on Android
- [ ] Test install flow on iOS (manual)
- [ ] Run Lighthouse audit (PWA score 100)
- [ ] Test offline functionality
- [ ] Verify service worker updates
- [ ] Check manifest.json in DevTools
- [ ] Test app shortcuts
- [ ] Configure HTTPS domain
- [ ] Add security headers
- [ ] Set up analytics (optional)
- [ ] Test on slow 3G network
- [ ] Verify theme colors
- [ ] Check icon safe zones

---

## 🎉 Success Criteria

Your PWA is ready when:

- ✅ Lighthouse PWA score: 100
- ✅ Install prompt appears on desktop & mobile
- ✅ App works offline (cached pages)
- ✅ Service worker registered and active
- ✅ Manifest valid with all icons
- ✅ Standalone window (no browser UI)
- ✅ Fast load time (<3s on 3G)
- ✅ iOS Add to Home Screen works

---

## 🆘 Support

Issues? Check:
1. This guide's Troubleshooting section
2. Next.js PWA [GitHub Issues](https://github.com/shadowwalker/next-pwa/issues)
3. Browser console errors (F12)
4. Service worker logs (DevTools > Console)

---

**Last Updated:** February 2026  
**Version:** 1.0.0  
**Next.js:** 16.1.6  
**next-pwa:** Latest
