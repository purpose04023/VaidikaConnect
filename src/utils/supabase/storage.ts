import { createClient } from './client';

/**
 * Uploads a file (or base64 string) to the public 'vaidika-assets' Supabase Storage bucket.
 * @param path The destination path inside the bucket (e.g. 'pujas/varalakshmi.png')
 * @param fileOrBase64 A File object or a base64 encoded string
 * @returns The fully qualified public URL of the uploaded asset
 */
export async function uploadAsset(path: string, fileOrBase64: File | string): Promise<string> {
  const supabase = createClient();
  const bucketName = 'vaidika-assets';

  let body: any;
  let contentType = 'application/octet-stream';

  if (typeof fileOrBase64 === 'string') {
    // Handle base64 string
    const matches = fileOrBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      // Treat as plain text or try raw upload
      const binaryStr = atob(fileOrBase64);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      body = bytes.buffer;
    } else {
      contentType = matches[1];
      const base64Data = matches[2];
      const binaryStr = atob(base64Data);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      body = bytes.buffer;
    }
  } else {
    // Handle standard File object
    body = fileOrBase64;
    contentType = fileOrBase64.type;
  }

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(path, body, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase storage upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(path);

  return publicUrl;
}
