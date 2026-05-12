"use client";

import { useEffect, useMemo, useState } from "react";
import type { Puja, Pujari } from "@/lib/data";
import { useContent, type ContactContent } from "@/lib/content-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { BadgeCheck, Check, Contact, FilePlus, Pencil, Plus, RotateCcw, Trash2, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/firebase";
import { ADMIN_EMAIL, isAdminEmail } from "@/lib/admin";
import { ManagedImage } from "@/components/common/ManagedImage";
import { useToast } from "@/hooks/use-toast";

type PujaForm = Puja;
type PujariForm = Pujari;

const emptyPuja = (nextId: number): PujaForm => ({
  id: nextId,
  name: "",
  name_en: "",
  description: "",
  description_te: "",
  image: "https://images.unsplash.com/photo-1644233771847-adbb3b5aa580?auto=format&fit=crop&w=1200&q=80",
  imageHint: "puja ritual",
  category: "" as Puja["category"],
  category_en: "Pujas",
});

const emptyPujari = (nextId: number, pujaIds: number[]): PujariForm => ({
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

function nextId(items: { id: number }[]) {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

function readUploadedImage(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const {
    pujas,
    pujaris,
    requests,
    contact,
    savePuja,
    deletePuja,
    savePujari,
    deletePujari,
    saveContact,
    approveJoinRequest,
    rejectJoinRequest,
    resetContent,
  } = useContent();
  const [pujaForm, setPujaForm] = useState<PujaForm>(() => emptyPuja(nextId(pujas)));
  const [pujariForm, setPujariForm] = useState<PujariForm>(() => emptyPujari(nextId(pujaris), pujas.map(puja => puja.id)));
  const [contactForm, setContactForm] = useState<ContactContent>(contact);
  const [isSaving, setIsSaving] = useState(false);

  const categoryOptions = useMemo(() => [...new Set(pujas.map(puja => puja.category_en))], [pujas]);

  useEffect(() => {
    setContactForm(contact);
  }, [contact]);

  const runAdminAction = async (action: () => Promise<void>, successTitle: string) => {
    setIsSaving(true);
    try {
      await action();
      toast({ title: successTitle, description: "Changes were saved to the shared database." });
    } catch (error) {
      console.error("Admin action failed:", error);
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

  const togglePujariPuja = (id: number) => {
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
          <TabsTrigger value="requests"><UserPlus className="mr-2 h-4 w-4" />Requests ({requests.length})</TabsTrigger>
          <TabsTrigger value="contact"><Contact className="mr-2 h-4 w-4" />Contact</TabsTrigger>
        </TabsList>

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
                      <Button variant="destructive" size="sm" disabled={isSaving} onClick={() => window.confirm("Delete this puja?") && void runAdminAction(() => deletePuja(puja.id), "Puja deleted")}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{pujas.some(puja => puja.id === pujaForm.id) ? "Edit Puja" : "Add Puja"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field label="English Name"><Input value={pujaForm.name_en} onChange={event => updatePuja("name_en", event.target.value)} /></Field>
                <Field label="Telugu Name"><Input value={pujaForm.name} onChange={event => updatePuja("name", event.target.value)} /></Field>
                <Field label="Category">
                  <Input list="puja-categories" value={pujaForm.category_en} onChange={event => updatePuja("category_en", event.target.value as Puja["category_en"])} />
                  <datalist id="puja-categories">{categoryOptions.map(category => <option key={category} value={category} />)}</datalist>
                </Field>
                <Field label="Telugu Category"><Input value={pujaForm.category} onChange={event => updatePuja("category", event.target.value as Puja["category"])} /></Field>
                <Field label="Program Image">
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
                  {pujaForm.image && <ManagedImage src={pujaForm.image} alt="Program preview" width={160} height={100} className="h-24 w-40 rounded-md object-cover" />}
                </Field>
                <Field label="Image Hint"><Input value={pujaForm.imageHint} onChange={event => updatePuja("imageHint", event.target.value)} /></Field>
                <Field label="English Description"><Textarea value={pujaForm.description} onChange={event => updatePuja("description", event.target.value)} /></Field>
                <Field label="Telugu Description"><Textarea value={pujaForm.description_te} onChange={event => updatePuja("description_te", event.target.value)} /></Field>
                <div className="flex gap-2">
                  <Button onClick={saveCurrentPuja} disabled={isSaving}><Plus className="mr-2 h-4 w-4" />Save Puja</Button>
                  <Button variant="outline" onClick={() => setPujaForm(emptyPuja(nextId(pujas)))}>New</Button>
                </div>
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
                      <Button variant="destructive" size="sm" disabled={isSaving} onClick={() => window.confirm("Delete this pujari?") && void runAdminAction(() => deletePujari(pujari.id), "Pujari deleted")}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{pujaris.some(pujari => pujari.id === pujariForm.id) ? "Edit Pujari" : "Add Pujari"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <Button onClick={saveCurrentPujari} disabled={isSaving}><Plus className="mr-2 h-4 w-4" />Save Pujari</Button>
                  <Button variant="outline" onClick={() => setPujariForm(emptyPujari(nextId(pujaris), pujas.map(puja => puja.id)))}>New</Button>
                </div>
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
                  <p className="text-sm text-muted-foreground">{request.city} • {request.phone} • {request.email}</p>
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
            <CardContent className="space-y-4">
              <Field label="Title"><Input value={contactForm.title} onChange={event => setContactForm(current => ({ ...current, title: event.target.value }))} /></Field>
              <Field label="Subtitle"><Textarea value={contactForm.subtitle} onChange={event => setContactForm(current => ({ ...current, subtitle: event.target.value }))} /></Field>
              <Field label="Phone"><Input value={contactForm.phone} onChange={event => setContactForm(current => ({ ...current, phone: event.target.value }))} /></Field>
              <Field label="Email"><Input value={contactForm.email} onChange={event => setContactForm(current => ({ ...current, email: event.target.value }))} /></Field>
              <Field label="Address"><Textarea value={contactForm.address} onChange={event => setContactForm(current => ({ ...current, address: event.target.value }))} /></Field>
              <Field label="Hours"><Input value={contactForm.hours} onChange={event => setContactForm(current => ({ ...current, hours: event.target.value }))} /></Field>
              <Field label="WhatsApp"><Input value={contactForm.whatsapp} onChange={event => setContactForm(current => ({ ...current, whatsapp: event.target.value }))} /></Field>
              <Field label="Map URL"><Input value={contactForm.mapUrl} onChange={event => setContactForm(current => ({ ...current, mapUrl: event.target.value }))} /></Field>
              <Button disabled={isSaving} onClick={() => void runAdminAction(() => saveContact(contactForm), "Contact page saved")}>Save Contact Page</Button>
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
