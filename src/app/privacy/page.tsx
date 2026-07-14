import React from "react";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - VaidikaConnect",
  description: "Learn how VaidikaConnect securely collects, handles, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
          <Shield className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          Last Updated: July 13, 2026. Learn how we care for your personal and ritual-related data.
        </p>
      </div>

      <div className="prose prose-amber dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
        <section className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-3">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Eye className="h-5 w-5 text-amber-500" />
            1. Information We Collect
          </h2>
          <p>
            VaidikaConnect collects personal information to provide you with high-quality ritual coordination services:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Account Profile:</strong> Name, email address, password, contact details, and location details.</li>
            <li><strong>Ritual Inputs:</strong> Description of the custom ceremonies, deity preferences, preferred timings, and additional notes you supply when submitting custom requests.</li>
            <li><strong>Pujari Information:</strong> For Pujaris in our network, we collect experience details, photos, base prices, specializations, qualifications, and WhatsApp contacts.</li>
          </ul>
        </section>

        <section className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-3">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Lock className="h-5 w-5 text-amber-500" />
            2. How We Secure Your Data
          </h2>
          <p>
            We implement industry-standard database security protocols, including Row Level Security (RLS) policies on Supabase, to restrict data access:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your personal ritual requests are only visible to yourself and authorized administrators.</li>
            <li>We utilize secure encrypted channels for database connections and password hashing.</li>
            <li>WhatsApp details are never exposed publicly and are only shared with the specific Pandit assigned to your booked ceremony.</li>
          </ul>
        </section>

        <section className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-3">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-500" />
            3. Sharing and Disclosures
          </h2>
          <p>
            We do not sell or lease your personal information to third parties. We share details solely to facilitate the booking:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>With Assigned Pujaris:</strong> To ensure the Pandit can locate and prepare for the ceremony, your name, description, date, location, and WhatsApp number are shared once the booking is confirmed.</li>
            <li><strong>Compliance:</strong> We may share information under legal obligations to prevent fraud or secure our services.</li>
          </ul>
        </section>

        <section className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-3">
          <h2 className="text-xl font-bold text-foreground">
            4. Cookie Settings & Preferences
          </h2>
          <p>
            We use temporary browser session cookies to maintain your login status, language preference settings (Telugu/English), and local client-side caches. Disabling cookies in your browser settings may limit certain functionalities of the website.
          </p>
        </section>

        <div className="text-center text-xs text-muted-foreground pt-6">
          If you have questions about your privacy rights, please contact us at support@vaidikaconnect.com.
        </div>
      </div>
    </div>
  );
}
