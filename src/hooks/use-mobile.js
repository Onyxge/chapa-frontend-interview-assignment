import * as React from "react"
// This hook checks if the current device is a mobile device based on the screen width.
// It uses a media query to determine if the screen width is less than the defined breakpoint.
// The breakpoint is set to 768 pixels, which is a common threshold for mobile devices.
// The hook returns a boolean indicating whether the device is mobile or not.
const MOBILE_BREAKPOINT = 768
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange);
  }, [])
  return !!isMobile
}
