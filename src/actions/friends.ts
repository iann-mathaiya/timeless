import { z } from 'astro:schema';
import { auth } from '@/lib/auth';
import { drizzle } from 'drizzle-orm/d1';
import type { MatchingUser, PendingFriendRequest } from '@/lib/types';
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
                    image: users.profilePicture,
                    friendshipStatus: friendsSchema.status,
                    isRequester: sql<boolean>`${friendsSchema.requesterId} = ${user.id}`
                }).from(users)
                    .leftJoin(
                        friendsSchema,
                        or(
                            and(
                                eq(friendsSchema.requesterId, user.id),
                                eq(friendsSchema.respondentId, users.id)
                            ),
                            and(
                                eq(friendsSchema.respondentId, user.id),
                                eq(friendsSchema.requesterId, users.id)
                            )
                        )
                    )
                    .where(
                        and(
                            or(like(users.email, searchKeyword), like(users.name, searchKeyword)),
                            not(eq(users.id, user.id))
                        )
                    ) as unknown as MatchingUser[];

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
            requestedfriendId: z.string(),
        }),
        handler: async ({ userId, requestedfriendId }, context) => {
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
                    requesterId: userId,
                    respondentId: requestedfriendId,
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
    getFriendReqests: defineAction({
        input: z.object({
            userId: z.string(),
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

                const pendingRequests = await db.select({
                    id: friendsSchema.id,
                    status: friendsSchema.status,
                    createdAt: friendsSchema.createdAt,
                    requester: { id: users.id, name: users.name, email: users.email, image: users.profilePicture },
                })
                    .from(friendsSchema)
                    .innerJoin(users, eq(users.id, friendsSchema.requesterId))
                    .where(
                        and(
                            eq(friendsSchema.respondentId, userId),
                            eq(friendsSchema.status, 'pending')
                        )
                    ) as unknown as PendingFriendRequest[];

                return { success: true, pendingRequests };
            } catch (error) {
                console.error(error);
                return { message: "An unexpected error occurred." };
            }
        }
    }),
    acceptFriendRequest: defineAction({
        input: z.object({
            respondentId: z.string(),
            requesterId: z.string(),
        }),
        handler: async ({ respondentId, requesterId }, context) => {
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

                if (user.id !== respondentId) {
                    throw new ActionError({ code: 'FORBIDDEN' });
                }

                const friendRequestData = await db.update(friendsSchema).set({status: 'accepted'}).where(
                    and(
                        eq(friendsSchema.respondentId, respondentId),
                        eq(friendsSchema.requesterId, requesterId)
                    )
                )

                return { success: true, friendRequestData };
            } catch (error) {
                console.error(error);
                return { message: "An unexpected error occurred." };
            }
        }
    })

};