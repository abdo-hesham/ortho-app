"use client";

export function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      <div className="relative flex items-center justify-center scale-150">
        {/* Logo/Brand Icon Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-8 h-8 bg-blue-600 rounded-xl rotate-45 animate-pulse"></div>
        </div>
        
        {/* Outer Ring */}
        <div className="w-24 h-24 border-4 border-blue-100 rounded-full animate-ping opacity-30"></div>
        
        {/* Rotating Ring */}
        <div className="absolute w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      <div className="mt-12 flex flex-col items-center gap-3">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Medidect</h3>
        <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
        </div>
      </div>
    </div>
  );
}
