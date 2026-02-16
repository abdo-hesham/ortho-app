/**
 * Loading Spinner Component
 */

export const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-sm text-gray-600 text-center">Loading...</p>
            </div>
        </div>
    );
};

export const SpinnerSmall = () => {
    return (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    );
};
