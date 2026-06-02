export interface Deity {
  id: string;
  name: string;      // Telugu Name
  nameEn: string;    // English Name
  gender: 'male' | 'female';
  ashtotharam: string;
  sahasranamam: string;
}

export const stotramsData: Deity[] = [
  // --- MALE DEITIES ---
  {
    id: 'ganesha',
    name: 'వినాయకుడు',
    nameEn: 'Ganesha',
    gender: 'male',
    ashtotharam: `ఓం గజాననాయ నమః
ఓం గణాధ్యక్షాయ నమః
ఓం విఘ్నరాజాయ నమః
ఓం వినాయకాయ నమః
ఓం ద్విమాతురాయ నమః
ఓం ద్విముఖాయ నమః
ఓం ప్రముఖాయ నమః
ఓం సుముఖాయ నమః
ఓం కృతినే నమః
ఓం సుప్రదీపాయ నమః
... (108 names placeholder for Ganesha)`,
    sahasranamam: `శ్రీ గణేశ సహస్రనామ స్తోత్రం

గణేశో గణనాథశ్చ గణాధ్యక్షో గజాననః |
విఘ్నరాజో వినాయకశ్చ ద్విమాతురో ద్విముఖః ||
ప్రముఖః సుముఖః కృతీ సుప్రదీపః సుఖనిధిః |
... (1000 names placeholder for Ganesha)`
  },
  {
    id: 'shiva',
    name: 'శివుడు',
    nameEn: 'Shiva',
    gender: 'male',
    ashtotharam: `ఓం శివాయ నమః
ఓం మహేశ్వరాయ నమః
ఓం శంభవే నమః
ఓం పినాకినే నమః
ఓం శశిశేఖరాయ నమః
ఓం వామదేవాయ నమః
ఓం విరూపాక్షాయ నమః
ఓం కపర్దినే నమః
ఓం నీలలోహితాయ నమః
ఓం శంకరాయ నమః
... (108 names placeholder for Shiva)`,
    sahasranamam: `శ్రీ శివ సహస్రనామ స్తోత్రం

స్థిరః స్థాణుః ప్రభుర్భీమః ప్రవరో వరదో వరః |
సర్వాత్మా సర్వవిఖ్యాతః సర్వః సర్వకరో భవః ||
జటీ చర్మీ శిఖండీ చ సర్వాంగః సర్వభావనః |
... (1000 names placeholder for Shiva)`
  },
  {
    id: 'vishnu',
    name: 'విష్ణువు',
    nameEn: 'Vishnu',
    gender: 'male',
    ashtotharam: `ఓం విష్ణవే నమః
ఓం జిష్ణవే నమః
ఓం వషట్కారాయ నమః
ఓం దేవదేవాయ నమః
ఓం వృషాకపయే నమః
ఓం దామోదరాయ నమః
ఓం దీనబంధవే నమః
ఓం ఆదిదేవాయ నమః
ఓం అదితేఃసుతాయ నమః
ఓం పుండరీకాక్షాయ నమః
... (108 names placeholder for Vishnu)`,
    sahasranamam: `శ్రీ విష్ణు సహస్రనామ స్తోత్రం

విశ్వం విష్ణుర్వషట్కారో భూతభవ్యభవత్ప్రభుః |
భూతకృద్భూతభృద్భావో భూతాత్మా భూతభావనః ||
పూతాత్మా పరమాత్మా చ ముక్తానాం పరమా గతిః |
... (1000 names placeholder for Vishnu)`
  },
  {
    id: 'rama',
    name: 'శ్రీ రాముడు',
    nameEn: 'Rama',
    gender: 'male',
    ashtotharam: `ఓం శ్రీరామాయ నమః
ఓం రామభద్రాయ నమః
ఓం రామచంద్రాయ నమః
ఓం శాశ్వతాయ నమః
ఓం రాజీవలోచనాయ నమః
ఓం శ్రీమతే నమః
ఓం రాజేంద్రాయ నమః
ఓం రఘుపుంగవాయ నమః
ఓం జానకీవల్లభాయ నమః
ఓం జైత్రాయ నమః
... (108 names placeholder for Rama)`,
    sahasranamam: `శ్రీ రామ సహస్రనామ స్తోత్రం

రామో దాశరథిః శూరో లక్ష్మణానుచరో బలీ |
కాకుత్స్థః పురుషః పూర్ణః కౌసల్యేయో రఘూత్తమః ||
వేదాంతవేద్యో యజ్ఞేశః పురాణపురుషోత్తమః |
... (1000 names placeholder for Rama)`
  },
  {
    id: 'hanuman',
    name: 'ఆంజనేయుడు',
    nameEn: 'Hanuman',
    gender: 'male',
    ashtotharam: `ఓం ఆంజనేయాయ నమః
ఓం మహావీరాయ నమః
ఓం హనుమతే నమః
ఓం మారుతాత్మజాయ నమః
ఓం తత్త్వజ్ఞానప్రదాయకాయ నమః
ఓం సీతాదేవీముద్రాప్రదాయకాయ నమః
ఓం అశోకవనికాచ్ఛేత్రే నమః
ఓం సర్వమాయావిభంజనాయ నమః
ఓం సర్వబంధవిమోక్త్రే నమః
ఓం రక్షోవిధ్వంసకారకాయ నమః
... (108 names placeholder for Hanuman)`,
    sahasranamam: `శ్రీ హనుమత్ సహస్రనామ స్తోత్రం

హనుమాన్ శ్రీమాన్ వాయుపుత్రో మహాబలః |
రామేష్టః ఫల్గుణసఖః పింగాక్షో మితవిక్రమః ||
ఉదధిక్రమణశ్చైవ సీతాశోకవినాశకః |
... (1000 names placeholder for Hanuman)`
  },

  // --- FEMALE DEITIES ---
  {
    id: 'lalitha',
    name: 'లలితా దేవి',
    nameEn: 'Lalitha Devi',
    gender: 'female',
    ashtotharam: `ఓం రజతాచలశృంగాగ్ర మధ్యస్థాయై నమః
ఓం హిమాచల మహావంశ పావనాయై నమః
ఓం శంకరార్ధాంగ సౌందర్య శరీరాయై నమః
ఓం లసన్మరకత స్వచ్ఛ విగ్రహాయై నమః
ఓం మహాతిశయ సౌందర్య లావణ్యాయై నమః
ఓం శశాంక శేఖర ప్రాణవల్లభాయై నమః
ఓం సదా పంచదశాత్మాక్య స్వరూపాయై నమః
ఓం వజ్రమాణిక్య కటక కిరీటాయై నమః
ఓం కస్తూరీ తిలకోల్లాసి నిటలాయై నమః
ఓం భస్మరేఖాంకిత లసన్మస్తకాయై నమః
... (108 names placeholder for Lalitha Devi)`,
    sahasranamam: `శ్రీ లలితా సహస్రనామ స్తోత్రం

శ్రీమాతా శ్రీమహారాజ్ఞీ శ్రీమత్-సింహాసనేశ్వరీ |
చిదగ్ని-కుండ-సంభూతా దేవకార్య-సముద్యతా ||
ఉద్యద్భాను-సహస్రాభా చతుర్బాహు-సమన్వితా |
రాగస్వరూప-పాశాఢ్యా క్రోధాకారాంకుశోజ్జ్వలా ||
... (1000 names placeholder for Lalitha Devi)`
  },
  {
    id: 'lakshmi',
    name: 'లక్ష్మీ దేవి',
    nameEn: 'Lakshmi Devi',
    gender: 'female',
    ashtotharam: `ఓం ప్రకృత్యై నమః
ఓం వికృత్యై నమః
ఓం విద్యాయై నమః
ఓం సర్వభూతహితప్రదాయై నమః
ఓం శ్రద్ధాయై నమః
ఓం విభూత్యై నమః
ఓం సురభ్యై నమః
ఓం పరమాత్మికాయై నమః
ఓం వాచే నమః
ఓం పద్మాలయాయై నమః
... (108 names placeholder for Lakshmi Devi)`,
    sahasranamam: `శ్రీ లక్ష్మీ సహస్రనామ స్తోత్రం

పద్మావతీ పద్మనేత్రా పద్మనాభప్రియంకరీ |
పద్మాసనా పద్మహస్తా పద్మాక్షీ పద్మమాలినీ ||
కమలా కమలాక్షీ చ కమలోద్భవపూజితా |
... (1000 names placeholder for Lakshmi Devi)`
  },
  {
    id: 'saraswati',
    name: 'సరస్వతి దేవి',
    nameEn: 'Saraswati Devi',
    gender: 'female',
    ashtotharam: `ఓం సరస్వత్యై నమః
ఓం మహాభద్రాయై నమః
ఓం మహామాయాయై నమః
ఓం వరప్రదాయై నమః
ఓం శ్రీప్రదాయై నమః
ఓం పద్మనిలయాయై నమః
ఓం పద్మాక్ష్యై నమః
ఓం పద్మవక్త్రకాయై నమః
ఓం శివానుజాయై నమః
ఓం పుస్తకభృతై నమః
... (108 names placeholder for Saraswati Devi)`,
    sahasranamam: `శ్రీ సరస్వతీ సహస్రనామ స్తోత్రం

వాగ్దేవీ భారతీ గౌరీ శారదా విద్యాదాయిని |
హంసవాహనారూఢా వీణాపాతకధారిణీ ||
... (1000 names placeholder for Saraswati Devi)`
  },
  {
    id: 'durga',
    name: 'దుర్గా దేవి',
    nameEn: 'Durga Devi',
    gender: 'female',
    ashtotharam: `ఓం సత్యై నమః
ఓం సాధ్వ్యై నమః
ఓం భవప్రీతాయై నమః
ఓం భవాన్యై నమః
ఓం భవమోచన్యై నమః
ఓం ఆర్యాయై నమః
ఓం దుర్గాయై నమః
ఓం జయాయై నమః
ఓం ఆద్యాయై నమః
ఓం త్రినేత్రాయై నమః
... (108 names placeholder for Durga Devi)`,
    sahasranamam: `శ్రీ దుర్గా సహస్రనామ స్తోత్రం

శివా భవానీ రుద్రాణీ శర్వాణీ సర్వమంగళా |
అపర్ణా పార్వతీ దుర్గా మృడానీ చండికాంబికా ||
... (1000 names placeholder for Durga Devi)`
  }
];

export const getDeityById = (id: string): Deity | undefined => {
  return stotramsData.find(deity => deity.id === id);
};

export const getDeitiesByGender = (gender: 'male' | 'female'): Deity[] => {
  return stotramsData.filter(deity => deity.gender === gender);
};
