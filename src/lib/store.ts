import { atom } from "jotai";

export const userAtom = atom<User | null>(null)
export const userIdAtom = atom<string>('')

export const currentPathAtom = atom<string>('')