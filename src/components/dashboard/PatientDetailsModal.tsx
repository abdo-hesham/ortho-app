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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-all duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-[70] bg-white sm:rounded-3xl shadow-2xl shadow-blue-900/10 w-full h-full sm:h-[85vh] sm:max-w-3xl flex flex-col overflow-hidden ring-1 ring-slate-900/5 transform transition-all scale-100">
                {/* Header */}
                <div className="flex-none px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100 z-10 flex items-center justify-between sticky top-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm ring-4 ring-white shadow-sm">
                            {patient.patientName.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 leading-tight">
                                {patient.patientName}
                            </h2>
                            <p className="text-sm text-slate-500 font-medium mt-0.5">
                                {patient.hospital}
                            </p>
                        </div>
                    </div>
                    
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 bg-gray-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-all duration-200"
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

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 space-y-6">
                    {/* Basic Information */}
                    <Section 
                        title="Basic Details" 
                        colorClass="bg-blue-500"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <Field label="Age" value={`${patient.age} years`} />
                            <Field label="Date" value={formatDate(patient.date)} />
                            <Field label="Created At" value={formatDateTime(patient.createdAt)} />
                        </div>
                    </Section>

                    {/* Medical Information */}
                    <Section 
                        title="Medical Info" 
                        colorClass="bg-purple-500"
                    >
                        <div className="space-y-5">
                            <Field label="Diagnosis" value={patient.diagnosis} highlight />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <Field label="Procedure" value={patient.procedure || 'N/A'} />
                                <Field label="Hospital" value={patient.hospital} />
                            </div>
                        </div>
                    </Section>

                    {/* Follow-up Information */}
                    {patient.plannedFollowUps && (
                        <Section 
                            title="Follow-up Plan" 
                            colorClass="bg-emerald-500"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <StatusCard 
                                    label="1st Follow-up" 
                                    value={patient.plannedFollowUps.first} 
                                    index={1}
                                />
                                <StatusCard 
                                    label="2nd Follow-up" 
                                    value={patient.plannedFollowUps.second} 
                                    index={2}
                                />
                                <StatusCard 
                                    label="3rd Follow-up" 
                                    value={patient.plannedFollowUps.third} 
                                    index={3}
                                />
                            </div>
                        </Section>
                    )}

                    {/* Treatment Details */}
                    <Section 
                        title="Specifics" 
                        colorClass="bg-amber-500"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                        <Section 
                            title="Notes" 
                            colorClass="bg-slate-400"
                        >
                            <div className="space-y-5">
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
                <div className="flex-none p-4 bg-white border-t border-slate-100 z-10 flex justify-end gap-3 sticky bottom-0">
                    <button
                         onClick={onClose}
                         className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-semibold text-sm"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
}

// Section component
function Section({
    title,
    colorClass,
    children,
}: {
    title: string;
    colorClass: string;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                <span className={`w-1.5 h-4 ${colorClass} rounded-full`}></span>
                {title}
            </h3>
            {children}
        </div>
    );
}

// Field component
function Field({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className={highlight ? 'bg-slate-50 p-4 rounded-xl border border-slate-100' : ''}>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">{label}</div>
            <div className={`text-sm ${highlight ? 'font-medium text-slate-800' : 'text-slate-700'}`}>{value}</div>
        </div>
    );
}

function StatusCard({ label, value, index }: { label: string; value?: string; index: number }) {
    if (!value) return null;
    return (
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
             <div className="flex items-center gap-2 mb-1">
                 <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold">
                     {index}
                 </span>
                 <span className="text-xs font-medium text-slate-500">{label}</span>
             </div>
             <div className="text-sm font-semibold text-slate-700 ml-7">
                 {value}
             </div>
        </div>
    )
}

// Date formatting utilities
function formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
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
