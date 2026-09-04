import { anthropic } from "@ai-sdk/anthropic"
import { chat, upsertIncomingMessage } from "@trigger.dev/sdk/ai"
import { stepCountIs, streamText } from "ai"
import { z } from "zod"

import { createGameSandbox } from "@/lib/daytona/utils"
import {
  loadGameMessages,
  saveGameMessages,
  saveGameTurn,
} from "@/lib/games/chat-store"
import { gameInstructions } from "@/lib/games/instructions"
import { createGameTools } from "@/lib/games/tools"

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
    onChatStart: async ({ chatId }) => {
      await createGameSandbox(chatId)
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
    tools: ({ chatId }) => createGameTools(chatId),
    run: async ({ messages, tools, signal }) =>
      streamText({
        ...chat.toStreamTextOptions({ tools }),
        model: anthropic("claude-haiku-4-5-20251001"),
        instructions: gameInstructions,
        messages,
        abortSignal: signal,
        stopWhen: stepCountIs(48),
      }),
  })
