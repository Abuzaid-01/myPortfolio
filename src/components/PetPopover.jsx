import { Check, Sparkles } from 'lucide-react'
import { pets } from '@/constants'
import { useOS } from '@/store/useOS'

export default function PetPopover({ onClose }) {
  const petId = useOS((s) => s.petId)
  const petEnabled = useOS((s) => s.petEnabled)
  const setPet = useOS((s) => s.setPet)
  const togglePet = useOS((s) => s.togglePet)

  const activePet = pets.find((p) => p.id === petId) ?? pets[0]

  return (
    <div
      role="dialog"
      aria-label="Desktop Pet settings"
      className="glass-menu menu-in absolute right-0 top-[calc(100%+6px)] z-[1100] w-80 select-none rounded-2xl border border-white/15 p-3.5 text-white shadow-2xl backdrop-blur-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-sm shadow-sm">
            🐾
          </div>
          <div>
            <div className="text-xs font-bold leading-tight text-white">Desktop Companion</div>
            <div className="text-[10.5px] text-white/50">
              {petEnabled ? `Active: ${activePet.name}` : 'Pet is resting (Off)'}
            </div>
          </div>
        </div>

        {/* Toggle On/Off Switch */}
        <button
          type="button"
          onClick={togglePet}
          aria-label={petEnabled ? 'Turn pet off' : 'Turn pet on'}
          className={`relative h-5 w-9 rounded-full transition-colors ${
            petEnabled ? 'bg-emerald-500' : 'bg-white/20'
          }`}
        >
          <span
            className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-transform ${
              petEnabled ? 'left-4.5' : 'left-0.5'
            }`}
          />
        </button>
      </div>

      {/* Pet Selection List */}
      <div className="mt-2.5 space-y-1.5">
        <div className="px-1 text-[10px] font-semibold uppercase tracking-wider text-white/40">
          Choose Character
        </div>

        <div className="grid grid-cols-1 gap-1">
          {pets.map((p) => {
            const isSelected = p.id === petId && petEnabled
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setPet(p.id)
                  if (onClose && p.id === 'none') onClose()
                }}
                className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition ${
                  isSelected
                    ? 'border border-white/20 bg-white/15 shadow-sm'
                    : 'border border-transparent bg-white/[0.03] hover:bg-white/[0.08]'
                }`}
              >
                <div
                  className={`grid size-9 shrink-0 place-items-center rounded-lg text-lg ${
                    isSelected ? 'bg-white/20' : 'bg-white/[0.06]'
                  }`}
                >
                  {p.emoji}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-white">{p.name}</span>
                    {p.id === 'dog' && (
                      <span className="rounded bg-amber-500/20 px-1 py-0.2 text-[9px] font-medium text-amber-300">
                        Original
                      </span>
                    )}
                  </div>
                  <p className="truncate text-[10.5px] text-white/50">{p.desc}</p>
                </div>

                {isSelected && (
                  <div className="grid size-5 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
                    <Check size={11} strokeWidth={3} />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Helpful tip */}
      <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[10.5px] text-white/60">
        <Sparkles size={12} className="shrink-0 text-amber-400" />
        <span>Click or tap your pet on the desktop to play with it!</span>
      </div>
    </div>
  )
}

