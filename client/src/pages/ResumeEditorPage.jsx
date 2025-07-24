import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { db, appId } from '../api/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Sparkles, LoaderCircle, Plus, Trash2, Save, Wand2, Lightbulb, Download, Eye } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ResumeDocument from '../components/resume/ResumeDocument';
import ResumePreview from '../components/resume/ResumePreview';

// --- Initial State & Styles ---
const initialResumeState = {
    template: 'Modern', contact: { name: '', email: '', phone: '', linkedin: '', title: '' }, summary: '',
    experience: [{ jobTitle: '', company: '', dates: '', description: '' }], education: [{ degree: '', school: '', dates: '' }],
    projects: [{ name: '', description: '', link: '' }], skills: '', certifications: [{ name: '', authority: '', date: '' }],
    languages: [{ name: '', proficiency: 'Fluent' }],
};
const getStyles = (element) => {
    const styles = {
        formInput: "w-full p-3 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition",
        aiButton: "flex items-center text-sm px-4 py-2 bg-purple-600/20 text-purple-300 rounded-md hover:bg-purple-600/40 transition disabled:opacity-50 disabled:cursor-not-allowed",
        addButton: "flex items-center px-4 py-2 border-2 border-dashed border-gray-600 text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white transition",
        removeButton: "p-2 text-gray-500 hover:bg-red-900/50 hover:text-red-400 rounded-md transition",
        sectionContainer: "bg-gray-900 border border-gray-800 rounded-xl shadow-lg p-6",
        sectionTitle: "text-xl font-semibold text-purple-400 mb-4",
    };
    return styles[element];
};
const Section = ({ title, children }) => (<div className={getStyles('sectionContainer')}><h3 className={getStyles('sectionTitle')}>{title}</h3>{children}</div>);

// --- Main Component ---
const ResumeEditorPage = ({ navigate }) => {
    const { user } = useAuth();
    const [resume, setResume] = useState(initialResumeState);
    const [status, setStatus] = useState({ loading: true, saving: false, aiLoading: '', error: '' });
    const [isPdfReady, setIsPdfReady] = useState(false);

    useEffect(() => { setIsPdfReady(false); const handler = setTimeout(() => setIsPdfReady(true), 1000); return () => clearTimeout(handler); }, [resume]);
    const fetchResume = useCallback(async () => { if (!user) return; setStatus(s => ({ ...s, loading: true })); const resumeRef = doc(db, `artifacts/${appId}/resumes`, user.uid); const docSnap = await getDoc(resumeRef); setResume(docSnap.exists() ? { ...initialResumeState, ...docSnap.data() } : initialResumeState); setStatus(s => ({ ...s, loading: false })); }, [user]);
    useEffect(() => { fetchResume(); }, [fetchResume]);

    // --- Form Handlers ---
    const handleSimpleChange = (e) => { const { name, value } = e.target; setResume(prev => ({ ...prev, [name]: value })); };
    const handleContactChange = (e) => { const { name, value } = e.target; setResume(prev => ({ ...prev, contact: { ...prev.contact, [name]: value } })); };
    const handleSectionChange = (section, index, e) => { const { name, value } = e.target; setResume(prev => ({ ...prev, [section]: (prev[section] || []).map((item, i) => i === index ? { ...item, [name]: value } : item) })); };
    const addSectionItem = (section) => { const itemMap = { experience: { jobTitle: '', company: '', dates: '', description: '' }, education: { degree: '', school: '', dates: '' }, projects: { name: '', description: '', link: '' }, certifications: { name: '', authority: '', date: '' }, languages: { name: '', proficiency: 'Fluent' }, }; setResume(prev => ({ ...prev, [section]: [...(prev[section] || []), itemMap[section]] })); };
    const removeSectionItem = (section, index) => { setResume(prev => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) })); };

    // --- API & Save Handlers ---
    const handleSaveResume = async () => { if (!user) return; setStatus(s => ({ ...s, saving: true, error: '' })); try { const resumeRef = doc(db, `artifacts/${appId}/resumes`, user.uid); await setDoc(resumeRef, resume, { merge: true }); } catch (err) { setStatus(s => ({ ...s, error: 'Failed to save resume.' })); } finally { setStatus(s => ({ ...s, saving: false })); } };
    const isFormValidForDownload = resume.contact.name.trim() !== '' && resume.contact.email.trim() !== '';

    if (status.loading) return <div className="flex justify-center items-center h-full"><LoaderCircle className="animate-spin h-12 w-12 text-purple-500" /></div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="animate-fade-in-up opacity-0 space-y-6">
                <div className="flex justify-between items-center">
                    <div><h2 className="text-3xl font-bold text-gray-100">Manual Resume Editor</h2></div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('#templates')} className="flex items-center justify-center px-4 py-2.5 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all"><Eye className="mr-2 h-5 w-5" /> Change Template</button>
                        <button onClick={handleSaveResume} disabled={status.saving} className="flex items-center justify-center px-5 py-2.5 bg-purple-600 text-white font-semibold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-500 transition-all">{status.saving ? <LoaderCircle className="animate-spin mr-2" /> : <Save className="mr-2 h-5 w-5" />}{status.saving ? 'Saving...' : 'Save Resume'}</button>
                    </div>
                </div>
                {status.error && <div className="bg-red-900/50 text-red-300 border border-red-700 p-3 rounded-lg text-sm">{status.error}</div>}
                
                <Section title="Contact & Role">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="name" value={resume.contact.name} onChange={handleContactChange} placeholder="Full Name (Required)" className={getStyles('formInput')} />
                        <input name="email" value={resume.contact.email} onChange={handleContactChange} placeholder="Email (Required)" className={getStyles('formInput')} />
                        <input name="phone" value={resume.contact.phone} onChange={handleContactChange} placeholder="Phone Number" className={getStyles('formInput')} />
                        <input name="linkedin" value={resume.contact.linkedin} onChange={handleContactChange} placeholder="LinkedIn URL" className={getStyles('formInput')} />
                        <input name="title" value={resume.contact.title} onChange={handleContactChange} placeholder="Target Job Title" className={`${getStyles('formInput')} md:col-span-2`} />
                    </div>
                </Section>

                <Section title="Professional Summary"><textarea name="summary" rows="4" value={resume.summary} onChange={handleSimpleChange} placeholder="A brief summary..." className={getStyles('formInput')} /></Section>

                <Section title="Work Experience">
                    {(resume.experience || []).map((exp, index) => (
                        <div key={index} className="space-y-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700 mb-4 relative">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><input name="jobTitle" value={exp.jobTitle} onChange={(e) => handleSectionChange('experience', index, e)} placeholder="Job Title" className={`${getStyles('formInput')} md:col-span-2`} /><input name="dates" value={exp.dates} onChange={(e) => handleSectionChange('experience', index, e)} placeholder="Dates" className={getStyles('formInput')} /></div>
                            <input name="company" value={exp.company} onChange={(e) => handleSectionChange('experience', index, e)} placeholder="Company Name" className={getStyles('formInput')} />
                            <textarea name="description" rows="4" value={exp.description} onChange={(e) => handleSectionChange('experience', index, e)} placeholder="Description..." className={getStyles('formInput')} />
                            {(resume.experience || []).length > 1 && <button onClick={() => removeSectionItem('experience', index)} className={`${getStyles('removeButton')} absolute -top-2 -right-2`}><Trash2 className="h-4 w-4" /></button>}
                        </div>
                    ))}
                    <button onClick={() => addSectionItem('experience')} className={getStyles('addButton')}><Plus className="mr-2 h-4 w-4" /> Add Experience</button>
                </Section>

                <Section title="Projects">
                    {(resume.projects || []).map((proj, index) => (
                        <div key={index} className="space-y-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700 mb-4 relative">
                            <input name="name" value={proj.name} onChange={(e) => handleSectionChange('projects', index, e)} placeholder="Project Name" className={getStyles('formInput')} />
                            <input name="link" value={proj.link} onChange={(e) => handleSectionChange('projects', index, e)} placeholder="Project Link" className={getStyles('formInput')} />
                            <textarea name="description" rows="3" value={proj.description} onChange={(e) => handleSectionChange('projects', index, e)} placeholder="Project description..." className={getStyles('formInput')} />
                            {(resume.projects || []).length > 1 && <button onClick={() => removeSectionItem('projects', index)} className={`${getStyles('removeButton')} absolute -top-2 -right-2`}><Trash2 className="h-4 w-4" /></button>}
                        </div>
                    ))}
                    <button onClick={() => addSectionItem('projects')} className={getStyles('addButton')}><Plus className="mr-2 h-4 w-4" /> Add Project</button>
                </Section>

                <Section title="Education">
                     {(resume.education || []).map((edu, index) => (
                        <div key={index} className="space-y-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700 mb-4 relative">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                               <input name="degree" value={edu.degree} onChange={(e) => handleSectionChange('education', index, e)} placeholder="Degree" className={`${getStyles('formInput')} md:col-span-2`} />
                               <input name="dates" value={edu.dates} onChange={(e) => handleSectionChange('education', index, e)} placeholder="Dates" className={getStyles('formInput')} />
                            </div>
                            <input name="school" value={edu.school} onChange={(e) => handleSectionChange('education', index, e)} placeholder="School / University" className={getStyles('formInput')} />
                            {(resume.education || []).length > 1 && <button onClick={() => removeSectionItem('education', index)} className={`${getStyles('removeButton')} absolute -top-2 -right-2`}><Trash2 className="h-4 w-4" /></button>}
                        </div>
                    ))}
                    <button onClick={() => addSectionItem('education')} className={getStyles('addButton')}><Plus className="mr-2 h-4 w-4" /> Add Education</button>
                </Section>

                <Section title="Skills"><textarea name="skills" rows="4" value={resume.skills} onChange={handleSimpleChange} placeholder="List skills, separated by commas..." className={getStyles('formInput')} /></Section>

                <Section title="Certifications">
                    {(resume.certifications || []).map((cert, index) => (
                         <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700 relative">
                            <input name="name" value={cert.name} onChange={(e) => handleSectionChange('certifications', index, e)} placeholder="Certification Name" className={getStyles('formInput')} />
                            <input name="authority" value={cert.authority} onChange={(e) => handleSectionChange('certifications', index, e)} placeholder="Issuing Authority" className={getStyles('formInput')} />
                            {(resume.certifications || []).length > 1 && <button onClick={() => removeSectionItem('certifications', index)} className={`${getStyles('removeButton')} absolute -top-2 -right-2`}><Trash2 className="h-4 w-4" /></button>}
                        </div>
                    ))}
                    <button onClick={() => addSectionItem('certifications')} className={getStyles('addButton')}><Plus className="mr-2 h-4 w-4" /> Add Certification</button>
                </Section>

                <Section title="Languages">
                    {(resume.languages || []).map((lang, index) => (
                         <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700 relative">
                            <input name="name" value={lang.name} onChange={(e) => handleSectionChange('languages', index, e)} placeholder="Language" className={getStyles('formInput')} />
                            <select name="proficiency" value={lang.proficiency} onChange={(e) => handleSectionChange('languages', index, e)} className={getStyles('formInput')}>
                                <option>Fluent</option><option>Native</option><option>Professional</option><option>Conversational</option>
                            </select>
                            {(resume.languages || []).length > 1 && <button onClick={() => removeSectionItem('languages', index)} className={`${getStyles('removeButton')} absolute -top-2 -right-2`}><Trash2 className="h-4 w-4" /></button>}
                        </div>
                    ))}
                    <button onClick={() => addSectionItem('languages')} className={getStyles('addButton')}><Plus className="mr-2 h-4 w-4" /> Add Language</button>
                </Section>
            </div>

            <div className="lg:sticky lg:top-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-100">Live Preview</h3>
                    <div className="flex items-center gap-2">
                        <select name="template" value={resume.template} onChange={handleSimpleChange} className={`${getStyles('formInput')} w-36`}>
                            <option>Modern</option><option>Classic</option><option>Creative</option><option>Professional</option><option>Minimalist</option>
                        </select>
                        {isPdfReady ? (
                            isFormValidForDownload ? (
                                <PDFDownloadLink document={<ResumeDocument resume={resume} />} fileName={`${resume.contact.name.replace(' ', '_') || 'resume'}.pdf`} className="flex items-center justify-center px-4 py-2.5 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-500 transition-all">
                                    {({ loading }) => loading ? <LoaderCircle className="animate-spin" /> : <Download className="h-5 w-5" />}
                                </PDFDownloadLink>
                            ) : (
                                <button disabled title="Please fill in Name and Email." className="flex items-center justify-center px-4 py-2.5 bg-gray-600 text-white font-semibold rounded-lg opacity-50 cursor-not-allowed">
                                    <Download className="h-5 w-5" />
                                </button>
                            )
                        ) : (
                            <button disabled className="flex items-center justify-center px-4 py-2.5 bg-gray-600 text-white font-semibold rounded-lg opacity-50 cursor-not-allowed">
                                <LoaderCircle className="animate-spin" />
                            </button>
                        )}
                    </div>
                </div>
                <ResumePreview resume={resume} />
            </div>
        </div>
    );
};
export default ResumeEditorPage;
