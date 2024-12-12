import fs from "node:fs"
import path from "node:path"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLocalD1DB() {
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
