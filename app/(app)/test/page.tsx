export default function TestPage() {
  return (
    <div className="flex h-full w-full flex-col bg-zinc-950">
      <div className="flex items-center p-4 border-b border-zinc-800">
        <h1 className="text-xl font-medium text-zinc-100">Sandbox Preview</h1>
        <p className="text-sm text-zinc-400 ml-4">Viewing lib/games/runtime/index.html</p>
      </div>
      <div className="flex-1 w-full relative">
        <iframe
          src="/api/local-sandbox/index.html"
          className="w-full h-full border-0 absolute inset-0"
          title="Sandbox test"
        />
      </div>
    </div>
  )
}
