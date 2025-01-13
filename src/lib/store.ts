import type { User } from "@/db/schema";
import { atom } from "jotai";

export const userAtom = atom<User | null>(null)
export const currentPathAtom = atom<string>('')