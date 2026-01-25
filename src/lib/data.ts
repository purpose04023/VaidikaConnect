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
  // వ్రతాలు
  { id: 1, name: "సత్యనారాయణ వ్రతము", description: "A ritual to honor Lord Vishnu for prosperity and well-being.", category: "వ్రతాలు", image: "https://picsum.photos/seed/puja-satyanarayana/600/400", imageHint: 'hindu ritual' },
  { id: 2, name: "వరలక్ష్మీ వ్రతము", description: "A vrata to appease the goddess Lakshmi for prosperity.", category: "వ్రతాలు", image: "https://picsum.photos/seed/puja-varalakshmi/600/400", imageHint: "goddess lakshmi" },
  { id: 3, name: "కేదారేశ్వర వ్రతము", description: "A vrata dedicated to Lord Shiva, performed for health and prosperity.", category: "వ్రతాలు", image: "https://picsum.photos/seed/puja-kedareswara/600/400", imageHint: "shiva vrata" },

  // నోములు
  { id: 4, name: "అట్లతద్ది నోము", description: "A traditional nomu observed by women for a happy married life.", category: "నోములు", image: "https://picsum.photos/seed/puja-atlataddi/600/400", imageHint: "telugu festival" },
  { id: 5, name: "నాగుల చవితి నోము", description: "A nomu to worship serpent gods.", category: "నోములు", image: "https://picsum.photos/seed/puja-nagula/600/400", imageHint: "serpent god" },

  // హోమాలు
  { id: 6, name: "మహాగణపతి హోమం", description: "A fire ritual to remove obstacles and ensure success.", category: "హోమాలు", image: "https://picsum.photos/seed/puja-ganapatihomam/600/400", imageHint: 'fire ceremony' },
  { id: 7, name: "మహా మృత్యుంజయ హోమము", description: "A homa dedicated to Lord Shiva to overcome fear of death.", category: "హోమాలు", image: "https://picsum.photos/seed/puja-mrityunjaya/600/400", imageHint: "shiva homam" },
  { id: 8, name: "సుదర్శన హోమము", description: "Homa to invoke the energy of Sudarshana Chakra for protection.", category: "హోమాలు", image: "https://picsum.photos/seed/puja-sudarshana/600/400", imageHint: "protection ritual" },

  // పూజలు
  { id: 9, name: "గృహప్రవేశము", description: "House warming ceremony to purify the new home.", category: "పూజలు", image: "https://picsum.photos/seed/puja-grihapravesham/600/400", imageHint: 'hindu ceremony' },
  { id: 10, name: "నామకరణము", description: "A sacred ceremony to name a newborn child.", category: "పూజలు", image: "https://picsum.photos/seed/puja-namakaranam/600/400", imageHint: "naming ceremony" },
  { id: 11, name: "అన్నప్రాసనము", description: "A child's first feeding ceremony.", category: "పూజలు", image: "https://picsum.photos/seed/puja-annaprasana/600/400", imageHint: "first food" },

  // కళ్యాణములు
  { id: 12, name: "శ్రీనివాస కళ్యాణం", description: "Celestial wedding of Lord Srinivasa and Goddess Padmavathi.", category: "కళ్యాణములు", image: "https://picsum.photos/seed/puja-srinivasakalyanam/600/400", imageHint: "lord venkateswara" },
  { id: 13, name: "శివపార్వతుల కళ్యాణం", description: "Celestial wedding of Lord Shiva and Goddess Parvati.", category: "కళ్యాణములు", image: "https://picsum.photos/seed/puja-sivakalyanam/600/400", imageHint: "divine wedding" },

  // దోష పరిహార పూజలు
  { id: 14, name: "నవ గ్రహాల దోష పూజలు", description: "Pujas to pacify the nine planets and remove their malefic effects.", category: "దోష పరిహార పూజలు", image: "https://picsum.photos/seed/puja-navagraha/600/400", imageHint: "nine planets" },
  { id: 15, name: "సర్ప దోష పూజ", description: "Puja to remedy astrological flaws related to serpents.", category: "దోష పరిహార పూజలు", image: "https://picsum.photos/seed/puja-sarpadosha/600/400", imageHint: "serpent worship" },

  // దీక్ష పూజలు
  { id: 16, name: "అయ్యప్ప స్వామి దీక్షలు", description: "Penance and pujas for devotees undertaking the Ayyappa Deeksha.", category: "దీక్ష పూజలు", image: "https://picsum.photos/seed/puja-ayyappa/600/400", imageHint: "lord ayyappa" },
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
    pujas: [1, 2, 6, 9, 12, 14],
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
    pujas: [4, 5, 7, 15],
    maxParticipants: 20,
    location: { lat: 40.81, lng: -73.96 }, // Upper Manhattan
    description: "Veda Prakash ji is an expert in Ganapathi Homam and Shraddha ceremonies. His calm demeanor and command over mantras create a divine atmosphere.",
    phone: "234-567-8901",
    gallery: [
      { url: PlaceHolderImages.find(p => p.id === 'pujari-gallery-2')?.imageUrl || '', hint: 'priest reading' },
      { url: PlaceHolderImages.find(p => p.id === 'pujari-gallery-3')?.imageUrl || '', hint: 'ceremony items' },
      { url: PlaceHolderImages.find(p => p.id === 'pujari-gallery-1')?.imageUrl || '', hint: 'hindu ritual' },
    ],
    reviews: [
      { name: "Anand M.", rating: 5, comment: "Very satisfied with the Ganapathi Homam. Pujari ji was very patient." },
      { name: "Priya S.", rating: 4, comment: "Good experience for the Shraddha ceremony." },
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
    pujas: [1, 3, 6, 9, 10, 11, 12, 13],
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
    pujas: [6, 7, 8, 9, 14, 15],
    maxParticipants: 30,
    location: { lat: 40.75, lng: -74.1 }, // New Jersey
    description: "Specializing in Abhishekam and Homams, Ganapathi Avadhani is known for his powerful chanting and adherence to traditional practices.",
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
    pujas: [1, 2, 3, 4, 5, 16],
    maxParticipants: 15,
    location: { lat: 40.7484, lng: -73.9857 }, // Midtown
    description: "A young and energetic pujari, Surya Narayana is praised for his dedication and ability to connect with all generations. Perfect for family pujas.",
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
