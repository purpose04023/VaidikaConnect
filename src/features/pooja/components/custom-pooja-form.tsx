"use client";

import { useState } from "react";
import { useContent } from "@/lib/content-store";
import { useUser } from "@/hooks/use-auth";
import { Loader2, Check } from "lucide-react";

export function CustomPoojaForm() {
  const { contact } = useContent();
  const { user } = useUser();
  const adminPhone = contact?.phone || "+91 98765 43210";

  // Form Field States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [poojaDescription, setPoojaDescription] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("Morning 6–9am");
  const [panditCount, setPanditCount] = useState("1");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("₹2,000–₹5,000");
  const [notes, setNotes] = useState("");

  // UI Status States
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("idle");

    try {
      const response = await fetch("/api/custom-pooja-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id || null,
          name,
          phone,
          poojaDescription,
          preferredDate,
          preferredTime,
          panditCount,
          location,
          budget,
          notes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit request");
      }

      // Save a mock request in localStorage for local testing
      try {
        const mockReq = {
          id: "mock-uuid-" + Math.random().toString(36).substring(2, 11),
          user_id: user?.id || null,
          name,
          phone,
          pooja_description: poojaDescription,
          preferred_date: preferredDate,
          preferred_time: preferredTime,
          pandit_count: panditCount,
          location,
          budget,
          notes: notes || null,
          status: "new",
          created_at: new Date().toISOString()
        };
        const existing = JSON.parse(localStorage.getItem("mock_custom_pooja_requests") || "[]");
        existing.push(mockReq);
        localStorage.setItem("mock_custom_pooja_requests", JSON.stringify(existing));
      } catch (e) {
        console.error("Local storage error:", e);
      }

      setStatus("success");
    } catch (error) {
      console.error("Custom pooja request submission error:", error);
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "success") {
    return (
      <div className="overflow-hidden shadow-lg border border-border/50 rounded-2xl bg-card p-6 md:p-8 max-w-2xl mx-auto text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
          <Check className="h-8 w-8" />
        </div>
        <h3 className="font-headline text-2xl text-primary font-bold">Request Received</h3>
        <p className="text-foreground text-base leading-relaxed">
          🙏 Thank you, <strong className="text-primary font-semibold">{name}</strong>! We've received your request for{" "}
          <strong className="text-primary font-semibold">{poojaDescription}</strong>. Our team will call you on{" "}
          <strong className="text-primary font-semibold">{phone}</strong> within 2 hours to confirm your booking.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow-lg border border-border/50 rounded-2xl bg-card p-6 md:p-8 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-semibold text-foreground">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-border/50 bg-background px-3.5 py-2 text-base placeholder:text-muted-foreground focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] transition-all"
              placeholder="Your full name"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-semibold text-foreground">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-border/50 bg-background px-3.5 py-2 text-base placeholder:text-muted-foreground focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] transition-all"
              placeholder="10-digit mobile number"
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit phone number"
            />
          </div>
        </div>

        {/* Pooja Description */}
        <div className="space-y-2">
          <label htmlFor="poojaDescription" className="text-sm font-semibold text-foreground">
            Pooja Name / Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="poojaDescription"
            required
            rows={3}
            value={poojaDescription}
            onChange={(e) => setPoojaDescription(e.target.value)}
            className="flex min-h-[90px] w-full rounded-xl border border-border/50 bg-background px-3.5 py-2.5 text-base placeholder:text-muted-foreground focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] transition-all resize-y"
            placeholder="e.g. Bonalu for Ammavari, Gruhapravesam for new house in Guntur, or describe in Telugu/Hindi"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Preferred Date */}
          <div className="space-y-2">
            <label htmlFor="preferredDate" className="text-sm font-semibold text-foreground">
              Preferred Date <span className="text-red-500">*</span>
            </label>
            <input
              id="preferredDate"
              type="date"
              required
              min={today}
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-border/50 bg-background px-3.5 py-2 text-base placeholder:text-muted-foreground focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] transition-all [color-scheme:dark]"
            />
          </div>

          {/* Preferred Time */}
          <div className="space-y-2">
            <label htmlFor="preferredTime" className="text-sm font-semibold text-foreground">
              Preferred Time <span className="text-red-500">*</span>
            </label>
            <select
              id="preferredTime"
              required
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-border/50 bg-background px-3.5 py-2 text-base focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] transition-all appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23a1a1aa%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right_16px_center] bg-no-repeat pr-10"
            >
              <option value="Morning 6–9am">Morning 6–9am</option>
              <option value="Morning 9–12pm">Morning 9–12pm</option>
              <option value="Afternoon 12–3pm">Afternoon 12–3pm</option>
              <option value="Evening 3–6pm">Evening 3–6pm</option>
              <option value="Evening 6–9pm">Evening 6–9pm</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Number of Pandits */}
          <div className="space-y-2">
            <label htmlFor="panditCount" className="text-sm font-semibold text-foreground">
              Number of Pandits Needed <span className="text-red-500">*</span>
            </label>
            <select
              id="panditCount"
              required
              value={panditCount}
              onChange={(e) => setPanditCount(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-border/50 bg-background px-3.5 py-2 text-base focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] transition-all appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23a1a1aa%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right_16px_center] bg-no-repeat pr-10"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="Not Sure">Not Sure</option>
            </select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-semibold text-foreground">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              id="location"
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-border/50 bg-background px-3.5 py-2 text-base placeholder:text-muted-foreground focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] transition-all"
              placeholder="Your area, Guntur"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Budget Range */}
          <div className="space-y-2">
            <label htmlFor="budget" className="text-sm font-semibold text-foreground">
              Budget Range <span className="text-red-500">*</span>
            </label>
            <select
              id="budget"
              required
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-border/50 bg-background px-3.5 py-2 text-base focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] transition-all appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23a1a1aa%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right_16px_center] bg-no-repeat pr-10"
            >
              <option value="Under ₹2,000 font-semibold">Under ₹2,000</option>
              <option value="₹2,000–₹5,000">₹2,000–₹5,000</option>
              <option value="₹5,000–₹10,000">₹5,000–₹10,000</option>
              <option value="Above ₹10,000">Above ₹10,000</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-semibold text-foreground">
              Additional Notes
            </label>
            <input
              id="notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-border/50 bg-background px-3.5 py-2 text-base placeholder:text-muted-foreground focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] transition-all"
              placeholder="Any specific traditions, languages, etc."
            />
          </div>
        </div>

        {/* Error State */}
        {status === "error" && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl">
            Something went wrong. Please call us directly at <strong className="font-bold underline">{adminPhone}</strong>.
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-base font-bold shadow-md h-auto bg-[#c9a84c] text-black hover:bg-[#b0913f] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <span>Request Pooja &rarr;</span>
          )}
        </button>
      </form>
    </div>
  );
}
