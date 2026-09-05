import Image from "next/image"
import { AuthBackground } from "@/components/auth-background"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      {/* 70% Left Side - Cool Animations & Branding */}
      <div className="relative hidden w-full flex-col justify-between overflow-hidden border-r border-border/10 p-12 text-white md:flex md:w-[70%]">
        <AuthBackground />

        {/* Logo Header */}
        <div className="relative z-10 flex items-center gap-3">
          <Image src="/logo.svg" alt="GameGenPlay" width={40} height={40} />
          <span className="font-logo text-3xl font-bold tracking-tight">
            GameGenPlay
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 mb-12 max-w-3xl">
          <h1 className="mb-6 text-5xl leading-tight font-bold tracking-tight md:text-7xl">
            Build 3D games <br />
            <span className="text-primary">with AI.</span>
          </h1>
          <p className="max-w-xl text-xl leading-relaxed text-zinc-400">
            Describe a game and watch it come to life. GameGenPlay is an agentic
            three.js game builder that plans the scene, writes the code, and
            streams playable worlds from plain English.
          </p>
        </div>
      </div>

      {/* 30% Right Side - Auth Forms */}
      <div className="relative z-10 flex w-full items-center justify-center bg-background p-8 shadow-2xl md:w-[30%]">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}
