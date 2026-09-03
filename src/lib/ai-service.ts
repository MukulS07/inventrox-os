import { createServerFn } from "@tanstack/react-start";
import OpenAI from "openai";
import { z } from "zod";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const chatMessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string(),
});

const getAiResponseInputSchema = z.object({
  messages: z.array(chatMessageSchema),
});

export const getAiResponse = createServerFn({ method: "POST" })
  .validator(getAiResponseInputSchema)
  .handler(async ({ data }) => {
    const token = process.env["NVIDIA_API_KEY"] || process.env["GITHUB_TOKEN"];
    const isNvidia = !!process.env["NVIDIA_API_KEY"];

    console.log("NVIDIA_API_KEY presence check:", !!process.env["NVIDIA_API_KEY"]);
    console.log("GITHUB_TOKEN presence check:", !!process.env["GITHUB_TOKEN"]);

    const endpoint = isNvidia ? "https://integrate.api.nvidia.com/v1" : "https://models.github.ai/inference";
    const model = isNvidia ? "openai/gpt-oss-120b" : "gpt-4o";

    if (!token) {
      return {
        success: false,
        error: "NVIDIA_API_KEY or GITHUB_TOKEN is not configured on the server environment. Running in mock simulation mode.",
      };
    }

    try {
      const client = new OpenAI({ baseURL: endpoint, apiKey: token });
      
      const completionParams: any = {
        messages: (data?.messages || []) as any,
        model: model,
      };

      if (isNvidia) {
        completionParams.temperature = 1;
        completionParams.top_p = 0.95;
        completionParams.max_tokens = 4096; // adjusted safe limit for prompt completions
        completionParams.extra_body = { chat_template_kwargs: { thinking: false } };
      }

      const response = await client.chat.completions.create(completionParams);

      return {
        success: true,
        content: response.choices[0].message.content || "",
      };
    } catch (err: any) {
      console.error("AI chat completion error:", err);
      return {
        success: false,
        error: err?.message || String(err),
      };
    }
  });

const getAiVisionOcrInputSchema = z.object({
  imageBase64: z.string(),
  categoryHint: z.string().optional()
});

export const getAiVisionOcr = createServerFn({ method: "POST" })
  .validator(getAiVisionOcrInputSchema)
  .handler(async ({ data }) => {
    const token = process.env["NVIDIA_API_KEY"] || process.env["GITHUB_TOKEN"];
    const isNvidia = !!process.env["NVIDIA_API_KEY"];

    const endpoint = isNvidia ? "https://integrate.api.nvidia.com/v1" : "https://models.github.ai/inference";
    const model = isNvidia ? "nvidia/neva-22b" : "gpt-4o";

    if (!token) {
      return {
        success: false,
        error: "NVIDIA_API_KEY or GITHUB_TOKEN is not configured on the server.",
      };
    }

    try {
      const client = new OpenAI({ baseURL: endpoint, apiKey: token });

      let imageUrl = data.imageBase64;
      if (!imageUrl.startsWith("data:image")) {
        imageUrl = `data:image/jpeg;base64,${imageUrl}`;
      }

      const prompt = `You are a visual OCR and catalog parsing assistant. 
Analyze the image of the price list sheet provided. Extract all product rows and their corresponding details:
- name: The full product/model name (e.g. "Okaya ATSW 950 12V")
- sku: A clean SKU code (e.g. "ATSW-950-12V" or model number)
- category: Determine the category (choose from: Coffee, Syrups, Milks, Packaging, Accessories, Apparel, Inverter, Inverter Battery).
- cost: The DP Basic (Distributor Price Basic, cost price). If missing, calculate around 70% of price.
- price: The MRP (Maximum Retail Price, selling price).
- gstRate: The GST rate percentage (e.g. 18 or 12 or 5) if visible.
- description: A list of specifications and attributes (like Voltages, Capacity, Wattage, Warranty, Series, Type).

Return ONLY a valid JSON array of objects. Do not include markdown code blocks, do not include comments.
Format:
[
  {
    "name": "Product Name",
    "sku": "SKU-CODE",
    "category": "Inverter",
    "cost": 3906,
    "price": 7500,
    "gstRate": 18,
    "description": "Volt: 12V, VA: 700VA, Wattage: 560W, Warranty: 36 Months",
    "supplier": "Okaya Supplier"
  }
]`;

      const response = await client.chat.completions.create({
        model: model,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                },
              },
            ] as any,
          },
        ],
        max_tokens: 4096,
      });

      return {
        success: true,
        content: response.choices[0].message.content || "",
      };
    } catch (err: any) {
      console.error("AI Vision OCR error:", err);
      return {
        success: false,
        error: err?.message || String(err),
      };
    }
  });

