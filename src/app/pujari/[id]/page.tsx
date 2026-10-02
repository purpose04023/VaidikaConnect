import { getLivePujaris, getLivePujas } from "@/lib/server-data";
import { PujariProfileClient } from "@/features/pujari/components/PujariProfileClient";

export default async function PujariProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pujariId = id;
  const pujari = (await getLivePujaris()).find((profile) => String(profile.id) === pujariId);
  const allPujas = await getLivePujas();

  return <PujariProfileClient pujariId={pujariId} initialPujari={pujari ?? null} initialPujas={allPujas} />;
}
