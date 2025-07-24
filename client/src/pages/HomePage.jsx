import React from 'react';
import { ArrowRight } from 'lucide-react';

const HomePage = ({ navigate }) => (
    <div className="flex flex-col items-center justify-center min-h-screen animated-gradient text-white">
        <div className="text-center p-8 max-w-3xl">
            <h1 style={{animationDelay: '0.2s'}} className="text-5xl md:text-7xl font-extrabold leading-tight animate-fade-in-up opacity-0">
                Unlock Your Potential with <span className="text-purple-400 text-glow">Matrixx AI</span>
            </h1>
            <p style={{animationDelay: '0.4s'}} className="mt-6 text-lg md:text-xl text-gray-300 animate-fade-in-up opacity-0">
                The free, open-source platform to create stunning resumes and portfolios, powered by AI. Land your dream job faster.
            </p>
            <div style={{animationDelay: '0.6s'}} className="mt-10 flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up opacity-0">
                <button onClick={() => navigate('#register')} className="flex items-center justify-center px-8 py-4 bg-purple-600 text-white font-semibold rounded-lg shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition-all transform hover:scale-105">
                    Get Started for Free <ArrowRight className="ml-2" />
                </button>
                <button onClick={() => navigate('#login')} className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/20 transition">
                    I have an account
                </button>
            </div>
        </div>
    </div>
);

export default HomePage;
