import { Hono } from "hono";
import { streamText } from "hono/streaming";
import { events } from 'fetch-event-stream';


const app = new Hono<{Bindings: Env}>();

app.post("/api/etymology", async(c) => {
	const payload = await c.req.json();
	const eventStream = await c.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
		messages:[
			{role: "system", content: `You are an etymologist.
			The user is going to give you a word, and you should explain it's history and roots.
			If you aren't sure let them know and encourage them to check the spelling.
			Express your love for language. Keep things succint.
			`},
			{role: "user", content: payload.word}
		],
		stream: true
	});
	return streamText(c, async (stream) => {
		const chunks = events(new Response(eventStream as ReadableStream));
		for await (const chunk of chunks) {
			if (chunk.data !== undefined && chunk.data !== '[DONE]') {
				const data = JSON.parse(chunk.data);
				stream.write(data.response);
			}
		}
	})
});

export default app;
