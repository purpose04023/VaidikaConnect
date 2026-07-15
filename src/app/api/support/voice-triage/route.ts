import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Voice AI System Prompt:
 * You are a highly empathetic, B10X-style Hindu customer support representative for VaidikaConnect.
 * Speak with respect (using 'Namaskaram', 'Garu', etc.), be polite, and prioritize customer satisfaction.
 * 
 * Crucial Tool Definition (escalate_to_ticket):
 * If the user expresses frustration, states that their priest is late, or demands a refund,
 * you must instantly call the function `escalate_to_ticket` with the booking ID, description of the issue, and urgency.
 */
const VOICE_AI_SYSTEM_PROMPT = `
You are a highly empathetic, B10X-style Hindu customer support representative for VaidikaConnect.
Always greet the user with "Namaskaram" and speak with extreme humility and respect.
Your goal is to reassure the user and offer solutions for their ceremony booking issues.

CRITICAL DIRECTIVE:
If the user expresses frustration, mentions that a priest is late (especially close to the Muhurtham),
or demands a refund, you must immediately call the tool 'escalate_to_ticket' with the details.
`;

const ESCALATE_TO_TICKET_SCHEMA = {
  name: "escalate_to_ticket",
  description: "Creates an urgent support ticket in the database for human coordinator follow-up.",
  parameters: {
    type: "object",
    properties: {
      booking_id: { type: "string", description: "The UUID of the booking" },
      issue_description: { type: "string", description: "Summary of the customer's complaint or issue" },
      urgency: { type: "string", enum: ["low", "medium", "high", "critical"] }
    },
    required: ["booking_id", "issue_description", "urgency"]
  }
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transcription, bookingId, userId } = body;

    if (!transcription) {
      return NextResponse.json(
        { error: "Missing transcription text" },
        { status: 400 }
      );
    }

    const tLower = transcription.toLowerCase();
    
    // Check if Voice AI should trigger escalate_to_ticket
    const isLate = tLower.includes("late") || tLower.includes("delay") || tLower.includes("delayed") || tLower.includes("not here") || tLower.includes("arrived");
    const isRefund = tLower.includes("refund") || tLower.includes("money back") || tLower.includes("cancel");
    const isFrustrated = tLower.includes("angry") || tLower.includes("frustrated") || tLower.includes("terrible") || tLower.includes("worst") || tLower.includes("help me");

    let ticketCreated = false;
    let ticketData = null;

    if (isLate || isRefund || isFrustrated) {
      // Execute simulate escalate_to_ticket
      const urgency = isLate ? "critical" : isRefund ? "high" : "medium";
      const issue_description = `[Voice AI Triage] Customer said: "${transcription}"`;

      const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "";

      if (supabaseUrl && supabaseServiceKey) {
        try {
          const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
          const { data, error } = await supabaseAdmin
            .from("support_tickets")
            .insert({
              booking_id: bookingId || null,
              user_id: userId || null,
              issue_description,
              urgency,
              status: "open"
            })
            .select()
            .single();

          if (error) throw error;
          ticketCreated = true;
          ticketData = data;
          console.log("[VOICE AI] Support ticket generated successfully:", data.id);
        } catch (dbError: any) {
          console.warn("[VOICE AI] Failed to save ticket to database:", dbError.message || dbError);
        }
      } else {
        console.warn("[VOICE AI] Supabase keys missing. Simulating ticket creation.");
        ticketCreated = true;
        ticketData = { id: "mock-ticket-id", urgency, issue_description };
      }
    }

    // Generate empathetic Voice AI response
    let aiResponse = "Namaskaram. How can I assist you with your Vaidika Connect ceremony today?";
    if (ticketCreated) {
      aiResponse = "Namaskaram. I completely understand your concern and apologize for the inconvenience. I have immediately registered an urgent support ticket for you. Our human coordinator is looking into this right now and will contact you shortly.";
    } else if (tLower.includes("hello") || tLower.includes("hi")) {
      aiResponse = "Namaskaram! Welcome to VaidikaConnect support. How may I help you with your booking today?";
    }

    return NextResponse.json({
      aiResponse,
      systemPrompt: VOICE_AI_SYSTEM_PROMPT,
      toolUsed: ticketCreated ? "escalate_to_ticket" : null,
      ticket: ticketData
    });

  } catch (error: any) {
    console.error("[VOICE AI] Error in voice triage handler:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process voice triage" },
      { status: 500 }
    );
  }
}
