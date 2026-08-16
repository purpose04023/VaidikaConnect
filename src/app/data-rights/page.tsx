"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, CheckCircle, AlertCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

// Data-rights request form — DPDP Act §11–14 (access, correction, erasure, nomination)
// LAWYER-REVIEW-REQUIRED: confirm exact fields required under final DPDP Rules.

export default function DataRightsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const data = {
      full_name: (form.elements.namedItem("full_name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      request_type: (form.elements.namedItem("request_type") as HTMLSelectElement).value,
      details: (form.elements.namedItem("details") as HTMLTextAreaElement).value,
      submitted_at: new Date().toISOString(),
    };

    try {
      const supabase = createClient();
      const { error: dbError } = await supabase.from("data_rights_requests").insert([data]);
      if (dbError) throw dbError;
      setSubmitted(true);
    } catch (err: any) {
      // ponytail: fallback — if table doesn't exist yet, still acknowledge receipt by email
      setError(
        "We could not save your request automatically. Please email privacy@vaidikaconnect.com with your details. We apologise for the inconvenience."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 md:py-16">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
          <FileText className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Data Rights Request
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Exercise your rights under the{" "}
          <strong>Digital Personal Data Protection Act, 2023</strong> — access, correct,
          erase your data, or withdraw consent.
        </p>
      </div>

      {submitted ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-400/40 rounded-2xl p-8 text-center space-y-3">
          <CheckCircle className="h-10 w-10 text-green-600 mx-auto" />
          <h2 className="font-bold text-foreground text-lg">Request Received</h2>
          <p className="text-muted-foreground text-sm">
            We have logged your request and will respond within <strong>30 days</strong>
            {" "}to the email address you provided. Our Grievance Officer will contact you if
            we need additional verification.
          </p>
          <p className="text-xs text-muted-foreground">
            Reference ID: {Date.now()}-DPDP
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-2xl p-6 space-y-5 shadow-sm"
        >
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground" htmlFor="full_name">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input id="full_name" name="full_name" placeholder="As registered on your account" required />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground" htmlFor="email">
              Email Address <span className="text-red-500">*</span>
            </label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground" htmlFor="phone">
              Phone / WhatsApp (optional)
            </label>
            <Input id="phone" name="phone" placeholder="For identity verification if needed" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground" htmlFor="request_type">
              Request Type <span className="text-red-500">*</span>
            </label>
            <Select name="request_type" required>
              <SelectTrigger>
                <SelectValue placeholder="Select your request type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="access">Access — what data do you hold about me?</SelectItem>
                <SelectItem value="correction">Correction — fix inaccurate/incomplete data</SelectItem>
                <SelectItem value="erasure">Erasure — delete my personal data</SelectItem>
                <SelectItem value="withdraw_consent">Withdraw Consent</SelectItem>
                <SelectItem value="nominate">Nomination — authorise another person</SelectItem>
                <SelectItem value="grievance">Grievance / Complaint</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground" htmlFor="details">
              Details <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="details"
              name="details"
              placeholder="Describe your request in detail. For erasure, specify which data; for correction, state the correct value."
              rows={4}
              required
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-300 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            We may ask you to verify your identity before processing your request. We will
            respond within <strong>30 days</strong> per the DPDP Act, §13.
          </p>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting…" : "Submit Request"}
          </Button>
        </form>
      )}

      <p className="text-center text-xs text-muted-foreground mt-6">
        For urgent matters, email{" "}
        <a href="mailto:privacy@vaidikaconnect.com" className="text-primary underline">
          privacy@vaidikaconnect.com
        </a>
        . Grievance Officer responds within 72 hours.
      </p>
    </div>
  );
}
