import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches)
    }

    mql.addEventListener("change", onChange)

    // A media-query change is an external event. Deferring the first update
    // keeps the effect from forcing a second render during its own commit.
    const frame = window.requestAnimationFrame(() => setIsMobile(mql.matches))

    return () => {
      window.cancelAnimationFrame(frame)
      mql.removeEventListener("change", onChange)
    }
  }, [])

  return isMobile
}
