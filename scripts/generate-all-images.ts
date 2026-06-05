import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { defaultPujas } from '../src/lib/data';

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
config({ path: envPath });

const hfApiKey = process.env.HF_API_KEY;
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;

async function generateImage(nameEn: string, description: string): Promise<string> {
  const promptText = `An authentic, high-quality, professional photograph of a Hindu sacred ritual: ${nameEn}. ${description || ""}. Featuring traditional elements like flowers, oil lamps (diyas), coconuts, mango leaves, and sacred vessels, beautifully arranged on a clean altar, with warm divine lighting and spiritual atmosphere. Detailed, respectful, saffron and gold tones, 4:3 aspect ratio.`;

  // 1. Try Hugging Face free API if configured
  if (hfApiKey) {
    const hfModels = [
      "black-forest-labs/FLUX.1-schnell",
      "stabilityai/stable-diffusion-xl-base-1.0",
      "CompVis/stable-diffusion-v1-4"
    ];
    
    let lastError = "";
    
    for (const hfModel of hfModels) {
      try {
        console.log(` -> Using Hugging Face model (${hfModel}) for "${nameEn}"...`);
        const hfUrl = `https://api-inference.huggingface.co/models/${hfModel}`;
        
        let retries = 3;
        let hfResponse: Response | null = null;
        
        while (retries > 0) {
          hfResponse = await fetch(hfUrl, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${hfApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: promptText }),
          });

          if (hfResponse.ok) {
            break;
          }

          const errorText = await hfResponse.text();
          
          if (hfResponse.status === 503 || errorText.includes("loading") || errorText.includes("estimated_time")) {
            let estimatedTime = 15;
            try {
              const parsed = JSON.parse(errorText);
              estimatedTime = Math.ceil(parsed.estimated_time || 15);
            } catch (e) {}
            
            console.log(`    Model is loading. Waiting ${estimatedTime} seconds before retrying (retries left: ${retries - 1})...`);
            await new Promise(resolve => setTimeout(resolve, estimatedTime * 1000));
            retries--;
            continue;
          }
          
          throw new Error(`HF Error status ${hfResponse.status}: ${errorText}`);
        }

        if (hfResponse && hfResponse.ok) {
          const arrayBuffer = await hfResponse.arrayBuffer();
          return Buffer.from(arrayBuffer).toString("base64");
        }
      } catch (hfErr) {
        console.warn(`    Model ${hfModel} failed:`, hfErr instanceof Error ? hfErr.message : String(hfErr));
        lastError = hfErr instanceof Error ? hfErr.message : String(hfErr);
      }
    }
    
    // If HF failed and Gemini key is missing, throw HF error
    if (!apiKey) {
      throw new Error(`Hugging Face generation failed: ${lastError}`);
    }
    console.log(" -> All Hugging Face models failed. Attempting Gemini fallback...");
  }

  // 2. Fall back to Gemini Imagen 4
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      instances: [
        {
          prompt: promptText,
        }
      ],
      parameters: {
        sampleCount: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '4:3',
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let msg = errorText;
    try {
      const parsed = JSON.parse(errorText);
      if (parsed.error && parsed.error.message) {
        msg = parsed.error.message;
        if (msg.includes("only available on paid plans") || msg.includes("upgrade your account")) {
          msg = "AI Image Generation requires a Google AI Studio account with billing enabled. Please upgrade your plan at https://aistudio.google.com/ or use a free Hugging Face API key (HF_API_KEY).";
        }
      }
    } catch {}
    throw new Error(`Gemini API returned status ${response.status}: ${msg}`);
  }

  const data = (await response.json()) as any;
  if (!data.predictions || data.predictions.length === 0) {
    throw new Error("No images returned by Gemini Imagen API.");
  }

  return data.predictions[0].bytesBase64Encoded; // base64 bytes
}

async function main() {
  if (!hfApiKey && !apiKey) {
    console.error("❌ ERROR: Neither HF_API_KEY nor GEMINI_API_KEY is defined in your environment or .env.local file.");
    console.error("Please add 'HF_API_KEY=your_hugging_face_token' to .env.local and run the script again.");
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
