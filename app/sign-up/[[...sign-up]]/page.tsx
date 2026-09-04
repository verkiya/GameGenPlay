import { SignUp } from "@clerk/nextjs"
import Image from "next/image"
import { Gamepad2, Swords, Rocket, Target } from "lucide-react"

export default function SignUpPage() {
  return (
    <div className="flex min-h-svh bg-[#1A1A1A] text-zinc-100 dark">
      {/* Left side: Project Description (70%) */}
      <div className="hidden lg:flex lg:w-[70%] flex-col justify-center p-12 border-r border-[#333333] relative overflow-hidden">
        <div className="absolute inset-0 bg-[#111111] z-0"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 z-0"></div>
        
        {/* Animated Icons Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Gamepad2 className="absolute top-[20%] left-[15%] size-32 text-primary/10 animate-float" />
          <Swords className="absolute top-[60%] left-[10%] size-40 text-primary/10 animate-float-reverse" />
          <Rocket className="absolute top-[30%] right-[20%] size-24 text-zinc-500/10 animate-float-fast" />
          <Target className="absolute bottom-[20%] right-[15%] size-36 text-primary/10 animate-float" />
        </div>

        <div className="z-10 max-w-2xl mx-auto w-full px-8">
          <Image 
            src="/logo.svg" 
            alt="Logo" 
            width={64} 
            height={64} 
            className="size-16 mb-8" 
          />
          <h1 className="text-5xl font-semibold tracking-tight mb-6">
            What should we build today?
          </h1>
          <p className="text-xl text-zinc-400 leading-relaxed mb-8">
            Build your own racers, shooters, puzzles and whole worlds using your own words. If you can describe it, you can play it.
          </p>
        </div>
      </div>

      {/* Right side: Sign Up Module (30%) */}
      <div className="w-full lg:w-[30%] flex items-center justify-center p-8 bg-[#1A1A1A]">
        <SignUp />
      </div>
    </div>
  )
}
