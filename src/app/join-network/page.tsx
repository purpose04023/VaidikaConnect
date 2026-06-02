"use client";

import { FormEvent, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useContent } from "@/lib/content-store";
import { BadgeCheck, Send, Star, Users, ChevronRight, Sparkles } from "lucide-react";
import { ManagedImage } from "@/components/common/ManagedImage";

import { compressImage } from "@/lib/utils";

const defaultPhoto =
  "https://images.unsplash.com/photo-1570839753356-6bc05ceea49a?auto=format&fit=crop&w=1200&q=80";

const benefits = [
  { icon: Users, title: "Join 500+ Pujaris", desc: "Be part of our sacred growing network of qualified priests." },
  { icon: Star, title: "Verified Badge", desc: "Get a VaidikaConnect verified badge boosting your credibility." },
  { icon: BadgeCheck, title: "Direct Bookings", desc: "Receive puja requests directly from devotees in your region." },
  { icon: Sparkles, title: "Support & Training", desc: "Ongoing guidance and support from our experienced team." },
];

export default function JoinNetworkPage() {
  const { pujas, submitJoinRequest } = useContent();
  const { toast } = useToast();
  const [selectedPujas, setSelectedPujas] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    location: "",
    photo: "",
    qualifications: "",
    languages: "Telugu, Sanskrit",
    experience: "1",
    basePrice: "5000",
    description: "",
  });

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const csv = (str: string) => str.split(",").map((s) => s.trim()).filter(Boolean);

  const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );

  const readUploadedImage = (file: File) => {
    return compressImage(file);
  };

  const togglePuja = (id: number) => {
    setSelectedPujas((current) =>
      current.includes(id) ? current.filter((pujaId) => pujaId !== id) : [...current, id]
    );
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await submitJoinRequest({
        name: form.name,
        phone: form.phone,
        email: form.email,
        city: form.city,
        location: form.location,
        photo: form.photo || defaultPhoto,
        qualifications: csv(form.qualifications),
        languages: csv(form.languages),
        experience: Number(form.experience),
        basePrice: Number(form.basePrice),
        maxParticipants: 50,
        pujas: selectedPujas,
        description: form.description,
      });
      setSubmitted(true);
      toast({
        title: "🙏 Application Submitted!",
        description: "Your profile is now pending review. We will contact you shortly.",
      });
    } catch (error) {
      console.error("Join request submission failed:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20 divine-bg">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
            <BadgeCheck className="h-12 w-12 text-primary" />
          </div>
          <h1 className="font-headline text-4xl text-primary mb-4">🙏 Namaste!</h1>
          <p className="text-xl font-semibold mb-2">Your Application is Received</p>
          <p className="text-muted-foreground mb-8">
            Our team will review your profile and reach out to you within 2-3 business days. 
            Welcome to the VaidikaConnect family!
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline" className="border-primary/40 hover:bg-primary/10">
            Submit Another Application
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="divine-bg relative overflow-hidden py-20 md:py-28 text-center">
        {/* Decorative Om symbols */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute top-8 left-[10%] text-primary/5 text-[180px] font-serif select-none leading-none">ॐ</span>
          <span className="absolute bottom-0 right-[8%] text-primary/5 text-[150px] font-serif select-none leading-none">ॐ</span>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/3 text-[320px] font-serif select-none leading-none">ॐ</span>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/30 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Now accepting applications
          </div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary mb-4">
            Join the Sacred Network
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Are you a qualified Vedic priest? Join VaidikaConnect and bring the divine blessings 
            of ancient rituals to devotees across India.
          </p>
          {/* Benefit cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="glass-card rounded-xl p-4 text-left hover:border-primary/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center mb-3">
                  <b.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="font-semibold text-sm mb-1">{b.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-bold mb-3">Pujari Application</h2>
              <p className="text-muted-foreground">Fill in your details below. Our team personally reviews every application.</p>
            </div>

            <form onSubmit={submit}>
              {/* Personal Details */}
              <div className="divine-section-card mb-8">
                <div className="divine-section-header">
                  <span className="divine-step-badge">1</span>
                  <div>
                    <h3 className="font-semibold text-lg">Personal Details</h3>
                    <p className="text-sm text-muted-foreground">Your basic contact information</p>
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-2 p-6">
                  <FormField label="Full Name *">
                    <Input
                      required
                      placeholder="e.g. Sri Venkata Rao"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      className="divine-input"
                    />
                  </FormField>
                  <FormField label="Phone Number *">
                    <Input
                      required
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      className="divine-input"
                    />
                  </FormField>
                  <FormField label="Email Address">
                    <Input
                      type="email"
                      placeholder="your@email.com (optional)"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className="divine-input"
                    />
                  </FormField>
                  <FormField label="City / Town *">
                    <Input
                      required
                      placeholder="e.g. Guntur, Vijayawada"
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                      className="divine-input"
                    />
                  </FormField>
                  <FormField label="Your Location (Google Maps Link or Address) *">
                    <Input
                      required
                      placeholder="e.g. https://maps.app.goo.gl/... or 'Near Rama Temple, Guntur'"
                      value={form.location}
                      onChange={(e) => update("location", e.target.value)}
                      className="divine-input"
                    />
                  </FormField>
                  <FormField label="Profile Photo">
                    <Input
                      type="file"
                      accept="image/*"
                      className="divine-input"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          update("photo", await readUploadedImage(file));
                        }
                      }}
                    />
                    {form.photo && (
                      <ManagedImage
                        src={form.photo}
                        alt="Profile preview"
                        width={112}
                        height={112}
                        className="mt-3 h-24 w-24 rounded-full object-cover border-4 border-primary/30 shadow-md"
                      />
                    )}
                  </FormField>
                </div>
              </div>

              {/* Qualifications */}
              <div className="divine-section-card mb-8">
                <div className="divine-section-header">
                  <span className="divine-step-badge">2</span>
                  <div>
                    <h3 className="font-semibold text-lg">Qualifications & Experience</h3>
                    <p className="text-sm text-muted-foreground">Tell us about your priestly expertise</p>
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-2 p-6">
                  <FormField label="Languages Spoken">
                    <Input
                      placeholder="Telugu, Sanskrit, Hindi"
                      value={form.languages}
                      onChange={(e) => update("languages", e.target.value)}
                      className="divine-input"
                    />
                  </FormField>
                  <FormField label="Qualifications / Titles">
                    <Input
                      placeholder="Veda Praveena, Jyotisha Acharya"
                      value={form.qualifications}
                      onChange={(e) => update("qualifications", e.target.value)}
                      className="divine-input"
                    />
                  </FormField>
                  <FormField label="Years of Experience *">
                    <Input
                      required
                      type="number"
                      min="0"
                      placeholder="e.g. 15"
                      value={form.experience}
                      onChange={(e) => update("experience", e.target.value)}
                      className="divine-input"
                    />
                  </FormField>
                  <FormField label="Base Price per Puja (₹) *">
                    <Input
                      required
                      type="number"
                      min="0"
                      placeholder="e.g. 5000"
                      value={form.basePrice}
                      onChange={(e) => update("basePrice", e.target.value)}
                      className="divine-input"
                    />
                  </FormField>
                  <div className="md:col-span-2">
                    <FormField label="About Your Priestly Practice *">
                      <Textarea
                        required
                        placeholder="Describe your background, tradition, and what makes you a qualified pujari..."
                        value={form.description}
                        onChange={(e) => update("description", e.target.value)}
                        className="divine-input min-h-[120px]"
                      />
                    </FormField>
                  </div>
                </div>
              </div>

              {/* Programs */}
              <div className="divine-section-card mb-8">
                <div className="divine-section-header">
                  <span className="divine-step-badge">3</span>
                  <div>
                    <h3 className="font-semibold text-lg">Programs You Can Perform</h3>
                    <p className="text-sm text-muted-foreground">Select all rituals you are qualified to perform</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid max-h-72 gap-2 overflow-auto rounded-xl border border-border/60 p-4 sm:grid-cols-2 lg:grid-cols-3 bg-muted/30">
                    {pujas.map((puja) => (
                      <label
                        key={puja.id}
                        className="flex items-center gap-2 text-sm py-1.5 px-2 rounded-lg hover:bg-primary/10 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          checked={selectedPujas.includes(puja.id)}
                          onCheckedChange={() => togglePuja(puja.id)}
                        />
                        {puja.name_en}
                      </label>
                    ))}
                  </div>
                  {selectedPujas.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-2">{selectedPujas.length} programs selected:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedPujas.map((id) => {
                          const puja = pujas.find((item) => item.id === id);
                          return puja ? (
                            <Badge key={id} className="bg-primary/15 text-primary border-primary/30 hover:bg-primary/20">
                              {puja.name_en}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="text-center">
                <Button
                  type="submit"
                  size="lg"
                  disabled={selectedPujas.length === 0 || isSubmitting}
                  className="divine-button px-10 py-6 text-base font-semibold"
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Submit Application for Review
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
                {selectedPujas.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-3">
                    Please select at least one program you can perform.
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-4">
                  By submitting, you agree to our terms of service. We respect your privacy and will never share your data.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
    </div>
  );
}

function csv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
