/**
 * User Profile Page
 */

'use client';


import { useState } from 'react';
import { DashboardLayout } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { AddPatientModal } from "@/components/dashboard/AddPatientModal";

export default function ProfilePage() {
    const { user } = useAuth();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    if (!user) return null;

    return (
        <DashboardLayout onAddClick={() => setIsAddModalOpen(true)}>
            <div className="max-w-7xl space-y-6 mx-auto">
                <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>

                {/* Profile Information */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                                title='name'
                                type="text"
                                value={user.name}
                                readOnly
                                className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg bg-gray-50"
                            />
                        </div>

                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                                title='email'
                                type="email"
                                value={user.email}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-black"
                            />
                        </div> */}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input
                                title='phone'
                                type="tel"
                                value={user.phone}
                                readOnly
                                className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg bg-gray-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                            <input
                                title='specialty'
                                type="text"
                                value={user.specialty.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                readOnly
                                className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg bg-gray-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                            <input
                                title='role'
                                value={user.role?.toUpperCase() || 'STAFF'}
                                readOnly
                                className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg bg-gray-50"
                            />
                        </div>

                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                                <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                <span>{user.isActive ? 'Active' : 'Inactive'}</span>
                            </div>
                        </div> */}
                    </div>
                </div>

                {/* Account Statistics */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-black mb-1">Account Created</p>
                            <p className="font-semibold text-black">{user.createdAt?.toLocaleDateString() || 'N/A'}</p>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-sm text-black mb-1">Last Updated</p>
                            <p className="font-semibold text-black">{user.updatedAt?.toLocaleDateString() || 'N/A'}</p>
                        </div>

                        <div className="p-4 bg-purple-50 rounded-lg">
                            <p className="text-sm text-black mb-1">Last Login</p>
                            <p className="font-semibold text-black">
                                {user.lastLoginAt?.toLocaleDateString() || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
                    <div className="space-y-3">
                        <button className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                            Edit Profile
                        </button>
                        <button className="w-full md:w-auto px-6 py-2 ml-0 md:ml-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors">
                            Change Password
                        </button>
                    </div>
                </div> */}
            </div>

            {/* Add Patient Modal */}
            <AddPatientModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => {
                    // Optional: Refresh data or show notification
                    console.log("Patient added from profile page");
                }}
            />
        </DashboardLayout>
    );
}
