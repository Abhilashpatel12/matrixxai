import React from 'react';

const CustomStyles = () => (
    <style>{`
        body {
            background-color: #0c0a09; /* bg-stone-950 */
        }
        @keyframes gradient-animation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .animated-gradient {
            background: linear-gradient(-45deg, #1e1b4b, #4c1d95, #be185d, #9f1239);
            background-size: 400% 400%;
            animation: gradient-animation 15s ease infinite;
        }
        @keyframes fade-in-up {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.5s ease-out forwards;
        }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        .text-glow {
            text-shadow: 0 0 8px rgba(192, 132, 252, 0.6);
        }
    `}</style>
);

export default CustomStyles;