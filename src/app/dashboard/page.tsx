/**
 * Dashboard Home Page - Patient Management
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components";
import { useAuth } from "@/context/AuthContext";
import { PatientTable, PatientCard } from "@/components/dashboard";
import { PatientDetailsModal } from "@/components/dashboard/PatientDetailsModal";
import { AddPatientModal } from "@/components/dashboard/AddPatientModal";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { getAllPatients, searchPatients } from "@/lib/firebase/patients";
import type { Patient } from "@/types/patient";

export default function DashboardPage() {
    const { user } = useAuth();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch patients function
    const fetchPatients = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getAllPatients();
            setPatients(data);
            setFilteredPatients(data);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to load patients"
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch patients on mount
    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    // Handle search
    const handleSearch = useCallback(
        async (query: string) => {
            setSearchQuery(query);

            if (!query.trim()) {
                setFilteredPatients(patients);
                return;
            }

            try {
                const results = await searchPatients(query);
                setFilteredPatients(results);
            } catch (err) {
                console.error("Search error:", err);
                // Fall back to client-side search if server search fails
                const query = searchQuery.toLowerCase();
                const results = patients.filter(
                    (p) =>
                        p.patientName.toLowerCase().includes(query) ||
                        p.diagnosis.toLowerCase().includes(query) ||
                        p.procedure?.toLowerCase().includes(query)
                );
                setFilteredPatients(results);
            }
        },
        [patients, searchQuery]
    );

    // Handle row click
    const handleRowClick = (patient: Patient) => {
        setSelectedPatient(patient);
        setIsDetailsModalOpen(true);
    };

    // Handle details modal close
    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setTimeout(() => setSelectedPatient(null), 200);
    };

    // Handle add patient success
    const handleAddPatientSuccess = () => {
        fetchPatients(); // Refresh the patient list
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header - Hidden on mobile since we have the top header */}
                <div className="hidden sm:flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Patient Management
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {isLoading
                                ? "Loading patients..."
                                : `${filteredPatients.length} ${filteredPatients.length === 1 ? "patient" : "patients"
                                } ${searchQuery ? "found" : "total"}`}
                        </p>
                    </div>
                    {/* Desktop Add Button - hidden on mobile */}
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Add New
                    </button>
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-4">
                    <SearchBar
                        onSearch={handleSearch}
                        placeholder="Search by name, diagnosis, procedure..."
                    />
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <svg
                                className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <div>
                                <h3 className="font-semibold text-red-900">
                                    Error loading patients
                                </h3>
                                <p className="text-red-700 text-sm mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Patient Table (Desktop) */}
                <div className="hidden sm:block bg-white rounded-lg shadow-sm">
                    <PatientTable
                        patients={filteredPatients}
                        onRowClick={handleRowClick}
                        isLoading={isLoading}
                    />
                </div>

                {/* Patient Cards (Mobile) */}
                <div className="sm:hidden space-y-3">
                    {isLoading ? (
                        // Loading skeleton for cards
                        Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse"
                            >
                                <div className="flex justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                                </div>
                            </div>
                        ))
                    ) : filteredPatients.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                                No patients found
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchQuery
                                    ? "Try adjusting your search"
                                    : "Get started by adding a new patient"}
                            </p>
                        </div>
                    ) : (
                        filteredPatients.map((patient) => (
                            <PatientCard
                                key={patient.id}
                                patient={patient}
                                onClick={handleRowClick}
                            />
                        ))
                    )}
                </div>

                {/* Floating Add Button (Mobile Only) */}
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="sm:hidden fixed bottom-20 right-6 z-40 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 flex items-center justify-center"
                    aria-label="Add new patient"
                >
                    <svg
                        className="w-7 h-7"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                </button>

                {/* Patient Details Modal */}
                <PatientDetailsModal
                    patient={selectedPatient}
                    isOpen={isDetailsModalOpen}
                    onClose={handleCloseDetailsModal}
                />

                {/* Add Patient Modal */}
                <AddPatientModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSuccess={handleAddPatientSuccess}
                />
            </div>
        </DashboardLayout>
    );
}
