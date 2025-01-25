import { sessions } from "@/db/schema";
import type { APIContext } from "astro"
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

export async function POST(context: APIContext): Promise<Response> {
        const { env } = context.locals.runtime;
        const db = drizzle(env.ARS_DB, {schema: { sessions }});
        
  if (!context.locals.session) {
    return new Response(null, {
      status: 401,
    });
  }

  const sessionId = context.cookies.get('session')?.value;

  if(sessionId) {
      await db.delete(sessions).where(eq(sessions.id, sessionId));
  }

  context.cookies.delete('session', { 
    path: '/' 
  });

  return context.redirect("/join")
}