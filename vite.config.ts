import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		sveltekit(),
		VitePWA
		({	registerType: 'autoUpdate',
			injectRegister: 'auto',
			workbox:
			{	globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
			},
			manifest:
			{	name: 'KHLUG PWA',
				short_name: 'KHLUG',
				description: 'Try KHLUG as PWA',
				theme_color: '#54bae9',
				icons:
				[{	src: "", // TODO
					sizes: '192x192',
					type: 'image/png'
				},
				{	src: "", // TODO
					sizes: '512x512',
					type: 'image/png'
				}
				]
			}
		})
	]
});

