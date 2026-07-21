# SauceDemo Playwright Automation Framework

End-to-end UI and API test automation built with [Playwright Test](https://playwright.dev/) and TypeScript.

- UI under test: [https://www.saucedemo.com/](https://www.saucedemo.com/)
- API under test: [https://jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com)

## Features

- Page Object Model with a shared `BasePage` and per-page classes.
- Custom Playwright fixtures, including an `authenticatedPage` fixture that logs in once per test.
- Data-driven tests (e.g. checkout form validation) and a full end-to-end checkout flow.
- Combined UI and API coverage; a typed API client with exponential-backoff retry.
- Centralized, environment-driven configuration via `dotenvx`, with `.env` encrypted at rest and safe to commit.
- Cross-browser and mobile projects: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari.
- Multiple reporters: Playwright HTML, Allure, and `list`; blob reports for sharded CI.
- Structured logging and a reusable retry utility.
- Dockerized execution and a sharded GitHub Actions pipeline.

## Tech stack

| Concern          | Choice                                                                |
| ---------------- | --------------------------------------------------------------------- |
| Test runner      | `@playwright/test` `^1.60.0`                                          |
| Language         | TypeScript (strict, `nodenext` module resolution)                     |
| Config / secrets | `@dotenvx/dotenvx` (encrypted `.env`)                                                              |
| Reporting        | `allure-playwright`, `allure-commandline`, Playwright HTML            |
| Linting          | ESLint (flat config, `eslint.config.js`) + `eslint-plugin-playwright` |
| Formatting       | Prettier                                                              |
| Containerization | Docker + Docker Compose                                               |
| CI               | GitHub Actions (4-way sharding)                                       |

## Project structure

```
Saucedemo/
├── src/
│   ├── api/
│   │   ├── ApiClient.ts        # Typed API client (retry, error classification)
│   │   └── schemas.ts          # Post / CreatePostInput type definitions
│   ├── config/
│   │   └── environments.ts     # Environment resolution + env-var overrides
│   ├── data/                   # Test data (users, products, cart, checkout, api)
│   │   ├── Users.ts
│   │   ├── cartData.ts
│   │   ├── checkoutData.ts
│   │   ├── loginData.ts
│   │   ├── productData.ts
│   │   ├── products.ts / products.json
│   │   └── apiData.ts
│   ├── fixtures/
│   │   └── Pages.ts            # Custom fixtures incl. authenticatedPage
│   ├── pages/                  # Page Object Model
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   ├── ProductsPage.ts
│   │   ├── CartPage.ts
│   │   └── CheckOutPage.ts
│   └── utils/
│       ├── logger.ts           # Structured console logger
│       ├── retry.ts            # Exponential-backoff retry + NonRetryableError
│       └── dataGenerator.ts    # Random test-data helpers
├── tests/
│   ├── ui/                     # login, product, cart, checkOut specs
│   └── api/                    # post spec
├── .github/workflows/playwright.yml
├── Dockerfile
├── docker-compose.yml
├── playwright.config.ts
├── tsconfig.json
├── eslint.config.js
└── package.json
```

## Prerequisites

- [Node.js](https://nodejs.org/) LTS and npm.
- Playwright browsers (installed via `npx playwright install`, see below).
- Optional: a Java runtime (JRE/JDK) if you want to generate the Allure report with the pinned `allure-commandline` (it is a Java app). A Java-free alternative is documented in [Reporting](#reporting).
- Optional: Docker, to run the suite in a container.

## Getting started

```bash
# from scripts/Saucedemo
npm install

# install Playwright browsers (first time only)
npx playwright install

# create your local env file
cp .env.example .env
```

The defaults in `.env.example` use SauceDemo's public demo credentials, so the suite runs out of the box.

## Configuration

Configuration is resolved in [`src/config/environments.ts`](src/config/environments.ts) and [`src/data/Users.ts`](src/data/Users.ts), with values overridable through environment variables (loaded from `.env` locally or from CI secrets/vars).

| Variable         | Purpose                              | Default                                |
| ---------------- | ------------------------------------ | -------------------------------------- |
| `ENV`            | Which environment block to use       | `production`                           |
| `BASE_URL`       | UI base URL                          | `https://www.saucedemo.com/`           |
| `API_URL`        | API base URL                         | `https://jsonplaceholder.typicode.com` |
| `SAUCE_USERNAME` | Standard user name                   | see `.env.example`                        |
| `SAUCE_PASSWORD` | Shared password                      | see `.env.example`                         |
| `DEBUG`          | When set, enables `DEBUG`-level logs | unset                                  |

## Secrets & encryption 

`.env` is encrypted wit [`.dotenvx`](https://dotenvx.com/) and **committed to git** - every value is stored as `encrypted:...`, so the file is safe to share/review/diff without exposing plaintext secrets. Decryption happens transparently:

- **In code:** `src/config/environments.ts` and `src/data/Users.ts` call `@dotenvx/dotenvx`'s `config()` at import time, so any entry point (`npm test`,`npx playwright test`, Docker) decrypts correctly without extra flags.
- **The private key** lives only in `.env.keys` (gitignored, never committed). Without it, `dotenvx` cannot decrypt and - because it never overrides a variable that's already set - any variable _not_ otherwise provided falls back to the literal `encrypted:...` string, which is why CI sets every variable explicitly (see below) instead of relying on decryption.

**Local setup (first time):**

- If you already have `.env.keys` (shared via a password manager/secrets vault - never Slack/email/git), just drop it in the project root; `npm test` decrypts automatically.
- If you don't have it and just want to run with the public demo defaults, either leave `.env` as-is (it decrypts to those same defaults) or run `cp .env.example .env` to use plaintext instead - `dotenvx` supports plaintext and encrypted values in the same file interchangeably.

**Rotating/editing secrets:**

```bash
npm run env:decrypt    #writes plaintext values back into .env for editing
#edit .env with new values...
npm run env:encrypt    #re-encrypts in place; commit the result


**Other useful scripts:**
| Script | Purpose |
|---|---|
| `npm run env:encrypt` | Encrypt `.env` in place (generates `.env.keys` if missing) |
| `npm run env:decrypt` | Decrypt `.env` in place, for editing |
| `npm run env:keys` | Print the public/private keypair for `.env` |
| `npm run env:precommit-check` | Verify `.env` is encrypted before committing (wire into a git hook if desired) |

**CI:** the GitHub Actions workflow injects every variable directly from repository secrets/vars (`env:` block in `.github/workflows/playwright.yml`), so it never depends on `DOTENV_PRIVATE_KEY` or decrypting `.env` at all.

**DOCKER:** `docker-compose.yml` passes `DOTENV_PRIVATE_KEY` through from the host environment (populate it from your local `.env.keys` before running `npm run docker:test`) so the container can decrypt the same committed `.env`.   

### Path aliases

TypeScript path aliases are defined in [`tsconfig.json`](tsconfig.json):

| Alias         | Resolves to      |
| ------------- | ---------------- |
| `@pages/*`    | `src/pages/*`    |
| `@fixtures/*` | `src/fixtures/*` |
| `@data/*`     | `src/data/*`     |
| `@utils/*`    | `src/utils/*`    |
| `@api/*`      | `src/api/*`      |
| `@config/*`   | `src/config/*`   |

## Running tests

```bash
npm test               # full suite, all projects
npm run test:smoke     # only @smoke tagged tests
npm run test:regression# only @regression tagged tests
npm run test:ui        # UI tests only (tests/ui)
npm run test:api       # API tests only (tests/api)
```

Useful raw Playwright invocations:

```bash
# A single browser/project
npx playwright test --project=chromium

# A single spec file or test
npx playwright test tests/ui/login.spec.ts
npx playwright test tests/ui/cart.spec.ts:39

# Filter by tag
npx playwright test --grep @e2e

# Headed / debug / interactive UI mode
npx playwright test --headed
npx playwright test --debug
npx playwright test --ui
```

### Projects (browsers)

Defined in [`playwright.config.ts`](playwright.config.ts): `chromium`, `firefox`, `webkit`, `Mobile Chrome`, `Mobile Safari`.

### Test tags

Specs are annotated with tags you can target via `--grep`: `@smoke`, `@regression`, `@api`, `@negative`, `@e2e`, `@validation`, `@data-driven`, `@critical`, `@cart`, `@login`, `@performance`.

## Reporting

This project produces two kinds of report.

### Playwright HTML report

Generated automatically on local runs into `playwright-report/`:

```bash
npm run report          # opens the last Playwright HTML report
```

### Allure report

The Allure reporter writes raw results to `allure-results/` during every run. To build and open the HTML report:

```bash
npm run report:allure   # allure generate + allure open
```

> Note: `allure-commandline` (used by `report:allure`) is a Java application and requires a JRE/JDK on your `PATH`. If you see "Unable to locate a Java Runtime", either install Java (e.g. Temurin) or use the Java-free Allure 3 CLI:
>
> ```bash
> npx allure@3 generate allure-results -o allure-report --open
> ```

## Architecture notes

- Fixtures ([`src/fixtures/Pages.ts`](src/fixtures/Pages.ts)) inject page objects and provide `authenticatedPage`, which logs in as the standard user and asserts the products page is loaded before the test body runs. Import `test`/`expect` from `@fixtures/Pages` instead of `@playwright/test` to get these fixtures.
- Page objects extend [`BasePage`](src/pages/BasePage.ts) and encapsulate locators and actions, keeping specs declarative.
- The API client ([`src/api/ApiClient.ts`](src/api/ApiClient.ts)) wraps requests in `retry()` and classifies failures: 4xx responses raise a `NonRetryableError` (not retried), while 5xx/transient errors are retried with exponential backoff ([`src/utils/retry.ts`](src/utils/retry.ts)).
- Logging is handled by a small structured logger ([`src/utils/logger.ts`](src/utils/logger.ts)); set `DEBUG=1` for verbose output.

## Code quality

```bash
npm run typecheck      # tsc --noEmit
npm run lint           # ESLint
npm run format         # Prettier write
npm run format:check   # Prettier check (used in CI)
```

## Docker

Run the suite in the official Playwright container (browsers + OS deps preinstalled):

```bash
npm run docker:build   # docker compose build
npm run docker:test    # docker compose run --rm tests
```

[`docker-compose.yml`](docker-compose.yml) mounts `playwright-report/`, `allure-results/`, and `test-results/` back to the host and sets `shm_size: 1gb` to avoid Chromium crashes in containers. It reads `.env` if present.

## CI/CD

The GitHub Actions workflow ([`.github/workflows/playwright.yml`](.github/workflows/playwright.yml)) runs on pushes and PRs to `main`/`master`:

- Quality gates: `typecheck`, `lint`, and `format:check`.
- Caches Playwright browsers keyed by Playwright version.
- Runs tests across a 4-way shard matrix, emitting a `blob` report per shard.
- A `merge-reports` job merges the shard blobs into a single Playwright HTML report and combines Allure results, uploading both as artifacts.

Configure these in your repository settings:

- Secrets: `SAUCE_USERNAME`, `SAUCE_PASSWORD`.
- Variables: `BASE_URL`, `API_URL`.

## Troubleshooting

- "browserType.launch: Executable doesn't exist" — install the browsers: `npx playwright install` (add `--with-deps` on Linux/CI).
- "Unable to locate a Java Runtime" when running `report:allure` — install Java or use `npx allure@3` (see [Reporting](#reporting)).
- Chromium crashing in Docker — ensure sufficient shared memory (`shm_size: 1gb` is already set in `docker-compose.yml`).
- Flaky local browser-launch crashes — try fewer workers: `npx playwright test --workers=2`.
