import React from 'react';
import { Check, X } from 'lucide-react';
import DiffViewer from './DiffViewer';
import ResumePreview from '../resume/ResumePreview';

const ReviewChangesModal = ({ isOpen, onCancel, onAccept, originalResume, enhancedResume }) => {
    if (!isOpen || !originalResume || !enhancedResume) {
        return null;
    }

    const renderExperienceDiffs = () => {
        const originalExperience = originalResume.experience || [];
        const enhancedExperience = enhancedResume.experience || [];
        if (enhancedExperience.length === 0) return <p className="text-sm text-gray-500">No work experience provided.</p>;
        return enhancedExperience.map((enhancedExp, index) => {
            const originalExp = originalExperience[index] || { description: '' };
            return (
                <div key={index} className="mb-4">
                    <h4 className="font-semibold text-purple-300">{enhancedExp.title || 'Work Experience'} at {enhancedExp.company}</h4>
                    <DiffViewer oldText={originalExp.description} newText={enhancedExp.description} />
                </div>
            );
        });
    };
    
    const renderProjectDiffs = () => {
        const originalProjects = originalResume.projects || [];
        const enhancedProjects = enhancedResume.projects || [];
        if (enhancedProjects.length === 0) return <p className="text-sm text-gray-500">No projects provided.</p>;
         return enhancedProjects.map((enhancedProj, index) => {
            const originalProj = originalProjects[index] || { description: '' };
            return (
                <div key={index} className="mb-4">
                    <h4 className="font-semibold text-purple-300">{enhancedProj.name || 'Project'}</h4>
                    <DiffViewer oldText={originalProj.description} newText={enhancedProj.description} />
                </div>
            );
        });
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4 animate-fade-in-up">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-purple-400">Review AI Enhancements</h2>
                    <div className="flex gap-2">
                        <button onClick={onCancel} className="flex items-center px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition"><X className="mr-2 h-5 w-5" />Cancel</button>
                        <button onClick={onAccept} className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition"><Check className="mr-2 h-5 w-5" />Accept Changes</button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-200 mb-2">Professional Summary</h3>
                        <DiffViewer oldText={originalResume.summary || ''} newText={enhancedResume.summary || ''} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-200 mb-2">Work Experience</h3>
                        {renderExperienceDiffs()}
                    </div>
                     <div>
                        <h3 className="text-lg font-bold text-gray-200 mb-2">Projects</h3>
                        {renderProjectDiffs()}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ReviewChangesModal;
