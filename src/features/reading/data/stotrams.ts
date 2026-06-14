export interface Deity {
  id: string;
  name: string;      // Telugu Name
  nameEn: string;    // English Name
  gender: 'male' | 'female';
  imageHint: string;
  imageUrl?: string;
  ashtotharamUrl: string;
  sahasranamamUrl: string;
  readingSlug: string; // Slug for the Stotramanjari deep link
}

export const stotramsData: Deity[] = [
  // --- MALE DEITIES ---
  {
    id: 'ganesha',
    name: 'వినాయకుడు',
    nameEn: 'Ganesha',
    gender: 'male',
    imageHint: 'A premium, divine, and elegant digital painting of Lord Ganesha, warm glowing colors, gold accents, high resolution',
    imageUrl: '/images/deities/ganesha.png',
    ashtotharamUrl: 'https://vignanam.org/telugu/sri-ganesha-ashtottara-shatanama-valih.html',
    sahasranamamUrl: 'https://vignanam.org/telugu/ganesha-sahasranama-stotram.html',
    readingSlug: 'ganesha-ashtottara-sata-namavali'
  },
  {
    id: 'shiva',
    name: 'శివుడు',
    nameEn: 'Shiva',
    gender: 'male',
    imageHint: 'A premium, majestic digital painting of Lord Shiva in meditation, cosmic background, crescent moon, glowing aura',
    imageUrl: '/images/deities/shiva.png',
    ashtotharamUrl: 'https://vignanam.org/telugu/siva-ashtottara-shatanama-valih.html',
    sahasranamamUrl: 'https://vignanam.org/telugu/siva-sahasranama-stotram.html',
    readingSlug: 'shiva-ashtottara-sata-namavali'
  },
  {
    id: 'vishnu',
    name: 'విష్ణువు',
    nameEn: 'Vishnu',
    gender: 'male',
    imageHint: 'A premium, divine painting of Lord Vishnu, blue skin, yellow garments, holding chakra and conch, divine golden glow',
    imageUrl: '/images/deities/vishnu.png',
    ashtotharamUrl: 'https://vignanam.org/telugu/sri-vishnu-ashtottara-shatanama-stotram.html',
    sahasranamamUrl: 'https://vignanam.org/telugu/sri-vishnu-sahasranama-stotram.html',
    readingSlug: 'vishnu-sahasra-nama-stotram'
  },
  {
    id: 'rama',
    name: 'శ్రీరాముడు',
    nameEn: 'Rama',
    gender: 'male',
    imageHint: 'A premium, divine, and noble digital painting of Lord Sri Rama with his bow, glowing light, gold accents',
    imageUrl: '/images/deities/rama.png',
    ashtotharamUrl: 'https://vignanam.org/telugu/sri-rama-ashtottara-shatanama-valih.html',
    sahasranamamUrl: 'https://vignanam.org/telugu/sri-rama-sahasranama-stotram.html',
    readingSlug: 'rama-ashtottara-sata-namavali'
  },
  {
    id: 'hanuman',
    name: 'హనుమంతుడు',
    nameEn: 'Hanuman',
    gender: 'male',
    imageHint: 'A premium, powerful digital painting of Lord Hanuman in a devotional pose, glowing aura, golden sunset background',
    imageUrl: '/images/deities/hanuman.png',
    ashtotharamUrl: 'https://vignanam.org/telugu/sri-hanuma-ashtottara-shatanama-valih.html',
    sahasranamamUrl: 'https://vignanam.org/telugu/sri-hanumath-sahasranama-stotram.html',
    readingSlug: 'hanuman-ashtottara-sata-namavali'
  },
  // --- FEMALE DEITIES ---
  {
    id: 'lalitha',
    name: 'లలితా దేవి',
    nameEn: 'Lalitha',
    gender: 'female',
    imageHint: 'A premium, luxurious digital painting of Goddess Lalitha Tripurasundari on her throne, glowing golden aura, red saree, divine beauty',
    imageUrl: '/images/deities/lalitha.png',
    ashtotharamUrl: 'https://vignanam.org/telugu/sri-lalitha-ashtottara-shatanama-valih.html',
    sahasranamamUrl: 'https://vignanam.org/telugu/sri-lalitha-sahasranama-stotram.html',
    readingSlug: 'lalitha-sahasra-nama-stotram'
  },
  {
    id: 'lakshmi',
    name: 'లక్ష్మీ దేవి',
    nameEn: 'Lakshmi',
    gender: 'female',
    imageHint: 'A premium, elegant painting of Goddess Lakshmi seated on a pink lotus, showering gold coins, glowing lights, rich colors',
    imageUrl: '/images/deities/lakshmi.png',
    ashtotharamUrl: 'https://vignanam.org/telugu/sri-lakshmi-ashtottara-shatanama-valih.html',
    sahasranamamUrl: 'https://vignanam.org/telugu/sri-lakshmi-sahasranama-stotram.html',
    readingSlug: 'lakshmi-ashtottara-sata-namavali'
  },
  {
    id: 'saraswati',
    name: 'సరస్వతీ దేవి',
    nameEn: 'Saraswati',
    gender: 'female',
    imageHint: 'A premium, beautiful painting of Goddess Saraswati playing the Veena, white swan, white saree, calm glowing background',
    imageUrl: '/images/deities/saraswati.png',
    ashtotharamUrl: 'https://vignanam.org/telugu/sri-saraswathi-ashtottara-shatanama-valih.html',
    sahasranamamUrl: 'https://vignanam.org/telugu/sri-saraswathi-sahasranama-stotram.html',
    readingSlug: 'saraswati-ashtottara-sata-namavali'
  },
  {
    id: 'durga',
    name: 'దుర్గా దేవి',
    nameEn: 'Durga',
    gender: 'female',
    imageHint: 'A premium, energetic digital painting of Goddess Durga riding a lion, carrying celestial weapons, divine light, powerful colors',
    imageUrl: '/images/deities/durga.png',
    ashtotharamUrl: 'https://vignanam.org/telugu/sri-durga-ashtottara-shatanama-valih.html',
    sahasranamamUrl: 'https://vignanam.org/telugu/sri-durga-sahasranama-stotram.html',
    readingSlug: 'durga-ashtottara-sata-namavali'
  }
];
