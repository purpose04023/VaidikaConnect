"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Puja, Pujari, Temple, Region } from "@/lib/data";
import { defaultPujaris, defaultPujas } from "@/lib/data";
import { defaultTemples } from "@/features/temple/data/temples";
import type { Deity } from "@/features/reading/data/stotrams";
import { stotramsData as defaultDeities } from "@/features/reading/data/stotrams";
import { createClient } from "@/utils/supabase/client";
import { uploadAsset } from "@/utils/supabase/storage";
import { isAdminEmail } from "@/lib/admin";
import { compressImage } from "@/lib/utils";
import { useUser } from "@/hooks/use-auth";

const fromCsv = (str: string): string[] => {
  if (!str) return [];
  return str.split(",").map((s) => s.trim()).filter(Boolean);
};

export interface ContactContent {
  title: string;
  subtitle: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  whatsapp: string;
  mapUrl: string;
}

export interface GlobalSettings {
  landingTitleEn?: string;
  landingTitleTe?: string;
  landingSubtitleEn?: string;
  landingSubtitleTe?: string;
}

export const defaultSettings: GlobalSettings = {
  landingTitleEn: "Authentic Vedic Poojas At Your Home",
  landingTitleTe: "మీ ఇంట్లోనే ప్రామాణిక వైదిక పూజలు",
  landingSubtitleEn: "Connect with certified, experienced Vedic priests in Guntur for all rituals, vratams, homams, and kalyanams.",
  landingSubtitleTe: "అన్ని రకాల వ్రతాలు, హోమాలు, కళ్యాణాలు మరియు వైదిక పూజల కోసం గుంటూరులోని సర్టిఫైడ్, అనుభవజ్ఞులైన వైదిక పండితులను సంప్రదించండి.",
};

export interface PujariJoinRequest {
  id: string;
  name: string;
  photo: string;
  phone: string;
  email: string;
  city: string;
  location: string;
  qualifications: string[];
  languages: string[];
  experience: number;
  basePrice: number;
  maxParticipants: number;
  pujas: string[];
  description: string;
  submittedAt: string;
  whatsapp?: string;
  availableTimings?: string;
  lat?: number;
  lng?: number;
  status?: string;
}

interface ContentContextValue {
  pujas: Puja[];
  pujaris: Pujari[];
  temples: Temple[];
  regions: Region[];
  deities: Deity[];
  contact: ContactContent;
  settings: GlobalSettings;
  requests: PujariJoinRequest[];
  isLoading: boolean;
  savePuja: (puja: Puja) => Promise<void>;
  deletePuja: (id: string | number) => Promise<void>;
  savePujari: (pujari: Pujari) => Promise<void>;
  deletePujari: (id: string | number) => Promise<void>;
  saveTemple: (temple: Temple) => Promise<void>;
  deleteTemple: (id: string) => Promise<void>;
  saveRegion: (region: Region) => Promise<void>;
  deleteRegion: (id: string) => Promise<void>;
  saveDeity: (deity: Deity) => Promise<void>;
  deleteDeity: (id: string) => Promise<void>;
  saveContact: (contact: ContactContent) => Promise<void>;
  saveSettings: (settings: GlobalSettings) => Promise<void>;
  submitJoinRequest: (
    request: Omit<PujariJoinRequest, "id" | "submittedAt">
  ) => Promise<void>;
  approveJoinRequest: (id: string) => Promise<void>;
  rejectJoinRequest: (id: string) => Promise<void>;
  resetContent: () => Promise<void>;
}

const fallbackPhoto =
  "https://images.unsplash.com/photo-1570839753356-6bc05ceea49a?auto=format&fit=crop&w=1200&q=80";

export const defaultContact: ContactContent = {
  title: "Contact VaidikaConnect",
  subtitle:
    "Reach our team for puja bookings, priest onboarding, and ceremony support.",
  phone: "+91 98765 43210",
  email: "support@vaidikaconnect.in",
  address: "Chandramouli Nagar, Guntur, Andhra Pradesh",
  hours: "Daily, 7:00 AM - 9:00 PM",
  whatsapp: "+91 98765 43210",
  mapUrl: "https://maps.google.com/?q=Guntur%20Andhra%20Pradesh",
};

// Generates a stable UUID based on a numeric ID for backwards compatibility
const stableUuid = (num: number | string): string => {
  if (typeof num === 'string' && num.includes('-')) return num;
  const n = parseInt(String(num));
  if (isNaN(n)) return "00000000-0000-0000-0000-" + String(num).slice(0, 12).padStart(12, '0');
  return "00000000-0000-0000-0000-" + String(n).padStart(12, '0');
};

const slugifyAssetName = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "asset";

const imageExtensionFromDataUrl = (value: string) => {
  const match = value.match(/^data:image\/([a-zA-Z0-9.+-]+);base64,/);
  const ext = match?.[1]?.toLowerCase();
  return ext === "jpeg" ? "jpg" : ext || "jpg";
};

async function persistImageAsset(
  image: string | undefined,
  folder: string,
  id: string | number | undefined,
  label: string
) {
  if (!image || !image.startsWith("data:image/")) return image || "";

  const extension = imageExtensionFromDataUrl(image);
  const path = `${folder}/${slugifyAssetName(String(id || label))}-${Date.now()}.${extension}`;
  try {
    return await uploadAsset(path, image);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Image upload failed. Confirm the Supabase Storage bucket and admin upload policies are installed. ${message}`
    );
  }
}

function throwOnSupabaseError(error: { message?: string } | null, action: string) {
  if (error) {
    throw new Error(`${action} failed: ${error.message || "Unknown Supabase error"}`);
  }
}

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const supabase = useMemo(() => createClient(), []);
  const isAdmin = isAdminEmail(user?.email);

  const [pujas, setPujas] = useState<Puja[]>([]);
  const [pujaris, setPujaris] = useState<Pujari[]>([]);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [deities, setDeities] = useState<Deity[]>([]);
  const [contact, setContact] = useState<ContactContent>(defaultContact);
  const [settings, setSettings] = useState<GlobalSettings>(defaultSettings);
  const [requests, setRequests] = useState<PujariJoinRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);



  // Fetch all content from Supabase
  const refreshContent = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch all tables concurrently to eliminate sequential network latency
      const [
        regionsRes,
        templesRes,
        pujasRes,
        pujarisRes,
        deitiesRes,
        settingsRes
      ] = await Promise.all([
        supabase.from("regions").select("*").then(r => r, err => ({ data: null, error: err })),
        supabase.from("temples").select("*").then(r => r, err => ({ data: null, error: err })),
        supabase.from("programs").select("*").then(r => r, err => ({ data: null, error: err })),
        supabase.from("profiles").select("*").eq("role", "poojari").then(r => r, err => ({ data: null, error: err })),
        supabase.from("stotrams").select("*").then(r => r, err => ({ data: null, error: err })),
        supabase.from("global_settings").select("*").then(r => r, err => ({ data: null, error: err }))
      ]);

      // Process regions
      const dbRegions = regionsRes.data;
      const regionsList: Region[] = (dbRegions || []).map((r) => ({
        id: r.id,
        name: r.name,
      }));
      if (regionsList.length === 0 && dbRegions !== null) {
        regionsList.push({ id: "region-ap", name: "Andhra Pradesh" }, { id: "region-ts", name: "Telangana" });
      }

      // Process temples
      const dbTemples = templesRes.data;
      const templesList: Temple[] = (dbTemples || []).map((t) => ({
        id: t.id,
        name: t.name,
        state: t.state,
        location: t.location || "",
        image: t.image || "",
        banner_image: t.banner_image || "",
        description: t.description || "",
        contact: t.contact || "",
        booking_link: t.booking_link || "",
      }));

      // Seed data if empty (since this is a new feature)
      if (templesList.length === 0 && dbTemples !== null) {
        templesList.push(...defaultTemples);
      }

      // Process programs (filter out any rows with empty/blank titles to prevent blank cards rendering)
      const dbPujas = pujasRes.data;
      const pujasList: Puja[] = (dbPujas || [])
        .filter((p) => (p.title && p.title.trim() !== "") || (p.title_te && p.title_te.trim() !== ""))
        .map((p) => ({
          id: p.id,
          name: p.title_te || p.title,
          name_en: p.title,
          description: p.description || "",
          description_te: p.description_te || "",
          image: p.image_url || fallbackPhoto,
          imageHint: p.image_hint || "ritual",
          category: p.category as any,
          category_en: p.category_en as any,
          program_type: p.program_type as any,
          categories: p.categories || [],
          required_items: p.required_items || [],
          sloka_tags: p.sloka_tags || [],
          pdf_url: p.pdf_url || "",
        }));

      // Process pujaris
      const dbPujaris = pujarisRes.data;
      const pujarisList: Pujari[] = (dbPujaris || []).map((p) => ({
        id: p.id,
        name: p.full_name,
        photo: p.photo || fallbackPhoto,
        photoHint: p.photo_hint || "pujari",
        verified: p.verified,
        verifiedBy: p.verified_by || "",
        verifiedAt: p.verified_at || "",
        rating: p.rating || 5.0,
        reviewCount: p.review_count || 0,
        basePrice: p.base_price || 5000,
        qualifications: p.qualifications || [],
        languages: p.languages || [],
        experience: p.experience_years || 0,
        pujas: p.pujas || [],
        maxParticipants: p.max_participants || 50,
        location: { lat: p.lat || 16.3067, lng: p.lng || 80.4367 },
        description: p.description || "",
        phone: p.phone_call || "",
        whatsapp: p.phone_whatsapp || "",
        availableTimings: p.available_timings || "",
        gallery: p.gallery || [],
        reviews: p.reviews || [],
      }));

      // Process stotrams
      const dbDeities = deitiesRes.data;
      const deitiesList: Deity[] = (dbDeities || []).map((d) => ({
        id: d.id,
        name: d.name_te || d.deity_name,
        nameEn: d.deity_name,
        gender: d.gender as any,
        imageHint: d.image_hint || "",
        imageUrl: d.image_url || "",
        ashtotharamUrl: d.ashtotharam_url || "",
        sahasranamamUrl: d.sahasranamam_url || "",
        readingSlug: d.reading_slug || "",
      }));

      // Process settings
      const dbSettings = settingsRes.data;
      let parsedSettings = defaultSettings;
      let parsedContact = defaultContact;

      (dbSettings || []).forEach((row) => {
        if (row.id === "settings" && row.value) {
          try {
            parsedSettings = JSON.parse(row.value);
          } catch (e) {
            console.error("Failed to parse settings JSON:", e);
          }
        }
        if (row.id === "contact" && row.value) {
          try {
            parsedContact = JSON.parse(row.value);
          } catch (e) {
            console.error("Failed to parse contact JSON:", e);
          }
        }
      });

      // 5. Fetch join requests (only loaded if admin is logged in)
      let requestsList: PujariJoinRequest[] = [];
      if (isAdmin) {
        const { data: dbRequests } = await supabase.from("requests").select("*");
        requestsList = (dbRequests || []).map((r) => ({
          id: r.id,
          name: r.name,
          photo: r.photo || fallbackPhoto,
          phone: r.phone,
          email: r.email || "",
          city: r.city || "",
          location: r.location || "",
          qualifications: typeof r.qualifications === "string" ? fromCsv(r.qualifications) : r.qualifications || [],
          languages: typeof r.languages === "string" ? fromCsv(r.languages) : r.languages || [],
          experience: r.experience || 0,
          basePrice: r.base_price || 5000,
          maxParticipants: r.max_participants || 50,
          pujas: typeof r.pujas === "string" ? fromCsv(r.pujas) : r.pujas || [],
          description: r.description || "",
          whatsapp: r.whatsapp || r.phone,
          availableTimings: r.available_timings || "",
          lat: r.lat || 16.3067,
          lng: r.lng || 80.4367,
          status: r.status || "pending",
          submittedAt: r.created_at || new Date().toISOString(),
        }));
        requestsList.sort(
          (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );
      }

      setPujas(pujasList);
      setPujaris(pujarisList);
      setTemples(templesList);
      setRegions(regionsList);
      setDeities(deitiesList);
      setContact(parsedContact);
      setSettings(parsedSettings);
      setRequests(requestsList);
    } catch (error) {
      console.error("Failed to refresh Supabase content:", error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, isAdmin]);

  // Initial load
  useEffect(() => {
    refreshContent();
  }, [refreshContent]);

  // Admin authorization guard
  const ensureAdmin = useCallback(() => {
    if (!isAdmin) {
      throw new Error("Admin access is required to change shared content.");
    }
  }, [isAdmin]);

  // Write operations

  const savePuja = useCallback(
    async (puja: Puja) => {
      ensureAdmin();

      // Compress large image payload if needed
      let compressedImage = puja.image;
      if (puja.image && puja.image.startsWith("data:image/") && puja.image.length > 100000) {
        try {
          compressedImage = await compressImage(puja.image);
        } catch (e) {
          console.error("Failed to compress puja image:", e);
        }
      }

      const idToUpsert = pujas.some((item) => String(item.id) === String(puja.id)) ? String(puja.id) : undefined;

      const storedImage = await persistImageAsset(
        compressedImage,
        "pujas",
        puja.id,
        puja.name_en || puja.name
      );

      const payload = {
        title: puja.name_en,
        title_te: puja.name,
        description: puja.description,
        description_te: puja.description_te,
        image_url: storedImage,
        image_hint: puja.imageHint,
        category: puja.category,
        category_en: puja.category_en,
        program_type: puja.program_type || 'VAIDIKA_POOJA',
        categories: puja.categories || [],
        required_items: puja.required_items || [],
        sloka_tags: puja.sloka_tags || [],
        pdf_url: puja.pdf_url,
      };

      if (idToUpsert) {
        const { error } = await supabase.from("programs").update(payload).eq("id", idToUpsert);
        throwOnSupabaseError(error, "Puja update");
      } else {
        const { error } = await supabase.from("programs").insert({
          ...payload,
          id: undefined, // auto generate UUID
        });
        throwOnSupabaseError(error, "Puja insert");
      }

      await refreshContent();
    },
    [supabase, ensureAdmin, refreshContent, pujas]
  );

  const deletePuja = useCallback(
    async (id: string | number) => {
      ensureAdmin();
      const { error } = await supabase.from("programs").delete().eq("id", String(id));
      throwOnSupabaseError(error, "Puja delete");
      await refreshContent();
    },
    [supabase, ensureAdmin, refreshContent]
  );

  const savePujari = useCallback(
    async (pujari: Pujari) => {
      ensureAdmin();

      let compressedPhoto = pujari.photo;
      if (pujari.photo && pujari.photo.startsWith("data:image/") && pujari.photo.length > 100000) {
        try {
          compressedPhoto = await compressImage(pujari.photo);
        } catch (e) {
          console.error("Failed to compress pujari photo:", e);
        }
      }

      const idToUpsert = pujaris.some((item) => String(item.id) === String(pujari.id)) ? String(pujari.id) : undefined;

      const storedPhoto = await persistImageAsset(
        compressedPhoto,
        "pujaris",
        pujari.id,
        pujari.name
      );

      const payload = {
        role: "poojari",
        full_name: pujari.name,
        photo: storedPhoto || fallbackPhoto,
        photo_hint: pujari.photoHint || "verified pujari",
        verified: pujari.verified ?? false,
        verified_by: pujari.verifiedBy || "VaidikaConnect",
        verified_at: pujari.verifiedAt || new Date().toISOString().slice(0, 10),
        rating: pujari.rating || 5.0,
        review_count: pujari.reviewCount || 0,
        base_price: pujari.basePrice || 5000,
        qualifications: pujari.qualifications || [],
        languages: pujari.languages || [],
        experience_years: pujari.experience || 0,
        pujas: pujari.pujas.map(stableUuid),
        max_participants: pujari.maxParticipants || 50,
        lat: pujari.location?.lat || 16.3067,
        lng: pujari.location?.lng || 80.4367,
        description: pujari.description || "",
        phone_call: pujari.phone,
        phone_whatsapp: pujari.whatsapp || pujari.phone,
        available_timings: pujari.availableTimings || "Morning Slot, Evening Slot",
        gallery: pujari.gallery || [],
        reviews: pujari.reviews || [],
      };

      if (idToUpsert) {
        const { error } = await supabase.from("profiles").update(payload).eq("id", idToUpsert);
        throwOnSupabaseError(error, "Pujari update");
      } else {
        const { error } = await supabase.from("profiles").insert({
          ...payload,
          id: crypto.randomUUID(), // generate valid random UUID for profiles primary key
        });
        throwOnSupabaseError(error, "Pujari insert");
      }

      await refreshContent();
    },
    [supabase, ensureAdmin, refreshContent, pujaris]
  );

  const deletePujari = useCallback(
    async (id: string | number) => {
      ensureAdmin();
      const { error } = await supabase.from("profiles").delete().eq("id", String(id));
      throwOnSupabaseError(error, "Pujari delete");
      await refreshContent();
    },
    [supabase, ensureAdmin, refreshContent]
  );

  const saveContact = useCallback(
    async (newContact: ContactContent) => {
      ensureAdmin();
      const { error } = await supabase.from("global_settings").upsert({
        id: "contact",
        value: JSON.stringify(newContact),
      });
      throwOnSupabaseError(error, "Contact update");
      await refreshContent();
    },
    [supabase, ensureAdmin, refreshContent]
  );

  const saveSettings = useCallback(
    async (newSettings: GlobalSettings) => {
      ensureAdmin();
      const { error } = await supabase.from("global_settings").upsert({
        id: "settings",
        value: JSON.stringify(newSettings),
      });
      throwOnSupabaseError(error, "Settings update");
      await refreshContent();
    },
    [supabase, ensureAdmin, refreshContent]
  );

  const submitJoinRequest = useCallback(
    async (request: Omit<PujariJoinRequest, "id" | "submittedAt">) => {
      const generatedId = typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID 
        ? window.crypto.randomUUID() 
        : typeof crypto !== 'undefined' && crypto.randomUUID 
          ? crypto.randomUUID() 
          : stableUuid(Date.now().toString() + Math.random().toString());

      const data = {
        id: generatedId,
        name: request.name,
        photo: request.photo || fallbackPhoto,
        phone: request.phone,
        email: request.email || "",
        city: request.city || "",
        location: request.location || "",
        qualifications: request.qualifications || [],
        languages: request.languages || [],
        experience: request.experience || 0,
        base_price: request.basePrice || 5000,
        max_participants: request.maxParticipants || 50,
        pujas: request.pujas.map(stableUuid),
        description: request.description || "",
        whatsapp: request.whatsapp || request.phone,
        available_timings: request.availableTimings || "Morning Slot, Evening Slot",
        lat: request.lat || 16.3067,
        lng: request.lng || 80.4367,
        status: "pending",
      };
      const { error } = await supabase.from("requests").insert(data);
      throwOnSupabaseError(error, "Join request insert");
      await refreshContent();
    },
    [supabase, refreshContent]
  );

  const approveJoinRequest = useCallback(
    async (id: string) => {
      ensureAdmin();
      const request = requests.find((item) => item.id === id);
      if (!request) return;

      const profileId = crypto.randomUUID();
      const newPujariPayload = {
        id: profileId,
        role: "poojari",
        full_name: request.name,
        photo: request.photo || fallbackPhoto,
        photo_hint: "verified pujari",
        verified: true,
        verified_by: "VaidikaConnect",
        verified_at: new Date().toISOString().slice(0, 10),
        rating: 5,
        review_count: 0,
        base_price: request.basePrice,
        qualifications: request.qualifications,
        languages: request.languages,
        experience_years: request.experience,
        pujas: request.pujas.map(stableUuid),
        max_participants: request.maxParticipants,
        lat: request.lat || 16.3067,
        lng: request.lng || 80.4367,
        description: request.description,
        phone_call: request.phone,
        phone_whatsapp: request.whatsapp || request.phone,
        available_timings: request.availableTimings || "Morning Slot, Evening Slot",
        gallery: [],
        reviews: [],
      };

      const { error: insertError } = await supabase.from("profiles").insert(newPujariPayload);
      throwOnSupabaseError(insertError, "Join request approval");
      const { error: deleteError } = await supabase.from("requests").delete().eq("id", id);
      throwOnSupabaseError(deleteError, "Join request cleanup");
      await refreshContent();
    },
    [supabase, ensureAdmin, requests, refreshContent]
  );

  const rejectJoinRequest = useCallback(
    async (id: string) => {
      ensureAdmin();
      const { error } = await supabase.from("requests").delete().eq("id", id);
      throwOnSupabaseError(error, "Join request rejection");
      await refreshContent();
    },
    [supabase, ensureAdmin, refreshContent]
  );

  const resetContent = useCallback(async () => {
    ensureAdmin();
    // Wipe tables
    const { error: programsError } = await supabase.from("programs").delete().neq("id", stableUuid(0));
    throwOnSupabaseError(programsError, "Programs reset");
    const { error: profilesError } = await supabase.from("profiles").delete().neq("role", "admin");
    throwOnSupabaseError(profilesError, "Profiles reset");
    const { error: stotramsError } = await supabase.from("stotrams").delete().neq("id", stableUuid(0));
    throwOnSupabaseError(stotramsError, "Stotrams reset");
    const { error: settingsError } = await supabase.from("global_settings").delete().neq("id", "admin-key");
    throwOnSupabaseError(settingsError, "Settings reset");
    const { error: requestsError } = await supabase.from("requests").delete().neq("status", "approved");
    throwOnSupabaseError(requestsError, "Requests reset");

    // Seeding removed — use admin tools to re-populate if needed
  }, [supabase, ensureAdmin]);

  const saveTemple = useCallback(
    async (temple: Temple) => {
      ensureAdmin();

      let compressedImage = temple.image;
      if (temple.image && temple.image.startsWith("data:image/") && temple.image.length > 100000) {
        try {
          compressedImage = await compressImage(temple.image);
        } catch (e) {
          console.error("Failed to compress temple image:", e);
        }
      }

      let compressedBanner = temple.banner_image;
      if (temple.banner_image && temple.banner_image.startsWith("data:image/") && temple.banner_image.length > 100000) {
        try {
          compressedBanner = await compressImage(temple.banner_image);
        } catch (e) {
          console.error("Failed to compress temple banner:", e);
        }
      }

      const idToUpsert = temples.some((item) => String(item.id) === String(temple.id)) ? String(temple.id) : undefined;

      const storedImage = await persistImageAsset(
        compressedImage,
        "temples",
        temple.id,
        temple.name
      );
      const storedBanner = await persistImageAsset(
        compressedBanner,
        "temple-banners",
        temple.id,
        temple.name
      );

      const payload = {
        name: temple.name,
        state: temple.state,
        location: temple.location,
        image: storedImage,
        banner_image: storedBanner,
        description: temple.description,
        contact: temple.contact,
        booking_link: temple.booking_link,
      };

      if (idToUpsert) {
        const { error } = await supabase.from("temples").update(payload).eq("id", idToUpsert);
        throwOnSupabaseError(error, "Temple update");
      } else {
        const { error } = await supabase.from("temples").insert({
          ...payload,
          id: undefined, // auto generate UUID
        });
        throwOnSupabaseError(error, "Temple insert");
      }

      await refreshContent();
    },
    [supabase, ensureAdmin, refreshContent, temples]
  );

  const deleteTemple = useCallback(
    async (id: string) => {
      ensureAdmin();
      const { error } = await supabase.from("temples").delete().eq("id", id);
      throwOnSupabaseError(error, "Temple delete");
      await refreshContent();
    },
    [supabase, ensureAdmin, refreshContent]
  );

  const saveDeity = useCallback(
    async (deity: Deity) => {
      ensureAdmin();

      let compressedImageUrl = deity.imageUrl;
      if (deity.imageUrl && deity.imageUrl.startsWith("data:image/") && deity.imageUrl.length > 100000) {
        try {
          compressedImageUrl = await compressImage(deity.imageUrl);
        } catch (e) {
          console.error("Failed to compress deity image:", e);
        }
      }

      const idToUpsert = deities.some((item) => String(item.id) === String(deity.id)) ? String(deity.id) : undefined;

      const storedImageUrl = await persistImageAsset(
        compressedImageUrl,
        "deities",
        deity.id,
        deity.nameEn || deity.name
      );

      const payload = {
        deity_name: deity.nameEn,
        name_te: deity.name,
        gender: deity.gender,
        image_hint: deity.imageHint,
        image_url: storedImageUrl,
        ashtotharam_url: deity.ashtotharamUrl,
        sahasranamam_url: deity.sahasranamamUrl,
        reading_slug: deity.readingSlug,
      };

      if (idToUpsert) {
        const { error } = await supabase.from("stotrams").update(payload).eq("id", idToUpsert);
        throwOnSupabaseError(error, "Deity update");
      } else {
        const { error } = await supabase.from("stotrams").insert({
          ...payload,
          id: undefined, // auto generate UUID
        });
        throwOnSupabaseError(error, "Deity insert");
      }

      await refreshContent();
    },
    [supabase, ensureAdmin, refreshContent, deities]
  );

  const deleteDeity = useCallback(
    async (id: string) => {
      ensureAdmin();
      const { error } = await supabase.from("stotrams").delete().eq("id", id);
      throwOnSupabaseError(error, "Deity delete");
      await refreshContent();
    },
    [supabase, ensureAdmin, refreshContent]
  );

  const saveRegion = useCallback(
    async (region: Region) => {
      ensureAdmin();

      const idToUpsert = regions.some((item) => String(item.id) === String(region.id)) ? String(region.id) : undefined;

      const payload = {
        name: region.name,
      };

      if (idToUpsert) {
        const { error } = await supabase.from("regions").update(payload).eq("id", idToUpsert);
        throwOnSupabaseError(error, "Region update");
      } else {
        const { error } = await supabase.from("regions").insert({
          ...payload,
          id: undefined, // auto generate UUID
        });
        throwOnSupabaseError(error, "Region insert");
      }

      await refreshContent();
    },
    [supabase, ensureAdmin, refreshContent, regions]
  );

  const deleteRegion = useCallback(
    async (id: string) => {
      ensureAdmin();
      const { error } = await supabase.from("regions").delete().eq("id", id);
      throwOnSupabaseError(error, "Region delete");
      await refreshContent();
    },
    [supabase, ensureAdmin, refreshContent]
  );

  const value = useMemo<ContentContextValue>(
    () => ({
      pujas,
      pujaris,
      temples,
      regions,
      deities,
      contact,
      settings,
      requests,
      isLoading,
      savePuja,
      deletePuja,
      savePujari,
      deletePujari,
      saveTemple,
      deleteTemple,
      saveRegion,
      deleteRegion,
      saveDeity,
      deleteDeity,
      saveContact,
      saveSettings,
      submitJoinRequest,
      approveJoinRequest,
      rejectJoinRequest,
      resetContent,
    }),
    [
      pujas,
      pujaris,
      temples,
      regions,
      deities,
      contact,
      settings,
      requests,
      isLoading,
      savePuja,
      deletePuja,
      savePujari,
      deletePujari,
      saveTemple,
      deleteTemple,
      saveRegion,
      deleteRegion,
      saveDeity,
      deleteDeity,
      saveContact,
      saveSettings,
      submitJoinRequest,
      approveJoinRequest,
      rejectJoinRequest,
      resetContent,
    ]
  );

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}
