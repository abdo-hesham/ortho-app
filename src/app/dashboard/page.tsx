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


import { GlobalLoader } from "@/components/ui/GlobalLoader";
import { SpinnerSmall } from "@/components";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

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
  
  // Mobile Infinite Scroll State
  const [visibleMobileCount, setVisibleMobileCount] = useState(3);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const [loadMoreRef, observerEntry] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
  });

  const isAtBottom = !!observerEntry?.isIntersecting;

  // Fetch patients function
  const fetchPatients = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setVisibleMobileCount(3); // Reset count on fetch
      const data = await getAllPatients();
      setPatients(data);
      setFilteredPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load patients");
    } finally {
      // Small delay to prevent flickering and show the nice animation
      setTimeout(() => setIsLoading(false), 800);
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
      setVisibleMobileCount(3); // Reset count on search

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
            p.procedure?.toLowerCase().includes(query),
        );
        setFilteredPatients(results);
      }
    },
    [patients, searchQuery],
  );

  // 1. Hook to detect intersection and set loading state
  useEffect(() => {
    if (isAtBottom && !isLoadingMore && !isLoading && filteredPatients.length > visibleMobileCount) {
      setIsLoadingMore(true);
    }
  }, [isAtBottom, isLoadingMore, isLoading, filteredPatients.length, visibleMobileCount]);

  // 2. Hook to handle the 1s delay and increment the count
  useEffect(() => {
    if (isLoadingMore) {
      const timer = setTimeout(() => {
        setVisibleMobileCount(prev => prev + 3);
        setIsLoadingMore(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isLoadingMore]);

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

  if (isLoading) {
      return <GlobalLoader />;
  }

  return (
    <DashboardLayout onAddClick={() => setIsAddModalOpen(true)}>
        {/* Mobile Welcome & Search Section */}
        <div className="space-y-6">
          {/* Welcome Header (Mobile) */}
          <div className="sm:hidden flex items-center justify-between my-5">
            <div>
               <p className="text-slate-500 text-sm font-medium">Welcome Back 👋</p>
               <h1 className="text-2xl font-bold text-slate-900">{user?.name || 'Doctor'}</h1>
            </div>
            {/* <div className="p-2 bg-slate-50 rounded-full">
               <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
               </svg>
            </div> */}
          </div>

          {/* Search Banner Card */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl p-6 shadow-xl shadow-blue-500/20 relative overflow-hidden text-white">
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
             <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 blur-xl"></div>
             
             <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2">Managing your<br/>patients today?</h2>
                <div className="mt-6">
                  <SearchBar
                    onSearch={handleSearch}
                    placeholder="Search patients, diagnosis..."
                  />
                </div>
             </div>
          </div>

          {/* Patient List Header */}
          <div className="flex items-center justify-between">
             <h3 className="text-lg font-bold text-slate-800">Recent Patients</h3>
             <button onClick={() => setIsAddModalOpen(true)} className="text-sm cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-full font-semibold text-blue-600">
               + Add New
             </button>
          </div>
  
          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}
  
          {/* Patient Table (Desktop) */}
          <div className="hidden sm:block bg-white rounded-2xl shadow-sm  overflow-hidden">
            <PatientTable
              patients={filteredPatients}
              onRowClick={handleRowClick}
              isLoading={isLoading}
            />
          </div>
  
          {/* Patient Cards (Mobile) */}
          <div className="sm:hidden grid gap-4">
            {filteredPatients.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                   <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                   </svg>
                </div>
                <h3 className="text-sm font-semibold text-slate-900">No patients found</h3>
                <p className="text-xs text-slate-500 mt-1">Try adjusting your search</p>
              </div>
            ) : (
              <>
                {filteredPatients.slice(0, visibleMobileCount).map((patient) => (
                  <PatientCard
                    key={patient.id}
                    patient={patient}
                    onClick={handleRowClick}
                  />
                ))}
                
                {/* Loader & Intersection Target */}
                {filteredPatients.length > visibleMobileCount && (
                  <div className="py-8 flex flex-col items-center justify-center">
                    {/* Intersection target is always here but invisible */}
                    <div ref={loadMoreRef} className="h-4 w-full" />
                    
                    {/* Animated Loader showing only when active */}
                    {isLoadingMore && (
                      <div className="flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="relative">
                          <div className="w-12 h-12 border-4 border-blue-100 rounded-full animate-ping opacity-20"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <SpinnerSmall />
                          </div>
                        </div>
                        <p className="text-xs font-bold text-blue-600 tracking-wider uppercase animate-pulse">
                          Loading more patients...
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>



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
    </DashboardLayout>
  );
}
