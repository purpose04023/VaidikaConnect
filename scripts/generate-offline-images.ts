import fs from 'fs';
import path from 'path';
import { defaultPujas } from '../src/lib/data';

function cleanXmlText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateSvgContent(nameEn: string): string {
  const cleanedName = cleanXmlText(nameEn);
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4c0519" />
      <stop offset="50%" stop-color="#7c2d12" />
      <stop offset="100%" stop-color="#451a03" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="50%" stop-color="#ca8a04" />
      <stop offset="100%" stop-color="#eab308" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="15" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#bgGrad)" />

  <!-- Outer Traditional Border -->
  <rect x="25" y="25" width="750" height="550" fill="none" stroke="url(#goldGrad)" stroke-width="4" rx="8" />
  <!-- Inner Border -->
  <rect x="35" y="35" width="730" height="530" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" stroke-dasharray="10 6" rx="6" />

  <!-- Corner Motifs -->
  <path d="M25,50 Q50,50 50,25" fill="none" stroke="url(#goldGrad)" stroke-width="3" />
  <circle cx="50" cy="50" r="4" fill="url(#goldGrad)" />
  
  <path d="M775,50 Q750,50 750,25" fill="none" stroke="url(#goldGrad)" stroke-width="3" />
  <circle cx="750" cy="50" r="4" fill="url(#goldGrad)" />
  
  <path d="M25,550 Q50,550 50,575" fill="none" stroke="url(#goldGrad)" stroke-width="3" />
  <circle cx="50" cy="550" r="4" fill="url(#goldGrad)" />
  
  <path d="M775,550 Q750,550 750,575" fill="none" stroke="url(#goldGrad)" stroke-width="3" />
  <circle cx="750" cy="550" r="4" fill="url(#goldGrad)" />

  <!-- Central Aura Glow -->
  <circle cx="400" cy="300" r="180" fill="#f59e0b" opacity="0.1" filter="url(#glow)" />

  <!-- Sacred Diya (Oil Lamp) -->
  <g transform="translate(400, 390) scale(1.3)">
    <ellipse cx="0" cy="-55" rx="25" ry="35" fill="#f59e0b" opacity="0.3" filter="url(#glow)" />
    <path d="M0,-85 C15,-60 18,-45 0,-35 C-18,-45 -15,-60 0,-85 Z" fill="#ea580c" />
    <path d="M0,-75 C8,-55 10,-45 0,-38 C-10,-45 -8,-55 0,-75 Z" fill="#facc15" />
    <path d="M-45,-20 C-45,15 45,15 45,-20 C30,-15 15,-10 0,-10 C-15,-10 -30,-15 -45,-20 Z" fill="url(#goldGrad)" stroke="#854d0e" stroke-width="1" />
    <path d="M-45,-20 C-20,-10 20,-10 45,-20 C35,-25 20,-28 0,-28 C-20,-28 -35,-25 -45,-20 Z" fill="#a16207" opacity="0.8" />
    <ellipse cx="0" cy="-20" rx="38" ry="6" fill="#78350f" />
  </g>

  <!-- Typography -->
  <text x="400" y="210" text-anchor="middle" fill="url(#goldGrad)" font-family="Georgia, serif" font-size="32" font-weight="bold" letter-spacing="1">
    ${cleanedName}
  </text>
  
  <text x="400" y="260" text-anchor="middle" fill="#fef08a" font-family="'Courier New', monospace" font-size="14" font-weight="bold" letter-spacing="4" opacity="0.8">
    VAIDIKACONNECT SACRED PROGRAM
  </text>
</svg>`;
}

async function main() {
  const jsonPath = path.resolve(process.cwd(), 'src', 'lib', 'placeholder-images.json');
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ ERROR: Could not find placeholder-images.json at ${jsonPath}`);
    process.exit(1);
  }

  const poojasDir = path.resolve(process.cwd(), 'public', 'images', 'poojas');
  if (!fs.existsSync(poojasDir)) {
    fs.mkdirSync(poojasDir, { recursive: true });
    console.log(`Created directory: ${poojasDir}`);
  }

  console.log("🚀 Starting offline image generation for poojas...");

  const placeholderData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const items = placeholderData.placeholderImages;

  let successCount = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    // Only generate for poojas
    if (!item.id.startsWith('puja-')) {
      continue;
    }

    // Resolve name from defaultPujas
    const suffix = item.id.replace('puja-', '');
    const puja = defaultPujas.find(p => {
      const slug = p.name_en.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return slug === suffix || (suffix === 'satyanarayana' && p.name_en.includes('Satyanarayana'));
    });

    const nameEn = puja ? puja.name_en : item.description;

    console.log(`[${i + 1}/${items.length}] Generating SVG for: "${nameEn}"...`);

    const svgContent = generateSvgContent(nameEn);
    const filename = `${item.id}.svg`;
    const filepath = path.join(poojasDir, filename);

    fs.writeFileSync(filepath, svgContent, 'utf8');
    
    // Update entry details in JSON to use local SVG path
    item.imageUrl = `/images/poojas/${filename}`;
    item.imageHint = `Authentic SVG visual of ${nameEn}`;
    
    successCount++;
  }

  // Save the updated JSON file
  fs.writeFileSync(jsonPath, JSON.stringify(placeholderData, null, 2), 'utf8');

  console.log("\n==========================================");
  console.log(`🎉 Offline image generation completed!`);
  console.log(`- Successfully generated: ${successCount} SVGs`);
  console.log("==========================================\n");
}

main().catch(console.error);
