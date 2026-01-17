export function handle404(): Response {
	return new Response(
		`<!DOCTYPE html>
  <html>
    <head><title>404 - Not Found</title></head>
    <body style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #000; color: #fff;">
      <h1>404</h1>
      <p>This link does not exist.</p>
      <a href="https://antonjoy.com" style="color: #fff; border: 1px solid #fff; padding: 10px 20px; text-decoration: none;">Go to antonjoy.com</a>
    </body>
  </html>`,
		{
			status: 404,
			headers: { 'Content-Type': 'text/html;charset=UTF-8' },
		},
	);
}
