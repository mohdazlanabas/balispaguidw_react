# Repository Guidelines

## Project Structure & Module Organization
- Root scripts in `package.json` orchestrate both stacks; backend lives in `backend/` (Express server, CSV data in `bsg_spas.csv`), frontend in `frontend/` (React + Vite under `src/`).
- Frontend pages reside in `frontend/src/pages/`, shared UI in `frontend/src/components/`, global styles in `frontend/src/styles.css`, and cart context in `frontend/src/context/`.
- Backend logic is centered in `backend/server.js` with helper data utilities in `backend/spaData.js`; keep new helpers colocated with the server.
- Deployment notes live in `references/` and `DEPLOYMENT.md`; update them when workflow changes.

## Build, Test, and Development Commands
- `npm run install:all` — install backend and frontend dependencies in one step.
- `npm run dev:backend` / `npm run dev:frontend` — run servers separately; recommended for iterative development.
- `npm run dev` — start backend and frontend together from the root.
- `npm --prefix backend start` — launch the Express server for production-like checks.
- `npm --prefix frontend run build` — create a production-ready frontend bundle; follow with `npm --prefix frontend run preview` to spot-check.

## Coding Style & Naming Conventions
- Use modern JavaScript/React patterns (functional components, hooks, descriptive props). Prefer 2-space indentation and single quotes for strings to mirror existing files.
- Name React components in `PascalCase` and helper modules/utilities in `camelCase`. Keep file names aligned with component names (e.g., `SpaCard.jsx`).
- Keep CSS custom properties centralized in `styles.css`; prefer utility classes over inline styles.
- Avoid inline comments for behavior; favor small, self-explanatory functions.

## Testing Guidelines
- No automated tests are present yet; when adding, colocate component tests as `*.test.jsx` near the source and use lightweight tools such as Vitest + React Testing Library.
- Prefer rendering-focused tests that assert visible behavior (filters, cart totals, navigation) over implementation details.
- For backend additions, stub CSV reads and assert API responses with supertest-like tools in future suites.

## Commit & Pull Request Guidelines
- Use concise, imperative commit titles (e.g., "Add cart badge counter"), grouping related changes per commit.
- PRs should summarize scope, list key changes, and link related issues. Include screenshots or terminal snippets for UI or API-facing updates.
- Note any migrations or data file updates (`backend/bsg_spas.csv`) and required env/config changes when applicable.

## Security & Configuration Tips
- Do not hardcode secrets (Stripe, email, auth); prefer environment variables and document defaults in README updates.
- Be mindful of CORS changes in `backend/server.js`; ensure allowed origins match deployment hosts.
- Validate any new user input paths server-side, and keep CSV schema changes documented before rollout.
