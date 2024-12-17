import { z } from "astro:schema";
import { defineAction } from "astro:actions";
import { MAX_FILE_SIZE } from "@/lib/constants";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";


export const media = {
    uploadFile: defineAction({
        input: z.object({
            file: z.instanceof(File),
        }),
        handler: async ({ file }, context) => {
            if (!file.type.startsWith('image/webp') || !file.type.startsWith('image/jpeg') || !file.type.startsWith('image/png')) {
                throw new Error('File should either be a webp, jpeg or png');
            }

            if (file.size > MAX_FILE_SIZE) {
                throw new Error('File size should be less than 10MB');
            }

            const fileBuffer = Buffer.from(await file.arrayBuffer());
            const fileName = `post-images/${file.name}`;

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
                return { success: true, fileName };
            } catch (error) {
                console.error("Error uploading to R2:", error);
                throw new Error("Failed to upload file to R2");
            }

        }
    })
};