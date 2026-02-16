# OrthoCare PWA - Quick Reference

## 🚀 Quick Commands

```bash
# Install dependencies
pnpm install

# Generate placeholder icons
node scripts/generate-icons.js

# Development (PWA disabled)
pnpm dev

# Production build (PWA enabled)
pnpm build
pnpm start

# Test service worker
pnpm build && pnpm start
# Then open http://localhost:3000 in Chrome
```

## 📱 Testing PWA

### Desktop (Chrome)
1. Build: `pnpm build && pnpm start`
2. Open: `http://localhost:3000`
3. DevTools → Application → Manifest ✅
4. DevTools → Application → Service Workers ✅
5. Click install icon in address bar or bottom banner
6. App opens in standalone window 🎉

### Mobile (Android)
1. Deploy to HTTPS or use ngrok
2. Open in Chrome Android
3. Banner appears → Tap "Install"
4. App added to home screen 🎉

### iOS (Safari)
1. Deploy to HTTPS
2. Open in Safari
3. Banner → "How to Install" → Follow steps
4. Share → Add to Home Screen 🎉

## 🔍 Debugging

```javascript
// Check if PWA is installed
window.matchMedia('(display-mode: standalone)').matches

// Clear install prompt dismissal
localStorage.removeItem('pwa-install-dismissed')

// Check service worker
navigator.serviceWorker.getRegistrations()

// Unregister service worker
navigator.serviceWorker.getRegistrations()
  .then(regs => regs.forEach(reg => reg.unregister()))
```

## 📊 Chrome DevTools

**Application Tab:**
- **Manifest** - View manifest.json
- **Service Workers** - Check registration, update, unregister
- **Cache Storage** - View cached files
- **Storage** - Clear all data

**Network Tab:**
- Throttle to "Offline" to test offline mode
- Check service worker caching

**Lighthouse:**
- Run audit for PWA score
- Target: 100/100 ✅

## 🎨 Icon Sizes Required

| Size | Purpose |
|------|---------|
| 72x72 | Small devices |
| 96x96 | Medium devices, shortcuts |
| 128x128 | Medium-large devices |
| 144x144 | Large devices |
| 152x152 | iPad |
| 192x192 | Standard PWA icon |
| 384x384 | Large displays |
| 512x512 | Maskable icon, splash |
| 180x180 | Apple Touch Icon |

**Generate:** `node scripts/generate-icons.js`  
**Convert SVG→PNG:** Use [RealFaviconGenerator](https://realfavicongenerator.net/)

## 🌐 Caching Strategies

| Resource | Strategy | Cache Duration |
|----------|----------|----------------|
| Fonts | StaleWhileRevalidate | 7 days |
| Images | StaleWhileRevalidate | 24 hours |
| CSS/JS | StaleWhileRevalidate | 24 hours |
| API (GET) | NetworkFirst | 24 hours |
| Other | NetworkFirst | 24 hours |

**Configure:** Edit `next.config.ts` → `workboxOptions.runtimeCaching`

## 📄 Key Files

```
/public/
  manifest.json         # PWA manifest
  /icons/               # PWA icons (72-512px)
  apple-touch-icon.png  # iOS icon
  sw.js                 # Service worker (auto-generated)

/src/
  /app/
    layout.tsx          # PWA meta tags + InstallPrompt
    /offline/
      page.tsx          # Offline fallback page

  /components/
    /pwa/
      InstallPrompt.tsx # Install banner component

next.config.ts          # PWA configuration
```

## 🎯 PWA Features

- ✅ **Installable** - Add to home screen
- ✅ **Offline** - Cached pages work offline
- ✅ **Fast** - Service worker caching
- ✅ **Responsive** - Mobile-first design
- ✅ **Standalone** - Full-screen app experience
- ✅ **Shortcuts** - Quick actions (right-click icon)
- ✅ **Icons** - Multiple sizes for all devices
- ✅ **Theme** - Themed status bar (#2563eb)

## ⚙️ Configuration

### Manifest (`/public/manifest.json`)
```json
{
  "name": "OrthoCare - Orthopedic Surgery Dashboard",
  "short_name": "OrthoCare",
  "start_url": "/dashboard",
  "display": "standalone",
  "theme_color": "#2563eb"
}
```

### Service Worker (`next.config.ts`)
```typescript
const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});
```

### Install Prompt (`layout.tsx`)
```tsx
import { InstallPrompt } from "@/components/pwa";

<InstallPrompt /> // Add before </body>
```

## 🐛 Common Issues

### Install Button Not Showing
**Fix:**
- Check HTTPS (or localhost)
- Clear: `localStorage.removeItem('pwa-install-dismissed')`
- Verify manifest: DevTools → Application → Manifest
- Check icons exist in `/public/icons/`

### Service Worker Not Updating
**Fix:**
- DevTools → Application → Service Workers → "Update on reload" ✓
- Or unregister and reload
- Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

### Icons Not Displaying
**Fix:**
- Convert SVG to PNG: `icon-*.svg` → `icon-*.png`
- Check paths in manifest.json match file names
- Clear cache and reload

### Offline Page Not Showing
**Fix:**
- Build production: `pnpm build && pnpm start`
- Check service worker is active (production only)
- Navigate to page not in cache
- Should redirect to `/offline`

## 📈 Lighthouse Targets

| Metric | Target | Current |
|--------|--------|---------|
| PWA | 100 | ✅ |
| Performance | 90+ | - |
| Accessibility | 90+ | - |
| Best Practices | 90+ | - |
| SEO | 90+ | - |

**Run:** DevTools → Lighthouse → Generate Report

## 🔐 Security

**Required for PWA:**
- ✅ HTTPS in production
- ✅ Valid SSL certificate
- ✅ Secure manifest delivery
- ✅ Service worker over HTTPS

**Recommended:**
- Security headers (CSP, HSTS)
- API key protection (.env)
- Secure cookies
- XSS protection

## 📚 Documentation

- **Setup:** [PWA_GUIDE.md](./PWA_GUIDE.md)
- **Checklist:** [PWA_CHECKLIST.md](./PWA_CHECKLIST.md)
- **Components:** [src/components/pwa/README.md](./src/components/pwa/README.md)
- **Icons:** [public/icons/README.md](./public/icons/README.md)

## 🆘 Quick Troubleshooting

```bash
# Reset everything
localStorage.clear()
# DevTools → Application → Clear storage → Clear site data
# Hard reload: Ctrl+Shift+R

# Check service worker status
navigator.serviceWorker.getRegistrations()
  .then(r => console.log('SW registered:', r.length > 0))

# Check if installable
window.addEventListener('beforeinstallprompt', e => {
  console.log('Installable!', e)
})

# Check if installed
console.log('Standalone:', 
  window.matchMedia('(display-mode: standalone)').matches)
```

## ✅ Pre-Flight Checklist

Before deploying PWA:
- [ ] Icons converted to PNG (all 8 sizes + Apple)
- [ ] Manifest valid (DevTools → Application)
- [ ] Service worker registers (production build)
- [ ] Lighthouse PWA: 100
- [ ] Tested on Chrome desktop
- [ ] Tested on Chrome Android
- [ ] Tested on iOS Safari
- [ ] HTTPS configured
- [ ] Install flow works

## 🎓 Learn More

- [Next.js PWA Docs](https://github.com/shadowwalker/next-pwa)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [PWA Builder](https://www.pwabuilder.com/)
- [Maskable Icons](https://maskable.app/)

---

**Pro Tip:** Test on real devices! Simulators don't fully support PWA features.

**Last Updated:** February 11, 2026
