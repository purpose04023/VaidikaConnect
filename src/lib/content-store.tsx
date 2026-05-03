"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Puja, Pujari } from "@/lib/data";
import { defaultPujaris, defaultPujas } from "@/lib/data";

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
  id: number;
  name: string;
  photo: string;
  phone: string;
  email: string;
  city: string;
  qualifications: string[];
  languages: string[];
  experience: number;
  basePrice: number;
  maxParticipants: number;
  pujas: number[];
  description: string;
  submittedAt: string;
}

interface ContentState {
  pujas: Puja[];
  pujaris: Pujari[];
  contact: ContactContent;
  requests: PujariJoinRequest[];
}

interface ContentContextValue extends ContentState {
  savePuja: (puja: Puja) => void;
  deletePuja: (id: number) => void;
  savePujari: (pujari: Pujari) => void;
  deletePujari: (id: number) => void;
  saveContact: (contact: ContactContent) => void;
  submitJoinRequest: (request: Omit<PujariJoinRequest, "id" | "submittedAt">) => void;
  approveJoinRequest: (id: number) => void;
  rejectJoinRequest: (id: number) => void;
  resetContent: () => void;
}

const STORAGE_KEY = "vaidika-connect-content-v1";

export const defaultContact: ContactContent = {
  title: "Contact VaidikaConnect",
  subtitle: "Reach our team for puja bookings, priest onboarding, and ceremony support.",
  phone: "+91 98765 43210",
  email: "support@vaidikaconnect.in",
  address: "Chandramouli Nagar, Guntur, Andhra Pradesh",
  hours: "Daily, 7:00 AM - 9:00 PM",
  whatsapp: "+91 98765 43210",
  mapUrl: "https://maps.google.com/?q=Guntur%20Andhra%20Pradesh",
};

const fallbackPhoto = "https://images.unsplash.com/photo-1570839753356-6bc05ceea49a?auto=format&fit=crop&w=1200&q=80";

function withDefaultVerification(pujari: Pujari): Pujari {
  return {
    ...pujari,
    verified: pujari.verified ?? true,
    verifiedBy: pujari.verifiedBy ?? "VaidikaConnect",
    verifiedAt: pujari.verifiedAt ?? "2026-05-03",
  };
}

function createInitialState(): ContentState {
  return {
    pujas: defaultPujas,
    pujaris: defaultPujaris.map(withDefaultVerification),
    contact: defaultContact,
    requests: [],
  };
}

function nextId(items: { id: number }[]) {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ContentState>(() => createInitialState());

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as Partial<ContentState>;
      setState({
        pujas: parsed.pujas?.length ? parsed.pujas : defaultPujas,
        pujaris: parsed.pujaris?.length ? parsed.pujaris.map(withDefaultVerification) : defaultPujaris.map(withDefaultVerification),
        contact: { ...defaultContact, ...parsed.contact },
        requests: parsed.requests ?? [],
      });
    } catch {
      setState(createInitialState());
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const savePuja = useCallback((puja: Puja) => {
    setState(current => ({
      ...current,
      pujas: current.pujas.some(item => item.id === puja.id)
        ? current.pujas.map(item => item.id === puja.id ? puja : item)
        : [...current.pujas, { ...puja, id: puja.id || nextId(current.pujas) }],
    }));
  }, []);

  const deletePuja = useCallback((id: number) => {
    setState(current => ({
      ...current,
      pujas: current.pujas.filter(puja => puja.id !== id),
      pujaris: current.pujaris.map(pujari => ({
        ...pujari,
        pujas: pujari.pujas.filter(pujaId => pujaId !== id),
      })),
    }));
  }, []);

  const savePujari = useCallback((pujari: Pujari) => {
    setState(current => {
      const normalized = {
        ...pujari,
        id: pujari.id || nextId(current.pujaris),
        photo: pujari.photo || fallbackPhoto,
        photoHint: pujari.photoHint || "indian pujari",
      };

      return {
        ...current,
        pujaris: current.pujaris.some(item => item.id === normalized.id)
          ? current.pujaris.map(item => item.id === normalized.id ? normalized : item)
          : [...current.pujaris, normalized],
      };
    });
  }, []);

  const deletePujari = useCallback((id: number) => {
    setState(current => ({
      ...current,
      pujaris: current.pujaris.filter(pujari => pujari.id !== id),
    }));
  }, []);

  const saveContact = useCallback((contact: ContactContent) => {
    setState(current => ({ ...current, contact }));
  }, []);

  const submitJoinRequest = useCallback((request: Omit<PujariJoinRequest, "id" | "submittedAt">) => {
    setState(current => ({
      ...current,
      requests: [
        {
          ...request,
          id: nextId(current.requests),
          photo: request.photo || fallbackPhoto,
          submittedAt: new Date().toISOString(),
        },
        ...current.requests,
      ],
    }));
  }, []);

  const approveJoinRequest = useCallback((id: number) => {
    setState(current => {
      const request = current.requests.find(item => item.id === id);
      if (!request) {
        return current;
      }

      const pujari: Pujari = {
        id: nextId(current.pujaris),
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
        location: { lat: 16.3067, lng: 80.4367 },
        description: request.description,
        phone: request.phone,
        gallery: [],
        reviews: [],
      };

      return {
        ...current,
        pujaris: [...current.pujaris, pujari],
        requests: current.requests.filter(item => item.id !== id),
      };
    });
  }, []);

  const rejectJoinRequest = useCallback((id: number) => {
    setState(current => ({
      ...current,
      requests: current.requests.filter(item => item.id !== id),
    }));
  }, []);

  const resetContent = useCallback(() => {
    setState(createInitialState());
  }, []);

  const value = useMemo<ContentContextValue>(() => ({
    ...state,
    savePuja,
    deletePuja,
    savePujari,
    deletePujari,
    saveContact,
    submitJoinRequest,
    approveJoinRequest,
    rejectJoinRequest,
    resetContent,
  }), [state, savePuja, deletePuja, savePujari, deletePujari, saveContact, submitJoinRequest, approveJoinRequest, rejectJoinRequest, resetContent]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}
