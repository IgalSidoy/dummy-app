import path from "node:path";
import type { NextConfig } from "next";

const isPages = process.env.NEXT_PUBLIC_DEPLOY_TARGET === "pages";

const nextConfig: NextConfig = {
  output: isPages ? "export" : "standalone",
  basePath: isPages ? "/dummy-app" : "",
  assetPrefix: isPages ? "/dummy-app/" : "",
  images: { unoptimized: isPages },
  trailingSlash: isPages,
  // Pin the file-tracing root to this project so `output: 'standalone'`
  // emits server.js directly under .next/standalone/ instead of nesting it
  // under sibling-project directories. This keeps the Dockerfile COPY paths
  // simple and matches what most Next.js Docker examples assume.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
