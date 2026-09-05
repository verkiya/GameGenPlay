import { auth } from "@clerk/nextjs/server"
import Image from "next/image"

import { NewGameComposer } from "@/components/new-game-composer"
import { MainBackground } from "@/components/main-background"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default async function Page() {
  await auth.protect({ unauthenticatedUrl: "/sign-in" })

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden">
      <MainBackground />
      
      <div className="relative z-10 w-full max-w-3xl px-6">
        <Empty className="flex-none border-zinc-800/50 bg-zinc-950/40 backdrop-blur-xl">
          <EmptyHeader>
            <EmptyMedia className="bg-transparent">
              <Image src="/logo.svg" alt="Logo" width={48} height={48} className="size-12" priority />
            </EmptyMedia>
            <EmptyTitle className="text-2xl font-medium tracking-tight mt-2">
              What should we build today?
            </EmptyTitle>
            <EmptyDescription className="text-zinc-400 max-w-xl mx-auto text-[15px]/loose tracking-wide mt-2">
              Describe a game and play it instantly.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="max-w-2xl gap-6">
            <NewGameComposer />
          </EmptyContent>
        </Empty>
      </div>
    </div>
  )
}
