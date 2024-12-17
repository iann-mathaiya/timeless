import { defineAction } from "astro:actions";
import { z } from 'astro:schema';

export const posts = {
    createPost: defineAction({
        accept: 'form',
        input: z.object({
            title: z.string(),
            imageIds: z.string().array(),
            description: z.string().optional(),
        }),
        handler: async ({ title, description, imageIds }, context) => {
            console.log({title, description, imageIds});
        }
    })
};