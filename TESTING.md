# 🧪 Testing Authentication

## Quick Test Guide

### Test 1: Access Control

**Test protected route without auth:**
```
1. Open browser (incognito mode recommended)
2. Navigate to: http://localhost:3000/dashboard
3. ✅ Should redirect to: /signin?redirect=/dashboard
```

**Test sign-in flow:**
```
1. On sign-in page, enter credentials:
   - Email: doctor@example.com (or your test user)
   - Password: Test123! (or your test password)
2. Click "Sign In"
3. ✅ Should redirect to: /dashboard
4. ✅ Header should show your name and specialty
```

**Test authenticated access:**
```
1. While signed in, navigate to: /profile
2. ✅ Should show your profile information
3. ✅ Should NOT redirect to /signin
```

**Test sign-out:**
```
1. Click "Sign Out" in header
2. ✅ Should redirect to: /signin
3. Try accessing: /dashboard
4. ✅ Should redirect to: /signin (not allowed anymore)
```

### Test 2: Cookie Management

**Check cookie is set on login:**
```
1. Sign in successfully
2. Open DevTools → Application → Cookies
3. ✅ Should see cookie named: __session
4. ✅ Cookie should have your Firebase auth token
5. ✅ Expires: 14 days from now
```

**Check cookie is removed on logout:**
```
1. Sign out
2. Check Cookies in DevTools
3. ✅ __session cookie should be gone
```

### Test 3: Redirect Preservation

**Test that intended destination is remembered:**
```
1. While logged out, navigate to: /dashboard/patients
2. ✅ Redirects to: /signin?redirect=/dashboard/patients
3. Sign in with valid credentials
4. ✅ Should redirect back to: /dashboard/patients
```

### Test 4: Prevent Double Login

**Test that authenticated users can't access sign-in:**
```
1. Sign in successfully
2. Try navigating to: /signin
3. ✅ Should redirect to: /dashboard
```

### Test 5: Token Refresh (Optional - Time Intensive)

**Method 1: Wait (50+ minutes)**
```
1. Sign in
2. Leave tab open for 55 minutes
3. ✅ Should still be signed in (token auto-refreshed)
```

**Method 2: Manual Testing**
```javascript
// In browser console while signed in:
// Manually trigger refresh
localStorage.setItem('test_refresh', 'true');
// Check Network tab for token refresh calls
```

## Browser Testing Checklist

Test in multiple browsers for compatibility:

- [ ] **Chrome/Edge** (Chromium)
  - DevTools → Application → Cookies
  - Check for security warnings

- [ ] **Firefox**
  - DevTools → Storage → Cookies
  - Check cookie attributes

- [ ] **Safari** (if available)
  - Develop → Show Web Inspector → Storage
  - Test on iOS Safari too

## Security Testing

### Test 1: Direct URL Access
```
1. Sign out
2. Open new tab
3. Manually type: http://localhost:3000/dashboard
4. ✅ Should redirect to signin
5. ✅ NOT see dashboard content
```

### Test 2: Cookie Tampering
```
1. Sign in
2. Open DevTools → Application → Cookies
3. Modify __session cookie value to "invalid"
4. Try accessing /dashboard
5. ✅ Should be treated as unauthenticated
```

### Test 3: Expired Token
```
1. Sign in
2. DevTools → Application → Cookies
3. Edit __session cookie expiry to past date
4. Refresh page
5. ✅ Should redirect to signin
```

### Test 4: XSS Prevention (React handles this)
```javascript
// Try injecting script in form
// React should auto-escape, preventing execution
<script>alert('xss')</script>
```

## Error Testing

### Test Invalid Credentials
```
1. Navigate to /signin
2. Enter: wrong@email.com / wrongpass
3. ✅ Should show error: "No account found with this email"
4. ✅ Should NOT redirect
5. ✅ Form should remain filled
```

### Test Network Error
```
1. Turn off internet/disable Firebase
2. Try signing in
3. ✅ Should show error: "Network error"
4. ✅ Should NOT crash
5. ✅ Should remain on signin page
```

### Test Missing User Document
```
1. Create Firebase auth user without Firestore document
2. Try signing in
3. ✅ Should show error: "User profile not found"
```

## Performance Testing

### Test 1: Page Load Speed
```
1. Sign in
2. Navigate between pages
3. ✅ Transitions should be instant (< 100ms)
4. ✅ No flickering or loading delays
```

### Test 2: Middleware Performance
```
1. Use Network tab
2. Check request timing
3. ✅ Middleware should add < 10ms overhead
```

## Mobile Testing

### Test on Mobile Devices
```
1. Open on mobile browser
2. Test sign-in flow
3. ✅ Form should be responsive
4. ✅ Keyboard should show for inputs
5. ✅ "Remember me" should work
```

### Test PWA Installation
```
1. On mobile, visit the app
2. ✅ Should see "Add to Home Screen" prompt
3. Install and test
4. ✅ Should work offline (cached)
```

## Automated Testing Examples

### Using Playwright

```typescript
// tests/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('redirects unauthenticated user to signin', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/signin/);
  });

  test('successful sign in', async ({ page }) => {
    await page.goto('/signin');
    
    await page.fill('#email', 'doctor@example.com');
    await page.fill('#password', 'Test123!');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('text=Welcome back')).toBeVisible();
  });

  test('sign out', async ({ page, context }) => {
    // First sign in
    await page.goto('/signin');
    await page.fill('#email', 'doctor@example.com');
    await page.fill('#password', 'Test123!');
    await page.click('button[type="submit"]');
    
    // Then sign out
    await page.click('text=Sign Out');
    await expect(page).toHaveURL(/\/signin/);
    
    // Check cookie is removed
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(c => c.name === '__session');
    expect(sessionCookie).toBeUndefined();
  });
});
```

### Using Jest + React Testing Library

```typescript
// __tests__/SignInPage.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignInPage from '@/app/signin/page';

test('shows error on invalid credentials', async () => {
  render(<SignInPage />);
  
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'wrong@email.com' },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'wrongpass' },
  });
  
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
  
  await waitFor(() => {
    expect(screen.getByText(/no account found/i)).toBeInTheDocument();
  });
});
```

## Load Testing

For production, test with multiple concurrent users:

```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:3000/signin

# Using Artillery
artillery quick --count 10 --num 100 http://localhost:3000/dashboard
```

## Debug Mode

To debug auth issues, add to `.env.local`:

```env
NEXT_PUBLIC_DEBUG_AUTH=true
```

Then add to `AuthContext.tsx`:

```typescript
useEffect(() => {
  if (process.env.NEXT_PUBLIC_DEBUG_AUTH) {
    console.log('Auth State:', {
      user: user?.email,
      loading,
      error,
      firebaseUser: !!firebaseUser,
    });
  }
}, [user, loading, error, firebaseUser]);
```

## Common Issues & Fixes

### Issue: Stuck in redirect loop
**Debug:**
```
1. Clear all cookies
2. Clear localStorage
3. Hard refresh (Ctrl+Shift+R)
4. Try again
```

### Issue: "User not found" after signin
**Debug:**
```
1. Check Firebase Console → Authentication
2. Verify user exists
3. Check Firestore → users collection
4. Verify document exists with same UID
```

### Issue: Cookie not setting
**Debug:**
```javascript
// Add to session.ts
console.log('Setting cookie:', {
  name: AUTH_COOKIE_NAME,
  value: token.substring(0, 20) + '...',
  options: COOKIE_OPTIONS,
});
```

### Issue: Middleware not running
**Debug:**
```typescript
// Add to middleware.ts
export function middleware(request: NextRequest) {
  console.log('[Middleware] Path:', request.nextUrl.pathname);
  console.log('[Middleware] Cookie:', !!request.cookies.get('__session'));
  // ... rest of code
}
```

## Pre-Deployment Checklist

Before deploying, verify:

- [ ] All tests pass
- [ ] No console errors in browser
- [ ] No TypeScript errors (`pnpm type-check`)
- [ ] Environment variables set in hosting platform
- [ ] Firestore security rules deployed
- [ ] HTTPS enabled (required for secure cookies)
- [ ] Cookie domain matches deployment domain
- [ ] Token refresh working (test for 1 hour)
- [ ] Sign out clears all session data
- [ ] Redirects work correctly
- [ ] Mobile responsive
- [ ] Works in incognito/private mode
- [ ] Performance acceptable (< 2s page load)

## Success Criteria

Authentication is working correctly when:

✅ Unauthenticated users cannot access protected routes
✅ Sign-in redirects to intended destination
✅ User data loads from Firestore (name, phone, specialty)
✅ Sign-out clears session completely
✅ Token auto-refreshes (no unexpected logouts)
✅ Middleware protects routes server-side
✅ No security vulnerabilities
✅ User experience is smooth (no flickering/delays)
✅ Error messages are user-friendly
✅ Works across browsers and devices

---

**Testing completed?** You now have a production-ready authentication system! 🎉
