import { useState, useRef, useEffect } from 'react'
import { Sparkles, ChevronDown, Check } from 'lucide-react'
import { EXAMPLES } from '../data/examples'

export default function ExamplePicker({ onSelect, currentExampleId }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close dropdown on outside click or Esc
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
          open
            ? 'bg-slate-800 border-indigo-500/50 text-slate-100 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
            : 'bg-[#0b0f19] border-slate-800 text-slate-300 hover:text-slate-100 hover:border-slate-700 hover:bg-slate-800/60'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <span>Try Example Bug</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180 text-indigo-400' : ''}`} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Built-in Example Bugs"
          className="absolute right-0 sm:left-0 sm:right-auto top-full mt-2 w-80 sm:w-96 bg-[#0f1422] border border-slate-800 rounded-xl shadow-2xl z-50 py-1.5 backdrop-blur-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-3 py-2 border-b border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Select Sample Bug
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {EXAMPLES.length} available
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/40 p-1">
            {EXAMPLES.map((ex) => {
              const isSelected = currentExampleId === ex.id
              const langColor =
                ex.language === 'Python'
                  ? 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                  : ex.language === 'JavaScript'
                  ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                  : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'

              return (
                <button
                  key={ex.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`w-full text-left p-2.5 rounded-lg transition-colors flex items-start gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-950/40 border border-indigo-500/30'
                      : 'hover:bg-slate-800/60 focus:bg-slate-800/60 focus:outline-none'
                  }`}
                  onClick={() => {
                    onSelect(ex)
                    setOpen(false)
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-semibold text-slate-200">
                        {ex.title}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${langColor}`}>
                        {ex.language}
                      </span>
                      {ex.category && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          · {ex.category}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-rose-300/80 font-mono truncate mb-0.5">
                      {ex.subtitle}
                    </p>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {ex.summary}
                    </p>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-1" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
