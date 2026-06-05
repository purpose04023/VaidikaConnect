'use server';

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
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        error: "GEMINI_API_KEY is not defined in the environment variables. Please add it to your .env.local file."
      };
    }

    if (!nameEn) {
      return {
        success: false,
        error: "Pooja name is required to generate an image."
      };
    }

    // A detailed, premium-quality prompt designed to match the saffron/gold spiritual aesthetic of VaidikaConnect
    const promptText = `An authentic, high-quality, professional photograph of a Hindu sacred ritual: ${nameEn}. ${description || ""}. Featuring traditional elements like flowers, oil lamps (diyas), coconuts, mango leaves, and sacred vessels, beautifully arranged on a clean altar, with warm divine lighting and spiritual atmosphere. Detailed, respectful, saffron and gold tones, 4:3 aspect ratio.`;

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
            errorMessage = "AI Image Generation requires a Google AI Studio account with billing enabled. Please upgrade your plan at https://aistudio.google.com/ to use this feature.";
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
