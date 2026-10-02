import { computeInvoice, formatINR, GST_RATE, CONVENIENCE_FEE_PERCENT } from "./invoice";

export { computeInvoice, formatINR, GST_RATE, CONVENIENCE_FEE_PERCENT };

export interface PureAgentInvoice {
  priestDakshina: number;
  dakshina: number;
  dakshinaGst: 0;
  convenienceFee: number;
  gstOnConvenienceFee: number;
  convenienceFeeGst: number;
  total: number;
  splitDisplay: string;
  dakshinaGstExempt: true;
}

export function calculateInvoice(dakshina: number, requestedFee?: number): PureAgentInvoice {
  if (!Number.isFinite(dakshina) || dakshina < 0) {
    throw new Error("Dakshina must be a finite, non-negative amount");
  }
  const convenienceFee = requestedFee === undefined ? Math.round(dakshina * CONVENIENCE_FEE_PERCENT) : requestedFee;
  if (!Number.isFinite(convenienceFee) || convenienceFee < 0) {
    throw new Error("Convenience fee must be a finite, non-negative amount");
  }
  const invoice = requestedFee === undefined
    ? computeInvoice(Math.round(dakshina * 100) / 100)
    : { dakshina, convenienceFee, gstOnFee: Math.round(convenienceFee * GST_RATE * 100) / 100, total: dakshina + convenienceFee + Math.round(convenienceFee * GST_RATE * 100) / 100 };
  return {
    priestDakshina: invoice.dakshina,
    dakshina: invoice.dakshina,
    dakshinaGst: 0,
    convenienceFee: invoice.convenienceFee,
    gstOnConvenienceFee: invoice.gstOnFee,
    convenienceFeeGst: invoice.gstOnFee,
    total: invoice.total,
    splitDisplay: `Dakshina: ${formatINR(invoice.dakshina)} | Convenience Fee: ${formatINR(invoice.convenienceFee)} | GST: ${formatINR(invoice.gstOnFee)}`,
    dakshinaGstExempt: true,
  };
}
