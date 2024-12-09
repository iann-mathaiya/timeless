
/// <reference path="../.astro/types.d.ts" />

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
    // Note: 'import {} from ""' syntax does not work in .d.ts files.
    interface Locals extends Runtime {
        user: import("better-auth").User | null
        session: import("better-auth").Session | null
        db: ReturnType<typeof import('./src/db').createD1Connection>
        auth: ReturnType<typeof import('./src/lib/auth').createAuthWithD1>
        DB: D1Database
    }
}

interface ImportMetaEnv {
    readonly BETTER_AUTH_SECRET: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}