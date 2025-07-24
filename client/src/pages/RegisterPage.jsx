import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db, appId } from '../api/firebase';
import AuthPageLayout from '../components/auth/AuthPageLayout';
import { MailCheck } from 'lucide-react';

// --- Error Handling Function ---
const getFriendlyAuthError = (errorCode) => {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'This email address is already in use by another account.';
        case 'auth/weak-password':
            return 'Password is too weak. It should be at least 6 characters long.';
        case 'auth/invalid-email':
            return 'The email address is not valid.';
        default:
            return 'An unexpected error occurred. Please try again.';
    }
};

const RegisterPage = ({ navigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isVerificationSent, setIsVerificationSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Send the verification email
            await sendEmailVerification(user);

            // Store user name and email in Firestore
            await setDoc(doc(db, `artifacts/${appId}/users`, user.uid), {
                name: name,
                email: email,
            });

            // Show the success message instead of redirecting
            setIsVerificationSent(true);

        } catch (err) {
            setError(getFriendlyAuthError(err.code));
        }
    };

    // If the verification email has been sent, show a success message
    if (isVerificationSent) {
        return (
            <AuthPageLayout title="Verify Your Email">
                <div className="text-center text-gray-300">
                    <MailCheck className="mx-auto h-16 w-16 text-green-400 mb-4" />
                    <p className="text-lg">
                        A verification link has been sent to <span className="font-bold text-purple-400">{email}</span>.
                    </p>
                    <p className="mt-2 text-sm">
                        Please check your inbox (and spam folder) to complete your registration.
                    </p>
                    <button 
                        onClick={() => navigate('#login')}
                        className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                        Go to Login
                    </button>
                </div>
            </AuthPageLayout>
        );
    }

    // Otherwise, show the registration form
    return (
        <AuthPageLayout title="Create Your Account">
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <p className="text-red-400 text-sm text-center bg-red-900/50 p-2 rounded-lg">{error}</p>}
                <div className="opacity-0 animate-fade-in-up delay-1">
                    <label className="text-sm font-medium text-gray-400">Full Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-4 py-3 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition" />
                </div>
                <div className="opacity-0 animate-fade-in-up delay-2">
                    <label className="text-sm font-medium text-gray-400">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-4 py-3 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition" />
                </div>
                <div className="opacity-0 animate-fade-in-up delay-3">
                    <label className="text-sm font-medium text-gray-400">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-4 py-3 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition" />
                </div>
                <div className="opacity-0 animate-fade-in-up delay-4">
                    <button type="submit" className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-lg shadow-md shadow-purple-600/30 hover:shadow-lg hover:shadow-purple-600/40 hover:from-purple-700 hover:to-fuchsia-700 transition-all transform hover:scale-105">Create Account</button>
                </div>
            </form>
            <p className="text-center text-sm text-gray-400 opacity-0 animate-fade-in-up delay-4">
                Already have an account? <a href="#login" className="font-medium text-purple-400 hover:underline">Sign in</a>
            </p>
        </AuthPageLayout>
    );
};

export default RegisterPage;
