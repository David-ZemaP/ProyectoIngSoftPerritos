This repository is a small client-side web app scaffolded from "parcel-jest-base" used for TDD exercises in an engineering course.

Quick context for an AI coding agent:

- Language/environment: Vanilla ES modules ("type": "module" in package.json), built with Parcel. Tests are run with Jest and Cypress for E2E.
- Entry points: `index.html` (root app), plus feature pages under `src/*/` such as `src/Search_for_pet/index.html` and `src/Register_Pet/Register.html`.
- UI pattern: simple DOM-driven presenters in `src/*/presenter*.js` that wire DOM events to small business-logic modules (e.g. `src/Search_for_pet/search.js`, `src/Register_Pet/register.js`).

What to change and where (common tasks):

- Add small UI features or fix behaviours: update the corresponding `presenter*.js` file in the feature folder (e.g. `src/Search_for_pet/presenterSearch.js`). Keep DOM queries by id/class consistent with the feature HTML.
- Update business logic / pure functions: edit the module under the same feature (e.g. `src/Search_for_pet/search.js` or `src/Register_Pet/register.js`). These modules return simple values or throw errors to indicate outcomes (see examples below).
- Tests: Unit tests are driven by the custom TDD script `script/tddScript.js` which runs `jest` and writes reports to `./script/report.json`. E2E tests live in `cypress/e2e/` and use the local dev server.

Key commands (package.json):

- Install dependencies: `npm install`
- Start dev server (Parcel): `npm start` (serves `index.html` at default Parcel port; some Cypress tests expect `http://localhost:1234`)
- Run tests (TDD runner that calls jest): `npm test` (invokes `node ./script/tddScript.js`)
- Open Cypress UI: `npm run cypress` ; Run Cypress headless: `npm run cypress-run`

Project-specific conventions and patterns:

- Presenters initialize on DOMContentLoaded and wire DOM -> business logic. Example: `src/Register_Pet/presenterRegister.js` collects form values, validates them, calls `register.js`, and uses `displayMessage.js` for user feedback.
- Business logic modules are intentionally minimal and synchronous. In `src/Search_for_pet/search.js` the function returns a string or throws Error objects with messages like `"¡Mascota Encontrada por nombre!"` — callers expect either a return value or an exception to indicate found/not-found outcomes.
- UI helpers: view-specific helper files exist (e.g. `RegisterView.js`) — prefer using these when available to keep presenters thin.

Integration notes and gotchas:

- Parcel dev server default port used in tests: Cypress tests reference `http://localhost:1234/search.html` in `src/Search_for_pet/search.cy.js`. Make sure `npm start` serves on that port or update tests accordingly.
- TDD runner writes `./script/report.json` and appends a summary to `script/tdd_log.json`. Avoid changing those file paths unless you update `script/tddScript.js`.
- Some modules throw Errors to signal business outcomes (see `src/Search_for_pet/search.js`). When modifying these modules, preserve the contract (throw strings/errors with the same messages) or update callers and tests together.

Files you will likely edit for common requests:

- Add/fix search behaviour: `src/Search_for_pet/search.js` and `src/Search_for_pet/presenterSearch.js` (+ `search.html`)
- Add/fix registration: `src/Register_Pet/register.js` and `src/Register_Pet/presenterRegister.js` (+ `Register.html`)
- Tests: unit tests live under feature folders (`src/**/register.spec.js`, `src/**/search.spec.js`) and E2E in `cypress/e2e/`.

If you need to run or modify tests locally:

- Start dev server for E2E: `npm start` then in another terminal `npm run cypress` or `npm run cypress-run`.
- Run Jest-based TDD script (writes JSON report): `npm test`.

When in doubt, prefer small, incremental edits and update the corresponding tests. Ask for clarification when a change would alter the error/return contract between presenters and business modules.

If you update task-related scripts or paths (parcel, jest, cypress, or script/tddScript.js), add a short note here explaining the change and why tests or E2E needed updates.
