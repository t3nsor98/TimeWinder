// src/app/login/page.tsx
"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.99,36.636,44,31.125,44,24C44,22.659,43.862,21.34,43.611,20.083z" />
    </svg>
);

export default function LoginPage() {
    const { signInWithGoogle, signInWithEmail, sendPasswordReset } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPhoneLoading, setIsPhoneLoading] = useState(false);
    const [isCodeLoading, setIsCodeLoading] = useState(false);

    const router = useRouter();

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            await signInWithGoogle();
            toast({ title: "Successfully signed in with Google." });
            router.push('/');
        } catch (error) {
            console.error(error);
            toast({ title: "Google sign-in failed.", description: (error as Error).message, variant: "destructive" });
            setIsLoading(false);
        }
    };

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await signInWithEmail(email, password);
            toast({ title: "Successfully signed in." });
            router.push('/');
        } catch (error) {
            console.error(error);
            toast({ title: "Sign-in failed.", description: (error as Error).message, variant: "destructive" });
            setIsLoading(false);
        }
    };
    
    const handlePasswordReset = async () => {
        if (!email) {
            toast({ title: "Please enter your email address to reset your password.", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        try {
            await sendPasswordReset(email);
            toast({ title: "Password reset email sent.", description: "Check your inbox for instructions." });
        } catch (error) {
            toast({ title: "Failed to send reset email.", description: (error as Error).message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': (response: any) => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                }
            });
        }
    };

    const handlePhoneSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPhoneLoading(true);
        try {
            setupRecaptcha();
            const appVerifier = window.recaptchaVerifier;
            const result = await signInWithPhoneNumber(auth, `+${phoneNumber}`, appVerifier);
            setConfirmationResult(result);
            toast({ title: "Verification code sent." });
        } catch (error) {
            console.error(error);
            toast({ title: "Phone sign-in failed.", description: (error as Error).message, variant: "destructive" });
        } finally {
            setIsPhoneLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirmationResult) return;
        setIsCodeLoading(true);
        try {
            await confirmationResult.confirm(verificationCode);
            toast({ title: "Successfully signed in with phone number." });
            router.push('/');
        } catch (error) {
            console.error(error);
            toast({ title: "Code verification failed.", description: (error as Error).message, variant: "destructive" });
        } finally {
            setIsCodeLoading(false);
        }
    };


    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div id="recaptcha-container"></div>
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Welcome Back!</CardTitle>
                    <CardDescription>Choose your preferred sign-in method.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="email">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="email">Email</TabsTrigger>
                            <TabsTrigger value="phone">Phone</TabsTrigger>
                        </TabsList>
                        <TabsContent value="email">
                            <form onSubmit={handleEmailSignIn} className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Sign In / Sign Up
                                </Button>
                                <Button variant="link" type="button" onClick={handlePasswordReset} disabled={isLoading} className="w-full">
                                    Forgot Password?
                                </Button>
                            </form>
                        </TabsContent>
                        <TabsContent value="phone">
                            {!confirmationResult ? (
                                <form onSubmit={handlePhoneSignIn} className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input id="phone" type="tel" placeholder="11234567890" required value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                                        <p className="text-xs text-muted-foreground">Include country code, e.g., 1 for US.</p>
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isPhoneLoading}>
                                        {isPhoneLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Send Verification Code
                                    </Button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyCode} className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="code">Verification Code</Label>
                                        <Input id="code" type="text" placeholder="123456" required value={verificationCode} onChange={e => setVerificationCode(e.target.value)} />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isCodeLoading}>
                                        {isCodeLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Verify and Sign In
                                    </Button>
                                </form>
                            )}
                        </TabsContent>
                    </Tabs>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <GoogleIcon />
                        Google
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
