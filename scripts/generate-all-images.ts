import fs from 'fs';
import path from 'path';
import http from 'http';
import { config } from 'dotenv';
import { defaultPujas } from '../src/lib/data';

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
config({ path: envPath });

const hfApiKey = process.env.HF_API_KEY;
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;

interface GenResult {
  bytesBase64: string;
  isSvg: boolean;
}

function checkOllama(): Promise<boolean> {
  return new Promise((resolve) => {
    const options = {
      hostname: '127.0.0.1',
      port: 11434,
      path: '/api/tags',
      method: 'GET',
      timeout: 10000 // 10 seconds check
    };

    const req = http.request(options, (res) => {
      resolve(res.statusCode === 200);
    });

    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

function callOllamaGenerate(prompt: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: "qwen2.5:1.5b",
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.2
      }
    });

    const options = {
      hostname: '127.0.0.1',
      port: 11434,
      path: '/api/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 300000 // 5 minutes timeout for local 14B LLM SVG generation
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error("Failed to parse JSON response from Ollama"));
          }
        } else {
          reject(new Error(`Ollama returned status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error("Ollama request timed out"));
    });

    req.write(postData);
    req.end();
  });
}

async function generateImage(nameEn: string, description: string): Promise<GenResult> {
  const promptText = `An authentic, high-quality, professional photograph of a Hindu sacred ritual: ${nameEn}. ${description || ""}. Featuring traditional elements like flowers, oil lamps (diyas), coconuts, mango leaves, and sacred vessels, beautifully arranged on a clean altar, with warm divine lighting and spiritual atmosphere. Detailed, respectful, saffron and gold tones, 4:3 aspect ratio.`;

  // 1. Try local Ollama SVG generation (offline & free!)
  try {
    const isOllamaActive = await checkOllama();

    if (isOllamaActive) {
      console.log(` -> Querying local Ollama (qwen2.5:1.5b) for SVG design of "${nameEn}"...`);
      const ollamaPrompt = `You are an expert graphic designer and SVG generator. Generate a beautiful, clean, well-formatted, and valid SVG illustration for a Hindu sacred ritual: "${nameEn}".
Theme and requirements:
1. Aspect ratio: 4:3 (use viewBox="0 0 800 600" width="100%" height="100%").
2. Palette: Sleek, high-end look with traditional warm colors (Saffron #f97316, Deep Red #881337, Gold gradient #ca8a04 to #eab308).
3. Elements: Include elegant geometric/artistic patterns (mandala, traditional border, corner motifs) and a stylized representation of Lord Ganesha or the deity or elements related to "${nameEn}" (like a silhouette, simple line art, or symbolic representation) and a lit diya (lamp) with a soft glow effect.
4. Typography: Include the text "${nameEn}" inside the SVG in a beautiful Serif font, centered.
5. Response: Output ONLY the raw SVG code. No markdown, no HTML wrappers, no explanations. Start directly with "<svg" and end with "</svg>".`;

      const ollamaData = await callOllamaGenerate(ollamaPrompt);
      let text = ollamaData.response || "";
      
      if (text.includes("</think>")) {
        text = text.split("</think>")[1];
      }
      
      const svgMatch = text.match(/<svg[\s\S]*<\/svg>/);
      if (svgMatch) {
        const base64Svg = Buffer.from(svgMatch[0].trim()).toString("base64");
        return {
          bytesBase64: base64Svg,
          isSvg: true
        };
      } else {
        console.warn(" -> Ollama response did not contain a valid <svg> block.");
      }
    }
  } catch (e) {
    console.error(" -> Ollama check failed with error:", e instanceof Error ? e.message : String(e));
  }

  // 2. Try local Stable Diffusion WebUI API (AUTOMATIC1111) (offline & free!)
  try {
    const sdResponse = await fetch("http://127.0.0.1:7860/sdapi/v1/txt2img", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: promptText,
        steps: 20,
        width: 800,
        height: 600,
      }),
      signal: AbortSignal.timeout(3000), // Timeout quickly if not running
    });

    if (sdResponse.ok) {
      console.log(` -> Using local Stable Diffusion WebUI for "${nameEn}"...`);
      const sdData = await sdResponse.json() as any;
      if (sdData.images && sdData.images.length > 0) {
        return {
          bytesBase64: sdData.images[0],
          isSvg: false
        };
      }
    }
  } catch (sdErr) {
    // SD not running
  }

  // 3. Try Hugging Face free API if configured
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
          return {
            bytesBase64: Buffer.from(arrayBuffer).toString("base64"),
            isSvg: false
          };
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

  // 4. Fall back to Gemini Imagen 4
  if (!apiKey) {
    throw new Error("No API keys (Gemini/Hugging Face) or local generators (Ollama/Stable Diffusion) available.");
  }

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

  return {
    bytesBase64: data.predictions[0].bytesBase64Encoded,
    isSvg: false
  };
}

async function main() {
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

  const force = process.argv.includes('--force');
  const limitArg = process.argv.find(arg => arg.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : Infinity;

  let successCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    // Only generate for poojas
    if (!item.id.startsWith('puja-')) {
      continue;
    }

    // Skip if it's already generated (points to local path) and force is not specified
    if (item.imageUrl.startsWith('/images/poojas/') && !force) {
      skippedCount++;
      continue;
    }

    if (successCount >= limit) {
      console.log(`Reached generation limit of ${limit}. Stopping.`);
      break;
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

      const { bytesBase64, isSvg } = await generateImage(nameEn, desc);
      const buffer = Buffer.from(bytesBase64, 'base64');
      const filename = `${item.id}.${isSvg ? 'svg' : 'jpg'}`;
      const filepath = path.join(poojasDir, filename);

      fs.writeFileSync(filepath, buffer);
      
      // Update entry details
      item.imageUrl = `/images/poojas/${filename}`;
      item.imageHint = `${isSvg ? 'SVG' : 'AI generated'} ritual image of ${nameEn}`;
      
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
