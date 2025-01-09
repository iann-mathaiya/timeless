import { defineMiddleware } from "astro:middleware"

export const onRequest = defineMiddleware(async (context, next) => {

    // Inject D1 database connection first
    // context.locals.db = initDbConnectionDev({ DB: context.locals.DB })

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