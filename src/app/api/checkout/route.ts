import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { calculateBilling, sendPaymentWebhook } from "@/lib/billing";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      purohitId,
      userId,
      muhurthamTime,
      dakshina,
      userName,
      userPhone,
      pujaName
    } = body;

    // Validate inputs
    if (!purohitId || !dakshina || !userName || !userPhone || !pujaName || !muhurthamTime) {
      return NextResponse.json(
        { error: "Missing required checkout fields" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "";

    let cumulativeRevenue = 0;
    let isMock = false;
    let bookingId = "mock-booking-" + Math.random().toString(36).substring(2, 11);

    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn("[CHECKOUT] Supabase keys missing. Simulating database logic.");
      isMock = true;
    } else {
      try {
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
        
        // 1. Calculate cumulative gross platform revenue for this Purohit
        const { data: pastBookings, error: queryError } = await supabaseAdmin
          .from("bookings")
          .select("dakshina")
          .eq("purohit_id", purohitId)
          .eq("status", "confirmed");

        if (queryError) throw queryError;
        
        if (pastBookings && pastBookings.length > 0) {
          cumulativeRevenue = pastBookings.reduce((sum, b) => sum + Number(b.dakshina), 0);
        }
        
        console.log(`[CHECKOUT] Purohit ${purohitId} cumulative gross platform revenue: ₹${cumulativeRevenue}`);
      } catch (err: any) {
        console.warn("[CHECKOUT] Failed to fetch past bookings, using fallback 0 revenue.", err.message || err);
      }
    }

    // 2. Perform TDS (Section 393(1)) and billing split calculations
    const billing = calculateBilling(Number(dakshina), cumulativeRevenue);

    // 3. Create the booking entry in the database
    if (!isMock) {
      try {
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
        const { data: newBooking, error: insertError } = await supabaseAdmin
          .from("bookings")
          .insert({
            purohit_id: purohitId,
            user_id: userId || null,
            muhurtham_time: muhurthamTime,
            status: "confirmed", // Automatically confirm on successful checkout
            dakshina: billing.priest_dakshina,
            convenience_fee: billing.platform_fee
          })
          .select()
          .single();

        if (insertError) throw insertError;
        bookingId = newBooking.id;
        console.log("[CHECKOUT] Saved confirmed booking to database:", bookingId);
      } catch (err: any) {
        console.error("[CHECKOUT] Database insert failed:", err.message || err);
        return NextResponse.json(
          { error: "Failed to persist booking in database" },
          { status: 500 }
        );
      }
    }

    // 4. Dispatch Webhook to Make.com/n8n for WhatsApp notifications
    const webhookResult = await sendPaymentWebhook({
      userName,
      userPhone,
      bookingId,
      pujaName,
      billing
    });

    return NextResponse.json({
      success: true,
      bookingId,
      billing,
      webhookStatus: webhookResult,
      message: "Checkout transaction completed successfully and webhook dispatched."
    });

  } catch (error: any) {
    console.error("[CHECKOUT] Route handler error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process checkout transaction" },
      { status: 500 }
    );
  }
}
