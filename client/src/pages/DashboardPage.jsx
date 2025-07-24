import React from 'react';
import { useAuth } from '../context/AuthContext';
import ActionCard from '../components/common/ActionCard';
import { FileText, Wand2, Briefcase, BarChart2, LayoutTemplate } from 'lucide-react';

const DashboardPage = () => {
    const { user } = useAuth();
    return (
        <div className="animate-fade-in-up opacity-0">
            <h2 className="text-3xl font-bold mb-2 text-gray-100">Welcome, <span className="text-purple-400">{user?.name || user?.email}</span>!</h2>
            <p className="text-gray-400 mb-8">This is your command center. Let's get started.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ActionCard 
                    title="Automate with AI" 
                    description="Upload your old resume and let our AI instantly enhance it for you."
                    icon={Wand2}
                    href="#automate-resume"
                    color="fuchsia"
                />
                <ActionCard 
                    title="Choose a Template" 
                    description="Select a professional template and then fill out your resume details."
                    icon={LayoutTemplate}
                    href="#templates"
                    color="purple"
                />
                <ActionCard 
                    title="Build Your Portfolio" 
                    description="Showcase your best work with a stunning, easy-to-create online portfolio."
                    icon={Briefcase}
                    href="#portfolio-editor"
                    color="pink"
                />
            </div>
        </div>
    );
};

export default DashboardPage;

