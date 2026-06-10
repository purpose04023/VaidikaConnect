import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { sendWhatsAppNotification, formatPricingMessage } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // 1. Authenticate user & verify admin role
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile || profile.role !== "admin") {
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
    const { data: order, error: orderError } = await supabase
      .from("custom_ritual_orders")
      .update({
        status: "price_assigned",
        total_amount: numericPrice,
        updated_at: new Date().toISOString()
      })
      .eq("id", orderId)
      .select()
      .single();

    if (orderError || !order) {
      console.error("[ADMIN PRICING] DB Error:", orderError);
      throw new Error(`Failed to update order price: ${orderError?.message || "Order not found"}`);
    }

    // 4. Retrieve client metadata for WhatsApp notification
    const { data: clientProfile, error: clientError } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", order.user_id)
      .single();

    const clientName = clientProfile?.full_name || "VaidikaConnect Devotee";

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
