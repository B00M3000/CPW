/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { readFileSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config()

const pkgJSON = JSON.parse(readFileSync(path.join(__dirname, "package.json"), 'utf8'));

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

	define: { pkgJSON },

	server: {
		port: process.env.PORT ? parseInt(process.env.PORT) : 80,
	},

	build: {
        chunkSizeWarningLimit: 1600,
    },
});