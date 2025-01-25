import { z } from 'astro:schema';
import { auth } from '@/lib/auth';
import { eq, desc, and, or, not } from 'drizzle-orm';
import { drizzle } from "drizzle-orm/d1";
import { ActionError, defineAction } from "astro:actions";
import { friends, posts as postsSchema, users, type Post } from '@/db/schema';

export const posts = {
    createPost: defineAction({
        input: z.object({
            title: z.string(),
            description: z.string().optional(),
            media: z.string().array().min(1)
        }),
        handler: async ({ title, description, media }, context) => {
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

                const mediaInput = JSON.parse(media[0]);

                const postData = await db.insert(postsSchema).values({
                    id: crypto.randomUUID(),
                    title: title,
                    userId: user.id,
                    media: mediaInput,
                    description: description,
                    createdAt: new Date(),
                    updatedAt: new Date(),
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

                if (user.id !== userId) {
                    throw new ActionError({ code: 'FORBIDDEN' });
                }

                const postData: Post[] = await db.select().from(postsSchema).where(eq(postsSchema.userId, user.id)).orderBy(desc(postsSchema.createdAt));

                return { success: true, postData };
            } catch (error) {
                console.error(error);
                return { message: "An unexpected error occurred." };
            }
        }
    }),
    deletePost: defineAction({
        input: z.object({
            postId: z.string(),
            userId: z.string()
        }),
        handler: async ({ postId, userId }, context) => {
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

                if (user.id !== userId) {
                    throw new ActionError({ code: 'FORBIDDEN' });
                }

                const deletedPost = await db.delete(postsSchema).where(eq(postsSchema.id, postId)).returning({ deletedTitle: postsSchema.title });

                return { success: true, deletedPost };

            } catch (error) {
                console.error(error);
                return { message: "An unexpected error occurred." };
            }
        }
    }),
    getFriendsPosts: defineAction({
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

                if (user.id !== userId) {
                    throw new ActionError({ code: 'FORBIDDEN' });
                }

                const friendsPostsData = await db
                    .select({
                        post: postsSchema,
                        author: {
                            id: users.id,
                            name: users.name,
                            image: users.profilePicture,
                        },
                    })
                    .from(postsSchema)
                    .innerJoin(users, eq(postsSchema.userId, users.id))
                    .innerJoin(
                        friends,
                        and(
                            eq(friends.status, "accepted"),
                            or(
                                eq(friends.respondentId, postsSchema.userId),
                                eq(friends.requesterId, postsSchema.userId)
                            ),
                            or(
                                eq(friends.respondentId, userId),
                                eq(friends.requesterId, userId)
                            )
                        )
                    )
                    .where(not(eq(postsSchema.userId, userId)))
                    .orderBy(desc(postsSchema.createdAt));

                return { success: true, friendsPostsData };
            } catch (error) {
                console.error(error);
                return { message: "An unexpected error occurred." };
            }
        }
    })
};