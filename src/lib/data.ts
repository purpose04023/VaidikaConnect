import { PlaceHolderImages } from './placeholder-images';

export interface Puja {
  id: number;
  name: string; // Telugu name
  name_en: string; // English name
  description: string; // English description
  description_te: string; // Telugu description
  image: string;
  imageHint: string;
  category: 'వ్రతాలు' | 'నోములు' | 'హోమాలు' | 'పూజలు' | 'కళ్యాణములు' | 'దోష పరిహార పూజలు' | 'దీక్ష పూజలు';
  category_en: 'Vratas' | 'Nomulu' | 'Homams' | 'Pujas' | 'Kalyanams' | 'Dosha Parihara Pujas' | 'Deeksha Pujas';
}


export interface Pujari {
  id: number;
  name: string;
  photo: string;
  photoHint: string;
  rating: number;
  reviewCount: number;
  basePrice: number;
  qualifications: string[];
  languages: string[];
  experience: number;
  pujas: number[];
  maxParticipants: number;
  location: { lat: number; lng: number };
  description: string;
  phone: string;
  gallery: { url: string; hint: string }[];
  reviews: { name: string; rating: number; comment: string }[];
}

const pujas: Puja[] = [
  // వ్రతాలు (Vratas)
  { id: 1, name: "సత్యనారాయణ వ్రతము", name_en: "Satyanarayana Vratam", description: "For prosperity, well-being, and honoring Lord Vishnu.", description_te: "శ్రేయస్సు, శ్రేయస్సు మరియు విష్ణువును గౌరవించడం కోసం.", category: "వ్రతాలు", category_en: "Vratas", image: PlaceHolderImages.find(p => p.id === 'puja-satyanarayana')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-satyanarayana')?.imageHint || '' },
  { id: 2, name: "కేదారేశ్వర వ్రతము", name_en: "Kedareshwara Vratam", description: "Performed for health and prosperity, dedicated to Lord Shiva.", description_te: "ఆరోగ్యం మరియు శ్రేయస్సు కోసం ప్రదర్శించబడింది, శివునికి అంకితం చేయబడింది.", category: "వ్రతాలు", category_en: "Vratas", image: PlaceHolderImages.find(p => p.id === 'puja-kedareswara')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-kedareswara')?.imageHint || '' },
  { id: 3, name: "అనంత పద్మనాభ స్వామి వ్రతం", name_en: "Ananta Padmanabha Swamy Vratam", description: "Honoring Lord Ananta Padmanabha Swamy for blessings.", description_te: "ఆశీర్వాదం కోసం శ్రీ అనంత పద్మనాభ స్వామిని గౌరవించడం.", category: "వ్రతాలు", category_en: "Vratas", image: PlaceHolderImages.find(p => p.id === 'puja-ananta-padmanabha')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-ananta-padmanabha')?.imageHint || '' },
  { id: 4, name: "వరలక్ష్మీ వ్రతము", name_en: "Varalakshmi Vratam", description: "To appease the goddess Lakshmi for wealth and prosperity.", description_te: "సంపద మరియు శ్రేయస్సు కోసం లక్ష్మీ దేవతను ప్రసన్నం చేసుకోవడానికి.", category: "వ్రతాలు", category_en: "Vratas", image: PlaceHolderImages.find(p => p.id === 'puja-varalakshmi')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-varalakshmi')?.imageHint || '' },
  { id: 5, name: "మంగళ గౌరీ వ్రతము", name_en: "Mangala Gowri Vratam", description: "Performed by married women for a happy marital life.", description_te: "వివాహిత స్త్రీలు సంతోషకరమైన వైవాహిక జీవితం కోసం ప్రదర్శిస్తారు.", category: "వ్రతాలు", category_en: "Vratas", image: PlaceHolderImages.find(p => p.id === 'puja-mangala-gowri')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-mangala-gowri')?.imageHint || '' },
  { id: 6, name: "మహాలక్ష్మి వ్రతము", name_en: "Mahalakshmi Vratam", description: "A vrata to seek the blessings of Goddess Mahalakshmi.", description_te: "మహాలక్ష్మి దేవి ఆశీర్వాదం కోసం ఒక వ్రతం.", category: "వ్రతాలు", category_en: "Vratas", image: PlaceHolderImages.find(p => p.id === 'puja-mahalakshmi')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-mahalakshmi')?.imageHint || '' },
  { id: 7, name: "అశ్వద్ధ నారాయణ వ్రతము", name_en: "Aswaddha Narayana Vratam", description: "Worship of the Peepal tree as a form of Lord Narayana.", description_te: "నారాయణుని రూపంగా పీపల్ చెట్టును పూజించడం.", category: "వ్రతాలు", category_en: "Vratas", image: PlaceHolderImages.find(p => p.id === 'puja-aswaddha-narayana')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-aswaddha-narayana')?.imageHint || '' },
  { id: 8, name: "సంకట చతుర్థి వ్రతము", name_en: "Sankatahara Chaturthi Vratam", description: "Fasting and puja for Lord Ganesha to remove obstacles.", description_te: "అడ్డంకులను తొలగించడానికి గణేశుడికి ఉపవాసం మరియు పూజ.", category: "వ్రతాలు", category_en: "Vratas", image: PlaceHolderImages.find(p => p.id === 'puja-sankatahara-chaturthi')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-sankatahara-chaturthi')?.imageHint || '' },
  { id: 9, name: "సర్వ దేవత వ్రతాలు", name_en: "Sarva Devata Vratas", description: "Vratas dedicated to all deities for overall well-being.", description_te: "మొత్తం శ్రేయస్సు కోసం అన్ని దేవతలకు అంకితం చేయబడిన వ్రతాలు.", category: "వ్రతాలు", category_en: "Vratas", image: PlaceHolderImages.find(p => p.id === 'puja-sarva-devata')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-sarva-devata')?.imageHint || '' },

  // నోములు (Nomulu)
  { id: 10, name: "అట్లతద్ది నోము", name_en: "Atlataddi Nomu", description: "A traditional nomu for a happy married life.", description_te: "సంతోషకరమైన వైవాహిక జీవితం కోసం ఒక సాంప్రదాయ నోము.", category: "నోములు", category_en: "Nomulu", image: PlaceHolderImages.find(p => p.id === 'puja-atlataddi')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-atlataddi')?.imageHint || '' },
  { id: 11, name: "ఉండ్రాళ్ళ నోము", name_en: "Undralla Nomu", description: "A nomu involving offerings of steamed rice balls (undrallu).", description_te: "ఆవిరి బియ్యం బంతుల (ఉండ్రాళ్ళు) నైవేద్యంతో కూడిన నోము.", category: "నోములు", category_en: "Nomulu", image: PlaceHolderImages.find(p => p.id === 'puja-undralla')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-undralla')?.imageHint || '' },
  { id: 12, name: "గౌరీ నోము", name_en: "Gowri Nomu", description: "A nomu dedicated to Goddess Gauri.", description_te: "గౌరీ దేవికి అంకితం చేయబడిన నోము.", category: "నోములు", category_en: "Nomulu", image: PlaceHolderImages.find(p => p.id === 'puja-gowri-nomu')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-gowri-nomu')?.imageHint || '' },
  { id: 13, name: "కార్తీక నోములు", name_en: "Karthika Nomulu", description: "Various nomulu performed during the holy month of Kartika.", description_te: "పవిత్ర కార్తీక మాసంలో చేసే వివిధ నోములు.", category: "నోములు", category_en: "Nomulu", image: PlaceHolderImages.find(p => p.id === 'puja-karthika')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-karthika')?.imageHint || '' },
  { id: 14, name: "నాగుల చవితి నోము", name_en: "Nagula Chavithi Nomu", description: "A nomu to worship serpent gods.", description_te: "సర్ప దేవతలను పూజించడానికి ఒక నోము.", category: "నోములు", category_en: "Nomulu", image: PlaceHolderImages.find(p => p.id === 'puja-nagula-chavithi')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-nagula-chavithi')?.imageHint || '' },

  // హోమాలు (Homams)
  { id: 15, name: "మహాగణపతి హోమం", name_en: "Maha Ganapathi Homam", description: "Fire ritual to remove obstacles and ensure success.", description_te: "అడ్డంకులను తొలగించి విజయం సాధించడానికి అగ్ని క్రతువు.", category: "హోమాలు", category_en: "Homams", image: PlaceHolderImages.find(p => p.id === 'puja-maha-ganapathi-homam')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-maha-ganapathi-homam')?.imageHint || '' },
  { id: 16, name: "రుద్రహోమము", name_en: "Rudrabhishekam", description: "A powerful homa dedicated to Lord Rudra (Shiva).", description_te: "రుద్రునికి (శివునికి) అంకితం చేయబడిన ఒక శక్తివంతమైన హోమం.", category: "హోమాలు", category_en: "Homams", image: PlaceHolderImages.find(p => p.id === 'puja-rudrabhishekam')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-rudrabhishekam')?.imageHint || '' },
  { id: 17, name: "మన్యుసూక్త హోమం", name_en: "Manyu Sukta Homam", description: "Homa to appease anger and negative energies.", description_te: "కోపం మరియు ప్రతికూల శక్తులను శాంతింపజేయడానికి హోమం.", category: "హోమాలు", category_en: "Homams", image: PlaceHolderImages.find(p => p.id === 'puja-manyu-sukta')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-manyu-sukta')?.imageHint || '' },
  { id: 18, name: "కన్యా పాశుపత హోమము", name_en: "Kanya Pasupata Homam", description: "Homa for unmarried women seeking a good husband.", description_te: "మంచి భర్తను కోరుకునే అవివాహిత మహిళల కోసం హోమం.", category: "హోమాలు", category_en: "Homams", image: PlaceHolderImages.find(p => p.id === 'puja-kanya-pasupata')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-kanya-pasupata')?.imageHint || '' },
  { id: 19, name: "మహా మృత్యుంజయ హోమము", name_en: "Maha Mrityunjaya Homam", description: "Homa to Lord Shiva to overcome fear of death and for longevity.", description_te: "మృత్యు భయాన్ని అధిగమించడానికి మరియు దీర్ఘాయువు కోసం శివునికి హోమం.", category: "హోమాలు", category_en: "Homams", image: PlaceHolderImages.find(p => p.id === 'puja-maha-mrityunjaya')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-maha-mrityunjaya')?.imageHint || '' },
  { id: 20, name: "కుబేర హోమము", name_en: "Kubera Homam", description: "Homa to attract wealth and prosperity by pleasing Lord Kubera.", description_te: "కుబేరుడిని ప్రసన్నం చేసుకోవడం ద్వారా సంపద మరియు శ్రేయస్సును ఆకర్షించడానికి హోమం.", category: "హోమాలు", category_en: "Homams", image: PlaceHolderImages.find(p => p.id === 'puja-kubera')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-kubera')?.imageHint || '' },
  { id: 21, name: "ఋణ విమోచన హోమము", name_en: "Runa Vimochana Homam", description: "Homa to get relief from debts and financial burdens.", description_te: "అప్పులు, ఆర్థిక భారాల నుంచి ఉపశమనం పొందేందుకు హోమం.", category: "హోమాలు", category_en: "Homams", image: PlaceHolderImages.find(p => p.id === 'puja-runa-vimochana')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-runa-vimochana')?.imageHint || '' },
  { id: 22, name: "దాంపత్య హోమము", name_en: "Dampatya Homam", description: "Homa for a happy and harmonious married life.", description_te: "సంతోషకరమైన మరియు సామరస్యపూర్వకమైన వైవాహిక జీవితం కోసం హోమం.", category: "హోమాలు", category_en: "Homams", image: PlaceHolderImages.find(p => p.id === 'puja-dampatya')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-dampatya')?.imageHint || '' },
  { id: 23, name: "రుద్ర గాయత్రి హోమము", name_en: "Rudra Gayatri Homam", description: "Homa invoking the energies of Rudra Gayatri for protection.", description_te: "రక్షణ కోసం రుద్ర గాయత్రీ శక్తులను ప్రేరేపించే హోమం.", category: "హోమాలు", category_en: "Homams", image: PlaceHolderImages.find(p => p.id === 'puja-rudra-gayatri')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-rudra-gayatri')?.imageHint || '' },
  { id: 24, name: "నారాయణ ఉపనిషత్ హోమము", name_en: "Narayana Upanishad Homam", description: "Homa based on the recitations of Narayana Upanishad.", description_te: "నారాయణోపనిషత్తు పారాయణాలపై ఆధారపడిన హోమం.", category: "హోమాలు", category_en: "Homams", image: PlaceHolderImages.find(p => p.id === 'puja-narayana-upanishad')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-narayana-upanishad')?.imageHint || '' },
  { id: 25, name: "పురుష సూక్త హోమము", name_en: "Purusha Sukta Homam", description: "Homa performed with the chanting of the Purusha Suktam.", description_te: "పురుష సూక్తం పఠనంతో చేసే హోమం.", category: "హోమాలు", category_en: "Homams", image: PlaceHolderImages.find(p => p.id === 'puja-purusha-sukta')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-purusha-sukta')?.imageHint || '' },
  { id: 26, name: "గణపతి సుక్త హోమము", name_en: "Ganapati Sukta Homam", description: "Homa with chanting of Ganapati Suktam for blessings of Ganesha.", description_te: "గణపతి సూక్తం పఠనంతో గణేశుడి ఆశీర్వాదం కోసం హోమం.", category: "హోమాలు", category_en: "Homams", image: PlaceHolderImages.find(p => p.id === 'puja-ganapati-sukta')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-ganapati-sukta')?.imageHint || '' },
  { id: 27, name: "గణపతి ఉపనిషత్ హోమము", name_en: "Ganapati Upanishad Homam", description: "Homa based on the recitations of Ganapati Upanishad.", description_te: "గణపతి ఉపనిషత్తు పారాయణాలపై ఆధారపడిన హోమం.", category: "హోమాలు", category_en: "Homams", image: PlaceHolderImages.find(p => p.id === 'puja-ganapati-upanishad')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-ganapati-upanishad')?.imageHint || '' },
  { id: 28, name: "విగ్నేశ్వర గాయత్రి హోమము", name_en: "Vighneshwara Gayatri Homam", description: "Homa invoking Vigneshwara Gayatri for removing obstacles.", description_te: "అడ్డంకులను తొలగించడానికి విఘ్నేశ్వర గాయత్రిని ప్రేరేపించే హోమం.", category: "హోమాలు", category_en: "Homams", image: PlaceHolderImages.find(p => p.id === 'puja-vigneshwara-gayatri')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-vigneshwara-gayatri')?.imageHint || '' },
  { id: 29, name: "శ్రీ సూక్త హోమము", name_en: "Sri Sukta Homam", description: "Homa with chanting of Sri Suktam for wealth and prosperity.", description_te: "సంపద మరియు శ్రేయస్సు కోసం శ్రీ సూక్తం పఠనంతో హోమం.", category: "హోమాలు", category_en: "Homams", image: PlaceHolderImages.find(p => p.id === 'puja-sri-sukta')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-sri-sukta')?.imageHint || '' },
  { id: 30, name: "మహా దుర్గా హోమము", name_en: "Maha Durga Homam", description: "A powerful homa to Goddess Durga for protection and victory.", description_te: "రక్షణ మరియు విజయం కోసం దుర్గాదేవికి ఒక శక్తివంతమైన హోమం.", category: "హోమాలు", category_en: "Homams", image: PlaceHolderImages.find(p => p.id === 'puja-maha-durga')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-maha-durga')?.imageHint || '' },
  { id: 31, name: "దేవి సూక్త హోమము", name_en: "Devi Sukta Homam", description: "Homa with chanting of Devi Suktam to honor the Divine Mother.", description_te: "దివ్య తల్లిని గౌరవించటానికి దేవి సూక్తం పఠనంతో హోమం.", category: "హోమాలు", category_en: "Homams", image: PlaceHolderImages.find(p => p.id === 'puja-devi-sukta')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-devi-sukta')?.imageHint || '' },
  { id: 32, name: "సరస్వతీసూక్త హోమము", name_en: "Saraswati Sukta Homam", description: "Homa with chanting of Saraswati Suktam for knowledge and wisdom.", description_te: "జ్ఞానం మరియు వివేకం కోసం సరస్వతీ సూక్తం పఠనంతో హోమం.", category: "హోమాలు", category_en: "Homams", image: PlaceHolderImages.find(p => p.id === 'puja-saraswati-sukta')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-saraswati-sukta')?.imageHint || '' },
  { id: 33, name: "మేధా సూక్త హోమము", name_en: "Medha Sukta Homam", description: "Homa for enhancing intelligence and memory.", description_te: "తెలివితేటలు మరియు జ్ఞాపకశక్తిని పెంచడానికి హోమం.", category: "హోమాలు", category_en: "Homams", image: PlaceHolderImages.find(p => p.id === 'puja-medha-sukta')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-medha-sukta')?.imageHint || '' },
  { id: 34, name: "దేవి గాయత్రీ హోమము", name_en: "Devi Gayatri Homam", description: "Homa invoking Devi Gayatri for spiritual enlightenment.", description_te: "ఆధ్యాత్మిక జ్ఞానోదయం కోసం దేవి గాయత్రిని ప్రేరేపించే హోమం.", category: "హోమాలు", category_en: "Homams", image: PlaceHolderImages.find(p => p.id === 'puja-devi-gayatri')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-devi-gayatri')?.imageHint || '' },
  { id: 35, name: "సుదర్శన హోమము", name_en: "Sudarshana Homam", description: "Homa to invoke Sudarshana Chakra for protection.", description_te: "రక్షణ కోసం సుదర్శన చక్రాన్ని ప్రేరేపించడానికి హోమం.", category: "హోమాలు", category_en: "Homams", image: PlaceHolderImages.find(p => p.id === 'puja-sudarshana')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-sudarshana')?.imageHint || '' },

  // పూజలు (Pujas)
  { id: 36, name: "విగ్నేశ్వర పూజ", name_en: "Vigneshwara Puja", description: "Puja to Lord Ganesha before starting any new venture.", description_te: "ఏదైనా కొత్త వెంచర్ ప్రారంభించే ముందు గణేశుడికి పూజ.", category: "పూజలు", category_en: "Pujas", image: PlaceHolderImages.find(p => p.id === 'puja-vigneshwara')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-vigneshwara')?.imageHint || '' },
  { id: 37, name: "వరుణ పూజ", name_en: "Varuna Puja", description: "Puja to the water god Varuna.", description_te: "జలదేవుడు వరుణునికి పూజ.", category: "పూజలు", category_en: "Pujas", image: PlaceHolderImages.find(p => p.id === 'puja-varuna')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-varuna')?.imageHint || '' },
  { id: 38, name: "పుణ్యాహవచనము", name_en: "Punyahavachanam", description: "Purification ceremony for a place or person.", description_te: "ఒక ప్రదేశం లేదా వ్యక్తి కోసం శుద్దీకరణ కార్యక్రమం.", category: "పూజలు", category_en: "Pujas", image: PlaceHolderImages.find(p => p.id === 'puja-punyahavachanam')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-punyahavachanam')?.imageHint || '' },
  { id: 39, name: "వివాహము", name_en: "Vivaham (Wedding)", description: "The sacred Hindu wedding ceremony.", description_te: "పవిత్ర హిందూ వివాహ వేడుక.", category: "పూజలు", category_en: "Pujas", image: PlaceHolderImages.find(p => p.id === 'puja-vivaham')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-vivaham')?.imageHint || '' },
  { id: 40, name: "గర్భాదానము", name_en: "Garbhadanam", description: "Conception ceremony.", description_te: "గర్భధారణ కార్యక్రమం.", category: "పూజలు", category_en: "Pujas", image: PlaceHolderImages.find(p => p.id === 'puja-garbhadanam')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-garbhadanam')?.imageHint || '' },
  { id: 41, name: "పుంసవనము", name_en: "Pumsavanam", description: "A prenatal ceremony for a healthy child.", description_te: "ఆరోగ్యకరమైన బిడ్డ కోసం ప్రసవ పూర్వ వేడుక.", category: "పూజలు", category_en: "Pujas", image: PlaceHolderImages.find(p => p.id === 'puja-pumsavanam')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-pumsavanam')?.imageHint || '' },
  { id: 42, name: "సీమంతము", name_en: "Seemantham", description: "A prenatal ceremony similar to a baby shower.", description_te: "బేబీ షవర్ మాదిరిగానే ప్రసవ పూర్వ వేడుక.", category: "పూజలు", category_en: "Pujas", image: PlaceHolderImages.find(p => p.id === 'puja-seemantam')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-seemantam')?.imageHint || '' },
  { id: 43, name: "జాతకర్మ", name_en: "Jathakarma", description: "A birth ceremony for a newborn.", description_te: "నవజాత శిశువు కోసం జనన వేడుక.", category: "పూజలు", category_en: "Pujas", image: PlaceHolderImages.find(p => p.id === 'puja-jathakarma')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-jathakarma')?.imageHint || '' },
  { id: 44, name: "నామకరణము", name_en: "Namakaranam", description: "Sacred ceremony to name a newborn child.", description_te: "నవజాత శిశువుకు పేరు పెట్టడానికి పవిత్రమైన వేడుక.", category: "పూజలు", category_en: "Pujas", image: PlaceHolderImages.find(p => p.id === 'puja-namakaranam')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-namakaranam')?.imageHint || '' },
  { id: 45, name: "అన్నప్రాసనము", name_en: "Annaprasana", description: "A child's first feeding ceremony.", description_te: "పిల్లల మొదటి దాణా కార్యక్రమం.", category: "పూజలు", category_en: "Pujas", image: PlaceHolderImages.find(p => p.id === 'puja-annaprasana')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-annaprasana')?.imageHint || '' },
  { id: 46, name: "చూడకర్మ", name_en: "Chudakarma", description: "First haircut ceremony for a child.", description_te: "పిల్లల కోసం మొదటి జుట్టు కత్తిరించే కార్యక్రమం.", category: "పూజలు", category_en: "Pujas", image: PlaceHolderImages.find(p => p.id === 'puja-chudakarma')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-chudakarma')?.imageHint || '' },
  { id: 47, name: "కర్ణ వేద", name_en: "Karna Vedha", description: "Ear-piercing ceremony.", description_te: "చెవి కుట్టే కార్యక్రమం.", category: "పూజలు", category_en: "Pujas", image: PlaceHolderImages.find(p => p.id === 'puja-karna-vedha')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-karna-vedha')?.imageHint || '' },
  { id: 48, name: "ఉపనయనము", name_en: "Upanayanam", description: "Sacred thread ceremony.", description_te: "పవిత్ర దారం కార్యక్రమం.", category: "పూజలు", category_en: "Pujas", image: PlaceHolderImages.find(p => p.id === 'puja-upanayanam')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-upanayanam')?.imageHint || '' },
  { id: 49, name: "వేదారంభము", name_en: "Vedarambham", description: "Beginning of Vedic studies.", description_te: "వేద అధ్యయనాల ప్రారంభం.", category: "పూజలు", category_en: "Pujas", image: PlaceHolderImages.find(p => p.id === 'puja-vedarambham')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-vedarambham')?.imageHint || '' },
  { id: 50, name: "సమా వర్తము", name_en: "Sama Vartamu", description: "Ceremony marking the end of formal Vedic education.", description_te: "అనధికారిక వేద విద్య ముగింపును సూచించే వేడుక.", category: "పూజలు", category_en: "Pujas", image: PlaceHolderImages.find(p => p.id === 'puja-sama-vartamu')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-sama-vartamu')?.imageHint || '' },
  { id: 51, name: "గృహప్రవేశము", name_en: "Gruhapravesam", description: "House warming ceremony to purify a new home.", description_te: "కొత్త ఇంటిని శుద్ధి చేయడానికి గృహ ప్రవేశ వేడుక.", category: "పూజలు", category_en: "Pujas", image: PlaceHolderImages.find(p => p.id === 'puja-gruhapravesam')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-gruhapravesam')?.imageHint || '' },
  { id: 52, name: "వానప్రస్థము", name_en: "Vanaprastham", description: "Ceremony for entering the retired stage of life.", description_te: "విరమణ దశలోకి ప్రవేశించడానికి వేడుక.", category: "పూజలు", category_en: "Pujas", image: PlaceHolderImages.find(p => p.id === 'puja-vanaprastham')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-vanaprastham')?.imageHint || '' },
  { id: 53, name: "సన్యాసము", name_en: "Sanyasam", description: "Ceremony for entering the renounced stage of life.", description_te: "సన్యసించిన జీవిత దశలోకి ప్రవేశించడానికి వేడుక.", category: "పూజలు", category_en: "Pujas", image: PlaceHolderImages.find(p => p.id === 'puja-sanyasam')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-sanyasam')?.imageHint || '' },
  { id: 54, name: "ప్రత్యేక పూజలు", name_en: "Special Pujas", description: "Special pujas performed during various festivals.", description_te: "వివిధ పండుగల సమయంలో చేసే ప్రత్యేక పూజలు.", category: "పూజలు", category_en: "Pujas", image: PlaceHolderImages.find(p => p.id === 'puja-special-pujas')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-special-pujas')?.imageHint || '' },

  // కళ్యాణములు (Kalyanams)
  { id: 55, name: "శివపార్వతుల కళ్యాణం", name_en: "Sivaparvathula Kalyanam", description: "Celestial wedding of Lord Shiva and Goddess Parvati.", description_te: "శివపార్వతుల దివ్య వివాహం.", category: "కళ్యాణములు", category_en: "Kalyanams", image: PlaceHolderImages.find(p => p.id === 'puja-sivaparvathula-kalyanam')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-sivaparvathula-kalyanam')?.imageHint || '' },
  { id: 56, name: "శ్రీ రామ కళ్యాణము", name_en: "Sri Rama Kalyanam", description: "Celestial wedding of Lord Rama and Goddess Sita.", description_te: "శ్రీరాముడు మరియు సీతాదేవి దివ్య వివాహం.", category: "కళ్యాణములు", category_en: "Kalyanams", image: PlaceHolderImages.find(p => p.id === 'puja-sri-rama-kalyanam')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-sri-rama-kalyanam')?.imageHint || '' },
  { id: 57, name: "తులసీదాత్రీ కళ్యాణము", name_en: "Tulasi Datri Kalyanam", description: "Celestial wedding of Tulasi and Datri.", description_te: "తులసి మరియు దాత్రిల దివ్య వివాహం.", category: "కళ్యాణములు", category_en: "Kalyanams", image: PlaceHolderImages.find(p => p.id === 'puja-tulasi-datri-kalyanam')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-tulasi-datri-kalyanam')?.imageHint || '' },
  { id: 58, name: "గో వృషభ కళ్యాణము", name_en: "Go Vrushabha Kalyanam", description: "Wedding ceremony for cows and bulls.", description_te: "ఆవులు, ఎద్దులకు పెళ్లి వేడుక.", category: "కళ్యాణములు", category_en: "Kalyanams", image: PlaceHolderImages.find(p => p.id === 'puja-go-vrushabha-kalyanam')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-go-vrushabha-kalyanam')?.imageHint || '' },
  { id: 59, name: "శ్రీనివాస కళ్యాణం", name_en: "Srinivasa Kalyanam", description: "Celestial wedding of Lord Srinivasa and Goddess Padmavathi.", description_te: "శ్రీనివాసుడు మరియు పద్మావతి దేవి దివ్య వివాహం.", category: "కళ్యాణములు", category_en: "Kalyanams", image: PlaceHolderImages.find(p => p.id === 'puja-srinivasa-kalyanam')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-srinivasa-kalyanam')?.imageHint || '' },
  
  // దోష పరిహార పూజలు (Dosha Parihara Pujas)
  { id: 60, name: "ఆదిత్యాది నవ గ్రహాల దోష పూజలు", name_en: "Navagraha Dosha Puja", description: "Pujas to pacify the nine planets and remove malefic effects.", description_te: "నవగ్రహాలను శాంతింపజేయడానికి మరియు దుష్ప్రభావాలను తొలగించడానికి పూజలు.", category: "దోష పరిహార పూజలు", category_en: "Dosha Parihara Pujas", image: PlaceHolderImages.find(p => p.id === 'puja-navagraha-dosha')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-navagraha-dosha')?.imageHint || '' },
  { id: 61, name: "సర్ప దోష పూజ", name_en: "Sarpa Dosha Puja", description: "Puja to remedy astrological flaws related to serpents.", description_te: "సర్పాలకు సంబంధించిన జ్యోతిష్యపరమైన లోపాలను నివారించడానికి పూజ.", category: "దోష పరిహార పూజలు", category_en: "Dosha Parihara Pujas", image: PlaceHolderImages.find(p => p.id === 'puja-sarpa-dosha')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-sarpa-dosha')?.imageHint || '' },
  { id: 62, name: "వివాహ దోష పూజ", name_en: "Vivaha Dosha Puja", description: "Puja to remove obstacles in marriage.", description_te: "వివాహంలో అడ్డంకులను తొలగించడానికి పూజ.", category: "దోష పరిహార పూజలు", category_en: "Dosha Parihara Pujas", image: PlaceHolderImages.find(p => p.id === 'puja-vivaha-dosha')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-vivaha-dosha')?.imageHint || '' },
  { id: 63, name: "సంతాన దోష పూజ", name_en: "Santana Dosha Puja", description: "Puja to overcome problems in conceiving a child.", description_te: "పిల్లలను గర్భం దాల్చడంలో సమస్యలను అధిగమించడానికి పూజ.", category: "దోష పరిహార పూజలు", category_en: "Dosha Parihara Pujas", image: PlaceHolderImages.find(p => p.id === 'puja-santana-dosha')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-santana-dosha')?.imageHint || '' },

  // దీక్ష పూజలు (Deeksha Pujas)
  { id: 64, name: "అయ్యప్ప స్వామి దీక్షలు", name_en: "Ayyappa Swamy Deeksha", description: "Penance and pujas for devotees of Ayyappa Deeksha.", description_te: "అయ్యప్ప దీక్షా భక్తులకు తపస్సు మరియు పూజలు.", category: "దీక్ష పూజలు", category_en: "Deeksha Pujas", image: PlaceHolderImages.find(p => p.id === 'puja-ayyappa-deeksha')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-ayyappa-deeksha')?.imageHint || '' },
  { id: 65, name: "ఆంజనేయ దీక్షలు", name_en: "Anjaneya Deeksha", description: "Deeksha dedicated to Lord Anjaneya.", description_te: "ఆంజనేయ స్వామికి అంకితం చేయబడిన దీక్ష.", category: "దీక్ష పూజలు", category_en: "Deeksha Pujas", image: PlaceHolderImages.find(p => p.id === 'puja-anjaneya-deeksha')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-anjaneya-deeksha')?.imageHint || '' },
  { id: 66, name: "భవాని దీక్షలు", name_en: "Bhavani Deeksha", description: "Deeksha dedicated to Goddess Bhavani.", description_te: "భవాని దేవికి అంకితం చేయబడిన దీక్ష.", category: "దీక్ష పూజలు", category_en: "Deeksha Pujas", image: PlaceHolderImages.find(p => p.id === 'puja-bhavani-deeksha')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-bhavani-deeksha')?.imageHint || '' },
  { id: 67, name: "శివ దీక్షలు", name_en: "Shiva Deeksha", description: "Deeksha dedicated to Lord Shiva.", description_te: "శివునికి అంకితం చేయబడిన దీక్ష.", category: "దీక్ష పూజలు", category_en: "Deeksha Pujas", image: PlaceHolderImages.find(p => p.id === 'puja-shiva-deeksha')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-shiva-deeksha')?.imageHint || '' },
  { id: 68, name: "శ్రీనివాస దీక్షలు", name_en: "Srinivasa Deeksha", description: "Deeksha dedicated to Lord Srinivasa.", description_te: "శ్రీనివాసునికి అంకితం చేయబడిన దీక్ష.", category: "దీక్ష పూజలు", category_en: "Deeksha Pujas", image: PlaceHolderImages.find(p => p.id === 'puja-srinivasa-deeksha')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-srinivasa-deeksha')?.imageHint || '' },
];

const pujaris: Pujari[] = [
  {
    id: 1,
    name: "Sri Anantha Sharma",
    photo: PlaceHolderImages.find(p => p.id === 'pujari-1')?.imageUrl || '',
    photoHint: PlaceHolderImages.find(p => p.id === 'pujari-1')?.imageHint || '',
    rating: 4.9,
    reviewCount: 152,
    basePrice: 5000,
    qualifications: ["Veda Praveena", "Sama Veda Pandit"],
    languages: ["Telugu", "Sanskrit", "English"],
    experience: 20,
    pujas: [1, 4, 15, 51, 59, 60, 39],
    maxParticipants: 50,
    location: { lat: 16.30, lng: 80.44 }, // Guntur Area
    description: "A highly respected Pujari with two decades of experience in conducting a wide range of Vedic rituals. Specializes in wedding ceremonies and intricate homams. Known for his deep knowledge and patient explanations.",
    phone: "123-456-7890",
    gallery: [
      { url: PlaceHolderImages.find(p => p.id === 'pujari-gallery-1')?.imageUrl || '', hint: 'hindu ritual' },
      { url: PlaceHolderImages.find(p => p.id === 'pujari-gallery-2')?.imageUrl || '', hint: 'priest reading' },
      { url: PlaceHolderImages.find(p => p.id === 'pujari-gallery-3')?.imageUrl || '', hint: 'ceremony items' },
    ],
    reviews: [
      { name: "Ramesh K.", rating: 5, comment: "Anantha Sharma garu performed our Griha Pravesham flawlessly. Very knowledgeable and professional." },
      { name: "Sunita P.", rating: 5, comment: "Excellent Satyanarayana Vratham. He explained all the steps beautifully." },
    ]
  },
  {
    id: 2,
    name: "Pujari Veda Prakash",
    photo: PlaceHolderImages.find(p => p.id === 'pujari-2')?.imageUrl || '',
    photoHint: PlaceHolderImages.find(p => p.id === 'pujari-2')?.imageHint || '',
    rating: 4.8,
    reviewCount: 98,
    basePrice: 4500,
    qualifications: ["Yajur Veda Koumudi", "Jyotisha Acharya"],
    languages: ["Kannada", "Sanskrit", "Hindi"],
    experience: 15,
    pujas: [10, 14, 19, 61, 44, 45, 1, 15, 51],
    maxParticipants: 20,
    location: { lat: 16.32, lng: 80.45 }, // Guntur Area
    description: "Veda Prakash ji is an expert in various homams and dosha parihara pujas. His calm demeanor and command over mantras create a divine atmosphere.",
    phone: "234-567-8901",
    gallery: [
      { url: PlaceHolderImages.find(p => p.id === 'pujari-gallery-2')?.imageUrl || '', hint: 'priest reading' },
      { url: PlaceHolderImages.find(p => p.id === 'pujari-gallery-3')?.imageUrl || '', hint: 'ceremony items' },
      { url: PlaceHolderImages.find(p => p.id === 'pujari-gallery-1')?.imageUrl || '', hint: 'hindu ritual' },
    ],
    reviews: [
      { name: "Anand M.", rating: 5, comment: "Very satisfied with the Ganapathi Homam. Pujari ji was very patient." },
      { name: "Priya S.", rating: 4, comment: "Good experience for the Sarpa Dosha puja." },
    ]
  },
  {
    id: 3,
    name: "Pandit Krishna Sastry",
    photo: PlaceHolderImages.find(p => p.id === 'pujari-3')?.imageUrl || '',
    photoHint: PlaceHolderImages.find(p => p.id === 'pujari-3')?.imageHint || '',
    rating: 4.9,
    reviewCount: 210,
    basePrice: 6000,
    qualifications: ["Rig Veda Ghana Pathi"],
    languages: ["Tamil", "Sanskrit", "English"],
    experience: 25,
    pujas: [2, 15, 51, 44, 45, 48, 55, 56, 59, 39],
    maxParticipants: 100,
    location: { lat: 16.28, lng: 80.42 }, // Guntur Area
    description: "A veteran in the field, Krishna Sastry has performed over a thousand pujas. He is sought after for his expertise in large-scale events and weddings.",
    phone: "345-678-9012",
    gallery: [
      { url: PlaceHolderImages.find(p => p.id === 'pujari-gallery-3')?.imageUrl || '', hint: 'ceremony items' },
      { url: PlaceHolderImages.find(p => p.id === 'pujari-gallery-1')?.imageUrl || '', hint: 'hindu ritual' },
      { url: PlaceHolderImages.find(p => p.id === 'pujari-gallery-2')?.imageUrl || '', hint: 'priest reading' },
    ],
    reviews: [
      { name: "Deepak R.", rating: 5, comment: "The best wedding ceremony we could have asked for. Sastry garu is a true master." },
    ]
  },
  {
    id: 4,
    name: "Ganapathi Avadhani",
    photo: PlaceHolderImages.find(p => p.id === 'pujari-4')?.imageUrl || '',
    photoHint: PlaceHolderImages.find(p => p.id === 'pujari-4')?.imageHint || '',
    rating: 4.7,
    reviewCount: 75,
    basePrice: 3500,
    qualifications: ["Atharva Veda Pandit"],
    languages: ["Hindi", "Sanskrit"],
    experience: 12,
    pujas: [15, 16, 19, 35, 60, 61, 62],
    maxParticipants: 30,
    location: { lat: 16.31, lng: 80.40 }, // Guntur Area
    description: "Specializing in various Homams and Dosha remedies, Ganapathi Avadhani is known for his powerful chanting and adherence to traditional practices.",
    phone: "456-789-0123",
    gallery: [
      { url: PlaceHolderImages.find(p => p.id === 'pujari-gallery-1')?.imageUrl || '', hint: 'hindu ritual' },
      { url: PlaceHolderImages.find(p => p.id === 'pujari-gallery-3')?.imageUrl || '', hint: 'ceremony items' },
      { url: PlaceHolderImages.find(p => p.id === 'pujari-gallery-2')?.imageUrl || '', hint: 'priest reading' },
    ],
    reviews: [
      { name: "Varun G.", rating: 5, comment: "We were very happy with the Griha Pravesham puja. Everything was perfect." },
    ]
  },
  {
    id: 5,
    name: "Surya Narayana",
    photo: PlaceHolderImages.find(p => p.id === 'pujari-5')?.imageUrl || '',
    photoHint: PlaceHolderImages.find(p => p.id === 'pujari-5')?.imageHint || '',
    rating: 5.0,
    reviewCount: 55,
    basePrice: 4000,
    qualifications: ["Veda Siromani"],
    languages: ["Telugu", "Sanskrit"],
    experience: 8,
    pujas: [1, 4, 5, 10, 14, 64, 65, 66],
    maxParticipants: 15,
    location: { lat: 16.29, lng: 80.46 }, // Guntur Area
    description: "A young and energetic pujari, Surya Narayana is praised for his dedication and ability to connect with all generations. Perfect for family pujas and deekshas.",
    phone: "567-890-1234",
    gallery: [
      { url: PlaceHolderImages.find(p => p.id === 'pujari-gallery-2')?.imageUrl || '', hint: 'priest reading' },
      { url: PlaceHolderImages.find(p => p.id === 'pujari-gallery-1')?.imageUrl || '', hint: 'hindu ritual' },
      { url: PlaceHolderImages.find(p => p.id === 'pujari-gallery-3')?.imageUrl || '', hint: 'ceremony items' },
    ],
    reviews: [
      { name: "Kavita J.", rating: 5, comment: "Surya Narayana garu was wonderful. The puja was conducted so well and he was very friendly." },
    ]
  },
  {
    id: 6,
    name: "Shastri Ram Kumar",
    photo: PlaceHolderImages.find(p => p.id === 'pujari-1')?.imageUrl || '',
    photoHint: PlaceHolderImages.find(p => p.id === 'pujari-1')?.imageHint || '',
    rating: 4.8,
    reviewCount: 88,
    basePrice: 4800,
    qualifications: ["Jyotish Praveena"],
    languages: ["Telugu", "Hindi", "English"],
    experience: 18,
    pujas: [1, 15, 51, 60, 62, 36, 44],
    maxParticipants: 40,
    location: { lat: 16.33, lng: 80.41 }, // Guntur Area
    description: "Expert in astrology-based remedies and pujas. Provides insightful guidance and performs rituals with utmost precision.",
    phone: "678-901-2345",
    gallery: [
      { url: PlaceHolderImages.find(p => p.id === 'pujari-gallery-1')?.imageUrl || '', hint: 'hindu ritual' },
      { url: PlaceHolderImages.find(p => p.id === 'pujari-gallery-2')?.imageUrl || '', hint: 'priest reading' },
      { url: PlaceHolderImages.find(p => p.id === 'pujari-gallery-3')?.imageUrl || '', hint: 'ceremony items' },
    ],
    reviews: [
      { name: "Suresh V.", rating: 5, comment: "Shastri Ram Kumar's astrological advice was spot on. The puja he performed brought peace to our home." },
    ]
  },
  {
    id: 7,
    name: "Acharya Vishnu Bhat",
    photo: PlaceHolderImages.find(p => p.id === 'pujari-2')?.imageUrl || '',
    photoHint: PlaceHolderImages.find(p => p.id === 'pujari-2')?.imageHint || '',
    rating: 4.9,
    reviewCount: 120,
    basePrice: 5200,
    qualifications: ["Vastu Shastra Expert", "Sama Veda"],
    languages: ["Kannada", "Sanskrit", "English"],
    experience: 22,
    pujas: [51, 38, 36, 15, 1, 4],
    maxParticipants: 60,
    location: { lat: 16.27, lng: 80.47 }, // Guntur Area
    description: "Specializes in Vastu Shastra consultations and Gruhapravesam ceremonies. His guidance ensures positive energy flow in new homes.",
    phone: "789-012-3456",
    gallery: [
      { url: PlaceHolderImages.find(p => p.id === 'pujari-gallery-2')?.imageUrl || '', hint: 'priest reading' },
      { url: PlaceHolderImages.find(p => p.id === 'pujari-gallery-1')?.imageUrl || '', hint: 'hindu ritual' },
      { url: PlaceHolderImages.find(p => p.id === 'pujari-gallery-3')?.imageUrl || '', hint: 'ceremony items' },
    ],
    reviews: [
      { name: "Meera N.", rating: 5, comment: "Vishnu Bhat's Vastu advice was invaluable for our new office. The Gruhapravesam was beautiful." },
    ]
  },
  {
    id: 8,
    name: "Pandit Shiva Prasad",
    photo: PlaceHolderImages.find(p => p.id === 'pujari-3')?.imageUrl || '',
    photoHint: PlaceHolderImages.find(p => p.id === 'pujari-3')?.imageHint || '',
    rating: 4.7,
    reviewCount: 65,
    basePrice: 4200,
    qualifications: ["Pancharatra Agama"],
    languages: ["Telugu", "Sanskrit"],
    experience: 10,
    pujas: [59, 56, 1, 35, 16],
    maxParticipants: 25,
    location: { lat: 16.35, lng: 80.48 }, // Guntur Area
    description: "A young, devoted priest specializing in temple-style pujas and kalyanams. Known for his melodious chanting.",
    phone: "890-123-4567",
    gallery: [
      { url: PlaceHolderImages.find(p => p.id === 'pujari-gallery-3')?.imageUrl || '', hint: 'ceremony items' },
      { url: PlaceHolderImages.find(p => p.id === 'pujari-gallery-2')?.imageUrl || '', hint: 'priest reading' },
      { url: PlaceHolderImages.find(p => p.id === 'pujari-gallery-1')?.imageUrl || '', hint: 'hindu ritual' },
    ],
    reviews: [
      { name: "Rajesh G.", rating: 5, comment: "Pandit Shiva Prasad conducted our Srinivasa Kalyanam beautifully. His voice is divine." },
    ]
  }
];

export async function getPujas(): Promise<Puja[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 50));
  return pujas;
}

export async function getPujariById(id: number): Promise<Pujari | undefined> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 50));
  return pujaris.find(p => p.id === id);
}

export async function getPujaris(): Promise<Pujari[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 50));
    return pujaris;
}

export async function getPujaById(id: number): Promise<Puja | undefined> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return pujas.find(p => p.id === id);
}
