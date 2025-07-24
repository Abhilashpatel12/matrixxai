import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../api/firebase';
import AuthPageLayout from '../components/auth/AuthPageLayout';

// --- Error Handling Function ---
const getFriendlyAuthError = (errorCode) => {
    switch (errorCode) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
            return 'Invalid email or password. Please try again.';
        case 'auth/too-many-requests':
            return 'Access to this account has been temporarily disabled due to many failed login attempts. You can reset your password or try again later.';
        default:
            return 'An unexpected error occurred. Please try again.';
    }
};

const LoginPage = ({ navigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            
            // Check if the user's email is verified
            if (!userCredential.user.emailVerified) {
                // Resend verification for convenience and log them out
                await sendEmailVerification(userCredential.user);
                await signOut(auth);
                setError("Please verify your email before logging in. A new verification link has been sent to your inbox.");
                return; // Stop the login process
            }

            navigate('#dashboard');

        } catch (err) {
            setError(getFriendlyAuthError(err.code));
        }
    };

    return (
        <AuthPageLayout title="Welcome Back!">
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <p className="text-red-400 text-sm text-center bg-red-900/50 p-2 rounded-lg">{error}</p>}
                <div className="opacity-0 animate-fade-in-up delay-1">
                    <label className="text-sm font-medium text-gray-400">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-4 py-3 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition" />
                </div>
                <div className="opacity-0 animate-fade-in-up delay-2">
                    <label className="text-sm font-medium text-gray-400">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-4 py-3 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition" />
                </div>
                <div className="opacity-0 animate-fade-in-up delay-3">
                    <button type="submit" className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-lg shadow-md shadow-purple-600/30 hover:shadow-lg hover:shadow-purple-600/40 hover:from-purple-700 hover:to-fuchsia-700 transition-all transform hover:scale-105">Sign In</button>
                </div>
            </form>
            <p className="text-center text-sm text-gray-400 opacity-0 animate-fade-in-up delay-4">
                Don't have an account? <a href="#register" className="font-medium text-purple-400 hover:underline">Sign up</a>
            </p>
        </AuthPageLayout>
    );
};

export default LoginPage;

