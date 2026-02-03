
import { getPujaris, getPujas } from '@/lib/data';
import { HomePageClient } from './_components/HomePageClient';

export default async function HomePage() {
  const pujaris = await getPujaris();
  const allPujas = await getPujas();

  return (
    <HomePageClient pujaris={pujaris} allPujas={allPujas} />
  );
}
