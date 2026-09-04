import { defineConfig } from "drizzle-kit"
import { config } from "dotenv"
config({ path: ".env.local" })

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Drizzle requires direct/unpooled connection for migrations
    url: process.env.DATABASE_URL_UNPOOLED!,
  },
})
