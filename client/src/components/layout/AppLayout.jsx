import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../api/firebase';
import { LayoutDashboard, FileText, Briefcase, BarChart2, BrainCircuit, User, LogOut, Menu, X, Sparkles, LayoutTemplate } from 'lucide-react';

const AppLayout = ({ children, navigate }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleSignOut = async () => { await signOut(auth); navigate('#home'); };

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, route: '#dashboard' },
        { name: 'Templates', icon: LayoutTemplate, route: '#templates' }, // Add this
        { name: 'Resume Editor', icon: FileText, route: '#resume-editor' },
        { name: 'Portfolio Editor', icon: Briefcase, route: '#portfolio-editor' },
        { name: 'Analytics', icon: BarChart2, route: '#analytics' },
        { name: 'Job Matcher', icon: BrainCircuit, route: '#job-matcher' },
        { name: 'Interview Coach', icon: User, route: '#interview-coach' },
    ];

    return (
        <div className="flex min-h-screen bg-stone-950">
            <aside className={`bg-gray-900 border-r border-gray-800 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative fixed h-full z-20 w-64 transition-transform duration-300 ease-in-out`}>
                <div className="p-4 flex flex-col h-full">
                    <h1 className="text-2xl font-bold text-purple-400 text-glow mb-8 flex items-center"><Sparkles className="text-purple-400 mr-2" />Matrixx AI</h1>
                    <nav className="flex-grow">
                        <ul>
                            {navItems.map(item => (
                                <li key={item.name} className="mb-2">
                                    <a href={item.route} className={`group flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 ${window.location.hash === item.route ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold shadow-lg shadow-purple-600/20' : ''}`}>
                                        <item.icon className={`mr-3 h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${window.location.hash === item.route ? 'text-white' : ''}`} />
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <button onClick={handleSignOut} className="group flex items-center p-3 rounded-lg text-gray-400 hover:bg-red-900/50 hover:text-red-400 transition-colors">
                        <LogOut className="mr-3 h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                        Sign Out
                    </button>
                </div>
            </aside>
            <div className="flex-1 flex flex-col">
                <header className="bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center md:hidden sticky top-0 z-10">
                    <h1 className="text-xl font-bold text-purple-400 flex items-center"><Sparkles className="text-purple-400 mr-2" />Matrixx AI</h1>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? <X size={24} className="text-gray-300" /> : <Menu size={24} className="text-gray-300" />}
                    </button>
                </header>
                <main className="flex-1 p-4 sm:p-6 md:p-8">
                    {children}
                </main>
            </div>
            {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-60 z-10 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
        </div>
    );
};

export default AppLayout;
