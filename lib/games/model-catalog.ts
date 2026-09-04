export type GameModelId = "claude-haiku-4-5-20251001" | "claude-sonnet-5" | "claude-opus-5" | "claude-fable-5-1"

export const GAME_MODELS: { id: GameModelId; name: string; tagline: string }[] = [
  {
    id: "claude-haiku-4-5-20251001",
    name: "Claude Haiku",
    tagline: "Fastest and cheapest conversational model",
  },
  {
    id: "claude-fable-5-1",
    name: "Claude Fable",
    tagline: "New fast and efficient conversational model",
  },
  {
    id: "claude-sonnet-5",
    name: "Claude Sonnet",
    tagline: "Balanced reasoning model",
  },
  {
    id: "claude-opus-5",
    name: "Claude Opus",
    tagline: "Most powerful model",
  },
]
