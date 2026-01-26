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
  { id: 1, name: "సత్యనారాయణ వ్రతము", name_en: "Satyanarayana Vratam", description: "For prosperity, well-being, and honoring Lord Vishnu.", description_te: "శ్రేయస్సు, శ్రేయస్సు మరియు విష్ణువును గౌరవించడం కోసం.", category: "వ్రతాలు", category_en: "Vratas", image: "https://images.unsplash.com/photo-1601121833543-b3a125341620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoaW5kdSUyMHByYXllciUyMG9mZmVyaW5nfGVufDB8fHx8MTY5OTg3NTg4OXww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'prayer offering' },
  { id: 2, name: "కేదారేశ్వర వ్రతము", name_en: "Kedareshwara Vratam", description: "Performed for health and prosperity, dedicated to Lord Shiva.", description_te: "ఆరోగ్యం మరియు శ్రేయస్సు కోసం ప్రదర్శించబడింది, శివునికి అంకితం చేయబడింది.", category: "వ్రతాలు", category_en: "Vratas", image: "https://images.unsplash.com/photo-1563869234851-3e1b129a434b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxsb3JkJTIwc2hpdmF8ZW58MHx8fHwxNjk5ODc1ODg5fDA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'lord shiva' },
  { id: 3, name: "అనంత పద్మనాభ స్వామి వ్రతం", name_en: "Ananta Padmanabha Swamy Vratam", description: "Honoring Lord Ananta Padmanabha Swamy for blessings.", description_te: "ఆశీర్వాదం కోసం శ్రీ అనంత పద్మనాభ స్వామిని గౌరవించడం.", category: "వ్రతాలు", category_en: "Vratas", image: "https://images.unsplash.com/photo-1617992923985-7835a262d03a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxsb3JkJTIwdmlzaG51fGVufDB8fHx8fDE2OTk4NzU5NjF8MA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'lord vishnu' },
  { id: 4, name: "వరలక్ష్మీ వ్రతము", name_en: "Varalakshmi Vratam", description: "To appease the goddess Lakshmi for wealth and prosperity.", description_te: "సంపద మరియు శ్రేయస్సు కోసం లక్ష్మీ దేవతను ప్రసన్నం చేసుకోవడానికి.", category: "వ్రతాలు", category_en: "Vratas", image: "https://images.unsplash.com/photo-1622279457482-5d39e5b90680?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxnoddGVzcyUyMGxha3NobWl8ZW58MHx8fHwxNjk5ODc1OTYxfDA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'goddess lakshmi' },
  { id: 5, name: "మంగళ గౌరీ వ్రతము", name_en: "Mangala Gowri Vratam", description: "Performed by married women for a happy marital life.", description_te: "వివాహిత స్త్రీలు సంతోషకరమైన వైవాహిక జీవితం కోసం ప్రదర్శిస్తారు.", category: "వ్రతాలు", category_en: "Vratas", image: "https://images.unsplash.com/photo-1620766182962-6f24458ea8b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzaGl2YSUyMHBhcnZhdGl8ZW58MHx8fHwxNjk5ODc1OTYxfDA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'shiva parvati' },
  { id: 6, name: "మహాలక్ష్మి వ్రతము", name_en: "Mahalakshmi Vratam", description: "A vrata to seek the blessings of Goddess Mahalakshmi.", description_te: "మహాలక్ష్మి దేవి ఆశీర్వాదం కోసం ఒక వ్రతం.", category: "వ్రతాలు", category_en: "Vratas", image: "https://images.unsplash.com/photo-1605333190885-3b1011311028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBjb2lucyUyMGxha3NobWl8ZW58MHx8fHwxNjk5ODc1OTYxfDA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'gold coins' },
  { id: 7, name: "అశ్వద్ధ నారాయణ వ్రతము", name_en: "Aswaddha Narayana Vratam", description: "Worship of the Peepal tree as a form of Lord Narayana.", description_te: "నారాయణుని రూపంగా పీపల్ చెట్టును పూజించడం.", category: "వ్రతాలు", category_en: "Vratas", image: "https://images.unsplash.com/photo-1597554933928-a8335a916325?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwZWVwYWwlMjB0cmVlfGVufDB8fHx8MTY5OTg3NTg4OXww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'sacred tree' },
  { id: 8, name: "సంకట చతుర్థి వ్రతము", name_en: "Sankatahara Chaturthi Vratam", description: "Fasting and puja for Lord Ganesha to remove obstacles.", description_te: "అడ్డంకులను తొలగించడానికి గణేశుడికి ఉపవాసం మరియు పూజ.", category: "వ్రతాలు", category_en: "Vratas", image: "https://images.unsplash.com/photo-1603892576137-2a08a7f7b2d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxsxJTIwZ2FuZXNoYXxlbnwwfHx8fDE2OTk4NzU4ODl8MA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'lord ganesha' },
  { id: 9, name: "సర్వ దేవత వ్రతాలు", name_en: "Sarva Devata Vratas", description: "Vratas dedicated to all deities for overall well-being.", description_te: "మొత్తం శ్రేయస్సు కోసం అన్ని దేవతలకు అంకితం చేయబడిన వ్రతాలు.", category: "వ్రతాలు", category_en: "Vratas", image: "https://images.unsplash.com/photo-1617992923985-7835a262d03a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoaW5kdSUyMGdvZHN8ZW58MHx8fHwxNjk5ODc1OTYxfDA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'hindu gods' },

  // నోములు (Nomulu)
  { id: 10, name: "అట్లతద్ది నోము", name_en: "Atlataddi Nomu", description: "A traditional nomu for a happy married life.", description_te: "సంతోషకరమైన వైవాహిక జీవితం కోసం ఒక సాంప్రదాయ నోము.", category: "నోములు", category_en: "Nomulu", image: "https://images.unsplash.com/photo-1583337637841-3b32c6cc3a3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoaW5kdSUyMHdvbWVuJTIwcHJheWluZ3xlbnwwfHx8fDE2OTk4NzU5NjF8MA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'women praying' },
  { id: 11, name: "ఉండ్రాళ్ళ నోము", name_en: "Undralla Nomu", description: "A nomu involving offerings of steamed rice balls (undrallu).", description_te: "ఆవిరి బియ్యం బంతుల (ఉండ్రాళ్ళు) నైవేద్యంతో కూడిన నోము.", category: "నోములు", category_en: "Nomulu", image: "https://images.unsplash.com/photo-1615837192135-2c2a0d7f2675?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzd2VldCUyMGJhbGxzfGVufDB8fHx8MTY5OTg3NTk2MXww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'rice offering' },
  { id: 12, name: "గౌరీ నోము", name_en: "Gowri Nomu", description: "A nomu dedicated to Goddess Gauri.", description_te: "గౌరీ దేవికి అంకితం చేయబడిన నోము.", category: "నోములు", category_en: "Nomulu", image: "https://images.unsplash.com/photo-1583337637841-3b32c6cc3a3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoaW5kdSUyMHdvbWVuJTIwcHJheWluZ3xlbnwwfHx8fDE2OTk4NzU5NjF8MA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'women praying' },
  { id: 13, name: "కార్తీక నోములు", name_en: "Karthika Nomulu", description: "Various nomulu performed during the holy month of Kartika.", description_te: "పవిత్ర కార్తీక మాసంలో చేసే వివిధ నోములు.", category: "నోములు", category_en: "Nomulu", image: "https://images.unsplash.com/photo-1604389086638-3c3583a6639c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxrYXJ0aWthJTIwbGlnaHRzfGVufDB8fHx8MTY5OTg3NTk2MXww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'kartika month' },
  { id: 14, name: "నాగుల చవితి నోము", name_en: "Nagula Chavithi Nomu", description: "A nomu to worship serpent gods.", description_te: "సర్ప దేవతలను పూజించడానికి ఒక నోము.", category: "నోములు", category_en: "Nomulu", image: "https://images.unsplash.com/photo-1618335914368-e6d8a3d5f308?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxuYWdhJTIwc2VycGVudCUyMGdvZHxlbnwwfHx8fDE2OTk4NzU5NjF8MA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'serpent god' },

  // హోమాలు (Homams)
  { id: 15, name: "మహాగణపతి హోమం", name_en: "Maha Ganapathi Homam", description: "Fire ritual to remove obstacles and ensure success.", description_te: "అడ్డంకులను తొలగించి విజయం సాధించడానికి అగ్ని క్రతువు.", category: "హోమాలు", category_en: "Homams", image: "https://images.unsplash.com/photo-1616940890446-c0e5d09f1bf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoZ3JhaSUyMGNlcmVtb255fGVufDB8fHx8MTcwMTI0NjEzM3ww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'fire ceremony' },
  { id: 16, name: "రుద్రహోమము", name_en: "Rudrabhishekam", description: "A powerful homa dedicated to Lord Rudra (Shiva).", description_te: "రుద్రునికి (శివునికి) అంకితం చేయబడిన ఒక శక్తివంతమైన హోమం.", category: "హోమాలు", category_en: "Homams", image: "https://images.unsplash.com/photo-1616940890446-c0e5d09f1bf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoZ3JhaSUyMGNlcmVtb255fGVufDB8fHx8MTcwMTI0NjEzM3ww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: "shiva homam" },
  { id: 17, name: "మన్యుసూక్త హోమం", name_en: "Manyu Sukta Homam", description: "Homa to appease anger and negative energies.", description_te: "కోపం మరియు ప్రతికూల శక్తులను శాంతింపజేయడానికి హోమం.", category: "హోమాలు", category_en: "Homams", image: "https://images.unsplash.com/photo-1616940890446-c0e5d09f1bf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoZ3JhaSUyMGNlcmVtb255fGVufDB8fHx8MTcwMTI0NjEzM3ww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: "vedic ritual" },
  { id: 18, name: "కన్యా పాశుపత హోమము", name_en: "Kanya Pasupata Homam", description: "Homa for unmarried women seeking a good husband.", description_te: "మంచి భర్తను కోరుకునే అవివాహిత మహిళల కోసం హోమం.", category: "హోమాలు", category_en: "Homams", image: "https://images.unsplash.com/photo-1616940890446-c0e5d09f1bf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoZ3JhaSUyMGNlcmVtb255fGVufDB8fHx8MTcwMTI0NjEzM3ww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: "marriage ritual" },
  { id: 19, name: "మహా మృత్యుంజయ హోమము", name_en: "Maha Mrityunjaya Homam", description: "Homa to Lord Shiva to overcome fear of death and for longevity.", description_te: "మృత్యు భయాన్ని అధిగమించడానికి మరియు దీర్ఘాయువు కోసం శివునికి హోమం.", category: "హోమాలు", category_en: "Homams", image: "https://images.unsplash.com/photo-1563869234851-3e1b129a434b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxsb3JkJTIwc2hpdmF8ZW58MHx8fHwxNjk5ODc1ODg5fDA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: "shiva worship" },
  { id: 20, name: "కుబేర హోమము", name_en: "Kubera Homam", description: "Homa to attract wealth and prosperity by pleasing Lord Kubera.", description_te: "కుబేరుడిని ప్రసన్నం చేసుకోవడం ద్వారా సంపద మరియు శ్రేయస్సును ఆకర్షించడానికి హోమం.", category: "హోమాలు", category_en: "Homams", image: "https://images.unsplash.com/photo-1605333190885-3b1011311028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBjb2lucyUyMGxha3NobWl8ZW58MHx8fHwxNjk5ODc1OTYxfDA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: "wealth ritual" },
  { id: 21, name: "ఋణ విమోచన హోమము", name_en: "Runa Vimochana Homam", description: "Homa to get relief from debts and financial burdens.", description_te: "అప్పులు, ఆర్థిక భారాల నుంచి ఉపశమనం పొందేందుకు హోమం.", category: "హోమాలు", category_en: "Homams", image: "https://images.unsplash.com/photo-1616940890446-c0e5d09f1bf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoZ3JhaSUyMGNlcmVtb255fGVufDB8fHx8MTcwMTI0NjEzM3ww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: "financial freedom" },
  { id: 22, name: "దాంపత్య హోమము", name_en: "Dampatya Homam", description: "Homa for a happy and harmonious married life.", description_te: "సంతోషకరమైన మరియు సామరస్యపూర్వకమైన వైవాహిక జీవితం కోసం హోమం.", category: "హోమాలు", category_en: "Homams", image: "https://images.unsplash.com/photo-1616940890446-c0e5d09f1bf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoZ3JhaSUyMGNlcmVtb255fGVufDB8fHx8MTcwMTI0NjEzM3ww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: "couple ritual" },
  { id: 23, name: "రుద్ర గాయత్రి హోమము", name_en: "Rudra Gayatri Homam", description: "Homa invoking the energies of Rudra Gayatri for protection.", description_te: "రక్షణ కోసం రుద్ర గాయత్రీ శక్తులను ప్రేరేపించే హోమం.", category: "హోమాలు", category_en: "Homams", image: "https://images.unsplash.com/photo-1616940890446-c0e5d09f1bf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoZ3JhaSUyMGNlcmVtb255fGVufDB8fHx8MTcwMTI0NjEzM3ww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: "protection homam" },
  { id: 24, name: "నారాయణ ఉపనిషత్ హోమము", name_en: "Narayana Upanishad Homam", description: "Homa based on the recitations of Narayana Upanishad.", description_te: "నారాయణోపనిషత్తు పారాయణాలపై ఆధారపడిన హోమం.", category: "హోమాలు", category_en: "Homams", image: "https://images.unsplash.com/photo-1616940890446-c0e5d09f1bf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoZ3JhaSUyMGNlcmVtb255fGVufDB8fHx8MTcwMTI0NjEzM3ww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: "vedic chanting" },
  { id: 25, name: "పురుష సూక్త హోమము", name_en: "Purusha Sukta Homam", description: "Homa performed with the chanting of the Purusha Suktam.", description_te: "పురుష సూక్తం పఠనంతో చేసే హోమం.", category: "హోమాలు", category_en: "Homams", image: "https://images.unsplash.com/photo-1616940890446-c0e5d09f1bf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoZ3JhaSUyMGNlcmVtb255fGVufDB8fHx8MTcwMTI0NjEzM3ww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: "purusha suktam" },
  { id: 26, name: "గణపతి సుక్త హోమము", name_en: "Ganapati Sukta Homam", description: "Homa with chanting of Ganapati Suktam for blessings of Ganesha.", description_te: "గణపతి సూక్తం పఠనంతో గణేశుడి ఆశీర్వాదం కోసం హోమం.", category: "హోమాలు", category_en: "Homams", image: "https://images.unsplash.com/photo-1616940890446-c0e5d09f1bf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoZ3JhaSUyMGNlcmVtb255fGVufDB8fHx8MTcwMTI0NjEzM3ww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: "ganesha blessing" },
  { id: 27, name: "గణపతి ఉపనిషత్ హోమము", name_en: "Ganapati Upanishad Homam", description: "Homa based on the recitations of Ganapati Upanishad.", description_te: "గణపతి ఉపనిషత్తు పారాయణాలపై ఆధారపడిన హోమం.", category: "హోమాలు", category_en: "Homams", image: "https://images.unsplash.com/photo-1616940890446-c0e5d09f1bf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoZ3JhaSUyMGNlcmVtb255fGVufDB8fHx8MTcwMTI0NjEzM3ww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: "upanishad ritual" },
  { id: 28, name: "విగ్నేశ్వర గాయత్రి హోమము", name_en: "Vighneshwara Gayatri Homam", description: "Homa invoking Vigneshwara Gayatri for removing obstacles.", description_te: "అడ్డంకులను తొలగించడానికి విఘ్నేశ్వర గాయత్రిని ప్రేరేపించే హోమం.", category: "హోమాలు", category_en: "Homams", image: "https://images.unsplash.com/photo-1616940890446-c0e5d09f1bf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoZ3JhaSUyMGNlcmVtb255fGVufDB8fHx8MTcwMTI0NjEzM3ww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: "obstacle removal" },
  { id: 29, name: "శ్రీ సూక్త హోమము", name_en: "Sri Sukta Homam", description: "Homa with chanting of Sri Suktam for wealth and prosperity.", description_te: "సంపద మరియు శ్రేయస్సు కోసం శ్రీ సూక్తం పఠనంతో హోమం.", category: "హోమాలు", category_en: "Homams", image: "https://images.unsplash.com/photo-1616940890446-c0e5d09f1bf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoZ3JhaSUyMGNlcmVtb255fGVufDB8fHx8MTcwMTI0NjEzM3ww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: "lakshmi homam" },
  { id: 30, name: "మహా దుర్గా హోమము", name_en: "Maha Durga Homam", description: "A powerful homa to Goddess Durga for protection and victory.", description_te: "రక్షణ మరియు విజయం కోసం దుర్గాదేవికి ఒక శక్తివంతమైన హోమం.", category: "హోమాలు", category_en: "Homams", image: "https://images.unsplash.com/photo-1580521852412-a1b57c6318e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxnb2RkZXNzJTIwZHVyZ2F8ZW58MHx8fHwxNzAxMjQ2MTMzfDA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'goddess durga' },
  { id: 31, name: "దేవి సూక్త హోమము", name_en: "Devi Sukta Homam", description: "Homa with chanting of Devi Suktam to honor the Divine Mother.", description_te: "దివ్య తల్లిని గౌరవించటానికి దేవి సూక్తం పఠనంతో హోమం.", category: "హోమాలు", category_en: "Homams", image: "https://images.unsplash.com/photo-1616940890446-c0e5d09f1bf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoZ3JhaSUyMGNlcmVtb255fGVufDB8fHx8MTcwMTI0NjEzM3ww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: "divine mother" },
  { id: 32, name: "సరస్వతీసూక్త హోమము", name_en: "Saraswati Sukta Homam", description: "Homa with chanting of Saraswati Suktam for knowledge and wisdom.", description_te: "జ్ఞానం మరియు వివేకం కోసం సరస్వతీ సూక్తం పఠనంతో హోమం.", category: "హోమాలు", category_en: "Homams", image: "https://images.unsplash.com/photo-1622384483786-9a295b9d3b03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxnoddGVzcyUyMHNhcmFzd2F0aXxlbnwwfHx8fDE2OTk4NzU5NjF8MA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'goddess saraswati' },
  { id: 33, name: "మేధా సూక్త హోమము", name_en: "Medha Sukta Homam", description: "Homa for enhancing intelligence and memory.", description_te: "తెలివితేటలు మరియు జ్ఞాపకశక్తిని పెంచడానికి హోమం.", category: "హోమాలు", category_en: "Homams", image: "https://images.unsplash.com/photo-1616940890446-c0e5d09f1bf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoZ3JhaSUyMGNlcmVtb255fGVufDB8fHx8MTcwMTI0NjEzM3ww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: "intelligence ritual" },
  { id: 34, name: "దేవి గాయత్రీ హోమము", name_en: "Devi Gayatri Homam", description: "Homa invoking Devi Gayatri for spiritual enlightenment.", description_te: "ఆధ్యాత్మిక జ్ఞానోదయం కోసం దేవి గాయత్రిని ప్రేరేపించే హోమం.", category: "హోమాలు", category_en: "Homams", image: "https://images.unsplash.com/photo-1616940890446-c0e5d09f1bf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoZ3JhaSUyMGNlcmVtb255fGVufDB8fHx8MTcwMTI0NjEzM3ww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: "spiritual homam" },
  { id: 35, name: "సుదర్శన హోమము", name_en: "Sudarshana Homam", description: "Homa to invoke Sudarshana Chakra for protection.", description_te: "రక్షణ కోసం సుదర్శన చక్రాన్ని ప్రేరేపించడానికి హోమం.", category: "హోమాలు", category_en: "Homams", image: "https://images.unsplash.com/photo-1617992923985-7835a262d03a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxsb3JkJTIwdmlzaG51fGVufDB8fHx8fDE2OTk4NzU5NjF8MA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'lord vishnu' },

  // పూజలు (Pujas)
  { id: 36, name: "విగ్నేశ్వర పూజ", name_en: "Vigneshwara Puja", description: "Puja to Lord Ganesha before starting any new venture.", description_te: "ఏదైనా కొత్త వెంచర్ ప్రారంభించే ముందు గణేశుడికి పూజ.", category: "పూజలు", category_en: "Pujas", image: "https://images.unsplash.com/photo-1603892576137-2a08a7f7b2d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxsxJTIwZ2FuZXNoYXxlbnwwfHx8fDE2OTk4NzU4ODl8MA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'lord ganesha' },
  { id: 37, name: "వరుణ పూజ", name_en: "Varuna Puja", description: "Puja to the water god Varuna.", description_te: "జలదేవుడు వరుణునికి పూజ.", category: "పూజలు", category_en: "Pujas", image: "https://images.unsplash.com/photo-1596627733490-8356c9b3e9a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxyaXZlciUyMGdhbmdhJTIwdmFyYW5hc2l8ZW58MHx8fHwxNjk5ODc1OTYxfDA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'water god' },
  { id: 38, name: "పుణ్యాహవచనము", name_en: "Punyahavachanam", description: "Purification ceremony for a place or person.", description_te: "ఒక ప్రదేశం లేదా వ్యక్తి కోసం శుద్దీకరణ కార్యక్రమం.", category: "పూజలు", category_en: "Pujas", image: "https://images.unsplash.com/photo-1634693343333-9b6013c30d57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxoaW5kdSUyMHJpdHVhbHxlbnwwfHx8fDE3NjkzNTY5ODZ8MA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'purification ritual' },
  { id: 39, name: "వివాహము", name_en: "Vivaham (Wedding)", description: "The sacred Hindu wedding ceremony.", description_te: "పవిత్ర హిందూ వివాహ వేడుక.", category: "పూజలు", category_en: "Pujas", image: "https://images.unsplash.com/photo-1597157639073-69284dc0fdaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjB3ZWRkaW5nfGVufDB8fHx8MTc2OTI0MzAwN3ww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'indian wedding' },
  { id: 40, name: "గర్భాదానము", name_en: "Garbhadanam", description: "Conception ceremony.", description_te: "గర్భధారణ కార్యక్రమం.", category: "పూజలు", category_en: "Pujas", image: "https://images.unsplash.com/photo-1598289410839-86927900b731?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGluZGlhbiUyMGNvdXBsZXxlbnwwfHx8fDE2OTk4NzU5NjF8MA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'conception ritual' },
  { id: 41, name: "పుంసవనము", name_en: "Pumsavanam", description: "A prenatal ceremony for a healthy child.", description_te: "ఆరోగ్యకరమైన బిడ్డ కోసం ప్రసవ పూర్వ వేడుక.", category: "పూజలు", category_en: "Pujas", image: "https://images.unsplash.com/photo-1515694590395-555ba9b4a184?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwcmVnbmFudCUyMGluZGlhbiUyMHdvbWFufGVufDB8fHx8MTY5OTg3NTk2MXww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'prenatal ceremony' },
  { id: 42, name: "సీమంతము", name_en: "Seemantham", description: "A prenatal ceremony similar to a baby shower.", description_te: "బేబీ షవర్ మాదిరిగానే ప్రసవ పూర్వ వేడుక.", category: "పూజలు", category_en: "Pujas", image: "https://images.unsplash.com/photo-1515694590395-555ba9b4a184?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwcmVnbmFudCUyMGluZGlhbiUyMHdvbWFufGVufDB8fHx8MTY5OTg3NTk2MXww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'baby shower' },
  { id: 43, name: "జాతకర్మ", name_en: "Jathakarma", description: "A birth ceremony for a newborn.", description_te: "నవజాత శిశువు కోసం జనన వేడుక.", category: "పూజలు", category_en: "Pujas", image: "https://images.unsplash.com/photo-1546015593-697c6725e242?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoaW5kdSUyMGJhYnl8ZW58MHx8fHwxNjk5ODc1OTYxfDA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'birth ceremony' },
  { id: 44, name: "నామకరణము", name_en: "Namakaranam", description: "Sacred ceremony to name a newborn child.", description_te: "నవజాత శిశువుకు పేరు పెట్టడానికి పవిత్రమైన వేడుక.", category: "పూజలు", category_en: "Pujas", image: "https://images.unsplash.com/photo-1546015593-697c6725e242?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoaW5kdSUyMGJhYnl8ZW58MHx8fHwxNjk5ODc1OTYxfDA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: "naming ceremony" },
  { id: 45, name: "అన్నప్రాసనము", name_en: "Annaprasana", description: "A child's first feeding ceremony.", description_te: "పిల్లల మొదటి దాణా కార్యక్రమం.", category: "పూజలు", category_en: "Pujas", image: "https://images.unsplash.com/photo-1546015593-697c6725e242?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoaW5kdSUyMGJhYnl8ZW58MHx8fHwxNjk5ODc1OTYxfDA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: "first food" },
  { id: 46, name: "చూడకర్మ", name_en: "Chudakarma", description: "First haircut ceremony for a child.", description_te: "పిల్లల కోసం మొదటి జుట్టు కత్తిరించే కార్యక్రమం.", category: "పూజలు", category_en: "Pujas", image: "https://images.unsplash.com/photo-1546015593-697c6725e242?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoaW5kdSUyMGJhYnl8ZW58MHx8fHwxNjk5ODc1OTYxfDA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'haircut ceremony' },
  { id: 47, name: "కర్ణ వేద", name_en: "Karna Vedha", description: "Ear-piercing ceremony.", description_te: "చెవి కుట్టే కార్యక్రమం.", category: "పూజలు", category_en: "Pujas", image: "https://images.unsplash.com/photo-1546015593-697c6725e242?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoaW5kdSUyMGJhYnl8ZW58MHx8fHwxNjk5ODc1OTYxfDA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'ear piercing' },
  { id: 48, name: "ఉపనయనము", name_en: "Upanayanam", description: "Sacred thread ceremony.", description_te: "పవిత్ర దారం కార్యక్రమం.", category: "పూజలు", category_en: "Pujas", image: "https://images.unsplash.com/photo-1620138459427-33f7c1817154?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzYWNyZWQlMjB0aHJlYWQlMjBjZXJlbW9ueXxlbnwwfHx8fDE2OTk4NzU5NjF8MA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'thread ceremony' },
  { id: 49, name: "వేదారంభము", name_en: "Vedarambham", description: "Beginning of Vedic studies.", description_te: "వేద అధ్యయనాల ప్రారంభం.", category: "పూజలు", category_en: "Pujas", image: "https://images.unsplash.com/photo-1620138459427-33f7c1817154?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzYWNyZWQlMjB0aHJlYWQlMjBjZXJlbW9ueXxlbnwwfHx8fDE2OTk4NzU5NjF8MA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'vedic studies' },
  { id: 50, name: "సమా వర్తము", name_en: "Sama Vartamu", description: "Ceremony marking the end of formal Vedic education.", description_te: "అనధికారిక వేద విద్య ముగింపును సూచించే వేడుక.", category: "పూజలు", category_en: "Pujas", image: "https://images.unsplash.com/photo-1620138459427-33f7c1817154?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzYWNyZWQlMjB0aHJlYWQlMjBjZXJlbW9ueXxlbnwwfHx8fDE2OTk4NzU5NjF8MA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'graduation ceremony' },
  { id: 51, name: "గృహప్రవేశము", name_en: "Gruhapravesam", description: "House warming ceremony to purify a new home.", description_te: "కొత్త ఇంటిని శుద్ధి చేయడానికి గృహ ప్రవేశ వేడుక.", category: "పూజలు", category_en: "Pujas", image: "https://images.unsplash.com/photo-1667132713853-e2824d6865cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxoaW5kdSUyMGNlcmVtb255fGVufDB8fHx8MTc2OTM1Njk4Nnww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'house warming' },
  { id: 52, name: "వానప్రస్థము", name_en: "Vanaprastham", description: "Ceremony for entering the retired stage of life.", description_te: "విరమణ దశలోకి ప్రవేశించడానికి వేడుక.", category: "పూజలు", category_en: "Pujas", image: "https://images.unsplash.com/photo-1523294928042-18ecb3df7fb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxlbGRlcmx5JTIwbWFufGVufDB8fHx8MTc2OTI3NTQ3Nnww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'retirement ritual' },
  { id: 53, name: "సన్యాసము", name_en: "Sanyasam", description: "Ceremony for entering the renounced stage of life.", description_te: "సన్యసించిన జీవిత దశలోకి ప్రవేశించడానికి వేడుక.", category: "పూజలు", category_en: "Pujas", image: "https://images.unsplash.com/photo-1523294928042-18ecb3df7fb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxlbGRlcmx5JTIwbWFufGVufDB8fHx8MTc2OTI3NTQ3Nnww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'renunciation' },
  { id: 54, name: "ప్రత్యేక పూజలు", name_en: "Special Pujas", description: "Special pujas performed during various festivals.", description_te: "వివిధ పండుగల సమయంలో చేసే ప్రత్యేక పూజలు.", category: "పూజలు", category_en: "Pujas", image: "https://images.unsplash.com/photo-1604389086638-3c3583a6639c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxrYXJ0aWthJTIwbGlnaHRzfGVufDB8fHx8MTY5OTg3NTk2MXww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'festival puja' },

  // కళ్యాణములు (Kalyanams)
  { id: 55, name: "శివపార్వతుల కళ్యాణం", name_en: "Sivaparvathula Kalyanam", description: "Celestial wedding of Lord Shiva and Goddess Parvati.", description_te: "శివపార్వతుల దివ్య వివాహం.", category: "కళ్యాణములు", category_en: "Kalyanams", image: "https://images.unsplash.com/photo-1620766182962-6f24458ea8b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzaGl2YSUyMHBhcnZhdGl8ZW58MHx8fHwxNjk5ODc1OTYxfDA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: "shiva parvati" },
  { id: 56, name: "శ్రీ రామ కళ్యాణము", name_en: "Sri Rama Kalyanam", description: "Celestial wedding of Lord Rama and Goddess Sita.", description_te: "శ్రీరాముడు మరియు సీతాదేవి దివ్య వివాహం.", category: "కళ్యాణములు", category_en: "Kalyanams", image: "https://images.unsplash.com/photo-1620022200882-2e55772279b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxyYW1hJTIwc2l0YXxlbnwwfHx8fDE2OTk4NzU5NjF8MA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: "rama sita" },
  { id: 57, name: "తులసీదాత్రీ కళ్యాణము", name_en: "Tulasi Datri Kalyanam", description: "Celestial wedding of Tulasi and Datri.", description_te: "తులసి మరియు దాత్రిల దివ్య వివాహం.", category: "కళ్యాణములు", category_en: "Kalyanams", image: "https://images.unsplash.com/photo-1622384483786-9a295b9d3b03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxnoddGVzcyUyMHNhcmFzd2F0aXxlbnwwfHx8fDE2OTk4NzU5NjF8MA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: "tulasi wedding" },
  { id: 58, name: "గో వృషభ కళ్యాణము", name_en: "Go Vrushabha Kalyanam", description: "Wedding ceremony for cows and bulls.", description_te: "ఆవులు, ఎద్దులకు పెళ్లి వేడుక.", category: "కళ్యాణములు", category_en: "Kalyanams", image: "https://images.unsplash.com/photo-1594468641934-21a4f77c2714?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxob2x5JTIwY293fGVufDB8fHx8MTY5OTg3NTk2MXww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: "cow worship" },
  { id: 59, name: "శ్రీనివాస కళ్యాణం", name_en: "Srinivasa Kalyanam", description: "Celestial wedding of Lord Srinivasa and Goddess Padmavathi.", description_te: "శ్రీనివాసుడు మరియు పద్మావతి దేవి దివ్య వివాహం.", category: "కళ్యాణములు", category_en: "Kalyanams", image: "https://images.unsplash.com/photo-1610405221295-566b75f85b31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxs%73cmQlMjB2ZW5rYXRlc3dhcmF8ZW58MHx8fHwxNjk5ODc1OTYxfDA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'lord venkateswara' },
  
  // దోష పరిహార పూజలు (Dosha Parihara Pujas)
  { id: 60, name: "ఆదిత్యాది నవ గ్రహాల దోష పూజలు", name_en: "Navagraha Dosha Puja", description: "Pujas to pacify the nine planets and remove malefic effects.", description_te: "నవగ్రహాలను శాంతింపజేయడానికి మరియు దుష్ప్రభావాలను తొలగించడానికి పూజలు.", category: "దోష పరిహార పూజలు", category_en: "Dosha Parihara Pujas", image: "https://images.unsplash.com/photo-1629446411202-c9939c36c6a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxuYXZhZ3JhaGF8ZW58MHx8fHwxNjk5ODc1OTYxfDA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'navagraha planets' },
  { id: 61, name: "సర్ప దోష పూజ", name_en: "Sarpa Dosha Puja", description: "Puja to remedy astrological flaws related to serpents.", description_te: "సర్పాలకు సంబంధించిన జ్యోతిష్యపరమైన లోపాలను నివారించడానికి పూజ.", category: "దోష పరిహార పూజలు", category_en: "Dosha Parihara Pujas", image: "https://images.unsplash.com/photo-1618335914368-e6d8a3d5f308?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxuYWdhJTIwc2VycGVudCUyMGdvZHxlbnwwfHx8fDE2OTk4NzU5NjF8MA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'serpent god' },
  { id: 62, name: "వివాహ దోష పూజ", name_en: "Vivaha Dosha Puja", description: "Puja to remove obstacles in marriage.", description_te: "వివాహంలో అడ్డంకులను తొలగించడానికి పూజ.", category: "దోష పరిహార పూజలు", category_en: "Dosha Parihara Pujas", image: "https://images.unsplash.com/photo-1597157639073-69284dc0fdaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjB3ZWRkaW5nfGVufDB8fHx8MTc2OTI0MzAwN3ww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'marriage obstacle' },
  { id: 63, name: "సంతాన దోష పూజ", name_en: "Santana Dosha Puja", description: "Puja to overcome problems in conceiving a child.", description_te: "పిల్లలను గర్భం దాల్చడంలో సమస్యలను అధిగమించడానికి పూజ.", category: "దోష పరిహార పూజలు", category_en: "Dosha Parihara Pujas", image: "https://images.unsplash.com/photo-1546015593-697c6725e242?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoaW5kdSUyMGJhYnl8ZW58MHx8fHwxNjk5ODc1OTYxfDA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: 'child blessing' },

  // దీక్ష పూజలు (Deeksha Pujas)
  { id: 64, name: "అయ్యప్ప స్వామి దీక్షలు", name_en: "Ayyappa Swamy Deeksha", description: "Penance and pujas for devotees of Ayyappa Deeksha.", description_te: "అయ్యప్ప దీక్షా భక్తులకు తపస్సు మరియు పూజలు.", category: "దీక్ష పూజలు", category_en: "Deeksha Pujas", image: "https://images.unsplash.com/photo-1585802804334-7264a85a4a55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjBwYXRofGVufDB8fHx8MTcwMTI0NTg3OHww&ixlib=rb-4.0.3&q=80&w=1080", imageHint: "forest path" },
  { id: 65, name: "ఆంజనేయ దీక్షలు", name_en: "Anjaneya Deeksha", description: "Deeksha dedicated to Lord Anjaneya.", description_te: "ఆంజనేయ స్వామికి అంకితం చేయబడిన దీక్ష.", category: "దీక్ష పూజలు", category_en: "Deeksha Pujas", image: "https://images.unsplash.com/photo-1694701213601-255d668384b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoYW51bWFuJTIwbWVkaXRhdGlvbnxlbnwwfHx8fDE2OTk4NzU4MDl8MA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: "lord hanuman" },
  { id: 66, name: "భవాని దీక్షలు", name_en: "Bhavani Deeksha", description: "Deeksha dedicated to Goddess Bhavani.", description_te: "భవాని దేవికి అంకితం చేయబడిన దీక్ష.", category: "దీక్ష పూజలు", category_en: "Deeksha Pujas", image: "https://images.unsplash.com/photo-1580521852412-a1b57c6318e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxnb2RkZXNzJTIwZHVyZ2F8ZW58MHx8fHwxNzAxMjQ2MTMzfDA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: "goddess bhavani" },
  { id: 67, name: "శివ దీక్షలు", name_en: "Shiva Deeksha", description: "Deeksha dedicated to Lord Shiva.", description_te: "శివునికి అంకితం చేయబడిన దీక్ష.", category: "దీక్ష పూజలు", category_en: "Deeksha Pujas", image: "https://images.unsplash.com/photo-1623869348915-a0b809249a5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzaGl2YSUyMGxpbmdhbXxlbnwwfHx8fDE2OTk4NzU4ODl8MA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: "shiva lingam" },
  { id: 68, name: "శ్రీనివాస దీక్షలు", name_en: "Srinivasa Deeksha", description: "Deeksha dedicated to Lord Srinivasa.", description_te: "శ్రీనివాసునికి అంకితం చేయబడిన దీక్ష.", category: "దీక్ష పూజలు", category_en: "Deeksha Pujas", image: "https://images.unsplash.com/photo-1610405221295-566b75f85b31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxs%73cmQlMjB2ZW5rYXRlc3dhcmF8ZW58MHx8fHwxNjk5ODc1OTYxfDA&ixlib=rb-4.0.3&q=80&w=1080", imageHint: "lord venkateswara" },
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
    location: { lat: 40.7128, lng: -74.0060 }, // NYC
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
    location: { lat: 40.81, lng: -73.96 }, // Upper Manhattan
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
    location: { lat: 40.65, lng: -73.95 }, // Brooklyn
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
    location: { lat: 40.75, lng: -74.1 }, // New Jersey
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
    location: { lat: 40.7484, lng: -73.9857 }, // Midtown
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
