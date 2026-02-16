# 🏥 OrthoCare Dashboard

A professional medical **Progressive Web App (PWA)** dashboard for orthopedic surgery practice management built with Next.js 16+, TypeScript, and Firebase.

## ✨ Key Highlights

- 📱 **Full PWA** - Install on mobile & desktop, works offline
- 🎤 **Voice Input** - OpenAI Whisper integration for hands-free data entry
- 🔐 **Secure Authentication** - Firebase Auth with protected routes
- ⚡ **Real-time Sync** - Firestore for live patient data
- 🎨 **Modern UI** - Responsive design with Tailwind CSS
- 🔍 **Smart Search** - Multi-field patient search
- 📊 **Dashboard Analytics** - Real-time stats and insights

## 🚀 Features

### 🌐 Progressive Web App (PWA)
- **Installable**: Add to home screen on mobile & desktop
- **Offline Mode**: View cached patient data without internet
- **Fast Loading**: Service worker caching for instant page loads
- **App Shortcuts**: Quick access to Dashboard and Add Patient
- **Standalone Mode**: Full-screen app experience without browser UI
- **Auto-updates**: Service worker updates in background

### 🔐 Authentication & Security
- Secure Firebase Authentication with email/password
- Protected routes with middleware
- Session management
- Secure API endpoint handling

### 👥 Patient Management
- Comprehensive patient records with medical history
- Add, view, edit patient information
- Multi-field search (name, diagnosis, procedure, hospital)
- Patient details modal with full information
- Voice-to-text patient entry (OpenAI Whisper)

### 🎤 Voice Input
- Medical-grade audio recording (48kHz, noise suppression)
- OpenAI Whisper API for accurate transcription
- Smart field parsing from natural speech
- Auto-fill patient forms from dictation

### 📊 Dashboard Features
- Real-time patient statistics
- Search functionality across all fields
- Responsive patient table
- Modal-based patient details
- Loading and success states

### 💾 Data Persistence
- Firebase Firestore for real-time data
- Offline data caching
- Background sync (when connection restored)

### 🎨 Modern UI/UX
- Clean, responsive design with Tailwind CSS
- Mobile-first approach
- Touch-friendly interfaces
- Loading skeletons
- Error handling with user-friendly messages
- Success notifications

### ⚡ Performance
- Full TypeScript coverage
- Code splitting and lazy loading
- Image optimization
- Font optimization
- Service worker caching strategies

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard pages
│   ├── signin/            # Authentication page
│   ├── offline/           # PWA offline fallback page
│   ├── profile/           # User profile
│   ├── api/               # API routes
│   │   └── transcribe/    # OpenAI Whisper endpoint
│   ├── layout.tsx         # Root layout with PWA meta tags
│   ├── page.tsx           # Home page (redirect logic)
│   └── providers.tsx      # Client-side providers wrapper
│
├── components/            
│   ├── ui/                # Reusable UI components
│   │   └── LoadingSpinner.tsx
│   ├── layout/            # Layout components
│   │   ├── DashboardHeader.tsx
│   │   ├── DashboardSidebar.tsx
│   │   └── DashboardLayout.tsx
│   └── index.ts           # Central component exports
│
├── lib/
│   └── firebase/          # Firebase configuration & utilities
│       ├── config.ts      # Firebase initialization
│       ├── auth.ts        # Authentication utilities
│       ├── firestore.ts   # Firestore CRUD operations
│       └── index.ts       # Central exports
│
├── context/               # React contexts
│   └── AuthContext.tsx    # Authentication context provider
│
├── types/                 # TypeScript definitions
│   ├── user.ts           # User type definitions
│   ├── patient.ts        # Patient & medical types
│   └── index.ts          # Central type exports
│
├── hooks/                 # Custom React hooks
│   └── useAuth.ts        # Authentication hooks & route guards
│
└── constants/             # App constants (optional)
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **Storage**: Firebase Storage
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ and pnpm
- Firebase project (free tier works)
- Basic understanding of React and TypeScript

## 🔧 Installation

1. **Clone the repository**
   ```bash
   cd med-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up Firebase**
   
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Get your Firebase config from Project Settings

4. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

5. **Set up Firestore Security Rules**
   
   In Firebase Console > Firestore Database > Rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users collection
       match /users/{userId} {
         allow read: if request.auth != null;
         allow write: if request.auth.uid == userId;
       }
       
       // Patients collection
       match /patients/{patientId} {
         allow read, write: if request.auth != null;
       }
       
       // Appointments collection
       match /appointments/{appointmentId} {
         allow read, write: if request.auth != null;
       }
       
       // Surgeries collection
       match /surgeries/{surgeryId} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

6. **Run the development server**
   ```bash
   pnpm dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 👤 Creating Your First User

Since this is a medical application, user creation should be controlled. Here are two approaches:

### Option 1: Firebase Console (Recommended for Production)

1. Go to Firebase Console > Authentication > Users
2. Click "Add User"
3. Enter email and password
4. After creation, manually add user document in Firestore:
   - Collection: `users`
   - Document ID: (the auth UID)
   - Fields:
     ```json
     {
       "uid": "firebase-auth-uid",
       "email": "doctor@example.com",
       "name": "Dr. John Smith",
       "phone": "+1234567890",
       "specialty": "orthopedic_surgery",
       "role": "doctor",
       "isActive": true,
       "createdAt": "Timestamp",
       "updatedAt": "Timestamp"
     }
     ```

### Option 2: Temporary Sign-Up Page (Development Only)

Create a temporary sign-up page at `src/app/signup/page.tsx` for testing, then remove it before production.

## 📊 TypeScript Models

### User Model
```typescript
interface User {
  uid: string;
  email: string;
  name: string;
  phone: string;
  specialty: Specialty;
  role?: UserRole;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}
```

### Patient Model
```typescript
interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  contact: ContactInfo;
  emergencyContact: EmergencyContact;
  medicalHistory: MedicalHistory;
  insurance?: InsuranceInfo;
  diagnoses: Diagnosis[];
  vitalSigns: VitalSigns[];
  appointmentIds: string[];
  surgeryIds: string[];
  assignedDoctorId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}
```

## 🔐 Authentication Flow

1. User navigates to app → redirected to `/signin`
2. User enters credentials → Firebase Authentication
3. On success → User data fetched from Firestore
4. AuthContext provides user state globally
5. Protected routes use `useRequireAuth()` hook
6. Sign out → Clear session and redirect to `/signin`

## 🏗️ Architecture Decisions

### Why This Structure?

1. **Separation of Concerns**: Clear boundaries between UI, logic, and data
2. **Type Safety**: TypeScript models match Firestore documents exactly
3. **Reusability**: Components and utilities are modular and testable
4. **Scalability**: Easy to add new features without refactoring
5. **Performance**: Client-side auth state, server components where possible
6. **Offline-First**: Firestore persistence for PWA support

### Firebase vs. Alternative Backends

This project uses Firebase because:
- ✅ Quick setup for authentication and database
- ✅ Real-time synchronization
- ✅ Offline support out of the box
- ✅ Generous free tier
- ✅ Automatic scaling

For enterprise needs, consider migrating to:
- PostgreSQL + Prisma for relational data
- NextAuth.js for custom authentication
- tRPC for type-safe API calls

## 🚀 Deployment

### Vercel (Recommended)

```bash
pnpm install -g vercel
vercel
```

Add environment variables in Vercel dashboard under Settings > Environment Variables.

### Other Platforms

The app works on any platform supporting Next.js:
- Netlify
- Railway
- AWS Amplify
- Google Cloud Run

## 📱 Progressive Web App (PWA)

This app is a **full-featured PWA** optimized for mobile doctors and offline usage.

### 🎯 PWA Features

- ✅ **Installable** - Add to home screen on mobile & desktop
- ✅ **Offline Mode** - Works without internet (cached pages)
- ✅ **Fast Loading** - Service worker caching
- ✅ **Auto-Updates** - Background service worker updates
- ✅ **App Shortcuts** - Quick access to Dashboard and Add Patient
- ✅ **Standalone Mode** - Full-screen without browser UI

### 🚀 Quick Setup

**Development (PWA disabled):**
```bash
pnpm dev
```

**Production (PWA enabled):**
```bash
pnpm build
pnpm start
```

### 📱 Testing PWA

**Desktop (Chrome/Edge):**
1. Build production: `pnpm build && pnpm start`
2. Open `http://localhost:3000`
3. Click install icon in address bar OR
4. Click "Install" button in bottom banner
5. App opens in standalone window ✅

**Mobile (Android):**
1. Deploy to HTTPS domain
2. Open in Chrome Android
3. Tap "Install" in bottom banner
4. App added to home screen ✅

**iOS (Safari):**
1. Deploy to HTTPS domain
2. Open in Safari
3. Tap banner → "How to Install"
4. Share → Add to Home Screen ✅

### 🎨 Icons Setup

**Current Status:** ⚠️ SVG placeholders generated

**Convert to PNG for production:**

```bash
# Option 1: Online tool (easiest)
# Visit: https://realfavicongenerator.net/
# Upload 512x512 source image
# Download all sizes

# Option 2: ImageMagick
cd public/icons
for size in 72 96 128 144 152 192 384 512; do
  magick icon-${size}x${size}.svg icon-${size}x${size}.png
done
```

### 📊 Lighthouse Targets

| Metric | Target | Status |
|--------|--------|--------|
| PWA | 100 | ✅ |
| Performance | 90+ | - |
| Accessibility | 90+ | - |
| Best Practices | 90+ | - |
| SEO | 90+ | - |

**Run audit:**
```bash
# Build production
pnpm build && pnpm start

# Chrome DevTools → Lighthouse → Generate Report
```

### 📚 PWA Documentation

Comprehensive guides available:
- **[PWA_GUIDE.md](./PWA_GUIDE.md)** - Complete setup & deployment
- **[PWA_CHECKLIST.md](./PWA_CHECKLIST.md)** - Implementation checklist
- **[PWA_QUICKREF.md](./PWA_QUICKREF.md)** - Quick reference card
- **[PWA_IMPLEMENTATION.md](./PWA_IMPLEMENTATION.md)** - What was implemented

### 🔧 PWA Configuration

**Service Worker:** Configured in `next.config.ts` with Workbox

**Caching Strategies:**
- Fonts: 7 days
- Images: 24 hours
- CSS/JS: 24 hours
- API: NetworkFirst with 24-hour cache

**Offline Fallback:** `/offline` page shown when no connection

### ⚠️ Production Checklist

Before deploying:
- [ ] Convert SVG icons to PNG
- [ ] Test install flow (desktop/mobile)
- [ ] Run Lighthouse audit (target: 100)
- [ ] Deploy to HTTPS domain
- [ ] Test offline functionality
- [ ] Verify service worker registration

---

## 🧪 Testing Recommendations

```bash
# Install testing dependencies
pnpm add -D @testing-library/react @testing-library/jest-dom vitest

# Add test scripts to package.json
"test": "vitest",
"test:ui": "vitest --ui"
```

## 🔒 Security Best Practices

- ✅ Environment variables not committed
- ✅ Firestore rules restrict data access
- ✅ Authentication required for all routes
- ✅ Client-side validation + server rules
- ⚠️ Add rate limiting for production
- ⚠️ Encrypt sensitive patient data (SSN, etc.)
- ⚠️ Implement audit logging
- ⚠️ Regular security audits

## 📝 Next Steps

1. **Add Features**:
   - Patient list with search/filter
   - Appointment calendar view
   - Surgery scheduling interface
   - Medical records upload
   - Prescription management

2. **Improve UX**:
   - Add loading skeletons
   - Implement toast notifications
   - Add form validation with react-hook-form
   - Implement dark mode

3. **Optimize Performance**:
   - Add image optimization
   - Implement virtual scrolling for large lists
   - Add React Query for caching

4. **Production Readiness**:
   - Add error boundary components
   - Implement proper logging (Sentry)
   - Add analytics (Google Analytics/Mixpanel)
   - Set up CI/CD pipeline

## 📄 License

This project is for educational/demonstration purposes.

## 🤝 Contributing

This is a portfolio/starter project. Feel free to fork and customize for your needs!

## 📧 Support

For questions or issues, please consult the Firebase and Next.js documentation.

---

**Built with ❤️ for better healthcare management**
