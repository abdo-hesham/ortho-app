# 🚀 Quick Start Guide

## Installation (5 minutes)

### Step 1: Install Dependencies
```bash
pnpm install
```

**Expected Output:**
```
Packages: +XXX
Progress: resolved XXX, reused XXX, downloaded XX, added XXX
✓ Done in Xs
```

---

## Firebase Setup (10 minutes)

### Step 2: Create Firebase Project

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Click "Add project"
   - Enter project name: `orthocare-dashboard` (or your choice)
   - Disable Google Analytics (optional for now)
   - Click "Create project"

2. **Enable Authentication**
   - In Firebase Console, click "Authentication" in sidebar
   - Click "Get started"
   - Click "Email/Password" → Enable → Save

3. **Create Firestore Database**
   - Click "Firestore Database" in sidebar
   - Click "Create database"
   - Choose "Start in test mode" (we'll update rules)
   - Select your region
   - Click "Enable"

4. **Get Firebase Configuration**
   - Click ⚙️ (Settings) → "Project settings"
   - Scroll to "Your apps"
   - Click "</>" (Web app icon)
   - Register app name: "OrthoCare Web"
   - Copy the config object (looks like this):
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```

### Step 3: Configure Environment Variables

```bash
# Copy the example file
cp .env.local.example .env.local
```

**Edit `.env.local`** with your Firebase config:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...           ← from apiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Save the file!**

### Step 4: Update Firestore Security Rules

1. In Firebase Console → Firestore Database → Rules
2. Replace with content from `firestore.rules` file
3. Click "Publish"

---

## Create First User (5 minutes)

### Option 1: Firebase Console (Recommended)

1. **Create Auth User**
   - Firebase Console → Authentication → Users
   - Click "Add user"
   - Email: `doctor@example.com`
   - Password: `Test123!` (change this!)
   - Click "Add user"
   - **COPY THE UID** (looks like: `Abc123DefGhi456JklMno789`)

2. **Create Firestore User Document**
   - Firebase Console → Firestore Database → Data
   - Click "Start collection"
   - Collection ID: `users`
   - Click "Next"
   - Document ID: **Paste the UID from step 1**
   - Add fields (click "Add field" for each):

   ```
   Field: uid          Type: string      Value: [paste the same UID]
   Field: email        Type: string      Value: doctor@example.com
   Field: name         Type: string      Value: Dr. John Smith
   Field: phone        Type: string      Value: +1234567890
   Field: specialty    Type: string      Value: orthopedic_surgery
   Field: role         Type: string      Value: doctor
   Field: isActive     Type: boolean     Value: true
   Field: createdAt    Type: timestamp   Value: [click clock icon, use current time]
   Field: updatedAt    Type: timestamp   Value: [click clock icon, use current time]
   ```

   - Click "Save"

### Option 2: Quick Script (Advanced)

Create a temporary file `scripts/create-user.ts`:
```typescript
import { signUp } from '@/lib/firebase/auth';

async function createFirstUser() {
  try {
    const user = await signUp({
      email: 'doctor@example.com',
      password: 'Test123!',
      name: 'Dr. John Smith',
      phone: '+1234567890',
      specialty: 'orthopedic_surgery',
      role: 'doctor',
    });
    console.log('User created:', user);
  } catch (error) {
    console.error('Error:', error);
  }
}

createFirstUser();
```

---

## Run the Application (1 minute)

### Step 5: Start Development Server

```bash
pnpm dev
```

**Expected Output:**
```
  ▲ Next.js 16.1.6
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.5s
```

### Step 6: Open in Browser

1. Navigate to: http://localhost:3000
2. You should be redirected to `/signin`
3. Enter credentials:
   - Email: `doctor@example.com`
   - Password: `Test123!` (or what you set)
4. Click "Sign In"
5. ✅ You should see the dashboard!

---

## Verify Everything Works

### Checklist ✅

- [ ] Development server running at `localhost:3000`
- [ ] Redirected to `/signin` when not authenticated
- [ ] Can sign in with test credentials
- [ ] Redirected to `/dashboard` after sign in
- [ ] Dashboard shows welcome message with your name
- [ ] Sidebar navigation works (Dashboard, Profile, etc.)
- [ ] Profile page shows user information
- [ ] Can sign out and return to `/signin`

### If Something's Wrong

#### Can't sign in / "User not found"
**Issue**: User document not created in Firestore
**Fix**: Go back to Step 4 and create the user document with matching UID

#### "Missing environment variables"
**Issue**: `.env.local` not configured
**Fix**: Make sure `.env.local` exists and has all Firebase variables

#### "Permission denied" errors
**Issue**: Firestore rules not updated
**Fix**: Update Firestore rules in Firebase Console (Step 4)

#### Page won't load / stuck loading
**Issue**: Firebase config incorrect
**Fix**: Double-check all values in `.env.local` match Firebase Console

---

## Next Steps

### 1. Explore the Codebase

**Key Files to Review:**
- `src/types/patient.ts` - See the data models
- `src/lib/firebase/firestore.ts` - Database operations
- `src/components/layout/DashboardLayout.tsx` - Layout structure

### 2. Add More Features

**Easy wins:**
- Create patient list page
- Add appointment calendar
- Build surgery schedule view

**Where to start:**
```bash
# Create new page
touch src/app/dashboard/patients/page.tsx
```

### 3. Customize the UI

**Update colors in Tailwind:**
- Edit `src/app/globals.css`
- Change `bg-blue-600` to your brand color

**Add your logo:**
- Replace text in `DashboardHeader.tsx`
- Add logo image to `/public`

### 4. Deploy to Production

```bash
# Install Vercel CLI
pnpm install -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

---

## Common Development Tasks

### Add a New Page
```bash
# Create dashboard subpage
touch src/app/dashboard/patients/page.tsx
```

### Add a New Component
```bash
touch src/components/ui/Button.tsx
```

### Add Firebase Function
Edit `src/lib/firebase/firestore.ts` and add your function

### Update Types
Edit `src/types/*.ts` files

---

## Useful Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm type-check       # Check TypeScript types

# Package Management
pnpm add <package>    # Add dependency
pnpm remove <package> # Remove dependency
pnpm update           # Update dependencies
```

---

## Getting Help

### Resources
- 📚 [Next.js Docs](https://nextjs.org/docs)
- 🔥 [Firebase Docs](https://firebase.google.com/docs)
- 📘 [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- 🎨 [Tailwind CSS](https://tailwindcss.com/docs)

### Troubleshooting
- Check `SETUP_COMPLETE.md` for common issues
- Review `ARCHITECTURE.md` for system overview
- Check Firebase Console for errors

---

## Success! 🎉

You now have a fully functional medical dashboard!

**What you can do:**
- ✅ Authenticate users
- ✅ Manage user profiles
- ✅ Full type-safe codebase
- ✅ PWA-ready application
- ✅ Offline support

**Next additions:**
- Add patient CRUD operations
- Build appointment scheduler
- Create surgery tracker
- Add image upload
- Implement notifications

Happy coding! 🚀
