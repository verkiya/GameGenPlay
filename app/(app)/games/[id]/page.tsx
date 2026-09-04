import { auth } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"

import { GameChat } from "@/components/game-chat"
import { getGame } from "@/lib/games/queries"

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  await auth.protect({ unauthenticatedUrl: "/sign-in" })

  const { id } = await params
  const game = await getGame(id)

  if (!game) {
    notFound()
  }

  return (
    <GameChat
      gameId={game.id}
      initialMessages={game.messages}
      sandboxId={game.sandboxId}
      initialSession={
        game.chatAccessToken
          ? {
              publicAccessToken: game.chatAccessToken,
              lastEventId: game.chatLastEventId ?? undefined,
            }
          : undefined
      }
    />
  )
}
