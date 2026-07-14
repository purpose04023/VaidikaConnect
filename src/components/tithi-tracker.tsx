"use client";

import { useState } from "react";
import { Moon, Bell, ExternalLink } from "lucide-react";
import { getTithiName, getReminderDates, whatsappReminderLink } from "@/lib/tithi";

interface TithiTrackerProps {
  /** Gregorian date of annual Shraddha/Tarpanam ceremony (YYYY-MM-DD) */
  ceremonyDate?: string;
  pujaName?: string;
  whatsappPhone?: string;
}

/**
 * TithiTracker — shows the Tithi for the upcoming ceremony date and
 * lets users open pre-filled WhatsApp reminder messages at 14, 7, 3 days prior.
 */
export function TithiTracker({ ceremonyDate, pujaName = "Shraddha", whatsappPhone }: TithiTrackerProps) {
  const [inputDate, setInputDate] = useState(ceremonyDate ?? "");

  const date = inputDate ? new Date(inputDate) : null;
  const tithiName = date && !isNaN(date.getTime()) ? getTithiName(date) : null;
  const reminders = date && !isNaN(date.getTime()) ? getReminderDates(date) : [];
  const phone = whatsappPhone?.replace(/\D/g, "") ?? "";

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/20 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Moon className="h-5 w-5 text-indigo-500" />
        <h3 className="font-semibold text-indigo-800 dark:text-indigo-300">
          Tithi Tracker — {pujaName}
        </h3>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="tithi-date">
          Ceremony Date
        </label>
        <input
          id="tithi-date"
          type="date"
          value={inputDate}
          onChange={e => setInputDate(e.target.value)}
          className="w-full rounded-lg border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {tithiName && (
          <p className="text-sm text-indigo-700 dark:text-indigo-300">
            🌙 This date falls on <strong>{tithiName}</strong> Tithi.
          </p>
        )}
      </div>

      {reminders.length > 0 && (
        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Bell className="h-4 w-4" /> WhatsApp Reminders
          </p>
          <div className="flex flex-col gap-2">
            {reminders.map(({ days, date: rd }) => (
              phone ? (
                <a
                  key={days}
                  href={whatsappReminderLink(phone, date!, days, pujaName)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                >
                  <span>
                    {days} days before —{" "}
                    {rd.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 ml-2 shrink-0" />
                </a>
              ) : (
                <div
                  key={days}
                  className="rounded-lg border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-muted-foreground"
                >
                  {days} days before —{" "}
                  {rd.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  <span className="ml-2 text-xs italic">(add WhatsApp number in profile to enable)</span>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
