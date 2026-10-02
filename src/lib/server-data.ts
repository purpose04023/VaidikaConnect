import { createClient } from "@/utils/supabase/server";
import { defaultPujas, defaultPujaris, type Puja, type Pujari } from "@/lib/data";

function hasSupabaseConfig() {
  return Boolean(
    (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    (process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  );
}

function mapPujari(row: Record<string, unknown>): Pujari {
  const id = String(row.id ?? "");
  return {
    id,
    name: String(row.full_name ?? row.name ?? "Vaidika Pujari"),
    photo: String(row.photo ?? ""),
    photoHint: String(row.photo_hint ?? "vedic priest"),
    verified: Boolean(row.verified),
    verifiedBy: row.verified_by ? String(row.verified_by) : undefined,
    verifiedAt: row.verified_at ? String(row.verified_at) : undefined,
    rating: Number(row.rating ?? 5),
    reviewCount: Number(row.review_count ?? 0),
    basePrice: Number(row.base_price ?? 0),
    qualifications: Array.isArray(row.qualifications) ? row.qualifications.map(String) : [],
    languages: Array.isArray(row.languages) ? row.languages.map(String) : [],
    experience: Number(row.experience_years ?? row.experience ?? 0),
    pujas: Array.isArray(row.pujas) ? row.pujas.map(String) : [],
    maxParticipants: Number(row.max_participants ?? 50),
    location: { lat: Number(row.lat ?? 16.3067), lng: Number(row.lng ?? 80.4367) },
    description: String(row.description ?? "Qualified Vaidika Pujari available for sacred ceremonies."),
    phone: String(row.phone_call ?? row.phone ?? ""),
    whatsapp: row.phone_whatsapp ? String(row.phone_whatsapp) : undefined,
    availableTimings: row.available_timings ? String(row.available_timings) : undefined,
    gallery: Array.isArray(row.gallery) ? row.gallery as Pujari["gallery"] : [],
    reviews: Array.isArray(row.reviews) ? row.reviews as Pujari["reviews"] : [],
  };
}

function mapPuja(row: Record<string, unknown>): Puja {
  return {
    id: String(row.id ?? ""),
    name: String(row.title_te ?? row.title ?? "Vaidika Program"),
    name_en: String(row.title ?? "Vaidika Program"),
    description: String(row.description ?? "A sacred Vedic ceremony guided by a qualified pujari."),
    description_te: String(row.description_te ?? row.description ?? "పవిత్రమైన వైదిక కార్యక్రమం."),
    image: String(row.image_url ?? ""),
    imageHint: String(row.image_hint ?? "vedic ceremony"),
    category: (String(row.category ?? "పూజలు") as Puja["category"]),
    category_en: (String(row.category_en ?? "Pujas") as Puja["category_en"]),
    program_type: row.program_type === "LIFE_CYCLE_POOJA" ? "LIFE_CYCLE_POOJA" : "VAIDIKA_POOJA",
    required_items: Array.isArray(row.required_items) ? row.required_items.map(String) : [],
    categories: Array.isArray(row.categories) ? row.categories.map(String) : [],
    sloka_tags: Array.isArray(row.sloka_tags) ? row.sloka_tags as Puja["sloka_tags"] : [],
    pdf_url: row.pdf_url ? String(row.pdf_url) : undefined,
  };
}

export async function getLivePujaris(): Promise<Pujari[]> {
  if (!hasSupabaseConfig()) return defaultPujaris;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("profiles").select("*").eq("role", "poojari").eq("verified", true);
    if (error || !data?.length) return defaultPujaris;
    return data.map((row) => mapPujari(row as Record<string, unknown>));
  } catch {
    return defaultPujaris;
  }
}

export async function getLivePujas(): Promise<Puja[]> {
  if (!hasSupabaseConfig()) return defaultPujas;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("programs").select("*").order("created_at", { ascending: true });
    if (error || !data?.length) return defaultPujas;
    return data.map((row) => mapPuja(row as Record<string, unknown>));
  } catch {
    return defaultPujas;
  }
}

export async function getLivePujaById(id: string): Promise<Puja | undefined> {
  const pujas = await getLivePujas();
  return pujas.find((puja) => String(puja.id) === String(id));
}
