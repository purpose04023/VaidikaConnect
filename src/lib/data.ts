import { PlaceHolderImages } from './placeholder-images';

export interface Puja {
  id: number;
  name: string;
  description: string;
  image: string;
  imageHint: string;
  category: 'వ్రతాలు' | 'నోములు' | 'హోమాలు' | 'పూజలు' | 'కళ్యాణములు' | 'దోష పరిహార పూజలు' | 'దీక్ష పూజలు';
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
  { id: 1, name: "సత్యనారాయణ వ్రతము", description: "For prosperity, well-being, and honoring Lord Vishnu.", category: "వ్రతాలు", image: "https://picsum.photos/seed/puja-1/600/400", imageHint: 'hindu ritual' },
  { id: 2, name: "కేదారేశ్వర వ్రతము", description: "Performed for health and prosperity, dedicated to Lord Shiva.", category: "వ్రతాలు", image: "https://picsum.photos/seed/puja-2/600/400", imageHint: "shiva vrata" },
  { id: 3, name: "అనంత పద్మనాభ స్వామి వ్రతం", description: "Honoring Lord Ananta Padmanabha Swamy for blessings.", category: "వ్రతాలు", image: "https://picsum.photos/seed/puja-3/600/400", imageHint: "lord vishnu" },
  { id: 4, name: "వరలక్ష్మీ వ్రతము", description: "To appease the goddess Lakshmi for wealth and prosperity.", category: "వ్రతాలు", image: "https://picsum.photos/seed/puja-4/600/400", imageHint: "goddess lakshmi" },
  { id: 5, name: "మంగళ గౌరీ వ్రతము", description: "Performed by married women for a happy marital life.", category: "వ్రతాలు", image: "https://picsum.photos/seed/puja-5/600/400", imageHint: "goddess gauri" },
  { id: 6, name: "మహాలక్ష్మి వ్రతము", description: "A vrata to seek the blessings of Goddess Mahalakshmi.", category: "వ్రతాలు", image: "https://picsum.photos/seed/puja-6/600/400", imageHint: "goddess mahalakshmi" },
  { id: 7, name: "అశ్వద్ధ నారాయణ వ్రతము", description: "Worship of the Peepal tree as a form of Lord Narayana.", category: "వ్రతాలు", image: "https://picsum.photos/seed/puja-7/600/400", imageHint: "sacred tree" },
  { id: 8, name: "సంకట చతుర్థి వ్రతము", description: "Fasting and puja for Lord Ganesha to remove obstacles.", category: "వ్రతాలు", image: "https://picsum.photos/seed/puja-8/600/400", imageHint: "lord ganesha" },
  { id: 9, name: "సర్వ దేవత వ్రతాలు", description: "Vratas dedicated to all deities for overall well-being.", category: "వ్రతాలు", image: "https://picsum.photos/seed/puja-9/600/400", imageHint: "hindu gods" },

  // నోములు (Nomulu)
  { id: 10, name: "అట్లతద్ది నోము", description: "A traditional nomu for a happy married life.", category: "నోములు", image: "https://picsum.photos/seed/puja-10/600/400", imageHint: "telugu festival" },
  { id: 11, name: "ఉండ్రాళ్ళ నోము", description: "A nomu involving offerings of steamed rice balls (undrallu).", category: "నోములు", image: "https://picsum.photos/seed/puja-11/600/400", imageHint: "rice offering" },
  { id: 12, name: "గౌరీ నోము", description: "A nomu dedicated to Goddess Gauri.", category: "నోములు", image: "https://picsum.photos/seed/puja-12/600/400", imageHint: "goddess gauri" },
  { id: 13, name: "కార్తీక నోములు", description: "Various nomulu performed during the holy month of Kartika.", category: "నోములు", image: "https://picsum.photos/seed/puja-13/600/400", imageHint: "kartika month" },
  { id: 14, name: "నాగుల చవితి నోము", description: "A nomu to worship serpent gods.", category: "నోములు", image: "https://picsum.photos/seed/puja-14/600/400", imageHint: "serpent god" },

  // హోమాలు (Homalu)
  { id: 15, name: "మహాగణపతి హోమం", description: "Fire ritual to remove obstacles and ensure success.", category: "హోమాలు", image: "https://picsum.photos/seed/puja-15/600/400", imageHint: 'fire ceremony' },
  { id: 16, name: "రుద్రహోమము", description: "A powerful homa dedicated to Lord Rudra (Shiva).", category: "హోమాలు", image: "https://picsum.photos/seed/puja-16/600/400", imageHint: "shiva homam" },
  { id: 17, name: "మన్యుసూక్త హోమం", description: "Homa to appease anger and negative energies.", category: "హోమాలు", image: "https://picsum.photos/seed/puja-17/600/400", imageHint: "vedic ritual" },
  { id: 18, name: "కన్యా పాశుపత హోమము", description: "Homa for unmarried women seeking a good husband.", category: "హోమాలు", image: "https://picsum.photos/seed/puja-18/600/400", imageHint: "marriage ritual" },
  { id: 19, name: "మహా మృత్యుంజయ హోమము", description: "Homa to Lord Shiva to overcome fear of death and for longevity.", category: "హోమాలు", image: "https://picsum.photos/seed/puja-19/600/400", imageHint: "shiva worship" },
  { id: 20, name: "కుబేర హోమము", description: "Homa to attract wealth and prosperity by pleasing Lord Kubera.", category: "హోమాలు", image: "https://picsum.photos/seed/puja-20/600/400", imageHint: "wealth ritual" },
  { id: 21, name: "ఋణ విమోచన హోమము", description: "Homa to get relief from debts and financial burdens.", category: "హోమాలు", image: "https://picsum.photos/seed/puja-21/600/400", imageHint: "financial freedom" },
  { id: 22, name: "దాంపత్య హోమము", description: "Homa for a happy and harmonious married life.", category: "హోమాలు", image: "https://picsum.photos/seed/puja-22/600/400", imageHint: "couple ritual" },
  { id: 23, name: "రుద్ర గాయత్రి హోమము", description: "Homa invoking the energies of Rudra Gayatri for protection.", category: "హోమాలు", image: "https://picsum.photos/seed/puja-23/600/400", imageHint: "protection homam" },
  { id: 24, name: "నారాయణ ఉపనిషత్ హోమము", description: "Homa based on the recitations of Narayana Upanishad.", category: "హోమాలు", image: "https://picsum.photos/seed/puja-24/600/400", imageHint: "vedic chanting" },
  { id: 25, name: "పురుష సూక్త హోమము", description: "Homa performed with the chanting of the Purusha Suktam.", category: "హోమాలు", image: "https://picsum.photos/seed/puja-25/600/400", imageHint: "purusha suktam" },
  { id: 26, name: "గణపతి సుక్త హోమము", description: "Homa with chanting of Ganapati Suktam for blessings of Ganesha.", category: "హోమాలు", image: "https://picsum.photos/seed/puja-26/600/400", imageHint: "ganesha blessing" },
  { id: 27, name: "గణపతి ఉపనిషత్ హోమము", description: "Homa based on the recitations of Ganapati Upanishad.", category: "హోమాలు", image: "https://picsum.photos/seed/puja-27/600/400", imageHint: "upanishad ritual" },
  { id: 28, name: "విగ్నేశ్వర గాయత్రి హోమము", description: "Homa invoking Vigneshwara Gayatri for removing obstacles.", category: "హోమాలు", image: "https://picsum.photos/seed/puja-28/600/400", imageHint: "obstacle removal" },
  { id: 29, name: "శ్రీ సూక్త హోమము", description: "Homa with chanting of Sri Suktam for wealth and prosperity.", category: "హోమాలు", image: "https://picsum.photos/seed/puja-29/600/400", imageHint: "lakshmi homam" },
  { id: 30, name: "మహా దుర్గా హోమము", description: "A powerful homa to Goddess Durga for protection and victory.", category: "హోమాలు", image: "https://picsum.photos/seed/puja-30/600/400", imageHint: "goddess durga" },
  { id: 31, name: "దేవి సూక్త హోమము", description: "Homa with chanting of Devi Suktam to honor the Divine Mother.", category: "హోమాలు", image: "https://picsum.photos/seed/puja-31/600/400", imageHint: "divine mother" },
  { id: 32, name: "సరస్వతీసూక్త హోమము", description: "Homa with chanting of Saraswati Suktam for knowledge and wisdom.", category: "హోమాలు", image: "https://picsum.photos/seed/puja-32/600/400", imageHint: "goddess saraswati" },
  { id: 33, name: "మేధా సూక్త హోమము", description: "Homa for enhancing intelligence and memory.", category: "హోమాలు", image: "https://picsum.photos/seed/puja-33/600/400", imageHint: "intelligence ritual" },
  { id: 34, name: "దేవి గాయత్రీ హోమము", description: "Homa invoking Devi Gayatri for spiritual enlightenment.", category: "హోమాలు", image: "https://picsum.photos/seed/puja-34/600/400", imageHint: "spiritual homam" },
  { id: 35, name: "సుదర్శన హోమము", description: "Homa to invoke Sudarshana Chakra for protection.", category: "హోమాలు", image: "https://picsum.photos/seed/puja-35/600/400", imageHint: "protection ritual" },

  // పూజలు (Pujalu)
  { id: 36, name: "విగ్నేశ్వర పూజ", description: "Puja to Lord Ganesha before starting any new venture.", category: "పూజలు", image: "https://picsum.photos/seed/puja-36/600/400", imageHint: 'lord ganesha' },
  { id: 37, name: "వరుణ పూజ", description: "Puja to the water god Varuna.", category: "పూజలు", image: "https://picsum.photos/seed/puja-37/600/400", imageHint: 'water god' },
  { id: 38, name: "పుణ్యాహవచనము", description: "Purification ceremony for a place or person.", category: "పూజలు", image: "https://picsum.photos/seed/puja-38/600/400", imageHint: 'purification ritual' },
  { id: 39, name: "వివాహము", description: "The sacred Hindu wedding ceremony.", category: "పూజలు", image: "https://picsum.photos/seed/puja-39/600/400", imageHint: 'indian wedding' },
  { id: 40, name: "గర్భాదానము", description: "Conception ceremony.", category: "పూజలు", image: "https://picsum.photos/seed/puja-40/600/400", imageHint: 'conception ritual' },
  { id: 41, name: "పుంసవనము", description: "A prenatal ceremony for a healthy child.", category: "పూజలు", image: "https://picsum.photos/seed/puja-41/600/400", imageHint: 'prenatal ceremony' },
  { id: 42, name: "సీమంతము", description: "A prenatal ceremony similar to a baby shower.", category: "పూజలు", image: "https://picsum.photos/seed/puja-42/600/400", imageHint: 'baby shower' },
  { id: 43, name: "జాతకర్మ", description: "A birth ceremony for a newborn.", category: "పూజలు", image: "https://picsum.photos/seed/puja-43/600/400", imageHint: 'birth ceremony' },
  { id: 44, name: "నామకరణము", description: "Sacred ceremony to name a newborn child.", category: "పూజలు", image: "https://picsum.photos/seed/puja-44/600/400", imageHint: "naming ceremony" },
  { id: 45, name: "అన్నప్రాసనము", description: "A child's first feeding ceremony.", category: "పూజలు", image: "https://picsum.photos/seed/puja-45/600/400", imageHint: "first food" },
  { id: 46, name: "చూడకర్మ", description: "First haircut ceremony for a child.", category: "పూజలు", image: "https://picsum.photos/seed/puja-46/600/400", imageHint: 'haircut ceremony' },
  { id: 47, name: "కర్ణ వేద", description: "Ear-piercing ceremony.", category: "పూజలు", image: "https://picsum.photos/seed/puja-47/600/400", imageHint: 'ear piercing' },
  { id: 48, name: "ఉపనయనము", description: "Sacred thread ceremony.", category: "పూజలు", image: "https://picsum.photos/seed/puja-48/600/400", imageHint: 'thread ceremony' },
  { id: 49, name: "వేదారంభము", description: "Beginning of Vedic studies.", category: "పూజలు", image: "https://picsum.photos/seed/puja-49/600/400", imageHint: 'vedic studies' },
  { id: 50, name: "సమా వర్తము", description: "Ceremony marking the end of formal Vedic education.", category: "పూజలు", image: "https://picsum.photos/seed/puja-50/600/400", imageHint: 'graduation ceremony' },
  { id: 51, name: "గృహప్రవేశము", description: "House warming ceremony to purify a new home.", category: "పూజలు", image: "https://picsum.photos/seed/puja-51/600/400", imageHint: 'house warming' },
  { id: 52, name: "వానప్రస్థము", description: "Ceremony for entering the retired stage of life.", category: "పూజలు", image: "https://picsum.photos/seed/puja-52/600/400", imageHint: 'retirement ritual' },
  { id: 53, name: "సన్యాసము", description: "Ceremony for entering the renounced stage of life.", category: "పూజలు", image: "https://picsum.photos/seed/puja-53/600/400", imageHint: 'renunciation' },
  { id: 54, name: "ప్రత్యేక పూజలు", description: "Special pujas performed during various festivals.", category: "పూజలు", image: "https://picsum.photos/seed/puja-54/600/400", imageHint: 'festival puja' },

  // కళ్యాణములు (Kalyanamulu)
  { id: 55, name: "శివపార్వతుల కళ్యాణం", description: "Celestial wedding of Lord Shiva and Goddess Parvati.", category: "కళ్యాణములు", image: "https://picsum.photos/seed/puja-55/600/400", imageHint: "divine wedding" },
  { id: 56, name: "శ్రీ రామ కళ్యాణము", description: "Celestial wedding of Lord Rama and Goddess Sita.", category: "కళ్యాణములు", image: "https://picsum.photos/seed/puja-56/600/400", imageHint: "rama sita" },
  { id: 57, name: "తులసీదాత్రీ కళ్యాణము", description: "Celestial wedding of Tulasi and Datri.", category: "కళ్యాణములు", image: "https://picsum.photos/seed/puja-57/600/400", imageHint: "tulasi wedding" },
  { id: 58, name: "గో వృషభ కళ్యాణము", description: "Wedding ceremony for cows and bulls.", category: "కళ్యాణములు", image: "https://picsum.photos/seed/puja-58/600/400", imageHint: "cow worship" },
  { id: 59, name: "శ్రీనివాస కళ్యాణం", description: "Celestial wedding of Lord Srinivasa and Goddess Padmavathi.", category: "కళ్యాణములు", image: "https://picsum.photos/seed/puja-59/600/400", imageHint: "lord venkateswara" },
  
  // దోష పరిహార పూజలు (Dosha Parihara Pujalu)
  { id: 60, name: "ఆదిత్యాది నవ గ్రహాల దోష పూజలు", description: "Pujas to pacify the nine planets and remove malefic effects.", category: "దోష పరిహార పూజలు", image: "https://picsum.photos/seed/puja-60/600/400", imageHint: "nine planets" },
  { id: 61, name: "సర్ప దోష పూజ", description: "Puja to remedy astrological flaws related to serpents.", category: "దోష పరిహార పూజలు", image: "https://picsum.photos/seed/puja-61/600/400", imageHint: "serpent worship" },
  { id: 62, name: "వివాహ దోష పూజ", description: "Puja to remove obstacles in marriage.", category: "దోష పరిహార పూజలు", image: "https://picsum.photos/seed/puja-62/600/400", imageHint: "marriage obstacle" },
  { id: 63, name: "సంతాన దోష పూజ", description: "Puja to overcome problems in conceiving a child.", category: "దోష పరిహార పూజలు", image: "https://picsum.photos/seed/puja-63/600/400", imageHint: "child blessing" },

  // దీక్ష పూజలు (Deeksha Pujalu)
  { id: 64, name: "అయ్యప్ప స్వామి దీక్షలు", description: "Penance and pujas for devotees of Ayyappa Deeksha.", category: "దీక్ష పూజలు", image: "https://picsum.photos/seed/puja-64/600/400", imageHint: "lord ayyappa" },
  { id: 65, name: "ఆంజనేయ దీక్షలు", description: "Deeksha dedicated to Lord Anjaneya.", category: "దీక్ష పూజలు", image: "https://picsum.photos/seed/puja-65/600/400", imageHint: "lord hanuman" },
  { id: 66, name: "భవాని దీక్షలు", description: "Deeksha dedicated to Goddess Bhavani.", category: "దీక్ష పూజలు", image: "https://picsum.photos/seed/puja-66/600/400", imageHint: "goddess bhavani" },
  { id: 67, name: "శివ దీక్షలు", description: "Deeksha dedicated to Lord Shiva.", category: "దీక్ష పూజలు", image: "https://picsum.photos/seed/puja-67/600/400", imageHint: "shiva deeksha" },
  { id: 68, name: "శ్రీనివాస దీక్షలు", description: "Deeksha dedicated to Lord Srinivasa.", category: "దీక్ష పూజలు", image: "https://picsum.photos/seed/puja-68/600/400", imageHint: "srinivasa deeksha" },
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
    pujas: [10, 14, 19, 61, 44, 45],
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
