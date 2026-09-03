import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";

const dbDataSchema = z.object({
  products: z.array(z.any()),
  customers: z.array(z.any()),
  sales: z.array(z.any()),
  services: z.array(z.any()),
  suppliers: z.array(z.any()),
  notifications: z.array(z.any()),
  customerNotes: z.array(z.any()),
});

const DB_DIR = path.resolve("./data");
const DB_FILE = path.join(DB_DIR, "db.json");

export const loadServerDb = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      await fs.mkdir(DB_DIR, { recursive: true });
      try {
        const fileContent = await fs.readFile(DB_FILE, "utf-8");
        const parsed = JSON.parse(fileContent);
        return {
          success: true,
          data: parsed,
        };
      } catch (err) {
        // File doesn't exist, return success with null so the client seeds the database
        return {
          success: true,
          data: null,
        };
      }
    } catch (err: any) {
      console.error("Failed to load server database:", err);
      return {
        success: false,
        error: err.message || String(err),
      };
    }
  });

export const saveServerDb = createServerFn({ method: "POST" })
  .validator(dbDataSchema)
  .handler(async ({ data }) => {
    try {
      await fs.mkdir(DB_DIR, { recursive: true });
      await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
      return {
        success: true,
      };
    } catch (err: any) {
      console.error("Failed to save server database:", err);
      return {
        success: false,
        error: err.message || String(err),
      };
    }
  });
