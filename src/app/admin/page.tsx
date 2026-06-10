"use client";

import { useEffect, useMemo, useState } from "react";
import type { Puja, Pujari, Temple, Region } from "@/lib/data";
import type { Deity } from "@/lib/data/stotrams";
import { useContent, type ContactContent, type GlobalSettings } from "@/lib/content-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { BadgeCheck, Check, Contact, FilePlus, Pencil, Plus, RotateCcw, Trash2, UserPlus, X, Loader2, BookOpen, Settings, Landmark, Map, Sparkles } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/use-auth";
import { ADMIN_EMAIL, isAdminEmail } from "@/lib/admin";
import { ManagedImage } from "@/components/common/ManagedImage";
import { useToast } from "@/hooks/use-toast";
import { compressImage } from "@/lib/utils";
import { generatePujaImageAction } from "@/app/actions/generateImage";

type PujaForm = Puja;
type PujariForm = Pujari;
type DeityForm = Deity;
type TempleForm = Temple;
type RegionForm = Region;

const emptyRegion = (): RegionForm => ({
  id: `region-${Date.now()}`,
  name: "",
});

const emptyTemple = (): TempleForm => ({
  id: `temple-${Date.now()}`,
  name: "",
  state: "Andhra Pradesh",
  location: "",
  image: "",
  banner_image: "",
  description: "",
  contact: "",
  booking_link: "",
});

const emptyDeity = (): DeityForm => ({
  id: `deity-${Date.now()}`,
  name: "",
  nameEn: "",
  gender: "female",
  imageHint: "beautiful deity painting",
  imageUrl: "",
  ashtotharamUrl: "",
  sahasranamamUrl: "",
  readingSlug: "",
});

const allCategoriesList = [
  "Vaidika Poojas",
  "Life Cycle Poojas",
  "Prenatal",
  "Childhood",
  "Youth and Education",
  "Adulthood",
  "General or Auspicious",
  "Deeksha Poojalu",
  "Homams",
  "Dosha Parihara",
  "Kalyanams",
  "Nomulu",
  "Vratas"
];

const emptyPuja = (nextId: string | number): PujaForm => ({
  id: nextId,
  name: "",
  name_en: "",
  description: "",
  description_te: "",
  image: "https://images.unsplash.com/photo-1644233771847-adbb3b5aa580?auto=format&fit=crop&w=1200&q=80",
  imageHint: "puja ritual",
  program_type: "VAIDIKA_POOJA",
  category: "" as Puja["category"],
  category_en: "Pujas",
  required_items: [],
  sloka_tags: [],
  pdf_url: "",
  categories: [...allCategoriesList, "All Programs"], // Checked by DEFAULT
});

const emptyPujari = (nextId: string | number, pujaIds: (string | number)[]): PujariForm => ({
  id: nextId,
  name: "",
  photo: "https://images.unsplash.com/photo-1570839753356-6bc05ceea49a?auto=format&fit=crop&w=1200&q=80",
  photoHint: "indian pujari",
  verified: false,
  verifiedBy: "VaidikaConnect",
  verifiedAt: "",
  rating: 5,
  reviewCount: 0,
  basePrice: 5000,
  qualifications: [],
  languages: ["Telugu", "Sanskrit"],
  experience: 1,
  pujas: pujaIds.slice(0, 3),
  maxParticipants: 50,
  location: { lat: 16.3067, lng: 80.4367 },
  description: "",
  phone: "",
  gallery: [],
  reviews: [],
});

function toCsv(values: string[]) {
  return values.join(", ");
}

function fromCsv(value: string) {
  return value.split(",").map(item => item.trim()).filter(Boolean);
}

function nextId(items: { id: string | number }[]) {
  return items.reduce((max, item) => {
    const num = typeof item.id === 'number' ? item.id : parseInt(item.id);
    return isNaN(num) ? max : Math.max(max, num);
  }, 0) + 1;
}

function readUploadedImage(file: File) {
  return compressImage(file);
}

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const {
    pujas,
    pujaris,
    temples,
    regions,
    deities,
    requests,
    contact,
    settings,
    savePuja,
    deletePuja,
    savePujari,
    deletePujari,
    saveTemple,
    deleteTemple,
    saveRegion,
    deleteRegion,
    saveDeity,
    deleteDeity,
    saveContact,
    saveSettings,
    approveJoinRequest,
    rejectJoinRequest,
    resetContent,
  } = useContent();
  const [pujaForm, setPujaForm] = useState<PujaForm>(() => emptyPuja(nextId(pujas)));
  const [pujariForm, setPujariForm] = useState<PujariForm>(() => emptyPujari(nextId(pujaris), pujas.map(puja => puja.id)));
  const [deityForm, setDeityForm] = useState<DeityForm>(emptyDeity);
  const [templeForm, setTempleForm] = useState<TempleForm>(emptyTemple);
  const [regionForm, setRegionForm] = useState<RegionForm>(emptyRegion);
  const [contactForm, setContactForm] = useState<ContactContent>(contact);
  const [settingsForm, setSettingsForm] = useState<GlobalSettings>(settings || {});
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Dynamic lists helper states
  const [newRequiredItem, setNewRequiredItem] = useState("");
  const [newSlokaName, setNewSlokaName] = useState("");

  // Custom pooja requests states
  const [customOrders, setCustomOrders] = useState<any[]>([]);
  const [priceQuotes, setPriceQuotes] = useState<Record<string, string>>({});
  const [pricingOrderId, setPricingOrderId] = useState<string | null>(null);

  const fetchCustomOrders = async () => {
    const supabaseClient = createClient();
    const { data } = await supabaseClient
      .from("custom_ritual_orders")
      .select("*")
      .eq("status", "pending_review")
      .order("created_at", { ascending: false });
    setCustomOrders(data || []);
  };

  useEffect(() => {
    if (user && isAdminEmail(user?.email)) {
      fetchCustomOrders();
    }
  }, [user]);

  const handleAssignPrice = async (orderId: string) => {
    const price = priceQuotes[orderId];
    if (!price || isNaN(parseFloat(price))) {
      toast({
        variant: "destructive",
        title: "Invalid Price",
        description: "Please enter a valid numeric price."
      });
      return;
    }

    setPricingOrderId(orderId);
    try {
      const res = await fetch("/api/admin-price-custom-pooja", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, price: parseFloat(price) })
      });

      if (!res.ok) {
        throw new Error("Failed to assign price");
      }

      toast({
        title: "Price Assigned Successfully",
        description: `Offer of ₹${parseFloat(price).toLocaleString()} submitted to client and WhatsApp alert simulated.`
      });

      // Refresh list
      await fetchCustomOrders();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Operation Failed",
        description: err.message || "An unexpected error occurred."
      });
    } finally {
      setPricingOrderId(null);
    }
  };
  const [newSlokaLink, setNewSlokaLink] = useState("");

  const addRequiredItem = () => {
    if (!newRequiredItem.trim()) return;
    const currentItems = pujaForm.required_items || [];
    if (!currentItems.includes(newRequiredItem.trim())) {
      updatePuja("required_items", [...currentItems, newRequiredItem.trim()]);
    }
    setNewRequiredItem("");
  };

  const removeRequiredItem = (itemToRemove: string) => {
    const currentItems = pujaForm.required_items || [];
    updatePuja("required_items", currentItems.filter(item => item !== itemToRemove));
  };

  const addSlokaTag = () => {
    if (!newSlokaName.trim() || !newSlokaLink.trim()) return;
    const currentSlokas = pujaForm.sloka_tags || [];
    updatePuja("sloka_tags", [...currentSlokas, { name: newSlokaName.trim(), link: newSlokaLink.trim() }]);
    setNewSlokaName("");
    setNewSlokaLink("");
  };

  const removeSlokaTag = (indexToRemove: number) => {
    const currentSlokas = pujaForm.sloka_tags || [];
    updatePuja("sloka_tags", currentSlokas.filter((_, idx) => idx !== indexToRemove));
  };

  const toggleCategoryTag = (categoryTag: string) => {
    const currentCategories = pujaForm.categories || [];
    let updated: string[] = [];
    
    if (categoryTag === "All Programs") {
      const isCurrentlyAll = currentCategories.includes("All Programs");
      if (isCurrentlyAll) {
        updated = [];
      } else {
        updated = [...allCategoriesList, "All Programs"];
      }
    } else {
      updated = currentCategories.includes(categoryTag)
        ? currentCategories.filter(c => c !== categoryTag && c !== "All Programs")
        : [...currentCategories, categoryTag];
      
      const allOthersChecked = allCategoriesList.every(cat => updated.includes(cat));
      if (allOthersChecked && !updated.includes("All Programs")) {
        updated.push("All Programs");
      }
    }
    
    updatePuja("categories", updated);

    // Sync program_type for DB compatibility
    if (updated.includes("Vaidika Poojas")) {
      updatePuja("program_type", "VAIDIKA_POOJA");
    } else if (updated.includes("Life Cycle Poojas")) {
      updatePuja("program_type", "LIFE_CYCLE_POOJA");
    }
  };

  const categoryOptions = useMemo(() => [...new Set(pujas.map(puja => puja.category_en))], [pujas]);

  useEffect(() => {
    setContactForm(contact);
  }, [contact]);

  useEffect(() => {
    if (settings) {
      setSettingsForm(settings);
    }
  }, [settings]);

  const runAdminAction = async (action: () => Promise<void>, successTitle: string) => {
    setIsSaving(true);
    const savingToast = toast({
      title: "Saving data to cloud...",
      description: "Please wait while we update the database.",
    });
    try {
      await action();
      savingToast.dismiss();
      toast({
        title: successTitle,
        description: "Updated successfully!",
      });
    } catch (error) {
      console.error("Admin action failed:", error);
      savingToast.dismiss();
      toast({
        variant: "destructive",
        title: "Admin update failed",
        description: error instanceof Error ? error.message : "Check Firebase auth and database rules.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card className="max-w-xl">
          <CardContent className="p-6 text-muted-foreground">Checking admin access...</CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdminEmail(user?.email)) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Sign in with the admin account {ADMIN_EMAIL} to manage pujas, pujaris, contact content, and join requests.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild><Link href="/login">Login</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const updatePuja = <K extends keyof PujaForm>(key: K, value: PujaForm[K]) => {
    setPujaForm(current => ({ ...current, [key]: value }));
  };

  const updatePujari = <K extends keyof PujariForm>(key: K, value: PujariForm[K]) => {
    setPujariForm(current => ({ ...current, [key]: value }));
  };

  const updateDeity = <K extends keyof DeityForm>(key: K, value: DeityForm[K]) => {
    setDeityForm(current => ({ ...current, [key]: value }));
  };

  const updateTemple = <K extends keyof TempleForm>(key: K, value: TempleForm[K]) => {
    setTempleForm(current => ({ ...current, [key]: value }));
  };

  const updateRegion = <K extends keyof RegionForm>(key: K, value: RegionForm[K]) => {
    setRegionForm(current => ({ ...current, [key]: value }));
  };

  const togglePujariPuja = (id: string | number) => {
    setPujariForm(current => ({
      ...current,
      pujas: current.pujas.includes(id) ? current.pujas.filter(pujaId => pujaId !== id) : [...current.pujas, id],
    }));
  };

  const saveCurrentPuja = () => {
    void runAdminAction(async () => {
      const savedPuja = pujaForm.id ? pujaForm : { ...pujaForm, id: nextId(pujas) };
      await savePuja(savedPuja);
      const projectedPujas = pujas.some(puja => puja.id === savedPuja.id) ? pujas : [...pujas, savedPuja];
      setPujaForm(emptyPuja(nextId(projectedPujas)));
    }, "Puja saved");
  };

  const handleGenerateImageWithAI = async () => {
    if (!pujaForm.name_en) {
      toast({
        variant: "destructive",
        title: "Name is required",
        description: "Please enter the English Name before generating an image.",
      });
      return;
    }

    setIsGeneratingImage(true);
    const generatingToast = toast({
      title: "Generating image with AI...",
      description: "Generating a custom ritual image. This may take up to 15 seconds.",
    });

    try {
      // 1. Try browser-side Hugging Face Generation first (bypasses server firewall block!)
      const hfKey = process.env.NEXT_PUBLIC_HF_API_KEY;
      if (hfKey) {
        const hfModels = [
          "black-forest-labs/FLUX.1-schnell",
          "stabilityai/stable-diffusion-xl-base-1.0",
          "CompVis/stable-diffusion-v1-4"
        ];
        
        let lastError = "";
        let success = false;
        let base64Image = "";

        const promptText = `An authentic, high-quality, professional photograph of a Hindu sacred ritual: ${pujaForm.name_en}. ${pujaForm.description || ""}. Featuring traditional elements like flowers, oil lamps (diyas), coconuts, mango leaves, and sacred vessels, beautifully arranged on a clean altar, with warm divine lighting and spiritual atmosphere. Detailed, respectful, saffron and gold tones, 4:3 aspect ratio.`;

        for (const hfModel of hfModels) {
          try {
            console.log(`Generating client-side image using Hugging Face (${hfModel})...`);
            const hfUrl = `https://api-inference.huggingface.co/models/${hfModel}`;
            
            let retries = 3;
            let hfResponse: Response | null = null;
            
            while (retries > 0) {
              hfResponse = await fetch(hfUrl, {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${hfKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ inputs: promptText }),
              });

              if (hfResponse.ok) {
                break;
              }

              const errorText = await hfResponse.text();
              
              if (hfResponse.status === 503 || errorText.includes("loading") || errorText.includes("estimated_time")) {
                let estimatedTime = 15;
                try {
                  const parsed = JSON.parse(errorText);
                  estimatedTime = Math.ceil(parsed.estimated_time || 15);
                } catch (e) {}
                
                console.log(`Model ${hfModel} is loading. Waiting ${estimatedTime} seconds...`);
                await new Promise(resolve => setTimeout(resolve, estimatedTime * 1000));
                retries--;
                continue;
              }
              
              throw new Error(`HF Error: ${errorText}`);
            }

            if (hfResponse && hfResponse.ok) {
              const blob = await hfResponse.blob();
              base64Image = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });
              success = true;
              break;
            }
          } catch (err) {
            console.warn(`Hugging Face client-side model ${hfModel} failed:`, err);
            lastError = err instanceof Error ? err.message : String(err);
          }
        }

        if (success && base64Image) {
          generatingToast.dismiss();
          updatePuja("image", base64Image);
          updatePuja("imageHint", `AI generated image for ${pujaForm.name_en}`);
          toast({
            title: "Image generated successfully!",
            description: "AI image has been generated in your browser and inserted as the program image.",
          });
          return;
        }
        console.warn("Client-side Hugging Face failed. Falling back to Server Action...", lastError);
      }

      // 2. Fall back to Server Action (Gemini Imagen)
      const res = await generatePujaImageAction(pujaForm.name_en, pujaForm.description);
      generatingToast.dismiss();
      if (res.success && res.image) {
        updatePuja("image", res.image);
        updatePuja("imageHint", `AI generated image for ${pujaForm.name_en}`);
        toast({
          title: "Image generated successfully!",
          description: "AI image has been inserted as the program image.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Generation failed",
          description: res.error || "Failed to generate image.",
        });
      }
    } catch (err) {
      generatingToast.dismiss();
      console.error("AI image generation error:", err);
      toast({
        variant: "destructive",
        title: "Error generating image",
        description: err instanceof Error ? err.message : "An unexpected error occurred.",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const saveCurrentPujari = () => {
    void runAdminAction(async () => {
      const savedPujari = {
        ...pujariForm,
        id: pujariForm.id || nextId(pujaris),
        verifiedAt: pujariForm.verified ? pujariForm.verifiedAt || new Date().toISOString().slice(0, 10) : "",
      };
      await savePujari(savedPujari);
      const projectedPujaris = pujaris.some(pujari => pujari.id === savedPujari.id) ? pujaris : [...pujaris, savedPujari];
      setPujariForm(emptyPujari(nextId(projectedPujaris), pujas.map(puja => puja.id)));
    }, "Pujari saved");
  };

  const saveCurrentDeity = () => {
    void runAdminAction(async () => {
      await saveDeity(deityForm);
      setDeityForm(emptyDeity());
    }, "Deity saved");
  };

  const saveCurrentTemple = () => {
    void runAdminAction(async () => {
      await saveTemple(templeForm);
      setTempleForm(emptyTemple());
    }, "Temple saved");
  };

  const saveCurrentRegion = () => {
    void runAdminAction(async () => {
      await saveRegion(regionForm);
      setRegionForm(emptyRegion());
    }, "Region saved");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-headline text-4xl text-primary">Admin Portal</h1>
          <p className="text-muted-foreground">Manage programs, pujaris, contact content, and onboarding requests.</p>
        </div>
        <Button variant="outline" onClick={() => void runAdminAction(resetContent, "Demo data reset")} disabled={isSaving}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Demo Data
        </Button>
      </div>

      <Tabs defaultValue="pujas" className="space-y-6">
        <TabsList className="h-auto flex flex-wrap justify-start">
          <TabsTrigger value="pujas"><FilePlus className="mr-2 h-4 w-4" />Pujas</TabsTrigger>
          <TabsTrigger value="pujaris"><BadgeCheck className="mr-2 h-4 w-4" />Pujaris</TabsTrigger>
          <TabsTrigger value="custom-requests"><Sparkles className="mr-2 h-4 w-4 text-primary" />Custom Requests ({customOrders.length})</TabsTrigger>
          <TabsTrigger value="regions"><Map className="mr-2 h-4 w-4" />Regions</TabsTrigger>
          <TabsTrigger value="temples"><Landmark className="mr-2 h-4 w-4" />Temples</TabsTrigger>
          <TabsTrigger value="deities"><BookOpen className="mr-2 h-4 w-4" />Deities</TabsTrigger>
          <TabsTrigger value="requests"><UserPlus className="mr-2 h-4 w-4" />Requests ({requests.length})</TabsTrigger>
          <TabsTrigger value="contact"><Contact className="mr-2 h-4 w-4" />Contact</TabsTrigger>
          <TabsTrigger value="settings"><Settings className="mr-2 h-4 w-4" />Global Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="custom-requests" className="space-y-6">
          <div className="space-y-4 max-w-4xl">
            {customOrders.length === 0 ? (
              <Card className="text-center p-8 bg-muted/10 border-dashed">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">No pending custom pooja requests found.</p>
                </CardContent>
              </Card>
            ) : (
              customOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden border-border bg-card shadow-md">
                  <CardHeader className="bg-muted/10 border-b py-3 px-5 flex flex-row items-center justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground">Order ID: {order.id.slice(0, 8)}...</span>
                      <h3 className="font-bold text-foreground text-lg leading-snug mt-0.5">
                        {order.interpreted_deity} {order.ritual_archetype}
                      </h3>
                    </div>
                    <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/30">Pending Review</Badge>
                  </CardHeader>
                  
                  <CardContent className="p-5 space-y-4 text-sm text-muted-foreground">
                    <div className="bg-secondary/20 p-3 rounded-lg border border-border/40 text-foreground">
                      <p className="font-medium text-xs text-muted-foreground mb-1">Raw Request:</p>
                      <p className="italic">"{order.raw_user_input}"</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-muted-foreground block">Client Details:</span>
                        <span className="font-semibold text-foreground">ID: {order.user_id.slice(0, 8)}...</span>
                        <span className="text-xs text-muted-foreground block">WhatsApp: {order.whatsapp_number}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">Timing & Location:</span>
                        <span className="font-semibold text-foreground">{order.preferred_date} @ {order.preferred_time}</span>
                        <span className="text-xs text-muted-foreground block">Address ({order.location_type}): {order.location_address || "Online"}</span>
                      </div>
                    </div>

                    {order.generated_materials && order.generated_materials.length > 0 && (
                      <div className="border-t pt-3 mt-3">
                        <span className="text-xs font-semibold text-foreground block mb-1">Parsed Materials:</span>
                        <p className="text-xs leading-relaxed">{order.generated_materials.join(", ")}</p>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="bg-muted/5 border-t py-4 px-5 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="flex-1 sm:w-48">
                        <Label htmlFor={`price-${order.id}`} className="sr-only">Quote Price</Label>
                        <Input
                          id={`price-${order.id}`}
                          type="number"
                          placeholder="Quote price in ₹"
                          value={priceQuotes[order.id] || ""}
                          onChange={(e) => setPriceQuotes(prev => ({ ...prev, [order.id]: e.target.value }))}
                          className="h-10 bg-background"
                        />
                      </div>
                      <Button
                        onClick={() => handleAssignPrice(order.id)}
                        disabled={pricingOrderId === order.id}
                        className="bg-primary text-black font-bold h-10 px-5"
                      >
                        {pricingOrderId === order.id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            <span>Pricing...</span>
                          </>
                        ) : (
                          <span>Submit Quote</span>
                        )}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="regions" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <div className="space-y-3 max-h-[80vh] overflow-y-auto pr-2">
              {regions.map(region => (
                <Card key={region.id}>
                  <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-lg">{region.name}</h3>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setRegionForm(region)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="destructive" size="sm" disabled={isSaving} onClick={() => window.confirm("Delete this region?") && void runAdminAction(() => deleteRegion(region.id), "Region deleted")}>
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>{regions.some(r => r.id === regionForm.id) ? "Edit Region" : "Add Region"}</CardTitle>
              </CardHeader>
              <CardContent>
                <fieldset disabled={isSaving} className="space-y-4">
                  <Field label="Region Name"><Input value={regionForm.name} onChange={event => updateRegion("name", event.target.value)} placeholder="e.g. Karnataka" /></Field>
                  <div className="flex gap-2 pt-2">
                    <Button onClick={saveCurrentRegion} disabled={isSaving}>
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                      Save Region
                    </Button>
                    <Button variant="outline" onClick={() => setRegionForm(emptyRegion())}>New</Button>
                  </div>
                </fieldset>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="temples" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <div className="space-y-3 max-h-[80vh] overflow-y-auto pr-2">
              {temples.map(temple => (
                <Card key={temple.id}>
                  <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
                    <ManagedImage src={temple.image} alt={temple.name} width={120} height={80} className="h-20 w-32 rounded-md object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{temple.name}</h3>
                        <Badge variant="secondary">{temple.state}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{temple.location}</p>
                      <p className="line-clamp-2 text-sm text-muted-foreground mt-1">{temple.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setTempleForm(temple)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="destructive" size="sm" disabled={isSaving} onClick={() => window.confirm("Delete this temple?") && void runAdminAction(() => deleteTemple(temple.id), "Temple deleted")}>
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>{temples.some(t => t.id === templeForm.id) ? "Edit Temple" : "Add Temple"}</CardTitle>
              </CardHeader>
              <CardContent>
                <fieldset disabled={isSaving} className="space-y-4 max-h-[70vh] overflow-y-auto px-1 pb-4">
                  <Field label="Temple Name"><Input value={templeForm.name} onChange={event => updateTemple("name", event.target.value)} /></Field>
                  <Field label="Region (State)">
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={templeForm.state}
                      onChange={e => updateTemple("state", e.target.value)}
                    >
                      <option value="">Select Region</option>
                      {regions.map(region => (
                        <option key={region.id} value={region.name}>{region.name}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Location / City"><Input value={templeForm.location} onChange={event => updateTemple("location", event.target.value)} /></Field>
                  
                  <Field label="Grid Image (Square/Landscape)">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async event => {
                        const file = event.target.files?.[0];
                        if (file) updateTemple("image", await readUploadedImage(file));
                      }}
                    />
                    {templeForm.image && <ManagedImage src={templeForm.image} alt="Temple preview" width={160} height={100} className="h-24 w-40 rounded-md object-cover mt-2" />}
                  </Field>

                  <Field label="Banner Image (Wide Header)">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async event => {
                        const file = event.target.files?.[0];
                        if (file) updateTemple("banner_image", await readUploadedImage(file));
                      }}
                    />
                    {templeForm.banner_image && <ManagedImage src={templeForm.banner_image} alt="Banner preview" width={320} height={100} className="h-20 w-full rounded-md object-cover mt-2" />}
                  </Field>

                  <Field label="Description / History"><Textarea rows={4} value={templeForm.description} onChange={event => updateTemple("description", event.target.value)} /></Field>
                  <Field label="Contact Details"><Textarea rows={2} value={templeForm.contact} onChange={event => updateTemple("contact", event.target.value)} /></Field>
                  <Field label="External Booking Link"><Input value={templeForm.booking_link} onChange={event => updateTemple("booking_link", event.target.value)} /></Field>
                  
                  <div className="flex gap-2 pt-2">
                    <Button onClick={saveCurrentTemple} disabled={isSaving}>
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                      Save Temple
                    </Button>
                    <Button variant="outline" onClick={() => setTempleForm(emptyTemple())}>New</Button>
                  </div>
                </fieldset>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pujas" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <div className="space-y-3">
              {pujas.map(puja => (
                <Card key={puja.id}>
                  <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
                    <ManagedImage src={puja.image} alt={puja.name_en} width={120} height={80} className="h-20 w-32 rounded-md object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{puja.name_en}</h3>
                        <Badge variant="secondary">{puja.category_en}</Badge>
                      </div>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{puja.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setPujaForm(puja)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="destructive" size="sm" disabled={isSaving} onClick={() => window.confirm("Delete this puja?") && void runAdminAction(() => deletePuja(puja.id), "Puja deleted")}>
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{pujas.some(puja => puja.id === pujaForm.id) ? "Edit Puja" : "Add Puja"}</CardTitle>
              </CardHeader>
              <CardContent>
                <fieldset disabled={isSaving || isGeneratingImage} className="space-y-4">
                  <Field label="English Name"><Input value={pujaForm.name_en} onChange={event => updatePuja("name_en", event.target.value)} /></Field>
                  <Field label="Telugu Name"><Input value={pujaForm.name} onChange={event => updatePuja("name", event.target.value)} /></Field>
                  <Field label="English Description"><Textarea value={pujaForm.description} onChange={event => updatePuja("description", event.target.value)} /></Field>
                  <Field label="Telugu Description"><Textarea value={pujaForm.description_te} onChange={event => updatePuja("description_te", event.target.value)} /></Field>
                  
                  <Field label="Visibility / Categories">
                    <div className="grid grid-cols-2 gap-2.5 mt-1 border border-border/40 p-3 rounded-lg bg-muted/10">
                      {[...allCategoriesList, "All Programs"].map(cat => (
                        <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer select-none py-1">
                          <Checkbox
                            checked={(pujaForm.categories || []).includes(cat)}
                            onCheckedChange={() => toggleCategoryTag(cat)}
                          />
                          <span className={cat === "All Programs" ? "font-bold text-primary" : ""}>{cat}</span>
                        </label>
                      ))}
                    </div>
                  </Field>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Field label="Sub-Category (English)">
                      <Input list="puja-categories" value={pujaForm.category_en} onChange={event => updatePuja("category_en", event.target.value as Puja["category_en"])} />
                      <datalist id="puja-categories">{categoryOptions.map(category => <option key={category} value={category} />)}</datalist>
                    </Field>
                    <Field label="Sub-Category (Telugu)"><Input value={pujaForm.category} onChange={event => updatePuja("category", event.target.value as Puja["category"])} /></Field>
                  </div>

                  <Field label="Pooja Vidhanam PDF Link / URL">
                    <Input
                      placeholder="https://example.com/pooja-vidhanam.pdf"
                      value={pujaForm.pdf_url || ""}
                      onChange={e => updatePuja("pdf_url", e.target.value)}
                    />
                  </Field>

                  <Field label="Required Samagri Items (Compulsory)">
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g. Pasupu (Turmeric)"
                        value={newRequiredItem}
                        onChange={e => setNewRequiredItem(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addRequiredItem())}
                      />
                      <Button type="button" variant="secondary" onClick={addRequiredItem}><Plus className="h-4 w-4" /></Button>
                    </div>
                    {(pujaForm.required_items || []).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto border border-border/40 p-2 rounded-md bg-muted/10">
                        {(pujaForm.required_items || []).map(item => (
                          <Badge key={item} variant="outline" className="gap-1 text-xs py-0.5 px-2">
                            {item}
                            <X className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => removeRequiredItem(item)} />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </Field>

                  <Field label="Associated Slokas & Stotrams">
                    <div className="space-y-2 border border-border/40 p-3 rounded-lg bg-muted/10">
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Sloka Title"
                          value={newSlokaName}
                          onChange={e => setNewSlokaName(e.target.value)}
                        />
                        <Input
                          placeholder="Relative link (e.g. /readings/ganapati)"
                          value={newSlokaLink}
                          onChange={e => setNewSlokaLink(e.target.value)}
                        />
                      </div>
                      <Button type="button" size="sm" className="w-full text-xs" variant="outline" onClick={addSlokaTag}>
                        <Plus className="mr-1 h-3.5 w-3.5" /> Add Sloka Tag
                      </Button>
                    </div>
                    {(pujaForm.sloka_tags || []).length > 0 && (
                      <div className="mt-2 space-y-1.5 max-h-28 overflow-y-auto border border-border/40 p-2 rounded-md bg-card">
                        {(pujaForm.sloka_tags || []).map((sloka, index) => (
                          <div key={index} className="flex items-center justify-between text-xs border-b border-border/30 pb-1 last:border-b-0">
                            <span className="font-semibold text-primary truncate max-w-[150px]">{sloka.name}</span>
                            <span className="text-muted-foreground truncate max-w-[150px] italic">{sloka.link}</span>
                            <X className="h-3.5 w-3.5 cursor-pointer text-red-500 hover:text-red-700 ml-2" onClick={() => removeSlokaTag(index)} />
                          </div>
                        ))}
                      </div>
                    )}
                  </Field>

                  <Field label="Program Image">
                    <div className="flex flex-col gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={async event => {
                          const file = event.target.files?.[0];
                          if (file) {
                            updatePuja("image", await readUploadedImage(file));
                            updatePuja("imageHint", file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="bg-primary/10 border-primary/20 hover:bg-primary/20 text-primary gap-2"
                        onClick={handleGenerateImageWithAI}
                        disabled={isGeneratingImage || isSaving}
                      >
                        {isGeneratingImage ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Generating Image with AI...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            Generate appropriate image with AI
                          </>
                        )}
                      </Button>
                    </div>
                    {pujaForm.image && <ManagedImage src={pujaForm.image} alt="Program preview" width={160} height={100} className="h-24 w-40 rounded-md object-cover mt-2" />}
                  </Field>
                  
                  <Field label="Image Hint"><Input value={pujaForm.imageHint} onChange={event => updatePuja("imageHint", event.target.value)} /></Field>
                  
                  <div className="flex gap-2 pt-2">
                    <Button onClick={saveCurrentPuja} disabled={isSaving || isGeneratingImage}>
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                      Save Puja
                    </Button>
                    <Button variant="outline" onClick={() => setPujaForm(emptyPuja(nextId(pujas)))} disabled={isSaving || isGeneratingImage}>New</Button>
                  </div>
                </fieldset>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pujaris" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_460px]">
            <div className="space-y-3">
              {pujaris.map(pujari => (
                <Card key={pujari.id}>
                  <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
                    <ManagedImage src={pujari.photo} alt={pujari.name} width={96} height={96} className="h-24 w-24 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{pujari.name}</h3>
                        {pujari.verified && <Badge className="gap-1 bg-primary/15 text-primary hover:bg-primary/15"><BadgeCheck className="h-3.5 w-3.5" />Verified</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{pujari.experience} years • Rs. {pujari.basePrice.toLocaleString()} • {pujari.languages.join(", ")}</p>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{pujari.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setPujariForm(pujari)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="destructive" size="sm" disabled={isSaving} onClick={() => window.confirm("Delete this pujari?") && void runAdminAction(() => deletePujari(pujari.id), "Pujari deleted")}>
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{pujaris.some(pujari => pujari.id === pujariForm.id) ? "Edit Pujari" : "Add Pujari"}</CardTitle>
              </CardHeader>
              <CardContent>
                <fieldset disabled={isSaving} className="space-y-4">
                  <Field label="Name"><Input value={pujariForm.name} onChange={event => updatePujari("name", event.target.value)} /></Field>
                  <Field label="Profile Image">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async event => {
                        const file = event.target.files?.[0];
                        if (file) {
                          updatePujari("photo", await readUploadedImage(file));
                          updatePujari("photoHint", file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
                        }
                      }}
                    />
                    {pujariForm.photo && <ManagedImage src={pujariForm.photo} alt="Pujari preview" width={112} height={112} className="h-28 w-28 rounded-full object-cover" />}
                  </Field>
                  <Field label="Phone"><Input value={pujariForm.phone} onChange={event => updatePujari("phone", event.target.value)} /></Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Base Price"><Input type="number" value={pujariForm.basePrice} onChange={event => updatePujari("basePrice", Number(event.target.value))} /></Field>
                    <Field label="Experience"><Input type="number" value={pujariForm.experience} onChange={event => updatePujari("experience", Number(event.target.value))} /></Field>
                    <Field label="Rating"><Input type="number" step="0.1" value={pujariForm.rating} onChange={event => updatePujari("rating", Number(event.target.value))} /></Field>
                  </div>
                  <Field label="Languages"><Input value={toCsv(pujariForm.languages)} onChange={event => updatePujari("languages", fromCsv(event.target.value))} /></Field>
                  <Field label="Qualifications"><Input value={toCsv(pujariForm.qualifications)} onChange={event => updatePujari("qualifications", fromCsv(event.target.value))} /></Field>
                  <Field label="Description"><Textarea value={pujariForm.description} onChange={event => updatePujari("description", event.target.value)} /></Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Latitude"><Input type="number" value={pujariForm.location.lat} onChange={event => updatePujari("location", { ...pujariForm.location, lat: Number(event.target.value) })} /></Field>
                    <Field label="Longitude"><Input type="number" value={pujariForm.location.lng} onChange={event => updatePujari("location", { ...pujariForm.location, lng: Number(event.target.value) })} /></Field>
                  </div>
                  <div className="space-y-2">
                    <Label>Programs Offered</Label>
                    <div className="max-h-52 overflow-auto rounded-md border p-3">
                      {pujas.map(puja => (
                        <label key={puja.id} className="flex items-center gap-2 py-1 text-sm">
                          <Checkbox checked={pujariForm.pujas.includes(puja.id)} onCheckedChange={() => togglePujariPuja(puja.id)} />
                          {puja.name_en}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-md border p-3 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <Label htmlFor="verified">Verified by organisation</Label>
                      <Switch id="verified" checked={!!pujariForm.verified} onCheckedChange={checked => updatePujari("verified", checked)} />
                    </div>
                    <Field label="Verified By"><Input value={pujariForm.verifiedBy || ""} onChange={event => updatePujari("verifiedBy", event.target.value)} /></Field>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveCurrentPujari} disabled={isSaving}>
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                      Save Pujari
                    </Button>
                    <Button variant="outline" onClick={() => setPujariForm(emptyPujari(nextId(pujaris), pujas.map(puja => puja.id)))}>New</Button>
                  </div>
                </fieldset>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deities" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <div className="space-y-3">
              {deities.map(deity => (
                <Card key={deity.id}>
                  <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
                    <ManagedImage src={deity.imageUrl || ""} alt={deity.nameEn} width={80} height={80} className="h-20 w-20 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{deity.nameEn}</h3>
                        <Badge variant="secondary">{deity.gender}</Badge>
                      </div>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{deity.name}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setDeityForm(deity)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="destructive" size="sm" disabled={isSaving} onClick={() => window.confirm("Delete this deity?") && void runAdminAction(() => deleteDeity(deity.id), "Deity deleted")}>
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{deities.some(d => d.id === deityForm.id) ? "Edit Deity" : "Add Deity"}</CardTitle>
              </CardHeader>
              <CardContent>
                <fieldset disabled={isSaving} className="space-y-4">
                  <Field label="ID"><Input value={deityForm.id} disabled={deities.some(d => d.id === deityForm.id)} onChange={event => updateDeity("id", event.target.value)} /></Field>
                  <Field label="English Name"><Input value={deityForm.nameEn} onChange={event => updateDeity("nameEn", event.target.value)} /></Field>
                  <Field label="Telugu Name"><Input value={deityForm.name} onChange={event => updateDeity("name", event.target.value)} /></Field>
                  <div className="flex items-center gap-4">
                    <Label>Gender</Label>
                    <div className="flex gap-2">
                      <label className="flex items-center gap-1"><input type="radio" checked={deityForm.gender === "male"} onChange={() => updateDeity("gender", "male")} /> Male</label>
                      <label className="flex items-center gap-1"><input type="radio" checked={deityForm.gender === "female"} onChange={() => updateDeity("gender", "female")} /> Female</label>
                    </div>
                  </div>
                  <Field label="Image">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async event => {
                        const file = event.target.files?.[0];
                        if (file) {
                          updateDeity("imageUrl", await readUploadedImage(file));
                          updateDeity("imageHint", file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
                        }
                      }}
                    />
                    {deityForm.imageUrl && <ManagedImage src={deityForm.imageUrl} alt="Deity preview" width={96} height={96} className="mt-2 h-24 w-24 rounded-full object-cover" />}
                  </Field>
                  <Field label="Image Hint"><Input value={deityForm.imageHint} onChange={event => updateDeity("imageHint", event.target.value)} /></Field>
                  <Field label="Ashtotharam URL"><Input value={deityForm.ashtotharamUrl} onChange={event => updateDeity("ashtotharamUrl", event.target.value)} /></Field>
                  <Field label="Sahasranamam URL"><Input value={deityForm.sahasranamamUrl} onChange={event => updateDeity("sahasranamamUrl", event.target.value)} /></Field>
                  <Field label="Reading Slug"><Input value={deityForm.readingSlug} onChange={event => updateDeity("readingSlug", event.target.value)} /></Field>
                  <div className="flex gap-2">
                    <Button onClick={saveCurrentDeity} disabled={isSaving}>
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                      Save Deity
                    </Button>
                    <Button variant="outline" onClick={() => setDeityForm(emptyDeity())}>New</Button>
                  </div>
                </fieldset>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          {requests.length === 0 ? (
            <Card><CardContent className="p-6 text-muted-foreground">No pending pujari requests.</CardContent></Card>
          ) : requests.map(request => (
            <Card key={request.id}>
              <CardContent className="grid gap-4 p-4 md:grid-cols-[120px_1fr_auto]">
                <ManagedImage src={request.photo} alt={request.name} width={120} height={120} className="h-28 w-28 rounded-md object-cover" />
                <div>
                  <h3 className="font-semibold">{request.name}</h3>
                  <p className="text-sm text-muted-foreground">{request.city} • Phone: {request.phone} • WhatsApp: {request.whatsapp || request.phone} • {request.email}</p>
                  
                  <div className="mt-2 flex flex-wrap gap-2 mb-2">
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                      📍 Lat: {request.lat?.toFixed(6) ?? "N/A"}, Lng: {request.lng?.toFixed(6) ?? "N/A"}
                    </span>
                    <span className="text-xs font-semibold text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 flex items-center gap-1">
                      ⏰ Available Timings: {request.availableTimings ?? "Morning Slot, Evening Slot"}
                    </span>
                  </div>

                  <p className="mt-2 text-sm">{request.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {request.qualifications.map(item => <Badge key={item} variant="outline">{item}</Badge>)}
                    {request.languages.map(item => <Badge key={item} variant="secondary">{item}</Badge>)}
                  </div>
                </div>
                <div className="flex gap-2 md:flex-col">
                  <Button disabled={isSaving} onClick={() => void runAdminAction(() => approveJoinRequest(request.id), "Request approved")}><Check className="mr-2 h-4 w-4" />Add</Button>
                  <Button variant="outline" disabled={isSaving} onClick={() => void runAdminAction(() => rejectJoinRequest(request.id), "Request rejected")}><X className="mr-2 h-4 w-4" />Reject</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="contact">
          <Card className="max-w-3xl">
            <CardHeader><CardTitle>Edit Contact Page</CardTitle></CardHeader>
            <CardContent>
              <fieldset disabled={isSaving} className="space-y-4">
                <Field label="Title"><Input value={contactForm.title} onChange={event => setContactForm(current => ({ ...current, title: event.target.value }))} /></Field>
                <Field label="Subtitle"><Textarea value={contactForm.subtitle} onChange={event => setContactForm(current => ({ ...current, subtitle: event.target.value }))} /></Field>
                <Field label="Phone"><Input value={contactForm.phone} onChange={event => setContactForm(current => ({ ...current, phone: event.target.value }))} /></Field>
                <Field label="Email"><Input value={contactForm.email} onChange={event => setContactForm(current => ({ ...current, email: event.target.value }))} /></Field>
                <Field label="Address"><Textarea value={contactForm.address} onChange={event => setContactForm(current => ({ ...current, address: event.target.value }))} /></Field>
                <Field label="Hours"><Input value={contactForm.hours} onChange={event => setContactForm(current => ({ ...current, hours: event.target.value }))} /></Field>
                <Field label="WhatsApp"><Input value={contactForm.whatsapp} onChange={event => setContactForm(current => ({ ...current, whatsapp: event.target.value }))} /></Field>
                <Field label="Map URL"><Input value={contactForm.mapUrl} onChange={event => setContactForm(current => ({ ...current, mapUrl: event.target.value }))} /></Field>
                <Button disabled={isSaving} onClick={() => void runAdminAction(() => saveContact(contactForm), "Contact page saved")}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save Contact Page
                </Button>
              </fieldset>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="max-w-3xl">
            <CardHeader><CardTitle>Global Webpage Content Settings</CardTitle></CardHeader>
            <CardContent>
              <fieldset disabled={isSaving} className="space-y-4">
                <Field label="Landing Page Main Heading (English)">
                  <Input
                    value={settingsForm.landingTitleEn || ""}
                    onChange={event => setSettingsForm(current => ({ ...current, landingTitleEn: event.target.value }))}
                  />
                </Field>
                <Field label="Landing Page Main Heading (Telugu)">
                  <Input
                    className="font-telugu"
                    value={settingsForm.landingTitleTe || ""}
                    onChange={event => setSettingsForm(current => ({ ...current, landingTitleTe: event.target.value }))}
                  />
                </Field>
                <Field label="Landing Page Subtext (English)">
                  <Textarea
                    value={settingsForm.landingSubtitleEn || ""}
                    onChange={event => setSettingsForm(current => ({ ...current, landingSubtitleEn: event.target.value }))}
                  />
                </Field>
                <Field label="Landing Page Subtext (Telugu)">
                  <Textarea
                    className="font-telugu"
                    value={settingsForm.landingSubtitleTe || ""}
                    onChange={event => setSettingsForm(current => ({ ...current, landingSubtitleTe: event.target.value }))}
                  />
                </Field>
                <Button disabled={isSaving} onClick={() => void runAdminAction(() => saveSettings(settingsForm), "Global settings saved")}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save Global Settings
                </Button>
              </fieldset>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
