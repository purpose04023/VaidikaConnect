"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Puja, Pujari } from "@/lib/data";
import { defaultPujaris, defaultPujas } from "@/lib/data";
import type { Deity } from "@/lib/data/stotrams";
import { stotramsData as defaultDeities } from "@/lib/data/stotrams";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  addDoc,
  Firestore,
} from "firebase/firestore";
import { useFirebase } from "@/firebase";
import { isAdminEmail } from "@/lib/admin";
import { compressImage } from "@/lib/utils";


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

export interface PujariJoinRequest {
  id: string; // Firestore document ID (string)
  name: string;
  photo: string;
  phone: string;
  email: string;
  city: string;
  location: string; // Google Maps link or address text
  qualifications: string[];
  languages: string[];
  experience: number;
  basePrice: number;
  maxParticipants: number;
  pujas: number[];
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
  deities: Deity[];
  contact: ContactContent;
  requests: PujariJoinRequest[];
  isLoading: boolean;
  savePuja: (puja: Puja) => Promise<void>;
  deletePuja: (id: number) => Promise<void>;
  savePujari: (pujari: Pujari) => Promise<void>;
  deletePujari: (id: number) => Promise<void>;
  saveDeity: (deity: Deity) => Promise<void>;
  deleteDeity: (id: string) => Promise<void>;
  saveContact: (contact: ContactContent) => Promise<void>;
  submitJoinRequest: (
    request: Omit<PujariJoinRequest, "id" | "submittedAt">
  ) => Promise<void>;
  approveJoinRequest: (id: string) => Promise<void>;
  rejectJoinRequest: (id: string) => Promise<void>;
  resetContent: () => Promise<void>;
}

// Firestore paths
const APP_DATA_COLLECTION = "appData";
const PUJAS_DOC = "pujas";
const PUJARIS_DOC = "pujaris";
const DEITIES_DOC = "deities";
const CONTACT_DOC = "contact";
const REQUESTS_COLLECTION = "joinRequests";

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

function withDefaultVerification(pujari: Pujari): Pujari {
  return {
    ...pujari,
    verified: pujari.verified ?? true,
    verifiedBy: pujari.verifiedBy ?? "VaidikaConnect",
    verifiedAt: pujari.verifiedAt ?? "2026-05-03",
  };
}

function nextId(items: { id: number }[]) {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

// Firestore helpers

async function writePujas(db: Firestore, pujas: Puja[]) {
  const cleaned = await Promise.all(
    pujas.map(async (item) => {
      if (item.image && item.image.startsWith("data:image/") && item.image.length > 100000) {
        try {
          const compressed = await compressImage(item.image);
          return { ...item, image: compressed };
        } catch (e) {
          console.error("Failed to compress bloated puja image:", e);
        }
      }
      return item;
    })
  );
  await setDoc(doc(db, APP_DATA_COLLECTION, PUJAS_DOC), { items: cleaned });
}

async function writePujaris(db: Firestore, pujaris: Pujari[]) {
  const cleaned = await Promise.all(
    pujaris.map(async (item) => {
      if (item.photo && item.photo.startsWith("data:image/") && item.photo.length > 100000) {
        try {
          const compressed = await compressImage(item.photo);
          return { ...item, photo: compressed };
        } catch (e) {
          console.error("Failed to compress bloated pujari photo:", e);
        }
      }
      return item;
    })
  );
  await setDoc(doc(db, APP_DATA_COLLECTION, PUJARIS_DOC), { items: cleaned });
}

async function writeDeities(db: Firestore, deities: Deity[]) {
  const cleaned = await Promise.all(
    deities.map(async (item) => {
      if (item.imageUrl && item.imageUrl.startsWith("data:image/") && item.imageUrl.length > 100000) {
        try {
          const compressed = await compressImage(item.imageUrl);
          return { ...item, imageUrl: compressed };
        } catch (e) {
          console.error("Failed to compress bloated deity image:", e);
        }
      }
      return item;
    })
  );
  await setDoc(doc(db, APP_DATA_COLLECTION, DEITIES_DOC), { items: cleaned });
}

// Context

const ContentContext = createContext<ContentContextValue | undefined>(
  undefined
);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const { firestore: db, user, isUserLoading } = useFirebase();
  const isAdmin = isAdminEmail(user?.email);

  const [pujas, setPujas] = useState<Puja[]>(defaultPujas);
  const [pujaris, setPujaris] = useState<Pujari[]>(
    defaultPujaris.map(withDefaultVerification)
  );
  const [deities, setDeities] = useState<Deity[]>(defaultDeities);
  const [contact, setContact] = useState<ContactContent>(defaultContact);
  const [requests, setRequests] = useState<PujariJoinRequest[]>([]);
  const [loadedContent, setLoadedContent] = useState({
    pujas: false,
    pujaris: false,
    deities: false,
    contact: false,
  });
  const isLoading =
    !loadedContent.pujas || !loadedContent.pujaris || !loadedContent.deities || !loadedContent.contact;

  const ensureAdmin = useCallback(() => {
    if (!isAdmin || isUserLoading) {
      throw new Error("Admin access is required to change shared content.");
    }
  }, [isAdmin, isUserLoading]);

  // Real-time Firestore listeners

  // Pujas listener
  useEffect(() => {
    const ref = doc(db, APP_DATA_COLLECTION, PUJAS_DOC);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists() && Array.isArray(snap.data()?.items)) {
          setPujas(snap.data().items as Puja[]);
        } else {
          // First load: seed Firestore with defaults when an admin is present.
          if (isAdmin) {
            writePujas(db, defaultPujas).catch(console.error);
          }
          setPujas(defaultPujas);
        }
        setLoadedContent((current) => ({ ...current, pujas: true }));
      },
      (err) => {
        console.error("Firestore pujas listener error:", err);
        setPujas(defaultPujas);
        setLoadedContent((current) => ({ ...current, pujas: true }));
      }
    );
    return unsub;
  }, [db, isAdmin]);

  // Pujaris listener
  useEffect(() => {
    const ref = doc(db, APP_DATA_COLLECTION, PUJARIS_DOC);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists() && Array.isArray(snap.data()?.items)) {
          setPujaris(
            (snap.data().items as Pujari[]).map(withDefaultVerification)
          );
        } else {
          // First load: seed Firestore with defaults when an admin is present.
          if (isAdmin) {
            writePujaris(
              db,
              defaultPujaris.map(withDefaultVerification)
            ).catch(console.error);
          }
          setPujaris(defaultPujaris.map(withDefaultVerification));
        }
        setLoadedContent((current) => ({ ...current, pujaris: true }));
      },
      (err) => {
        console.error("Firestore pujaris listener error:", err);
        setPujaris(defaultPujaris.map(withDefaultVerification));
        setLoadedContent((current) => ({ ...current, pujaris: true }));
      }
    );
    return unsub;
  }, [db, isAdmin]);

  // Contact listener
  useEffect(() => {
    const ref = doc(db, APP_DATA_COLLECTION, CONTACT_DOC);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setContact({ ...defaultContact, ...(snap.data() as ContactContent) });
        } else {
          // First load: seed Firestore with defaults when an admin is present.
          if (isAdmin) {
            setDoc(ref, defaultContact).catch(console.error);
          }
          setContact(defaultContact);
        }
        setLoadedContent((current) => ({ ...current, contact: true }));
      },
      (err) => {
        console.error("Firestore contact listener error:", err);
        setContact(defaultContact);
        setLoadedContent((current) => ({ ...current, contact: true }));
      }
    );
    return unsub;
  }, [db, isAdmin]);

  // Join Requests listener
  useEffect(() => {
    if (isUserLoading) {
      return;
    }

    if (!isAdmin) {
      setRequests([]);
      return;
    }

    const ref = collection(db, REQUESTS_COLLECTION);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        const items: PujariJoinRequest[] = snap.docs.map((d) => ({
          ...(d.data() as Omit<PujariJoinRequest, "id">),
          id: d.id,
        }));
        // Sort newest first
        items.sort(
          (a, b) =>
            new Date(b.submittedAt).getTime() -
            new Date(a.submittedAt).getTime()
        );
        setRequests(items);
      },
      (err) => {
        console.error("Firestore joinRequests listener error:", err);
        setRequests([]);
      }
    );
    return unsub;
  }, [db, isAdmin, isUserLoading]);

  // Write operations

  const savePuja = useCallback(
    async (puja: Puja) => {
      ensureAdmin();
      const updated = pujas.some((item) => item.id === puja.id)
        ? pujas.map((item) => (item.id === puja.id ? puja : item))
        : [...pujas, { ...puja, id: puja.id || nextId(pujas) }];
      setPujas(updated); // Optimistic UI update
      await writePujas(db, updated);
    },
    [db, ensureAdmin, pujas]
  );

  const deletePuja = useCallback(
    async (id: number) => {
      ensureAdmin();
      const updatedPujas = pujas.filter((p) => p.id !== id);
      const updatedPujaris = pujaris.map((pr) => ({
        ...pr,
        pujas: pr.pujas.filter((pujaId) => pujaId !== id),
      }));
      setPujas(updatedPujas); // Optimistic update
      setPujaris(updatedPujaris); // Optimistic update
      await Promise.all([
        writePujas(db, updatedPujas),
        writePujaris(db, updatedPujaris),
      ]);
    },
    [db, ensureAdmin, pujas, pujaris]
  );

  const savePujari = useCallback(
    async (pujari: Pujari) => {
      ensureAdmin();
      const normalized: Pujari = {
        ...pujari,
        id: pujari.id || nextId(pujaris),
        photo: pujari.photo || fallbackPhoto,
        photoHint: pujari.photoHint || "indian pujari",
      };
      const updated = pujaris.some((item) => item.id === normalized.id)
        ? pujaris.map((item) => (item.id === normalized.id ? normalized : item))
        : [...pujaris, normalized];
      setPujaris(updated); // Optimistic update
      await writePujaris(db, updated);
    },
    [db, ensureAdmin, pujaris]
  );

  const deletePujari = useCallback(
    async (id: number) => {
      ensureAdmin();
      const updated = pujaris.filter((p) => p.id !== id);
      setPujaris(updated); // Optimistic update
      await writePujaris(db, updated);
    },
    [db, ensureAdmin, pujaris]
  );

  const saveContact = useCallback(
    async (contact: ContactContent) => {
      ensureAdmin();
      setContact(contact); // Optimistic update
      await setDoc(doc(db, APP_DATA_COLLECTION, CONTACT_DOC), contact);
    },
    [db, ensureAdmin]
  );

  const submitJoinRequest = useCallback(
    async (request: Omit<PujariJoinRequest, "id" | "submittedAt">) => {
      const data = {
        ...request,
        photo: request.photo || fallbackPhoto,
        submittedAt: new Date().toISOString(),
      };
      await addDoc(collection(db, REQUESTS_COLLECTION), data);
    },
    [db]
  );

  const approveJoinRequest = useCallback(
    async (id: string) => {
      ensureAdmin();
      const request = requests.find((item) => item.id === id);
      if (!request) return;

      const newPujari: Pujari = {
        id: nextId(pujaris),
        name: request.name,
        photo: request.photo || fallbackPhoto,
        photoHint: "verified pujari",
        verified: true,
        verifiedBy: "VaidikaConnect",
        verifiedAt: new Date().toISOString().slice(0, 10),
        rating: 5,
        reviewCount: 0,
        basePrice: request.basePrice,
        qualifications: request.qualifications,
        languages: request.languages,
        experience: request.experience,
        pujas: request.pujas,
        maxParticipants: request.maxParticipants,
        location: { lat: request.lat || 16.3067, lng: request.lng || 80.4367 },
        description: request.description,
        phone: request.phone,
        whatsapp: request.whatsapp || request.phone,
        availableTimings: request.availableTimings || "Morning Slot, Evening Slot",
        gallery: [],
        reviews: [],
      };

      const updatedPujaris = [...pujaris, newPujari];
      setPujaris(updatedPujaris); // Optimistic update
      setRequests(current => current.filter(r => r.id !== id));

      await Promise.all([
        writePujaris(db, updatedPujaris),
        deleteDoc(doc(db, REQUESTS_COLLECTION, id)),
      ]);
    },
    [db, ensureAdmin, requests, pujaris]
  );

  const rejectJoinRequest = useCallback(
    async (id: string) => {
      ensureAdmin();
      setRequests(current => current.filter(r => r.id !== id)); // Optimistic update
      await deleteDoc(doc(db, REQUESTS_COLLECTION, id));
    },
    [db, ensureAdmin]
  );

  const resetContent = useCallback(async () => {
    ensureAdmin();
    setPujas(defaultPujas);
    setPujaris(defaultPujaris.map(withDefaultVerification));
    setDeities(defaultDeities);
    setContact(defaultContact);
    setRequests([]);
    
    await Promise.all([
      writePujas(db, defaultPujas),
      writePujaris(db, defaultPujaris.map(withDefaultVerification)),
      writeDeities(db, defaultDeities),
      setDoc(doc(db, APP_DATA_COLLECTION, CONTACT_DOC), defaultContact),
    ]);
    // Clear all join requests
    await Promise.all(
      requests.map((r) => deleteDoc(doc(db, REQUESTS_COLLECTION, r.id)))
    );
  }, [db, ensureAdmin, requests]);

  const saveDeity = useCallback(
    async (deity: Deity) => {
      ensureAdmin();
      const updated = deities.some((item) => item.id === deity.id)
        ? deities.map((item) => (item.id === deity.id ? deity : item))
        : [...deities, deity];
      setDeities(updated); // Optimistic UI update
      await writeDeities(db, updated);
    },
    [db, ensureAdmin, deities]
  );

  const deleteDeity = useCallback(
    async (id: string) => {
      ensureAdmin();
      const updatedDeities = deities.filter((d) => d.id !== id);
      setDeities(updatedDeities); // Optimistic update
      await writeDeities(db, updatedDeities);
    },
    [db, ensureAdmin, deities]
  );

  // Context value

  const value = useMemo<ContentContextValue>(
    () => ({
      pujas,
      pujaris,
      deities,
      contact,
      requests,
      isLoading,
      savePuja,
      deletePuja,
      savePujari,
      deletePujari,
      saveDeity,
      deleteDeity,
      saveContact,
      submitJoinRequest,
      approveJoinRequest,
      rejectJoinRequest,
      resetContent,
    }),
    [
      pujas,
      pujaris,
      deities,
      contact,
      requests,
      isLoading,
      savePuja,
      deletePuja,
      savePujari,
      deletePujari,
      saveDeity,
      deleteDeity,
      saveContact,
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
