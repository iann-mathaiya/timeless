import { drizzle } from "drizzle-orm/d1"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "astro:env/server"

export function createAuthWithD1(env: { DB: D1Database }) {
  const db = drizzle(env.DB)

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite"
    }),
    socialProviders: {
      google: {
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
      },
    },
    account: {
      accountLinking: {
        enabled: true,
      },
    },
  })
}