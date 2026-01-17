import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('URL Shortener', () => {
	it('redirects "gh" to GitHub', async () => {
		const request = new IncomingRequest('http://example.com/gh');
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(302);
		expect(response.headers.get('Location')).toBe('https://github.com/aj8k');
	});

	it('redirects with / at the end', async () => {
		const request = new IncomingRequest('http://example.com/gh/');
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(302);
		expect(response.headers.get('Location')).toBe('https://github.com/aj8k');
	});

	it('redirects non-existent path to 404', async () => {
		const request = new IncomingRequest('http://example.com/ghrandompaththatdoesnotexist');
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(404);
		expect(response.headers.get('Content-Type')).toBe('text/html;charset=UTF-8');
		expect(await response.text()).toContain('<h1>404</h1>');
	});

	it('redirects root path to homepage', async () => {
		const request = new IncomingRequest('http://example.com');
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(302);
		expect(response.headers.get('Location')).toBe('https://antonjoy.com/');
	});

	it('returns robots.txt from assets', async () => {
		const response = await SELF.fetch('http://example.com/robots.txt');

		expect(response.status).toBe(200);
		expect(response.headers.get('Content-Type')).toContain('text/plain');

		const text = await response.text();
		expect(text).toContain('User-agent: *');
		expect(text).toContain('Disallow: /');
	});
});
