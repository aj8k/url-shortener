/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { redirects, DEFAULT_REDIRECT } from './redirects';
import { handle404 } from './404';

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === '/') {
			return Response.redirect(DEFAULT_REDIRECT, 302);
		}

		const match = url.pathname.match(/^\/([a-zA-Z0-9_-]+)\/?$/);
		if (match) {
			const target = redirects[match[1]];
			if (target) {
				return Response.redirect(target, 302);
			}
		}

		return handle404();
	},
} satisfies ExportedHandler<Env>;
