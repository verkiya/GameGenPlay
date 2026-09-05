import type { Metadata } from "next"
import Link from "next/link"
import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  Boxes,
  CheckCircle2,
  CircleDollarSign,
  Database,
  Gauge,
  KeyRound,
  Layers3,
  RefreshCcw,
  ShieldCheck,
  Wrench,
  Workflow,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Engineering learnings",
}

const lessons = [
  {
    title: "A game is a durable conversation plus an ephemeral world",
    area: "Architecture",
    icon: Layers3,
    summary:
      "Postgres owns the game, its messages, cursor, and sandbox reference. Daytona owns the generated files and running server. Treating either as the whole game makes reloads or sandbox recovery unreliable.",
    evidence:
      "The games table persists message history, chat cursor, and sandbox id; the agent hydrates that history before every turn.",
    watchFor:
      "Do not move sandbox source into application state or assume an iframe reload can reconstruct a stopped sandbox.",
  },
  {
    title: "Durable work needs a handoff, not a client-side promise",
    area: "Workflow engine",
    icon: Workflow,
    summary:
      "A chat turn can create a runtime, make many tool calls, and outlive the browser tab. The server starts an authorized Trigger.dev session; the worker persists turn state before and after the streamed work.",
    evidence:
      "The chat session is created in a server action, then trigger/chat.ts uses hydrateMessages, onTurnStart, and onTurnComplete to preserve state.",
    watchFor:
      "A new feature that starts work from the browser must keep the authorization and session-token boundary on the server.",
  },
  {
    title: "One model catalog prevents operational drift",
    area: "AI and billing",
    icon: Bot,
    summary:
      "The selectable model, provider instance, default behavior, and per-token price must use the same identifiers. A model that only exists in one layer fails late or charges incorrectly.",
    evidence:
      "lib/games/model-catalog.ts derives the model-id type used by models.ts, the chat agent, model picker, and pricing.ts.",
    watchFor:
      "When adding a provider model, update its catalog entry, SDK instance, title choice if relevant, and rate card together.",
  },
  {
    title: "The first preview is a lifecycle event",
    area: "Daytona",
    icon: Boxes,
    summary:
      "A sandbox is created once for a game, seeded before its id is recorded, and its static server is started or reused on preview. The preview URL itself is a short-lived credential.",
    evidence:
      "lib/daytona/utils.ts handles creation, labelled cleanup, server readiness checks, and preview startup; the route only returns a signed URL after authorization.",
    watchFor:
      "Never put a signed preview URL in durable state or log it. Store only the sandbox id and mint URLs on demand.",
  },
  {
    title: "The server remains the authorization boundary",
    area: "Authentication",
    icon: ShieldCheck,
    summary:
      "A client game id says which row it wants, not which row it may access. Queries and actions resolve the active Clerk organization and scope data access before creating sessions or previews.",
    evidence:
      "getGame and authorizeGame use the active organization; the preview handler returns the same not-found response for missing and unauthorized games.",
    watchFor:
      "Do not import a Trigger task instance into a browser or route bundle, and do not pass an organization id from the client as authority.",
  },
  {
    title: "Credits are movements, not a mutable counter",
    area: "Database",
    icon: CircleDollarSign,
    summary:
      "The ledger records positive grants and negative, idempotent step charges as bigint values. A balance is a sum, which makes retries safe and accounting explainable.",
    evidence:
      "credit_ledger has a unique organization-and-entry key; response ids make repeated step charges conflict instead of double-billing.",
    watchFor:
      "A started turn may finish below zero. Gate the next turn, not the middle of an expensive write sequence.",
  },
]

const debugging = [
  {
    symptom: "A reload repeats or loses an agent reply",
    check:
      "Start with lib/games/chat-store.ts. Messages and the Trigger event cursor must be written in one update; inspect whether the turn reached onTurnComplete and whether the cursor was stored.",
  },
  {
    symptom: "The preview says it is unavailable",
    check:
      "Check the preview route response first: 404 means no visible game, 409 means the first turn has not created a sandbox, and 500 points to Daytona/server startup. Use sandbox id and timings, never signed URLs, in logs.",
  },
  {
    symptom: "A player is refused despite expecting credits",
    check:
      "Inspect the organization context, then the ledger. hasCreditsToBuild intentionally reconciles Clerk subscriptions only when the initial balance is not positive.",
  },
  {
    symptom: "A model choice fails or is billed unexpectedly",
    check:
      "Compare model-catalog.ts, models.ts, pricing.ts, and the Trigger client-data schema. These files form one operational contract.",
  },
]

const decisions = [
  {
    decision: "Persist chat state before and after a turn",
    why: "A player answer or opening prompt must survive even if the ensuing work fails.",
    tradeoff: "More database writes, but no ambiguous reload state.",
    files: "lib/games/chat-store.ts · trigger/chat.ts",
  },
  {
    decision: "Use signed iframe preview URLs",
    why: "An iframe cannot send the standard Daytona preview-token header.",
    tradeoff:
      "URLs are credentials and must be short-lived and excluded from logs.",
    files: "app/api/games/[id]/preview/route.ts",
  },
  {
    decision: "Use an append-only credit ledger",
    why: "Retries can safely replay a deterministic entry key.",
    tradeoff:
      "Balance reads aggregate rows rather than reading one mutable column.",
    files: "lib/billing/ledger.ts · lib/db/schema.ts",
  },
  {
    decision: "Keep React state local to interaction",
    why: "Preview revision and panel visibility must update without replacing the streamed thread.",
    tradeoff:
      "The server layout is refreshed after a turn to show its current credit balance.",
    files: "components/game-chat.tsx",
  },
]

const invariants = [
  "Every player-facing game lookup is scoped to the active Clerk organization.",
  "A persisted sandbox id refers to a created and seeded sandbox.",
  "Game messages and their resume cursor move together in one write.",
  "A model id is valid only when it exists in the catalog, provider map, and price map.",
  "Ledger entry keys make the same model response charge at most once.",
  "Signed preview URLs are treated as credentials, never durable data.",
  "Generated runtime files are seed assets, not Next.js application source.",
  "Prompts and generated source stay out of Sentry HTTP-body collection.",
]

export default function LearningsPage() {
  return (
    <main className="min-h-svh bg-background pb-20 text-foreground">
      <div className="border-b bg-[radial-gradient(circle_at_top_left,oklch(0.5771_0.2152_27.3250_/_0.16),transparent_38%),radial-gradient(circle_at_top_right,oklch(0.5771_0.2152_27.3250_/_0.08),transparent_34%)]">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:px-10 lg:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
            <Wrench className="size-3.5 text-primary" />
            Engineering memory
          </div>
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.55fr)] lg:items-end">
            <div>
              <h1 className="max-w-4xl font-heading text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                Lessons from building worlds with AI.
              </h1>
              <p className="mt-6 max-w-2xl border-l-2 border-primary pl-4 text-base leading-7 text-muted-foreground sm:text-lg">
                This is the maintenance map for GameGenPlay: the boundaries,
                tradeoffs, and failure modes that matter when a chat thread can
                also provision a machine and write a playable game.
              </p>
            </div>
            <div className="rounded-2xl border bg-background/80 p-5 shadow-sm backdrop-blur-sm">
              <p className="text-sm font-medium">The short version</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Keep user interaction, durable history, long-running work, and
                generated execution in the layer that can actually own it.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-10 lg:py-16">
        <section className="grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border bg-card p-6 shadow-sm">
            <Workflow className="size-6 text-primary" />
            <h2 className="mt-5 text-xl font-semibold">Durable turn</h2>
            <p className="mt-2 leading-7 text-muted-foreground">
              The player sees a chat response; the system runs a recoverable
              workflow with a database checkpoint on either side.
            </p>
          </article>
          <article className="rounded-2xl border bg-card p-6 shadow-sm">
            <Database className="size-6 text-primary" />
            <h2 className="mt-5 text-xl font-semibold">Verifiable state</h2>
            <p className="mt-2 leading-7 text-muted-foreground">
              Conversations, cursors, sandbox identity, and credit movements are
              durable records rather than optimistic assumptions.
            </p>
          </article>
          <article className="rounded-2xl border bg-card p-6 shadow-sm">
            <KeyRound className="size-6 text-primary" />
            <h2 className="mt-5 text-xl font-semibold">Narrow trust</h2>
            <p className="mt-2 leading-7 text-muted-foreground">
              Organization checks protect the app; signed previews and worker
              tokens expose only the least access required.
            </p>
          </article>
        </section>

        <section className="mt-16">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
              <Layers3 className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Architecture learnings</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                The decisions that keep the web app, worker, and sandbox
                coherent.
              </p>
            </div>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {lessons.map((lesson) => {
              const Icon = lesson.icon

              return (
                <article
                  key={lesson.title}
                  className="rounded-2xl border bg-gradient-to-br from-card to-muted/25 p-6 shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <span className="rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                      {lesson.area}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{lesson.title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">
                    {lesson.summary}
                  </p>
                  <div className="mt-5 rounded-xl border border-primary/15 bg-primary/5 p-4 text-sm leading-6">
                    <span className="font-semibold text-primary">
                      Evidence:{" "}
                    </span>
                    {lesson.evidence}
                  </div>
                  <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm leading-6 text-muted-foreground">
                    <span className="font-semibold text-amber-700 dark:text-amber-400">
                      Watch for:
                    </span>
                    {lesson.watchFor}
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
              <Gauge className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">
                React and Next.js lessons
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Preserve the thread while its surrounding server state
                refreshes.
              </p>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <article className="rounded-2xl border bg-card p-6 shadow-sm">
              <RefreshCcw className="size-5 text-primary" />
              <h3 className="mt-4 font-semibold">
                Refresh the shell, not the chat
              </h3>
              <p className="mt-3 leading-7 text-muted-foreground">
                After a completed turn, GameChat refreshes the server-rendered
                sidebar balance while preserving the client thread, preview
                revision, and panel state. Replacing the thread would rebuild it
                from an older server snapshot.
              </p>
            </article>
            <article className="rounded-2xl border bg-card p-6 shadow-sm">
              <Gauge className="size-5 text-primary" />
              <h3 className="mt-4 font-semibold">
                Effects subscribe; they do not drive render
              </h3>
              <p className="mt-3 leading-7 text-muted-foreground">
                Responsive and carousel helpers defer their first state sync
                until after commit, subscribe to external events, and remove
                every listener on cleanup. This avoids cascading renders and
                stale UI.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10">
              <AlertTriangle className="size-5 text-amber-700 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Debugging notes</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Start from the boundary that owns the symptom.
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            {debugging.map((item, index) => (
              <article
                key={item.symptom}
                className={`grid gap-3 p-6 md:grid-cols-[minmax(13rem,0.7fr)_minmax(0,1.3fr)] md:gap-8 ${
                  index === debugging.length - 1 ? "" : "border-b"
                }`}
              >
                <h3 className="font-semibold">{item.symptom}</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  {item.check}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
              <Workflow className="size-5 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Decision tradeoffs</h2>
          </div>
          <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="hidden grid-cols-[1.1fr_1.2fr_1.2fr_1fr] gap-6 border-b bg-muted/40 px-6 py-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase lg:grid">
              <span>Decision</span>
              <span>Why</span>
              <span>Cost</span>
              <span>Look here</span>
            </div>
            {decisions.map((item, index) => (
              <article
                key={item.decision}
                className={`grid gap-4 p-6 lg:grid-cols-[1.1fr_1.2fr_1.2fr_1fr] lg:gap-6 ${
                  index === decisions.length - 1 ? "" : "border-b"
                }`}
              >
                <h3 className="font-semibold">{item.decision}</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  {item.why}
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {item.tradeoff}
                </p>
                <code className="rounded bg-muted px-2 py-1 text-xs break-all text-muted-foreground">
                  {item.files}
                </code>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-2xl border bg-card p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-5 text-primary" />
              <h2 className="text-2xl font-semibold">Maintenance invariants</h2>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {invariants.map((invariant) => (
                <div
                  key={invariant}
                  className="flex items-start gap-3 rounded-xl border bg-muted/25 p-4"
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <p className="text-sm leading-6 text-muted-foreground">
                    {invariant}
                  </p>
                </div>
              ))}
            </div>
          </article>
          <article className="rounded-2xl border border-primary/20 bg-primary/5 p-7 shadow-sm">
            <h2 className="text-2xl font-semibold">
              Mistakes to avoid next time
            </h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>
                • Do not let generated route types go stale after moving routes.
              </li>
              <li>
                • Do not let copied project identifiers leak into monitoring
                configuration.
              </li>
              <li>• Do not treat a model-name update as a UI-only change.</li>
              <li>
                • Do not interrupt a started build solely because the balance
                changed.
              </li>
            </ul>
            <h3 className="mt-8 text-lg font-semibold">Future improvements</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>
                • Add integration tests around authorization, billing, and
                sandbox cleanup.
              </li>
              <li>• Expose per-turn cost and latency in the workspace.</li>
              <li>
                • Build operator tooling for stranded sandbox detection and
                cleanup.
              </li>
              <li>
                • Record an explicit public deployment and end-to-end demo path.
              </li>
            </ul>
          </article>
        </section>

        <div className="mt-16 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            <ArrowLeft className="size-4" />
            Back to new game
          </Link>
        </div>
      </div>
    </main>
  )
}
