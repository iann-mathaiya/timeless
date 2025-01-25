import { sessions, users } from "@/db/schema";
import { defineMiddleware } from "astro:middleware";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";

export const onRequest = defineMiddleware(async (context, next) => {
  const sessionId = context.cookies.get('auth_session')?.value;

  console.log('sessionId from middleware', sessionId);

  if (!sessionId) {
    context.locals.user = null;
    context.locals.session = null;
    return next();
  }

  const { env } = context.locals.runtime;
  const db = drizzle(env.ARS_DB);

  async function validateSession(sessionId: string) {
    if (!sessionId) return null;

    const session = await db.select().from(sessions).where(eq(sessions.id, sessionId)).get();

    if (!session || session.expiresAt < Date.now()) {
      return null;
    }

    const user = await db.select().from(users).where(eq(users.id, session.userId)).get();

    return user ? { session, user } : null;
  }

  const validatedSession = await validateSession(sessionId);

  if (validatedSession) {
    context.cookies.set("auth_session", validatedSession.session.id, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: import.meta.env.PROD,
      maxAge: validatedSession.session.expiresAt
    });

    context.locals.user = validatedSession.user;
    context.locals.session = validatedSession.session;

    console.log('user from middleware', context.locals.user);

  }

  return next();
});