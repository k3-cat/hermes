import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import appManifest from "./public/webmanifest.json";

export default defineConfig({
	plugins: [
		devtools(),
		tailwindcss(),
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
			quoteStyle: "double",
		}),
		react(),
		VitePWA({
			registerType: "autoUpdate",
			// @ts-expect-error: TS2322
			manifest: appManifest,
			pwaAssets: {
				overrideManifestIcons: true,
			},
		}),
	],
	resolve: {
		tsconfigPaths: true,
	},
	build: {
		copyPublicDir: false,
	},
});
