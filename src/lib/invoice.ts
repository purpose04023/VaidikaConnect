/**
 * GST Invoice utilities — VaidikaConnect "Pure Agent" model
 *
 * Under Indian GST, the platform acts as a Pure Agent:
 *   - Priest Dakshina is passed through at cost → GST exempt
 *   - VaidikaConnect Convenience Fee → 18% GST taxable
 *
 * ponytail: plain arithmetic, no tax library needed at this scale.
 */

export const CONVENIENCE_FEE_PERCENT = 0.05; // 5% of dakshina
export const GST_RATE = 0.18;

export interface InvoiceBreakdown {
  dakshina: number;         // Priest Dakshina (GST exempt, passed through)
  convenienceFee: number;   // Platform fee (taxable)
  gstOnFee: number;         // 18% GST on convenience fee only
  total: number;
}

/** Compute the full split-GST invoice from the dakshina (priest fee) amount. */
export function computeInvoice(dakshina: number): InvoiceBreakdown {
  const convenienceFee = Math.round(dakshina * CONVENIENCE_FEE_PERCENT);
  const gstOnFee = Math.round(convenienceFee * GST_RATE);
  return {
    dakshina,
    convenienceFee,
    gstOnFee,
    total: dakshina + convenienceFee + gstOnFee,
  };
}

/** Format a number as Indian Rupees. */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}
