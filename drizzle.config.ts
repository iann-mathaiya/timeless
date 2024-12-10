import fs from "node:fs"
import path from "node:path"
import type { Config } from "drizzle-kit"
import { defineConfig } from "drizzle-kit"
import { DB, CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID } from "astro:env/server"

function getLocalD1DB() {
    try {
        const basePath = path.resolve(".wrangler")
        const dbFile = fs
            .readdirSync(basePath, { encoding: "utf-8", recursive: true })
            .find((f) => f.endsWith(".sqlite"))

        if (!dbFile) {
            throw new Error(`.sqlite file not found in ${basePath}`)
        }

        const url = path.resolve(basePath, dbFile)
        return url
    } catch (err) {
        console.log(`Error  ${err}`)
    }
}

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./src/db/migrations",
    dialect: "sqlite",
    ...(import.meta.env.PROD
        ? {
            driver: "d1-http",
            dbCredentials: {
                databaseId: DB,
                token: CLOUDFLARE_API_TOKEN,
                accountId: CLOUDFLARE_ACCOUNT_ID,
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