import React from 'react';

const AuthPageLayout = ({ children, title }) => (
    <div className="flex items-center justify-center min-h-screen bg-stone-950">
        <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl shadow-purple-900/20 m-4">
             <h2 className="text-3xl font-bold text-center text-purple-400 text-glow animate-fade-in-up opacity-0">{title}</h2>
            {children}
        </div>
    </div>
);

export default AuthPageLayout;