
import { getLivePujaris, getLivePujas } from '@/lib/server-data';
import { HomePageClient } from './_components/HomePageClient';

export default async function HomePage() {
  const pujaris = await getLivePujaris();
  const allPujas = await getLivePujas();

  return (
    <HomePageClient pujaris={pujaris} allPujas={allPujas} />
  );
}
