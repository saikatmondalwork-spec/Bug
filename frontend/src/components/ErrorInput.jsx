export default function ErrorInput({ value, onChange }) {
  return (
    <textarea
      id="error-input"
      className="w-full border border-gray-300 rounded-lg p-3 text-sm font-mono resize-none
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                 placeholder-gray-400 h-28 leading-relaxed"
      placeholder="e.g. IndexError: list index out of range"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      spellCheck={false}
      aria-label="Error message or stack trace"
    />
  )
}
