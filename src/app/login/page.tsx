'use client';

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


  return (
    <div className="container flex min-h-[calc(100vh-56px)] items-center justify-center py-12">
      <Card className="w-full max-w-md">
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
                    <FormLabel>Password</FormLabel>
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
      </Card>
    </div>
  );
}
