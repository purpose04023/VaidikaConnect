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
import { 
  BadgeCheck, 
  Send, 
  Star, 
  Users, 
  ChevronRight, 
  Sparkles, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Loader2,
  Clock,
  Phone,
  MessageSquare
} from "lucide-react";
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

  // Form State
  const [form, setForm] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    email: "",
    city: "",
    location: "",
    photo: "",
    qualifications: "",
    languages: "Telugu, Sanskrit",
    experience: "1",
    basePrice: "5000",
    description: "",
    availableTimings: "Morning Slot, Evening Slot",
  });

  // Geolocation Coordinates State
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const csv = (str: string) => str.split(",").map((s) => s.trim()).filter(Boolean);

  const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-2">
      <Label className="text-sm font-semibold">{label}</Label>
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

  // Device GPS Location Retrieval
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Geolocation Unsupported",
        description: "Your device or browser does not support GPS coordinate detection."
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        setIsLocating(false);
        toast({
          title: "📍 GPS Coords Captured!",
          description: `Coordinates added: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}.`
        });
      },
      (error) => {
        console.error("GPS fetch error:", error);
        setIsLocating(false);
        toast({
          variant: "destructive",
          title: "GPS Access Denied",
          description: "Could not fetch exact coordinates. Please check browser permissions."
        });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Submit form handler
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await submitJoinRequest({
        name: form.name,
        phone: form.phone,
        whatsapp: form.whatsapp || form.phone,
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
        lat: coords?.lat || 16.3067, // default Guntur if not captured
        lng: coords?.lng || 80.4367,
        availableTimings: form.availableTimings,
        status: "Pending Review", // pending review status in admin portal
      });

      setSubmitted(true);
      toast({
        title: "🙏 Application Submitted!",
        description: "Application submitted successfully! Our team will review your details shortly.",
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
          <p className="text-xl font-semibold mb-2">Application Under Review</p>
          <p className="text-muted-foreground mb-8">
            Your details are successfully loaded under **Pending Review** status. Our team will verify 
            your exact coordinates and timings shortly!
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline" className="border-primary/40 hover:bg-primary/10">
            Submit Another Application
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Section */}
      <section className="divine-bg relative overflow-hidden py-20 md:py-28 text-center">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute top-8 left-[10%] text-primary/5 text-[180px] font-serif select-none leading-none">ॐ</span>
          <span className="absolute bottom-0 right-[8%] text-primary/5 text-[150px] font-serif select-none leading-none">ॐ</span>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/3 text-[320px] font-serif select-none leading-none">ॐ</span>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/30 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Now accepting onboarding applications
          </div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary mb-4">
            Join the Sacred Network
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Are you a qualified Vedic priest? Register on VaidikaConnect and let regional devotees 
            find you dynamically on our booking map.
          </p>
          
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

      {/* Onboarding Form Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            <div className="text-center mb-10">
              <h2 className="font-headline text-3xl md:text-4xl font-bold mb-3">Poojari Registration</h2>
              <p className="text-muted-foreground">Complete the form below to register your priestly practice on our discovery map.</p>
            </div>

            <form onSubmit={submit} className="space-y-8">
              
              {/* Card 1: Personal & Contact Info */}
              <Card className="border border-border/60 shadow-md rounded-2xl overflow-hidden bg-card/50">
                <div className="border-b border-border/40 p-5 bg-muted/10 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-sm">1</span>
                  <div>
                    <h3 className="font-semibold text-base">Personal & Contact Information</h3>
                    <p className="text-xs text-muted-foreground">Verify your phone and WhatsApp details for direct client dial-ins</p>
                  </div>
                </div>
                
                <CardContent className="p-6 grid gap-5 md:grid-cols-2">
                  <FormField label="Full Name *">
                    <Input
                      required
                      placeholder="e.g. Sri Venkata Sastry"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      className="divine-input"
                    />
                  </FormField>

                  <FormField label="Years of Experience *">
                    <Input
                      required
                      type="number"
                      min="0"
                      placeholder="e.g. 12"
                      value={form.experience}
                      onChange={(e) => update("experience", e.target.value)}
                      className="divine-input"
                    />
                  </FormField>

                  <FormField label="Direct Calling Number *">
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        required
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        className="divine-input pl-9"
                      />
                    </div>
                  </FormField>

                  <FormField label="WhatsApp Number (for messaging) *">
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                      <Input
                        required
                        placeholder="+91 98765 43210"
                        value={form.whatsapp}
                        onChange={(e) => update("whatsapp", e.target.value)}
                        className="divine-input pl-9"
                      />
                    </div>
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

                  <FormField label="Base Price per Ceremony (₹) *">
                    <Input
                      required
                      type="number"
                      min="0"
                      placeholder="e.g. 4500"
                      value={form.basePrice}
                      onChange={(e) => update("basePrice", e.target.value)}
                      className="divine-input"
                    />
                  </FormField>
                </CardContent>
              </Card>

              {/* Card 2: Smart GPS Location Capture */}
              <Card className="border border-border/60 shadow-md rounded-2xl overflow-hidden bg-card/50">
                <div className="border-b border-border/40 p-5 bg-muted/10 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-sm">2</span>
                  <div>
                    <h3 className="font-semibold text-base">Smart Location & Map Coordinates</h3>
                    <p className="text-xs text-muted-foreground">Plot your exact geolocation so clients in Guntur can locate you</p>
                  </div>
                </div>

                <CardContent className="p-6 space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <FormField label="City / Pincode / Area *">
                      <Input
                        required
                        placeholder="e.g. Guntur - 522002"
                        value={form.city}
                        onChange={(e) => update("city", e.target.value)}
                        className="divine-input"
                      />
                    </FormField>

                    <FormField label="Practice Address / Temple Area *">
                      <Input
                        required
                        placeholder="e.g. Near Rama Temple, Arundeltop, Guntur"
                        value={form.location}
                        onChange={(e) => update("location", e.target.value)}
                        className="divine-input"
                      />
                    </FormField>
                  </div>

                  {/* Geolocation Button */}
                  <div className="bg-muted/30 rounded-xl p-4 border border-border/40 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">Map Coordinate Accuracy</h4>
                        <p className="text-xs text-muted-foreground max-w-md mt-1">
                          Click below to capture your current exact Latitude and Longitude. This maps your profile precisely.
                        </p>
                      </div>

                      <Button
                        type="button"
                        onClick={handleDetectLocation}
                        disabled={isLocating}
                        className="gap-2 shrink-0 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl h-11"
                      >
                        {isLocating ? (
                          <Loader2 className="h-4 w-4 animate-spin text-white" />
                        ) : (
                          <MapPin className="h-4 w-4 text-white" />
                        )}
                        <span>📍 Detect My Exact Location for Map</span>
                      </Button>
                    </div>

                    {/* GPS Coordinates Capture Status check */}
                    {coords ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>Coordinates Captured successfully: Lat {coords.lat.toFixed(6)}, Lng {coords.lng.toFixed(6)}</span>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground italic px-1">
                        GPS Coordinates: Not captured yet (fallback Guntur region will be mapped if not detected).
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Availability & Qualifications */}
              <Card className="border border-border/60 shadow-md rounded-2xl overflow-hidden bg-card/50">
                <div className="border-b border-border/40 p-5 bg-muted/10 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-sm">3</span>
                  <div>
                    <h3 className="font-semibold text-base">Availability & Qualifications</h3>
                    <p className="text-xs text-muted-foreground">List your active timing slots and certified credentials</p>
                  </div>
                </div>

                <CardContent className="p-6 grid gap-5 md:grid-cols-2">
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
                      placeholder="Veda Praveena, Smartha Acharya"
                      value={form.qualifications}
                      onChange={(e) => update("qualifications", e.target.value)}
                      className="divine-input"
                    />
                  </FormField>

                  <FormField label="Available Timing Slots (e.g. Morning Slot, Evening Slot) *">
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        required
                        placeholder="Morning Slot (9:00 AM - 12:00 PM), Evening Slot"
                        value={form.availableTimings}
                        onChange={(e) => update("availableTimings", e.target.value)}
                        className="divine-input pl-9"
                      />
                    </div>
                  </FormField>

                  <FormField label="Profile Photo Upload">
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
                        className="mt-3 h-20 w-20 rounded-full object-cover border-2 border-primary/30 shadow-sm"
                      />
                    )}
                  </FormField>

                  <div className="md:col-span-2">
                    <FormField label="About Your Priestly Practice *">
                      <Textarea
                        required
                        placeholder="Describe your background, lineage tradition, and what makes you a qualified pujari..."
                        value={form.description}
                        onChange={(e) => update("description", e.target.value)}
                        className="divine-input min-h-[100px]"
                      />
                    </FormField>
                  </div>
                </CardContent>
              </Card>

              {/* Card 4: Services Offered checklist */}
              <Card className="border border-border/60 shadow-md rounded-2xl overflow-hidden bg-card/50">
                <div className="border-b border-border/40 p-5 bg-muted/10 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-sm">4</span>
                  <div>
                    <h3 className="font-semibold text-base">Rituals & Programs You Can Perform</h3>
                    <p className="text-xs text-muted-foreground">Select all programs you are qualified to perform for regional devotees</p>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="grid max-h-72 gap-2 overflow-auto rounded-xl border border-border/40 p-4 sm:grid-cols-2 lg:grid-cols-3 bg-muted/10">
                    {pujas.filter((puja) => puja.name_en && puja.name_en.trim() !== '').map((puja) => (
                      <label
                        key={puja.id}
                        className="flex items-center gap-2.5 text-sm py-2 px-2.5 rounded-lg hover:bg-primary/10 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          checked={selectedPujas.includes(puja.id)}
                          onCheckedChange={() => togglePuja(puja.id)}
                        />
                        <span className="font-medium">{puja.name_en}</span>
                      </label>
                    ))}
                  </div>

                  {selectedPujas.length > 0 && (
                    <div className="mt-4 animate-in fade-in duration-200">
                      <p className="text-xs text-muted-foreground mb-2">{selectedPujas.length} programs selected:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedPujas.map((id) => {
                          const puja = pujas.find((item) => item.id === id);
                          return puja ? (
                            <Badge key={id} className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 font-semibold text-xs py-0.5 px-2">
                              {puja.name_en}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Submit Buttons area */}
              <div className="text-center pt-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={selectedPujas.length === 0 || isSubmitting}
                  className="divine-button px-12 py-6 text-base font-bold shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      <span>Submit Onboarding Application</span>
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
                
                {selectedPujas.length === 0 && (
                  <p className="text-sm text-red-500 font-semibold mt-3 animate-pulse">
                    * Please select at least one program you are qualified to perform.
                  </p>
                )}
                
                <p className="text-[11px] text-muted-foreground mt-4">
                  By submitting, you agree to our terms of service. We respect your privacy and will never share your personal data.
                </p>
              </div>

            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
