"use client";

import { useState } from "react";

const COMMIT_SHA = process.env.NEXT_PUBLIC_COMMIT_SHA ?? "local-dev";

const FLY_ACCOUNT: ReadonlyArray<readonly [string, string]> = [
  ["Email", "igals+hm@jfrog.com"],
  ["Fly registry", "asafandigal.jfrog.io"],
  ["Fly Web", "https://fly.jfrog.ai"],
  ["GitHub user", "igalsidoy"],
];

type Finding = {
  area: string;
  observed: string;
  expected: string;
};

const FINDINGS: ReadonlyArray<Finding> = [
  {
    area: "Login / register",
    observed:
      "Navigating to https://fly.jfrog.ai redirects to /dashboard, which is protected, so I get bounced to /login. The login page has no way to register a new account.",
    expected:
      "A visible REGISTER button on the login page so first-timers can sign up without hunting for a separate URL.",
  },
  {
    area: "Signup password",
    observed:
      "The password field has no client-side validation. In particular, nothing warns me if CAPS LOCK is on while I'm typing.",
    expected:
      "A CAPS LOCK indicator on the password field (and basic strength / format hints) before I submit.",
  },
  {
    area: "OTP",
    observed:
      "After typing the last OTP digit I still have to click Submit.",
    expected:
      "Auto-submit on the final digit — the modern convention everywhere else.",
  },
  {
    area: "Signup loading screen",
    observed:
      "While the registration request is in flight, the screen shows a slow text animation that reads like movie subtitles describing the signup steps.",
    expected:
      "Use that real estate to tell me about the product (capabilities, screenshots) — or just show a normal progress indicator. The subtitle animation feels slow and uninformative.",
  },
  {
    area: "Dashboard freshness after CI setup",
    observed:
      "After the MCP configured my CI to use jfrog/fly-action and the CI ran successfully, the Fly dashboard didn't reflect 'workflow configured' until I refreshed the page twice.",
    expected:
      "The dashboard should poll / push-update when a workflow first reports in, not require manual refresh.",
  },
  {
    area: "Environments",
    observed:
      "No default environment exists. To see the running image of my service I had to manually create an environment, create a token, then override the existing docker login with the new token.",
    expected:
      "A default (e.g. auto-detected 'production') environment that surfaces the running image out of the box, without forcing token creation up front.",
  },
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
              user feedback
            </span>
          </header>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Notes from going through the JFrog Fly signup → first deploy flow
            end-to-end. Sharing as-is for the Fly team.
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

          <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Findings
          </h3>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                  <th scope="col" className="w-8 py-2 pr-3 font-medium">
                    #
                  </th>
                  <th
                    scope="col"
                    className="w-40 py-2 pr-3 font-medium sm:w-48"
                  >
                    Area
                  </th>
                  <th scope="col" className="py-2 pr-3 font-medium">
                    What happened
                  </th>
                  <th scope="col" className="py-2 font-medium">
                    What I&apos;d expect
                  </th>
                </tr>
              </thead>
              <tbody>
                {FINDINGS.map((finding, i) => (
                  <tr
                    key={finding.area}
                    className="border-b border-zinc-100 align-top last:border-0 odd:bg-zinc-50/60 dark:border-zinc-800 dark:odd:bg-zinc-800/30"
                  >
                    <td className="py-3 pr-3 font-mono text-zinc-500 dark:text-zinc-400">
                      {i + 1}
                    </td>
                    <td className="py-3 pr-3 font-medium text-zinc-800 dark:text-zinc-200">
                      {finding.area}
                    </td>
                    <td className="py-3 pr-3 text-zinc-700 dark:text-zinc-300">
                      {finding.observed}
                    </td>
                    <td className="py-3 text-zinc-700 dark:text-zinc-300">
                      {finding.expected}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
