import { D1Dialect } from "kysely-d1"
import Database from "better-sqlite3"
import { Kysely, SqliteDialect } from "kysely"

export async function initDbConnectionDev() {
  return new SqliteDialect({
    database: new Database('db.sqlite')
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