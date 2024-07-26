import { Hono } from 'hono';
import { streamText } from 'hono/streaming';
import { events } from 'fetch-event-stream';

const app = new Hono();

app.get('/', async(c) => {
	return c.html(`<html>
	<head>
		<title>Hello Hono Examples</title>
	</head>
	<body>
		<ul>
			<li><a href="/standard">Standard AI usage</a></li>
			<li><a href="/stream-event-source">Streaming - EventSource</a></li>
			<li><a href="/stream-text">Streaming - Text</a></li>
		</ul>
	</body>
	</html>`);
})

app.get('/standard', async (c) => {
	const msg = c.req.query('msg') || 'I am so going to win';
	const result = await c.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
		messages: [
			{ role: 'system', content: 'You are a poet. Every response should rhyme with what the user said' },
			{ role: 'user', content: msg },
		],
	});
	return c.json(result);
});

app.get('/stream-event-source', async (c) => {
	const msg = c.req.query('msg') || 'Can you explain RLHF?';
	const eventSourceStream = await c.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
		messages: [
			{
				role: 'system',
				content: 'You love tacos. Anything the user says, you make analogies regarding tacos.',
			},
			{ role: 'user', content: msg },
		],
		stream: true,
	});
	return new Response(eventSourceStream, {
		headers: {
			'Content-Type': 'text/event-stream',
		},
	});
});

app.get('/stream-text', async (c) => {
	const msg = c.req.query('msg') || 'What is the meaning of life?';
	const eventSourceStream = await c.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
		messages: [
			{
				role: 'system',
				content:
					'You are psychadelic man. Everything you say is a stream of consciousness, like a great beat poet. Respond to the user in a long drawn out bizarre way',
			},
			{ role: 'user', content: msg },
		],
		stream: true,
	});
	return streamText(c, async (stream) => {
		const chunks = events(new Response(eventSourceStream));
		for await (const chunk of chunks) {
			if (chunk.data !== '[DONE]') {
				const data = JSON.parse(chunk.data);
				stream.write(data.response);
			}
		}
	});
});

export default app;
