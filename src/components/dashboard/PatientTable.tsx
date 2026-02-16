/**
 * PatientTable Component
 * Displays patients in a responsive table with essential columns
 */

"use client";

import { useState } from "react";
import type { Patient } from "@/types/patient";

interface PatientTableProps {
    patients: Patient[];
    onRowClick: (patient: Patient) => void;
    isLoading?: boolean;
}

export function PatientTable({ patients, onRowClick, isLoading }: PatientTableProps) {
    if (isLoading) {
        return (
            <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse">
                    <TableHeader />
                    <tbody>
                        {[...Array(5)].map((_, i) => (
                            <tr key={i} className="border-b border-gray-200">
                                <td className="px-4 py-3">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                                </td>
                                <td className="px-4 py-3 hidden sm:table-cell">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-40" />
                                </td>
                                <td className="px-4 py-3 hidden lg:table-cell">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-28" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (patients.length === 0) {
        return (
            <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse">
                    <TableHeader />
                    <tbody>
                        <tr>
                            <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                                <div className="flex flex-col items-center gap-2">
                                    <svg
                                        className="w-16 h-16 text-gray-300"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    <p className="text-lg font-medium">No patients found</p>
                                    <p className="text-sm">Click "Add New" to create your first patient record</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const totalPages = Math.ceil(patients.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPatients = patients.slice(startIndex, startIndex + itemsPerPage);

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="space-y-4">
            <div className="w-full overflow-x-auto rounded-2xl border border-slate-100 shadow-sm bg-white">
                <table className="w-full border-collapse">
                    <TableHeader />
                    <tbody>
                        {currentPatients.map((patient) => (
                            <tr
                                key={patient.id}
                                onClick={() => onRowClick(patient)}
                                className="border-b border-slate-50 last:border-b-0 hover:bg-blue-50/50 cursor-pointer transition-colors group"
                            >
                                <td className="px-6 py-4 font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                                    {patient.patientName}
                                </td>
                                <td className="px-6 py-4 text-slate-500 font-medium hidden sm:table-cell">
                                    {patient.age}
                                </td>
                                <td className="px-6 py-4 text-slate-500 hidden md:table-cell">
                                    {formatDate(patient.date)}
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    <div className="max-w-xs truncate font-medium">{patient.diagnosis}</div>
                                </td>
                                <td className="px-6 py-4 text-slate-500 hidden lg:table-cell">
                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100">
                                        {patient.procedure || 'Consultation'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 hidden xl:table-cell">
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        {patient.hospital}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                    <div className="text-sm text-slate-500">
                        Showing <span className="font-semibold text-slate-700">{startIndex + 1}</span> to <span className="font-semibold text-slate-700">{Math.min(startIndex + itemsPerPage, patients.length)}</span> of <span className="font-semibold text-slate-700">{patients.length}</span> patients
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => goToPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => goToPage(page)}
                                    className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                                        currentPage === page
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function TableHeader() {
    return (
        <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Patient Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                    Age
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                    Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Diagnosis
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                    Procedure
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden xl:table-cell">
                    Hospital
                </th>
            </tr>
        </thead>
    );
}

function formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}
