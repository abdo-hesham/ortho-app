/**
 * PatientCard Component
 * Mobile-optimized card view for patient information
 */

"use client";

import type { Patient } from "@/types/patient";

interface PatientCardProps {
    patient: Patient;
    onClick: (patient: Patient) => void;
}

export function PatientCard({ patient, onClick }: PatientCardProps) {
    const formatDate = (date?: Date) => {
        if (!date) return 'N/A';
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(date);
    };

    return (
        <div
            onClick={() => onClick(patient)}
            className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
        >
            {/* Patient Name and Date */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {patient.patientName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {patient.hospital}
                    </p>
                </div>
                <div className="text-sm text-gray-500 ml-2 flex-shrink-0">
                    {formatDate(patient.date)}
                </div>
            </div>

            {/* Diagnosis and Procedure */}
            <div className="space-y-2">
                <div>
                    <span className="text-sm font-medium text-gray-700">Diagnosis: </span>
                    <span className="text-sm text-gray-600">{patient.diagnosis}</span>
                </div>
                <div>
                    <span className="text-sm font-medium text-gray-700">Procedure: </span>
                    <span className="text-sm text-gray-600">{patient.procedure || 'N/A'}</span>
                </div>
            </div>

            {/* Created Date */}
            <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                    Created {formatDate(patient.createdAt)}
                </p>
            </div>
        </div>
    );
}
