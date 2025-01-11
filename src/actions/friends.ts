import { z } from 'astro:schema';
import { defineAction } from "astro:actions";

export const friends = {
    sendFriendRequest: defineAction({
        input: z.object({
            userId: z.string(),
            friendId: z.string(),
        }),
        handler: async ({ userId, friendId }, context) => {

        }
    })
};