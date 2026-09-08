"use client"

import { useRealtimeRun } from "@trigger.dev/react-hooks"
import { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getGameRunId, mintGameRunAccessToken } from "@/lib/games/chat-actions"
import { Spinner } from "@/components/ui/spinner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export function LogsModal({
  gameId,
  open,
  onOpenChange,
}: {
  gameId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [runId, setRunId] = useState<string | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return

    let isMounted = true
    async function init() {
      try {
        const id = await getGameRunId(gameId)
        if (!id || !isMounted) return
        setRunId(id)

        const token = await mintGameRunAccessToken(gameId, id)
        if (isMounted) setAccessToken(token)
      } catch (err) {
        console.error("Could not fetch run credentials:", err)
      }
    }
    init()
    return () => {
      isMounted = false
    }
  }, [open, gameId])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Live Logs</DialogTitle>
          <DialogDescription>
            Real-time logs streamed from the Trigger.dev backend worker via metadata.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden rounded-md bg-zinc-950 p-4 mt-2">
          {!runId || !accessToken ? (
            <div className="flex items-center gap-2 text-zinc-400">
              <Spinner /> Loading run info...
            </div>
          ) : (
            <LogsStream runId={runId} accessToken={accessToken} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function LogsStream({
  runId,
  accessToken,
}: {
  runId: string
  accessToken: string
}) {
  const { run, error } = useRealtimeRun(runId, { accessToken })

  if (error) {
    return (
      <div className="text-red-400">
        Failed to connect to real-time run: {error.message}
      </div>
    )
  }

  const logs: string[] = Array.isArray(run?.metadata?.logs)
    ? (run.metadata.logs as string[])
    : []

  return (
    <ScrollArea className="h-[400px] w-full font-mono text-sm text-zinc-300">
      {logs.length === 0 ? (
        <div className="text-zinc-500 italic">No logs generated yet for this run...</div>
      ) : (
        <div className="flex flex-col gap-1">
          {logs.map((log, idx) => (
            <div key={idx} className="border-l-2 border-zinc-700 pl-2">
              {log}
            </div>
          ))}
          {run?.isExecuting && (
            <div className="flex items-center gap-2 text-zinc-500 mt-2">
              <Spinner /> Agent is working...
            </div>
          )}
          {!run?.isExecuting && (
            <div className="text-green-500 mt-2">✓ Run finished</div>
          )}
        </div>
      )}
    </ScrollArea>
  )
}
