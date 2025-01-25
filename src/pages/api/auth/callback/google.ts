import { sessions, users, type User } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import type { APIContext } from "astro";
import { drizzle } from "drizzle-orm/d1";
import type { GoogleUser } from "@/lib/types";
import { ArcticFetchError, Google, OAuth2RequestError } from "arctic";


export const prerender = false

export async function GET(context: APIContext): Promise<Response> {
    const { env } = context.locals.runtime;
    const db = drizzle(env.ARS_DB, {schema: { users }});

	const redirectURI = 'https://www.pocket-journal.com/api/auth/callback/google'

	const google = new Google(import.meta.env.GOOGLE_CLIENT_ID, import.meta.env.GOOGLE_CLIENT_SECRET, redirectURI)

    const code = context.url.searchParams.get("code")
    const state = context.url.searchParams.get("state")
    const storedState = context.cookies.get("google_oauth_state")?.value ?? null
    const storedCodeVerifier = context.cookies.get("google_oauth_code_verifier")?.value || ''
  
    if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
      console.table([code, state, storedState, storedCodeVerifier])
      return new Response(
        JSON.stringify({ message: "Error --> Invalid state or code" }),
        { status: 400 }
      )
    }

    try {
        const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);
        const accessToken = tokens.accessToken();
        const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
        let refreshToken: string | undefined = undefined
        let refreshTokenExpiresIn: number | undefined = undefined

        if ("refresh_token_expires_in" in tokens.data && typeof tokens.data.refresh_token_expires_in === "number") {
            refreshTokenExpiresIn = tokens.data.refresh_token_expires_in;
        }
        if (tokens.hasRefreshToken()) {
            refreshToken = tokens.refreshToken();
        }
    
        const googleUserResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const googleUser: GoogleUser = await googleUserResponse.json();

        const existingUser = await db.query.users.findFirst({
            where: and(eq(users.providerId, "Google"), eq(users.providerUserId, googleUser.sub))
        })

        async function createSession(userId: string){
            const session = await db.insert(sessions).values({
                id: crypto.randomUUID(),
                userId: userId,
                createdAt: new Date(),
                expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 60 // 60 days
            }).returning({sessionId: sessions.id, expiresAt: sessions.expiresAt})

            return session[0]
        }

        function setSessionTokenCookie(token: string): void {
            context.cookies.set("auth_session", token, {
                httpOnly: true,
                sameSite: "lax",
                secure: import.meta.env.PROD,
                maxAge: 60 * 60 * 24 * 14, // 60 days
                path: "/"
            });

        }
            
            if(existingUser){
                const session = createSession(existingUser.id)
                setSessionTokenCookie((await session).sessionId)
                // console.log('sessionId from callback', (await session).sessionId)
                return context.redirect("/home")
        }

        const [user] = await db.insert(users).values({
            id: crypto.randomUUID(),
            providerId: 'Google',
            createdAt: new Date(),
            email: googleUser.email,
            refreshToken: refreshToken,
            providerUserId: googleUser.sub,
            firstName: googleUser.given_name,
            lastName: googleUser.family_name,
            profilePicture: googleUser.picture,
            emailIsVerified: googleUser.email_verified ? 1 : 0,
            name: `${googleUser.given_name} ${googleUser.family_name}`,
        }).returning();

        const session = createSession(user.id)

        setSessionTokenCookie((await session).sessionId)
              
    } catch (error) {
               if (error instanceof OAuth2RequestError) {
                    // Invalid authorization code, credentials, or redirect URI
                    const code = error.code;
                    // ...
                }
                if (error instanceof ArcticFetchError) {
                    // Failed to call `fetch()`
                    const cause = error.cause;
                    // ...
                }
    }

    return context.redirect("/home")

}