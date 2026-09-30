import { useState, useEffect } from 'react'
import { Cpu } from 'lucide-react'

const STAGES = [
  'Analyzing code & stack trace...',
  'Tracing root cause with AI...',
  'Generating fix & verified code...',
]

export default function LoadingSpinner() {
  const [stageIndex, setStageIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setStageIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev))
    }, 1200)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="space-y-4 py-4" role="status" aria-live="polite">
      {/* Loading banner */}
      <div className="flex items-center gap-3 p-3.5 rounded-lg bg-indigo-950/20 border border-indigo-500/30">
        <div className="relative flex items-center justify-center w-7 h-7 rounded-md bg-indigo-600/30 text-indigo-400">
          <Cpu className="w-4 h-4 animate-spin text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-100 flex items-center gap-2">
            <span>{STAGES[stageIndex]}</span>
          </p>
          <div className="w-full bg-slate-800 rounded-full h-1 mt-2 overflow-hidden">
            <div
              className="bg-indigo-500 h-1 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${((stageIndex + 1) / STAGES.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Shimmer skeleton cards mirroring the 3 result panels */}
      <div className="space-y-3">
        {/* Root Cause Skeleton */}
        <div className="p-3.5 rounded-lg border border-rose-500/20 bg-rose-950/10 space-y-2 animate-pulse">
          <div className="h-3 w-24 bg-rose-500/30 rounded" />
          <div className="h-4 w-5/6 bg-rose-500/20 rounded" />
          <div className="h-3 w-4/6 bg-rose-500/15 rounded" />
        </div>

        {/* Explanation Skeleton */}
        <div className="p-3.5 rounded-lg border border-sky-500/20 bg-sky-950/10 space-y-2 animate-pulse">
          <div className="h-3 w-28 bg-sky-500/30 rounded" />
          <div className="h-3.5 w-full bg-sky-500/20 rounded" />
          <div className="h-3.5 w-5/6 bg-sky-500/20 rounded" />
          <div className="h-3.5 w-3/4 bg-sky-500/15 rounded" />
        </div>

        {/* Code Block Skeleton */}
        <div className="p-3.5 rounded-lg border border-slate-800 bg-[#080c14] space-y-2 animate-pulse">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
            <div className="h-3 w-28 bg-slate-700 rounded" />
            <div className="h-5 w-16 bg-slate-800 rounded" />
          </div>
          <div className="h-3.5 w-full bg-slate-800/60 rounded" />
          <div className="h-3.5 w-4/5 bg-slate-800/50 rounded" />
          <div className="h-3.5 w-2/3 bg-slate-800/40 rounded" />
        </div>
      </div>
    </div>
  )
}
