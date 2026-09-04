"use server"

import { anthropic } from "@ai-sdk/anthropic"
import { auth } from "@clerk/nextjs/server"
import { generateText } from "ai"
import { refresh } from "next/cache"
import { redirect } from "next/navigation"

import { db, games } from "@/lib/db"
import { generateMessageId } from "@/lib/games/messages"
import { getGame } from "@/lib/games/queries"
import { TITLE_MAX_LENGTH } from "@/lib/games/title"
import { eq } from "drizzle-orm"
import { chat } from "@trigger.dev/sdk/ai"
import { auth as triggerAuth } from "@trigger.dev/sdk"

function truncate(title: string) {
  return title.length > TITLE_MAX_LENGTH
    ? `${title.slice(0, TITLE_MAX_LENGTH - 1).trimEnd()}…`
    : title
}

/**
 * Names a game after the prompt it was created from.
 *
 * This runs before the composer can navigate anywhere, so it uses the cheapest,
 * fastest model available and falls back to the raw prompt if the model is slow,
 * unavailable, or returns nothing usable — a game with an awkward title beats a
 * create that fails.
 */
async function generateTitle(prompt: string) {
  try {
    const { text } = await generateText({
      model: anthropic("claude-haiku-4-5-20251001"),
      instructions:
        "You name games from the prompt that created them. Reply with a title " +
        "of at most four words in title case. No quotes, no punctuation at the " +
        "end, no explanation — the title only.",
      prompt,
      maxOutputTokens: 32,
    })

    // Models like to wrap a bare title in quotes even when told not to.
    const title = text.trim().replace(/^["'“”]+|["'“”]+$/g, "")

    return title || truncate(prompt)
  } catch {
    return truncate(prompt)
  }
}

/**
 * Creates a game from the composer prompt, scopes it to the caller's active
 * organization, and navigates to it.
 *
 * The prompt is stored as the thread's opening message so it survives the
 * navigation without riding along in the URL; `ChatThread` asks for the reply
 * once the game page mounts.
 *
 * Server Actions are reachable by direct POST, so the org is resolved from the
 * session here rather than trusted from the caller.
 */
export async function createGame(prompt: string) {
  const { orgId } = await auth()

  if (!orgId) {
    throw new Error("An active organization is required to create a game.")
  }

  const trimmedPrompt = typeof prompt === "string" ? prompt.trim() : ""

  if (!trimmedPrompt) {
    return
  }

  const [game] = await db
    .insert(games)
    .values({
      orgId,
      title: truncate(await generateTitle(trimmedPrompt)),
      messages: [
        {
          id: generateMessageId(),
          role: "user",
          parts: [{ type: "text", text: trimmedPrompt }],
        },
      ],
    })
    .returning({ id: games.id })

  // The redirect below stays inside `app/(app)/layout.tsx`, so invalidate the
  // router cache rather than let the sidebar render the games list it already
  // has — the new game is missing from it.
  refresh()

  // `redirect` throws, so nothing may follow it here.
  redirect(`/games/${game.id}`)
}

export async function renameGame(id: string, newTitle: string) {
  const { orgId } = await auth()
  if (!orgId) return

  await db.update(games).set({ title: truncate(newTitle) }).where(eq(games.id, id))
  refresh()
}

export async function deleteGame(id: string, active?: boolean) {
  const { orgId } = await auth()
  if (!orgId) return

  await db.delete(games).where(eq(games.id, id))
  refresh()

  if (active) {
    redirect("/")
  }
}

const _startChatSession = chat.createStartSessionAction("game-chat")

export async function startChatSession({ chatId, clientData }: { chatId: string; clientData?: any }) {
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    throw new Error("Unauthorized")
  }

  const game = await getGame(chatId)

  if (!game) {
    throw new Error("Not Found")
  }

  return _startChatSession({ chatId, clientData: { orgId } })
}

export async function mintChatAccessToken(chatId: string) {
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    throw new Error("Unauthorized")
  }

  const game = await getGame(chatId)

  if (!game) {
    throw new Error("Not Found")
  }

  return triggerAuth.createPublicToken({
    scopes: {
      read: { sessions: chatId },
      write: { sessions: chatId },
    },
    expirationTime: "1h",
  })
}
