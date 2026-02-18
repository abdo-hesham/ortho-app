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
            month: "short",
            day: "numeric",
        }).format(date);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    const truncateText = (text: string, maxLength: number) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <div
            onClick={() => onClick(patient)}
            className="group bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 cursor-pointer"
        >
            <div className="flex items-center gap-4 mb-4">
                {/* Avatar Placeholder */}
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    {getInitials(patient.patientName)}
                </div>
                
                <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                        {truncateText(patient.patientName, 20)}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium truncate">
                        {truncateText(patient.diagnosis, 35)}
                    </p>
                    <div className="flex items-center gap-1 mt-1 min-w-0">
                        <svg className="w-3 h-3 text-yellow-400 fill-current flex-shrink-0" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs font-semibold text-slate-700 flex-shrink-0">4.8</span>
                        <span className="text-[10px] text-slate-400 ml-1 truncate">({truncateText(patient.hospital, 20)})</span>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-1 min-w-0 max-w-[40%]">
                     <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 truncate w-full text-center">
                        {truncateText(patient.procedure || 'Consultation', 20)}
                     </span>
                </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                <div className="flex items-center text-slate-400 text-xs font-medium">
                   <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                   </svg>
                   {formatDate(patient.date)}
                </div>

                <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform cursor-pointer">
                    View Details →
                </span>
            </div>
        </div>
    );
}
