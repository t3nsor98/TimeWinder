// src/components/providers/AuthProvider.tsx
"use client";

import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AuthContextType } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Placeholder auth functions
    const signInWithGoogle = async () => { 
        const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
     };
    const signInWithEmail = async (email: string, pass: string) => {
        const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = await import('firebase/auth');
        try {
            return await signInWithEmailAndPassword(auth, email, pass);
        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                return createUserWithEmailAndPassword(auth, email, pass);
            }
            throw error;
        }
    };
    const signOut = () => auth.signOut();
    const sendPasswordReset = async (email: string) => {
        const { sendPasswordResetEmail } = await import('firebase/auth');
        return sendPasswordResetEmail(auth, email);
    }

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <AuthContext.Provider value={{ user, signInWithGoogle, signInWithEmail, signOut, sendPasswordReset }}>
            {children}
        </AuthContext.Provider>
    );
};
