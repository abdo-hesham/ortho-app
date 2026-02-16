/**
 * Patient type definitions for orthopedic surgery management
 */

import type { Timestamp } from "firebase/firestore";

export interface PlannedFollowUps {
  first?: string;
  second?: string;
  third?: string;
}

export interface Patient {
  id: string;
  patientName: string;
  age: number;
  date?: Date;
  diagnosis: string;
  procedure?: string;
  hospital: string;
  expectations?: string;
  followUpParameters?: string;
  kWireRemoval?: string;
  splintChangeRemoval?: string;
  typeAndSutureRemoval?: string;
  plannedFollowUps?: PlannedFollowUps;
  createdAt?: Date;
}

// Firestore document shape (matches actual database structure)
export interface PatientDocument {
  patientName: string;
  age: string; // Stored as string in database
  date?: string; // Stored as string "YYYY-MM-DD" in database
  diagnosis: string;
  procedure?: string;
  hospital: string;
  expectations?: string;
  followUpParameters?: string;
  kWireRemoval?: string;
  splintChangeRemoval?: string;
  typeAndSutureRemoval?: string;
  plannedFollowUps?: PlannedFollowUps;
  createdAt?: Timestamp;
}

// Utility type for creating new patients (without auto-generated fields)
export type CreatePatientInput = Omit<Patient, "id" | "createdAt">;

// Utility type for updating patients
export type UpdatePatientInput = Partial<Omit<Patient, "id" | "createdAt">>;
