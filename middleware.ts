import { createD1Connection } from "./src/db"
import { createAuthWithD1 } from "./src/lib/auth"
import { defineMiddleware } from "astro:middleware"

export const onRequest = defineMiddleware(async (context, next) => {

    // Inject D1 database connection first
    context.locals.db = createD1Connection({ DB: context.locals.DB })

    // Create auth instance
    context.locals.auth = createAuthWithD1(context.locals)

    try {
        const isAuthed = await context.locals.auth.api
        .getSession({
            headers: context.request.headers,
        })
 
    if (isAuthed) {
        context.locals.user = isAuthed.user;
        context.locals.session = isAuthed.session;
    } else {
        context.locals.user = null;
        context.locals.session = null;
    }
    } catch (error) {
        // Handle potential authentication errors
        context.locals.user = null
        context.locals.session = null
        console.error('Authentication error:', error)
    }

    return next()
})