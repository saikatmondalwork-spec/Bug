import { RotateCw, WifiOff, ServerCrash } from 'lucide-react'

export default function ErrorBanner({ error, onRetry }) {
  if (!error) return null

  const isNetwork = error.toLowerCase().includes('reach') || error.toLowerCase().includes('connection')
  const Icon = isNetwork ? WifiOff : ServerCrash

  return (
    <div
      role="alert"
      className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 text-rose-200 space-y-3 shadow-lg"
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs sm:text-sm font-semibold text-rose-100 mb-0.5">
            Unable to analyze this bug
          </h4>
          <p className="text-xs text-rose-200/80 leading-relaxed font-mono">
            {error}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-rose-500/20 text-xs">
        <span className="text-[11px] text-rose-300/70">
          Verify your backend server is running on port 3001.
        </span>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-md shadow-sm transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Retry Analysis</span>
          </button>
        )}
      </div>
    </div>
  )
}
