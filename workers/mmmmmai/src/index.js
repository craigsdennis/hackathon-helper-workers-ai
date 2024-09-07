import { Hono } from 'hono';

const app = new Hono();

app.get('/', async (c) => {
	const response = await c.env.AI.run('@cf/meta/llama-3-8b-instruct', {
		messages: [{ role: 'user', content: 'Give me useless recipes' }],
	});
	return c.json(response);
});

export default app;
