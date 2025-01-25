import { Kysely } from "kysely";
import { D1Dialect } from "@atinux/kysely-d1";

export const db = new Kysely({
  dialect: new D1Dialect({
    database: import.meta.env.DB,
  })
});