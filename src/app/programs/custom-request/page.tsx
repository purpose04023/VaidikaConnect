"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-auth";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Loader2, Sparkles, AlertCircle, Check, BookOpen, Calendar, MapPin, Phone } from "lucide-react";
import Link from "next/link";

function CustomRequestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const supabase = createClient();

  const categoryParam = searchParams.get("category") || "Poojas";

  // Form states
  const [description, setDescription] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [locationType, setLocationType] = useState("home");
  const [locationAddress, setLocationAddress] = useState("");

  // AI Matching States
  const [isVerifying, setIsVerifying] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [verificationError, setVerificationError] = useState("");

  // Booking states
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch WhatsApp from profile on load
  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("phone_whatsapp")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data?.phone_whatsapp) {
            setWhatsappNumber(data.phone_whatsapp);
          }
        });
    }
  }, [user]);

  // suggestion chips
  const suggestions = [
    `Special regional ${categoryParam} in Guntur`,
    `Auspicious ${categoryParam} for new business`,
    `Simple family ${categoryParam} with essential rituals`,
  ];

  // AI Verification trigger
  const handleVerifyWithAI = async () => {
    if (!description.trim()) {
      toast({
        variant: "destructive",
        title: "Please describe your pooja",
        description: "Tell us what ritual or deity you want to worship.",
      });
      return;
    }

    setIsVerifying(true);
    setVerificationError("");
    setAiResult(null);

    try {
      const res = await fetch("/api/search-pooja", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userQuery: description, userLocation: locationAddress })
      });

      if (!res.ok) {
        throw new Error("AI could not verify this request. Please make it more specific.");
      }

      const data = await res.json();
      setAiResult(data);
      toast({
        title: "AI Verification Complete",
        description: `Successfully interpreted ritual as a ${data.deity} ${data.ritualArchetype}!`,
      });
    } catch (err: any) {
      setVerificationError(err.message || "Something went wrong.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Final booking submit
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to complete your booking.",
      });
      router.push("/login");
      return;
    }

    if (!description || !preferredDate || !preferredTime || !whatsappNumber) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill out all required fields.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/book-custom-pooja", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawUserInput: description,
          preferredDate,
          preferredTime,
          locationType,
          locationAddress,
          whatsappNumber,
          category: categoryParam
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit booking");
      }

      toast({
        title: "Pooja Request Submitted!",
        description: "Verify details on your profile. A WhatsApp quote will be sent shortly.",
      });
      router.push("/profile");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: err.message || "An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="container flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container flex min-h-[70vh] flex-col items-center justify-center text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold">Account Required</h2>
        <p className="text-muted-foreground max-w-sm">
          You must create an account or sign in to request custom poojas and receive WhatsApp price quotes.
        </p>
        <Button asChild>
          <Link href="/signup">Create an Account</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary px-3 py-1 bg-primary/10 rounded-full">
          Custom Ritual Booking
        </span>
        <h1 className="font-headline text-4xl font-bold mt-3 text-foreground">
          Request Custom {categoryParam}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
          Describe the custom ritual you want to perform. Our AI will verify the requirements and our admin will quote a price to your WhatsApp.
        </p>
      </div>

      <div className="space-y-8">
        {/* Step 1: AI Verification */}
        <Card className="glass-card border-border bg-card shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="h-16 w-16 text-primary" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Sparkles className="h-5 w-5 text-primary" />
              Step 1: Describe & Verify Ritual
            </CardTitle>
            <CardDescription>
              Write your pooja needs in any language. Our AI will parse the deity, samskaras, and required materials.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Describe your Pooja Needs</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="e.g. Perform special Pochamma Devi pooja at my home next Sunday. Low budget, only essential elements."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                className="bg-background"
              />
              <span className="text-xs text-muted-foreground block text-right">
                {description.length}/500 characters
              </span>
            </div>

            {/* Suggestions */}
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setDescription(s)}
                  className="text-xs bg-secondary/40 hover:bg-secondary/80 border border-border px-3 py-1.5 rounded-full transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>

            <Button
              type="button"
              onClick={handleVerifyWithAI}
              disabled={isVerifying}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-black font-bold"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>AI is interpreting your request...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Verify with AI</span>
                </>
              )}
            </Button>

            {verificationError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{verificationError}</span>
              </div>
            )}

            {/* AI Results Display */}
            {aiResult && (
              <div className="mt-6 border border-primary/20 rounded-xl p-4 bg-primary/5 space-y-4 animate-fadeIn">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-primary tracking-widest">
                      AI Interpretation
                    </h4>
                    <h3 className="text-xl font-bold mt-1 text-foreground">
                      {aiResult.deity} {aiResult.ritualArchetype}
                    </h3>
                  </div>
                  <span className="text-xs bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full font-semibold">
                    {aiResult.region}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground block">AI Confidence Score</span>
                  <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${(aiResult.confidence || 0.8) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Materials List */}
                {aiResult.materials && aiResult.materials.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" /> Parsed Materials list:
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-sm bg-background/50 p-3 rounded-lg border border-border">
                      {aiResult.materials.map((mat: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Check className="h-3 w-3 text-green-500" />
                          <span>{mat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Details & Booking Submit */}
        {aiResult && (
          <form onSubmit={handleSubmitBooking}>
            <Card className="glass-card border-border bg-card shadow-xl overflow-hidden relative">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                  <Calendar className="h-5 w-5 text-primary" />
                  Step 2: Enter Details & WhatsApp
                </CardTitle>
                <CardDescription>
                  Specify when and where the ritual should take place, and confirm your contact details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preferredDate">Preferred Date</Label>
                    <Input
                      id="preferredDate"
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredTime">Preferred Time</Label>
                    <Input
                      id="preferredTime"
                      type="time"
                      required
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                    />
                  </div>
                </div>

                {/* WhatsApp number collection */}
                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber" className="flex items-center gap-1">
                    <Phone className="h-4 w-4 text-primary" /> WhatsApp Number (For Quote Delivery)
                  </Label>
                  <Input
                    id="whatsappNumber"
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    We will send the custom ritual price quote and booking confirmation directly to this WhatsApp number.
                  </p>
                </div>

                {/* Location Type */}
                <div className="space-y-2">
                  <Label>Perform Ritual At</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {["home", "temple", "online"].map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setLocationType(loc)}
                        className={`py-2 px-4 rounded-xl border text-sm font-semibold transition-colors capitalize ${
                          locationType === loc
                            ? "bg-primary border-primary text-black"
                            : "border-border bg-background hover:bg-secondary/50"
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location Address */}
                {locationType !== "online" && (
                  <div className="space-y-2">
                    <Label htmlFor="locationAddress" className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-primary" /> Address
                    </Label>
                    <Textarea
                      id="locationAddress"
                      rows={3}
                      required
                      placeholder="Enter the full address where the pooja is to be performed."
                      value={locationAddress}
                      onChange={(e) => setLocationAddress(e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Request for Pricing</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        )}
      </div>
    </div>
  );
}

export default function CustomRequestPage() {
  return (
    <Suspense fallback={
      <div className="container flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <CustomRequestContent />
    </Suspense>
  );
}
