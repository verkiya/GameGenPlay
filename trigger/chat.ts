import { anthropic } from "@ai-sdk/anthropic"
import { chat, upsertIncomingMessage } from "@trigger.dev/sdk/ai"
import { streamText } from "ai"
import { z } from "zod"

import {
  loadGameMessages,
  saveGameMessages,
  saveGameTurn,
} from "@/lib/games/chat-store"

export const gameChat = chat
  .withClientData({
    schema: z.object({
      orgId: z.string(),
    }),
  })
  .agent({
    id: "game-chat",
    hydrateMessages: async ({ chatId, trigger, incomingMessages }) => {
      const stored = await loadGameMessages(chatId)

      if (upsertIncomingMessage(stored, { trigger, incomingMessages })) {
        await saveGameMessages({ gameId: chatId, messages: stored })
      }

      return stored
    },
    onTurnComplete: async ({
      chatId,
      uiMessages,
      chatAccessToken,
      lastEventId,
    }) => {
      await saveGameTurn({
        gameId: chatId,
        messages: uiMessages,
        chatAccessToken,
        chatLastEventId: lastEventId,
      })
    },
    run: async ({ messages, signal }) =>
      streamText({
        ...chat.toStreamTextOptions(),
        model: anthropic("claude-haiku-4-5-20251001"),
        messages,
        abortSignal: signal,
      }),
  })
