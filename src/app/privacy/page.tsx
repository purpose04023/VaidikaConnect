import React from "react";
import Link from "next/link";
import { Shield, Lock, Eye, FileText, UserCheck, Clock, Mail, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Privacy Notice – VaidikaConnect",
  description:
    "VaidikaConnect Privacy Notice under India's Digital Personal Data Protection Act 2023 (DPDP Act). Understand what data we collect, why, how long we keep it, and your rights.",
};

// ⚠️  LAWYER-REVIEW-REQUIRED — marked inline. Final legal copy must be approved by a
//    qualified Indian data-protection / IT-law practitioner before go-live.

export default function PrivacyNoticePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
          <Shield className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
          Privacy Notice
        </h1>
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
          Last Updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}.
          This notice is issued under the{" "}
          <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> of India.
          It explains how VaidikaConnect ("we", "us", "our") collects, uses, stores, and
          protects your personal data, and describes your rights as a Data Principal.
        </p>
        <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-400/40 rounded-lg px-4 py-2 text-xs text-amber-800 dark:text-amber-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>⚠️ LAWYER-REVIEW-REQUIRED — This draft must be reviewed by a qualified Indian data-protection counsel before publication.</span>
        </div>
      </div>

      <div className="space-y-6 text-muted-foreground leading-relaxed">

        {/* 1. Who We Are */}
        <Section icon={<Shield />} title="1. Data Fiduciary">
          <p>
            <strong>VaidikaConnect</strong> (operated by [Legal Entity Name, registration number —
            LAWYER-REVIEW-REQUIRED]) is the <strong>Data Fiduciary</strong> as defined under §2(i)
            of the DPDP Act 2023. Registered address: [Full registered address — LAWYER-REVIEW-REQUIRED].
          </p>
          <p className="mt-2">
            Grievance Officer / Data Protection contact:{" "}
            <a href="mailto:privacy@vaidikaconnect.com" className="text-primary underline">
              privacy@vaidikaconnect.com
            </a>
            &nbsp;| Response within <strong>72 hours</strong> of receipt.
          </p>
        </Section>

        {/* 2. Data We Collect */}
        <Section icon={<Eye />} title="2. Personal Data We Collect & Why">
          <Table
            headers={["Category", "Data Fields", "Purpose (Lawful Basis)", "Retention"]}
            rows={[
              [
                "Account",
                "First name, Last name, Email address, Password (hashed), WhatsApp/phone number",
                "Contract performance — create & manage your account (DPDP §4)",
                "Until account deletion + 30 days",
              ],
              [
                "Pujari Profile",
                "Full name, photo, experience, specialisations, base price, WhatsApp",
                "Contract — list pujari on platform; legitimate interest — quality assurance",
                "While profile is active + 90 days after deactivation",
              ],
              [
                "Booking / Pooja Request",
                "Ceremony description, deity, preferred dates, address/location, notes, booking status",
                "Contract — facilitate ritual booking",
                "3 years from booking date (financial record requirement)",
              ],
              [
                "GPS / Location",
                "Lat/Lng (if granted) or manually entered address",
                "Consent — find nearby pujaris; you may deny/revoke at any time",
                "Session only; not persisted",
              ],
              [
                "Usage Analytics",
                "Page views, clicks, browser/OS (via Vercel Analytics — anonymous, no cookies)",
                "Legitimate interest — improve platform performance",
                "90 days (Vercel's rolling window)",
              ],
              [
                "Support / Complaint",
                "Message text, contact details submitted via ComplaintBot",
                "Legitimate interest — resolve grievances",
                "2 years",
              ],
            ]}
          />
          <p className="text-xs mt-3">
            We do <strong>not</strong> collect sensitive personal data (Aadhaar, financial account
            numbers, health data, biometrics) unless legally required.
          </p>
        </Section>

        {/* 3. Third Parties */}
        <Section icon={<UserCheck />} title="3. Third-Party Data Processors & Disclosures">
          <Table
            headers={["Third Party", "Role", "Data Shared", "Location"]}
            rows={[
              ["Supabase, Inc.", "Database & Auth (Data Processor)", "All personal data listed above", "USA (SCCs apply — LAWYER-REVIEW-REQUIRED)"],
              ["Vercel, Inc.", "Hosting & Analytics", "Anonymised usage data", "USA (SCCs apply — LAWYER-REVIEW-REQUIRED)"],
              ["Assigned Pujari", "Service provider", "Your name, ceremony details, WhatsApp, date, address — only upon confirmed booking", "India"],
              ["Legal / Regulatory", "Compliance", "As required by court order or law", "India"],
            ]}
          />
          <p className="mt-3 text-sm">
            We do <strong>not</strong> sell, rent, or trade your personal data to any third party
            for marketing purposes.
          </p>
        </Section>

        {/* 4. Consent */}
        <Section icon={<FileText />} title="4. Consent & How to Withdraw">
          <p>
            Where we rely on <strong>consent</strong> as the lawful basis (e.g., GPS location,
            non-essential analytics), you give consent via an explicit opt-in checkbox or browser
            permission prompt. You may withdraw consent at any time without affecting the
            lawfulness of prior processing:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>
              <strong>GPS / Location:</strong> Deny or revoke via your browser or device settings.
            </li>
            <li>
              <strong>Analytics:</strong> Use the cookie/analytics banner on first visit.
            </li>
            <li>
              <strong>Account consent:</strong> Submit a data-rights request below.
            </li>
          </ul>
        </Section>

        {/* 5. Data Retention */}
        <Section icon={<Clock />} title="5. Retention & Erasure">
          <p>
            We retain personal data only as long as necessary for the purposes stated in Section 2,
            or as required by applicable Indian law (e.g., 8-year retention for financial records
            under the Companies Act). When data is no longer needed it is securely deleted or
            anonymised. You may request early erasure — see Section 7.
          </p>
        </Section>

        {/* 6. Security */}
        <Section icon={<Lock />} title="6. Security Measures">
          <ul className="list-disc pl-5 space-y-1">
            <li>Row-Level Security (RLS) on all Supabase tables — your data is accessible only by you and authorised admins.</li>
            <li>TLS/HTTPS in transit (enforced by Vercel and Supabase).</li>
            <li>Passwords are hashed (bcrypt via Supabase Auth) — never stored in plain text.</li>
            <li>WhatsApp numbers are never exposed publicly — only shared with the pujari assigned to your confirmed booking.</li>
            <li>
              <span className="text-amber-700 dark:text-amber-400 font-medium">⚠️ OPEN ITEM:</span>
              {" "}No CAPTCHA on sign-up (bot/abuse risk). Recommended: add hCaptcha or Cloudflare Turnstile.
            </li>
          </ul>
          <p className="mt-3 text-sm">
            In the event of a personal data breach we will notify the Data Protection Board of
            India within <strong>72 hours</strong> (where feasible) and affected Data Principals
            without undue delay, per the DPDP Act and our{" "}
            <Link href="/breach-runbook" className="text-primary underline">
              Breach Runbook
            </Link>
            .
          </p>
        </Section>

        {/* 7. Your Rights */}
        <Section icon={<UserCheck />} title="7. Your Rights as a Data Principal (DPDP Act §11–14)">
          <Table
            headers={["Right", "Description", "How to Exercise"]}
            rows={[
              ["Access (§11)", "Obtain a summary of personal data we hold about you and how it is used.", "Data Rights Request Form below"],
              ["Correction / Completion (§12)", "Request correction of inaccurate or incomplete data.", "Data Rights Request Form below"],
              ["Erasure (§12)", "Request deletion of data when no longer necessary for the stated purpose, subject to legal retention obligations.", "Data Rights Request Form below"],
              ["Grievance Redressal (§13)", "Lodge a complaint with our Grievance Officer within 48 hours if we fail to respond.", "Email privacy@vaidikaconnect.com"],
              ["Nominate (§14)", "Nominate another person to exercise rights on your behalf in the event of death or incapacity.", "Contact Grievance Officer"],
            ]}
          />
          <p className="mt-3 text-sm">
            We will respond to rights requests within <strong>30 days</strong>. If you are not
            satisfied with our response you may escalate to the{" "}
            <strong>Data Protection Board of India</strong> once constituted.
          </p>
          <div className="mt-4">
            <Link
              href="/data-rights"
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors"
            >
              <FileText className="h-4 w-4" />
              Submit a Data Rights Request
            </Link>
          </div>
        </Section>

        {/* 8. Children */}
        <Section icon={<AlertCircle />} title="8. Children & Minor Data Principals">
          <p>
            VaidikaConnect is not directed at persons under 18 years of age. We do not knowingly
            collect personal data from minors without verifiable parental consent. If you believe
            a minor's data has been submitted without consent, please contact{" "}
            <a href="mailto:privacy@vaidikaconnect.com" className="text-primary underline">
              privacy@vaidikaconnect.com
            </a>{" "}
            and we will delete it promptly. (LAWYER-REVIEW-REQUIRED — confirm age-gate obligations
            under final DPDP Rules.)
          </p>
        </Section>

        {/* 9. Cross-border */}
        <Section icon={<Shield />} title="9. Cross-Border Data Transfers">
          <p>
            Some data is processed on servers outside India (Supabase — USA; Vercel — USA).
            Such transfers are subject to Standard Contractual Clauses (SCCs) or equivalent
            safeguards. LAWYER-REVIEW-REQUIRED — verify compliance with DPDP Act §16 once
            the allowlist of approved jurisdictions is notified by the Central Government.
          </p>
        </Section>

        {/* 10. Changes */}
        <Section icon={<FileText />} title="10. Changes to This Notice">
          <p>
            We may update this notice to reflect changes in law or our practices. Material changes
            will be notified via email or a prominent banner at least 7 days before taking effect.
            Continued use of the platform after the effective date constitutes acceptance.
          </p>
        </Section>

        {/* Grievance */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-400/40 rounded-2xl p-6 space-y-2">
          <h2 className="font-bold text-foreground flex items-center gap-2">
            <Mail className="h-5 w-5 text-amber-600" />
            Grievance Officer Contact
          </h2>
          <p className="text-sm">
            Name: [Grievance Officer Name — LAWYER-REVIEW-REQUIRED]<br />
            Email:{" "}
            <a href="mailto:privacy@vaidikaconnect.com" className="text-primary underline">
              privacy@vaidikaconnect.com
            </a>
            <br />
            Response time: <strong>within 72 hours</strong> of receipt; resolution within <strong>30 days</strong>.
          </p>
        </div>

      </div>
    </div>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-3">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
        <span className="text-amber-500 [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto mt-2">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-amber-500/10">
            {headers.map((h) => (
              <th key={h} className="text-left p-2 font-semibold text-foreground border border-border">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="odd:bg-background even:bg-muted/30">
              {row.map((cell, j) => (
                <td key={j} className="p-2 border border-border align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
