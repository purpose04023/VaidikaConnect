import { getPujariById, getPujas } from "@/lib/data";
import { PujariProfileClient } from "./PujariProfileClient";

export default async function PujariProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pujariId = parseInt(id);
  const pujari = await getPujariById(pujariId);
  const allPujas = await getPujas();

  return <PujariProfileClient pujariId={pujariId} initialPujari={pujari ?? null} initialPujas={allPujas} />;
}
