# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/9b554f1b-db5c-442b-9cb5-4c52ccb0fd85

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/9b554f1b-db5c-442b-9cb5-4c52ccb0fd85) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## AI Voice Command Parsing (OpenRouter)

The app can parse natural language voice commands into structured device actions.

Modes:

1. Local heuristic simulation (default) – pattern matching only (no network required).
2. OpenRouter AI parsing – uses an LLM via the OpenAI SDK for more flexible interpretation.

### Enable OpenRouter

1. Copy `.env.example` to `.env`.
2. Add your OpenRouter API key (find it in your OpenRouter dashboard):

```
VITE_OPENROUTER_KEY=sk-or-v1-...
# Optional (default: anthropic/claude-3.5-sonnet)
VITE_OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
```

3. Restart the dev server: `npm run dev`.

When the key is present, the hook `useVoiceCommands` tries AI parsing first; if that fails (network/model error) it falls back to the local simulation seamlessly.

### IMPORTANT SECURITY NOTE

Putting a raw API key in a purely client-side app exposes it to users. For production you should proxy requests through a backend (server, serverless function, edge worker) that keeps the secret key private and adds any rate limiting / abuse protection. This direct approach is for prototyping only.

### Implementation Overview

- `src/lib/aiClient.ts` configures the OpenAI SDK with `baseURL = https://openrouter.ai/api/v1`.
- `parseVoiceCommand()` sends a chat completion with a structured system prompt requesting strict JSON.
- `src/hooks/useVoiceCommands.ts` invokes `parseVoiceCommand()` when `VITE_OPENROUTER_KEY` exists; otherwise uses a regex-based fallback.
- Returned JSON: `{ item, state, room?, confidence? }` (room omitted if not mentioned).

### Changing the Model

Set `VITE_OPENROUTER_MODEL` to any supported OpenRouter model slug (e.g. `openai/gpt-4.1-mini`, `mistralai/mistral-large`). The prompt is model-agnostic but you can tune it inside `aiClient.ts`.

### Error Handling

- Missing key -> throws early, hook catches and falls back.
- Malformed / non-JSON output -> error triggers fallback.
- Network / rate limit issues -> same fallback path.

## Device Control Calls

After a command is parsed, the hook will attempt to call a local device endpoint constructed as:

```
<VITE_DEVICE_API_BASE>/<Item>/<State>
```

Defaults (if env not set): `VITE_DEVICE_API_BASE = http://192.168.0.3:8000`

Transformation rules:

- Spaces in `item` or `state` become `-`.
- Raw values used (case preserved for state except spaces removed).
- Example: `Lights` + `off` -> `http://192.168.0.3:8000/Lights/off`

Configure in `.env`:

```
VITE_DEVICE_API_BASE=http://192.168.0.3:8000
```

Failures in the fetch will surface a destructive toast but won't abort command parsing.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/9b554f1b-db5c-442b-9cb5-4c52ccb0fd85) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
