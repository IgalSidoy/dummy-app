# dummy-app

A minimal Next.js + React single-page app, built to be deployed two ways from the same codebase:

- **Docker image** — full Next.js server (`next start`) via `output: 'standalone'`. Image is published to GitHub Container Registry on every push to `main`.
- **GitHub Pages** — static export (`output: 'export'`) deployed to `https://igalsidoy.github.io/dummy-app/`.

## Live URLs

| Target | URL |
|---|---|
| GitHub Pages | <https://igalsidoy.github.io/dummy-app/> |
| Container image | `ghcr.io/igalsidoy/dummy-app:latest` (also tagged with the commit SHA) |

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
```

Other useful scripts:

```bash
npm run lint
npm run build        # standalone server build (.next/standalone/server.js)
npm start            # serves the standalone build on port 3000
```

## Docker

```bash
docker build -t dummy-app:local .
docker run --rm -p 3000:3000 dummy-app:local
# → open http://localhost:3000
```

To pull the published image:

```bash
docker pull ghcr.io/igalsidoy/dummy-app:latest
docker run --rm -p 3000:3000 ghcr.io/igalsidoy/dummy-app:latest
```

## Static export (what GitHub Pages serves)

```bash
NEXT_PUBLIC_DEPLOY_TARGET=pages npm run build
npx serve out         # quick local preview
```

The `NEXT_PUBLIC_DEPLOY_TARGET=pages` env switches `next.config.ts` to:

- `output: 'export'` — writes static HTML/CSS/JS to `out/`.
- `basePath: '/dummy-app'` + `assetPrefix: '/dummy-app/'` — required because Pages serves project sites under a sub-path.
- `images: { unoptimized: true }` — `next/image` has no runtime to optimize on Pages.

## CI / CD

`.github/workflows/ci.yml` runs on every push and PR to `main`:

| Job | Trigger | What it does |
|---|---|---|
| `build-test` | push + PR | `npm ci`, lint, standalone build. Gates the deploy jobs. |
| `docker-build-push` | push to `main` only | Builds the Dockerfile and pushes `ghcr.io/igalsidoy/dummy-app:latest` + `:sha-<commit>`. |
| `pages-deploy` | push to `main` only | Runs `NEXT_PUBLIC_DEPLOY_TARGET=pages npm run build`, uploads `out/` as a Pages artifact, deploys via `actions/deploy-pages@v4`. |

Both deploy jobs use the workflow's built-in `GITHUB_TOKEN` — no manual PATs or repo secrets needed.

## One-time GitHub repo setup

These two clicks have to happen once in the repo's GitHub UI, otherwise the first CI run will fail on the deploy jobs:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions**
   Without this, `actions/deploy-pages@v4` fails with "Pages site not found".
2. **Settings → Actions → General → Workflow permissions → Read and write permissions**
   Without this, the workflow's `GITHUB_TOKEN` cannot push the image to GHCR.

Re-run the workflow from the Actions tab after flipping the two toggles.

## Project layout

```
.
├── .github/workflows/ci.yml   CI: build-test + docker-build-push + pages-deploy
├── app/                       App Router pages (page.tsx, layout.tsx, globals.css)
├── public/                    Static assets served as-is
├── .dockerignore
├── Dockerfile                 Multi-stage build using output:'standalone'
├── next.config.ts             Dual standalone/export mode toggle
├── package.json
├── tsconfig.json
└── README.md
```
