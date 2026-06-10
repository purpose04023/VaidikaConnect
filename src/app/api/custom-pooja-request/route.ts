/*
SQL TO RUN IN SUPABASE SQL EDITOR:

CREATE TABLE IF NOT EXISTS custom_pooja_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(200) NOT NULL,
  phone           VARCHAR(20) NOT NULL,
  pooja_description TEXT NOT NULL,
  preferred_date  DATE,
  preferred_time  VARCHAR(50),
  pandit_count    VARCHAR(20),
  location        VARCHAR(300),
  budget          VARCHAR(50),
  notes           TEXT,
  status          VARCHAR(30) DEFAULT 'new',
  created_at      TIMESTAMP DEFAULT NOW()
);
*/

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      poojaDescription,
      preferredDate,
      preferredTime,
      panditCount,
      location,
      budget,
      notes,
    } = body;

    // Validate required fields
    if (!name || !phone || !poojaDescription || !preferredDate || !location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Initialize Supabase admin client using Service Role Key
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("[CUSTOM POOJA] Supabase configuration missing");
      return NextResponse.json(
        { error: "Internal server database configuration error" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Save the request to Supabase
    const { data, error: dbError } = await supabaseAdmin
      .from("custom_pooja_requests")
      .insert({
        name,
        phone,
        pooja_description: poojaDescription,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        pandit_count: panditCount,
        location,
        budget,
        notes: notes || null,
        status: "new"
      })
      .select()
      .single();

    if (dbError) {
      console.error("[CUSTOM POOJA] Database insertion failed:", dbError);
      return NextResponse.json(
        { error: "Failed to save request to database" },
        { status: 500 }
      );
    }

    console.log("[CUSTOM POOJA] Successfully saved request to database:", data.id);

    // Try sending email via Resend API
    try {
      const resendApiKey = process.env.RESEND_API_KEY;
      const adminEmail = process.env.ADMIN_EMAIL;
      const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@vaidika-connect.vercel.app";

      if (!resendApiKey) {
        console.warn("[CUSTOM POOJA] RESEND_API_KEY is not defined. Skipping email notification.");
      } else if (!adminEmail) {
        console.warn("[CUSTOM POOJA] ADMIN_EMAIL is not defined. Skipping email notification.");
      } else {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: fromEmail,
            to: adminEmail,
            subject: `🔔 New Custom Pooja Request — ${poojaDescription.substring(0, 50)}${poojaDescription.length > 50 ? '...' : ''}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                <h2 style="color: #c9a84c; border-bottom: 2px solid #f5f5f5; padding-bottom: 10px;">New Custom Pooja Request</h2>
                <table cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                  <tr style="background-color: #fafafa;">
                    <th align="left" style="width: 30%; border-bottom: 1px solid #eee; font-size: 14px;">Field</th>
                    <th align="left" style="border-bottom: 1px solid #eee; font-size: 14px;">Details</th>
                  </tr>
                  <tr>
                    <td style="border-bottom: 1px solid #eee; font-weight: bold; font-size: 14px;">Name</td>
                    <td style="border-bottom: 1px solid #eee; font-size: 14px;">${name}</td>
                  </tr>
                  <tr>
                    <td style="border-bottom: 1px solid #eee; font-weight: bold; font-size: 14px;">Phone</td>
                    <td style="border-bottom: 1px solid #eee; font-size: 14px;">${phone}</td>
                  </tr>
                  <tr>
                    <td style="border-bottom: 1px solid #eee; font-weight: bold; font-size: 14px;">Pooja Description</td>
                    <td style="border-bottom: 1px solid #eee; font-size: 14px; white-space: pre-wrap;">${poojaDescription}</td>
                  </tr>
                  <tr>
                    <td style="border-bottom: 1px solid #eee; font-weight: bold; font-size: 14px;">Preferred Date</td>
                    <td style="border-bottom: 1px solid #eee; font-size: 14px;">${preferredDate}</td>
                  </tr>
                  <tr>
                    <td style="border-bottom: 1px solid #eee; font-weight: bold; font-size: 14px;">Preferred Time</td>
                    <td style="border-bottom: 1px solid #eee; font-size: 14px;">${preferredTime || 'Not specified'}</td>
                  </tr>
                  <tr>
                    <td style="border-bottom: 1px solid #eee; font-weight: bold; font-size: 14px;">Pandits Needed</td>
                    <td style="border-bottom: 1px solid #eee; font-size: 14px;">${panditCount || 'Not specified'}</td>
                  </tr>
                  <tr>
                    <td style="border-bottom: 1px solid #eee; font-weight: bold; font-size: 14px;">Location</td>
                    <td style="border-bottom: 1px solid #eee; font-size: 14px;">${location}</td>
                  </tr>
                  <tr>
                    <td style="border-bottom: 1px solid #eee; font-weight: bold; font-size: 14px;">Budget Range</td>
                    <td style="border-bottom: 1px solid #eee; font-size: 14px;">${budget || 'Not specified'}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold; font-size: 14px; vertical-align: top; padding-top: 12px;">Additional Notes</td>
                    <td style="font-size: 14px; white-space: pre-wrap; padding-top: 12px;">${notes || 'None'}</td>
                  </tr>
                </table>
              </div>
            `,
          }),
        });

        if (!emailResponse.ok) {
          const errText = await emailResponse.text();
          console.error("[CUSTOM POOJA] Resend API error response:", errText);
        } else {
          console.log("[CUSTOM POOJA] Email sent successfully via Resend.");
        }
      }
    } catch (emailErr) {
      console.error("[CUSTOM POOJA] Email dispatch failed:", emailErr);
      // We still return success since the database save succeeded
    }

    return NextResponse.json({ success: true, message: "Request received" });
  } catch (error: any) {
    console.error("[CUSTOM POOJA] Route handler error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process custom pooja request" },
      { status: 500 }
    );
  }
}
