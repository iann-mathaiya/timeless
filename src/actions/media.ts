import { z } from "astro:schema";
import { defineAction } from "astro:actions";
import { MAX_FILE_SIZE } from "@/lib/constants";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";


export const media = {
    uploadFile: defineAction({
        accept: 'form',
        input: z.object({
            file: z.instanceof(File),
        }),
        handler: async ({ file }, context) => {

            console.log('file-type', file.type);

            if (!file.type.startsWith("image/webp") && !file.type.startsWith("image/jpeg") && !file.type.startsWith("image/png")) {
                throw new Error('File should either be a webp, jpeg or png');
            }

            if (file.size > MAX_FILE_SIZE) {
                throw new Error('File size should be less than 10MB');
            }

            const fileBuffer = Buffer.from(await file.arrayBuffer());
            const fileName = `post-images/${Date.now()}-${file.name}`;

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
    })
};