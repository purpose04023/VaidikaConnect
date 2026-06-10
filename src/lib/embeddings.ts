/**
 * Generates a 768-dimensional text embedding using Google's text-embedding-004 model.
 * This is designed to run in Vercel Edge Runtime (using raw fetch rather than heavy SDKs).
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY environment variable.");
  }

  const cleanText = text.replace(/\n/g, " ").trim();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "models/text-embedding-004",
        content: {
          parts: [{ text: cleanText }]
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini Embedding API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const values = data?.embedding?.values;

    if (!Array.isArray(values) || values.length !== 768) {
      throw new Error(`Expected a 768-dimensional vector, got: ${values?.length ?? 'none'}`);
    }

    return values;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}
