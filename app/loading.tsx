import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex h-svh w-full flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 text-muted-foreground animate-pulse">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="text-sm font-medium tracking-wide">Loading GameGenPlay...</p>
      </div>
    </div>
  )
}
