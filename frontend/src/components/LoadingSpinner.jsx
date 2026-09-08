export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3" role="status" aria-live="polite">
      <div className="w-7 h-7 border-[3px] border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      <p className="text-sm text-gray-500">Analyzing your code…</p>
    </div>
  )
}
