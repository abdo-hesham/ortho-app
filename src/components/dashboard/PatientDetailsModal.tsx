/**
 * PatientDetailsModal Component
 * Displays full patient information in a modal
 */

"use client";

import { useEffect } from "react";
import type { Patient } from "@/types/patient";

interface PatientDetailsModalProps {
    patient: Patient | null;
    isOpen: boolean;
    onClose: () => void;
}

export function PatientDetailsModal({
    patient,
    isOpen,
    onClose,
}: PatientDetailsModalProps) {
    // Close modal on ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen || !patient) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">{patient.patientName}</h2>
                            <p className="text-blue-100 text-sm mt-1">
                                Patient ID: {patient.id}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            aria-label="Close modal"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Basic Information */}
                    <Section title="Basic Information">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Age" value={`${patient.age} years`} />
                            <Field label="Date" value={formatDate(patient.date)} />
                            <Field
                                label="Created At"
                                value={formatDateTime(patient.createdAt)}
                            />
                        </div>
                    </Section>

                    {/* Medical Information */}
                    <Section title="Medical Information">
                        <div className="space-y-4">
                            <Field label="Diagnosis" value={patient.diagnosis} />
                            <Field label="Procedure" value={patient.procedure || 'N/A'} />
                            <Field label="Hospital" value={patient.hospital} />
                        </div>
                    </Section>

                    {/* Follow-up Information */}
                    {patient.plannedFollowUps && (
                        <Section title="Planned Follow-ups">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <Field
                                    label="First Follow-up"
                                    value={patient.plannedFollowUps.first || "Not scheduled"}
                                />
                                <Field
                                    label="Second Follow-up"
                                    value={patient.plannedFollowUps.second || "Not scheduled"}
                                />
                                <Field
                                    label="Third Follow-up"
                                    value={patient.plannedFollowUps.third || "Not scheduled"}
                                />
                            </div>
                        </Section>
                    )}

                    {/* Treatment Details */}
                    <Section title="Treatment Details">
                        <div className="space-y-4">
                            {patient.kWireRemoval && (
                                <Field label="K-Wire Removal" value={patient.kWireRemoval} />
                            )}
                            {patient.splintChangeRemoval && (
                                <Field
                                    label="Splint Change/Removal"
                                    value={patient.splintChangeRemoval}
                                />
                            )}
                            {patient.typeAndSutureRemoval && (
                                <Field
                                    label="Type & Suture Removal"
                                    value={patient.typeAndSutureRemoval}
                                />
                            )}
                        </div>
                    </Section>

                    {/* Additional Information */}
                    {(patient.expectations || patient.followUpParameters) && (
                        <Section title="Additional Information">
                            <div className="space-y-4">
                                {patient.expectations && (
                                    <Field label="Expectations" value={patient.expectations} />
                                )}
                                {patient.followUpParameters && (
                                    <Field
                                        label="Follow-up Parameters"
                                        value={patient.followUpParameters}
                                    />
                                )}
                            </div>
                        </Section>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Close
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            Edit Patient
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Section component
function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                {title}
            </h3>
            {children}
        </div>
    );
}

// Field component
function Field({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <div className="text-sm font-medium text-gray-500 mb-1">{label}</div>
            <div className="text-base text-gray-900">{value}</div>
        </div>
    );
}

// Date formatting utilities
function formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(date);
}

function formatDateTime(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}
