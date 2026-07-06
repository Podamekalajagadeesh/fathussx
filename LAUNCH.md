Launch readiness checklist

This checklist collects the minimum steps to prepare the project for production launch.

Pre-launch verification
- Ensure environment variables and secrets are configured in production (DATABASE_URL, JWT_SECRET, STRIPE keys, OAuth client secrets).
-- Run DB migrations and seed data: `node db/reset-db.js` (or your migration tooling). Migrations may live in `backend/db/migrations` in this repo.
- Run backend tests: `cd backend && npm test`.
- Run frontend lint and build: `cd frontend && npm run lint && npm run build`.
- Run security audits and address high/moderate findings: `npm audit`.

Operational readiness
- Add CI/CD pipeline (see `.github/workflows/ci.yml`).
- Configure production DB user and grant proper privileges.
- Configure logging, error monitoring, and backups.
- Prepare deployment scripts or container manifests.

Post-launch
- Monitor errors and performance.
- Run smoke tests after deployment.

Notes
- Address the remaining items in the repo TODO list before production: upgrade vulnerable dependencies, fix react-refresh warnings, and resolve any `todo` migration flags.

Minimal Launch Steps
- [ ] Run backend tests
	- Commands:
		- `cd backend`
		- `npm install`
		- `npm test`
- [ ] Build frontend
	- Commands:
		- `cd frontend`
		- `npm install`
		- `npm run build`
- [ ] Perform smoke launch (local)
	- Commands:
		- Start backend: `cd backend && npm start`
		- Start frontend preview: `cd frontend && npm run preview`
		- Verify core flows: login, create content, messaging, payments (if configured)

Quick automated check
- Run the automated readiness checker: `npm run check-launch` from the repository root. The script now also runs backend tests and attempts a frontend build when their scripts are present. It reports failures and suggests the commands to run locally.

What `npm run check-launch` does now
- Verifies presence of `backend` and `frontend` package files and entry points.
- Confirms `.env` or `.env.example` exists for each side.
- Checks for migration files under `db/migrations` or `backend/db/migrations`.
- Ensures `start`/`dev`/`build` scripts are defined in `package.json`.
- Checks that `node_modules` are installed for both packages.
- Runs `npm test --prefix backend` if a backend `test` script exists; failures are reported.
- Runs `npm run build --prefix frontend` if a frontend `build` script exists; failures are reported.

If the automated checker reports failures, run the suggested commands and fix the errors, then re-run `npm run check-launch`.
