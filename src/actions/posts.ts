import { z } from 'astro:schema';
import { defineAction } from "astro:actions";

export const posts = {
    createPost: defineAction({
        accept: 'form',
        input: z.object({
            title: z.string(),
            description: z.string().optional(),
            file1: z.instanceof(File),
            file2: z.instanceof(File).optional(),
            file3: z.instanceof(File).optional()
        }),
        handler: async (input, context) => {
            console.log(input);
        }
    })
};