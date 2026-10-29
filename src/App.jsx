import { useEffect, useState } from 'react'
import Wallpaper from '@/components/Wallpaper'
import Hero from '@/components/Hero'
import MenuBar from '@/components/MenuBar'
import Dock from '@/components/Dock'
import Window from '@/components/Window'
import DesktopIcons from '@/components/DesktopIcons'
import Notifications from '@/components/Notifications'
import ContextMenu from '@/components/ContextMenu'
import Spotlight from '@/components/Spotlight'
import LockScreen from '@/components/LockScreen'
import Boot from '@/components/Boot'
import DesktopPet from '@/components/DesktopPet'
import { windowConfig } from '@/constants'
import { useOS } from '@/store/useOS'
import { hasHover, MOD } from '@/lib/platform'
import { hasBooted, markBooted, markWelcomed, wasWelcomed } from '@/lib/session'

// everything that lives on the desktop (mounted once boot reveals it)
function Desktop() {
  const notify = useOS((s) => s.notify)

  // one welcome toast per session
  useEffect(() => {
    if (wasWelcomed()) return
    const t = setTimeout(() => {
      markWelcomed()
      notify({
        emoji: '👋',
        title: 'Welcome to my portfolio',
        body: hasHover() ? `Press ${MOD} K to search anything, or explore the dock.` : 'Tap the icons in the dock to explore.',
      })
    }, 2600)
    return () => clearTimeout(t)
  }, [notify])

  return (
    <>
      <Hero />
      <DesktopPet />
      <DesktopIcons />
      {Object.keys(windowConfig).map((id) => (
        <Window key={id} id={id} />
      ))}
      <MenuBar />
      <Dock />
      <Notifications />
    </>
  )
}

export default function App() {
  const [booted] = useState(hasBooted) // returning visitors skip the intro
  const [desktop, setDesktop] = useState(booted)
  const [bootVisible, setBootVisible] = useState(!booted)

  // global shortcuts: ⌘/Ctrl+K and "/" open Spotlight
  useEffect(() => {
    const onKey = (e) => {
      const { locked, toggleSpotlight, openSpotlight } = useOS.getState()
      if (locked || !desktop) return
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        toggleSpotlight()
      } else if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const t = e.target
        const typing = t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))
        if (typing) return
        e.preventDefault()
        openSpotlight()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [desktop])

  return (
    <main id="desktop" className="relative h-full w-full select-none overflow-hidden">
      <Wallpaper />
      {desktop && <Desktop />}
      <ContextMenu />
      <Spotlight />
      <LockScreen />
      {bootVisible && (
        <Boot
          onReveal={() => setDesktop(true)}
          onDone={() => {
            markBooted()
            setBootVisible(false)
          }}
        />
      )}
    </main>
  )
}
