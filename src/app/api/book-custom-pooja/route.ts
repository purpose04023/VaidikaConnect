import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { generateEmbedding } from "@/lib/embeddings";
import { sendWhatsAppNotification, formatRequestConfirmationMessage } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get currently authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
    }

    const { 
      rawUserInput, 
      preferredDate, 
      preferredTime, 
      locationType, 
      locationAddress, 
      whatsappNumber,
      category 
    } = await req.json();

    if (!rawUserInput || !preferredDate || !preferredTime || !whatsappNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Call the search AI route internally to parse the user's requirements
    const host = req.headers.get("host") || "localhost:9002";
    const protocol = host.startsWith("localhost") ? "http" : "https";
    
    console.log("[BOOKING] Parsing query using search AI...");
    let parsedDeity = "Devata";
    let parsedRitual = category || "Puja";
    let parsedMaterials: string[] = [];
    let parsedRegion = "General";
    
    try {
      const searchResponse = await fetch(`${protocol}://${host}/api/search-pooja`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userQuery: rawUserInput, userLocation: locationAddress })
      });
      
      if (searchResponse.ok) {
        const aiData = await searchResponse.json();
        parsedDeity = aiData.deity || parsedDeity;
        parsedRitual = aiData.ritualArchetype || parsedRitual;
        parsedMaterials = aiData.materials || [];
        parsedRegion = aiData.region || parsedRegion;
      }
    } catch (err) {
      console.error("[BOOKING] AI Parsing failed. Falling back to defaults.", err);
    }

    // Save order details to Supabase
    console.log("[BOOKING] Saving order to database in pending_review status...");
    const { data: order, error: dbError } = await supabase
      .from("custom_ritual_orders")
      .insert({
        user_id: user.id,
        raw_user_input: rawUserInput,
        interpreted_deity: parsedDeity,
        ritual_archetype: parsedRitual,
        target_region: parsedRegion,
        preferred_language: "Telugu",
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        location_type: locationType || "home",
        location_address: locationAddress || "",
        whatsapp_number: whatsappNumber,
        generated_materials: parsedMaterials,
        status: "pending_review"
      })
      .select()
      .single();

    if (dbError) {
      console.error("[BOOKING] DB Error:", dbError);
      throw new Error(`Failed to save booking order: ${dbError.message}`);
    }

    // Update user profile with WhatsApp number if they don't have one
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ phone_whatsapp: whatsappNumber })
      .eq("id", user.id)
      .is("phone_whatsapp", null); // Only set if not already set

    if (profileError) {
      console.error("[BOOKING] Profile Update Error:", profileError);
    }

    // Send WhatsApp confirmation simulation
    console.log("[BOOKING] Sending mock WhatsApp confirmation alert...");
    const profileName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
    const mockMessage = formatRequestConfirmationMessage(profileName, parsedDeity, preferredDate);
    await sendWhatsAppNotification(whatsappNumber, mockMessage);

    return NextResponse.json({
      success: true,
      message: "Custom pooja request submitted successfully. Awaiting admin pricing.",
      orderId: order.id
    });

  } catch (error: any) {
    console.error("Booking API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to submit custom booking" }, { status: 500 });
  }
}
