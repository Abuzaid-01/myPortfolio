import { useEffect, useRef, useState } from 'react'
import { pets } from '@/constants'
import { useOS } from '@/store/useOS'

// Standard oneko sprite layout coordinates (columns: 0..7, rows: 0..3)
// Position on 256x128 sprite sheet (each cell is 32x32px)
const SPRITE_SETS = {
  idle: [[3, 3]], // mati2
  alert: [[7, 3]], // awake
  scratchSelf: [
    [5, 0], // kaki2
    [6, 0], // kaki1
    [7, 0], // jare2
  ],
  scratchWallN: [
    [0, 0],
    [0, 1],
  ],
  scratchWallS: [
    [7, 1],
    [6, 2],
  ],
  scratchWallE: [
    [2, 2],
    [2, 3],
  ],
  scratchWallW: [
    [4, 0],
    [4, 1],
  ],
  tired: [[3, 2]], // mati3
  sleeping: [
    [2, 0], // sleep2
    [2, 1], // sleep1
  ],
  N: [
    [1, 2], // up2
    [1, 3], // up1
  ],
  NE: [
    [0, 2], // upright2
    [0, 3], // upright1
  ],
  E: [
    [3, 0], // right2
    [3, 1], // right1
  ],
  SE: [
    [5, 1], // dwright2
    [5, 2], // dwright1
  ],
  S: [
    [6, 3], // down2
    [7, 2], // down1
  ],
  SW: [
    [5, 3], // dwleft2
    [6, 1], // dwleft1
  ],
  W: [
    [4, 2], // left2
    [4, 3], // left1
  ],
  NW: [
    [1, 0], // upleft2
    [1, 1], // upleft1
  ],
}

export default function DesktopPet() {
  const petId = useOS((s) => s.petId)
  const petEnabled = useOS((s) => s.petEnabled)

  const activePet = pets.find((p) => p.id === petId)
  const spriteSrc = activePet?.sprite

  const petRef = useRef(null)
  const [hearts, setHearts] = useState([])
  const [zzz, setZzz] = useState([])

  // State refs for animation loop
  const pos = useRef({ x: 300, y: 300 })
  const mouse = useRef({ x: 300, y: 300 })
  const frameCount = useRef(0)
  const idleTime = useRef(0)
  const idleAnimation = useRef(null)
  const idleAnimationFrame = useRef(0)
  const isSleeping = useRef(false)
  const isDragging = useRef(false)

  // Track cursor position
  useEffect(() => {
    if (!petEnabled || !spriteSrc) return

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    const onTouch = (e) => {
      if (e.touches && e.touches[0]) {
        mouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('touchstart', onTouch, { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('touchstart', onTouch)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [petEnabled, spriteSrc])

  // Spawn Zzz bubbles when sleeping
  useEffect(() => {
    if (!petEnabled || !spriteSrc) return
    const zInterval = setInterval(() => {
      if (isSleeping.current && !isDragging.current) {
        setZzz((prev) => [
          ...prev.slice(-4),
          { id: Date.now() + Math.random(), x: pos.current.x + 18, y: pos.current.y - 6 },
        ])
      }
    }, 1400)
    return () => clearInterval(zInterval)
  }, [petEnabled, spriteSrc])

  // Animation frame loop
  useEffect(() => {
    if (!petEnabled || !spriteSrc) return

    let animId
    let lastTime = performance.now()
    const speed = 10 // pixels per frame

    const setSprite = (name, frame = 0) => {
      const set = SPRITE_SETS[name]
      if (!set || !set.length || !petRef.current) return
      const [col, row] = set[frame % set.length]
      petRef.current.style.backgroundPosition = `-${col * 32}px -${row * 32}px`
    }

    const loop = (now) => {
      animId = requestAnimationFrame(loop)

      // Throttle to ~10-12 FPS (approx 95ms per frame)
      if (now - lastTime < 95) return
      lastTime = now

      if (isDragging.current) return

      frameCount.current += 1
      const diffX = pos.current.x - mouse.current.x
      const diffY = pos.current.y - mouse.current.y
      const distance = Math.hypot(diffX, diffY)

      // Has pet reached the mouse cursor?
      if (distance < 32 || distance < speed) {
        idleTime.current += 1

        // Choose idle animation after a moment
        if (idleAnimation.current) {
          idleAnimationFrame.current += 1
          if (idleAnimationFrame.current > 10) {
            idleAnimation.current = null
            idleAnimationFrame.current = 0
          }
        } else {
          // Play random idle or go to sleep
          if (idleTime.current > 8 && Math.floor(Math.random() * 200) === 0) {
            const idleChoices = ['scratchSelf', 'tired']
            idleAnimation.current = idleChoices[Math.floor(Math.random() * idleChoices.length)]
            idleAnimationFrame.current = 0
          }
        }

        if (idleAnimation.current) {
          setSprite(idleAnimation.current, idleAnimationFrame.current)
          isSleeping.current = false
        } else if (idleTime.current > 24) {
          // Sleep after ~2.5 seconds of standing still
          setSprite('sleeping', Math.floor(frameCount.current / 4))
          isSleeping.current = true
        } else {
          setSprite('idle')
          isSleeping.current = false
        }

        return
      }

      // Cursor moved away!
      idleAnimation.current = null
      idleAnimationFrame.current = 0

      // If was sleeping, wake up with alert exclamation first
      if (idleTime.current > 1) {
        setSprite('alert')
        idleTime.current = Math.min(idleTime.current, 7) - 1
        isSleeping.current = false
        return
      }

      isSleeping.current = false

      // Move toward cursor
      let direction = ''
      diffY / distance > 0.5 && (direction += 'N')
      diffY / distance < -0.5 && (direction += 'S')
      diffX / distance > 0.5 && (direction += 'W')
      diffX / distance < -0.5 && (direction += 'E')

      if (!direction) direction = 'S'
      setSprite(direction, frameCount.current)

      pos.current.x -= (diffX / distance) * speed
      pos.current.y -= (diffY / distance) * speed

      // Clamp within desktop bounds (below menu bar, above dock)
      const maxX = Math.max(20, window.innerWidth - 44)
      const maxY = Math.max(50, window.innerHeight - 80)
      pos.current.x = Math.max(10, Math.min(maxX, pos.current.x))
      pos.current.y = Math.max(34, Math.min(maxY, pos.current.y))

      if (petRef.current) {
        petRef.current.style.transform = `translate3d(${pos.current.x - 16}px, ${pos.current.y - 16}px, 0)`
      }
    }

    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [petEnabled, spriteSrc])

  if (!petEnabled || !spriteSrc) return null

  // Pet interaction: click to pet & hearts
  const handlePetClick = (e) => {
    e.stopPropagation()
    const id = Date.now() + Math.random()
    setHearts((prev) => [...prev.slice(-3), { id, x: pos.current.x, y: pos.current.y - 20 }])
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id))
    }, 1200)

    // Little happy hop
    if (petRef.current) {
      petRef.current.animate(
        [
          { transform: `translate3d(${pos.current.x - 16}px, ${pos.current.y - 16}px, 0) scale(1)` },
          { transform: `translate3d(${pos.current.x - 16}px, ${pos.current.y - 36}px, 0) scale(1.15)` },
          { transform: `translate3d(${pos.current.x - 16}px, ${pos.current.y - 16}px, 0) scale(1)` },
        ],
        { duration: 320, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
      )
    }
  }

  // Pointer drag handling
  const onPointerDown = (e) => {
    isDragging.current = true
    const startX = e.clientX
    const startY = e.clientY
    const origX = pos.current.x
    const origY = pos.current.y

    const onPointerMove = (ev) => {
      pos.current.x = origX + (ev.clientX - startX)
      pos.current.y = origY + (ev.clientY - startY)
      if (petRef.current) {
        petRef.current.style.transform = `translate3d(${pos.current.x - 16}px, ${pos.current.y - 16}px, 0)`
      }
    }

    const onPointerUp = () => {
      isDragging.current = false
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[850] overflow-hidden select-none">
      {/* The Animated Pet Element */}
      <div
        ref={petRef}
        role="button"
        tabIndex={0}
        aria-label={`Desktop pet: ${activePet?.name}`}
        onClick={handlePetClick}
        onPointerDown={onPointerDown}
        className="pointer-events-auto absolute left-0 top-0 size-8 cursor-grab touch-none active:cursor-grabbing"
        style={{
          imageRendering: 'pixelated',
          backgroundImage: `url(${spriteSrc})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '-96px -96px', // initial idle pose
          transform: `translate3d(${pos.current.x - 16}px, ${pos.current.y - 16}px, 0)`,
        }}
      />

      {/* Floating Hearts when Petted */}
      {hearts.map((h) => (
        <span
          key={h.id}
          className="pointer-events-none absolute text-base font-bold text-rose-400 drop-shadow animate-bounce"
          style={{
            left: h.x,
            top: h.y,
            animation: 'floatUp 1.2s ease-out forwards',
          }}
        >
          ❤️
        </span>
      ))}

      {/* Floating Zzz when Sleeping */}
      {zzz.map((z) => (
        <span
          key={z.id}
          className="pointer-events-none absolute font-mono text-xs font-bold text-sky-300 drop-shadow"
          style={{
            left: z.x,
            top: z.y,
            animation: 'floatZzz 2s ease-out forwards',
          }}
        >
          Zzz…
        </span>
      ))}
    </div>
  )
}

