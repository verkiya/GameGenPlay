import { Gamepad2, Home } from "lucide-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background text-foreground selection:bg-primary/30">
      <div className="mx-auto flex max-w-md flex-col items-center space-y-6 text-center">
        {/* Glow effect container */}
        <div className="relative flex items-center justify-center">
          <div className="absolute size-32 animate-pulse rounded-full bg-primary/20 blur-3xl"></div>
          <div className="relative rounded-full border border-border/50 bg-card p-6 shadow-2xl">
            <Gamepad2 className="size-12 text-primary" strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            Level 404
          </h1>
          <p className="text-lg text-muted-foreground">
            Looks like you&apos;ve ventured out of bounds. The game area
            you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>

        <Link
          href="/"
          className={buttonVariants({
            variant: "default",
            className: "group mt-4 rounded-full px-6 transition-all",
          })}
        >
          <Home className="mr-2 size-4 group-hover:animate-bounce" />
          Back to Spawn
        </Link>
      </div>
    </div>
  )
}
