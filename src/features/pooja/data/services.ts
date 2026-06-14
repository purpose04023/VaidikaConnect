export type LifeCycleStage = 'prenatal' | 'childhood' | 'youth' | 'adulthood' | 'general';

export interface PoojaItem {
  id: string;
  name: string;          // Telugu Name
  nameEn: string;        // English Name
  slug: string;
  stage: LifeCycleStage;
  description: string;   // English Description
  descriptionTe: string; // Telugu Description
  duration: string;      // e.g. "2 Hours"
  significance: string;  // Short sentence of spiritual meaning
}

export interface ChantingItem {
  id: string;
  name: string;
  nameEn: string;
  type: 'ashtothara' | 'sahasranama' | 'stotra_kavacha' | 'vidhana';
  description: string;
  descriptionTe: string;
}

export interface SpecialServiceItem {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionTe: string;
  type: 'astrology' | 'vedic_learning' | 'live_pooja';
  duration: string;
}

export interface TempleDarshan {
  id: string;
  templeName: string;
  templeNameEn: string;
  city: string;
  darshanType: string;
  darshanTypeEn: string;
  price: number;
  timings: string;
}

export interface Accommodation {
  id: string;
  hotelName: string;
  hotelNameEn: string;
  city: string;
  roomType: string;
  roomTypeEn: string;
  pricePerNight: number;
  availability: boolean;
}

export interface SightseeingSpot {
  id: string;
  spotName: string;
  spotNameEn: string;
  city: string;
  distanceFromTemple: string;
  description: string;
  descriptionTe: string;
}

// -------------------------------------------------------------
// Pillar 1: సంస్కారాలు (Life Cycle Poojas)
// -------------------------------------------------------------
export const lifeCycleSamskaras: PoojaItem[] = [
  // Prenatal (జననానికి ముందు)
  {
    id: 'samskara-1',
    name: 'గర్భధానము',
    nameEn: 'Garbhadhanam',
    slug: 'garbhadhanam',
    stage: 'prenatal',
    description: 'The sacred ceremony of conception, sanctifying the union of husband and wife for noble progeny.',
    descriptionTe: 'ఉత్తమమైన సంతానం కోసం దంపతుల కలయికను పవిత్రం చేసే గర్భధారణ సంస్కారం.',
    duration: '3 Hours',
    significance: 'Purifies the physical union and invokes divine blessings for a healthy, spiritual child.'
  },
  {
    id: 'samskara-2',
    name: 'పుంసవనము',
    nameEn: 'Pumsavanam',
    slug: 'pumsavanam',
    stage: 'prenatal',
    description: 'Performed during the 3rd or 4th month of pregnancy for the physical and cognitive development of the fetus.',
    descriptionTe: 'గర్భస్థ శిశువు యొక్క శారీరక మరియు మేధో వికాసం కోసం గర్భధారణ 3 లేదా 4వ నెలలో నిర్వహించే సంస్కారం.',
    duration: '2 Hours',
    significance: 'Secures the safety of the fetus and blesses it with strong intellectual traits.'
  },
  {
    id: 'samskara-3',
    name: 'జాతకర్మ',
    nameEn: 'Jatakarma',
    slug: 'jatakarma',
    stage: 'prenatal',
    description: 'A birth ritual performed immediately after the child is born to welcome the soul into the family.',
    descriptionTe: 'బిడ్డ జన్మించిన వెంటనే ఆత్మను కుటుంబంలోకి ఆహ్వానించడానికి చేసే జనన సంస్కార క్రియ.',
    duration: '1.5 Hours',
    significance: 'Includes feeding the newborn a drop of honey and ghee to stimulate wisdom and long life.'
  },

  // Childhood (బాల్యం)
  {
    id: 'samskara-4',
    name: 'నామకరణము',
    nameEn: 'Namakaranam',
    slug: 'namakaranam',
    stage: 'childhood',
    description: 'The traditional naming ceremony, choosing an auspicious name aligned with planetary positions.',
    descriptionTe: 'గ్రహాల స్థానాలకు అనుగుణంగా పవిత్రమైన పేరును ఎంచుకునే సాంప్రదాయ నామకరణ వేడుక.',
    duration: '2 Hours',
    significance: 'Establishes the child\'s identity and invokes planetary blessings for a prosperous path.'
  },
  {
    id: 'samskara-5',
    name: 'అన్నప్రాసనము',
    nameEn: 'Annaprasanam',
    slug: 'annaprasanam',
    stage: 'childhood',
    description: 'Marks the child\'s first intake of solid food (usually sweet rice pudding), invoking good digestion.',
    descriptionTe: 'పిల్లల మొదటి ఘనాహార సేకరణను (పరమాన్నం) సూచించే మరియు జీర్ణశక్తిని పెంపొందించే వేడుక.',
    duration: '2 Hours',
    significance: 'Prayers are offered to the goddess of food (Annapurna) for the health and long life of the child.'
  },
  {
    id: 'samskara-6',
    name: 'చౌలకర్మ',
    nameEn: 'Chaulakarma (Mundan)',
    slug: 'chaulakarma',
    stage: 'childhood',
    description: 'The first haircut or tonsure ceremony, purifying the child of traits from previous births.',
    descriptionTe: 'గత జన్మల అలవాట్ల నుండి విముక్తి పొంది, పిల్లవాడిని శుద్ధి చేసే ప్రథమ కేశ ఖండన కార్యక్రమం.',
    duration: '1.5 Hours',
    significance: 'Promotes cleanliness, good health, and stimulates cognitive development in early childhood.'
  },
  {
    id: 'samskara-7',
    name: 'అక్షరాభ్యాసము',
    nameEn: 'Aksharabhyasam',
    slug: 'aksharabhyasam',
    stage: 'childhood',
    description: 'The initiation of learning and writing, dedicated to Goddess Saraswati and Lord Ganesha.',
    descriptionTe: 'సరస్వతీ దేవి మరియు విఘ్నేశ్వరుని పూజతో విద్యాభ్యాసాన్ని మరియు రాయడాన్ని ప్రారంభించే సంస్కారం.',
    duration: '2 Hours',
    significance: 'The child writes their first letters in rice grains, seeking intellect and focus in education.'
  },

  // Youth (విద్య & యవ్వనం)
  {
    id: 'samskara-8',
    name: 'ఉపనయనము',
    nameEn: 'Upanayanam',
    slug: 'upanayanam',
    stage: 'youth',
    description: 'The sacred thread ceremony, initiating the child into spiritual wisdom and the Gayatri Mantra.',
    descriptionTe: 'గాయత్రీ మంత్రం మరియు ఆధ్యాత్మిక జ్ఞానాన్ని ఉపదేశిస్తూ యజ్ఞోపవీతాన్ని ధరింపజేసే పవిత్ర సంస్కారం.',
    duration: '4 Hours',
    significance: 'Marks the "second birth" (Dvija) of the individual, committing them to high discipline and learning.'
  },
  {
    id: 'samskara-9',
    name: 'ఉపాకర్మ',
    nameEn: 'Upakarma',
    slug: 'upakarma',
    stage: 'youth',
    description: 'An annual ritual to offer libations to sages, renew the sacred thread, and start Vedic studies.',
    descriptionTe: 'ఋషులకు తర్పణాలు సమర్పించి, జంధ్యాన్ని మార్చి, వేదాధ్యయనాన్ని పునఃప్రారంభించే వార్షిక కార్యక్రమం.',
    duration: '3 Hours',
    significance: 'Cleanses past planetary negative traits and renews one\'s spiritual duties.'
  },
  {
    id: 'samskara-10',
    name: 'సమావర్తము',
    nameEn: 'Samavartanam',
    slug: 'samavartanam',
    stage: 'youth',
    description: 'Graduation ceremony marking the completion of Vedic education and readiness for household life.',
    descriptionTe: 'వేదాధ్యయనం విజయవంతంగా ముగిసి, గృహస్థాశ్రమంలోకి ప్రవేశించడానికి సిద్ధంగా ఉన్నట్లు తెలిపే ముగింపు సంస్కారం.',
    duration: '2.5 Hours',
    significance: 'Prepares the youth to transition from student life (Brahmacharya) to family life.'
  },

  // Adulthood/Marriage (గృహస్థాశ్రమం)
  {
    id: 'samskara-11',
    name: 'ఎదురు సన్నాహాలు',
    nameEn: 'Eduru Sannahalu',
    slug: 'eduru-sannahalu',
    stage: 'adulthood',
    description: 'Ritualistic welcoming ceremonies hosted prior to the wedding day by the bride\'s family.',
    descriptionTe: 'పెళ్లి రోజుకు ముందు పెళ్లి కూతురి తరపు వారు పెళ్లి కొడుకు బృందానికి ఇచ్చే సాంప్రదాయ స్వాగత వేడుకలు.',
    duration: '2 Hours',
    significance: 'Brings families together in harmony and sets an auspicious mood for the primary wedding rituals.'
  },
  {
    id: 'samskara-12',
    name: 'కాశీయాత్ర',
    nameEn: 'Kasi Yatra',
    slug: 'kasi-yatra',
    stage: 'adulthood',
    description: 'A playful and symbolic wedding ritual where the groom pretends to leave for Kashi, and is brought back by the bride\'s father.',
    descriptionTe: 'పెళ్లి కొడుకు సన్యాసం కోసం కాశీ వెళ్తుంటే, పెళ్లి కూతురి తండ్రి నచ్చజెప్పి వెనక్కి రప్పించే ఆహ్లాదకరమైన వివాహ క్రియ.',
    duration: '1 Hour',
    significance: 'Illustrates the profound decision of taking up family responsibilities over solitary meditation.'
  },
  {
    id: 'samskara-13',
    name: 'వివాహము',
    nameEn: 'Vivaham (Wedding)',
    slug: 'vivaham',
    stage: 'adulthood',
    description: 'The supreme sacred union of a man and a woman in matrimony, witnessing by Agni and elders.',
    descriptionTe: 'అగ్నిసాక్షిగా మరియు పెద్దల సమక్షంలో దంపతులిద్దరినీ ఏకం చేసే అత్యున్నత వైవాహిక సంస్కార బంధం.',
    duration: '4 Hours',
    significance: 'The ultimate commitment establishing a new household, walking the path of Dharma together.'
  },
  {
    id: 'samskara-14',
    name: 'పునస్సంధానము',
    nameEn: 'Punasandhanam',
    slug: 'punasandhanam',
    stage: 'adulthood',
    description: 'Re-ignition of the domestic fire (Aupasana Agni) after marriage for regular sacrificial duties.',
    descriptionTe: 'వివాహం తర్వాత రోజువారీ యజ్ఞ హోమ క్రియల నిర్వహణ కోసం గృహాగ్నిని పునఃప్రతిష్ఠించే సంస్కారం.',
    duration: '2 Hours',
    significance: 'Brings continuity and spiritual discipline to the family\'s daily schedule.'
  },
  {
    id: 'samskara-15',
    name: 'దత్తపుత్ర స్వీకారము',
    nameEn: 'Dattaputra Sweekaram',
    slug: 'dattaputra-sweekaram',
    stage: 'adulthood',
    description: 'Ritualistic adoption of a child according to Vedic principles, welcoming them as a legal descendant.',
    descriptionTe: 'వేదోక్తంగా ఒక బిడ్డను దత్తత తీసుకుని, కుటుంబంలోకి చట్టబద్ధమైన మరియు ఆధ్యాత్మిక వారసుడిగా స్వీకరించే క్రియ.',
    duration: '3 Hours',
    significance: 'Ensures the child enjoys full ancestral rites and blessings in the lineage.'
  },

  // General (శుభకార్యాలు & నిత్య పూజలు)
  {
    id: 'samskara-16',
    name: 'శుభారంభం',
    nameEn: 'Shubharambham',
    slug: 'shubharambham',
    stage: 'general',
    description: 'A prayer service to initiate any business, education term, project, or auspicious venture.',
    descriptionTe: 'ఏదైనా కొత్త వ్యాపారం, విద్యా సంవత్సరం లేదా మంగళకరమైన పనిని ప్రారంభించడానికి చేసే ప్రార్థన.',
    duration: '1.5 Hours',
    significance: 'Cleanses the environment of doubts and invokes abundance for smooth progression.'
  },
  {
    id: 'samskara-17',
    name: 'విఘ్నేశ్వర పూజ',
    nameEn: 'Vighneswara Pooja',
    slug: 'vighneswara-pooja',
    stage: 'general',
    description: 'Worship dedicated to Lord Ganesha, the lord of obstacles, prior to starting any ritual.',
    descriptionTe: 'ఏదైనా పూజ లేదా కార్యక్రమం ప్రారంభించే ముందు విఘ్నాలను తొలగించడానికి వినాయకుడికి చేసే పూజ.',
    duration: '1 Hour',
    significance: 'Ensures that all subsequent programs proceed without hurdles or interruptions.'
  },
  {
    id: 'samskara-18',
    name: 'పుణ్యాహవచనం',
    nameEn: 'Punyahavachanam',
    slug: 'punyahavachanam',
    stage: 'general',
    description: 'Sprinkling of sanctified waters to purify homes, venues, and individuals of subtle impurities.',
    descriptionTe: 'తీర్థజలాల ప్రోక్షణ ద్వారా ఇల్లు, వేదిక మరియు వ్యక్తుల లోని సూక్ష్మ అశుద్ధతలను తొలగించి శుద్ధి చేసే ప్రక్రియ.',
    duration: '1 Hour',
    significance: 'Transforms physical spaces into highly divine environments welcoming deities.'
  },
  {
    id: 'samskara-19',
    name: 'నిత్యాగ్నిహోత్రము',
    nameEn: 'Nityagnihotram',
    slug: 'nityagnihotram',
    stage: 'general',
    description: 'The ancient practice of performing a small twice-daily fire offering to maintain cosmic order.',
    descriptionTe: 'విశ్వశాంతి మరియు పర్యావరణ శుద్ధి కోసం రోజుకు రెండుసార్లు ఆచరించే అత్యంత పురాతనమైన అగ్నిహోత్ర క్రతువు.',
    duration: '45 Mins',
    significance: 'Balances regional energy patterns and fills the residence with soothing, healing smoke.'
  }
];

// -------------------------------------------------------------
// Pillar 2: మంత్రాలు & సేవలు (Spiritual & Services)
// -------------------------------------------------------------
export const spiritualTexts: ChantingItem[] = [
  {
    id: 'spiritual-1',
    name: 'అష్టోత్తరాలు',
    nameEn: 'Ashtotharalu',
    type: 'ashtothara',
    description: 'Recitation of 108 sacred names of popular deities including Ganesha, Shiva, and Lakshmi.',
    descriptionTe: 'వినాయకుడు, శివుడు మరియు లక్ష్మీదేవి మొదలైన దేవతలకు సంబంధించిన 108 నామాల పారాయణం.'
  },
  {
    id: 'spiritual-2',
    name: 'సహస్రనామాలు',
    nameEn: 'Sahasranamalu',
    type: 'sahasranama',
    description: 'Chanting the powerful 1000 names of divine manifestations like Lalitha, Vishnu, and Shiva.',
    descriptionTe: 'లలిత, విష్ణు మరియు శివ సహస్రనామ రూపాల లోని 1000 దివ్య నామాలను సకల ఫలసిద్ధి కోసం పఠించడం.'
  },
  {
    id: 'spiritual-3',
    name: 'స్తోత్రాలు & కవచాలు',
    nameEn: 'Stotralu & Kavachalu',
    type: 'stotra_kavacha',
    description: 'Spiritual protective hymns and prayers that form an armor of light around the devotee.',
    descriptionTe: 'భక్తుడికి రక్షణ కవచంలా నిలిచి మానసిక బలాన్ని చేకూర్చే ఆధ్యాత్మిక ప్రార్థనలు మరియు స్తోత్రాలు.'
  },
  {
    id: 'spiritual-4',
    name: 'పూజా విధానాలు',
    nameEn: 'Pooja Vidhanalu',
    type: 'vidhana',
    description: 'Step-by-step DIY worship booklets enabling devotees to conduct authentic rituals at home.',
    descriptionTe: 'భక్తులు తమ ఇళ్లలోనే స్వయంగా భక్తితో పూజలు ఆచరించడానికి వీలు కల్పించే సమగ్ర పూజా విధాన దర్శిని.'
  }
];

export const specialServices: SpecialServiceItem[] = [
  {
    id: 'service-1',
    name: 'జాతకాలు',
    nameEn: 'Jatakalu (Astrology)',
    description: 'Complete horoscope preparation, matching, and Vedic transit readings with expert astrologers.',
    descriptionTe: 'అనుభవజ్ఞులైన సిద్ధాంతులతో సంపూర్ణ జన్మ పత్రిక తయారీ, వివాహ పొంతనలు మరియు గోచార ఫలితాల విశ్లేషణ.',
    type: 'astrology',
    duration: '45 Mins'
  },
  {
    id: 'service-2',
    name: 'వేదాధ్యయనం',
    nameEn: 'Vedadhyayanam',
    description: 'Online and offline classes to learn chanting Vedas, Upanishads, and key Vedic scriptures.',
    descriptionTe: 'వేదాలు, ఉపనిషత్తులు మరియు వివిధ వైదిక మంత్రాలను పఠించడం నేర్చుకోవడానికి ఆన్‌లైన్/ఆఫ్‌లైన్ తరగతులు.',
    type: 'vedic_learning',
    duration: 'Monthly'
  },
  {
    id: 'service-3',
    name: 'లైవ్ పూజ',
    nameEn: 'Live Virtual Pooja',
    description: 'High-definition live-streamed pooja conducted by a priest at a holy site on your behalf.',
    descriptionTe: 'మీకు అనుకూలమైన ప్రదేశం నుండి నేరుగా చూస్తూ పాల్గొనేలా మీ తరపున పండితులు చేసే వర్చువల్ పూజా విధానం.',
    type: 'live_pooja',
    duration: '2 Hours'
  }
];

// -------------------------------------------------------------
// Pillar 3: యాత్రలు & దర్శనాలు (Pilgrimage & Tourism)
// -------------------------------------------------------------
export const templeDarshans: TempleDarshan[] = [
  {
    id: 'darshan-1',
    templeName: 'కనకదుర్గమ్మ ఆలయం, విజయవాడ',
    templeNameEn: 'Kanaka Durga Temple, Vijayawada',
    city: 'Vijayawada',
    darshanType: 'ప్రత్యేక శీఘ్ర దర్శనం',
    darshanTypeEn: 'Special Quick Darshan',
    price: 300,
    timings: '06:00 AM - 08:00 PM'
  },
  {
    id: 'darshan-2',
    templeName: 'కనకదుర్గమ్మ ఆలయం, విజయవాడ',
    templeNameEn: 'Kanaka Durga Temple, Vijayawada',
    city: 'Vijayawada',
    darshanType: 'విఐపి దర్శనం',
    darshanTypeEn: 'VIP Protocol Darshan',
    price: 500,
    timings: '07:00 AM - 06:00 PM'
  },
  {
    id: 'darshan-3',
    templeName: 'మంగళగిరి పానకాల నరసింహస్వామి',
    templeNameEn: 'Panakala Narasimha Swamy, Mangalagiri',
    city: 'Vijayawada Region',
    darshanType: 'పానక అభిషేక పూజ ప్రవేశం',
    darshanTypeEn: 'Panaka Abhishekam Entrance',
    price: 150,
    timings: '07:00 AM - 03:00 PM'
  }
];

export const accommodations: Accommodation[] = [
  {
    id: 'stay-1',
    hotelName: 'హరిత రిసార్ట్స్ (APTDC), రుషికొండ',
    hotelNameEn: 'Haritha Resorts (APTDC), Rushikonda',
    city: 'Visakhapatnam',
    roomType: 'ఏసీ డీలక్స్ రూమ్ (సముద్ర వీక్షణం)',
    roomTypeEn: 'AC Deluxe Sea View Room',
    pricePerNight: 3500,
    availability: true
  },
  {
    id: 'stay-2',
    hotelName: 'కైలాసగిరి హిల్ వ్యూ హోమ్‌స్టే',
    hotelNameEn: 'Kailasagiri Hill View Homestay',
    city: 'Visakhapatnam',
    roomType: 'ఫ్యామిలీ 2BHK అపార్ట్‌మెంట్',
    roomTypeEn: 'Premium Family 2BHK Suite',
    pricePerNight: 4800,
    availability: true
  },
  {
    id: 'stay-3',
    hotelName: 'హరిత వ్యాలీ రిసార్ట్, అరకు',
    hotelNameEn: 'Haritha Valley Resort, Araku',
    city: 'Visakhapatnam Region',
    roomType: 'లగ్జరీ వుడెన్ కాటేజ్',
    roomTypeEn: 'Luxury Wooden Cottage',
    pricePerNight: 4200,
    availability: false
  }
];

export const sightseeingSpots: SightseeingSpot[] = [
  {
    id: 'spot-1',
    spotName: 'రుషికొండ బీచ్',
    spotNameEn: 'Rushikonda Beach',
    city: 'Visakhapatnam',
    distanceFromTemple: '2.5 km from Rushikonda Venkateswara Temple',
    description: 'Golden sandy beach offering water sports, speed boating, and pristine scenic views.',
    descriptionTe: 'వాటర్ స్పోర్ట్స్, స్పీడ్ బోటింగ్ మరియు అద్భుతమైన సముద్ర వీక్షణను అందించే సుందరమైన బంగారు ఇసుక తీరం.'
  },
  {
    id: 'spot-2',
    spotName: 'కైలాసగిరి హిల్ పార్క్',
    spotNameEn: 'Kailasagiri Hill Park',
    city: 'Visakhapatnam',
    distanceFromTemple: '4.0 km from Simhachalam Foothills',
    description: 'Hilltop park featuring massive Ganesha and Shiva-Parvati statues, toy train rides, and a cable car.',
    descriptionTe: 'శివపార్వతుల బృహత్ విగ్రహాలు, కేబుల్ కార్ మరియు టాయ్ ట్రైన్‌తో నగర అందాలను వీక్షించే కొండ పై పార్కు.'
  },
  {
    id: 'spot-3',
    spotName: 'భీమిలి డచ్ కాలనీ',
    spotNameEn: 'Bheemili Dutch Colony',
    city: 'Visakhapatnam',
    distanceFromTemple: '12 km from Rushikonda',
    description: 'A historic coastal village displaying remains of a 17th-century Dutch cemetery and lighthouse.',
    descriptionTe: '17వ శతాబ్దపు డచ్ సమాధులు, చారిత్రక లైట్‌హౌస్ కలిగిన అద్భుతమైన సముద్ర తీర చారిత్రక గ్రామం.'
  }
];
