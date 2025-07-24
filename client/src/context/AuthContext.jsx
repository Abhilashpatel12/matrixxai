import React, { useState, useEffect, createContext, useContext } from 'react';
import { onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, appId } from '../api/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const attemptSignIn = async () => {
            try {
                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                    await signInWithCustomToken(auth, __initial_auth_token);
                } else {
                    await signInAnonymously(auth);
                }
            } catch (error) {
                console.error("Authentication Error:", error);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userDocRef = doc(db, `artifacts/${appId}/users`, firebaseUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    setUser({ uid: firebaseUser.uid, ...userDocSnap.data() });
                } else {
                     setUser({ uid: firebaseUser.uid, email: firebaseUser.email || 'Anonymous' });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        attemptSignIn();
        return () => unsubscribe();
    }, []);

    const value = { user, loading };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};

