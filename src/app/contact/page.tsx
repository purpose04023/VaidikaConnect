"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useContent } from "@/lib/content-store";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

export default function ContactPage() {
  const { contact } = useContent();

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 max-w-3xl">
        <h1 className="font-headline text-4xl text-primary">{contact.title}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{contact.subtitle}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="space-y-5 p-6">
            <ContactRow icon={<Phone className="h-5 w-5" />} label="Phone" value={contact.phone} href={`tel:${contact.phone}`} />
            <ContactRow icon={<Mail className="h-5 w-5" />} label="Email" value={contact.email} href={`mailto:${contact.email}`} />
            <ContactRow icon={<MapPin className="h-5 w-5" />} label="Address" value={contact.address} href={contact.mapUrl} />
            <ContactRow icon={<Clock className="h-5 w-5" />} label="Hours" value={contact.hours} />
          </CardContent>
        </Card>

        <div className="flex min-h-[280px] flex-col justify-center rounded-md border bg-accent/10 p-6">
          <h2 className="font-headline text-2xl text-primary">Need help planning a ceremony?</h2>
          <p className="mt-3 text-muted-foreground">
            Share your puja, date, participant count, and location. Our team can help match you with a verified pujari.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`tel:${contact.phone}`}><Phone className="mr-2 h-4 w-4" />Call</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}><MessageCircle className="mr-2 h-4 w-4" />WhatsApp</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );

  return (
    <div className="flex gap-3">
      <div className="mt-1 text-primary">{icon}</div>
      {href ? <Link className="hover:text-primary" href={href}>{content}</Link> : content}
    </div>
  );
}
