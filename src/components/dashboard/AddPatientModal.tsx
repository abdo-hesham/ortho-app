/**
 * AddPatientModal Component
 * Modal form for creating new patient records
 */

"use client";

import { useState, useEffect } from "react";
import { FormInputWithVoice, FormTextareaWithVoice } from "@/components/forms";
import { createPatient } from "@/lib/firebase/patients";
import type { CreatePatientInput } from "@/types/patient";

interface AddPatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface FormErrors {
    patientName?: string;
    age?: string;
    date?: string;
    diagnosis?: string;
    procedure?: string;
    hospital?: string;
}

export function AddPatientModal({
    isOpen,
    onClose,
    onSuccess,
}: AddPatientModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        patientName: "",
        age: "",
        date: "",
        diagnosis: "",
        procedure: "",
        hospital: "",
        expectations: "",
        followUpParameters: "",
        kWireRemoval: "",
        splintChangeRemoval: "",
        typeAndSutureRemoval: "",
        followUpFirst: "",
        followUpSecond: "",
        followUpThird: "",
    });

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            // Delay reset to avoid visual flicker
            setTimeout(() => {
                setFormData({
                    patientName: "",
                    age: "",
                    date: "",
                    diagnosis: "",
                    procedure: "",
                    hospital: "",
                    expectations: "",
                    followUpParameters: "",
                    kWireRemoval: "",
                    splintChangeRemoval: "",
                    typeAndSutureRemoval: "",
                    followUpFirst: "",
                    followUpSecond: "",
                    followUpThird: "",
                });
                setErrors({});
                setSubmitError(null);
                setShowSuccess(false);
            }, 200);
        }
    }, [isOpen]);

    // Close modal on ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !isSubmitting) onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, isSubmitting, onClose]);

    // Handle input change
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    // Handle voice input for individual fields
    const handleFieldVoice = (fieldName: string, text: string) => {
        setFormData((prev) => ({ ...prev, [fieldName]: text }));
        // Clear error for this field
        if (errors[fieldName as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
        }
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Required fields
        if (!formData.patientName.trim()) {
            newErrors.patientName = "Patient name is required";
        }

        if (!formData.age || parseInt(formData.age) <= 0) {
            newErrors.age = "Valid age is required";
        } else if (parseInt(formData.age) > 150) {
            newErrors.age = "Age must be realistic";
        }

        if (!formData.date) {
            newErrors.date = "Date is required";
        }

        if (!formData.diagnosis.trim()) {
            newErrors.diagnosis = "Diagnosis is required";
        }

        if (!formData.procedure.trim()) {
            newErrors.procedure = "Procedure is required";
        }

        if (!formData.hospital.trim()) {
            newErrors.hospital = "Hospital is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            setSubmitError("Please fix the errors above");
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const patientData: CreatePatientInput = {
                patientName: formData.patientName.trim(),
                age: parseInt(formData.age),
                date: new Date(formData.date),
                diagnosis: formData.diagnosis.trim(),
                procedure: formData.procedure.trim(),
                hospital: formData.hospital.trim(),
                expectations: formData.expectations.trim() || undefined,
                followUpParameters: formData.followUpParameters.trim() || undefined,
                kWireRemoval: formData.kWireRemoval.trim() || undefined,
                splintChangeRemoval: formData.splintChangeRemoval.trim() || undefined,
                typeAndSutureRemoval:
                    formData.typeAndSutureRemoval.trim() || undefined,
                plannedFollowUps:
                    formData.followUpFirst ||
                        formData.followUpSecond ||
                        formData.followUpThird
                        ? {
                            first: formData.followUpFirst.trim() || undefined,
                            second: formData.followUpSecond.trim() || undefined,
                            third: formData.followUpThird.trim() || undefined,
                        }
                        : undefined,
            };

            await createPatient(patientData);

            // Show success message
            setShowSuccess(true);

            // Close modal and refresh after short delay
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (error) {
            console.error("Error creating patient:", error);
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Failed to create patient. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
            {/* Backdrop - only show on desktop */}
            <div
                className="hidden sm:block absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={isSubmitting ? undefined : onClose}
            />

            {/* Modal */}
            <div className="relative z-[9999] bg-white sm:rounded-2xl shadow-2xl w-full h-full sm:max-w-3xl sm:w-full sm:h-auto sm:max-h-[90vh] overflow-y-auto">
                {/* Success Overlay */}
                {showSuccess && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex items-center justify-center sm:rounded-2xl">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-green-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">
                                Patient Created Successfully!
                            </h3>
                            <p className="text-gray-600 mt-2">Redirecting...</p>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-3 sm:py-4 sm:rounded-t-2xl z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl sm:text-2xl font-bold truncate">Add New Patient</h2>
                            <p className="text-blue-100 text-xs sm:text-sm mt-1 line-clamp-1">
                                Enter patient information below or use voice dictation
                            </p>
                        </div>
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50 ml-4"
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

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    {/* Error Alert */}
                    {submitError && (
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
                                        Error Creating Patient
                                    </h3>
                                    <p className="text-red-700 text-sm mt-1">{submitError}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Voice Dictation Guide */}
                   
                    {/* Basic Information */}
                    <section>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-200">
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInputWithVoice
                                label="Patient Name"
                                name="patientName"
                                value={formData.patientName}
                                onChange={handleChange}
                                onVoiceTranscript={(text) => handleFieldVoice('patientName', text)}
                                error={errors.patientName}
                                placeholder="Enter full name"
                                required
                                disabled={isSubmitting}
                            />
                            <FormInputWithVoice
                                label="Age"
                                name="age"
                                type="number"
                                value={formData.age}
                                onChange={handleChange}
                                onVoiceTranscript={(text) => handleFieldVoice('age', text)}
                                error={errors.age}
                                placeholder="Enter age"
                                min="1"
                                max="150"
                                required
                                disabled={isSubmitting}
                            />
                            <div className="md:col-span-2">
                                <FormInputWithVoice
                                    label="Date"
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    onVoiceTranscript={(text) => handleFieldVoice('date', text)}
                                    error={errors.date}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Medical Information */}
                    <section>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-200">
                            Medical Information
                        </h3>
                        <div className="space-y-4">
                            <FormTextareaWithVoice
                                label="Diagnosis"
                                name="diagnosis"
                                value={formData.diagnosis}
                                onChange={handleChange}
                                onVoiceTranscript={(text) => handleFieldVoice('diagnosis', text)}
                                error={errors.diagnosis}
                                placeholder="Enter diagnosis details"
                                rows={2}
                                required
                                disabled={isSubmitting}
                            />
                            <FormTextareaWithVoice
                                label="Procedure"
                                name="procedure"
                                value={formData.procedure}
                                onChange={handleChange}
                                onVoiceTranscript={(text) => handleFieldVoice('procedure', text)}
                                error={errors.procedure}
                                placeholder="Enter procedure details"
                                rows={2}
                                required
                                disabled={isSubmitting}
                            />
                            <FormInputWithVoice
                                label="Hospital"
                                name="hospital"
                                value={formData.hospital}
                                onChange={handleChange}
                                onVoiceTranscript={(text) => handleFieldVoice('hospital', text)}
                                error={errors.hospital}
                                placeholder="Enter hospital name"
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                    </section>

                    {/* Follow-up Plans */}
                    <section>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-200">
                            Planned Follow-ups
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormInputWithVoice
                                label="First Follow-up"
                                name="followUpFirst"
                                value={formData.followUpFirst}
                                onChange={handleChange}
                                onVoiceTranscript={(text) => handleFieldVoice('followUpFirst', text)}
                                placeholder="e.g., Week 2 - Feb 19"
                                disabled={isSubmitting}
                            />
                            <FormInputWithVoice
                                label="Second Follow-up"
                                name="followUpSecond"
                                value={formData.followUpSecond}
                                onChange={handleChange}
                                onVoiceTranscript={(text) => handleFieldVoice('followUpSecond', text)}
                                placeholder="e.g., Week 6 - Mar 18"
                                disabled={isSubmitting}
                            />
                            <FormInputWithVoice
                                label="Third Follow-up"
                                name="followUpThird"
                                value={formData.followUpThird}
                                onChange={handleChange}
                                onVoiceTranscript={(text) => handleFieldVoice('followUpThird', text)}
                                placeholder="e.g., Month 3 - May 15"
                                disabled={isSubmitting}
                            />
                        </div>
                    </section>

                    {/* Treatment Details */}
                    <section>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-200">
                            Treatment Details
                        </h3>
                        <div className="space-y-4">
                            <FormInputWithVoice
                                label="K-Wire Removal"
                                name="kWireRemoval"
                                value={formData.kWireRemoval}
                                onChange={handleChange}
                                onVoiceTranscript={(text) => handleFieldVoice('kWireRemoval', text)}
                                placeholder="e.g., Week 6 post-op"
                                disabled={isSubmitting}
                            />
                            <FormInputWithVoice
                                label="Splint Change/Removal"
                                name="splintChangeRemoval"
                                value={formData.splintChangeRemoval}
                                onChange={handleChange}
                                onVoiceTranscript={(text) => handleFieldVoice('splintChangeRemoval', text)}
                                placeholder="e.g., Week 2, Week 4"
                                disabled={isSubmitting}
                            />
                            <FormInputWithVoice
                                label="Type & Suture Removal"
                                name="typeAndSutureRemoval"
                                value={formData.typeAndSutureRemoval}
                                onChange={handleChange}
                                onVoiceTranscript={(text) => handleFieldVoice('typeAndSutureRemoval', text)}
                                placeholder="e.g., Week 3 - Absorbable sutures"
                                disabled={isSubmitting}
                            />
                        </div>
                    </section>

                    {/* Additional Information */}
                    <section>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-200">
                            Additional Information
                        </h3>
                        <div className="space-y-4">
                            <FormTextareaWithVoice
                                label="Expectations"
                                name="expectations"
                                value={formData.expectations}
                                onChange={handleChange}
                                onVoiceTranscript={(text) => handleFieldVoice('expectations', text)}
                                placeholder="e.g., Full range of motion recovery in 12 weeks"
                                rows={2}
                                maxLength={500}
                                showCharCount
                                disabled={isSubmitting}
                            />
                            <FormTextareaWithVoice
                                label="Follow-up Parameters"
                                name="followUpParameters"
                                value={formData.followUpParameters}
                                onChange={handleChange}
                                onVoiceTranscript={(text) => handleFieldVoice('followUpParameters', text)}
                                placeholder="e.g., Monitor healing, assess grip strength weekly"
                                rows={2}
                                maxLength={500}
                                showCharCount
                                disabled={isSubmitting}
                            />
                        </div>
                    </section>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-gray-50 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 px-4 sm:px-6 py-3 sm:py-4 sm:rounded-b-2xl border-t border-gray-200 z-10">
                        <div className="flex justify-end gap-2 sm:gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm sm:text-base"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg
                                            className="animate-spin h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Creating...
                                    </>
                                ) : (
                                    <>
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
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        Create Patient
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
