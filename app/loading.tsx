import { ThreeLoader } from "@/components/three-loader"

export default function Loading() {
  return (
    <div className="flex h-svh w-full flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 animate-pulse">
        <ThreeLoader />
        <p className="text-sm font-medium tracking-wide text-muted-foreground">Loading GameGenPlay...</p>
      </div>
    </div>
  )
}
