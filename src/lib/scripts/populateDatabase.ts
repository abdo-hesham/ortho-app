/**
 * Database Population Script
 *
 * Run this script to populate Firestore with sample patient data
 * Usage: Create a temporary page or API route and call populateDatabase()
 */

import { createPatient } from "@/lib/firebase/patients";
import { samplePatients } from "@/lib/data/samplePatients";

/**
 * Populate Firestore with sample patients
 *
 * @returns Promise with results
 */
export async function populateDatabase() {
  console.log("🏥 Starting database population...");
  console.log(`📋 Adding ${samplePatients.length} patients...`);

  const results = {
    success: 0,
    failed: 0,
    errors: [] as Array<{ patient: string; error: string }>,
  };

  for (const patient of samplePatients) {
    try {
      const id = await createPatient(patient);
      console.log(`✅ Created patient: ${patient.patientName} (ID: ${id})`);
      results.success++;
    } catch (error) {
      console.error(
        `❌ Failed to create patient: ${patient.patientName}`,
        error,
      );
      results.failed++;
      results.errors.push({
        patient: patient.patientName,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  console.log("\n📊 Population complete!");
  console.log(`✅ Success: ${results.success}`);
  console.log(`❌ Failed: ${results.failed}`);

  if (results.errors.length > 0) {
    console.log("\n❌ Errors:");
    results.errors.forEach(({ patient, error }) => {
      console.log(`  - ${patient}: ${error}`);
    });
  }

  return results;
}

/**
 * Clear all patients from Firestore (DANGEROUS!)
 * Only use in development
 */
export async function clearDatabase() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Cannot clear database in production!");
  }

  console.log("⚠️  Clearing database...");

  // Import deletePatient function
  const { getAllPatients, deletePatient } =
    await import("@/lib/firebase/patients");

  const patients = await getAllPatients();

  console.log(`🗑️  Deleting ${patients.length} patients...`);

  for (const patient of patients) {
    try {
      await deletePatient(patient.id);
      console.log(`✅ Deleted: ${patient.patientName}`);
    } catch (error) {
      console.error(`❌ Failed to delete: ${patient.patientName}`, error);
    }
  }

  console.log("✅ Database cleared!");
}

/**
 * Example usage in a Next.js API route:
 *
 * // app/api/populate-db/route.ts
 * import { NextResponse } from 'next/server';
 * import { populateDatabase } from '@/lib/scripts/populateDatabase';
 *
 * export async function POST() {
 *   try {
 *     const results = await populateDatabase();
 *     return NextResponse.json(results);
 *   } catch (error) {
 *     return NextResponse.json(
 *       { error: 'Failed to populate database' },
 *       { status: 500 }
 *     );
 *   }
 * }
 */

/**
 * Example usage in browser console:
 *
 * // After importing the function in a page
 * populateDatabase().then(console.log);
 */
