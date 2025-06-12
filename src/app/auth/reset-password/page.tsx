"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { ArrowLeft, Mail, Shield, Key, CheckCircle } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

type Step = 'email' | 'verify' | 'reset' | 'success';

export default function ResetPasswordPage() {
  const [step, setStep] = useState<Step>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timeLeft, setTimeLeft] = useState(2 * 60); // 2 minutes in seconds
  const router = useRouter();

  // Countdown timer for code expiry
  useEffect(() => {
    if (step === 'verify' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setError("Reset code has expired. Please request a new one.");
            setStep('email');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset code');
      }

      setStep('verify');
      setTimeLeft(2 * 60); // Reset timer
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/auth/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resetCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid reset code');
      }

      setStep('reset');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resetCode, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setStep('success');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIcon = () => {
    switch (step) {
      case 'email':
        return <Mail className="h-8 w-8" />;
      case 'verify':
        return <Shield className="h-8 w-8" />;
      case 'reset':
        return <Key className="h-8 w-8" />;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'email':
        return 'Reset Your Password';
      case 'verify':
        return 'Enter Verification Code';
      case 'reset':
        return 'Set New Password';
      case 'success':
        return 'Password Reset Successful';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 'email':
        return 'Enter your email address and we\'ll send you a verification code';
      case 'verify':
        return `We've sent a 6-digit code to ${email}`;
      case 'reset':
        return 'Choose a strong password for your account';
      case 'success':
        return 'Your password has been reset successfully';
    }
  };

  return (
    <>
      {isLoading && <LoadingScreen message="Processing..." />}
      <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
        <motion.div
          key="reset-password-page"
          initial="initial"
          animate="animate"
          variants={staggerChildren}
          className="w-full max-w-md"
        >
          <motion.div variants={fadeIn}>
            <Card className="w-full">
              <CardHeader className="space-y-1 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    {getStepIcon()}
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">
                  {getStepTitle()}
                </CardTitle>
                <CardDescription>
                  {getStepDescription()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="text-sm text-red-500 text-center bg-red-50 p-3 rounded-md">
                    {error}
                  </div>
                )}

                {/* Step 1: Email Input */}
                {step === 'email' && (
                  <form onSubmit={handleSendResetCode} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading ? "Sending..." : "Send Reset Code"}
                    </Button>
                  </form>
                )}

                {/* Step 2: Code Verification */}
                {step === 'verify' && (
                  <form onSubmit={handleVerifyCode} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="resetCode">Verification Code</Label>
                      <Input
                        id="resetCode"
                        type="text"
                        placeholder="123456"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        required
                        disabled={isLoading}
                        className="text-center text-2xl tracking-widest"
                        maxLength={6}
                      />
                      <div className="text-sm text-muted-foreground text-center">
                        Code expires in: <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
                      </div>
                    </div>
                    <Button className="w-full" type="submit" disabled={isLoading || resetCode.length !== 6}>
                      {isLoading ? "Verifying..." : "Verify Code"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setStep('email')}
                      disabled={isLoading}
                    >
                      Use Different Email
                    </Button>
                  </form>
                )}

                {/* Step 3: Password Reset */}
                {step === 'reset' && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        minLength={6}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        minLength={6}
                      />
                    </div>
                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading ? "Resetting..." : "Reset Password"}
                    </Button>
                  </form>
                )}

                {/* Step 4: Success */}
                {step === 'success' && (
                  <div className="space-y-4 text-center">
                    <div className="bg-green-50 p-4 rounded-md">
                      <p className="text-green-800">
                        You can now sign in with your new password.
                      </p>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => router.push('/auth/sign-in')}
                    >
                      Continue to Sign In
                    </Button>
                  </div>
                )}

                {/* Back to Sign In Link */}
                {step !== 'success' && (
                  <div className="text-center">
                    <Link 
                      href="/auth/sign-in" 
                      className="text-sm text-primary hover:underline flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Sign In
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
} 
 