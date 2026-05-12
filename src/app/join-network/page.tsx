"use client";

import { FormEvent, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useContent } from "@/lib/content-store";
import { Send } from "lucide-react";
import { ManagedImage } from "@/components/common/ManagedImage";

const defaultPhoto = "https://images.unsplash.com/photo-1570839753356-6bc05ceea49a?auto=format&fit=crop&w=1200&q=80";

export default function JoinNetworkPage() {
  const { pujas, submitJoinRequest } = useContent();
  const { toast } = useToast();
  const [selectedPujas, setSelectedPujas] = useState<number[]>([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    photo: "",
    qualifications: "",
    languages: "Telugu, Sanskrit",
    experience: "1",
    basePrice: "5000",
    description: "",
  });

  const update = (key: keyof typeof form, value: string) => {
    setForm(current => ({ ...current, [key]: value }));
  };

  const readUploadedImage = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const togglePuja = (id: number) => {
    setSelectedPujas(current => current.includes(id) ? current.filter(pujaId => pujaId !== id) : [...current, id]);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await submitJoinRequest({
        name: form.name,
        phone: form.phone,
        email: form.email,
        city: form.city,
        photo: form.photo || defaultPhoto,
        qualifications: csv(form.qualifications),
        languages: csv(form.languages),
        experience: Number(form.experience),
        basePrice: Number(form.basePrice),
        maxParticipants: 50,
        pujas: selectedPujas,
        description: form.description,
      });
      setForm({
        name: "",
        phone: "",
        email: "",
        city: "",
        photo: "",
        qualifications: "",
        languages: "Telugu, Sanskrit",
        experience: "1",
        basePrice: "5000",
        description: "",
      });
      setSelectedPujas([]);
      toast({
        title: "Request submitted",
        description: "Your profile is now pending review in the admin requests section.",
      });
    } catch (error) {
      console.error("Join request submission failed:", error);
      toast({
        variant: "destructive",
        title: "Request not submitted",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 max-w-3xl">
        <h1 className="font-headline text-4xl text-primary">Join the VaidikaConnect Network</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Submit your priest profile for review. Approved requests are added to the verified pujari network by the organisation.
        </p>
      </div>

      <Card className="max-w-5xl">
        <CardHeader>
          <CardTitle>Pujari Application</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-5 md:grid-cols-2">
            <Field label="Full Name"><Input required value={form.name} onChange={event => update("name", event.target.value)} /></Field>
            <Field label="Phone"><Input required value={form.phone} onChange={event => update("phone", event.target.value)} /></Field>
            <Field label="Email"><Input required type="email" value={form.email} onChange={event => update("email", event.target.value)} /></Field>
            <Field label="City"><Input required value={form.city} onChange={event => update("city", event.target.value)} /></Field>
            <Field label="Profile Image">
              <Input
                type="file"
                accept="image/*"
                onChange={async event => {
                  const file = event.target.files?.[0];
                  if (file) {
                    update("photo", await readUploadedImage(file));
                  }
                }}
              />
              {form.photo && <ManagedImage src={form.photo} alt="Profile preview" width={112} height={112} className="h-28 w-28 rounded-full object-cover" />}
            </Field>
            <Field label="Languages"><Input value={form.languages} onChange={event => update("languages", event.target.value)} /></Field>
            <Field label="Qualifications"><Input placeholder="Veda Praveena, Jyotisha Acharya" value={form.qualifications} onChange={event => update("qualifications", event.target.value)} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Experience"><Input required type="number" min="0" value={form.experience} onChange={event => update("experience", event.target.value)} /></Field>
              <Field label="Base Price"><Input required type="number" min="0" value={form.basePrice} onChange={event => update("basePrice", event.target.value)} /></Field>
            </div>
            <div className="md:col-span-2">
              <Field label="About Your Practice">
                <Textarea required value={form.description} onChange={event => update("description", event.target.value)} />
              </Field>
            </div>
            <div className="space-y-3 md:col-span-2">
              <Label>Programs You Can Perform</Label>
              <div className="grid max-h-72 gap-2 overflow-auto rounded-md border p-4 sm:grid-cols-2 lg:grid-cols-3">
                {pujas.map(puja => (
                  <label key={puja.id} className="flex items-center gap-2 text-sm">
                    <Checkbox checked={selectedPujas.includes(puja.id)} onCheckedChange={() => togglePuja(puja.id)} />
                    {puja.name_en}
                  </label>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedPujas.map(id => {
                  const puja = pujas.find(item => item.id === id);
                  return puja ? <Badge key={id} variant="secondary">{puja.name_en}</Badge> : null;
                })}
              </div>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={selectedPujas.length === 0}>
                <Send className="mr-2 h-4 w-4" />
                Submit for Review
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
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

function csv(value: string) {
  return value.split(",").map(item => item.trim()).filter(Boolean);
}
