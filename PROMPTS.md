# PROMPTS

This file records the AI prompts used during development and for common tasks. Keep these as a reference when using AI assistance to modify or extend the project.

## Prompts used for this task (creation of README & PROMPTS files)

- Date: 2026-01-15
- Author: Developer (via AI assistant)
- Prompt: "Include a README.md file with project documentation and clear running instructions to try out components (either locally or via deployed link). AI-assisted coding is encouraged, but you must include AI prompts used in PROMPTS.md"

- Assistant generation prompt (internal):

"Create a README.md for a Vite + React + Cloudflare Workers project named 'archaid'. Include sections: What you'll find, Requirements, Quick start (local dev), Run tests, Build and deploy to Cloudflare Workers (wrangler), Trying specific components, Environment & Secrets, Useful scripts, Contributing, License. Provide Windows-friendly commands and mention `npm run dev`, `npm run deploy`, and `npx wrangler login`. Keep it concise. Also create PROMPTS.md recording AI prompts used."

## Prompt history (project timeline)

- 2026-01-15 — User: "Include a README.md file with project documentation and clear running instructions to try out components (either locally or via deployed link). AI-assisted coding is encouraged, but you must include AI prompts used in PROMPTS.md"

- 2026-01-15 — Assistant (internal generation): "Create a README.md for a Vite + React + Cloudflare Workers project named 'archaid'... (see above)"

- 2026-01-15 — User: "add https://archaid.supriyakotturu.workers.dev/ for a demo version of the deployed project in README.md. PROMPTS.md should have the histroy of promts used for this project"


## Example prompts you can reuse when working on this repo

- Add a new demo page for a component:

"Create a demo page at `src/demos/<component>.tsx` that imports and renders `src/components/<component>/index.tsx`. Add a dev-only route so the Vite dev server serves it at `/demo/<component>`. Provide minimal styling and example props."

- Improve accessibility for a component:

"Audit `src/components/button/Button.tsx` and update it to be fully accessible: keyboard focus styles, ARIA roles if needed, semantic button element, and unit tests verifying keyboard activation. Keep styling consistent with Tailwind utilities present in the project."

- Create unit tests for a component with Vitest:

"Write unit tests for `src/components/avatar/Avatar.tsx` using Vitest and React Testing Library that verify rendering of fallback initials, image load, and alt text. Add tests under `src/components/avatar/__tests__/`."

## Amazon Q

- 2025-01-16 — User: "Please explain the following problems in d:\vs-code-workspace\archaid\src\server.ts. DO NOT edit files. ONLY provide explanation: **src\server.ts** [ts] Line 8: Cannot find module 'ai/openai/client/createOpenAI' or its corresponding type declarations."

- 2025-01-16 — Assistant: Explained that the import path 'ai/openai/client/createOpenAI' is incorrect and should use '@ai-sdk/openai' package instead, importing 'openai' function directly rather than 'createOpenAI'.

- 2025-01-16 — User: "add the previous used prompts in the project to the PROMPTS.md with Amazon Q as subheading. The existing prompts in the file are from Github copilot"

- 2025-01-16 — User: "include the date when the prompt was used. Not the date when the prompt is added to the file"

## Notes

- Store any sensitive prompts that contain secrets out of the repo.
- Update this file whenever AI-assisted changes are made so the audit trail remains accurate.
