import { z } from 'astro:schema';
import { drizzle } from "drizzle-orm/d1";
import { ActionError, defineAction } from "astro:actions";
import { posts as postsSchema, postsSelectSchema, users } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export const posts = {
    createPost: defineAction({
        input: z.object({
            title: z.string(),
            description: z.string().optional(),
            media: z.string().array().min(1)
        }),
        handler: async ({ title, description, media }, context) => {
            // console.log({ title, description, media });
            const { env } = context.locals.runtime;
            const db = drizzle(env.ARS_DB);

            try {
                const authDetails = await auth.api.getSession({
                    headers: context.request.headers,
                });

                if (!authDetails) {
                    throw new ActionError({ code: 'UNAUTHORIZED' });
                }
                
                const { user } = authDetails;

                const postData = await db.insert(postsSchema).values({
                    id: crypto.randomUUID(),
                    title: title,
                    media: media,
                    userId: user.id,
                    description: description,
                });

                return { success: true, postData };
            } catch (error) {
                console.error(error);
                return { success: false, message: "An unexpected error occurred." };
            }
        }
    }),
    getPosts: defineAction({
        handler: async(context) => {
            const { env } = context.locals.runtime;
            const db = drizzle(env.ARS_DB);

            try {
                const authDetails = await auth.api.getSession({
                    headers: context.request.headers,
                });

                if (!authDetails) {
                    throw new ActionError({ code: 'UNAUTHORIZED' });
                }
                
                const { user } = authDetails;

                const postData = await db.select().from(posts).where(eq(users.id, user.id)) as typeof postsSelectSchema

                return { success: true, postData };
            } catch (error) {
                console.error(error);
                return { success: false, message: "An unexpected error occurred." };
            }
        }
    })
};