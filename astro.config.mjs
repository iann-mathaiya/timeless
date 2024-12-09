// @ts-check
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import cloudflare from '@astrojs/cloudflare';
import { defineConfig, envField } from "astro/config";

// https://astro.build/config
export default defineConfig({
	output: 'server',
	adapter: cloudflare({
		imageService: 'cloudflare',
		platformProxy: {
		  enabled: true
		}
	  }),
	integrations: [tailwind(), react()],
	experimental: {
		svg: true,
	},
	env: {
		schema: {
			BETTER_AUTH_SECRET: envField.string({ context: "server", access: "secret" }),
		},
	},
});
