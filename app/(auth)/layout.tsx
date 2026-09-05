import Image from "next/image"
import Link from "next/link"
import { AuthBackground } from "@/components/auth-background"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background">
      {/* 70% Left Side - Cool Animations & Branding */}
      <div className="relative hidden w-full md:flex md:w-[70%] flex-col justify-between overflow-hidden p-12 text-white border-r border-border/10">
        <AuthBackground />
        
        {/* Logo Header */}
        <div className="relative z-10 flex items-center gap-3">
          <Image src="/logo.svg" alt="GameGenPlay" width={40} height={40} />
          <span className="font-logo text-3xl font-bold tracking-tight">GameGenPlay</span>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl mb-12">
          <h1 className="mb-6 text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Build 3D games <br />
            <span className="text-primary">with AI.</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-xl leading-relaxed">
            Describe a game and watch it come to life. GameGenPlay is an agentic three.js game builder that plans the scene, writes the code, and streams playable worlds from plain English.
          </p>
        </div>
      </div>

      {/* 30% Right Side - Auth Forms */}
      <div className="flex w-full md:w-[30%] items-center justify-center p-8 bg-background relative z-10 shadow-2xl">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  )
}
