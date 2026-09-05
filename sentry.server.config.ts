// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  dataCollection: {
    // Prompts and game source flow through this app's request bodies, so they
    // stay out of Sentry. Everything else uses the permissive defaults.
    httpBodies: [],
  },

  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,

  // Attach local variable values to stack frames
  includeLocalVariables: true,

  enableLogs: true,

  integrations: [
    Sentry.consoleLoggingIntegration({ levels: ["warn", "error"] }),
  ],

  beforeSendLog: (log) => {
    if (
      process.env.NODE_ENV === "production" &&
      (log.level === "trace" || log.level === "debug")
    ) {
      return null
    }

    log.attributes = { ...log.attributes, "service.name": "sandbox-server" }

    return log
  },
});
