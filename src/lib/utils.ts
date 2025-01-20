import fs from "node:fs"
import path from "node:path"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"
import { format, isToday, isYesterday, differenceInDays, isSameYear } from "date-fns";

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
      throw new Error(`Error ${err}`)
  }
}

export function formatPostDate(date: Date | number): string {
  const today = new Date();
  const postDate = new Date(date);
  const daysDifference = differenceInDays(today, postDate);
  const time = format(postDate, "h:mm a"); // e.g., "2:30 PM"

  if (isToday(postDate)) {
    return `Today at ${time}`;
  }

  if (isYesterday(postDate)) {
    return `Yesterday at ${time}`;
  }

  if (daysDifference >= 2 || daysDifference <= 3) {
    return daysDifference === 1 ? `${daysDifference} day ago at ${time}` : `${daysDifference} days ago at ${time}`;
  }

  if (isSameYear(postDate, today)) {
    return `${format(postDate, "MMM d")} at ${time}`; // "Jan 20 at 2:30 PM"
  }
  return `${format(postDate, "MMM d, yyyy")} at ${time}`; // e.g., "Jan 20, 2023 at 2:30 PM"
}

