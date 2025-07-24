import React from 'react';
import { useAuth } from '../context/AuthContext';
import { db, appId } from '../api/firebase';
import { doc, setDoc } from 'firebase/firestore';
import ResumePreview from '../components/resume/ResumePreview';
import { CheckCircle } from 'lucide-react';

// Sample data to make the templates look good
const sampleResumeData = {
    contact: { name: 'John Doe', email: 'john.doe@email.com', phone: '123-456-7890', linkedin: 'linkedin.com/in/johndoe', title: 'Software Engineer' },
    summary: 'Innovative and deadline-driven Software Engineer with 5+ years of experience designing and developing user-centered digital products from initial concept to final, polished deliverable.',
    experience: [{ jobTitle: 'Senior Software Engineer', company: 'Tech Solutions Inc.', dates: 'Jan 2022 - Present', description: '• Led a team of 4 developers in the creation of a new cloud-native microservices architecture.\n• Increased application performance by 30% through strategic code optimization.' }],
    education: [{ degree: 'B.Tech in Computer Science', school: 'University of Technology', dates: '2016 - 2020' }],
    projects: [{ name: 'Project Matrixx', description: 'A full-stack web application for generating AI-powered resumes.', link: 'github.com/johndoe/matrixx' }],
    skills: 'JavaScript, React, Node.js, Express, MongoDB, Firebase, Python, Docker',
    certifications: [{ name: 'Certified Cloud Practitioner', authority: 'Amazon Web Services' }],
    languages: [{ name: 'English', proficiency: 'Native' }, { name: 'Spanish', proficiency: 'Conversational' }],
};

const templates = ['Modern', 'Classic', 'Creative', 'Professional', 'Minimalist'];

const TemplatesPage = ({ navigate }) => {
    const { user } = useAuth();

    const handleSelectTemplate = async (templateName) => {
        if (!user) return;
        const resumeRef = doc(db, `artifacts/${appId}/resumes`, user.uid);
        await setDoc(resumeRef, { template: templateName }, { merge: true });
        navigate('#resume-editor');
    };

    return (
        <div className="animate-fade-in-up opacity-0">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-100">Choose Your Template</h2>
                <p className="text-gray-400 mt-2">Select a professionally designed template to start with. You can always change it later.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {templates.map(template => (
                    <div key={template} className="bg-gray-900 border border-gray-800 rounded-xl shadow-lg group flex flex-col">
                        {/* Improved Preview Container */}
                        <div className="h-96 overflow-hidden rounded-t-xl relative border-b border-gray-700">
                            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                            <div className="transform scale-[0.55] origin-top-left">
                                <ResumePreview resume={{ ...sampleResumeData, template }} />
                            </div>
                        </div>
                        <div className="p-6 text-center flex-grow flex flex-col justify-between">
                            <h3 className="text-2xl font-bold text-white mb-4">{template}</h3>
                            <button 
                                onClick={() => handleSelectTemplate(template)}
                                className="w-full flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-500 transition-all"
                            >
                                <CheckCircle className="mr-2 h-5 w-5" />
                                Use This Template
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TemplatesPage;