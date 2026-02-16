/**
 * Quick Start Guide - Dashboard
 */

# 🚀 Quick Start - Dashboard Setup

## Step 1: Configure Firebase

Make sure you have your `.env.local` file configured:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Step 2: Create Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click "Firestore Database" in the left sidebar
4. Click "Create database"
5. Choose "Start in test mode" (for development)
6. Select your region
7. Click "Enable"

## Step 3: Create Firestore Index

The dashboard requires an index for optimal performance:

1. Go to Firestore Console > Indexes tab
2. Click "Create Index"
3. Collection ID: `patients`
4. Add field: `createdAt` (Descending)
5. Query scope: Collection
6. Click "Create"

**OR** run a query and Firebase will prompt you to create the index automatically.

## Step 4: Add Sample Data

### Option 1: Manual Entry (Firebase Console)

1. Go to Firestore Database
2. Click "Start collection"
3. Collection ID: `patients`
4. Add document with these fields:
   - `patientName` (string)
   - `age` (number)
   - `date` (timestamp)
   - `diagnosis` (string)
   - `procedure` (string)
   - `hospital` (string)
   - `createdAt` (timestamp)

### Option 2: Use Sample Data Script (Recommended)

Create a temporary API route to populate the database:

**Create file:** `src/app/api/populate-db/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { populateDatabase } from '@/lib/scripts/populateDatabase';

export async function POST() {
  try {
    const results = await populateDatabase();
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to populate database' },
      { status: 500 }
    );
  }
}
```

Then call it:

```bash
# In your browser or using curl
curl -X POST http://localhost:3000/api/populate-db
```

**OR** add this button to your dashboard temporarily:

```tsx
// In dashboard/page.tsx
<button onClick={async () => {
  const { populateDatabase } = await import('@/lib/scripts/populateDatabase');
  await populateDatabase();
}} className="px-4 py-2 bg-green-600 text-white rounded">
  Populate DB
</button>
```

### Option 3: Browser Console

1. Open your dashboard in browser
2. Open DevTools Console (F12)
3. Paste and run:

```javascript
// Import the function
const { populateDatabase } = await import('/src/lib/scripts/populateDatabase.ts');

// Run it
await populateDatabase();
```

## Step 5: Run the Application

```bash
# Start development server
pnpm dev

# Open in browser
http://localhost:3000/dashboard
```

## Step 6: Sign In

1. Navigate to http://localhost:3000/signin
2. Sign in with your Firebase user account
3. You'll be redirected to /dashboard

## Expected Result

After completing all steps, you should see:

✅ Dashboard page loads
✅ Patient table shows 8 sample patients
✅ Search bar filters patients
✅ Clicking a row opens patient details modal
✅ "Add New" button is visible (functionality to be implemented)

## Troubleshooting

### Issue: "No patients found"

**Solution:**
- Check Firestore console - is the `patients` collection created?
- Verify Firebase config in `.env.local`
- Check browser console for errors
- Run the populate script again

### Issue: "Failed to fetch patients"

**Solution:**
- Verify Firestore security rules allow reading
- Check network tab for 403 errors
- Ensure you're signed in
- Verify Firebase project is active

### Issue: "Error loading patients"

**Solution:**
- Check browser console for detailed error
- Verify Firestore index is created
- Check that dates are valid Timestamps
- Ensure all required fields exist in documents

### Issue: Build errors

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
pnpm install

# Rebuild
pnpm build
```

## Next Steps

Once the dashboard is working:

1. **Implement "Add New" functionality** - Create a form to add patients
2. **Edit patients** - Add edit capability to the modal
3. **Delete patients** - Add delete confirmation dialog
4. **Advanced search** - Filter by date range, hospital, procedure
5. **Export data** - Add CSV/PDF export functionality

## Sample Firestore Document

Here's what a patient document looks like in Firestore:

```json
{
  "patientName": "Ahmad Hassan",
  "age": 45,
  "date": "2024-02-05T00:00:00.000Z",
  "diagnosis": "Distal Radius Fracture",
  "procedure": "ORIF with Volar Plate Fixation",
  "hospital": "King Fahd Medical City",
  "expectations": "Full range of motion recovery in 12 weeks",
  "followUpParameters": "Monitor healing, assess grip strength weekly",
  "kWireRemoval": "Week 6 post-op",
  "splintChangeRemoval": "Week 2, Week 4",
  "typeAndSutureRemoval": "Week 3 - Absorbable sutures",
  "plannedFollowUps": {
    "first": "Week 2 - Feb 19, 2024",
    "second": "Week 6 - Mar 18, 2024",
    "third": "Week 12 - Apr 29, 2024"
  },
  "createdAt": "2024-02-11T10:30:00.000Z"
}
```

## Testing Checklist

Before considering the dashboard complete, test:

- [ ] Table loads with data
- [ ] Search filters correctly
- [ ] Modal opens with complete details
- [ ] Mobile responsive (resize browser)
- [ ] Loading states display
- [ ] Empty state shows when no data
- [ ] Error handling works (disconnect network)

## Support

If you encounter issues:

1. Check [DASHBOARD.md](./DASHBOARD.md) for detailed documentation
2. Review type definitions in `src/types/patient.ts`
3. Inspect Firestore console for data
4. Check browser console for errors
5. Verify Firebase security rules

---

**You're all set! 🎉**

Your dashboard is now ready for patient management.
