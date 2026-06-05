import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { defaultPujas } from '../src/lib/data';

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
config({ path: envPath });

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;

async function generateImage(nameEn: string, description: string): Promise<string> {
  const promptText = `An authentic, high-quality, professional photograph of a Hindu sacred ritual: ${nameEn}. ${description || ""}. Featuring traditional elements like flowers, oil lamps (diyas), coconuts, mango leaves, and sacred vessels, beautifully arranged on a clean altar, with warm divine lighting and spiritual atmosphere. Detailed, respectful, saffron and gold tones, 4:3 aspect ratio.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:generateImages?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: promptText,
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: '4:3',
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API returned status ${response.status}: ${await response.text()}`);
  }

  const data = (await response.json()) as any;
  if (!data.generatedImages || data.generatedImages.length === 0) {
    throw new Error("No images returned by Gemini Imagen API.");
  }

  return data.generatedImages[0].image.imageBytes; // base64 bytes
}

async function main() {
  if (!apiKey) {
    console.error("❌ ERROR: GEMINI_API_KEY is not defined in your environment or .env.local file.");
    console.error("Please add 'GEMINI_API_KEY=your_key' to .env.local and run the script again.");
    process.exit(1);
  }

  const jsonPath = path.resolve(process.cwd(), 'src', 'lib', 'placeholder-images.json');
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ ERROR: Could not find placeholder-images.json at ${jsonPath}`);
    process.exit(1);
  }

  console.log("🚀 Starting batch image generation for poojas...");

  const poojasDir = path.resolve(process.cwd(), 'public', 'images', 'poojas');
  if (!fs.existsSync(poojasDir)) {
    fs.mkdirSync(poojasDir, { recursive: true });
    console.log(`Created directory: ${poojasDir}`);
  }

  const placeholderData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const items = placeholderData.placeholderImages;

  let successCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    // Only generate for poojas
    if (!item.id.startsWith('puja-')) {
      continue;
    }

    // Skip if it's already generated (points to local path)
    if (item.imageUrl.startsWith('/images/poojas/')) {
      skippedCount++;
      continue;
    }

    // Resolve name and description from defaultPujas
    const suffix = item.id.replace('puja-', '');
    const puja = defaultPujas.find(p => {
      const slug = p.name_en.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return slug === suffix || (suffix === 'satyanarayana' && p.name_en.includes('Satyanarayana'));
    });

    const nameEn = puja ? puja.name_en : item.description;
    const desc = puja ? puja.description : item.description;

    console.log(`[${i + 1}/${items.length}] Generating image for: "${nameEn}"...`);

    try {
      // Rate limiting: sleep 1.5s between calls
      await new Promise(resolve => setTimeout(resolve, 1500));

      const base64Bytes = await generateImage(nameEn, desc);
      const buffer = Buffer.from(base64Bytes, 'base64');
      const filename = `${item.id}.jpg`;
      const filepath = path.join(poojasDir, filename);

      fs.writeFileSync(filepath, buffer);
      
      // Update entry details
      item.imageUrl = `/images/poojas/${filename}`;
      item.imageHint = `AI generated ritual image of ${nameEn}`;
      
      console.log(`✅ Saved image to public/images/poojas/${filename}`);
      successCount++;

      // Progressive save so progress isn't lost if the script is interrupted
      fs.writeFileSync(jsonPath, JSON.stringify(placeholderData, null, 2), 'utf8');
    } catch (error) {
      console.error(`❌ Failed to generate image for ${item.id}:`, error);
    }
  }

  console.log("\n==========================================");
  console.log(`🎉 Batch image generation completed!`);
  console.log(`- Successfully generated: ${successCount}`);
  console.log(`- Already generated/skipped: ${skippedCount}`);
  console.log("==========================================\n");
}

main().catch(console.error);
