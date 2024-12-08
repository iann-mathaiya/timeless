import { createAuthClient } from "better-auth/client"

export const authClient =  createAuthClient({
    baseURL: import.meta.env.PROD ? '/' : 'http://localhost:3000'
})

export const { signIn, signUp, useSession } = createAuthClient()