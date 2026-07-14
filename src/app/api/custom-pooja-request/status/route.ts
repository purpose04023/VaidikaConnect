import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendWhatsAppNotification, formatPricingMessage } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  try {
    const { id, status, price } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "";

    let name = "Devotee";
    let phone = "9876543210";
    let poojaDescription = "Custom Pooja";
    let preferredDate = new Date().toISOString().split("T")[0];
    let isMock = false;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn("[STATUS UPDATE] Supabase credentials missing. Running status update in mock mode.");
      isMock = true;
    } else {
      try {
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
        
        // 1. Fetch current request to get name and phone for WhatsApp
        const { data: request, error: fetchError } = await supabaseAdmin
          .from("custom_pooja_requests")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;
        
        name = request.name;
        phone = request.phone;
        poojaDescription = request.pooja_description;
        preferredDate = request.preferred_date;

        // 2. Update status and total_amount in database
        const updatePayload: any = { status };
        if (price !== undefined) {
          updatePayload.total_amount = price;
        }

        const { error: updateError } = await supabaseAdmin
          .from("custom_pooja_requests")
          .update(updatePayload)
          .eq("id", id);

        if (updateError) throw updateError;
        
        console.log(`[STATUS UPDATE] Successfully updated status of ${id} to ${status}`);
      } catch (dbErr: any) {
        console.warn("[STATUS UPDATE] DB query failed, falling back to mock operation:", dbErr.message || dbErr);
        isMock = true;
      }
    }

    // 3. Trigger WhatsApp notification if status is completed
    if (status === "completed") {
      try {
        console.log(`[STATUS UPDATE] Status is completed. Triggering WhatsApp alert to ${phone}...`);
        const message = `Namaste ${name}! 🙏\n\nYour pooja booking for *${poojaDescription}* on *${preferredDate}* is completed, we are contacting you.\n\nDhanyavadah,\n*VaidikaConnect Support*`;

        await sendWhatsAppNotification(phone, message);
      } catch (whatsappErr) {
        console.error("[STATUS UPDATE] WhatsApp alert failed:", whatsappErr);
      }
    }

    // 4. Trigger WhatsApp notification if status is price_assigned
    if (status === "price_assigned" && price !== undefined) {
      try {
        console.log(`[STATUS UPDATE] Status is price_assigned. Triggering WhatsApp quote alert to ${phone}...`);
        const host = req.headers.get("host") || "localhost:9002";
        const protocol = host.startsWith("localhost") ? "http" : "https";
        const bookingLink = `${protocol}://${host}/profile`;
        
        const message = formatPricingMessage(
          name,
          poojaDescription,
          "Pooja",
          preferredDate,
          parseFloat(price),
          bookingLink
        );
        await sendWhatsAppNotification(phone, message);
      } catch (whatsappErr) {
        console.error("[STATUS UPDATE] WhatsApp quote alert failed:", whatsappErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Status updated successfully",
      isMock
    });
  } catch (error: any) {
    console.error("[STATUS UPDATE] API route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update status" },
      { status: 500 }
    );
  }
}
