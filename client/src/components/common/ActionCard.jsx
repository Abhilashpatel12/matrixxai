import React from 'react';

const ActionCard = ({ title, description, icon: Icon, href, color }) => {
    const colors = {
        fuchsia: 'from-fuchsia-900 to-fuchsia-800 text-fuchsia-300',
        purple: 'from-purple-900 to-purple-800 text-purple-300',
        pink: 'from-pink-900 to-pink-800 text-pink-300',
    };
    const borderColors = {
        fuchsia: 'hover:border-fuchsia-500',
        purple: 'hover:border-purple-500',
        pink: 'hover:border-pink-500',
    }
    return (
         <a href={href} className={`group block p-6 bg-gray-900 rounded-xl shadow-md hover:shadow-xl hover:shadow-purple-900/30 transition-all duration-300 transform hover:-translate-y-1 border-b-4 border-transparent ${borderColors[color]}`}>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br ${colors[color]} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                <Icon size={24} />
            </div>
            <h3 className="mt-4 text-xl font-bold text-gray-200">{title}</h3>
            <p className="mt-2 text-gray-400">{description}</p>
        </a>
    );
};

export default ActionCard;