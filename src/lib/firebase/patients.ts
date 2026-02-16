/**
 * Firestore utilities for patient management
 */

import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./config";
import type {
  Patient,
  PatientDocument,
  CreatePatientInput,
  UpdatePatientInput,
} from "@/types/patient";

const PATIENTS_COLLECTION = "patients";

/**
 * Convert Firestore PatientDocument to Patient
 */
function convertToPatient(id: string, data: PatientDocument): Patient {
  return {
    id,
    patientName: data.patientName,
    age: parseInt(data.age) || 0, // Convert string to number
    date: data.date ? new Date(data.date) : undefined, // Parse date string
    diagnosis: data.diagnosis,
    procedure: data.procedure,
    hospital: data.hospital,
    expectations: data.expectations,
    followUpParameters: data.followUpParameters,
    kWireRemoval: data.kWireRemoval,
    splintChangeRemoval: data.splintChangeRemoval,
    typeAndSutureRemoval: data.typeAndSutureRemoval,
    plannedFollowUps: data.plannedFollowUps,
    createdAt: data.createdAt?.toDate(),
  };
}

/**
 * Convert Patient to Firestore PatientDocument
 */
function convertToPatientDocument(
  patient: Omit<Patient, "id">,
): Omit<PatientDocument, "id"> {
  const doc: Partial<PatientDocument> = {
    patientName: patient.patientName,
    age: patient.age.toString(), // Convert number to string
    diagnosis: patient.diagnosis,
    hospital: patient.hospital,
  };

  // Add optional fields
  if (patient.date) {
    // Format as YYYY-MM-DD
    doc.date = patient.date.toISOString().split("T")[0];
  }
  if (patient.procedure) doc.procedure = patient.procedure;
  if (patient.expectations) doc.expectations = patient.expectations;
  if (patient.followUpParameters)
    doc.followUpParameters = patient.followUpParameters;
  if (patient.kWireRemoval) doc.kWireRemoval = patient.kWireRemoval;
  if (patient.splintChangeRemoval)
    doc.splintChangeRemoval = patient.splintChangeRemoval;
  if (patient.typeAndSutureRemoval)
    doc.typeAndSutureRemoval = patient.typeAndSutureRemoval;
  if (patient.plannedFollowUps) doc.plannedFollowUps = patient.plannedFollowUps;
  if (patient.createdAt) {
    doc.createdAt = Timestamp.fromDate(patient.createdAt);
  }

  return doc as Omit<PatientDocument, "id">;
}

/**
 * Get all patients from Firestore
 */
export async function getAllPatients(): Promise<Patient[]> {
  try {
    const patientsRef = collection(db, PATIENTS_COLLECTION);
    console.log(patientsRef, "patientsRef");
    // Get all documents without ordering (no index required)
    const snapshot = await getDocs(patientsRef);

    const patients = snapshot.docs.map((doc) =>
      convertToPatient(doc.id, doc.data() as PatientDocument),
    );

    // Sort in memory by date (most recent first)
    return patients.sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return b.date.getTime() - a.date.getTime();
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    throw new Error("Failed to fetch patients");
  }
}

/**
 * Get a single patient by ID
 */
export async function getPatientById(id: string): Promise<Patient | null> {
  try {
    const patientRef = doc(db, PATIENTS_COLLECTION, id);
    const snapshot = await getDoc(patientRef);

    if (!snapshot.exists()) {
      return null;
    }

    return convertToPatient(snapshot.id, snapshot.data() as PatientDocument);
  } catch (error) {
    console.error("Error fetching patient:", error);
    throw new Error("Failed to fetch patient");
  }
}

/**
 * Create a new patient
 */
export async function createPatient(
  input: CreatePatientInput,
): Promise<string> {
  try {
    const patientData: Omit<Patient, "id"> = {
      ...input,
      createdAt: new Date(),
    };

    const docData = convertToPatientDocument(patientData);
    const patientsRef = collection(db, PATIENTS_COLLECTION);
    const docRef = await addDoc(patientsRef, docData);

    return docRef.id;
  } catch (error) {
    console.error("Error creating patient:", error);
    throw new Error("Failed to create patient");
  }
}

/**
 * Update an existing patient
 */
export async function updatePatient(
  id: string,
  input: UpdatePatientInput,
): Promise<void> {
  try {
    const patientRef = doc(db, PATIENTS_COLLECTION, id);

    // Convert to database format
    const updateData: Record<string, unknown> = { ...input };
    if (input.date) {
      updateData.date = input.date.toISOString().split("T")[0]; // Convert to YYYY-MM-DD string
    }
    if (input.age !== undefined) {
      updateData.age = input.age.toString(); // Convert to string
    }

    await updateDoc(patientRef, updateData);
  } catch (error) {
    console.error("Error updating patient:", error);
    throw new Error("Failed to update patient");
  }
}

/**
 * Delete a patient
 */
export async function deletePatient(id: string): Promise<void> {
  try {
    const patientRef = doc(db, PATIENTS_COLLECTION, id);
    await deleteDoc(patientRef);
  } catch (error) {
    console.error("Error deleting patient:", error);
    throw new Error("Failed to delete patient");
  }
}

/**
 * Search patients by query string (searches in multiple fields)
 */
export async function searchPatients(searchQuery: string): Promise<Patient[]> {
  try {
    // Get all patients first (Firestore doesn't support full-text search natively)
    const patients = await getAllPatients();

    if (!searchQuery.trim()) {
      return patients;
    }

    const query = searchQuery.toLowerCase();

    // Search across multiple fields
    return patients.filter((patient) => {
      return (
        patient.patientName.toLowerCase().includes(query) ||
        patient.diagnosis.toLowerCase().includes(query) ||
        patient.procedure?.toLowerCase().includes(query) ||
        patient.hospital.toLowerCase().includes(query) ||
        patient.age.toString().includes(query) ||
        patient.expectations?.toLowerCase().includes(query) ||
        patient.followUpParameters?.toLowerCase().includes(query) ||
        patient.kWireRemoval?.toLowerCase().includes(query) ||
        patient.splintChangeRemoval?.toLowerCase().includes(query) ||
        patient.typeAndSutureRemoval?.toLowerCase().includes(query)
      );
    });
  } catch (error) {
    console.error("Error searching patients:", error);
    throw new Error("Failed to search patients");
  }
}
