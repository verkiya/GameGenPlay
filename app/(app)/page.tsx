import Image from "next/image"
import { auth } from "@clerk/nextjs/server"
import { 
  Empty, 
  EmptyContent, 
  EmptyDescription, 
  EmptyHeader, 
  EmptyMedia, 
  EmptyTitle 
} from "@/components/ui/empty"
import { 
  InputGroup, 
  InputGroupAddon, 
  InputGroupTextarea 
} from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import { 
  User, 
  Swords, 
  Zap, 
  Target, 
  Car, 
  Gamepad2, 
  ChevronDown, 
  ArrowUp 
} from "lucide-react"

export default async function Page() {
  const { userId, redirectToSignIn } = await auth()

  if (!userId) {
    return redirectToSignIn()
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-[#1A1A1A] p-6 text-zinc-100 dark relative">
      <div className="w-full max-w-3xl">
        <Empty className="border-none">
          <EmptyHeader className="max-w-lg mb-4">
            <EmptyMedia className="mb-6 bg-transparent">
              <Image 
                src="/logo.svg" 
                alt="Logo" 
                width={64} 
                height={64} 
                className="size-16" 
                priority
              />
            </EmptyMedia>
            <EmptyTitle className="text-2xl font-medium tracking-tight mb-2">
              What should we build today?
            </EmptyTitle>
            <EmptyDescription className="text-center text-zinc-400 max-w-[28rem] mx-auto text-[15px]/relaxed mb-6">
              Build your own racers, shooters, puzzles and whole worlds
              using your own words. If you can describe it, you can play it.
            </EmptyDescription>
          </EmptyHeader>

          <EmptyContent className="w-full max-w-2xl">
            <InputGroup className="w-full h-auto flex-col rounded-xl bg-[#252525] border-[#333333] focus-within:border-[#444444] focus-within:ring-0">
              <InputGroupTextarea 
                placeholder="Describe the game you want to build..."
                className="min-h-[110px] text-sm text-zinc-100 placeholder:text-zinc-500 border-none focus-visible:ring-0 px-4 py-4 resize-none"
              />
              <InputGroupAddon align="block-end" className="flex items-center justify-between w-full p-2 pt-0">
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-200 hover:bg-[#333333] gap-1 h-8 rounded-lg px-2.5">
                  <span className="text-xs font-medium">Kim V2</span>
                  <ChevronDown className="size-3.5 opacity-50" />
                </Button>
                
                <Button 
                  size="icon-sm" 
                  className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 mr-1"
                >
                  <ArrowUp className="size-4" />
                </Button>
              </InputGroupAddon>
            </InputGroup>

            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
              {[
                { icon: User, label: "Voxel survival" },
                { icon: Swords, label: "Ink samurai duel" },
                { icon: Zap, label: "Comic-book firefight" },
                { icon: Target, label: "Realistic battlefield" },
                { icon: Target, label: "Flight-first shooter" },
                { icon: Car, label: "Jungle expedition drive" },
                { icon: Gamepad2, label: "Sunny kingdom platformer" },
              ].map((item) => (
                <Button 
                  key={item.label} 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full bg-[#252525]/50 border-[#333333] text-zinc-300 hover:bg-[#333333] hover:text-white text-xs h-8 px-3.5 transition-colors font-normal"
                >
                  <item.icon className="mr-2 size-3.5 opacity-70" />
                  {item.label}
                </Button>
              ))}
            </div>
          </EmptyContent>
        </Empty>
      </div>
    </div>
  )
}
