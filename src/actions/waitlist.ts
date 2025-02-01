import { z } from "astro:schema";
import { drizzle } from "drizzle-orm/d1";
import { ActionError, defineAction } from "astro:actions";
import { waitlist as waitlistSchema } from "@/db/schema";

export const waitlist = {
    joinWaitlist: defineAction({
        input: z.object({
            emailAddress: z.string()
        }),
        handler: async ({ emailAddress }, context) => {
            const { env } = context.locals.runtime;
            const db = drizzle(env.ARS_DB);

            try {

                const waitlistData = await db.insert(waitlistSchema).values({
                    id: crypto.randomUUID(),
                    email: emailAddress,
                    isInvited: false,
                    waitlistedAt: new Date(),
                }).returning({ insertedEmail: waitlistSchema.email })

                return {
                    success: true,
                    data: waitlistData,
                    message: 'Email subscribed successfully'
                };
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            } catch (error: any) {
                if (error?.message?.includes('UNIQUE constraint failed: waitlist.email')) {
                    console.error(error);
                    throw new ActionError({
                        code: "FORBIDDEN",
                        message: "Email is already subscribed to the waitlist.",
                      });
                }
                console.error(error);
                
                return { success: false, message: "An unexpected error occurred." };
            }
        }
    })
};