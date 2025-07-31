// src/hooks/use-auth.ts
import { useContext } from 'react';
import { User, UserCredential } from 'firebase/auth';
import { AuthContext } from '@/components/providers/AuthProvider';

export interface AuthContextType {
    user: User | null;
    signInWithGoogle: () => Promise<UserCredential>;
    signInWithEmail: (email: string, pass: string) => Promise<UserCredential>;
    signOut: () => Promise<void>;
    sendPasswordReset: (email: string) => Promise<void>;
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
