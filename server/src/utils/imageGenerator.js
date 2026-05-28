/**
 * Pollinations.ai - FREE image generation, no API key required!
 * Images are uploaded to Cloudinary for permanent CDN storage.
 */

import fetch from "node-fetch";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const stylePrompts = {
  "Bold & Graphic":
    "eye-catching thumbnail, bold typography, vibrant colors, expressive facial reaction, dramatic lighting, high contrast, click-worthy composition, professional YouTube thumbnail style",
  "Tech/Futuristic":
    "futuristic thumbnail, sleek modern design, digital UI elements, glowing accents, holographic effects, cyber-tech aesthetic, sharp lighting, high-tech atmosphere",
  Minimalist:
    "minimalist thumbnail, clean layout, simple shapes, limited color palette, plenty of negative space, modern flat design, clear focal point",
  Photorealistic:
    "photorealistic thumbnail, ultra-realistic lighting, natural skin tones, candid moment, DSLR-style photography, lifestyle realism, shallow depth of field",
  Illustrated:
    "illustrated thumbnail, custom digital illustration, stylized characters, bold outlines, vibrant colors, creative cartoon or vector art style",
};

const colorSchemeDescriptions = {
  vibrant:
    "vibrant and energetic colors, high saturation, bold contrasts, eye-catching palette",
  sunset:
    "warm sunset tones, orange pink and purple hues, soft gradients, cinematic glow",
  forest:
    "natural green tones, earthy colors, calm and organic palette, fresh atmosphere",
  neon: "neon glow effects, electric blues and pinks, cyberpunk lighting, high contrast glow",
  purple:
    "purple-dominant color palette, magenta and violet tones, modern and stylish mood",
  monochrome:
    "black and white color scheme, high contrast, dramatic lighting, timeless aesthetic",
  ocean:
    "cool blue and teal tones, aquatic color palette, fresh and clean atmosphere",
  pastel:
    "soft pastel colors, low saturation, gentle tones, calm and friendly aesthetic",
};

const aspectRatioMap = {
  "16:9": { width: 1280, height: 720 },
  "1:1": { width: 1080, height: 1080 },
  "9:16": { width: 720, height: 1280 },
};

export const generateThumbnailUrl = async ({
  title,
  style,
  colorScheme,
  aspectRatio,
  userPrompt,
}) => {
  const stylePart = stylePrompts[style] || stylePrompts["Bold & Graphic"];
  const colorPart =
    colorSchemeDescriptions[colorScheme] || colorSchemeDescriptions.vibrant;
  const { width, height } =
    aspectRatioMap[aspectRatio] || aspectRatioMap["16:9"];

  let prompt = `YouTube thumbnail for "${title}", ${stylePart}, ${colorPart}`;
  if (userPrompt && userPrompt.trim()) {
    prompt += `, ${userPrompt.trim()}`;
  }
  prompt += ", high quality, 4k, professional thumbnail design";

  const seed = Math.floor(Math.random() * 1_000_000);
  const encodedPrompt = encodeURIComponent(prompt);
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&model=flux&nologo=true&enhance=true`;

  // 1. Pollinations se image fetch karo (server-side — no browser referrer)
  const response = await fetch(pollinationsUrl, {
    headers: { "User-Agent": "Thumblify-Server/1.0" },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Image generation failed: ${response.status} — ${text.slice(0, 200)}`,
    );
  }

  // 2. Buffer banao aur base64 mein convert karo
  const buffer = await response.buffer();
  const base64 = `data:image/jpeg;base64,${buffer.toString("base64")}`;

  // 3. Cloudinary pe upload karo
  const uploaded = await cloudinary.uploader.upload(base64, {
    folder: "thumblify",
    resource_type: "image",
  });

  // 4. Permanent Cloudinary URL return karo (MongoDB mein yahi save hoga)
  return { imageUrl: uploaded.secure_url, promptUsed: prompt };
};
