import React from 'react';
import { BrainCircuit } from 'lucide-react';

const PlaceholderPage = ({ title, description }) => (
    <div className="animate-fade-in-up opacity-0 text-center flex flex-col items-center justify-center h-full">
        <div className="p-8 bg-gray-900 border border-gray-800 rounded-xl shadow-xl shadow-purple-900/20 max-w-lg">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-fuchsia-700 text-white mx-auto mb-6">
                <BrainCircuit size={32} />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-100">{title}</h2>
            <p className="text-gray-400">{description}</p>
            <p className="mt-6 text-sm font-semibold text-purple-400">This feature is under construction. Stay tuned!</p>
        </div>
    </div>
);

export default PlaceholderPage;