import fs from 'fs';
import path from 'path';
import http from 'http';

const poojasDir = path.resolve(process.cwd(), 'public', 'images', 'poojas');

const missingPujas = [
  { id: 'puja-upakarma', nameEn: 'Upaakarma', description: 'Vedic thread changing ceremony and purification ritual' }
];

function checkOllama(): Promise<boolean> {
  return new Promise((resolve) => {
    const options = {
      hostname: '127.0.0.1',
      port: 11434,
      path: '/api/tags',
      method: 'GET',
      timeout: 5000
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
      timeout: 180000 // 3 minutes
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

    req.on('error', (e) => reject(e));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error("Ollama request timed out"));
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  const isOllamaActive = await checkOllama();
  if (!isOllamaActive) {
    console.error("❌ Ollama is not running on 127.0.0.1:11434");
    return;
  }

  console.log(`🚀 Starting generation of ${missingPujas.length} missing SVGs via local Ollama...`);

  for (const item of missingPujas) {
    const filename = `${item.id}.svg`;
    const filepath = path.join(poojasDir, filename);

    console.log(`Generating SVG for: "${item.nameEn}"...`);

    const prompt = `You are an expert graphic designer and SVG generator. Generate a beautiful, clean, well-formatted, and valid SVG illustration for a Hindu sacred ritual: "${item.nameEn}".
Theme and requirements:
1. Aspect ratio: 4:3 (use viewBox="0 0 800 600" width="100%" height="100%" and include xmlns="http://www.w3.org/2000/svg").
2. Palette: Sleek, high-end look with traditional warm colors (Saffron #f97316, Deep Red #881337, Gold gradient #ca8a04 to #eab308).
3. Elements: Include elegant geometric/artistic patterns (mandala, traditional border, corner motifs) and a stylized representation of elements related to "${item.nameEn}" (description: "${item.description}") and a lit diya (lamp) with a soft glow effect.
4. Typography: Include the text "${item.nameEn}" inside the SVG in a beautiful Serif font, centered.
5. Response: Output ONLY the raw SVG code. No markdown, no HTML wrappers, no explanations. Start directly with "<svg" and end with "</svg>".`;

    try {
      const response = await callOllamaGenerate(prompt);
      let text = response.response || "";

      if (text.includes("</think>")) {
        text = text.split("</think>")[1];
      }

      const svgMatch = text.match(/<svg[\s\S]*<\/svg>/);
      if (svgMatch) {
        let svgCode = svgMatch[0].trim();
        
        // Ensure XML namespace exists
        if (!svgCode.includes('xmlns=')) {
          svgCode = svgCode.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
        }

        fs.writeFileSync(filepath, svgCode, 'utf8');
        console.log(`✅ Saved SVG to: ${filename}`);
      } else {
        console.warn(`❌ Ollama response for "${item.nameEn}" did not contain a valid <svg> block. Response was: ${text}`);
      }
    } catch (err) {
      console.error(`❌ Failed to generate SVG for "${item.nameEn}":`, err);
    }
  }

  console.log("🎉 Missing SVG generation completed!");
}

main().catch(console.error);
