import React from 'react';

// --- Template Styles with New, Distinct Designs ---
const templateStyles = {
    Modern: {
        container: 'bg-white text-gray-800 p-8 shadow-2xl font-sans',
        header: 'text-center mb-6 border-b-2 pb-4 border-gray-200',
        name: 'text-4xl font-bold text-gray-900 tracking-wide',
        title: 'text-lg text-purple-600 font-medium mt-1',
        contact: 'flex justify-center items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-3',
        sectionTitle: 'text-sm font-bold uppercase text-purple-700 border-b-2 border-purple-200 pb-1 mb-3 mt-4',
        listItem: 'mb-4',
        jobTitle: 'text-lg font-semibold text-gray-800',
        company: 'text-md text-gray-700',
        dates: 'text-sm text-gray-500 italic',
        description: 'text-gray-700 mt-1 text-sm leading-relaxed whitespace-pre-wrap',
        skills: 'flex flex-wrap gap-2 mt-2',
        skillTag: 'bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-1 rounded-full',
    },
    Classic: {
        container: 'bg-white text-gray-900 p-10 shadow-2xl font-serif',
        header: 'text-center mb-8',
        name: 'text-5xl font-bold tracking-wider',
        title: 'text-xl border-t-2 border-b-2 border-gray-800 py-2 my-3 tracking-widest uppercase',
        contact: 'text-sm text-gray-700',
        sectionTitle: 'text-xl font-bold border-b-2 border-gray-800 pb-1 mb-4 mt-6 text-center',
        listItem: 'mb-4',
        jobTitle: 'text-xl font-semibold',
        company: 'text-lg italic',
        dates: 'text-sm text-gray-600',
        description: 'text-gray-800 mt-1 whitespace-pre-wrap',
        skills: 'mt-2 text-gray-800 text-center',
        skillTag: 'inline-block mr-2 after:content-[","] last:after:content-["."]',
    },
    Creative: {
        container: 'bg-gray-900 text-white p-8 shadow-2xl font-sans grid grid-cols-3 gap-8',
        header: 'col-span-1 text-left border-r-2 border-purple-400 pr-8',
        name: 'text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500',
        title: 'text-lg text-purple-300 font-light mt-1',
        contact: 'text-sm text-gray-300 mt-6 space-y-2',
        mainContent: 'col-span-2',
        sectionTitle: 'text-lg font-bold text-purple-400 border-l-4 border-purple-400 pl-3 mb-4 mt-2',
        listItem: 'mb-5',
        jobTitle: 'text-xl font-semibold text-white',
        company: 'text-md text-purple-300',
        dates: 'text-sm text-gray-400 italic',
        description: 'text-gray-300 mt-1 text-sm whitespace-pre-wrap',
        skills: 'flex flex-wrap gap-2 mt-2',
        skillTag: 'bg-purple-500/20 text-purple-300 text-xs font-semibold px-3 py-1.5 rounded',
    },
    Professional: {
        container: 'bg-white text-gray-800 p-10 font-sans',
        header: 'flex items-center justify-between pb-4 border-b-2 border-gray-600',
        name: 'text-4xl font-extrabold text-gray-800',
        title: 'text-lg text-gray-600',
        contact: 'text-right text-xs space-y-1',
        sectionTitle: 'text-base font-bold text-gray-800 mt-5 mb-2 tracking-widest uppercase',
        listItem: 'mb-3',
        jobTitle: 'text-lg font-semibold',
        company: 'text-md',
        dates: 'text-sm text-gray-500',
        description: 'text-sm leading-relaxed whitespace-pre-wrap',
        skills: 'text-sm whitespace-pre-wrap',
        skillTag: 'inline-block mr-2 after:content-[","] last:after:content-["."]',
    },
    Minimalist: {
        container: 'bg-white text-gray-700 p-12 font-light tracking-wider',
        header: 'text-center pb-6',
        name: 'text-3xl tracking-widest uppercase',
        title: 'text-md text-gray-500 mt-1',
        contact: 'text-xs text-gray-500 mt-2',
        sectionTitle: 'text-center text-sm font-semibold tracking-widest uppercase my-6 py-2 bg-gray-100',
        listItem: 'text-center mb-4',
        jobTitle: 'font-semibold text-lg',
        company: 'italic',
        dates: 'text-xs text-gray-500',
        description: 'text-sm mt-1 whitespace-pre-wrap',
        skills: 'text-sm',
        skillTag: 'inline-block mx-2',
    }
};

const ResumePreview = ({ resume }) => {
    const styles = templateStyles[resume.template] || templateStyles.Modern;
    const { contact, summary, experience, education, projects, skills, certifications, languages } = resume;

    // Creative template has a different layout structure
    if (resume.template === 'Creative') {
        return (
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.name}>{contact.name || 'Your Name'}</h1>
                    <h2 className={styles.title}>{contact.title || 'Your Job Title'}</h2>
                    <div className={styles.contact}>
                        {contact.email && <p>{contact.email}</p>}
                        {contact.phone && <p>{contact.phone}</p>}
                        {contact.linkedin && <p>{contact.linkedin}</p>}
                    </div>
                    {skills && (
                        <section className="mt-8">
                            <h3 className={styles.sectionTitle}>Skills</h3>
                            <div className={styles.skills}>
                                {(skills || '').split(',').map((skill, index) => (
                                    skill.trim() && <span key={index} className={styles.skillTag}>{skill.trim()}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </header>

                <main className={styles.mainContent}>
                    {summary && <section><h3 className={styles.sectionTitle}>Summary</h3><p className={styles.description}>{summary}</p></section>}
                    {experience && experience[0]?.jobTitle && <section><h3 className={styles.sectionTitle}>Experience</h3>{experience.map((exp, i) => (<div key={i} className={styles.listItem}><div className="flex justify-between items-baseline flex-wrap"><h4 className={styles.jobTitle}>{exp.jobTitle}</h4><span className={styles.dates}>{exp.dates}</span></div><h5 className={styles.company}>{exp.company}</h5><p className={styles.description}>{exp.description}</p></div>))}</section>}
                    {projects && projects[0]?.name && <section><h3 className={styles.sectionTitle}>Projects</h3>{projects.map((proj, i) => (<div key={i} className={styles.listItem}><h4 className={styles.jobTitle}>{proj.name}</h4>{proj.link && <a href={proj.link} className="text-sm text-purple-400 hover:underline">{proj.link}</a>}<p className={styles.description}>{proj.description}</p></div>))}</section>}
                    {education && education[0]?.degree && <section><h3 className={styles.sectionTitle}>Education</h3>{education.map((edu, i) => (<div key={i} className={styles.listItem}><div className="flex justify-between items-baseline flex-wrap"><h4 className={styles.jobTitle}>{edu.degree}</h4><span className={styles.dates}>{edu.dates}</span></div><h5 className={styles.company}>{edu.school}</h5></div>))}</section>}
                </main>
            </div>
        );
    }

    // Default layout for all other templates
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.name}>{contact.name || 'Your Name'}</h1>
                <h2 className={styles.title}>{contact.title || 'Your Job Title'}</h2>
                <div className={styles.contact}>
                    {contact.email && <span>{contact.email}</span>}
                    {contact.phone && <span>&bull; {contact.phone}</span>}
                    {contact.linkedin && <span>&bull; {contact.linkedin}</span>}
                </div>
            </header>

            <main>
                {summary && <section><h3 className={styles.sectionTitle}>Summary</h3><p className={styles.description}>{summary}</p></section>}
                {experience && experience[0]?.jobTitle && <section><h3 className={styles.sectionTitle}>Experience</h3>{experience.map((exp, i) => (<div key={i} className={styles.listItem}><div className="flex justify-between items-baseline flex-wrap"><h4 className={styles.jobTitle}>{exp.jobTitle}</h4><span className={styles.dates}>{exp.dates}</span></div><h5 className={styles.company}>{exp.company}</h5><p className={styles.description}>{exp.description}</p></div>))}</section>}
                {projects && projects[0]?.name && <section><h3 className={styles.sectionTitle}>Projects</h3>{projects.map((proj, i) => (<div key={i} className={styles.listItem}><h4 className={styles.jobTitle}>{proj.name}</h4>{proj.link && <a href={proj.link} className="text-sm text-purple-600 hover:underline">{proj.link}</a>}<p className={styles.description}>{proj.description}</p></div>))}</section>}
                {education && education[0]?.degree && <section><h3 className={styles.sectionTitle}>Education</h3>{education.map((edu, i) => (<div key={i} className={styles.listItem}><div className="flex justify-between items-baseline flex-wrap"><h4 className={styles.jobTitle}>{edu.degree}</h4><span className={styles.dates}>{edu.dates}</span></div><h5 className={styles.company}>{edu.school}</h5></div>))}</section>}
                {skills && <section><h3 className={styles.sectionTitle}>Skills</h3><div className={styles.skills}>{(skills || '').split(',').map((skill, i) => (skill.trim() && <span key={i} className={styles.skillTag}>{skill.trim()}</span>))}</div></section>}
                {certifications && certifications[0]?.name && <section><h3 className={styles.sectionTitle}>Certifications</h3>{certifications.map((cert, i) => (<div key={i} className={styles.listItem}><h4 className={styles.jobTitle}>{cert.name}</h4><p className={styles.company}>{cert.authority}</p></div>))}</section>}
                {languages && languages[0]?.name && <section><h3 className={styles.sectionTitle}>Languages</h3><p className={styles.skills}>{languages.map(lang => `${lang.name} (${lang.proficiency})`).join(' | ')}</p></section>}
            </main>
        </div>
    );
};

export default ResumePreview;

