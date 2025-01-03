import { eq } from 'drizzle-orm';
import { z } from 'astro:schema';
import { auth } from '@/lib/auth';
import { drizzle } from "drizzle-orm/d1";
import { ActionError, actions, defineAction } from "astro:actions";
import { posts as postsSchema, users, type Post } from '@/db/schema';

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

                const mediaInput = JSON.parse(media[0])

                console.log('media', media)
                console.log('mediaInput:', mediaInput)

                const postData = await db.insert(postsSchema).values({
                    id: crypto.randomUUID(),
                    title: title,
                    userId: user.id,
                    media: mediaInput,
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
        input: z.object({
            userId: z.string()
        }),
        handler: async ({ userId }, context) => {
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

                if(user.id !== userId){
                    throw new ActionError({code: 'FORBIDDEN'})
                }

                const postData: Post[] = await db.select().from(postsSchema).where(eq(postsSchema.userId, user.id));

                return { success: true, postData };
            } catch (error) {
                console.error(error);
                return { message: "An unexpected error occurred." };
            }
        }
    })
};