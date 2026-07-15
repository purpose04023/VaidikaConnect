import { computeInvoice } from "./invoice";

/**
 * VaidikaConnect billing and taxation helper.
 * Section 393(1) TDS rate = 0.1% on priest dakshina if cumulative platform revenue exceeds ₹5,00,000.
 */
export interface BillingDetails {
  priest_dakshina: number;
  platform_fee: number;
  gst_on_fee: number;
  tds_deducted: number;
  net_payout_to_priest: number;
  total_payable: number;
}

/**
 * Calculates billing details for a transaction.
 * @param dakshina The base priest dakshina amount
 * @param priestCumulativeRevenue Optional cumulative revenue to check TDS applicability
 */
export function calculateBilling(
  dakshina: number,
  priestCumulativeRevenue: number = 0
): BillingDetails {
  const invoice = computeInvoice(dakshina);
  
  // Section 393(1): 0.1% TDS if cumulative gross platform revenue exceeds ₹5,00,000
  const TDS_THRESHOLD = 500000;
  const TDS_RATE = 0.001; // 0.1%
  
  let tds_deducted = 0;
  if (priestCumulativeRevenue > TDS_THRESHOLD) {
    tds_deducted = Math.round(dakshina * TDS_RATE * 100) / 100;
  }
  
  return {
    priest_dakshina: dakshina,
    platform_fee: invoice.convenienceFee,
    gst_on_fee: invoice.gstOnFee,
    tds_deducted,
    net_payout_to_priest: dakshina - tds_deducted,
    total_payable: invoice.total
  };
}

/**
 * Sends a webhook payload to the n8n/Make.com endpoint upon payment success.
 */
export async function sendPaymentWebhook(payload: {
  userName: string;
  userPhone: string;
  bookingId: string;
  pujaName: string;
  billing: BillingDetails;
}) {
  const webhookUrl = process.env.MAKE_WEBHOOK_URL || "https://hook.us1.make.com/mock-webhook-id";
  const mockPdfUrl = `https://vaidika-connect.vercel.app/api/invoices/download?id=${payload.bookingId}`;
  
  const body = {
    event: "payment.success",
    booking_id: payload.bookingId,
    user_name: payload.userName,
    user_phone: payload.userPhone,
    puja_name: payload.pujaName,
    cost_breakdown: {
      priest_dakshina: payload.billing.priest_dakshina,
      platform_fee: payload.billing.platform_fee,
      gst_on_fee: payload.billing.gst_on_fee,
      tds_deducted: payload.billing.tds_deducted,
      net_payout_to_priest: payload.billing.net_payout_to_priest,
      total_payable: payload.billing.total_payable
    },
    invoice_pdf_url: mockPdfUrl,
    timestamp: new Date().toISOString()
  };

  console.log("Triggering Make.com/n8n payment success webhook with payload:", JSON.stringify(body, null, 2));

  // ponytail: standard fetch with no external deps
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    return { success: response.ok, status: response.status };
  } catch (error) {
    console.error("Webhook dispatch failed:", error);
    return { success: false, error: String(error) };
  }
}
