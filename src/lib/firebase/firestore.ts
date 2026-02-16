/**
 * Firestore Utilities
 *
 * Provides type-safe CRUD operations for Firestore collections
 * with proper error handling and timestamp conversion.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
  DocumentData,
  serverTimestamp,
  Timestamp,
  WhereFilterOp,
  OrderByDirection,
  DocumentSnapshot,
} from "firebase/firestore";
import { db } from "./config";

/**
 * Generic Firestore CRUD operations
 */

export interface QueryOptions {
  orderBy?: {
    field: string;
    direction?: OrderByDirection;
  };
  limit?: number;
  where?: Array<{
    field: string;
    operator: WhereFilterOp;
    value: unknown;
  }>;
  startAfter?: DocumentSnapshot;
}

/**
 * Convert Firestore Timestamp to Date
 */
const timestampToDate = (
  timestamp: Timestamp | undefined,
): Date | undefined => {
  return timestamp?.toDate();
};

/**
 * Get a single document by ID
 */
export const getDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string,
): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return { id: docSnap.id, ...docSnap.data() } as unknown as T;
  } catch (error) {
    console.error(`Error fetching document from ${collectionName}:`, error);
    throw new Error(`Failed to fetch ${collectionName} document`);
  }
};

/**
 * Get multiple documents with optional filters
 */
export const getDocuments = async <T extends DocumentData>(
  collectionName: string,
  options?: QueryOptions,
): Promise<T[]> => {
  try {
    const constraints: QueryConstraint[] = [];

    // Add where clauses
    if (options?.where) {
      options.where.forEach(({ field, operator, value }) => {
        constraints.push(where(field, operator, value));
      });
    }

    // Add orderBy
    if (options?.orderBy) {
      constraints.push(
        orderBy(options.orderBy.field, options.orderBy.direction || "asc"),
      );
    }

    // Add limit
    if (options?.limit) {
      constraints.push(limit(options.limit));
    }

    // Add pagination
    if (options?.startAfter) {
      constraints.push(startAfter(options.startAfter));
    }

    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as unknown as T,
    );
  } catch (error) {
    console.error(`Error fetching documents from ${collectionName}:`, error);
    throw new Error(`Failed to fetch ${collectionName} documents`);
  }
};

/**
 * Create a new document
 */
export const createDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: Omit<T, "id">,
): Promise<T> => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, docData);

    return { id: docId, ...docData } as unknown as T;
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    throw new Error(`Failed to create ${collectionName} document`);
  }
};

/**
 * Update an existing document
 */
export const updateDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: Partial<T>,
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw new Error(`Failed to update ${collectionName} document`);
  }
};

/**
 * Delete a document
 */
export const deleteDocument = async (
  collectionName: string,
  docId: string,
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw new Error(`Failed to delete ${collectionName} document`);
  }
};
