import type { UIMessage } from "ai"
import { eq } from "drizzle-orm"

import { db, games } from "@/lib/db/client"

export async function loadGameMessages(gameId: string): Promise<UIMessage[]> {
  const [game] = await db
    .select({ messages: games.messages })
    .from(games)
    .where(eq(games.id, gameId))
    .limit(1)

  return game?.messages ?? []
}

export async function saveGameMessages({
  gameId,
  messages,
}: {
  gameId: string
  messages: UIMessage[]
}): Promise<void> {
  await db.update(games).set({ messages }).where(eq(games.id, gameId))
}

export async function saveGameTurn({
  gameId,
  messages,
  chatAccessToken,
  chatLastEventId,
}: {
  gameId: string
  messages: UIMessage[]
  chatAccessToken: string
  chatLastEventId: string | undefined
}): Promise<void> {
  await db
    .update(games)
    .set({ messages, chatAccessToken, chatLastEventId })
    .where(eq(games.id, gameId))
}
