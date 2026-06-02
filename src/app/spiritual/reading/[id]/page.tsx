import { getDeityById, stotramsData } from "@/lib/data/stotrams";
import { notFound } from "next/navigation";
import { DeityClient } from "./DeityClient";

export function generateStaticParams() {
  return stotramsData.map((deity) => ({
    id: deity.id,
  }));
}

export default async function DeityStotramPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const initialDeity = getDeityById(id);

  if (!initialDeity) {
    notFound();
  }

  return <DeityClient id={id} initialDeity={initialDeity} />;
}
