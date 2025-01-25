import type { APIContext } from "astro"
import { generateCodeVerifier, generateState, Google } from "arctic"

export const prerender = false

export async function GET(context: APIContext): Promise<Response> {
	const state = generateState()
	const codeVerifier = generateCodeVerifier()

	const redirectURI = context.locals.runtime.env.PROJECT_STATE === 'production' ? 'https://www.pocket-journal.com/api/auth/callback/google' : 'http://localhost:4321/api/auth/callback/google'

	const google = new Google(import.meta.env.GOOGLE_CLIENT_ID, import.meta.env.GOOGLE_CLIENT_SECRET, redirectURI)

    const scopes = ["openid", "profile", "email"];
    const url = google.createAuthorizationURL(state, codeVerifier, scopes)

	context.cookies.set("google_oauth_state", state, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: import.meta.env.PROD,
		maxAge: 60 * 60 * 24 * 60, // 60 days
	})

    context.cookies.set("google_oauth_code_verifier", codeVerifier, {
		path: "/",
        httpOnly: true,
		sameSite: "lax",
        secure: import.meta.env.PROD,
        maxAge: 60 * 60 * 24 * 60, // 60 days
    });

	return context.redirect(url.toString(), 302)
}