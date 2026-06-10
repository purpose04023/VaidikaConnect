import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateEmbedding } from "@/lib/embeddings";

export const runtime = "edge";

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ""
);

export async function POST(req: NextRequest) {
  try {
    const { userQuery, userLocation } = await req.json();

    if (!userQuery || typeof userQuery !== "string" || userQuery.trim().length === 0) {
      return NextResponse.json({ error: "Missing or invalid userQuery" }, { status: 400 });
    }

    const trimmedQuery = userQuery.trim().slice(0, 500);

    // ==========================================
    // TIER 1: pgvector Cache Similarity Match
    // ==========================================
    try {
      console.log("[TIER 1] Generating embedding for query:", trimmedQuery);
      const queryEmbedding = await generateEmbedding(trimmedQuery);

      console.log("[TIER 1] Querying Supabase pgvector cache...");
      const { data: matchedCache, error: rpcError } = await supabase.rpc("match_poojas", {
        query_embedding: queryEmbedding,
        match_threshold: 0.85,
        match_count: 1
      });

      if (rpcError) {
        console.error("[TIER 1] RPC Error:", rpcError);
      } else if (matchedCache && matchedCache.length > 0) {
        const bestMatch = matchedCache[0];
        console.log("[TIER 1] Cache hit! Similarity:", bestMatch.similarity);
        
        return NextResponse.json({
          success: true,
          source: "cache",
          ...bestMatch.parsed_requirements,
          confidence: bestMatch.similarity
        });
      }
    } catch (tier1Err) {
      console.error("[TIER 1] Failed:", tier1Err);
    }

    // ==========================================
    // TIER 2: Symbolic regional deity mapping
    // ==========================================
    try {
      console.log("[TIER 2] Attempting keyword alias lookup...");
      const words = trimmedQuery.split(/\s+/).filter(w => w.length > 3);
      
      if (words.length > 0) {
        // Query aliases table
        const { data: aliases, error: dbError } = await supabase
          .from("regional_deity_aliases")
          .select("*");

        if (dbError) {
          console.error("[TIER 2] DB Error:", dbError);
        } else if (aliases) {
          // Find matching alias in query
          const match = aliases.find(alias => 
            trimmedQuery.toLowerCase().includes(alias.regional_alias.toLowerCase())
          );

          if (match) {
            console.log("[TIER 2] Symbolic match found! Alias:", match.regional_alias);
            
            const category = match.ritual_archetype || "Puja";
            const deity = match.canonical_deity;

            const responsePayload = {
              deity,
              ritualArchetype: category,
              region: match.associated_region || userLocation || "Andhra Pradesh",
              language: "Telugu",
              options: [
                { pandits: 1, cost: "₹5,000", duration: "2 hours", completeness: "Essential rituals & sankalpam" },
                { pandits: 2, cost: "₹7,500", duration: "3 hours", completeness: "Standard ceremony with full mantras" }
              ],
              materials: ["Pasupu (Turmeric)", "Kumkuma", "Betel Leaves", "Coconuts", "Flowers", "Incense Sticks"],
              confidence: 0.9
            };

            // Async save to cache
            void saveToCache(trimmedQuery, responsePayload);

            return NextResponse.json({
              success: true,
              source: "alias",
              ...responsePayload
            });
          }
        }
      }
    } catch (tier2Err) {
      console.error("[TIER 2] Failed:", tier2Err);
    }

    // ==========================================
    // TIER 3: LLM Fallback (Gemini Flash)
    // ==========================================
    console.log("[TIER 3] Falling back to LLM (Gemini)...");
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      throw new Error("Missing GEMINI_API_KEY");
    }

    const systemPrompt = `You are an expert Vedic scholar specializing in Hindu rituals, puja vidhanam, regional traditions, and micro-cultures of Andhra Pradesh and Telangana.
    Parse the user's custom ritual request and return a JSON object with the following fields:
    - deity: string (canonical name, e.g. "Ganesha", "Lakshmi", "Devi/Shakti", "Shiva")
    - ritualArchetype: string (archetype, e.g. "Puja", "Homam", "Vratam", "Nomu", "Kalyanam", "Samskara")
    - region: string (regional dialect/origin e.g. "Andhra Pradesh", "Telangana", "General")
    - language: string (default e.g. "Telugu")
    - options: array of 2 options:
      - Option 1: { pandits: number (typically 1), cost: string (e.g. "₹5,000"), duration: string, completeness: string }
      - Option 2: { pandits: number (typically 2), cost: string (e.g. "₹8,500"), duration: string, completeness: string }
    - materials: string[] (array of required items/samagri)
    - confidence: number (float between 0 and 1 representing your confidence in parsing)
    
    Return ONLY a raw JSON string. Do NOT enclose in markdown backticks (\`\`\`json).`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: `${systemPrompt}\n\nUser request: "${trimmedQuery}"` }] }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!geminiResponse.ok) {
      const errTxt = await geminiResponse.text();
      throw new Error(`Gemini LLM error: ${errTxt}`);
    }

    const geminiData = await geminiResponse.json();
    const rawJson = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawJson) {
      throw new Error("Empty response from Gemini LLM");
    }

    const parsedRequirements = JSON.parse(rawJson.replace(/```json|```/g, "").trim());

    const responsePayload = {
      deity: parsedRequirements.deity || "Devata",
      ritualArchetype: parsedRequirements.ritualArchetype || "Puja",
      region: parsedRequirements.region || userLocation || "General",
      language: parsedRequirements.language || "Telugu",
      options: parsedRequirements.options || [
        { pandits: 1, cost: "₹5,000", duration: "2 hours", completeness: "Essential rituals" }
      ],
      materials: parsedRequirements.materials || ["Turmeric", "Kumkum", "Flowers"],
      confidence: parsedRequirements.confidence || 0.8
    };

    // Async save to cache
    void saveToCache(trimmedQuery, responsePayload);

    return NextResponse.json({
      success: true,
      source: "llm",
      ...responsePayload
    });

  } catch (error: any) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process search request" }, { status: 500 });
  }
}

// Background fire-and-forget function to store result in pgvector cache
async function saveToCache(query: string, payload: any) {
  try {
    console.log("[CACHE] Saving response to Supabase...");
    const embedding = await generateEmbedding(query);

    const { error } = await supabase.from("pooja_embeddings").insert({
      user_query: query,
      embedding,
      parsed_requirements: payload,
      pandit_count: payload.options?.[0]?.pandits || 1,
      estimated_cost: parseFloat(payload.options?.[0]?.cost?.replace(/[^0-9.]/g, "") || "5000"),
      region: payload.region,
      confidence_score: payload.confidence || 0.8,
      source: "llm"
    });

    if (error) {
      console.error("[CACHE] Failed to save to database:", error);
    } else {
      console.log("[CACHE] Successfully saved query to embeddings cache.");
    }
  } catch (err) {
    console.error("[CACHE] Error during background cache save:", err);
  }
}
