import React from "react";
import { BookOpen, HelpCircle, AlertTriangle, Scale, Flame, ShieldAlert, Receipt } from "lucide-react";

export const metadata = {
  title: "Terms of Service - VaidikaConnect",
  description: "Read the rules, terms, and agreements governing the use of VaidikaConnect.",
};

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
          <Scale className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
          Terms of Service
        </h1>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          Last Updated: July 13, 2026. Please read these terms carefully before scheduling ceremonies.
        </p>
      </div>

      <div className="prose prose-amber dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
        <section className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-3">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-amber-500" />
            1. User Registration & Eligibility
          </h2>
          <p>
            By using VaidikaConnect, you agree to supply authentic information during registration.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>You must be at least 18 years of age or possess legal capacity in your jurisdiction.</li>
            <li>You are responsible for safeguarding your login credentials and are responsible for all actions occurring under your account.</li>
            <li>Admins reserve the right to suspend accounts submitting misleading profile info.</li>
          </ul>
        </section>

        <section className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-3">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-amber-500" />
            2. Booking Rituals & Pricing Customizations
          </h2>
          <p>
            VaidikaConnect acts as an enabling coordinator between devotees and qualified Vedic Pandits:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Admins assign customized pricing quotes based on details like preferred location, number of Pandits requested, and materials needed.</li>
            <li>Once quotes are assigned, you may confirm and book the ceremony.</li>
            <li>Once confirmed, the assigned Pujari details will be sent directly to your verified phone/WhatsApp number.</li>
          </ul>
        </section>

        <section className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-3">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            3. Cancellations & Rescheduling
          </h2>
          <p>
            Because Pujaris dedicate specific auspicious times (Muhurtha) for your ceremonies, please respect the cancellation policy:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Notice:</strong> Ritual cancellation or rescheduling requests should be initiated at least 24 hours prior to the booked time.</li>
            <li><strong>Muhurtha changes:</strong> Rescheduling is subject to slot and Muhurtha availability of the assigned Pandit.</li>
          </ul>
        </section>

        <section className="bg-card p-6 rounded-2xl border border-orange-400/50 shadow-sm space-y-3">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            4. Fire Hazard Notice (Homams)
          </h2>
          <p>
            Homam rituals involve open fire. The devotee is solely responsible for ensuring the venue is:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Well-ventilated with adequate clearance from flammable structures.</li>
            <li>Equipped with a working fire extinguisher and sand bucket.</li>
            <li>Compliant with local fire safety regulations.</li>
          </ul>
          <p className="text-sm font-medium text-orange-700 dark:text-orange-400">
            VaidikaConnect and the officiating Purohit assume no liability for any fire-related damage,
            injury, or loss arising from the performance of Homam ceremonies.
          </p>
        </section>

        <section className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-3">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
            5. No Guarantee of Metaphysical Outcomes
          </h2>
          <p>
            VaidikaConnect facilitates access to qualified Vedic Purohits for ceremonial and ritual
            services. We do not guarantee, represent, or warrant any specific spiritual, metaphysical,
            astrological, or material outcomes — including health improvements, financial gains,
            relationship outcomes, or divine intervention — as a result of any ritual performed
            through this platform.
          </p>
        </section>

        <section className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-3">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Receipt className="h-5 w-5 text-amber-500" />
            6. GST & Pricing (Pure Agent Model)
          </h2>
          <p>
            VaidikaConnect operates as a <strong>Pure Agent</strong> under Indian GST law
            (Notification No. 12/2017):
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Priest Dakshina</strong> is collected on behalf of the Purohit and is <strong>GST-exempt</strong>.</li>
            <li>A <strong>Platform Convenience Fee</strong> of 5% of the Dakshina is levied by VaidikaConnect, subject to <strong>18% GST</strong>.</li>
            <li>A detailed invoice breakdown is provided at checkout for full transparency.</li>
          </ul>
        </section>

        <section className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-3">
          <h2 className="text-xl font-bold text-foreground">
            7. Limitation of Liability
          </h2>
          <p>
            VaidikaConnect works diligently to verify the credentials and proficiency of all registered Pandits. However, we do not accept liability for unexpected event scheduling delays, individual ritual variations, or external disruptions to the ceremony space.
          </p>
        </section>

        <div className="text-center text-xs text-muted-foreground pt-6">
          For help or clarification on these terms, please connect with us at legal@vaidikaconnect.com.
        </div>
      </div>
    </div>
  );
}
