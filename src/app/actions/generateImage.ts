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
      const errorText = await response.text();
      console.error("Gemini Imagen API error response:", errorText);
      return {
        success: false,
        error: `Gemini API error (Status ${response.status}): ${errorText || response.statusText}`
      };
    }

    const data = await response.json();
    if (!data.generatedImages || data.generatedImages.length === 0) {
      console.error("Gemini Imagen API returned empty images:", JSON.stringify(data));
      return {
        success: false,
        error: "No images were returned by the Gemini AI."
      };
    }

    const base64Image = data.generatedImages[0].image.imageBytes;
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
