import { PlaceHolderImages } from './placeholder-images';

export interface Puja {
  id: number;
  name: string;
  description: string;
  image: string;
  imageHint: string;
  category: 'Vratas' | 'Nomulu' | 'Homas' | 'Poojas' | 'Yagas' | 'Shanthi Pujas' | 'Festivals' | 'Abhishekamulu' | 'Shraddhalu';
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
  { id: 1, name: "Satyanarayana Vratham", description: "A ritual to honor Lord Vishnu for prosperity and well-being.", category: "Vratas", image: PlaceHolderImages.find(p => p.id === 'puja-1')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-1')?.imageHint || '' },
  { id: 2, name: "Ganapathi Homam", description: "A fire ritual to remove obstacles and ensure success.", category: "Homas", image: PlaceHolderImages.find(p => p.id === 'puja-2')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-2')?.imageHint || '' },
  { id: 3, name: "Griha Pravesham", description: "House warming ceremony to purify the new home and bring positive energy.", category: "Poojas", image: PlaceHolderImages.find(p => p.id === 'puja-3')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-3')?.imageHint || '' },
  { id: 4, name: "Shraddha", description: "A ritual to pay homage to one's ancestors.", category: "Shraddhalu", image: PlaceHolderImages.find(p => p.id === 'puja-4')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-4')?.imageHint || '' },
  { id: 5, name: "Abhishekam", description: "Ritualistic bathing of a deity's idol.", category: "Abhishekamulu", image: PlaceHolderImages.find(p => p.id === 'puja-5')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-5')?.imageHint || '' },
  { id: 6, name: "Vivaham (Wedding)", description: "Vedic wedding ceremony uniting two souls.", category: "Poojas", image: PlaceHolderImages.find(p => p.id === 'puja-6')?.imageUrl || '', imageHint: PlaceHolderImages.find(p => p.id === 'puja-6')?.imageHint || '' },
  { id: 7, name: "Varalakshmi Vratam", description: "A vrata to appease the goddess Lakshmi for prosperity.", category: "Vratas", image: "https://picsum.photos/seed/puja-7/600/400", imageHint: "goddess lakshmi" },
  { id: 8, name: "Maha Mrityunjaya Homam", description: "A homa dedicated to Lord Shiva to overcome fear of death.", category: "Homas", image: "https://picsum.photos/seed/puja-8/600/400", imageHint: "shiva homam" },
  { id: 9, name: "Namakaranam", description: "A sacred ceremony to name a newborn child.", category: "Poojas", image: "https://picsum.photos/seed/puja-9/600/400", imageHint: "naming ceremony" },
  { id: 10, name: "Atlataddi Nomu", description: "A traditional nomu observed by women for a happy married life.", category: "Nomulu", image: "https://picsum.photos/seed/puja-10/600/400", imageHint: "telugu festival" },
  { id: 11, name: "Kedareshwara Vratam", description: "A vrata dedicated to Lord Shiva, performed for health and prosperity.", category: "Vratas", image: "https://picsum.photos/seed/puja-11/600/400", imageHint: "shiva vrata" },
  { id: 12, name: "Rudra Homam", description: "A powerful homa to appease Lord Rudra and remove negativities.", category: "Homas", image: "https://picsum.photos/seed/puja-12/600/400", imageHint: "vedic fire" },
  { id: 13, name: "Navagraha Shanthi", description: "A puja to pacify the nine planets and remove their malefic effects.", category: "Shanthi Pujas", image: "https://picsum.photos/seed/puja-13/600/400", imageHint: "nine planets" },
  { id: 14, name: "Sudarshana Yagam", description: "A yagna to remove evil forces and protect from harm.", category: "Yagas", image: "https://picsum.photos/seed/puja-14/600/400", imageHint: "yagna fire" },
  { id: 15, name: "Diwali Puja", description: "Special puja performed during the festival of lights.", category: "Festivals", image: "https://picsum.photos/seed/puja-15/600/400", imageHint: "diwali lights" },
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
    pujas: [1, 2, 3, 5, 6, 7, 11, 12, 13, 14],
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
    pujas: [1, 2, 4, 8, 13],
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
    pujas: [1, 2, 3, 5, 6, 9, 12, 14, 15],
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
    pujas: [2, 3, 5, 8, 13],
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
    pujas: [1, 5, 7, 10, 11, 15],
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
