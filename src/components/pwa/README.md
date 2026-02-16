# PWA Components

This directory contains Progressive Web App (PWA) components for OrthoCare Dashboard.

## Components

### InstallPrompt

A smart, sticky banner that prompts users to install the PWA on their device.

**Features:**
- ✅ Auto-detects installability
- ✅ Platform-specific behavior (Chrome, Edge, iOS Safari)
- ✅ Dismissible (7-day expiry)
- ✅ iOS-specific install instructions modal
- ✅ Responsive design (mobile & desktop)
- ✅ Remembers installation status
- ✅ Auto-hides when app is installed

**Usage:**

```tsx
import { InstallPrompt } from "@/components/pwa";

export default function Layout({ children }) {
  return (
    <>
      {children}
      <InstallPrompt />
    </>
  );
}
```

**Behavior:**

1. **Not Installable:** Hidden
2. **Installable (Chrome/Edge):** Shows banner with "Install" button
3. **Installable (iOS Safari):** Shows banner with "How to Install" button
4. **Dismissed:** Hidden for 7 days (localStorage)
5. **Installed:** Hidden permanently

**Customization:**

Edit `InstallPrompt.tsx`:

```tsx
// Change dismiss duration (default: 7 days)
const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
// Change to 3 days:
const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;

// Change banner position
className="fixed bottom-0 left-0 right-0"
// Change to top:
className="fixed top-0 left-0 right-0"

// Change theme colors
className="bg-gradient-to-r from-blue-600 to-blue-700"
// Your brand colors:
className="bg-gradient-to-r from-purple-600 to-purple-700"
```

**Testing:**

```javascript
// Clear dismiss status
localStorage.removeItem('pwa-install-dismissed');

// Check install status
window.matchMedia('(display-mode: standalone)').matches;

// Manual trigger (Chrome DevTools > Application)
// Check "Update on reload" and reload page
```

**Browser Support:**

| Browser | Install Prompt | iOS Instructions |
|---------|----------------|------------------|
| Chrome | ✅ Native | N/A |
| Edge | ✅ Native | N/A |
| Firefox | ⚠️ Limited | N/A |
| Safari (macOS) | ⚠️ Limited | N/A |
| Safari (iOS) | ❌ | ✅ Manual Guide |
| Samsung Internet | ✅ Native | N/A |

**Events:**

The component listens to these events:

- `beforeinstallprompt` - Chrome/Edge install prompt ready
- `appinstalled` - App successfully installed
- Window media query change - Detect standalone mode

**LocalStorage:**

- Key: `pwa-install-dismissed`
- Value: Timestamp of dismissal
- Expiry: 7 days

**iOS Modal:**

When `isIOS` is detected and user clicks install:
1. Opens modal with step-by-step instructions
2. Shows Safari Share button icon
3. Shows "Add to Home Screen" option
4. Provides "Got it!" button to close

## Future Components

Additional PWA components you might want to create:

### UpdateNotification
Shows when a new version is available.

```tsx
"use client";

export function UpdateNotification() {
  // Listen for service worker updates
  // Show "Update Available" banner
  // Reload on user action
}
```

### OfflineIndicator
Shows network status in app header.

```tsx
"use client";

export function OfflineIndicator() {
  // Monitor navigator.onLine
  // Show "Offline" badge
  // Update when connection restored
}
```

### PushNotificationPrompt
Request permission for push notifications.

```tsx
"use client";

export function PushNotificationPrompt() {
  // Check notification permission
  // Show prompt if not granted
  // Handle permission request
}
```

## Best Practices

1. **Placement:** InstallPrompt should be in root layout, rendered after main content
2. **Timing:** Don't show immediately - let users explore first (consider delay)
3. **Dismissal:** Respect user choice - don't spam with install prompts
4. **Mobile-First:** Design for mobile, enhance for desktop
5. **Testing:** Always test on real devices (iOS and Android)

## Debugging

```javascript
// Check if app is running in standalone mode
if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log('Running in standalone mode');
}

// Check if install prompt event was fired
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('Install prompt ready', e);
});

// Check if app was installed
window.addEventListener('appinstalled', () => {
  console.log('App installed successfully');
});
```

## Resources

- [MDN: beforeinstallprompt](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent)
- [Web.dev: Install Prompt](https://web.dev/customize-install/)
- [iOS PWA Guide](https://web.dev/ios-pwa/)

---

**Note:** InstallPrompt behavior varies by browser and platform. Always test on target devices.
