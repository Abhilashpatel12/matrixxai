import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { db, appId } from '../api/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { LoaderCircle, UploadCloud } from 'lucide-react';
import ReviewChangesModal from '../components/common/ReviewChangesModal';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

const initialResumeState = {
    template: 'Modern', contact: { name: '', email: '', phone: '', linkedin: '', title: '' }, summary: '',
    experience: [], education: [], projects: [], skills: '', certifications: [], languages: [],
};

const AutomateResumePage = ({ navigate }) => {
    const { user } = useAuth();
    const [status, setStatus] = useState({ aiLoading: false, error: '' });
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [originalForDiff, setOriginalForDiff] = useState(null);
    const [enhancedResume, setEnhancedResume] = useState(null);

    const handleAutomatedEnhance = async (resumeText) => {
        setStatus({ aiLoading: true, error: '' });
        try {
            const response = await axios.post('http://localhost:5001/api/ai/enhance-resume', { resumeText });
            const { originalResume, enhancedResume } = response.data;
            if (!originalResume || !enhancedResume) {
                throw new Error("AI response was not structured correctly.");
            }
            setOriginalForDiff(originalResume);
            setEnhancedResume({ template: 'Modern', ...enhancedResume });
            setIsReviewModalOpen(true);
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'An unknown error occurred.';
            setStatus({ aiLoading: false, error: errorMessage });
        } finally {
            setStatus(s => ({ ...s, aiLoading: false }));
        }
    };

    const handleAcceptChanges = async () => {
        if (enhancedResume && user) {
            const resumeRef = doc(db, `artifacts/${appId}/resumes`, user.uid);
            await setDoc(resumeRef, { ...initialResumeState, ...enhancedResume });
            navigate('#resume-editor');
        }
        setIsReviewModalOpen(false);
    };

    const handleCancelChanges = () => setIsReviewModalOpen(false);

    return (
        <>
            <ReviewChangesModal 
                isOpen={isReviewModalOpen}
                onCancel={handleCancelChanges}
                onAccept={handleAcceptChanges}
                originalResume={originalForDiff}
                enhancedResume={enhancedResume}
            />
            <div className="animate-fade-in-up opacity-0 max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-100">Automate with AI</h2>
                    <p className="text-gray-400 mt-2">Upload your existing resume, and let our AI instantly parse, enhance, and structure it for you.</p>
                </div>
                {status.error && <div className="bg-red-900/50 text-red-300 border border-red-700 p-3 rounded-lg text-sm mb-4">{status.error}</div>}
                <ResumeDropzone onEnhance={handleAutomatedEnhance} isLoading={status.aiLoading} />
            </div>
        </>
    );
};

const ResumeDropzone = ({ onEnhance, isLoading }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState('');
    const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
    const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
    const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); const files = e.dataTransfer.files; if (files && files.length > 0) handleFile(files[0]); };
    const handleFileChange = (e) => { const files = e.target.files; if (files && files.length > 0) handleFile(files[0]); };
    const handleFile = async (file) => {
        setError('');
        if (file.type === 'application/pdf') {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const pdf = await pdfjsLib.getDocument({ data: event.target.result }).promise;
                    let text = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const content = await page.getTextContent();
                        text += content.items.map(item => item.str).join(' ');
                    }
                    onEnhance(text);
                } catch (e) { console.error("PDF Parsing Error:", e); setError('Could not read PDF. Check console (F12).'); }
            };
            reader.readAsArrayBuffer(file);
        } else if (file.type.startsWith('text/')) {
             const reader = new FileReader();
             reader.onload = (event) => onEnhance(event.target.result);
             reader.readAsText(file);
        } else {
            setError('Unsupported file type. Please upload a PDF or TXT file.');
        }
    };
    return (
        <div onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop} className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${isDragging ? 'border-purple-500 bg-gray-800/50' : 'border-gray-600'}`}>
            <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} accept=".pdf,.txt,.md" />
            <label htmlFor="file-upload" className="cursor-pointer">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-white"><span className="text-purple-400">Upload your old resume</span> or drag and drop</h3>
                <p className="mt-1 text-sm text-gray-500">PDF or TXT files</p>
            </label>
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
            {isLoading && <div className="absolute inset-0 bg-gray-900/80 flex flex-col justify-center items-center rounded-xl"><LoaderCircle className="h-10 w-10 animate-spin text-purple-400" /><p className="mt-2 text-white">Enhancing...</p></div>}
        </div>
    );
};
export default AutomateResumePage;