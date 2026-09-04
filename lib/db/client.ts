import { parseEnv } from "@neon/env"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

import * as schema from "./schema"
import neonConfig from "@/neon"

// Ensure env is loaded
parseEnv(neonConfig)

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })

export * from "./schema"
