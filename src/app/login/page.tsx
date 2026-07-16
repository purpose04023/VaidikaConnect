'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/utils/supabase/client';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  // Mode states: 'login' | 'forgot-password' | 'enter-otp'
  const [mode, setMode] = useState<'login' | 'forgot-password' | 'enter-otp'>('login');
  const [resetEmail, setResetEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let authResult = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      let user = authResult.data.user;
      let authError = authResult.error;

      // Auto-register admin email dynamically on first login attempt if credentials mismatch
      const isAdminEmailAddr = values.email.trim().toLowerCase() === 'purpose04023@gmail.com' || 
                               values.email.trim().toLowerCase() === 'sudhee.sripada@gmail.com';
      
      if (authError && (authError.message.toLowerCase().includes("invalid login credentials") || authError.status === 400) && isAdminEmailAddr) {
        console.log("Admin account not found in Auth. Attempting auto-registration...");
        const signUpResult = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              full_name: "Chief Admin",
            }
          }
        });
        
        if (!signUpResult.error && signUpResult.data.user) {
          // Explicit login check to establish active session after auto-signup
          const secondTry = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
          });
          if (!secondTry.error && secondTry.data.user) {
            user = secondTry.data.user;
            authError = null;
            console.log("Admin account auto-registered and logged in successfully.");
          } else {
            authError = secondTry.error;
          }
        } else if (signUpResult.error) {
          console.error("Auto-registration failed:", signUpResult.error);
        }
      }

      if (authError) {
        console.error("SUPABASE AUTH ERROR: ", JSON.stringify(authError, null, 2));
        throw authError;
      }

      if (user) {
        // Query the user's profile data (using maybeSingle to handle missing rows gracefully)
        let { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error("SUPABASE PROFILE FETCH ERROR: ", JSON.stringify(profileError, null, 2));
          throw profileError;
        }

        // Auto-create or elevate profile to admin role
        if (!profileData) {
          const defaultFullName = user.user_metadata?.full_name || user.email?.split('@')[0] || "User";
          const newProfile = {
            id: user.id,
            email: user.email || values.email,
            role: isAdminEmailAddr ? 'admin' : 'user',
            full_name: defaultFullName,
          };
          const { data: insertedData, error: insertError } = await supabase
            .from('profiles')
            .insert(newProfile)
            .select()
            .single();

          if (insertError) {
            console.error("SUPABASE PROFILE INSERT ERROR: ", JSON.stringify(insertError, null, 2));
            throw insertError;
          }
          profileData = insertedData;
          console.log("Successfully created missing user profile:", profileData);
        } else if (isAdminEmailAddr && profileData.role !== 'admin') {
          // If the profile exists but was marked as 'user' by the default trigger, elevate it to 'admin'
          const { data: updatedData, error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', user.id)
            .select()
            .single();
            
          if (updateError) {
            console.error("SUPABASE PROFILE ROLE UPDATE ERROR: ", JSON.stringify(updateError, null, 2));
          } else {
            profileData = updatedData;
            console.log("Successfully elevated user profile to admin:", profileData);
          }
        } else {
          console.log("Successfully retrieved user profile:", profileData);
        }
      }

      router.push('/');
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
    } catch (error: any) {
      console.error("AUTH/DB CATCH ERROR:", error);
      const errorMsg = error.message || error.details || (error.code ? `Error Code: ${error.code}` : JSON.stringify(error));
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: errorMsg,
      });
    }
  }

  // Forgot password flow - Send recovery email
  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast({
        variant: 'destructive',
        title: 'Email required',
        description: 'Please enter your email address.',
      });
      return;
    }

    setIsResetting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: window.location.origin + '/login',
      });
      if (error) throw error;

      toast({
        title: 'Verification Code Sent',
        description: 'Please check your email for the recovery code/OTP.',
      });
      setMode('enter-otp');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error sending code',
        description: error.message || 'Could not send recovery code.',
      });
    } finally {
      setIsResetting(false);
    }
  };

  // Forgot password flow - Verify OTP and update password
  const handleVerifyOtpAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || !newPassword) {
      toast({
        variant: 'destructive',
        title: 'Required fields missing',
        description: 'Please enter both the OTP code and your new password.',
      });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Invalid password',
        description: 'Password must be at least 6 characters.',
      });
      return;
    }

    setIsResetting(true);
    try {
      // Verify OTP
      const { error } = await supabase.auth.verifyOtp({
        email: resetEmail,
        token: otpCode,
        type: 'recovery',
      });
      if (error) throw error;

      // Update password (user is automatically logged in after verifying recovery OTP)
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) throw updateError;

      toast({
        title: 'Password Updated',
        description: 'Your password has been successfully updated.',
      });
      setMode('login');
      router.push('/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Reset failed',
        description: error.message || 'Could not reset password. Please check the code.',
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="container flex min-h-[calc(100vh-56px)] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        {mode === 'login' && (
          <>
            <CardHeader className="text-center">
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel>Password</FormLabel>
                          <button
                            type="button"
                            onClick={() => {
                              setResetEmail(form.getValues('email'));
                              setMode('forgot-password');
                            }}
                            className="text-xs text-primary underline hover:text-primary/80"
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </form>
              </Form>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="underline">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </>
        )}

        {mode === 'forgot-password' && (
          <>
            <CardHeader className="text-center">
              <CardTitle>Forgot Password</CardTitle>
              <CardDescription>Enter your email address to receive a recovery code/OTP</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSendResetEmail} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isResetting}>
                  {isResetting ? 'Sending Code...' : 'Send Verification Code'}
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-sm text-primary underline"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </CardContent>
          </>
        )}

        {mode === 'enter-otp' && (
          <>
            <CardHeader className="text-center">
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>Enter the recovery code/OTP sent to your email and your new password</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleVerifyOtpAndReset} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recovery OTP / Code</label>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Password</label>
                  <Input
                    type="password"
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isResetting}>
                  {isResetting ? 'Resetting Password...' : 'Reset Password & Login'}
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-sm text-primary underline"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
