import type { Config } from "drizzle-kit"
import { defineConfig } from "drizzle-kit"
import { getLocalD1DB } from "./src/lib/utils"

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./src/db/migrations",
    dialect: "sqlite",
    ...(process.env.NODE_ENV  === 'production'
        ? {
            driver: "d1-http",
            dbCredentials: {
                databaseId: process.env.DB,
                token: process.env.CLOUDFLARE_API_TOKEN,
                accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
            },
        }
        : {
            dbCredentials: {
                url: getLocalD1DB(),
            },
        }),
    tablesFilter: ['/^(?!.*_cf_KV).*$/'] //ignore the _cf_KV table
    // verbose: true,
    // strict: true,
}) satisfies Config