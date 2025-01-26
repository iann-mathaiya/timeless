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
	integrations: [ react(), tailwind({applyBaseStyles: false}) ],
	experimental: { svg: true },
	security: { checkOrigin: true },
	vite: {
		define: { "process.env" : process.env },
		resolve: {
		  // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
		  // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
		  alias: import.meta.env.PROD ? { "react-dom/server": "react-dom/server.edge" } : undefined
		},
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
