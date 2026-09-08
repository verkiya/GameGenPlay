import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import path from "path"
import { existsSync } from "fs"

const RUNTIME_DIR = path.join(process.cwd(), "lib", "games", "runtime")

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: routePath } = await params
    const slug = routePath.join("/")
    const targetPath = path.join(RUNTIME_DIR, slug)

    // Basic security check to ensure we don't serve files outside RUNTIME_DIR
    if (!targetPath.startsWith(RUNTIME_DIR)) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    if (!existsSync(targetPath)) {
      return new NextResponse("Not Found", { status: 404 })
    }

    const fileContent = await readFile(targetPath)
    const ext = path.extname(targetPath)
    const contentType = MIME_TYPES[ext] || "text/plain"

    return new NextResponse(fileContent, {
      headers: {
        "Content-Type": contentType,
      },
    })
  } catch (error) {
    console.error("Local sandbox error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
