/**
 * sync-stotramanjari.ts
 *
 * Reads data from the StotraManjari project and regenerates
 * src/lib/data/stotramanjari_data.ts in VaidhikaConnect.
 *
 * Run with: npx ts-node -e "require('./scripts/sync-stotramanjari.ts')"
 * Or: npx tsx scripts/sync-stotramanjari.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// ── Paths ──────────────────────────────────────────────────────────────────
const STOTRA_MANJARI_DIR = 'c:\\StotraManjari\\src\\data';
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'features', 'reading', 'data', 'stotramanjari_data.ts');

const VIGNANAM_DATA_PATH = path.join(STOTRA_MANJARI_DIR, 'vignanam-data.json');
const CATEGORY_MAPPINGS_PATH = path.join(STOTRA_MANJARI_DIR, 'category-mappings.json');
const STOTRAMS_JSON_PATH = path.join(STOTRA_MANJARI_DIR, 'stotrams.json');
const STOTRAMS_SCRAPED_PATH = path.join(STOTRA_MANJARI_DIR, 'stotrams-scraped.json');

// ── Category display names & icons ────────────────────────────────────────
// Maps category key → [English name, Telugu name, iconUrl]
const CATEGORY_META: Record<string, [string, string, string]> = {
  'nitya-parayana': ['Nitya Parayana', 'నిత్య పారాయణ', 'https://api.iconify.design/fluent-emoji-flat:om.svg'],
  'vedic-chants': ['Vedic Chants', 'వేద మంత్రాః', 'https://api.iconify.design/noto:person-in-lotus-position.svg'],
  'upanishads': ['Upanishads', 'ఉపనిషదః', 'https://api.iconify.design/noto:books.svg'],
  'shiva': ['Shiva', 'శివ స్తోత్రాణి', 'https://api.iconify.design/fluent-emoji-flat:trident-emblem.svg'],
  'vishnu': ['Vishnu', 'విష్ణు స్తోత్రాణి', 'https://api.iconify.design/noto:lotus.svg'],
  'rama': ['Rama', 'రామ స్తోత్రాణి', 'https://api.iconify.design/noto:bow-and-arrow.svg'],
  'krishna': ['Krishna', 'కృష్ణ స్తోత్రాణి', 'https://api.iconify.design/noto:flute.svg'],
  'venkateshwara': ['Venkateshwara', 'వేంకటేశ్వర స్తోత్రాణి', 'https://api.iconify.design/noto:temple.svg'],
  'devi': ['Devi', 'దేవీ స్తోత్రాణి', 'https://api.iconify.design/noto:blossom.svg'],
  'ganesha': ['Ganesha', 'గణేశ స్తోత్రాణి', 'https://api.iconify.design/noto:elephant.svg'],
  'hanuman': ['Hanuman', 'హనుమాన్ స్తోత్రాణి', 'https://api.iconify.design/noto:monkey-face.svg'],
  'subrahmanya': ['Subrahmanya', 'సుబ్రహ్మణ్య స్తోత్రాణి', 'https://api.iconify.design/noto:peacock.svg'],
  'surya': ['Surya', 'సూర్య స్తోత్రాణి', 'https://api.iconify.design/noto:sun.svg'],
  'navagraha': ['Navagraha', 'నవగ్రహ స్తోత్రాణి', 'https://api.iconify.design/noto:star.svg'],
  'lakshmi': ['Lakshmi', 'లక్ష్మీ స్తోత్రాణి', 'https://api.iconify.design/noto:money-bag.svg'],
  'saraswati': ['Saraswati', 'సరస్వతీ స్తోత్రాణి', 'https://api.iconify.design/noto:musical-notes.svg'],
  'durga': ['Durga', 'దుర్గా స్తోత్రాణి', 'https://api.iconify.design/noto:lion.svg'],
  'dattatreya': ['Dattatreya', 'దత్తాత్రేయ స్తోత్రాణి', 'https://api.iconify.design/noto:cow.svg'],
  'guru': ['Guru', 'గురు స్తోత్రాణి', 'https://api.iconify.design/noto:teacher.svg'],
  'bhagavad-gita': ['Bhagavad Gita', 'భగవద్గీత', 'https://api.iconify.design/noto:books.svg'],
  'gita-govindam': ['Gita Govindam', 'గీత గోవిందం', 'https://api.iconify.design/noto:flute.svg'],
  'uddhava-gita': ['Uddhava Gita', 'ఉద్ధవ గీత', 'https://api.iconify.design/noto:person-in-lotus-position.svg'],
  'ramacharitamanas': ['Ramacharitamanas', 'రామచరిత మానస', 'https://api.iconify.design/noto:books.svg'],
  'devi-mahatmyam': ['Devi Mahatmyam', 'దేవీ మహాత్మ్యం', 'https://api.iconify.design/noto:blossom.svg'],
  'devi-bhagavata-purana': ['Devi Bhagavata Purana', 'దేవీ భాగవత పురాణం', 'https://api.iconify.design/noto:blossom.svg'],
  'manidweepa-varnanam': ['Manidweepa Varnanam', 'మణిద్వీప వర్ణనం', 'https://api.iconify.design/noto:island.svg'],
  'ashtottara-namavali': ['Ashtottara Namavali', 'అష్టోత్తర నామావళి', 'https://api.iconify.design/noto:prayer-beads.svg'],
  'ashtottara-stotram': ['Ashtottara Stotram', 'అష్టోత్తర స్తోత్రం', 'https://api.iconify.design/noto:prayer-beads.svg'],
  'sahasra-nama': ['Sahasra Nama', 'సహస్ర నామ', 'https://api.iconify.design/noto:prayer-beads.svg'],
  'pancha-ratna': ['Pancha Ratna', 'పంచ రత్న', 'https://api.iconify.design/noto:gem-stone.svg'],
  'kavacha-stotrams': ['Kavacha Stotrams', 'కవచ స్తోత్రాలు', 'https://api.iconify.design/noto:shield.svg'],
  'ashtakas': ['Ashtakas', 'అష్టకాలు', 'https://api.iconify.design/noto:eight-spoked-asterisk.svg'],
  'adi-shankaracharya': ['Adi Shankaracharya', 'ఆది శంకరాచార్య', 'https://api.iconify.design/noto:person-in-lotus-position.svg'],
  'raghavendra-swami': ['Raghavendra Swami', 'రాఘవేంద్ర స్వామి', 'https://api.iconify.design/noto:person-in-lotus-position.svg'],
  'annamayya-keerthanas': ['Annamayya Keerthanas', 'అన్నమయ్య కీర్తనలు', 'https://api.iconify.design/noto:musical-notes.svg'],
  'thyagaraja-keerthanas': ['Thyagaraja Keerthanas', 'త్యాగరాజ కీర్తనలు', 'https://api.iconify.design/noto:musical-notes.svg'],
  'ramadasu-keerthanas': ['Ramadasu Keerthanas', 'రామదాసు కీర్తనలు', 'https://api.iconify.design/noto:musical-notes.svg'],
  'venkateshwara-keerthanas': ['Venkateshwara Keerthanas', 'వేంకటేశ్వర కీర్తనలు', 'https://api.iconify.design/noto:musical-notes.svg'],
  'rama-keerthanas': ['Rama Keerthanas', 'రామ కీర్తనలు', 'https://api.iconify.design/noto:musical-notes.svg'],
  'carnatic-geetham': ['Carnatic Geetham', 'కర్నాటక గీతం', 'https://api.iconify.design/noto:musical-notes.svg'],
  'carnatic-swarabhyasam': ['Carnatic Swarabhyasam', 'స్వరాభ్యాసం', 'https://api.iconify.design/noto:musical-notes.svg'],
  'carnatic-swarajathi': ['Carnatic Swarajathi', 'స్వరజతి', 'https://api.iconify.design/noto:musical-notes.svg'],
  'sanskrit-geethalu': ['Sanskrit Geethalu', 'సంస్కృత గీతాలు', 'https://api.iconify.design/noto:musical-notes.svg'],
  'telugu-geethalu': ['Telugu Geethalu', 'తెలుగు గీతాలు', 'https://api.iconify.design/noto:musical-notes.svg'],
  'shatakas': ['Shatakas', 'శతకాలు', 'https://api.iconify.design/noto:scroll.svg'],
  'bhartruhari-shataka-trishati': ['Bhartruhari Shataka', 'భర్తృహరి శతక', 'https://api.iconify.design/noto:scroll.svg'],
  'ganga': ['Ganga', 'గంగా స్తోత్రాలు', 'https://api.iconify.design/noto:water-wave.svg'],
  'karma-siddhanta': ['Karma Siddhanta', 'కర్మ సిద్ధాంత', 'https://api.iconify.design/noto:scales.svg'],
  'chanakya-neeti': ['Chanakya Neeti', 'చాణక్య నీతి', 'https://api.iconify.design/noto:scroll.svg'],
  'vidura-neeti': ['Vidura Neeti', 'విదుర నీతి', 'https://api.iconify.design/noto:scroll.svg'],
  'patanjali-yoga-sutras': ['Patanjali Yoga Sutras', 'పతంజలి యోగ సూత్రాలు', 'https://api.iconify.design/noto:person-in-lotus-position.svg'],
  'tattva-shastra': ['Tattva Shastra', 'తత్త్వ శాస్త్రం', 'https://api.iconify.design/noto:yin-yang.svg'],
  'mooka-pancha-shati': ['Mooka Pancha Shati', 'మూక పంచశతి', 'https://api.iconify.design/noto:blossom.svg'],
  'pandava-gita': ['Pandava Gita', 'పాండవ గీత', 'https://api.iconify.design/noto:books.svg'],
  'bhakata-gita': ['Bhakata Gita', 'భక్త గీత', 'https://api.iconify.design/noto:books.svg'],
  'daily-prayers': ['Daily Prayers', 'నిత్య ప్రార్థనలు', 'https://api.iconify.design/fluent-emoji-flat:om.svg'],
  'bharata-mata': ['Bharata Mata', 'భారత మాత', 'https://api.iconify.design/noto:flag-india.svg'],
  'kena-upanishad': ['Kena Upanishad', 'కేన ఉపనిషద్', 'https://api.iconify.design/noto:books.svg'],
  'mundaka-upanishad': ['Mundaka Upanishad', 'ముండక ఉపనిషద్', 'https://api.iconify.design/noto:books.svg'],
  'taittiriya-upanishad': ['Taittiriya Upanishad', 'తైత్తిరీయ ఉపనిషద్', 'https://api.iconify.design/noto:books.svg'],
  'yajurveda-samhita-1': ['Yajurveda Samhita 1', 'యజుర్వేద సంహిత 1', 'https://api.iconify.design/noto:books.svg'],
  'yajurveda-samhita-2': ['Yajurveda Samhita 2', 'యజుర్వేద సంహిత 2', 'https://api.iconify.design/noto:books.svg'],
  'yajurveda-samhita-3': ['Yajurveda Samhita 3', 'యజుర్వేద సంహిత 3', 'https://api.iconify.design/noto:books.svg'],
  'yajurveda-samhita-4': ['Yajurveda Samhita 4', 'యజుర్వేద సంహిత 4', 'https://api.iconify.design/noto:books.svg'],
  'yajurveda-samhita-5': ['Yajurveda Samhita 5', 'యజుర్వేద సంహిత 5', 'https://api.iconify.design/noto:books.svg'],
  'yajurveda-samhita-6': ['Yajurveda Samhita 6', 'యజుర్వేద సంహిత 6', 'https://api.iconify.design/noto:books.svg'],
  'yajurveda-samhita-7': ['Yajurveda Samhita 7', 'యజుర్వేద సంహిత 7', 'https://api.iconify.design/noto:books.svg'],
};

// ── Load data ──────────────────────────────────────────────────────────────
console.log('Loading data from StotraManjari...');

// Build stotrams map: slug → { title_english, title_telugu }
const vignanamData: Array<{ id: string; slug?: string; title?: string; title_telugu?: string }> =
  JSON.parse(fs.readFileSync(VIGNANAM_DATA_PATH, 'utf-8'));

const defaultStotrams: Array<{ id?: string; title_english?: string; title_telugu?: string }> =
  JSON.parse(fs.readFileSync(STOTRAMS_JSON_PATH, 'utf-8'));

const scrapedStotrams: Array<{ id?: string; title_english?: string; title_telugu?: string }> =
  JSON.parse(fs.readFileSync(STOTRAMS_SCRAPED_PATH, 'utf-8'));

// Build comprehensive slug→titles map (priority: vignanam > default > scraped)
const slugToTitles: Record<string, { titleEng: string; titleTel: string }> = {};

// 1. Start with scraped stotrams
for (const item of scrapedStotrams) {
  const slug = item.id;
  if (slug) {
    slugToTitles[slug] = {
      titleEng: item.title_english || slug,
      titleTel: item.title_telugu || '',
    };
  }
}

// 2. Override with defaults
for (const item of defaultStotrams) {
  const slug = item.id;
  if (slug) {
    slugToTitles[slug] = {
      titleEng: item.title_english || slugToTitles[slug]?.titleEng || slug,
      titleTel: item.title_telugu || slugToTitles[slug]?.titleTel || '',
    };
  }
}

// 3. Override with vignanam (most authoritative)
for (const item of vignanamData) {
  const slug = item.slug || item.id;
  if (slug) {
    slugToTitles[slug] = {
      titleEng: item.title || slugToTitles[slug]?.titleEng || slug,
      titleTel: item.title_telugu || slugToTitles[slug]?.titleTel || '',
    };
  }
}

console.log(`Loaded titles for ${Object.keys(slugToTitles).length} stotrams.`);

// Load category mappings
const categoryMappings: Record<string, string[]> =
  JSON.parse(fs.readFileSync(CATEGORY_MAPPINGS_PATH, 'utf-8'));

const categoryKeys = Object.keys(categoryMappings);
console.log(`Found ${categoryKeys.length} categories.`);

// ── Collect all slugs that appear in any category ─────────────────────────
const allSlugsInCategories = new Set<string>();
for (const slugs of Object.values(categoryMappings)) {
  for (const slug of slugs) {
    allSlugsInCategories.add(slug);
  }
}

// ── Build stotramsMap entries ──────────────────────────────────────────────
// Only include stotrams that appear in at least one category
const stotramsMapEntries: string[] = [];

for (const slug of Array.from(allSlugsInCategories).sort()) {
  const titles = slugToTitles[slug];
  if (titles) {
    const titleEng = titles.titleEng.replace(/"/g, '\\"');
    const titleTel = titles.titleTel.replace(/"/g, '\\"');
    stotramsMapEntries.push(
      `  "${slug}": {\n    "titleEng": "${titleEng}",\n    "titleTel": "${titleTel}",\n    "href": "/stotramanjari/readings/${slug}"\n  }`
    );
  } else {
    // Generate a title from slug if not found
    const generated = slug
      .split('-')
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    stotramsMapEntries.push(
      `  "${slug}": {\n    "titleEng": "${generated}",\n    "titleTel": "",\n    "href": "/stotramanjari/readings/${slug}"\n  }`
    );
  }
}

// ── Build categoriesArray entries ─────────────────────────────────────────
const categoriesArrayEntries: string[] = [];

for (const key of categoryKeys) {
  const meta = CATEGORY_META[key];
  const nameEn = meta ? meta[0] : key.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const nameTe = meta ? meta[1] : '';
  const iconUrl = meta ? meta[2] : 'https://api.iconify.design/noto:books.svg';
  const slugs = categoryMappings[key];

  const slugsJson = slugs.map((s: string) => `      "${s}"`).join(',\n');

  categoriesArrayEntries.push(
    `  {\n    "id": "${key}",\n    "nameEn": "${nameEn}",\n    "nameTe": "${nameTe}",\n    "iconUrl": "${iconUrl}",\n    "slugs": [\n${slugsJson}\n    ]\n  }`
  );
}

// ── Generate TypeScript file ───────────────────────────────────────────────
const tsContent = `// This file is auto-generated. Do not edit manually.
// Generated from: c:\\\\StotraManjari\\\\src\\\\data\\\\
// Run: npx tsx scripts/sync-stotramanjari.ts

export interface Stotram {
  titleEng: string;
  titleTel: string;
  href: string;
}

export interface Category {
  id: string;
  nameEn: string;
  nameTe: string;
  iconUrl: string;
  slugs: string[];
}

export const stotramsMap: Record<string, Stotram> = {
${stotramsMapEntries.join(',\n')}
};

export const categoriesList: Category[] = [
${categoriesArrayEntries.join(',\n')}
];
`;

// ── Write output ───────────────────────────────────────────────────────────
fs.writeFileSync(OUTPUT_FILE, tsContent, 'utf-8');

console.log(`\n✅ Generated ${OUTPUT_FILE}`);
console.log(`   - ${stotramsMapEntries.length} stotrams in stotramsMap`);
console.log(`   - ${categoriesArrayEntries.length} categories in categoriesArray`);
