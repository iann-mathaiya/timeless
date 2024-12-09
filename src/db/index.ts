import { drizzle } from "drizzle-orm/d1"

export function createD1Connection(env: { DB: D1Database }) {
    const db = drizzle(env.DB);
    
    return {
      db,
      async query() {
        return db;
      }
    };
  }