/**
 * Application Constants
 */

export const APP_NAME = "OrthoCare Dashboard";
export const APP_VERSION = "1.0.0";

// Firestore Collection Names
export const COLLECTIONS = {
  USERS: "users",
  PATIENTS: "patients",
  APPOINTMENTS: "appointments",
  SURGERIES: "surgeries",
} as const;

// Route Paths
export const ROUTES = {
  HOME: "/",
  SIGNIN: "/signin",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  PATIENTS: "/dashboard/patients",
  APPOINTMENTS: "/dashboard/appointments",
  SURGERIES: "/dashboard/surgeries",
  PROFILE: "/profile",
} as const;

// Specialties
export const SPECIALTIES = [
  { value: "orthopedic_surgery", label: "Orthopedic Surgery" },
  { value: "sports_medicine", label: "Sports Medicine" },
  { value: "joint_replacement", label: "Joint Replacement" },
  { value: "trauma_surgery", label: "Trauma Surgery" },
  { value: "spine_surgery", label: "Spine Surgery" },
  { value: "pediatric_orthopedics", label: "Pediatric Orthopedics" },
  { value: "hand_surgery", label: "Hand Surgery" },
  { value: "foot_ankle_surgery", label: "Foot & Ankle Surgery" },
] as const;

// User Roles
export const USER_ROLES = [
  { value: "admin", label: "Administrator" },
  { value: "doctor", label: "Doctor" },
  { value: "nurse", label: "Nurse" },
  { value: "staff", label: "Staff" },
] as const;

// Appointment Types
export const APPOINTMENT_TYPES = [
  { value: "consultation", label: "Consultation" },
  { value: "follow-up", label: "Follow-up" },
  { value: "pre-op", label: "Pre-Operative" },
  { value: "post-op", label: "Post-Operative" },
  { value: "therapy", label: "Physical Therapy" },
] as const;

// Appointment Statuses
export const APPOINTMENT_STATUSES = [
  { value: "scheduled", label: "Scheduled" },
  { value: "confirmed", label: "Confirmed" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no-show", label: "No Show" },
] as const;

// Surgery Statuses
export const SURGERY_STATUSES = [
  { value: "planned", label: "Planned" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "postponed", label: "Postponed" },
] as const;

// Blood Types
export const BLOOD_TYPES = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

// Genders
export const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
] as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Date/Time Formats
export const DATE_FORMAT = "MM/DD/YYYY";
export const TIME_FORMAT = "HH:mm";
export const DATETIME_FORMAT = "MM/DD/YYYY HH:mm";
