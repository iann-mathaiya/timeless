import { sessions, users } from "@/db/schema";
import { defineMiddleware } from "astro:middleware";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";

export const onRequest = defineMiddleware(async (context, next) => {
  const sessionId = context.cookies.get('session')?.value;

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
  
  if (sessionId) {
    const validatedSession = await validateSession(sessionId);
    
    if (validatedSession) {
      context.locals.user = validatedSession.user;
      context.locals.session = validatedSession.session;
    }
  }

  return next();
});