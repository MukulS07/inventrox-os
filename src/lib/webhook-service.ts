import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const fireWebhookInputSchema = z.object({
  url: z.string(),
  payload: z.any(),
});

export const fireWebhookServer = createServerFn({ method: "POST" })
  .validator(fireWebhookInputSchema)
  .handler(async ({ data }) => {
    try {
      const response = await fetch(data.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data.payload),
      });

      let responseData: any = null;
      const contentType = response.headers.get("content-type") || "";
      
      try {
        if (contentType.includes("application/json")) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }
      } catch (e) {
        console.warn("Could not parse webhook response body:", e);
      }

      return {
        success: response.ok,
        status: response.status,
        data: responseData,
      };
    } catch (err: any) {
      console.error("Server-side webhook fire error:", err);
      return {
        success: false,
        error: err?.message || String(err),
      };
    }
  });
