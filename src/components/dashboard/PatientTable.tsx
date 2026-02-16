/**
 * PatientTable Component
 * Displays patients in a responsive table with essential columns
 */

"use client";

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

    return (
        <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full border-collapse bg-white">
                <TableHeader />
                <tbody>
                    {patients.map((patient) => (
                        <tr
                            key={patient.id}
                            onClick={() => onRowClick(patient)}
                            className="border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors"
                        >
                            <td className="px-4 py-3 font-medium text-gray-900">
                                {patient.patientName}
                            </td>
                            <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                                {patient.age}
                            </td>
                            <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                                {formatDate(patient.date)}
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                                <div className="max-w-xs truncate">{patient.diagnosis}</div>
                            </td>
                            <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">
                                <div className="max-w-xs truncate">{patient.procedure}</div>
                            </td>
                            <td className="px-4 py-3 text-gray-600 hidden xl:table-cell">
                                {patient.hospital}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function TableHeader() {
    return (
        <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Patient Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">
                    Age
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                    Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Diagnosis
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                    Procedure
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden xl:table-cell">
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
