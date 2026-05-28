"use client";

import { useState } from "react";

const COMMIT_SHA = process.env.NEXT_PUBLIC_COMMIT_SHA ?? "local-dev";

const FLY_ACCOUNT: ReadonlyArray<readonly [string, string]> = [
  ["Email", "igals+hm@jfrog.com"],
  ["Fly registry", "asafandigal.jfrog.io"],
  ["Fly Web", "https://fly.jfrog.ai"],
  ["GitHub user", "igalsidoy"],
];

const WHAT_WORKED: ReadonlyArray<string> = [
  "jfrog/fly-action@v1 + GitHub OIDC: zero static tokens to rotate in CI.",
  "Action auto-detects installed package managers (npm, docker) and wires them up.",
  "README → public generic artifact in <30 lines of CI (upload + distribute). Underrated.",
  "Once OIDC creds are in place, docker push to the Fly registry is a one-liner.",
];

const FRICTION: ReadonlyArray<string> = [
  "npm registry: the action reroutes npm to Fly; had to manually pin back to registry.npmjs.org so `npm ci` of public deps would resolve.",
  "GitHub Pages: required a manual “Settings → Pages → Source: GitHub Actions” click until I added `enablement: true` to actions/configure-pages.",
  "Private base + public push: ~5 CI iterations to land — snapshot the OIDC docker creds, log in with a prod-github scoped token for the FROM pull, swap back to OIDC for the push.",
  "Scoped-token “docker-username” is NOT your email — it’s the value shown in the Fly Web token-creation dialog. Stash it as a repo secret (PROD_DOCKER_USERNAME).",
  "buildx broke the pull-during-build path on a private base; falling back to plain `docker build` fixed it.",
];

const RECOMMENDATIONS: ReadonlyArray<string> = [
  "First-class docs recipe: “Private base image + OIDC push” (the OIDC-snapshot + scoped-token swap dance).",
  "Document the npm registry override behaviour explicitly + how to opt out for public deps.",
  "Surface jfrog/fly-action/distribute more prominently — it’s the fastest path to a public download URL.",
  "Show where “docker-username” comes from in the Fly Web token-creation flow.",
];

function randomHexColor(): string {
  const value = Math.floor(Math.random() * 0x1000000);
  return `#${value.toString(16).padStart(6, "0")}`;
}

export default function Home() {
  const [count, setCount] = useState(0);
  const [color, setColor] = useState<string | null>(null);

  return (
    <main className="flex flex-1 items-start justify-center bg-zinc-50 p-8 dark:bg-zinc-950">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <section className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Hello from dummy-app
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            A minimal Next.js + React single-page app, built to be deployed as a
            Docker image and to GitHub Pages.
          </p>

          <div className="mt-6 flex items-center gap-4">
            <button
              type="button"
              onClick={() => setCount((c) => c + 1)}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Click me
            </button>
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              Count:{" "}
              <span className="font-mono font-semibold tabular-nums">
                {count}
              </span>
            </span>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button
              type="button"
              onClick={() => setColor(randomHexColor())}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Random color
            </button>
            <div
              role="img"
              aria-label={
                color ? `Random color ${color}` : "No color picked yet"
              }
              style={{ backgroundColor: color ?? undefined }}
              className="h-12 w-12 rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800"
            />
            <span className="font-mono text-xs uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
              {color ?? "—"}
            </span>
          </div>

          <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">
            <dt>Build</dt>
            <dd className="font-mono">{COMMIT_SHA}</dd>
            <dt>Stack</dt>
            <dd>Next.js + React + Tailwind</dd>
          </dl>
        </section>

        <section
          aria-labelledby="fly-onboarding-summary"
          className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <header className="flex flex-wrap items-baseline justify-between gap-2">
            <h2
              id="fly-onboarding-summary"
              className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
            >
              JFrog Fly onboarding — findings
            </h2>
            <span className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              dummy-app · 12 commits
            </span>
          </header>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            This repo was the sandbox for onboarding to JFrog Fly end-to-end:
            GitHub OIDC auth, npm + Docker through the Fly registry, README
            published as a public generic artifact, plus a parallel GitHub
            Pages deploy. These are the things that worked, the things that
            cost time, and what I&apos;d hand to the docs team.
          </p>

          <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Account
          </h3>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            {FLY_ACCOUNT.map(([label, value]) => (
              <div key={label} className="contents">
                <dt className="text-zinc-500 dark:text-zinc-400">{label}</dt>
                <dd className="break-all font-mono text-zinc-800 dark:text-zinc-200">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            What worked
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
            {WHAT_WORKED.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
            Friction
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
            {FRICTION.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-400">
            Recommendations
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
            {RECOMMENDATIONS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <p className="mt-6 text-xs text-zinc-500 dark:text-zinc-400">
            Live image:{" "}
            <code className="font-mono">
              asafandigal.jfrog.io/docker/igalsidoy/dummy-app:latest
            </code>
            . Public README:{" "}
            <code className="font-mono">
              {`{FLY_URL}/public/generic/dummy-app-readme/[LATEST]/README.md`}
            </code>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
