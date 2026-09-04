import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { listGames } from "@/lib/games/queries"

import React from "react"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const games = await listGames()

  return (
    <SidebarProvider>
      <AppSidebar games={games} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
