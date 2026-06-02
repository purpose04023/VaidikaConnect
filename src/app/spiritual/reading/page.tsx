import StotramsDisplay from "@/components/StotramsDisplay";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "అష్టోత్తరాలు & సహస్రనామాలు | VaidikaConnect",
  description: "Read the sacred 108 and 1000 names of Hindu Deities.",
};

export default function SpiritualReadingPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <StotramsDisplay />
    </div>
  );
}
