/**
 * Pollinations.ai - FREE image generation, no API key required!
 * Model: flux-pro — best quality available on Pollinations
 * Images uploaded to Cloudinary for permanent CDN storage.
 */

import fetch from "node-fetch";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Style prompts — highly detailed for better image quality ─────────────────
const stylePrompts = {
  "Bold & Graphic": [
    "YouTube thumbnail, bold graphic design, striking composition",
    "oversized expressive face with dramatic reaction, wide eyes",
    "large bold sans-serif text overlay space, high contrast colors",
    "professional studio lighting, vivid saturated palette",
    "cinematic depth of field, polished editorial look",
  ].join(", "),

  "Tech/Futuristic": [
    "YouTube thumbnail, futuristic tech aesthetic",
    "sleek holographic UI elements, glowing neon circuits",
    "dark background with electric blue and cyan accents",
    "lens flare, chromatic aberration, cyber grid overlay",
    "ultra sharp 8k render, sci-fi atmosphere",
  ].join(", "),

  Minimalist: [
    "YouTube thumbnail, minimalist clean design",
    "lots of negative space, single strong focal point",
    "flat vector illustration style, geometric shapes",
    "limited 2-3 color palette, swiss graphic design influence",
    "crisp edges, modern typography space, breathable layout",
  ].join(", "),

  Photorealistic: [
    "YouTube thumbnail, photorealistic DSLR photography",
    "natural cinematic lighting, shallow depth of field f1.8",
    "Sony A7R IV quality, 85mm portrait lens",
    "authentic candid moment, professional color grade",
    "lifestyle photography, rich skin tones, sharp subject",
  ].join(", "),

  Illustrated: [
    "YouTube thumbnail, custom digital illustration",
    "vibrant character art, bold ink outlines",
    "semi-flat illustration with subtle shading",
    "expressive stylized characters, dynamic pose",
    "comic-inspired color blocking, playful energy",
  ].join(", "),
};

// ── Color palettes — specific hex-inspired descriptions ──────────────────────
const colorSchemeDescriptions = {
  vibrant:    "vibrant saturated colors, electric red orange yellow, ultra high contrast, eye-catching pop art palette",
  sunset:     "cinematic sunset palette, deep orange coral pink purple gradient sky, warm golden hour light",
  forest:     "rich forest greens, earthy browns, golden sunlight through trees, organic natural palette",
  neon:       "neon cyberpunk palette, electric magenta cyan green on pitch black, glowing light trails",
  purple:     "deep purple violet magenta palette, luxury dark background, glowing purple accents",
  monochrome: "dramatic black and white, extreme contrast, rich shadows, editorial monochrome grade",
  ocean:      "ocean blues, turquoise teal, seafoam white, deep navy, refreshing aquatic palette",
  pastel:     "soft dreamy pastels, blush pink lavender mint, airy light aesthetic, kawaii-inspired softness",
};

// ── Negative prompt — things to avoid ────────────────────────────────────────
const NEGATIVE_PROMPT =
  "blurry, low quality, pixelated, watermark, ugly, deformed faces, bad anatomy, cropped, out of frame, duplicate, text errors, nsfw";

const aspectRatioMap = {
  "16:9": { width: 1280, height: 720 },
  "1:1":  { width: 1080, height: 1080 },
  "9:16": { width: 720,  height: 1280 },
};

export const generateThumbnailUrl = async ({ title, style, colorScheme, aspectRatio, userPrompt }) => {
  const stylePart = stylePrompts[style]   || stylePrompts["Bold & Graphic"];
  const colorPart = colorSchemeDescriptions[colorScheme] || colorSchemeDescriptions.vibrant;
  const { width, height } = aspectRatioMap[aspectRatio]  || aspectRatioMap["16:9"];

  // Build a rich, structured prompt
  let prompt = `${stylePart}, ${colorPart}, subject: ${title}`;
  if (userPrompt && userPrompt.trim()) {
    prompt += `, ${userPrompt.trim()}`;
  }
  prompt += ", masterpiece, ultra detailed, 4k resolution, professional thumbnail composition, award winning design";

  const seed = Math.floor(Math.random() * 999_999) + 1;
  const encodedPrompt   = encodeURIComponent(prompt);
  const encodedNegative = encodeURIComponent(NEGATIVE_PROMPT);

  // flux-pro = best quality model on Pollinations (free, no key needed)
  const pollinationsUrl =
    `https://image.pollinations.ai/prompt/${encodedPrompt}` +
    `?width=${width}&height=${height}&seed=${seed}` +
    `&model=flux-pro&nologo=true&enhance=true` +
    `&negative_prompt=${encodedNegative}`;

  // Fetch server-side — no browser Referer header, so anonymous endpoint works
  const response = await fetch(pollinationsUrl, {
    headers: { "User-Agent": "Thumblify-Server/1.0" },
    timeout: 60000, // 60s timeout — flux-pro can be slow
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Image generation failed: ${response.status} — ${text.slice(0, 300)}`);
  }

  // Convert to base64 and upload to Cloudinary
  const buffer      = await response.buffer();
  const base64      = `data:image/jpeg;base64,${buffer.toString("base64")}`;

  const uploaded = await cloudinary.uploader.upload(base64, {
    folder:        "thumblify",
    resource_type: "image",
    quality:       "auto:best",
    fetch_format:  "auto",
  });

  return { imageUrl: uploaded.secure_url, promptUsed: prompt };
};
