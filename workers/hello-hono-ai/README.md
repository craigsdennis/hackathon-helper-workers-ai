# Hello Hono AI

This starter uses the incredible [Hono](https://hono.dev) framework 🔥 in Workers application to show off some streaming approaches

```bash
# Install dependencies
npm install
# Run dev server
npm run dev
# Deploy to Region: Earth
npm run deploy
```

## Server Sent Events (SSE) - EventSource

Adding `stream: true` to your `AI.run` call returns Server Sent Events. You can consume these using the [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) interface.

```bash
# Change to your deployed project name
curl http://your-project.workers.dev/stream-event-source
```

## Stream Text

This shows off the `streamText` Hono helper.

```bash
# Change to your deployed project name
# -N parameter allows for no buffering in curl
curl http://your-project.workers.dev/stream-text -N
```
