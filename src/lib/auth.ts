import { drizzle } from "drizzle-orm/d1"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

export function createAuthWithD1(env: { DB: D1Database }) {
  const db = drizzle(env.DB)

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite"
    }),
    account: {
      accountLinking: {
        enabled: true,
      },
    },
  })
}