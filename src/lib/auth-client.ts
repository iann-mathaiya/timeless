import { createAuthClient } from "better-auth/client"

export const authClient =  createAuthClient({
    // TODO: update baseURL true state after deploying
    baseURL: import.meta.env.PROD ? '/' : 'http://localhost:3000'
})

export const { signIn, signUp, useSession } = createAuthClient()