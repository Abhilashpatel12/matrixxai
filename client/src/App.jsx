import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import CustomStyles from './components/common/CustomStyles';
import AppLayout from './components/layout/AppLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ResumeEditorPage from './pages/ResumeEditorPage';
import PortfolioEditorPage from './pages/PortfolioEditorPage';
import AnalyticsPage from './pages/AnalyticsPage';
import JobMatcherPage from './pages/JobMatcherPage';
import InterviewCoachPage from './pages/InterviewCoachPage';
import AutomateResumePage from './pages/AutomateResumePage';
import TemplatesPage from './pages/TemplatesPage';

export default function App() {
    return (
        <AuthProvider>
            <CustomStyles />
            <div className="bg-stone-950 min-h-screen font-sans text-gray-200">
                <Router />
            </div>
        </AuthProvider>
    );
}

const Router = () => {
    const [route, setRoute] = useState(window.location.hash || '#home');
    const { user, loading } = useAuth();

    useEffect(() => {
        const handleHashChange = () => setRoute(window.location.hash || '#home');
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const navigate = (path) => { window.location.hash = path; };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-stone-950">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
     }

    const renderRoute = () => {
        if (route === '#home') return <HomePage navigate={navigate} />;
        if (route === '#login') return <LoginPage navigate={navigate} />;
        if (route === '#register') return <RegisterPage navigate={navigate} />;

        if (user) {
            let pageComponent;
            switch (route) {
                case '#dashboard': pageComponent = <DashboardPage />; break;
                case '#automate-resume': pageComponent = <AutomateResumePage navigate={navigate} />; break;
                case '#templates': pageComponent = <TemplatesPage navigate={navigate} />; break;
                case '#resume-editor': pageComponent = <ResumeEditorPage navigate={navigate} />; break;
                case '#portfolio-editor': pageComponent = <PortfolioEditorPage />; break;
                case '#analytics': pageComponent = <AnalyticsPage />; break;
                case '#job-matcher': pageComponent = <JobMatcherPage />; break;
                case '#interview-coach': pageComponent = <InterviewCoachPage />; break;
                default: pageComponent = <DashboardPage />;
            }
            return <AppLayout navigate={navigate}>{pageComponent}</AppLayout>;
        }
        
        navigate('#login');
        return <LoginPage navigate={navigate} />;
    };
    return renderRoute();
};
