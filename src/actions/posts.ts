import { defineAction } from "astro:actions";
import { z } from 'astro:schema';

export const posts = {
    createPost: defineAction({
        input: z.object({
            title: z.string(),
            description: z.string().optional(),
            imageIds: z.string().array().optional(),
        }),
        handler: async(input, context) => {
            console.log(input, context)
        }
    })
}