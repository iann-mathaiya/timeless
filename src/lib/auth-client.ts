import { createAuthClient } from "better-auth/react"

export const { signIn, signUp, signOut, useSession } =  createAuthClient({
    // TODO: update baseURL true state after deploying
    baseURL: import.meta.env.PROD ? '/' : 'http://localhost:4321',
    provider: "google"
})