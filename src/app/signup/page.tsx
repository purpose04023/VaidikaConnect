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
import { ADMIN_EMAILS, isAdminEmail } from '@/lib/admin';
import { createClient } from '@/utils/supabase/client';

const formSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  whatsappNumber: z.string().regex(/^\d{10}$/, { message: 'WhatsApp number must be exactly 10 digits and contain only numbers.' }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
  // DPDP Act §7 — explicit consent for each purpose
  consentPrivacy: z.boolean().refine((v) => v === true, {
    message: 'You must accept the Privacy Notice and Terms to continue.',
  }),
  consentMarketing: z.boolean().optional(),
});

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      whatsappNumber: '',
      password: '',
      consentPrivacy: false,   // unticked by default — DPDP §7(a)
      consentMarketing: false, // unticked by default — optional
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isAdminEmail(values.email)) {
      toast({
        variant: 'destructive',
        title: 'Reserved admin account',
        description: `This is a reserved admin account and cannot be created from public signup.`,
      });
      return;
    }

    try {
      // Check if email already exists in customer database
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', values.email)
        .maybeSingle();

      if (existingProfile) {
        toast({
          variant: 'destructive',
          title: 'Account already exists',
          description: 'This email is already registered. Please login instead.',
        });
        return;
      }

      const { data: { user }, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: `${values.firstName} ${values.lastName}`,
            phone_whatsapp: values.whatsappNumber,
            // DPDP Act §7 — store consent record at time of signup
            consent_privacy_accepted: true,
            consent_privacy_ts: new Date().toISOString(),
            consent_marketing: values.consentMarketing ?? false,
            consent_marketing_ts: new Date().toISOString(),
          }
        }
      });
      if (error) throw error;
      
      // Auto-login since database trigger auto-confirmed the user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (signInError) throw signInError;

      router.push('/');
      toast({
        title: 'Account Created',
        description: 'Welcome to VaidikaConnect!',
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Could not create your account.',
      });
    }
  }

  return (
    <div className="container flex min-h-[calc(100vh-56px)] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>Join VaidikaConnect to connect with tradition</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                name="whatsappNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 9876543210" {...field} />
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
              {/* DPDP §7 — per-purpose consent checkboxes, unticked by default */}
              <FormField
                control={form.control}
                name="consentPrivacy"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        id="consentPrivacy"
                        checked={field.value}
                        onChange={field.onChange}
                        className="mt-0.5 h-4 w-4 accent-amber-600 cursor-pointer"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel htmlFor="consentPrivacy" className="font-normal text-sm cursor-pointer">
                        I have read and agree to the{' '}
                        <a href="/privacy" target="_blank" className="underline text-primary">Privacy Notice</a>
                        {' '}and{' '}
                        <a href="/terms" target="_blank" className="underline text-primary">Terms of Service</a>.
                        {' '}<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="consentMarketing"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        id="consentMarketing"
                        checked={field.value ?? false}
                        onChange={field.onChange}
                        className="mt-0.5 h-4 w-4 accent-amber-600 cursor-pointer"
                      />
                    </FormControl>
                    <div className="leading-none">
                      <FormLabel htmlFor="consentMarketing" className="font-normal text-sm cursor-pointer">
                        (Optional) I agree to receive updates, offers, and auspicious reminders by WhatsApp/email. I can opt out anytime.
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
