// @ts-check
import react from "@astrojs/react"
import tailwind from "@astrojs/tailwind"
import cloudflare from '@astrojs/cloudflare'
import { defineConfig, envField } from "astro/config"

// https://astro.build/config
export default defineConfig({
	output: 'server',
	adapter: cloudflare({
		imageService: 'cloudflare',
		platformProxy: {
			enabled: true
		}
	}),
	integrations: [
		react(),
		tailwind({
			applyBaseStyles: false,
		})],
	experimental: {
		svg: true,
	},
	security: {
		checkOrigin: true
	},
	env: {
		schema: {
			DB: envField.string({ context: "server", access: "secret" }),
			BETTER_AUTH_SECRET: envField.string({ context: "server", access: "secret" }),
			GOOGLE_CLIENT_ID: envField.string({ context: "server", access: "secret" }),
			GOOGLE_CLIENT_SECRET: envField.string({ context: "server", access: "secret" }),
			CLOUDFLARE_API_TOKEN: envField.string({ context: "server", access: "secret" }),
			CLOUDFLARE_ACCOUNT_ID: envField.string({ context: "server", access: "secret" }),
		},
	},
})
