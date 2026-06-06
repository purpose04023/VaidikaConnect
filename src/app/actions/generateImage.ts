'use server';

import http from 'http';

function checkOllama(): Promise<boolean> {
  return new Promise((resolve) => {
    const options = {
      hostname: '127.0.0.1',
      port: 11434,
      path: '/api/tags',
      method: 'GET',
      timeout: 5000 // 5 seconds check
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

/**
 * Server action to generate a high-quality, authentic image for a puja
 * using the Gemini Imagen 3 model.
 * 
 * @param nameEn The English name of the Puja (e.g. Satyanarayana Vratam)
 * @param description The English description of the Puja
 * @returns A promise resolving to the result object containing the base64 image data URL or error message.
 */
export async function generatePujaImageAction(
  nameEn: string,
  description: string
): Promise<{ success: boolean; image?: string; error?: string }> {
  try {
    if (!nameEn) {
      return {
        success: false,
        error: "Pooja name is required to generate an image."
      };
    }

    // A detailed, premium-quality prompt designed to match the saffron/gold spiritual aesthetic of VaidikaConnect
    const promptText = `An authentic, high-quality, professional photograph of a Hindu sacred ritual: ${nameEn}. ${description || ""}. Featuring traditional elements like flowers, oil lamps (diyas), coconuts, mango leaves, and sacred vessels, beautifully arranged on a clean altar, with warm divine lighting and spiritual atmosphere. Detailed, respectful, saffron and gold tones, 4:3 aspect ratio.`;

    // 0. Try local Ollama SVG generation (offline & free!)
    try {
      console.log("Checking if local Ollama API is running at http://127.0.0.1:11434...");
      const isOllamaActive = await checkOllama();

      if (isOllamaActive) {
        console.log("Ollama API is active. Querying qwen2.5:1.5b model for SVG generation...");
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
          console.log("Successfully generated SVG locally via Ollama.");
          const base64Svg = Buffer.from(svgMatch[0].trim()).toString("base64");
          return {
            success: true,
            image: `data:image/svg+xml;base64,${base64Svg}`
          };
        } else {
          console.warn("Ollama returned response but no valid SVG block was found:", text.slice(0, 200));
        }
      }
    } catch (ollamaErr) {
      console.log("Local Ollama API is not running or reachable at http://127.0.0.1:11434. Error:", ollamaErr);
    }

    // 0.5. Try local Stable Diffusion WebUI API (AUTOMATIC1111) (fully offline & free!)
    try {
      console.log("Checking local Stable Diffusion WebUI API at http://127.0.0.1:7860...");
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
        const sdData = await sdResponse.json() as any;
        if (sdData.images && sdData.images.length > 0) {
          console.log("Successfully generated image locally via Stable Diffusion WebUI.");
          return {
            success: true,
            image: `data:image/jpeg;base64,${sdData.images[0]}`
          };
        }
      }
    } catch (sdErr) {
      console.log("Local Stable Diffusion WebUI is not running or reachable at http://127.0.0.1:7860.");
    }

    // 1. Try Hugging Face first if the free API Key is defined
    const hfApiKey = process.env.HF_API_KEY;
    if (hfApiKey) {
      // List of candidate models to try in sequence
      const hfModels = [
        "black-forest-labs/FLUX.1-schnell",
        "stabilityai/stable-diffusion-xl-base-1.0",
        "CompVis/stable-diffusion-v1-4"
      ];
      
      let lastError = "";
      
      for (const hfModel of hfModels) {
        try {
          console.log(`Generating image using Hugging Face (${hfModel})...`);
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
            
            // Check for Hugging Face loading error
            if (hfResponse.status === 503 || errorText.includes("loading") || errorText.includes("estimated_time")) {
              let estimatedTime = 15;
              try {
                const parsed = JSON.parse(errorText);
                estimatedTime = Math.ceil(parsed.estimated_time || 15);
              } catch (e) {}
              
              console.log(`Model ${hfModel} is loading. Waiting ${estimatedTime} seconds before retrying (retries left: ${retries - 1})...`);
              await new Promise(resolve => setTimeout(resolve, estimatedTime * 1000));
              retries--;
              continue;
            }
            
            throw new Error(`HF Error status ${hfResponse.status}: ${errorText}`);
          }

          if (hfResponse && hfResponse.ok) {
            const arrayBuffer = await hfResponse.arrayBuffer();
            const base64Image = Buffer.from(arrayBuffer).toString("base64");
            return {
              success: true,
              image: `data:image/jpeg;base64,${base64Image}`
            };
          }
        } catch (hfErr) {
          console.warn(`Hugging Face model ${hfModel} failed:`, hfErr);
          lastError = hfErr instanceof Error ? hfErr.message : String(hfErr);
        }
      }
      
      // If Hugging Face failed and there's no Gemini key, return the HF error
      if (!process.env.GEMINI_API_KEY) {
        return {
          success: false,
          error: `Hugging Face generation failed: ${lastError}`
        };
      }
      console.log("All Hugging Face models failed. Attempting Gemini fallback...");
    }

    // 2. Fall back to Gemini Imagen 4
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        error: "No active image generation API key found. Please define HF_API_KEY or GEMINI_API_KEY in your environment variables (.env.local)."
      };
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
      console.error("Gemini Imagen API error response:", errorText);
      let errorMessage = errorText || response.statusText;
      try {
        const parsed = JSON.parse(errorText);
        if (parsed.error && parsed.error.message) {
          errorMessage = parsed.error.message;
          if (errorMessage.includes("only available on paid plans") || errorMessage.includes("upgrade your account")) {
            errorMessage = "AI Image Generation requires a Google AI Studio account with billing enabled. Please upgrade your plan at https://aistudio.google.com/ to use this feature, or use a free Hugging Face API key (HF_API_KEY).";
          }
        }
      } catch (e) {
        // ignore and use raw text
      }
      return {
        success: false,
        error: errorMessage
      };
    }

    const data = await response.json() as any;
    if (!data.predictions || data.predictions.length === 0) {
      console.error("Gemini Imagen API returned empty predictions:", JSON.stringify(data));
      return {
        success: false,
        error: "No images were returned by the Gemini AI."
      };
    }

    const base64Image = data.predictions[0].bytesBase64Encoded;
    return {
      success: true,
      image: `data:image/jpeg;base64,${base64Image}`
    };
  } catch (error) {
    console.error("Failed to generate image:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred during image generation."
    };
  }
}
