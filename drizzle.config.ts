import type { Config } from "drizzle-kit"
import { defineConfig } from "drizzle-kit"
// import { getLocalD1DB } from "./src/lib/utils"

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./src/db/migrations",
    dialect: "sqlite",
            driver: "d1-http",
            dbCredentials: {
                databaseId: process.env.DB as unknown as string,
                token: process.env.CLOUDFLARE_API_TOKEN as string,
                accountId: process.env.CLOUDFLARE_ACCOUNT_ID as string,
            },

    tablesFilter: ['/^(?!.*_cf_KV).*$/'] //ignore the _cf_KV table
    // verbose: true,
    // strict: true,
}) satisfies Config