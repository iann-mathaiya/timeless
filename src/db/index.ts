import { D1Dialect } from "kysely-d1"
import Database from "better-sqlite3"
import { Kysely, SqliteDialect } from "kysely"
import { getLocalD1DB } from "../lib/utlis"

export async function initDbConnectionDev() {
  const url = getLocalD1DB()

  return new SqliteDialect({
    database: new Database(url)
  })
}

function initDbConnection() {
  return new D1Dialect({
    database: import.meta.env.DB,
  })
}

export const db = new Kysely({
  dialect:
    import.meta.env.PROD
      ? initDbConnection()
      : await initDbConnectionDev(),
})