"use client";

import { useState } from "react";

const COMMIT_SHA = process.env.NEXT_PUBLIC_COMMIT_SHA ?? "local-dev";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 p-8 dark:bg-zinc-950">
      <section className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
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

        <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">
          <dt>Build</dt>
          <dd className="font-mono">{COMMIT_SHA}</dd>
          <dt>Stack</dt>
          <dd>Next.js + React + Tailwind</dd>
        </dl>
      </section>
    </main>
  );
}
