# Archaid

> A minimal Cloudflare + React starter for AI-assisted architecting tools.

This repository contains a Vite + React frontend and a Cloudflare Worker backend powered by Cloudflare AI and Durable Objects. It is intended as a developer playground for the `archaid` project components in `src/components`.

## What you'll find

- `src/` — React app and server entry (`client.tsx`, `app.tsx`, `server.ts`).
- `src/components/` — UI components (buttons, avatars, cards, tool-invocation UI, etc.).
- `public/` — static assets served by the Worker when deployed.
- `wrangler.jsonc` — Cloudflare Worker configuration (entrypoint: `src/server.ts`).
- `package.json` — scripts for local dev, test and deploy.

## Requirements

- Node.js 18+ (LTS recommended)
- npm (or pnpm/yarn)
- (Optional, for deployment) Cloudflare account and `wrangler` configured

## Quick start (local development)

1. Install dependencies

```bash
# Windows
npm install
```

2. Start the dev server (Vite)

```bash
npm run dev
```

3. Open the app in your browser:

http://localhost:5173

The app entry is `src/client.tsx` and `src/app.tsx`. The dev server auto-reloads when you edit components in `src/components/`.

## Live demo

A deployed demo is available at:

https://archaid.supriyakotturu.workers.dev/

## Run tests

```bash
npm test
```

## Build and deploy to Cloudflare Workers

This project uses Wrangler for deployment. Before deploying, make sure you are logged in and have your Cloudflare account configured.

1. (Optional) Generate TypeScript types for Worker bindings

```bash
npm run types
```

2. Log in to Cloudflare (if needed)

```bash
npx wrangler login
```

3. Deploy

```bash
npm run deploy
```

Notes:

- `npm run deploy` runs `vite build && wrangler deploy` (see `package.json`).
- Use `wrangler secret put <NAME>` to add secrets (API keys, tokens) referenced by your Worker.

## Trying specific components

You can preview and iterate on any component by importing it into `src/app.tsx` or creating a small test page under `src/` that renders the component. Example workflow:

1. Edit or create a demo route/component that imports `src/components/button/Button.tsx`.
2. Run `npm run dev` and view the page.

If you'd like, I can add small demo pages for specific components (Avatar, Button, Modal) and show how to wire them into the app.

## Environment & Secrets

- Secrets and sensitive config (Cloudflare API tokens, AI service tokens) should be stored with Wrangler secrets or environment variables — do not commit them to the repo.

## Useful scripts

- `npm run dev` — start Vite dev server
- `npm run start` — alias for dev
- `npm run deploy` — build + deploy with Wrangler
- `npm test` — run unit tests (Vitest)
- `npm run types` — emit `env.d.ts` worker types

## Contributing

Contributions are welcome. Open an issue or a PR. Please follow the existing code style and run `npm run format` before committing.

## License

MIT
