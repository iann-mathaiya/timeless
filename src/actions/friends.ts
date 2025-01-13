import { z } from 'astro:schema';
import { ActionError, defineAction } from "astro:actions";
import { drizzle } from 'drizzle-orm/d1';
import { auth } from '@/lib/auth';
import { users, type User, friends as friendsSchema } from '@/db/schema';
import { and, eq, like, not, or } from 'drizzle-orm';


export const friends = {
    sendFriendRequest: defineAction({
        input: z.object({
            userId: z.string(),
            friendId: z.string(),
        }),
        handler: async ({ userId, friendId }, context) => {
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

                const friendRequestData = await db.insert(friendsSchema).values({
                    id: crypto.randomUUID(),
                    userId: userId,
                    friendId: friendId,
                    status: "pending",
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                return { success: true, friendRequestData };
            } catch (error) {
                console.error(error);
                return { message: "An unexpected error occurred." };
            }
        }
    }),
    searchFriend: defineAction({
        input: z.object({
            userId: z.string(),
            keyword: z.string(),
        }),
        handler: async ({ keyword, userId }, context) => {
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

                const searchKeyword = `%${keyword}%`; // Use SQL wildcards for partial matching

                const matchingUsers = await db.select().from(users)
                    .where(
                        and(
                            or(like(users.email, searchKeyword), like(users.name, searchKeyword)),
                            not(eq(users.id, user.id))
                        )
                    ) as User[];

                return { success: true, matchingUsers };
            } catch (error) {
                console.error(error);
                return { success: false, message: "An unexpected error occurred." };
            }
        }
    }),
};