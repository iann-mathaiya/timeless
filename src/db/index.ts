import { Kysely } from "kysely"
import { D1Dialect } from "kysely-d1"
import Database from "better-sqlite3"
import { getLocalD1DB } from "../lib/utils"
import { drizzle } from "drizzle-orm/better-sqlite3"

export function initLocalDbConnection() {
  const url = getLocalD1DB()

  const sqlite = new Database(url)
  const db = drizzle({ client: sqlite })

  return db
}

function initProductionDbConnection() {
  return new Kysely({
    dialect: new D1Dialect({
      database: import.meta.env.DB,
    })
  })
}

export const db = import.meta.env.PROD ? initProductionDbConnection() : initLocalDbConnection()