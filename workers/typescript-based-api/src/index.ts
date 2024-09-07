import { Hono } from 'hono';
import { streamText } from 'hono/streaming';
import { events } from 'fetch-event-stream';

const app = new Hono<{ Bindings: Env }>();

app.post('/api/etymology', async (c) => {
	const payload = await c.req.json();
	const eventStream = await c.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
		messages: [
			{
				role: 'system',
				content: `You give bad recipes. The user is going to input ingredients, and you are going to provide the worst recipe ever. Include the calories and nutrients of the dish. Unsuccessfully attempt to hide that this is a bad recipe.
			`,
			},
			{ role: 'user', content: payload.word },
		],
		stream: true,
	});
	return streamText(c, async (stream) => {
		const chunks = events(new Response(eventStream as ReadableStream));
		for await (const chunk of chunks) {
			if (chunk.data !== undefined && chunk.data !== '[DONE]') {
				const data = JSON.parse(chunk.data);
				stream.write(data.response);
			}
		}
	});
});

export default app;
