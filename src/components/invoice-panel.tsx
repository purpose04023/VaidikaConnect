"use client";

import { Receipt, Info } from "lucide-react";
import { computeInvoice, formatINR } from "@/lib/invoice";

interface InvoicePanelProps {
  dakshina: number;
  pujaName?: string;
}

/**
 * InvoicePanel — displays the split Pure-Agent GST invoice.
 * Priest Dakshina is GST-exempt; only the convenience fee is taxed at 18%.
 */
export function InvoicePanel({ dakshina, pujaName }: InvoicePanelProps) {
  const inv = computeInvoice(dakshina);

  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50 dark:bg-amber-950/20 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Receipt className="h-5 w-5 text-amber-600" />
        <h3 className="font-semibold text-amber-800 dark:text-amber-300">
          {pujaName ? `${pujaName} — ` : ""}Invoice Breakdown
        </h3>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Priest Dakshina</span>
          <span className="font-medium text-foreground">{formatINR(inv.dakshina)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Platform Fee (5%)
          </span>
          <span className="font-medium text-foreground">{formatINR(inv.convenienceFee)}</span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground/70">
          <span className="pl-3">GST @ 18% on Platform Fee</span>
          <span>{formatINR(inv.gstOnFee)}</span>
        </div>
        <div className="border-t border-amber-200 dark:border-amber-800 pt-2 flex justify-between font-bold text-base">
          <span className="text-foreground">Total Payable</span>
          <span className="text-amber-700 dark:text-amber-400">{formatINR(inv.total)}</span>
        </div>
      </div>

      <div className="flex gap-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 p-3 text-xs text-amber-700 dark:text-amber-300">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <span>
          VaidikaConnect acts as a <strong>Pure Agent</strong> under Indian GST law. Priest Dakshina is
          collected on behalf of the Purohit and is <strong>not subject to GST</strong>. The Platform
          Fee of 5% + 18% GST is the only taxable component.
        </span>
      </div>
    </div>
  );
}
