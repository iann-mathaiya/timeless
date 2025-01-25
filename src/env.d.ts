
/// <reference path="../.astro/types.d.ts" />

type Runtime = import('@astrojs/cloudflare').Runtime<Env>


type User = {
    id: string;
    name: string;
    email: string;
    lastName?: string | null; 
    emailIsVerified: number;
    firstName?: string | null;
    providerId?: string | null;
    refreshToken?: string | null;
    profilePicture?: string | null;
    providerUserId?: string | null;
    role: 'user' | 'admin' | 'member' | string;
 };

type Session = {
    id: string;
    expiresAt: number;
    userId: string;
    createdAt: Date;
 };

declare namespace App {
    // Note: 'import {} from ""' syntax does not work in .d.ts files.
    interface Locals extends Runtime {
        user: User | null
        session: Session | null
        db: ReturnType<typeof import('./src/db').createD1Connection>
        auth: ReturnType<typeof import('./src/lib/auth').createAuthWithD1>
        DB: D1Database
    }
}

interface ImportMetaEnv {
    readonly DB: D1Database
    readonly BETTER_AUTH_SECRET: string
    readonly CLOUDFLARE_API_TOKEN: string
    readonly CLOUDFLARE_ACCOUNT_ID: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}