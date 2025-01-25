import { z } from "astro:schema";
import { posts } from "@/db/schema";
import { eq, desc } from 'drizzle-orm';
import { drizzle } from "drizzle-orm/d1";
import type { FileType } from '@/lib/types';
import { MAX_FILE_SIZE } from "@/lib/constants";
import { defineAction, ActionError } from "astro:actions";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";


export const media = {
    uploadFile: defineAction({
        accept: 'form',
        input: z.object({
            file: z.instanceof(File),
        }),
        handler: async ({ file }, context) => {
            if (!file.type.startsWith("image/webp") && !file.type.startsWith("image/jpeg") && !file.type.startsWith("image/png") && !file.type.startsWith("video/mp4")) {
                throw new Error('File should either be a webp, jpeg, png or mp4 video');
            }

            if (file.size > MAX_FILE_SIZE) {
                throw new Error('File size should be less than 16MB');
            }

            const fileBuffer = Buffer.from(await file.arrayBuffer());
            const fileName = file.type.startsWith("video/mp4") ? `post-reels/${Date.now()}-${file.name}` : `post-images/${Date.now()}-${file.name}`;
            const fileType = file.type as FileType 

            const { env } = context.locals.runtime;

            const R2_BUCKET_NAME = env.BUCKET_NAME;
            const R2_ACCESS_KEY_ID = env.R2_ACCESS_KEY_ID;
            const R2_SECRET_ACCESS_KEY = env.R2_SECRET_ACCESS_KEY;
            const R2_ENDPOINT = env.CLOUDFLARE_R2_ENDPOINT;

            const s3Client = new S3Client({
                region: "auto",
                endpoint: R2_ENDPOINT,
                credentials: {
                    accessKeyId: R2_ACCESS_KEY_ID,
                    secretAccessKey: R2_SECRET_ACCESS_KEY,
                },
            });

            try {
                const command = new PutObjectCommand({
                    Bucket: R2_BUCKET_NAME,
                    Key: fileName,
                    Body: fileBuffer,
                    ContentType: file.type,
                });

                await s3Client.send(command);
                return { success: true, fileName, fileType };
            } catch (error) {
                console.error("Error uploading to R2:", error);
                throw new Error("Failed to upload file to R2");
            }

        }
    }),
    removeFile: defineAction({
        input: z.object({
            fileName: z.string(),
        }),
        handler: async ({ fileName }, context) => {
            const { env } = context.locals.runtime;

            const R2_BUCKET_NAME = env.BUCKET_NAME;
            const R2_ACCESS_KEY_ID = env.R2_ACCESS_KEY_ID;
            const R2_SECRET_ACCESS_KEY = env.R2_SECRET_ACCESS_KEY;
            const R2_ENDPOINT = env.CLOUDFLARE_R2_ENDPOINT;

            const s3Client = new S3Client({
                region: "auto",
                endpoint: R2_ENDPOINT,
                credentials: {
                    accessKeyId: R2_ACCESS_KEY_ID,
                    secretAccessKey: R2_SECRET_ACCESS_KEY,
                },
            });

            try {
                const command = new DeleteObjectCommand({
                    Bucket: R2_BUCKET_NAME,
                    Key: fileName,
                });

                await s3Client.send(command);
                return { success: true, message: `${fileName} removed successfully` };
            } catch (error) {
                console.error("Error uploading to R2:", error);
                throw new Error("Failed to upload file to R2");
            }

        }
    }),
    getSignedUrl: defineAction({
        input: z.object({
            key: z.string(),
        }),
        handler: async ({ key }, context) => {
            const { env } = context.locals.runtime;

            const R2_BUCKET_NAME = env.BUCKET_NAME;
            const R2_ACCESS_KEY_ID = env.R2_ACCESS_KEY_ID;
            const R2_SECRET_ACCESS_KEY = env.R2_SECRET_ACCESS_KEY;
            const R2_ENDPOINT = env.CLOUDFLARE_R2_ENDPOINT;

            const s3Client = new S3Client({
                region: "auto",
                endpoint: R2_ENDPOINT,
                credentials: {
                    accessKeyId: R2_ACCESS_KEY_ID,
                    secretAccessKey: R2_SECRET_ACCESS_KEY,
                },
            });

            try {
                const command = new GetObjectCommand({
                    Bucket: R2_BUCKET_NAME,
                    Key: key,
                });

                // Generate a signed URL valid for 3 hours
                const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 * 3 });
                return { success: true, signedUrl };
            } catch (error) {
                console.error("Failed to generate signed URL:", error);
                throw new Error("Unable to access the file.");
            }
        }
    }),
    getUserMedia: defineAction({
        input: z.object({
            userId: z.string(),
        }),
        handler: async ({ userId }, context) => {
            const { env } = context.locals.runtime;
            const db = drizzle(env.ARS_DB);

            const user = context.locals.user

            try {
                if (!user) {
                    throw new ActionError({ code: 'UNAUTHORIZED' });
                }
                
                if(user.id !== userId){
                    throw new ActionError({code: 'FORBIDDEN'})
                }

                type UserMedia = { [x: string]: unknown; }[]

                const userMedia: UserMedia = await db.select({ 
                    mediaData: posts.media,
                    createdAt: posts.createdAt
                }).from(posts).where(eq(posts.userId, user.id)).orderBy(desc(posts.createdAt));

                return { success: true, userMedia };
            } catch (error) {
                console.error(error);
                return { message: "An unexpected error occurred." };
            }
        }
    })
};