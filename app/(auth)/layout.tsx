import Image from "next/image"
import Link from "next/link"
import { AuthBackground } from "@/components/auth-background"

const technologies = [
  { name: "Next.js", color: "text-zinc-100 border-zinc-100/20 bg-zinc-100/10" },
  { name: "Clerk", color: "text-[#6C47FF] border-[#6C47FF]/20 bg-[#6C47FF]/10" },
  { name: "Trigger.dev", color: "text-[#3FDB87] border-[#3FDB87]/20 bg-[#3FDB87]/10" },
  { name: "Daytona", color: "text-blue-400 border-blue-400/20 bg-blue-400/10" },
  { name: "Neon", color: "text-[#00E599] border-[#00E599]/20 bg-[#00E599]/10" },
  { name: "Drizzle", color: "text-[#C5F74F] border-[#C5F74F]/20 bg-[#C5F74F]/10" },
]

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden md:flex-row">
      {/* Background spans the entire screen */}
      <AuthBackground />

      {/* 70% Left Side - Branding */}
      <div className="relative z-10 hidden w-full flex-col justify-between p-12 text-white md:flex md:w-[70%]">
        {/* Logo Header */}
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="GameGenPlay" width={40} height={40} />
          <span className="font-logo text-3xl font-bold tracking-tight">
            GameGenPlay
          </span>
        </div>

        {/* Content */}
        <div className="mb-12 max-w-3xl flex-1 flex flex-col justify-center">
          <h1 className="mb-6 text-5xl leading-tight font-bold tracking-tight md:text-7xl drop-shadow-lg">
            <span className="animate-color-spectrum bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400">
              Build 3D games
            </span>
            <br />
            <span className="animate-gradient-shift bg-[length:200%_200%] bg-clip-text text-transparent bg-gradient-to-r from-[#EF4444] via-red-300 to-[#EF4444]">
              with AI.
            </span>
          </h1>

        </div>

        {/* Bottom Left Badges */}
        <div className="flex flex-wrap gap-3 mt-auto">
          {technologies.map((tech) => (
            <span
              key={tech.name}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold tracking-wide backdrop-blur-md ${tech.color}`}
            >
              {tech.name}
            </span>
          ))}
        </div>
      </div>

      {/* 30% Right Side - Auth Forms */}
      <div className="relative z-10 flex w-full flex-col items-center justify-center p-8 md:w-[30%]">
        <div className="w-full max-w-sm">{children}</div>
      </div>

      {/* Bottom Center Floating Button */}
      <div className="absolute bottom-12 left-1/2 z-20 -translate-x-1/2">
        <Link
          href="/learnings"
          className="group relative flex items-center gap-3 overflow-hidden rounded-full border border-white/10 bg-white/5 px-6 py-3 font-medium text-white shadow-[0_0_40px_-10px_rgba(255,255,255,0.2)] backdrop-blur-xl transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.4)]"
        >
          <span className="relative z-10 tracking-wide text-sm md:text-base">What I learned building GameGenPlay</span>
          <svg className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </Link>
      </div>
    </div>
  )
}
