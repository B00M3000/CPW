import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

import path from 'path';

export default defineConfig({
	plugins: [sveltekit()],

	resolve: {
		alias: {
			'@': path.resolve('src'),
			'@static': path.resolve('static'),
			'@client': path.resolve('src/client'),
			'@interfaces': path.resolve('src/interfaces'),
		},
	},

	server: {
		port: 3000,
	},
});