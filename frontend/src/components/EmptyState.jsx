export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
      <div className="text-4xl mb-4 select-none" aria-hidden="true">🔍</div>
      <p className="text-gray-500 text-sm leading-relaxed">
        Paste an error message and code,<br />then click <strong className="text-gray-700">Analyze Bug</strong> to begin.
      </p>
    </div>
  )
}
