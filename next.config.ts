import { withSentryConfig } from "@sentry/nextjs/config"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  devIndicators: false,
}

const sentryConfig = withSentryConfig(nextConfig, {
  org: "enra-r3",
  project: "gamegenplay",

  // Build-time secret, used to upload source maps
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Upload a wider set of client files so stack traces resolve
  widenClientFileUpload: true,

  // Proxy events through the app to sidestep ad-blockers
  tunnelRoute: "/monitoring",

  // Same source as the server-side `release`, so both halves agree
  release: {
    name: process.env.SENTRY_RELEASE ?? process.env.RAILWAY_GIT_COMMIT_SHA,
  },

  silent: !process.env.CI,
  telemetry: false,
})

export default async function config(...args: any[]) {
  // @ts-expect-error withSentryConfig can return a function or object
  const cfg = await (typeof sentryConfig === "function" ? sentryConfig(...args) : sentryConfig)
  
  // Sentry automatically injects clientTraceMetadata, which causes Next.js to log an
  // "Experiments (use with caution)" warning. Remove it to keep the console clean.
  if (cfg.experimental?.clientTraceMetadata) {
    delete cfg.experimental.clientTraceMetadata
  }
  
  return cfg
}
