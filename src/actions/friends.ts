import { z } from 'astro:schema';
import { auth } from '@/lib/auth';
import { drizzle } from 'drizzle-orm/d1';
import type { MatchingUser } from '@/lib/types';
import { and, eq, like, not, or, sql } from 'drizzle-orm';
import { ActionError, defineAction } from "astro:actions";
import { users, friends as friendsSchema, type Friend } from '@/db/schema';


export const friends = {
    searchUser: defineAction({
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

                const matchingUsers = await db.select({
                    id: users.id,
                    name: users.name,
                    email: users.email,
                    image: users.image,
                    friendshipStatus: friendsSchema.status,
                    isRequester: sql<boolean>`${friendsSchema.userId} = ${user.id}`
                }).from(users)
                    .leftJoin(
                        friendsSchema,
                        or(
                            and(
                                eq(friendsSchema.userId, user.id),
                                eq(friendsSchema.friendId, users.id)
                            ),
                            and(
                                eq(friendsSchema.friendId, user.id),
                                eq(friendsSchema.userId, users.id)
                            )
                        )
                    )
                    .where(
                        and(
                            or(like(users.email, searchKeyword), like(users.name, searchKeyword)),
                            not(eq(users.id, user.id))
                        )
                    ) as unknown as MatchingUser[]

                return { success: true, matchingUsers };
            } catch (error) {
                console.error(error);
                return { success: false, message: "An unexpected error occurred." };
            }
        }
    }),
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
    })

};