/**
 * User type definitions for the medical dashboard
 */

import type { Timestamp } from "firebase/firestore";

export type UserRole = "admin" | "doctor" | "nurse" | "staff";

export type Specialty =
  | "orthopedic_surgery"
  | "sports_medicine"
  | "joint_replacement"
  | "trauma_surgery"
  | "spine_surgery"
  | "pediatric_orthopedics"
  | "hand_surgery"
  | "foot_ankle_surgery";

export interface User {
  uid: string;
  email: string;
  name: string;
  phone: string;
  specialty: Specialty;
  role?: UserRole;
  photoURL?: string;
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

export interface UserProfile extends Omit<User, "uid"> {
  // Additional profile fields that don't come from auth
  licenseNumber?: string;
  yearsOfExperience?: number;
  education?: string[];
  certifications?: string[];
}

// Firestore document shape (dates as Timestamps)
export interface UserDocument extends Omit<
  User,
  "createdAt" | "updatedAt" | "lastLoginAt"
> {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  lastLoginAt?: Timestamp;
}
