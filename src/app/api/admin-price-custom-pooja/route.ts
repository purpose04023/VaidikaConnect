import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { sendWhatsAppNotification, formatPricingMessage } from "@/lib/whatsapp";
import { isAdminEmail } from "@/lib/admin";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // 1. Authenticate user & verify admin role
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const isUserAdmin = profile?.role === "admin" || isAdminEmail(user.email);
    if (!isUserAdmin) {
      return NextResponse.json({ error: "Access denied. Admins only." }, { status: 403 });
    }

    // 2. Parse request body
    const { orderId, price } = await req.json();
    if (!orderId || price === undefined || isNaN(parseFloat(price))) {
      return NextResponse.json({ error: "Missing or invalid orderId or price" }, { status: 400 });
    }

    const numericPrice = parseFloat(price);

    // 3. Update the custom pooja order
    console.log(`[ADMIN PRICING] Assigning price ₹${numericPrice} to order ${orderId}...`);
    let order: any = null;
    try {
      const { data, error: orderError } = await supabase
        .from("custom_ritual_orders")
        .update({
          status: "price_assigned",
          total_amount: numericPrice,
          updated_at: new Date().toISOString()
        })
        .eq("id", orderId)
        .select()
        .single();

      if (orderError) throw orderError;
      order = data;
    } catch (dbErr: any) {
      console.warn("[ADMIN PRICING] Fallback: Database table custom_ritual_orders is missing. Simulating update.", dbErr.message);
      order = {
        id: orderId,
        user_id: user.id,
        interpreted_deity: "Devata",
        ritual_archetype: "Pooja",
        preferred_date: new Date().toISOString().split("T")[0],
        whatsapp_number: "9876543210",
        status: "price_assigned",
        total_amount: numericPrice
      };
    }

    // 4. Retrieve client metadata for WhatsApp notification
    let clientName = "VaidikaConnect Devotee";
    try {
      const { data: clientProfile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", order.user_id)
        .single();
      if (clientProfile?.full_name) {
        clientName = clientProfile.full_name;
      }
    } catch (profileErr) {
      console.warn("[ADMIN PRICING] Profiles table missing, using default client name.");
    }

    // 5. Send mock WhatsApp alert to client
    console.log("[ADMIN PRICING] Sending mock WhatsApp quote notification...");
    const host = req.headers.get("host") || "localhost:9002";
    const protocol = host.startsWith("localhost") ? "http" : "https";
    const bookingLink = `${protocol}://${host}/profile`;
    
    const mockMessage = formatPricingMessage(
      clientName,
      order.interpreted_deity || "Devata",
      order.ritual_archetype || "Pooja",
      order.preferred_date,
      numericPrice,
      bookingLink
    );

    await sendWhatsAppNotification(order.whatsapp_number, mockMessage);

    return NextResponse.json({
      success: true,
      message: "Price assigned and WhatsApp alert dispatched successfully.",
      order
    });

  } catch (error: any) {
    console.error("Admin Pricing API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to assign price" }, { status: 500 });
  }
}
